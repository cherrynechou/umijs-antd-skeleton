import { FC } from 'react';
import { Dropdown, Spin, MenuProps } from 'antd';
import { BulbOutlined, LogoutOutlined } from '@ant-design/icons';
import { createStyles } from 'antd-style';
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
      {currentUser?.name || '管理员'}
    </span>
  );
};

const useStyles = createStyles(({ token }) => {
  return {
    action: {
      display: 'flex',
      height: '48px',
      marginLeft: 'auto',
      overflow: 'hidden',
      alignItems: 'center',
      padding: '0 8px',
      cursor: 'pointer',
      borderRadius: token.borderRadius,
      '&:hover': {
        backgroundColor: token.colorBgTextHover,
      },
    },
  };
});


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

  const { styles } = useStyles();


  // -- layouts
  const loading = (
    <span className={styles.action}>
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
          selectedKeys: [],
          items: DropdownItems,
          onClick: DropdownOnClick,
        }}
      >
        {children}
      </Dropdown>
    </>
  )
}