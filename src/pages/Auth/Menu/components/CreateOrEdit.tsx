import { SelectIcon } from '@/components';
import { createMenu, getMenu, updateMenu } from '@/services/admin/auth/MenuController';
import { queryAllRoles } from '@/services/admin/auth/RoleController';
import { queryListMaxValue, treeToOrderList } from '@/utils/utils';
import { useAsyncEffect } from 'ahooks';
import { App, Form, Input, InputNumber, Modal, Select, Skeleton, Switch } from 'antd';
import { AxiosResponse } from 'axios';
import { FC, useState } from 'react';
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

  const title = editId === undefined ? '添加' : '编辑';

  const fetchApi = async () => {
    //生成树型结构
    const treeValues = treeToOrderList(menuData);
    setTreeData(treeValues);

    const targets = [
      { label: '新窗口', value: '_blank' },
      { label: '当前窗口', value: '' },
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
    if (rolesRes.status === 200) {
      const _rolesData = rolesRes.data;
      const _rolesValue: any[] = [];
      _rolesData.forEach((item: any) => {
        _rolesValue.push({ value: item.id, label: item.name });
      });
      setRoles(_rolesValue);
    }

    if (editId !== undefined) {
      const menuRes: AxiosResponse = await getMenu(editId);
      if (menuRes.status === 200) {
        const currentData = menuRes.data;
        let rolesValue: any[] = [];
        if (currentData.roles.length > 0) {
          rolesValue = currentData.roles.map((item: any) => {
            return item.id;
          });
        }

        setInitialValues({
          name: currentData.name,
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

    if (response.status === 200) {
      isShowModal(false);
      message.success('修改成功');
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
            label="父级"
            labelCol={{ span: 3 }}
            rules={[{ required: true, message: '父级是必填项！' }]}
          >
            <Select options={treeData} style={{ width: 400 }} placeholder="请选择父级" />
          </Form.Item>

          <Form.Item name="icon" label="图标" labelCol={{ span: 3 }}>
            <SelectIcon placeholder="请选择 图标" onChange={handleIconChange} />
          </Form.Item>

          <Form.Item
            name="name"
            label="名称"
            labelCol={{ span: 3 }}
            rules={[{ required: true, message: '名称是必填项！' }]}
          >
            <Input placeholder="请输入 名称" style={{ width: 500 }} />
          </Form.Item>

          <Form.Item name="path" label="路由" labelCol={{ span: 3 }}>
            <Select options={routes} style={{ width: 400 }} placeholder="请选择 路由" />
          </Form.Item>

          <Form.Item name="url" label="跳转地址" labelCol={{ span: 3 }}>
            <Input placeholder="请输入 地址" style={{ width: 500 }} />
          </Form.Item>

          <Form.Item name="target" label="目标方式" labelCol={{ span: 3 }}>
            <Select options={linkTarget} style={{ width: 200 }} placeholder="请选择目标方式" />
          </Form.Item>

          <Form.Item name="order" label="排序" labelCol={{ span: 3 }}>
            <InputNumber style={{ width: 400 }} placeholder="请输入 排序" />
          </Form.Item>

          <Form.Item name="status" label="是否显示" labelCol={{ span: 3 }} valuePropName="checked">
            <Switch checkedChildren="开启" unCheckedChildren="关闭" />
          </Form.Item>

          <Form.Item name="roles" label="角色" labelCol={{ span: 3 }}>
            <Select mode="multiple" options={roles} style={{ width: 500 }} placeholder="请选择角色" />
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
};

export default CreateOrEdit;
