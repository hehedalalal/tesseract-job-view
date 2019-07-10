import commonUtils from '@/utils/commonUtils'

const statusList = [{ key: null, value: '全部' }, { key: 0, value: '禁用' }, { key: 1, value: '启用' }]
export default {
  statusList: statusList,
  statusMap: commonUtils.listToMap(statusList)
}
