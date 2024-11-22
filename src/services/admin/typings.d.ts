declare namespace API {

  type CurrentUser = {
    name?: string;
    avatar?: string;
    userid?: string;
    email?: string;
    signature?: string;
    title?: string;
    group?: string;
    tags?: { key?: string; label?: string }[];
    notifyCount?: number;
    unreadCount?: number;
    access?: string;
    address?: string;
    phone?: string;
  };


  type LoginResponse = {
    /** token */
    token: string;
    /** 权限列表 */
    access: string[];
    /** 用户昵称 */
    nickname: string;
    /** 用户头像 */
    avatarUrl: string;
  };
}