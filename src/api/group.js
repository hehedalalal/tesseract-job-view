import request from '@/utils/request'

export function getAllGroup(params) {
  return request({
    url: '/tesseract-group/allGroup',
    method: 'get',
    params: params
  })
}

export function getAllGroupByPage(params) {
  return request({
    url: '/tesseract-group/groupList',
    method: 'get',
    params: params
  })
}

export function addGroup(data) {
  return request({
    url: '/tesseract-group/addGroup',
    method: 'post',
    data: data
  })
}

export function deleteGroup(data) {
  return request({
    url: '/tesseract-group/deleteGroup',
    method: 'get',
    params: data
  })
}
