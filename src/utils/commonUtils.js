export default {
  listToMap: (list) => {
    const map = new Map()
    for (const item of list) {
      map.set(item.key, item.value)
    }
    console.log(map)
    return map
  },
  //定义一个递归方法
  convertTree: (routers,menuList) => {
    routers.forEach(r => {
      menuList.forEach((m, i) => {
        if (m.parentId && m.parentId == r.meta.id) {
          if (!r.children) r.children = []
          m.fullPath = r.meta.fullPath + '/' + m.path
          let menu = {
            path: m.path,
            component: () => import('@/views'+r.meta.fullPath+'/'+m.path),
          meta: { id: m.id, title: m.title, fullPath: r.meta.fullPath + '/' + m.path }
          }
          r.children.push(menu)
        }
        })
      if (r.children) convertTree(r.children,menuList)
  })
}
}


