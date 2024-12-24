import { FC,  useRef, useState } from 'react';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { useIntl, FormattedMessage } from '@umijs/max';
import { Button, Popconfirm, Switch, Space, App } from 'antd';
import { queryMenus, switchMenu, destroyMenu } from '@/services/admin/auth/MenuController';
import Icon, { PlusOutlined } from '@ant-design/icons';
import * as icons from '@ant-design/icons';
import CreateOrEdit from './components/CreateOrEdit';
import { HttpStatusCode } from 'axios';

export type TableListItem = {
  id: number;
  icon: string;
  name: string;
  path: string;
  order: number;
  status: number;
  created_at: number;
  update_at: number;
};

const Menu: FC = () =>{
  const [ menuData, setMenuData ] = useState([]);
  const [ isModalVisible, setIsModalVisible ] = useState(false);
  const [ editId, setEditId] = useState<number>(0);

  const actionRef = useRef<ActionType>();
  const intl = useIntl();

  const { message } = App.useApp();

  //自定查询
  const requestData = async () =>{
    const ret = await queryMenus();
    setMenuData(ret.data);
    return {
      data: ret.data,
      success: ret.status === HttpStatusCode.Ok
    }
  }

  /**
   *  显示对话框
   * @param show
   * @param id
   */
  const isShowModal = (show: boolean, id?: number | undefined)=> {
    // @ts-ignore
    setEditId(id);
    setIsModalVisible(show);
  }

  /**
   * 删除id
   * @param id
   */
  const confirmDel = async (id: number) => {
    const res = await destroyMenu(id);
    if(res.status === HttpStatusCode.Ok){

      const defaultDeleteSuccessMessage = intl.formatMessage({
        id: 'pages.delete.success',
        defaultMessage: '删除成功！',
      });

      message.success(defaultDeleteSuccessMessage);
    }
  }

  /**
   *
   * @param id
   */
  const handleSwitch = async (id: number) =>{
    const response = await switchMenu(id);
    if(response.status === HttpStatusCode.Ok){

      const defaultUpdateSuccessMessage = intl.formatMessage({
        id: 'pages.update.success',
        defaultMessage: '更新成功！',
      });

      message.success(defaultUpdateSuccessMessage);
      actionRef.current?.reload();
    }
  }


  //列表
  const columns: ProColumns<TableListItem>[] = [
    {
      title: 'ID',
      width: 80,
      dataIndex: 'id',
      align: 'center',
      sorter: (a, b) => a.id - b.id,
      hideInSearch: true,
    }, {
      title: (
        <FormattedMessage id={'pages.searchTable.icon'} />
      ),
      width: 20,
      align: 'center',
      dataIndex: 'icon',
      hideInSearch: true,
      render:(_,record)=>(
        record.icon && <Icon component={(icons as any)[record.icon]} style={{ fontSize: '16px' }} />
      )
    }, {
      title: (
        <FormattedMessage id={'pages.searchTable.key'} />
      ),
      width: 80,
      align: 'center',
      dataIndex: 'key'
    },{
      title: (
        <FormattedMessage id={'pages.searchTable.router'} />
      ),
      width: 80,
      align: 'center',
      dataIndex: 'path',
      hideInSearch: true,
    }, {
      title: (
        <FormattedMessage id={'pages.searchTable.sort'} />
      ),
      width: 80,
      align: 'center',
      dataIndex: 'order',
      hideInSearch: true,
    },{
      title: (
        <FormattedMessage id={'pages.searchTable.display'} />
      ),
      width: 80,
      align: 'center',
      dataIndex: 'status',
      hideInSearch: true,
      render:(_,record)=>(
        <Switch
          checkedChildren={intl.formatMessage({id: 'page.switch.checked.label'})}
          unCheckedChildren={intl.formatMessage({id: 'page.switch.unChecked.label'})}
          defaultChecked= { record.status === 1 }
          onChange={() => handleSwitch(record.id)}
        />
      )
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
      width: 80,
      key: 'option',
      valueType: 'option',
      align: 'center',
      render: (_,record) => (
        <Space>
          <a key="link" className="text-blue-500" onClick={() => isShowModal(true, record.id)}>
            <FormattedMessage id={'pages.searchTable.edit'} />
          </a>
          <Popconfirm
            key="del"
            placement="top"
            title={intl.formatMessage({id: 'pages.searchTable.okConfirm'})}
            onConfirm={ () => confirmDel(record.id) }
            okText={intl.formatMessage({id: 'pages.searchTable.ok'})}
            cancelText={intl.formatMessage({id: 'pages.searchTable.cancel'})}
          >
            <a key="delete" className="text-blue-500">
              <FormattedMessage id={'pages.searchTable.delete'} />
            </a>
          </Popconfirm>
        </Space>
      )
    },
  ];

  return (
    <PageContainer title={
      intl.formatMessage({id: 'pages.admin.menu' })}
    >
      <ProTable<TableListItem>
        columns={columns}
        actionRef={actionRef}
        request={requestData}
        rowKey="id"
        dateFormatter="string"
        headerTitle={
          intl.formatMessage({id: 'pages.admin.menu.list'})
        }
        rowSelection={{ fixed: true }}
        expandable={{ defaultExpandAllRows: true }}
        pagination={false}
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
          actionRef = {actionRef}
          menuData={menuData}
          editId = {editId}
        />
      }

    </PageContainer>
  )
}

export default Menu;