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
