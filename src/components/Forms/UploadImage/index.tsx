import { FC, useState } from 'react';
import { uploadImageFile } from '@/services/admin/system/CommonController';
import { FormattedMessage } from '@umijs/max';
import { PlusOutlined } from '@ant-design/icons';
import { useAsyncEffect } from 'ahooks';
import { App, Modal, Upload } from 'antd';
import type { RcFile, UploadProps } from 'antd/es/upload';
import type { UploadFile } from 'antd/es/upload/interface';
import { cloneDeep, map } from 'lodash-es';
import { nanoid } from 'nanoid';
import { HttpStatusCode } from 'axios';



export interface UploadImageProps {
  accept: string;
  listType: string;
  maxCount: number;
  fileList?: UploadFile[];
  maxSize?: number;
  onUploadChange: (file: UploadFile[]) => void;
}

let _uploadFileList: any[] = [];
const UploadImage: FC<UploadImageProps> = (props: any) => {
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [uploadFileList, setUploadFileList] = useState<UploadFile[]>([]);
  const { accept, listType, maxCount, onUploadChange, fileList, maxSize } = props;

  const { message } = App.useApp();

  useAsyncEffect(async () => {
    setUploadFileList(cloneDeep(fileList));
    _uploadFileList = cloneDeep(fileList);
  }, []);

  const getBase64 = (file: RcFile): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
  };

  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => setUploadFileList(newFileList);

  const handleCancel = () => setPreviewOpen(false);

  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>
        <FormattedMessage id='component.upload.addFile' />
      </div>
    </button>
  );

  /**
   * 处理文件
   * @param file
   */
  const handleBeforeUpload = async (file: any) => {
    const allowFormat = file.type === 'image/jpeg' || file.type === 'image/png';

    if (!allowFormat) {
      message.error('只允许 JPG/PNG 文件!', 1000);
      return false;
    }

    const isLimit = file.size / 1024 < maxSize;

    if (maxSize && !isLimit) {
      message.error(`文件上传需要小于 ${file.size / 1024}KB!`);
      return false;
    }
  };

  /**
   * 处理文件上传
   * @param options
   */
  const handleCustomUpload = async (options: any) => {
    const { file, onProgress } = options;
    onProgress({ percent: 50 });

    getBase64(file).then((r: any) => {
      const index = r.indexOf('base64');
      const fileData = r.substring(index + 7);

      let fileExtension: string = '';
      if (file.type === 'image/jpeg') {
        fileExtension = 'jpg';
      } else if (file.type === 'image/png') {
        fileExtension = 'png';
      }

      const formData = {
        extension: fileExtension,
        fileData: fileData,
      };

      uploadImageFile(formData).then((response: any) => {
        if (response.status === HttpStatusCode.Ok) {
          const uuid: string = nanoid();

          setUploadFileList([
            ...uploadFileList.filter((item) => item.status === 'done'),
            {
              uid: uuid,
              name: response.data.path,
              status: 'done',
              url: response.data.remotePath,
            } as UploadFile,
          ]);

          _uploadFileList.push(response.data.path);
          onUploadChange(_uploadFileList);

          message.success('上传成功');
        }
      });
    });
  };

  /**
   * 删除
   * @param file
   */
  const handleRemove = (file: any) => {
    const _resultFileList = uploadFileList.filter((item) => item.uid !== file.uid);
    onUploadChange(map(_resultFileList, 'name'));
  };

  return (
    <>
      <Upload
        accept={accept}
        listType={listType}
        fileList={uploadFileList}
        customRequest={handleCustomUpload}
        beforeUpload={handleBeforeUpload}
        onPreview={handlePreview}
        onChange={handleChange}
        onRemove={handleRemove}
      >
        {uploadFileList.length >= maxCount ? null : uploadButton}
      </Upload>
      <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </>
  );
};

export default UploadImage;
