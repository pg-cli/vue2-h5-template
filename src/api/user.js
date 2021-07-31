import request from '@/utils/requests'

// 登录
export function login(data) {
  return request({
    url: '/login',
    method: 'post',
    data
  })
}

// 用户名称 get 方法
export function getUserName(params) {
  return request({
    url: '/get-username',
    method: 'get',
    params,
    loading: true
  })
}
