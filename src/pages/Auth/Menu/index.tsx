import { FC,  useRef, useState } from 'react';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, Popconfirm, Switch, Space, App } from 'antd';
import { queryMenus, switchMenu, destroyMenu } from '@/services/admin/auth/MenuController';
import Icon, { PlusOutlined } from '@ant-design/icons';
import * as icons from '@ant-design/icons';
import CreateOrEdit from './components/CreateOrEdit';

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

  const { message } = App.useApp();

  //自定查询
  const requestData = async () =>{
    const ret = await queryMenus();
    setMenuData(ret.data);
    return {
      data: ret.data,
      success: ret.status === 200
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
    if(res.status === 200){
      message.success('删除成功');
    }
  }

  /**
   *
   * @param id
   */
  const handleSwitch = async (id: number) =>{
    const response = await switchMenu(id);
    if(response.status === 200){
      message.success('更新成功');
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
      title: '图标',
      width: 20,
      align: 'center',
      dataIndex: 'icon',
      hideInSearch: true,
      render:(_,record)=>(
        record.icon && <Icon component={(icons as any)[record.icon]} style={{ fontSize: '16px' }} />
      )
    }, {
      title: '名称',
      width: 80,
      align: 'center',
      dataIndex: 'name'
    },{
      title: '路由',
      width: 80,
      align: 'center',
      dataIndex: 'path',
      hideInSearch: true,
    }, {
      title: '排序',
      width: 80,
      align: 'center',
      dataIndex: 'order',
      hideInSearch: true,
    },{
      title: '显示',
      width: 80,
      align: 'center',
      dataIndex: 'status',
      hideInSearch: true,
      render:(_,record)=>(
        <Switch checkedChildren="开启" unCheckedChildren="关闭"  defaultChecked= { record.status === 1 } onChange={() => handleSwitch(record.id)}/>
      )
    }, {
      title: '创建时间',
      width: 120,
      align: 'center',
      dataIndex: 'created_at',
      hideInSearch: true,
    }, {
      title: '更新时间',
      width: 120,
      align: 'center',
      dataIndex: 'updated_at',
      hideInSearch: true,
    }, {
      title: '操作',
      width: 80,
      key: 'option',
      valueType: 'option',
      align: 'center',
      render: (_,record) => (
        <Space>
          <a key="link" onClick={() => isShowModal(true, record.id)}>编辑</a>
          <Popconfirm key="del" placement="top" title='确认操作?' onConfirm={ () => confirmDel(record.id) } okText="Yes" cancelText="No">
            <a>删除</a>
          </Popconfirm>
        </Space>
      )
    },
  ];

  return (
    <PageContainer title="菜单管理">
      <ProTable<TableListItem>
        columns={columns}
        actionRef={actionRef}
        request={requestData}
        rowKey="id"
        dateFormatter="string"
        headerTitle="菜单列表"
        rowSelection={{ fixed: true }}
        pagination={false}
        toolBarRender={() => [
          <Button key="button" type="primary" icon={<PlusOutlined />} onClick={() => isShowModal(true)}>
            新增
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