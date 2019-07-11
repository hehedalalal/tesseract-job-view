export default {
  listToMap: (list, keyName, valueName) => {
    const map = new Map()
    for (const item of list) {
      if (!keyName) {
        keyName = "key"
      }
      if (!valueName) {
        valueName = "value"
      }
      map.set(item[keyName], item[valueName])
    }
    console.log(map)
    return map
  }

}
