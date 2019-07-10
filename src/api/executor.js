import request from '@/utils/request'

export function getAllExecutor(params) {
  return request({
    url: '/tesseract-executor/executorList',
    method: 'get',
    params: params
  })
}

export function getAllExecutorNoDetail(params) {
  return request({
    url: '/tesseract-executor/executorListNoDetail',
    method: 'get',
    params: params
  })
}

export function addExecutor(data) {
  return request({
    url: '/tesseract-executor/addExecutor',
    method: 'post',
    data: data
  })
}

export function deleteExecutor(data) {
  return request({
    url: '/tesseract-executor/deleteExecutor',
    method: 'get',
    params: data
  })
}
