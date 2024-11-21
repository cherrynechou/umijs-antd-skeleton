// 运行时配置

// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
// 更多信息见文档：https://umijs.org/docs/api/runtime-config#getinitialstate
import { AvatarName, AvatarDropdown, Footer } from '@/components';


const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/admin/login';

export async function getInitialState(): Promise<{
  name: string
}> {
  return {
    name: '@umijs/max'
  };
}

export const layout = ({initialState }) => {
  return {
    logo: 'https://img.alicdn.com/tfs/TB1YHEpwUT1gK0jSZFhXXaAtVXa-28-27.svg',
    layout: 'mix',
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
    footerRender: () => <Footer />,
    onPageChange: async (location: Location) => {
      // 页面切换时触发
      console.log('页面切换时触发', initialState, location);
    },
  };
};
