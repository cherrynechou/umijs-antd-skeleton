import { destroyPermission, queryPermissions } from '@/services/admin/auth/PermissionController';
import { PlusOutlined } from '@ant-design/icons';
import { FormattedMessage,useIntl } from '@umijs/max';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, App, Popconfirm, Space, Tag } from 'antd';
import { FC, useRef, useState } from 'react';
import CreateOrEdit from './components/CreateOrEdit';
import { HttpStatusCode } from 'axios';
import { treeToList } from '@/utils/utils';


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
  const [defaultExpandedRowKeys, setDefaultExpandedRowKeys] = useState([])
  const [editId, setEditId] = useState<number>(0);

  const actionRef = useRef<ActionType>();
  const intl = useIntl();

  const { message } = App.useApp();

  //自定查询
  const requestData = async () => {
    const permissionRes = await queryPermissions();
    setPermissionTreeData(permissionRes.data);

    const treeList = treeToList(permissionRes.data);
    const _defaultExpandedRowKeys = treeList.map((item)=>{
      return item.id;
    })
    console.log(_defaultExpandedRowKeys);
    setDefaultExpandedRowKeys(_defaultExpandedRowKeys);

    return {
      data: permissionRes.data,
      success: permissionRes.status === HttpStatusCode.Ok,
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
    if (res.status === HttpStatusCode.Ok) {

      const defaultDeleteSuccessMessage = intl.formatMessage({
        id: 'global.delete.success',
        defaultMessage: '删除成功！',
      });

      message.success(defaultDeleteSuccessMessage);
    }
  };

  //列表
  const columns: ProColumns<TableListItem>[] = [
    {
      title: 'ID',
      width: 50,
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
      render: (_, record) => (
        <Space>
          <Tag color="#586cb1">{record.slug}</Tag>
        </Space>
      ),
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
        <FormattedMessage id={'pages.searchTable.authorizationInformation'} />
      ),
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
      width: 60,
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
      intl.formatMessage({id: 'pages.admin.permission' })
    }>
      <ProTable<TableListItem>
        columns={columns}
        actionRef={actionRef}
        request={requestData}
        search={false}
        rowKey="id"
        dateFormatter="string"
        headerTitle={
          intl.formatMessage({id: 'pages.admin.permission.list' })
        }
        expandable={{
          expandedRowKeys: defaultExpandedRowKeys
        }}
        rowSelection={{ fixed: true }}
        pagination={false}
        toolBarRender={() => [
          <Button key="button" type="primary" icon={<PlusOutlined />} onClick={() => isShowModal(true)}>
            <FormattedMessage id='pages.searchTable.new' />
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
