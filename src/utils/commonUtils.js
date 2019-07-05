export default {
  listToMap: (list) => {
    const map = new Map()
    for (const item of list) {
      map.set(item.key, item.value)
    }
    console.log(map)
    return map
  }

}
