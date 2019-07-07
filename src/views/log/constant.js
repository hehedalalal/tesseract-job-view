import commonUtils from '@/utils/commonUtils'

const statusList = [{ key: 0, value: '失败' }, { key: 1, value: '成功' }, { key: 2, value: '执行中' }]
export default {
  statusMap: commonUtils.listToMap(statusList)
}
