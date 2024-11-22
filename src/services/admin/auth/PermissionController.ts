import request from '@/utils/request';

/**
 * 获取权限树型列表
 */
export function queryPermissions() {
  return request.get('/auth/permissions');
}

/**
 * 查询当前权限
 * @param id
 */
export function queryPermission(id: number) {
  return request.get(`/auth/permissions/${id}`);
}

/**
 * 创建权限
 * @param params
 */
export function createPermission(params: any = {}) {
  return request.post('/auth/permissions', params);
}

/**
 * 更新权限
 * @param id
 * @param params
 */
export function updatePermission(id: number, params: any = {}) {
  return request.put(`/auth/permissions/${id}`, params);
}

/**
 * 删除权限
 * @param id
 */
export function destroyPermission(id: number) {
  return request.delete(`/auth/permissions/${id}`);
}

/**
 * 生成权限列表
 */
export function queryAllPermissions() {
  return request.get('/permission/all');
}

/**
 * 获取权限路由
 */
export function queryAllPermissionRoutes() {
  return request.get('/permission/routes');
}
