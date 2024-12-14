// 运行时配置
// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
// 更多信息见文档：https://umijs.org/docs/api/runtime-config#getinitialstate
import { AvatarDropdown, AvatarName, Footer } from '@/components';
import AntWrapApp from '@/components/GlobalMessage';
import { queryCurrentUser } from '@/services/admin/auth/UserController';
import { getMenuList } from '@/services/admin/system/CommonController';
import { LinkOutlined } from '@ant-design/icons';
import type { Settings as LayoutSettings } from '@ant-design/pro-components';
import { history, Link } from '@umijs/max';
import { App, ConfigProvider } from 'antd';
import { AxiosResponse } from 'axios';
import dayjs from 'dayjs';
import localforage from 'localforage';
import fixMenuItemIcon from '@/utils/fixMenuItemIcon';
import defaultSettings from '../config/defaultSettings';

const isDev: boolean = process.env.NODE_ENV === 'development';
const loginPath: string = '/admin/login';

export type menuProType = {
  isUrl: any;
  path: any;
  target: string;
  pro_layout_parentKeys: string | any[];
  icon: any;
};

export const rootContainer = (root: JSX.Element) => {
  return (
    <ConfigProvider>
      <App>
        <AntWrapApp />
        {root}
      </App>
    </ConfigProvider>
  );
};

export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: API.LoginResponse;
  loading?: boolean;
  fetchUserInfo?: () => Promise<API.LoginResponse | undefined>;
}> {
  const fetchUserInfo = async () => {
    try {
      const msg: AxiosResponse = await queryCurrentUser();
      return msg.data;
    } catch (error) {
      history.push(loginPath);
    }
    return undefined;
  };

  // 如果不是登录页面，执行
  const { location } = history;
  if (location.pathname !== loginPath) {
    const currentUser = await fetchUserInfo();
    return {
      fetchUserInfo,
      currentUser,
      settings: defaultSettings as Partial<LayoutSettings>,
    };
  }

  return {
    fetchUserInfo,
    settings: defaultSettings as Partial<LayoutSettings>,
  };
}

export const layout = ({ initialState }) => {
  return {
    menu: {
      locale: false,
      params: {
        username: initialState?.currentUser?.username,
      },
      request: async () => {
        const menuData = await getMenuList();
        return fixMenuItemIcon(menuData.data);
      },
    },
    actionsRender: (props) => {
      return [
        <div key={'dateString'} style={{ color: '#fff', fontSize: 14 }}>
          {dayjs().locale('zh-cn').format('YYYY年MM月DD日 dddd')}
        </div>,
      ];
    },
    avatarProps: {
      title: <AvatarName />, //右上角名称
      size: 'small',
      src: initialState?.currentUser?.avatar || undefined, //右上角头像
      render: (_, avatarChildren) => {
        return <AvatarDropdown menu={true}>{avatarChildren}</AvatarDropdown>;
      },
    },
    disableContentMargin: false,
    waterMarkProps: {
      content: initialState?.currentUser?.name,
    },
    footerRender: () => <Footer />,
    onPageChange: async (location: Location) => {
      // 页面切换时触发
      console.log('页面切换时触发', initialState, location);
      const accessToken = await localforage.getItem('access_token');
      if (!initialState?.currentUser && !accessToken && location.pathname !== loginPath) {
        history.push(loginPath);
      }
    },
    links: isDev
      ? [
          <Link key="openapi" to="/umi/plugin/openapi" target="_blank">
            <LinkOutlined />
            <span>OpenAPI 文档</span>
          </Link>
        ]
      : [],
    menuHeaderRender: undefined,
    childrenRender: (children) => {
      // if (initialState?.loading) return <PageLoading />;
      return children;
    },
    ...initialState?.settings,
    menuItemRender: (menuItemProps: menuProType, defaultDom: any) => {
      if (menuItemProps.isUrl || !menuItemProps.path) {
        return defaultDom;
      }
      // 支持二级菜单显示icon
      return menuItemProps.target ? (
        <Link to={menuItemProps.path} target={menuItemProps.target}>
          {menuItemProps.pro_layout_parentKeys && menuItemProps.pro_layout_parentKeys.length > 1 && menuItemProps.icon}
          {defaultDom}
        </Link>
      ) : (
        <Link to={menuItemProps.path}>
          {menuItemProps.pro_layout_parentKeys && menuItemProps.pro_layout_parentKeys.length > 1 && menuItemProps.icon}
          {defaultDom}
        </Link>
      );
    },
  };
};
