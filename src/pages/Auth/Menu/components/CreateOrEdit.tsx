import { FC, useState } from 'react';
import { SelectIcon } from '@/components';
import { useAsyncEffect } from 'ahooks';
import { createMenu, getMenu, updateMenu } from '@/services/admin/auth/MenuController';
import { queryAllRoles } from '@/services/admin/auth/RoleController';
import { queryListMaxValue, treeToOrderList } from '@/utils/utils';
import { useIntl,FormattedMessage } from '@umijs/max';
import { App, Form, Input, InputNumber, Modal, Select, Skeleton, Switch } from 'antd';
import { AxiosResponse, HttpStatusCode } from 'axios';
import { routeList } from './routeListData';


export type menuModalProps = {
  isModalVisible: boolean;
  isShowModal: (show: boolean, id?: number | undefined) => void;
  editId: number;
  menuData: any[];
  status?: number;
  actionRef: any;
};

const CreateOrEdit: FC<menuModalProps> = (props: any) => {
  const [treeData, setTreeData] = useState<any>([]);
  const [initialValues, setInitialValues] = useState<any>({});
  const [linkTarget, setLinkTarget] = useState<any>([]);
  const { isModalVisible, isShowModal, editId, menuData } = props;
  const [roles, setRoles] = useState<any>([]);
  const [routes, setRoutes] = useState<any>([]);

  const [form] = Form.useForm();
  const { message } = App.useApp();

  const intl = useIntl();

  const title = editId === undefined ?
    intl.formatMessage({ id: 'modal.createOrUpdateForm.create.title', defaultMessage: '添加' }) :
    intl.formatMessage({ id: 'modal.createOrUpdateForm.edit.title', defaultMessage: '编辑' });

  const fetchApi = async () => {

    //生成树型结构
    const rootName = intl.formatMessage({ id: 'modal.createOrUpdateForm.root'})

    const treeValues = treeToOrderList(menuData,rootName);

    setTreeData(treeValues);

    const targets = [
      {
        label: intl.formatMessage({ id: 'modal.createOrUpdateForm.target.blank', defaultMessage: '新窗口'}),
        value: '_blank'
      },
      {
        label: intl.formatMessage({ id: 'modal.createOrUpdateForm.target.current', defaultMessage: '当前窗口'}),
        value: ''
      },
    ];

    setLinkTarget(targets);

    //生成路由列表
    if (routeList.length > 0) {
      const _routeList: any[] = [];
      routeList.forEach((item: string) => {
        _routeList.push({
          label: item,
          value: item,
        });
      });
      setRoutes(_routeList);
    }

    //角色列表
    //获取角色列表
    const rolesRes = await queryAllRoles();
    if (rolesRes.status === HttpStatusCode.Ok) {
      const _rolesData = rolesRes.data;
      const _rolesValue: any[] = [];
      _rolesData.forEach((item: any) => {
        _rolesValue.push({ value: item.id, label: item.name });
      });
      setRoles(_rolesValue);
    }

    if (editId !== undefined) {
      const menuRes: AxiosResponse = await getMenu(editId);
      if (menuRes.status === HttpStatusCode.Ok) {
        const currentData = menuRes.data;
        let rolesValue: any[] = [];
        if (currentData.roles.length > 0) {
          rolesValue = currentData.roles.map((item: any) => {
            return item.id;
          });
        }

        setInitialValues({
          name: currentData.name,
          key:currentData.key,
          locale: currentData.locale,
          parent_id: currentData.parent_id,
          icon: currentData.icon,
          path: currentData.path,
          target: currentData.target,
          order: currentData.order,
          roles: rolesValue,
          status: currentData.status,
        });
      }
    } else {
      const sort_max = queryListMaxValue(treeValues, 'order');
      form.setFieldsValue({
        order: sort_max + 1,
        status: true,
      });
    }
  };

  useAsyncEffect(async () => {
    await fetchApi();
  }, []);

  /**
   * 图标
   * @param icon
   */
  const handleIconChange = (icon: string) => {
    setInitialValues({
      ...initialValues,
      icon: icon,
    });
  };

  const handleOk = async () => {
    const fieldsValue = await form.validateFields();

    let response: any = {};
    if (editId === undefined) {
      response = await createMenu(fieldsValue);
    } else {
      response = await updateMenu(editId, fieldsValue);
    }

    if (response.status === HttpStatusCode.Ok) {
      isShowModal(false);

      const defaultUpdateSuccessMessage = editId === undefined ?
        intl.formatMessage({ id: 'global.create.success', defaultMessage: '添加成功！'}):
        intl.formatMessage({ id: 'global.update.success', defaultMessage: '更新成功！'});

      message.success(defaultUpdateSuccessMessage);

      setTimeout(() => {
        window.location.reload();
      }, 100);
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
        <Form form={form} initialValues={initialValues} autoComplete="off">
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
                    defaultMessage='父级是必填项！'
                  />
                )
              }
            ]}
          >
            <Select
              options={treeData}
              style={{ width: 400 }}
              placeholder={
                intl.formatMessage({ id: 'modal.createOrUpdateForm.parent.placeholder', defaultMessage: '请选择父级！', })
              }
            />
          </Form.Item>

          <Form.Item
            name="icon"
            label={
              intl.formatMessage({id: 'modal.createOrUpdateForm.name'})
            }
            labelCol={{ span: 3 }}
          >
            <SelectIcon
              placeholder={intl.formatMessage({
                id: 'modal.createOrUpdateForm.icon.placeholder',
                defaultMessage: '请选择 图标！',
              })}
              onChange={handleIconChange}
            />
          </Form.Item>

          <Form.Item
            name="key"
            label={
              intl.formatMessage({id: 'modal.createOrUpdateForm.key'})
            }
            labelCol={{ span: 3 }}
            rules={[
              {
                required: true,
                message: (
                  <FormattedMessage
                    id='validator.admin.key.required'
                    defaultMessage='关键词是必填项！'
                  />
                )
              }
            ]}
          >
            <Input
              placeholder={intl.formatMessage({
                id: 'modal.createOrUpdateForm.key.placeholder',
                defaultMessage: '请输入 关键词！',
              })}
              style={{ width: 500 }}
            />
          </Form.Item>

          <Form.Item
            name="locale"
            label={
              intl.formatMessage({id: 'modal.createOrUpdateForm.locale'})
            }
            labelCol={{ span: 3 }}
            rules={[
              {
                required: true,
                message: (
                  <FormattedMessage
                    id='validator.admin.locale.required'
                    defaultMessage='国际化标识是必填项！'
                  />
                )
              }
            ]}
          >
             <Input
               placeholder={intl.formatMessage({
                 id: 'modal.createOrUpdateForm.locale.placeholder',
                 defaultMessage: '请输入 国际化标识！',
               })}
               style={{ width: 500 }}
             />
          </Form.Item>

          <Form.Item
            name="path"
            label={
              intl.formatMessage({id: 'modal.createOrUpdateForm.router'})
            }
            labelCol={{ span: 3 }}
          >
            <Select
              options={routes}
              style={{ width: 400 }}
              placeholder={intl.formatMessage({
                id: 'modal.createOrUpdateForm.router.placeholder',
                defaultMessage: '请选择 路由！',
              })}
            />
          </Form.Item>

          <Form.Item
            name="url"
            label={
              intl.formatMessage({id: 'modal.createOrUpdateForm.url'})
            }
            labelCol={{ span: 3 }}
          >
            <Input
              placeholder={intl.formatMessage({
                id: 'modal.createOrUpdateForm.url.placeholder',
                defaultMessage: '请输入 跳转地址！',
              })}
              style={{ width: 500 }}
            />
          </Form.Item>

          <Form.Item
            name="target"
            label={
              intl.formatMessage({id: 'modal.createOrUpdateForm.target'})
            }
            labelCol={{ span: 3 }}
          >
            <Select
              options={linkTarget}
              style={{ width: 250 }}
              placeholder={intl.formatMessage({
                id: 'modal.createOrUpdateForm.target.placeholder',
                defaultMessage: '请选择目标方式！',
              })}
            />
          </Form.Item>

          <Form.Item
            name="order"
            label={
              intl.formatMessage({id: 'modal.createOrUpdateForm.sort'})
            }
            labelCol={{ span: 3 }}
          >
            <InputNumber
              style={{ width: 400 }}
              placeholder={intl.formatMessage({
                id: 'modal.createOrUpdateForm.sort.placeholder',
                defaultMessage: '请输入 排序！',
              })}
            />
          </Form.Item>

          <Form.Item
            name="status"
            label={
              intl.formatMessage({id: 'model.createOrUpdateForm.display'})
            }
            labelCol={{ span: 3 }}
            valuePropName="checked"
          >
            <Switch
              checkedChildren={intl.formatMessage({id: 'global.switch.checked.label'})}
              unCheckedChildren={intl.formatMessage({id: 'global.switch.unChecked.label'})}
            />
          </Form.Item>

          <Form.Item
            name="roles"
            label={
              intl.formatMessage({id: 'modal.createOrUpdateForm.role'})
            }
            labelCol={{ span: 3 }}
          >
            <Select
              mode="multiple"
              options={roles}
              style={{ width: 500 }}
              placeholder={intl.formatMessage({
                id: 'modal.createOrUpdateForm.role.placeholder',
                defaultMessage: '请选择角色',
              })}
            />
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
};

export default CreateOrEdit;
