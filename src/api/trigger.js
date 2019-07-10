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

export function deleteTrigger(data) {
  return request({
    url: '/tesseract-trigger/delete',
    method: 'get',
    params: data
  })
}

export function executeTrigger(data) {
  return request({
    url: '/tesseract-trigger/execute',
    method: 'get',
    params: data
  })
}

export function startTrigger(data) {
  return request({
    url: '/tesseract-trigger/start',
    method: 'get',
    params: data
  })
}

export function stopTrigger(data) {
  return request({
    url: '/tesseract-trigger/stop',
    method: 'get',
    params: data
  })
}
