declare namespace API {

  type CurrentUser = {
    userid?: string;
    username?: string;
    name?: string;
    avatar?: string;
    allPermissions?: [];
    roles?: [];
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