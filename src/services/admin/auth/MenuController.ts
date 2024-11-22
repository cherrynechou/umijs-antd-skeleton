import request from '@/utils/request';

/**
 * 获取菜单列表
 */
export function queryMenus() {
  return request.get('/auth/menu');
}

/**
 * 创建菜单
 * @param params
 */
export function createMenu(params: any = {}) {
  return request.post('/auth/menu', params);
}

/**
 * 获取当前菜单
 * @param id
 */
export function getMenu(id: number) {
  return request.get(`/auth/menu/${id}`);
}

/**
 * 删除菜单
 * @param id
 */
export function destroyMenu(id: number) {
  return request.delete(`/auth/menu/${id}`);
}

/**
 * 更新
 * @param id
 * @param params
 */
export function updateMenu(id: string, params: any = {}) {
  return request.put(`/auth/menu/${id}`, params);
}

/**
 *
 * @param id
 */
export function switchMenu(id: number) {
  return request.patch(`/menu/${id}/switch`);
}
