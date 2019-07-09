import request from '@/utils/request'

export function getAllLog(params) {
  return request({
    url: '/tesseract-log/logList',
    method: 'get',
    params: params
  })
}

export function getLogCount(params) {
  return request({
    url: '/tesseract-log/getLogCount',
    method: 'get',
    params: params
  })
}

export function statisticsLogLine(params) {
  return request({
    url: '/tesseract-log/statisticsLogLine',
    method: 'get',
    params: params
  })
}
export function statisticsLogPie(params) {
  return request({
    url: '/tesseract-log/statisticsLogPie',
    method: 'get',
    params: params
  })
}
