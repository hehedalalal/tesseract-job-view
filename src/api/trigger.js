import request from '@/utils/request'

export function getAllTrigger(params) {
  return request({
    url: '/tesseract-trigger/triggerList',
    method: 'get',
    params: params
  })
}

export function addTrigger(data) {
  return request({
    url: '/tesseract-trigger/addTrigger',
    method: 'post',
    data: data
  })
}
