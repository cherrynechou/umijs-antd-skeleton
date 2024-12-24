import { FC, useRef, useState } from 'react';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable   } from '@ant-design/pro-components';
import { useIntl, FormattedMessage } from '@umijs/max';
import { Button, Space, Tag, message, Switch, Popconfirm } from 'antd';
import { queryUsers, blockUser, resetPassword, destroyUser } from '@/services/admin/auth/UserController';
import { omit } from 'lodash-es';
import { PlusOutlined } from '@ant-design/icons';
import { HttpStatusCode } from 'axios';
import CreateOrEdit  from './components/CreateOrEdit';

export type TableListItem = {
  id: number;
  username: string;
  name: string;
  email: string;
  roles: {
    data: [];
  };
  is_administrator: boolean;
  phone: string;
  status: number;
  login_count: number;
  created_at: number;
  update_at: number;
};

export type RoleItem = {
  name: string;
};

const User: FC = () =>{

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editId, setEditId] = useState<number>(0);

  const intl = useIntl();

  const actionRef = useRef<ActionType>();

  //获取用户用户列表
  const requestData = async (params: any) => {
    const filter = omit(params, ['current', 'pageSize']);
    const rename = {
      page: params.current,
      pageSize: params.pageSize,
    };
    const mergeParams = Object.assign({}, filter, rename);
    const ret = await queryUsers(mergeParams);

    return {
      data: ret.data.data,
      total: ret.data.meta.pagination.total,
      success: ret.status === HttpStatusCode.Ok,
    };
  };


  /**
   * 禁止用户登录
   * @param uid
   */
  const handleBlockUser = async (uid: number) => {
    const res = await blockUser(uid);
    if (res.status === HttpStatusCode.Ok) {

      const defaultUpdateSuccessMessage = intl.formatMessage({
        id: 'pages.update.success',
        defaultMessage: '更新成功！',
      });

      message.success(defaultUpdateSuccessMessage);
    }
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
   *
   * @param id
   */
  const confirmDel = async (id: number) => {
    const res = await destroyUser(id);
    if (res.status === HttpStatusCode.Ok) {

      const defaultDeleteSuccessMessage = intl.formatMessage({
        id: 'global.delete.success',
        defaultMessage: '删除成功！',
      });

      message.success(defaultDeleteSuccessMessage);
    }
  };

  /**
   * 重置密码
   * @param id
   */
  const confirmResetPassword = async (id: number) => {
    const res = await resetPassword(id);
    if (res.status === HttpStatusCode.Ok) {

      const defaultResetSuccessMessage = intl.formatMessage({
        id: 'pages.reset.success',
        defaultMessage: '重置成功！',
      });

      message.success(defaultResetSuccessMessage);
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
    }, {
      title: (
        <FormattedMessage id={'pages.searchTable.username'} />
      ),
      width: 80,
      align: 'center',
      dataIndex: 'username',
    }, {
      title: (
        <FormattedMessage id={'pages.searchTable.name'} />
      ),
      width: 80,
      align: 'center',
      dataIndex: 'name',
      hideInSearch: true,
    }, {
      title: (
        <FormattedMessage id={'pages.searchTable.role'} />
      ),
      width: 80,
      align: 'center',
      dataIndex: 'roles',
      hideInSearch: true,
      renderFormItem: (_, { defaultRender }) => {
        return defaultRender(_);
      },
      render: (_, record) => (
        <Space>
          {record.roles.data.map((item: RoleItem, index: number) => (
            <Tag key={index} color="#586cb1">
              {item.name}
            </Tag>
          ))}
        </Space>
      ),
    }, {
      title: (
        <FormattedMessage id={'pages.searchTable.whetherToDisabled.text'} />
      ),
      width: 80,
      align: 'center',
      dataIndex: 'is_black',
      hideInSearch: true,
      render: (_, record) => (
        <Switch
          checkedChildren={intl.formatMessage({id: 'global.switch.checked.label'})}
          unCheckedChildren={intl.formatMessage({id: 'global.switch.unChecked.label'})}
          defaultChecked={record.status === 1}
          disabled={record.is_administrator}
          onChange={() => handleBlockUser(record.id)}
        />
      ),
    }, {
      title: (
        <FormattedMessage id={'pages.searchTable.loginCount'} />
      ),
      width: 80,
      align: 'center',
      dataIndex: 'login_count',
      hideInSearch: true,
    }, {
      title: (
        <FormattedMessage id={'pages.searchTable.createTime'} />
      ),
      width: 120,
      align: 'center',
      dataIndex: 'created_at',
      hideInSearch: true,
    }, {
      title: (
        <FormattedMessage id={'pages.searchTable.updateTime'} />
      ),
      width: 120,
      align: 'center',
      dataIndex: 'updated_at',
      hideInSearch: true,
    }, {
      title: (
        <FormattedMessage id={'pages.searchTable.action'} />
      ),
      width: 140,
      key: 'option',
      valueType: 'option',
      align: 'center',
      render: (_, record) => (
        <Space>
          <a key="link" className="text-blue-500" onClick={() => isShowModal(true, record.id)}>
            <FormattedMessage id='pages.searchTable.edit' />
          </a>
          {!record.is_administrator && (
            <Popconfirm
              key="del"
              placement="top"
              title={intl.formatMessage({id: 'pages.searchTable.okConfirm'})}
              onConfirm={() => confirmDel(record.id)}
              okText="Yes"
              cancelText="No"
            >
              <a key="delete" className="text-blue-500">
                <FormattedMessage id='pages.searchTable.delete' />
              </a>
            </Popconfirm>
          )}
          <Popconfirm
            key="reset"
            placement="top"
            title={intl.formatMessage({id: 'pages.searchTable.okConfirm'})}
            onConfirm={() => confirmResetPassword(record.id)}
            okText={intl.formatMessage({id: 'pages.searchTable.ok'})}
            cancelText={intl.formatMessage({id: 'pages.searchTable.cancel'})}
          >
            <a key="reset" className="text-blue-500">
              <FormattedMessage id='pages.searchTable.resetPassword' />
            </a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer title={
      intl.formatMessage({id: 'pages.admin.administrator'})
    }>
      <ProTable<TableListItem>
        columns={columns}
        actionRef={actionRef}
        request={requestData}
        rowKey="id"
        dateFormatter="string"
        headerTitle={
          intl.formatMessage({id: 'pages.admin.administrator.list'})
        }
        pagination={{
          pageSize: 15,
          showSizeChanger: false,
          showQuickJumper: true,
        }}
        toolBarRender={() => [
          <Button key="button" type="primary" icon={<PlusOutlined />} onClick={() => isShowModal(true)}>
            <FormattedMessage id='pages.searchTable.new' />
          </Button>,
        ]}
      />

      {isModalVisible &&
        <CreateOrEdit
          isModalVisible={isModalVisible}
          isShowModal={isShowModal}
          actionRef={actionRef}
          editId={editId}
        />
      }
    </PageContainer>
  )
}

export default User;