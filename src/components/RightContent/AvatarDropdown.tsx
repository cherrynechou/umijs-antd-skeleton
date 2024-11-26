import { FC } from 'react';
import { MenuProps, Spin } from 'antd';
import HeaderDropdown from './HeaderDropdown';
import { LogoutOutlined, SettingOutlined } from '@ant-design/icons';
import { createStyles } from 'antd-style';
import { useModel,history } from '@umijs/max';
import localforage from 'localforage';
import { stringify } from 'querystring';
import { LOGIN_PATH } from '@/constants/pages'

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

/**
 * 清除accesstoken
 */
const removeAccessToken = async () =>{
  await localforage.removeItem('access_token');
}

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


export const AvatarDropdown: FC<GlobalHeaderRightProps> = ({  menu,children })=>{

  const { initialState } = useModel('@@initialState');

  console.log(menu);

  /**
   * 退出登录，并且将当前的 url 保存
   */
  const loginOut = async () => {
    const { query = {}, search, pathname } = history;
    const { redirect } = query;

    // Note: There may be security issues, please note
    if (window.location.pathname !== LOGIN_PATH && !redirect) {
      await removeAccessToken();
      history.replace({
        pathname: LOGIN_PATH,
        search: stringify({
          redirect: pathname + search,
        })
      });
    }
  };

  const DropdownItems: MenuProps['items'] = [
    ...(menu ? [
        {
          key: 'settings',
          icon: <SettingOutlined />,
          label: '个人设置',
        },
        {
          type: 'divider' as const,
        },
      ]
      : []),
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
    },
  ];

  const DropdownOnClick: MenuProps['onClick'] = async ({ key }) => {
    if(key === 'logout'){
      await loginOut();
      return ;
    }

    console.log(key);
  };

  const  { styles} = useStyles();

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
      <HeaderDropdown
        menu={{
          selectedKeys: [],
          onClick: DropdownOnClick,
          items: DropdownItems,
        }}
      >
        {children}
      </HeaderDropdown>
    </>
  )
}