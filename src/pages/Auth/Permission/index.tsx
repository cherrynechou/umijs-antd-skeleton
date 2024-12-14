import { destroyPermission, queryPermissions } from '@/services/admin/auth/PermissionController';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, App, Popconfirm, Space, Tag } from 'antd';
import { FC, useRef, useState } from 'react';
import CreateOrEdit from './components/CreateOrEdit';

export type TableListItem = {
  id: number;
  name: string;
  slug: string;
  methods: any[];
  paths: any[];
  order: number;
  parent_id: number;
  created_at: number;
  update_at: number;
};

const Permission: FC = () => {
  const [permissionTreeData, setPermissionTreeData] = useState<any>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editId, setEditId] = useState<number>(0);

  const actionRef = useRef<ActionType>();
  const { message } = App.useApp();

  //自定查询
  const requestData = async () => {
    const permissionRes = await queryPermissions();
    setPermissionTreeData(permissionRes.data);
    return {
      data: permissionRes.data,
      success: permissionRes.status === 200,
    };
  };

  /**
   *  显示对话框
   * @param show
   * @param id
   */
  const isShowModal = (show: boolean, id?: number | undefined) => {
    // @ts-ignore
    setEditId(id);
    setIsModalVisible(show);
  };

  /**
   * 删除id
   * @param id
   */
  const confirmDel = async (id: number) => {
    const res = await destroyPermission(id);
    if (res.status === 200) {
      message.success('删除成功');
    }
  };

  //列表
  const columns: ProColumns<TableListItem>[] = [
    {
      title: 'ID',
      width: 40,
      dataIndex: 'id',
      align: 'center',
      sorter: (a, b) => a.id - b.id,
      hideInSearch: true,
    },
    {
      title: '标识',
      width: 80,
      align: 'center',
      dataIndex: 'slug',
      render: (_, record) => (
        <Space>
          <Tag color="#586cb1">{record.slug}</Tag>
        </Space>
      ),
    },
    {
      title: '名称',
      width: 80,
      align: 'center',
      dataIndex: 'name',
    },
    {
      title: '授权信息',
      width: 80,
      align: 'center',
      render: (_, record) => (
        <Space>
          {record.methods.map((method: string, index: number) => (
            <Tag key={index} color="#586cb1">
              {method}
            </Tag>
          ))}
          {record.paths.map((path: string, index: number) => (
            <Tag color="#f7f7f9" key={index} style={{ color: '#586cb1' }}>
              {path}
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: '创建时间',
      width: 120,
      align: 'center',
      dataIndex: 'created_at',
      hideInSearch: true,
    },
    {
      title: '更新时间',
      width: 120,
      align: 'center',
      dataIndex: 'updated_at',
      hideInSearch: true,
    },
    {
      title: '操作',
      width: 60,
      key: 'option',
      valueType: 'option',
      align: 'center',
      render: (_, record) => (
        <Space>
          <a key="link" onClick={() => isShowModal(true, record.id)}>
            编辑
          </a>
          <Popconfirm
            key="del"
            placement="top"
            title="确认操作?"
            onConfirm={() => confirmDel(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <a>删除</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer title="权限管理">
      <ProTable<TableListItem>
        columns={columns}
        actionRef={actionRef}
        request={requestData}
        search={false}
        rowKey="id"
        dateFormatter="string"
        headerTitle="权限列表"
        rowSelection={{ fixed: true }}
        pagination={false}
        toolBarRender={() => [
          <Button key="button" type="primary" icon={<PlusOutlined />} onClick={() => isShowModal(true)}>
            新增
          </Button>,
        ]}
      />

      {isModalVisible && (
        <CreateOrEdit
          isModalVisible={isModalVisible}
          isShowModal={isShowModal}
          actionRef={actionRef}
          permissionTreeData={permissionTreeData}
          editId={editId}
        />
      )}
    </PageContainer>
  );
};

export default Permission;
