import { destroyRole, queryRoles } from '@/services/admin/auth/RoleController';
import { PlusOutlined } from '@ant-design/icons';
import { FormattedMessage,useIntl } from '@umijs/max';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, Popconfirm, Space, App } from 'antd';
import { omit } from 'lodash-es';
import { FC, useRef, useState } from 'react';
import CreateOrEdit from './components/CreateOrEdit';
import { HttpStatusCode } from 'axios';


export type TableListItem = {
  id: number;
  name: string;
  created_at: number;
  update_at: number;
};

const Role: FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editId, setEditId] = useState<number>(0);
  const actionRef = useRef<ActionType>();

  const { message } = App.useApp();
  const intl = useIntl();

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
      success: ret.status === HttpStatusCode.Ok,
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
    if (res.status === HttpStatusCode.Ok) {

      const defaultDeleteSuccessMessage = intl.formatMessage({
        id: 'pages.delete.success',
        defaultMessage: '删除成功！',
      });

      message.success(defaultDeleteSuccessMessage);
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
      title: (
        <FormattedMessage id={'pages.searchTable.slug'} />
      ),
      width: 80,
      align: 'center',
      dataIndex: 'slug',
    },
    {
      title: (
        <FormattedMessage id={'pages.searchTable.name'} />
      ),
      width: 80,
      align: 'center',
      dataIndex: 'name',
    },
    {
      title: (
        <FormattedMessage id={'pages.searchTable.createTime'} />
      ),
      width: 120,
      align: 'center',
      dataIndex: 'created_at',
      hideInSearch: true,
    },
    {
      title: (
        <FormattedMessage id={'pages.searchTable.updateTime'} />
      ),
      width: 120,
      align: 'center',
      dataIndex: 'updated_at',
      hideInSearch: true,
    },
    {
      title: (
        <FormattedMessage id={'pages.searchTable.action'} />
      ),
      width: 40,
      key: 'option',
      valueType: 'option',
      align: 'center',
      render: (_, record) => (
        <Space>
          <a key="link" className="text-blue-500" onClick={() => isShowModal(true, record.id)}>
            <FormattedMessage id='pages.searchTable.edit' />
          </a>
          <Popconfirm
            key="del"
            placement="top"
            title={intl.formatMessage({id: 'pages.searchTable.okConfirm'})}
            onConfirm={() => confirmDel(record.id)}
            okText={intl.formatMessage({id: 'pages.searchTable.ok'})}
            cancelText={intl.formatMessage({id: 'pages.searchTable.cancel'})}
          >
            <a key="delete" className="text-blue-500">
              <FormattedMessage id='pages.searchTable.delete' />
            </a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer title={
      intl.formatMessage({id: 'pages.admin.role' })
    }>
      <ProTable<TableListItem>
        columns={columns}
        actionRef={actionRef}
        request={requestData}
        rowKey="id"
        dateFormatter="string"
        headerTitle={
          intl.formatMessage({id: 'pages.admin.role.list' })
        }
        rowSelection={{ fixed: true }}
        pagination={{
          pageSize: 15
        }}
        toolBarRender={() => [
          <Button key="button" type="primary" icon={<PlusOutlined />} onClick={() => isShowModal(true)}>
            <FormattedMessage id='pages.searchTable.new' />
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
