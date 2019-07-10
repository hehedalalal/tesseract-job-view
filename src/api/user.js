import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/tesseract-user/login',
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

export function addUser(data) {
  return request({
    url: '/tesseract-user/addUser',
    method: 'post',
    data: data
  })
}

export function statisticsUser(params) {
  return request({
    url: '/tesseract-user/statisticsUser',
    method: 'get',
    params: params
  })
}

export function getUserCount(params) {
  return request({
    url: '/tesseract-user/getUserCount',
    method: 'get',
    params: params
  })
}

export function passwordRevert(params) {
  return request({
    url: '/tesseract-user/passwordRevert',
    method: 'get',
    params: params
  })
}

export function validUser(params) {
  return request({
    url: '/tesseract-user/validUser',
    method: 'get',
    params: params
  })
}

export function invalidUser(params) {
  return request({
    url: '/tesseract-user/invalidUser',
    method: 'get',
    params: params
  })
}

export function deleteUser(params) {
  return request({
    url: '/tesseract-user/deleteUser',
    method: 'get',
    params: params
  })
}
