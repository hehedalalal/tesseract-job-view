import request from '@/utils/request'

export function getAllLog(params) {
  return request({
    url: '/tesseract-log/logList',
    method: 'get',
    params: params
  })
}
