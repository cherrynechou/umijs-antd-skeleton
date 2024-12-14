import { destroyRole, queryRoles } from '@/services/admin/auth/RoleController';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, Popconfirm, Space, App } from 'antd';
import { omit } from 'lodash-es';
import { FC, useRef, useState } from 'react';
import CreateOrEdit from './components/CreateOrEdit';

export type TableListItem = {
  id: number;
  name: string;
  slug: string;
  created_at: number;
  update_at: number;
};

const Role: FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editId, setEditId] = useState<number>(0);
  const actionRef = useRef<ActionType>();

  const { message } = App.useApp();

  //自定查询
  const requestData = async (params: any) => {
    const filter = omit(params, ['current', 'pageSize']);
    const rename = {
      page: params.current,
      pageSize: params.pageSize,
    };
    const mergeParams = Object.assign({}, filter, rename);
    const ret = await queryRoles(mergeParams);

    return {
      data: ret.data.data,
      total: ret.data.meta.pagination.total,
      success: ret.status === 200,
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
   * 删除
   * @param id
   */
  const confirmDel = async (id: number) => {
    const res = await destroyRole(id);
    if (res.status === 200) {
      message.success('删除成功');
    }
  };

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
    },
    {
      title: '名称',
      width: 80,
      align: 'center',
      dataIndex: 'name',
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
      width: 40,
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
            okText="Yes"
            cancelText="No"
            onConfirm={() => confirmDel(record.id)}
          >
            <a>删除</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer title="角色列表">
      <ProTable<TableListItem>
        columns={columns}
        actionRef={actionRef}
        request={requestData}
        rowKey="id"
        dateFormatter="string"
        headerTitle="角色列表"
        rowSelection={{ fixed: true }}
        pagination={{
          pageSize: 15,
          onChange: (page) => console.log(page),
        }}
        toolBarRender={() => [
          <Button key="button" type="primary" icon={<PlusOutlined />} onClick={() => isShowModal(true)}>
            新增
          </Button>,
        ]}
      />

      {isModalVisible && (
        <CreateOrEdit isModalVisible={isModalVisible} isShowModal={isShowModal} actionRef={actionRef} editId={editId} />
      )}
    </PageContainer>
  );
};

export default Role;
