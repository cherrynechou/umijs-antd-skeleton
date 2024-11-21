import request from '@/utils/request';

/**
 * 登录
 * @param params
 */
export function login(params: any = {}) {
  return request.post('/oauth/login', params);
}