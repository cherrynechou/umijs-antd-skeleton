import { CreateOrEditProps } from '@/interfaces/modal';
import {
  createPermission,
  queryAllPermissionRoutes,
  queryPermission,
  updatePermission,
} from '@/services/admin/auth/PermissionController';
import { treeToOrderList } from '@/utils/utils';
import { useAsyncEffect } from 'ahooks';
import { Form, Input, Modal, Select, Skeleton, message } from 'antd';
import { AxiosResponse } from 'axios';
import { FC, useState } from 'react';

const CreateOrEdit: FC<CreateOrEditProps> = (props: any) => {
  const [initialValues, setInitialValues] = useState<any>({});
  const [treeData, setTreeData] = useState<any>([]);
  const [httpMethods, setHttpMethods] = useState<any>([]);
  const [httpPaths, setHttpPaths] = useState<any>([]);

  const [form] = Form.useForm();

  const { isModalVisible, isShowModal, permissionTreeData, editId, actionRef } = props;

  const title = editId === undefined ? '添加' : '编辑';

  const fetchApi = async () => {
    setTreeData(treeToOrderList(permissionTreeData));

    const allMethods: any[] = [
      { label: 'GET', value: 'GET' },
      { label: 'POST', value: 'POST' },
      { label: 'PUT', value: 'PUT' },
      { label: 'DELETE', value: 'DELETE' },
      { label: 'PATCH', value: 'PATCH' },
      { label: 'OPTIONS', value: 'OPTIONS' },
      { label: 'HEAD', value: 'HEAD' },
    ];
    setHttpMethods(allMethods);

    const pathsRes: AxiosResponse = await queryAllPermissionRoutes();
    if (pathsRes.status === 200) {
      const _pathData = pathsRes.data;
      const _pathValues: any[] = [];
      for (const key in _pathData) {
        if (_pathData.hasOwnProperty(key)) {
          _pathValues.push({
            label: _pathData[key],
            value: _pathData[key],
          });
        }
      }
      setHttpPaths(_pathValues);
    }

    if (editId !== undefined) {
      const permissionRes = await queryPermission(editId);
      if (permissionRes.status === 200) {
        const currentData = permissionRes.data;
        let methods: any[] = [];
        if (!currentData.methods.includes('ANY')) {
          methods = currentData.methods;
        }

        setInitialValues({
          parent_id: currentData.parent_id,
          name: currentData.name,
          slug: currentData.slug,
          http_method: methods,
          http_path: currentData.paths,
        });
      }
    }
  };

  useAsyncEffect(async () => {
    await fetchApi();
  }, []);

  const handleOk = async () => {
    const fieldsValue = await form.validateFields();

    let response: AxiosResponse;
    if (editId === undefined) {
      response = await createPermission(fieldsValue);
    } else {
      response = await updatePermission(editId, fieldsValue);
    }

    if (response.status === 200) {
      isShowModal(false);
      actionRef.current.reload();
      message.success(`${title}成功`);
    }
  };

  return (
    <Modal
      title={title}
      open={isModalVisible}
      onOk={handleOk}
      onCancel={() => isShowModal(false)}
      destroyOnClose
      width={750}
    >
      {Object.keys(initialValues).length === 0 && editId !== undefined ? (
        <Skeleton paragraph={{ rows: 4 }} />
      ) : (
        <Form name="role-create" form={form} initialValues={initialValues} autoComplete="off">
          <Form.Item
            name="parent_id"
            label="父级"
            labelCol={{ span: 3 }}
            rules={[{ required: true, message: '父级是必填项！' }]}
          >
            <Select options={treeData} style={{ width: 400 }} placeholder="请选择父级" />
          </Form.Item>

          <Form.Item
            name="name"
            label="名称"
            labelCol={{ span: 3 }}
            rules={[{ required: true, message: '名称是必填项！' }]}
          >
            <Input placeholder="请输入 名称" />
          </Form.Item>

          <Form.Item
            name="slug"
            label="标识"
            labelCol={{ span: 3 }}
            rules={[{ required: true, message: '标识是必填项！' }]}
          >
            <Input placeholder="请输入 标识" />
          </Form.Item>

          <Form.Item name="http_method" label="HTTP方法" labelCol={{ span: 3 }}>
            <Select mode="multiple" options={httpMethods} style={{ width: 600 }} placeholder="http方法" />
          </Form.Item>

          <Form.Item name="http_path" label="HTTP路径" labelCol={{ span: 3 }}>
            <Select mode="multiple" options={httpPaths} style={{ width: 400 }} placeholder="输入http路径" />
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
};

export default CreateOrEdit;
