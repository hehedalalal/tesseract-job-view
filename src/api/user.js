import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/tesseract-user/login',
    method: 'post',
    data
  })
}

// 根据 token 获取用户权限信息
export function getUserAuthInfo(data) {
  return request({
    url: '/tesseract-user/getUserAuthInfo',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/tesseract-user/logout',
    method: 'post'
  })
}
export function getAllUser(params) {
  return request({
    url: '/tesseract-user/userList',
    method: 'get',
    params: params
  })
}

export function addTrigger(data) {
  return request({
    url: '/tesseract-user/addUser',
    method: 'post',
    data: data
  })
}
