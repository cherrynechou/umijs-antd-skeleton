import { CreateOrEditProps } from '@/interfaces/modal';
import { ITreeOption } from '@/interfaces/tree';
import { queryAllPermissions } from '@/services/admin/auth/PermissionController';
import { createRole, getRole, updateRole } from '@/services/admin/auth/RoleController';
import { filterTreeLeafNode, listToTree } from '@/utils/utils';
import { useAsyncEffect } from 'ahooks';
import { Form, Input, message, Modal, Skeleton, Tree } from 'antd';
import type { TreeProps } from 'antd/es/tree';
import { nanoid } from 'nanoid';
import { FC, useState } from 'react';

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
  const [treeData, setTreeData] = useState<any>([]);
  const [treeLeafRecord, setTreeLeafRecord] = useState<any>([]);
  const [defaultCheckedKeys, setDefaultCheckedKeys] = useState<any>([]);
  const { isModalVisible, isShowModal, editId, actionRef } = props;

  const [form] = Form.useForm();

  const title = editId === undefined ? '添加' : '编辑';

  const fetchApi = async () => {
    const permissionAllRes = await queryAllPermissions();
    if (permissionAllRes.status === 200) {
      const _permissionData = permissionAllRes.data;
      const listTreePermissionData = listToTree(_permissionData, defaultOptionKeys);
      setTreeData(listTreePermissionData);
      setTreeLeafRecord(filterTreeLeafNode(listTreePermissionData));
    }

    if (editId !== undefined) {
      const roleRes = await getRole(editId);
      if (roleRes.status === 200) {
        const currentData = roleRes.data;
        let permissionList: any[] = [];
        if (currentData.permissions.length > 0) {
          permissionList = currentData.permissions.map((item: any) => {
            return item.id;
          });
        }

        setDefaultCheckedKeys(permissionList);

        setInitialValues({
          name: currentData.name,
          slug: currentData.slug,
          permissions: JSON.stringify(permissionList),
        });
      }
    }
  };

  useAsyncEffect(async () => {
    await fetchApi();
  }, []);

  /**
   * 提交
   */
  const handleOk = async () => {
    const fieldsValue = await form.validateFields();

    let response: any = {};
    if (editId === undefined) {
      response = await createRole(fieldsValue);
    } else {
      response = await updateRole(editId, fieldsValue);
    }

    if (response.status === 200) {
      isShowModal(false);
      message.success(`${title}成功`);
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
      styles={{
        body: { height: 'calc(100vh - 400px)', overflowY: 'auto' },
      }}
      open={isModalVisible}
      onOk={handleOk}
      onCancel={() => isShowModal(false)}
      destroyOnClose={true}
      width={750}
    >
      {Object.keys(initialValues).length === 0 && editId !== undefined ? (
        <Skeleton paragraph={{ rows: 4 }} />
      ) : (
        <Form name="role-update" form={form} initialValues={initialValues} autoComplete="off">
          <Form.Item name="name" label="名称" rules={[{ required: true, message: '名称是必填项！' }]}>
            <Input placeholder="请输入 名称" />
          </Form.Item>

          <Form.Item name="slug" label="标识" rules={[{ required: true, message: '标识是必填项！' }]}>
            <Input placeholder="请输入 名称" />
          </Form.Item>

          <Form.Item name="permissions" hidden>
            <Input hidden placeholder="请输入 名称" />
          </Form.Item>

          <Form.Item label="权限">
            <Tree
              checkable
              defaultExpandAll={false}
              defaultCheckedKeys={defaultCheckedKeys}
              onSelect={onSelect}
              onCheck={onCheck}
              key={nanoid()}
              treeData={treeData}
            />
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
};

export default CreateOrEdit;
