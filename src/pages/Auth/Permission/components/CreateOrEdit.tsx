import { FC, useState } from 'react';
import { CreateOrEditProps } from '@/interfaces/modal';
import {
  createPermission,
  queryAllPermissionRoutes,
  queryPermission,
  updatePermission,
} from '@/services/admin/auth/PermissionController';
import { treeToOrderList } from '@/utils/utils';
import { useAsyncEffect } from 'ahooks';
import { Form, Input, Modal, Select, Skeleton,App } from 'antd';
import { AxiosResponse, HttpStatusCode } from 'axios';
import { FormattedMessage, useIntl } from '@umijs/max';

const CreateOrEdit: FC<CreateOrEditProps> = (props: any) => {
  const [initialValues, setInitialValues] = useState<any>({});
  const [treeData, setTreeData] = useState<any>([]);
  const [httpMethods, setHttpMethods] = useState<any>([]);
  const [httpPaths, setHttpPaths] = useState<any>([]);

  const [ form] = Form.useForm();

  const { isModalVisible, isShowModal, permissionTreeData, editId, actionRef } = props;

  const { message } = App.useApp();

  const intl = useIntl();

  const title = editId === undefined ?
    intl.formatMessage({ id: 'modal.createOrUpdateForm.create.title', defaultMessage: '添加' }) :
    intl.formatMessage({ id: 'modal.createOrUpdateForm.edit.title', defaultMessage: '编辑' });

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
    if (pathsRes.status === HttpStatusCode.Ok) {
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
      if (permissionRes.status === HttpStatusCode.Ok) {
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

    if (response.status === HttpStatusCode.Ok) {
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
      {Object.keys(initialValues).length === 0 && editId !== undefined ? (<Skeleton paragraph={{ rows: 4 }} />) : (
        <Form name="role-create" form={form} initialValues={initialValues} autoComplete="off">
          <Form.Item
            name="parent_id"
            label={
              intl.formatMessage({id: 'modal.createOrUpdateForm.parent'})
            }
            labelCol={{ span: 3 }}
            rules={[
              {
                required: true,
                message: (
                  <FormattedMessage
                    id='validator.admin.parent.required'
                    defaultMessage='角色是必填项！'
                  />
                )
              }
            ]}
          >
            <Select
              options={treeData}
              style={{ width: 400 }}
              placeholder={intl.formatMessage({id: 'modal.createOrUpdateForm.parent.placeholder'})}
            />
          </Form.Item>

          <Form.Item
            name="name"
            label={
              intl.formatMessage({id: 'modal.createOrUpdateForm.name'})
            }
            labelCol={{ span: 3 }}
            rules={[
              {
                required: true,
                message: (
                  <FormattedMessage
                    id='validator.admin.name.required'
                    defaultMessage='名称是必填项！'
                  />
                )
              }
            ]}
          >
            <Input
              placeholder={
                intl.formatMessage({id: 'modal.createOrUpdateForm.name.placeholder'})
              }
            />
          </Form.Item>

          <Form.Item
            name="slug"
            label={
              intl.formatMessage({id: 'modal.createOrUpdateForm.slug'})
            }
            labelCol={{ span: 3 }}
            rules={[
              {
                required: true,
                message: (
                  <FormattedMessage
                    id='validator.admin.slug.required'
                    defaultMessage='标识是必填项！'
                  />
                )
              }
            ]}
          >
            <Input placeholder={
             intl.formatMessage({id: 'modal.createOrUpdateForm.slug.placeholder'})
            }/>
          </Form.Item>

          <Form.Item
            name="http_method"
            label={
              intl.formatMessage({id: 'modal.createOrUpdateForm.httpMethod'})
            }
            labelCol={{ span: 3 }}>
            <Select
              mode="multiple"
              options={httpMethods}
              style={{ width: 600 }}
              placeholder={
                intl.formatMessage({id: 'modal.createOrUpdateForm.httpMethod.placeholder'})
              }
            />
          </Form.Item>

          <Form.Item
            name="http_path"
            label={
              intl.formatMessage({id: 'modal.createOrUpdateForm.httpPath'})
            }
            labelCol={{ span: 3 }}
          >
            <Select
              mode="multiple"
              options={httpPaths}
              style={{ width: 400 }}
              placeholder={
                intl.formatMessage({id: 'modal.createOrUpdateForm.httpPath.placeholder'})
              }
            />
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
};

export default CreateOrEdit;
