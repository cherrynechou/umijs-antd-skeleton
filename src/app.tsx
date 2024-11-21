// 运行时配置

// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
// 更多信息见文档：https://umijs.org/docs/api/runtime-config#getinitialstate
import { AvatarName, AvatarDropdown, Footer } from '@/components';
import type { Settings as LayoutSettings } from '@ant-design/pro-components';
import defaultSettings from '../config/defaultSettings';
import localforage from 'localforage';
import { history } from '@umijs/max';

const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/admin/login';

export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  name: string
}> {
  return {
    name: '@umijs/max',
    settings: defaultSettings as Partial<LayoutSettings>,
  };
}

export const layout = ({initialState }) => {
  return {
    menu: {
      locale: false,
    },
    avatarProps: {
      src: initialState?.currentUser?.avatarUrl || undefined, //右上角头像
      title: <AvatarName />, //右上角名称
      size: 'small',
      render: (_, avatarChildren) => {
        return <AvatarDropdown>{avatarChildren}</AvatarDropdown>
      }
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
      if(!accessToken && location.pathname !== loginPath){
        history.push(loginPath);
      }
    },
    menuHeaderRender: undefined,
    ...initialState?.settings,
  };
};
