import { FC,  useState } from 'react';
import { Modal, Skeleton } from 'antd';
import {
  ProForm,
  ProFormText
} from '@ant-design/pro-components';
import { useAsyncEffect } from 'ahooks';
import { CreateOrEditProps } from '@/interface/modal';


const CreateOrEdit: FC<CreateOrEditProps> = ( props: any ) =>{

  const { isModalVisible, isShowModal, editId, menuData } = props;
  const [ initialValues, setInitialValues ] = useState<any>({});

  const title = editId === undefined ? '添加' : '编辑';

  const fetchApi = async () =>{

  }


  useAsyncEffect(async() => {
    await fetchApi();
  },[])

  const handleOk = async () =>{

  }


  return (
    <Modal
      title={title}
      open={isModalVisible}
      onOk={handleOk}
      onCancel={() => isShowModal(false)}
      destroyOnClose
      width={750}
    >
      {
        Object.keys(initialValues).length === 0 && editId !== undefined ? <Skeleton paragraph={{ rows: 4 }} /> :
          <ProForm
            submitter={{
              // 配置按钮的属性
              resetButtonProps: {
                style: {
                  // 隐藏重置按钮
                  display: 'none',
                },
              },
              submitButtonProps:{
                style: {
                  // 隐藏提交按钮
                  display: 'none',
                },
              }
            }}
            onFinish={async (values) => console.log(values)}
          >
            <ProFormText
              width="md"
              name="name"
              label="签约客户名称"
              tooltip="最长为 24 位"
              placeholder="请输入名称"
            />
          </ProForm>
      }
    </Modal>
  )
}


export default CreateOrEdit;