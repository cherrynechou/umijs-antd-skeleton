// 运行时配置
// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
// 更多信息见文档：https://umijs.org/docs/api/runtime-config#getinitialstate
import { AvatarDropdown, AvatarName, Footer,SelectLang } from '@/components';
import AntWrapApp from '@/components/GlobalMessage';
import { queryCurrentUser } from '@/services/admin/auth/UserController';
import { getMenuList } from '@/services/admin/system/CommonController';
import { LinkOutlined } from '@ant-design/icons';
import type { MenuDataItem, Settings as LayoutSettings } from '@ant-design/pro-components';
import { getLocale, history, Link } from '@umijs/max';
import { App, ConfigProvider } from 'antd';
import { AxiosResponse } from 'axios';
import dayjs from 'dayjs';
import { menuDataRender, menuItemRender, subMenuItemRender } from '@/libs/menuRender';
import defaultSettings from '../config/defaultSettings';

const isDev: boolean = process.env.NODE_ENV === 'development';
const loginPath: string = '/admin/login';

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
        return menuData.data;
      },
    },
    actionsRender: (props) => {
      console.log(props);
      return [
        <div key={'dateString'} style={{ color: '#fff', fontSize: 14 }}>
          {dayjs().locale(getLocale()).format('YYYY-MM-DD dddd')}
        </div>,
        <SelectLang key="SelectLang" />
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
      if (!initialState?.currentUser && location.pathname !== loginPath) {
        history.push(loginPath);
      }
    },
    links: isDev? [
        <Link key="openapi" to="/umi/plugin/openapi" target="_blank">
          <LinkOutlined />
          <span>OpenAPI 文档</span>
        </Link>
      ]
    : [],
    menuHeaderRender: undefined,
    menuDataRender: (menuData:MenuDataItem[]) => menuDataRender(menuData),
    menuItemRender,
    subMenuItemRender,
    childrenRender: (children) => {
      // if (initialState?.loading) return <PageLoading />;
      return children;
    },
    ...initialState?.settings
  };
};
