// 运行时配置
// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
// 更多信息见文档：https://umijs.org/docs/api/runtime-config#getinitialstate
import { AvatarName, AvatarDropdown, RightContent, Footer } from '@/components';
import type { Settings as LayoutSettings } from '@ant-design/pro-components';
import defaultSettings from '../config/defaultSettings';
import localforage from 'localforage';
import { history,Link } from '@umijs/max';
import { queryCurrentUser } from '@/services/admin/auth/UserController';
import { getMenuList } from '@/services/admin/system/CommonController'
import { BookOutlined, LinkOutlined } from '@ant-design/icons';
import fixMenuItemIcon from '@/utils/fixMenuItemIcon';


const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/admin/login';

export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: API.LoginResponse;
  loading?: boolean;
  fetchUserInfo?: () => Promise<API.LoginResponse | undefined>;
}> {

  const fetchUserInfo = async () => {
    try {
      const msg = await queryCurrentUser();
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

export const layout = ({initialState }) => {
  return {
    menu: {
      params: {
        username: initialState?.currentUser?.username,
      },
      request: async () => {
        const menuData = await getMenuList();
        return fixMenuItemIcon(menuData.data);
      },
    },
    avatarProps: {
      src: initialState?.currentUser?.avatar || undefined, //右上角头像
      title: <AvatarName />, //右上角名称
      size: 'small',
      render: (_, avatarChildren) => {
        return <AvatarDropdown>{avatarChildren}</AvatarDropdown>
      }
    },
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    waterMarkProps: {
      content: initialState?.currentUser?.name,
    },
    footerRender: () => <Footer />,
    onPageChange: async (location: Location) => {
      // 页面切换时触发
      console.log('页面切换时触发', initialState, location);
      const accessToken = await localforage.getItem('access_token');
      if(!initialState?.currentUser && !accessToken && location.pathname !== loginPath){
        history.push(loginPath);
      }
    },
    links: isDev
     ? [
        <Link to="/umi/plugin/openapi" target="_blank">
          <LinkOutlined />
          <span>OpenAPI 文档</span>
        </Link>,
        <Link to="/~docs">
          <BookOutlined />
          <span>业务组件文档</span>
        </Link>,
     ]: [],
    menuHeaderRender: undefined,
    childrenRender: (children) => {
      // if (initialState?.loading) return <PageLoading />;
      return children;
    },
    ...initialState?.settings,
  };
};
