import commonUtils from '@/utils/commonUtils'

const strategyList = [{key: 0, value: 'hash随机'}, {key: 2, value: '负载均衡'}]
const statusList = [{key: null, value: '全部'}, {key: 0, value: '停止'}, {key: 1, value: '已启动'}]
export default {
  strategyList: strategyList,
  statusList: statusList,
  strategyMap: commonUtils.listToMap(strategyList),
  statusMap: commonUtils.listToMap(statusList)
}
