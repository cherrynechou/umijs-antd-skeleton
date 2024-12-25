import { FC, useState } from 'react';
import { UploadImage } from '@/components';
import { CreateOrEditProps } from '@/interfaces/modal';
import { ITreeOption } from '@/interfaces/tree';
import { useIntl, FormattedMessage } from '@umijs/max';
import { queryAllPermissions } from '@/services/admin/auth/PermissionController';
import { queryAllRoles } from '@/services/admin/auth/RoleController';
import { createUser, getUser, updateUser } from '@/services/admin/auth/UserController';
import { filterTreeLeafNode, listToTree } from '@/utils/utils';
import { useAsyncEffect } from 'ahooks';
import { Form, Input, App, Modal, Select, Skeleton, Tree } from 'antd';
import type { TreeProps } from 'antd/es/tree';
import type { UploadFile } from 'antd/es/upload/interface';
import { AxiosResponse, HttpStatusCode } from 'axios';
import { pick } from 'lodash-es';

//默认类型
const defaultOptionKeys: ITreeOption = {
  idKey: 'id',
  childrenKey: 'children',
  nameKey: 'name',
  parentIdKey: 'parent_id',
  rootValue: 0,
};

const CreateOrEdit: FC<CreateOrEditProps> = (props: any) => {
  const [initialValues, setInitialValues] = useState<any>({});
  const [roles, setRoles] = useState<any>([]);
  const [avatarFileList, setAvatarFileList] = useState<UploadFile[]>([]);
  const [treeData, setTreeData] = useState<any>([]);
  const [treeLeafRecord, setTreeLeafRecord] = useState<any>([]);
  const [defaultCheckedKeys, setDefaultCheckedKeys] = useState<any>([]);
  const [userRoles, setUserRoles] = useState<any>([]);

  const { isModalVisible, isShowModal, editId, actionRef } = props;

  const [form] = Form.useForm();
  const { message} = App.useApp();

  const intl = useIntl();

  const title = editId === undefined ?
    intl.formatMessage({ id: 'modal.createOrUpdateForm.create.title', defaultMessage: '添加' }) :
    intl.formatMessage({ id: 'modal.createOrUpdateForm.edit.title', defaultMessage: '编辑' });

  const fetchApi = async () => {
    const roleRes = await queryAllRoles();
    if (roleRes.status === HttpStatusCode.Ok) {
      const _roleData = roleRes.data;
      const _roleList: any[] = [];
      _roleData.forEach((item: any) => {
        _roleList.push({ label: item.name, value: item.id });
      });
      setRoles(_roleList);
    }

    const permissionAllRes: AxiosResponse = await queryAllPermissions();
    if (permissionAllRes.status === HttpStatusCode.Ok) {
      const _permissionData = permissionAllRes.data;
      const listTreePermissionData = listToTree(_permissionData, defaultOptionKeys);
      setTreeData(listTreePermissionData);
      console.log(listTreePermissionData)
      setTreeLeafRecord(filterTreeLeafNode(listTreePermissionData));
    }

    if (editId !== undefined) {
      const userRes: AxiosResponse = await getUser(editId);
      if (userRes.status === HttpStatusCode.Ok) {
        const currentData = userRes.data;

        const roleList: any[] = [];
        currentData.roles.forEach((item: any) => {
          roleList.push(item.id);
        });

        setAvatarFileList([
          {
            uid: currentData.id,
            name: '',
            status: 'done',
            url: currentData.avatar_url,
          },
        ]);

        let _permissionList: any[] = [];
        if (currentData.permissions.length > 0) {
          _permissionList = currentData.permissions.map((item: any) => {
            return item.id;
          });
        }

        let _roleList: any[] = [];
        if (currentData.roles.length > 0) {
          _roleList = currentData.roles.map((item: any) => {
            return item.slug;
          });
          setUserRoles(_roleList);
        }

        setDefaultCheckedKeys(_permissionList);

        setInitialValues({
          username: currentData.username,
          name: currentData.name,
          avatar: currentData.avatar,
          roles: roleList,
          permissions: JSON.stringify(_permissionList),
        });
      }
    }
  };

  useAsyncEffect(async () => {
    await fetchApi();
  }, []);

  /**
   * 处理回调
   * @param fileList
   */
  const handleAvatarImageChange = (fileList: any) => {
    form.setFieldsValue({
      avatar: fileList.length === 0 ? '' : fileList.pop(),
    });
  };

  /**
   * 提交
   */
  const handleOk = async () => {
    const fieldsValue = await form.validateFields();

    //去掉 confirm
    const fieldsPostValue = pick(fieldsValue, ['name', 'username', 'avatar', 'roles', 'password', 'permissions']);

    let response: AxiosResponse;
    if (editId === undefined) {
      response = await createUser(fieldsPostValue);
    } else {
      response = await updateUser(editId, fieldsPostValue);
    }

    if (response.status === HttpStatusCode.Ok) {
      isShowModal(false);

      const defaultUpdateSuccessMessage = intl.formatMessage({
        id: 'pages.update.success',
        defaultMessage: '更新成功！',
      });

      message.success(defaultUpdateSuccessMessage);
      actionRef.current.reload();
    }
  };

  const onSelect: TreeProps['onSelect'] = (selectedKeys) => {
    //找出叶子节点
    const filterChildNodes = treeLeafRecord.map((item: any) => {
      return item.id;
    });
    const filterSameKeys = filterChildNodes.filter((item: any) => selectedKeys.indexOf(item) > -1);
    form.setFieldsValue({ permissions: JSON.stringify(filterSameKeys) });
  };

  const onCheck: TreeProps['onCheck'] = (checkedKeys) => {
    // @ts-ignore
    const checkedKeysResult = [...checkedKeys];
    //找出叶子节点
    const filterChildNodes = treeLeafRecord.map((item: any) => {
      return item.id;
    });
    const filterSameKeys = filterChildNodes.filter((item: any) => checkedKeysResult?.indexOf(item) > -1);
    form.setFieldsValue({ permissions: JSON.stringify(filterSameKeys) });
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
      {
        Object.keys(initialValues).length === 0 && editId !== undefined ? (<Skeleton paragraph={{ rows: 4 }} />
      ) : (
        <Form form={form} initialValues={initialValues} autoComplete="off">
          <Form.Item
            name="username"
            label={
              intl.formatMessage({id: 'modal.createOrUpdateForm.username'})
            }
            labelCol={{ span: 4 }}
            rules={[
              {
                required: true,
                message: (
                  <FormattedMessage
                    id='validator.admin.username.required'
                    defaultMessage='用户名是必填项！'
                  />
                )
              }
            ]}
          >
            <Input placeholder={
                intl.formatMessage({ id: 'pages.admin.username.placeholder', defaultMessage: '请输入 用户名', })
              }
            />
          </Form.Item>

          <Form.Item
            name="name"
            label={
              intl.formatMessage({id: 'modal.createOrUpdateForm.name'})
            }
            labelCol={{ span: 4 }}
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
            <Input placeholder={
                intl.formatMessage({ id: 'pages.admin.name.placeholder', defaultMessage: '请输入 名称', })
              }
            />
          </Form.Item>

          <Form.Item name="avatar" hidden>
            <Input hidden />
          </Form.Item>

          {/*头像*/}
          <Form.Item
            label={
              intl.formatMessage({id: 'modal.createOrUpdateForm.avatar'})
            }
            labelCol={{ span: 4 }}
          >
            <UploadImage
              accept="image/*"
              listType="picture-card"
              fileList={avatarFileList}
              maxCount={1}
              onUploadChange={handleAvatarImageChange}
            />
          </Form.Item>

          {/*添加*/}
          {editId === undefined && (
            <>
              <Form.Item
                name="password"
                label={
                  intl.formatMessage({id: 'modal.createOrUpdateForm.password'})
                }
                labelCol={{ span: 4 }}
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id='validator.admin.password.required'
                        defaultMessage='密码不能为空！'
                      />
                    ),
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (value.length >= 6) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error( intl.formatMessage({id: 'message.password.length.failure'})));
                    },
                  }),
                ]}
                hasFeedback
              >
                <Input.Password placeholder={
                    intl.formatMessage({id: 'pages.admin.password.placeholder'})
                  }
                />
              </Form.Item>

              <Form.Item
                name="confirm"
                label={
                  intl.formatMessage({id: 'modal.createOrUpdateForm.password.confirm'})
                }
                labelCol={{ span: 4 }}
                dependencies={['password']}
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id='validator.admin.password.confirm.required'
                        defaultMessage='请确认你的密码！'
                      />
                    ),
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error(intl.formatMessage({id: 'message.password.not.match'})));
                    },
                  }),
                ]}
              >
                <Input.Password placeholder={
                  intl.formatMessage({id: 'pages.admin.password.confirm.placeholder'})
                }/>
              </Form.Item>
            </>
          )}

          {/*编辑*/}
          {editId !== undefined && (
            <>
              <Form.Item
                name="password"
                label={
                  intl.formatMessage({id: 'modal.createOrUpdateForm.password'})
                }
                labelCol={{ span: 4 }}
                hasFeedback
              >
                <Input.Password placeholder={
                  intl.formatMessage({id: 'pages.admin.password.placeholder'})
                }/>
              </Form.Item>

              <Form.Item
                name="confirm"
                label={
                  intl.formatMessage({id: 'modal.createOrUpdateForm.password.confirm'})
                }
                labelCol={{ span: 4 }}
                dependencies={['password']}
                hasFeedback
                rules={[
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error(intl.formatMessage({id: 'message.password.not.match'})));
                    },
                  }),
                ]}
              >
                <Input.Password placeholder={
                    intl.formatMessage({id: 'pages.admin.password.confirm.placeholder'})
                  }
                />
              </Form.Item>
            </>
          )}

          <Form.Item
            name="roles"
            label={
              intl.formatMessage({id: 'modal.createOrUpdateForm.role'})
            }
            labelCol={{ span: 4 }}
            rules={[
              {
                required: true,
                message: (
                  <FormattedMessage
                    id='validator.admin.role.required'
                    defaultMessage='角色是必填项！'
                  />
                )
              }
            ]}
          >
            <Select
              mode="multiple"
              options={roles}
              placeholder={
                intl.formatMessage({id: 'pages.admin.role.placeholder'})
              }
            />
          </Form.Item>

          {!userRoles.includes('administrator') && (
            <>
              <Form.Item name="permissions" hidden>
                <Input hidden />
              </Form.Item>
              <Form.Item
                label={
                  intl.formatMessage({id: 'modal.createOrUpdateForm.permission'})
                }
                labelCol={{ span: 4 }}
              >
                <Tree
                  checkable
                  defaultExpandAll={false}
                  defaultCheckedKeys={defaultCheckedKeys}
                  onSelect={onSelect}
                  onCheck={onCheck}
                  treeData={treeData}
                />
              </Form.Item>
            </>
          )}
        </Form>
      )}
    </Modal>
  );
};

export default CreateOrEdit;
