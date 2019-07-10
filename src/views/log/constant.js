import commonUtils from '@/utils/commonUtils'

const statusList = [{ key: null, value: '全部' }, { key: 0, value: '失败' }, { key: 1, value: '成功' }, { key: 2, value: '执行中' }]
export default {
  statusList: statusList,
  statusMap: commonUtils.listToMap(statusList)
}
