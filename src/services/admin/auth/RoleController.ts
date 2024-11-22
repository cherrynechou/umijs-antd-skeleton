import request from '@/utils/request';

/**
 * 角色 分页列表
 * @param params
 */
export function queryRoles(params: any = {}) {
  return request.get('/auth/roles', {
    params,
  });
}

/**
 * 添加角色
 * @param params
 */
export function createRole(params: any = {}) {
  return request.post('/auth/roles', params);
}

/**
 * 查询角色信息
 * @param id
 */
export function getRole(id: number) {
  return request.get(`/auth/roles/${id}`);
}

/**
 * 更新角色
 * @param id
 * @param params
 */
export function updateRole(id: number, params: any = {}) {
  return request.put(`/auth/roles/${id}`, params);
}

/**
 * 删除角色
 * @param id
 */
export function destroyRole(id: number) {
  return request.delete(`/auth/roles/${id}`);
}

/**
 * 所有角色列表
 */
export function queryAllRoles() {
  return request.get('/role/all');
}
