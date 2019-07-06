import commonUtils from '@/utils/commonUtils'

const strategyList = [{ key: 0, value: 'hash随机' }, { key: 1, value: '轮询' }]
const statusList = [{ key: 0, value: '停止' }, { key: 1, value: '已启动' }, { key: 2, value: '已启动' }]
export default {
  strategyList,
  strategyMap: commonUtils.listToMap(strategyList),
  statusMap: commonUtils.listToMap(statusList)
}
