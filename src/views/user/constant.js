import commonUtils from '@/utils/commonUtils'

const userStatusList = [{ key: 0, value: '停止' }, { key: 1, value: '已启动' }, { key: 2, value: '调度器获取中' }]
export default {
  statusMap: commonUtils.listToMap(userStatusList)
}
