import { FC } from 'react';
import { Dropdown, Spin, MenuProps } from 'antd';
import { BulbOutlined, LogoutOutlined } from '@ant-design/icons';
import { useModel } from '@umijs/max';

export type GlobalHeaderRightProps = {
  menu?: boolean;
  children?: React.ReactNode;
};

export const AvatarName = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  return (
    <span style={{ color: '#FFF', fontSize: 14 }}>
      {currentUser?.nickname || '管理员'}
    </span>
  );
};

export const AvatarDropdown: FC<GlobalHeaderRightProps> = ({
   children
})=>{

  const { initialState, setInitialState } = useModel('@@initialState');

  const DropdownItems: MenuProps['items'] = [
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
    },
    {
      key: 'theme',
      icon: <BulbOutlined />,
      label: '切换主题',
    },
  ];

  const DropdownOnClick: MenuProps['onClick'] = ({ key }) => {
    if(key === 'logout'){

    }
    //message.info(`Click on item ${key}`);
  };




  // -- layouts
  const loading = (
    <span>
      <Spin
        size="small"
        style={{
          marginLeft: 8,
          marginRight: 8,
        }}
      />
    </span>
  );

  if (!initialState) {
    return loading;
  }

  const { currentUser } = initialState;

  if (!currentUser || !currentUser.name) {
    return loading;
  }

  return (
    <>
      <Dropdown
        menu={{
          items: DropdownItems,
          onClick: DropdownOnClick,
        }}
      >
        {children}
      </Dropdown>
    </>
  )
}