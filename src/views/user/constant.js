import commonUtils from '@/utils/commonUtils'

const userStatusList = [{ key: 0, value: '启用' }, { key: 1, value: '禁用用' }]
export default {
  statusMap: commonUtils.listToMap(userStatusList)
}
