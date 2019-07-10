import { login, logout, getUserAuthInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'
import Layout from '@/layout'
import chartsRouter from "../../router/modules/charts";
import nestedRouter from "../../router/modules/nested";
import tableRouter from "../../router/modules/table";
import componentsRouter from '../../router/modules/components'

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  introduction: '',
  roles: [],
  userInfo: null,
  userRouters: [],
  buttons: []
}

const mutations = {
  SET_USER_INFO: (state, userInfo) => {
    state.userInfo = userInfo
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_USERROUTERS: (state, userRouters) => {
    state.userRouters = userRouters
  },
  SET_BUTTONS: (state, buttons) => {
    state.buttons = buttons
  }
}

const actions = {
  // user login
  login({ commit, state }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const userInfo = response
        commit('SET_TOKEN', userInfo.token)
        commit('SET_USER_INFO', userInfo)
        setToken(userInfo.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 获取用户信息
  // get user info
  getUserAuthInfo({ commit, state }) {

    return new Promise((resolve, reject) => {
      // const userInfo = state.userInfo
      // const { roles, name, avatar, introduction } = userInfo
      // // roles must be a non-empty array
      // if (!roles || roles.length <= 0) {
      //   reject('getInfo: roles must be a non-null array!')
      // }
      // commit('SET_ROLES', roles)
      // commit('SET_NAME', name)
      // commit('SET_AVATAR', avatar)
      // commit('SET_INTRODUCTION', introduction)
      // resolve(userInfo)
      // 从后端获取用的权限列表，扔在storage里
      getUserAuthInfo(state.token).then(response => {

        const userAuthInfo = response

        if (!userAuthInfo) {
          reject('Verification failed, please Login again.')
        }

        const { roles, name, avatar, introduction, menuList, btnList } = userAuthInfo
        // roles must be a non-empty array
        if (!roles || roles.length <= 0) {
          reject('getInfo: roles must be a non-null array!')
        }

        /*
        菜单实体类字段:
          name          菜单名称
          path          路径
          url_parttern  路径匹配模式
          redirect      默认转发地址
          level         菜单级别
          title         前端显示名称
          icon          图标
          alwaysShow    是否一直显示
         */

        /*
        模拟数据
        const menuRouters = [
          {
            path: '/permission',
            component: Layout,
            redirect: '/permission/page',
            alwaysShow: true, // will always show the root menu
            name: 'Permission12121212',
            meta: {
              title: 'Permission121211212'
              // icon: 'lock'
              // roles: ['admin', 'editor'] // you can set roles in root nav
            },
            children: [
              {
                path: 'page',
                component: () => import('@/views/permission/page'),
                name: 'PagePermission',
                meta: {
                  title: 'PagePermission',
                  fullPath:'/',
                  // roles: ['admin'] // or you can only set roles in sub nav
                }
              },
              {
                path: 'directive',
                component: () => import('@/views/permission/directive'),
                name: 'DirectivePermission',
                meta: {
                  title: 'DirectivePermission'
                  // if do not set roles, means: this page does not require permission
                }
              }
            ]
          },
          // 404 page must be placed at the end !!!
          { path: '*', redirect: '/404', hidden: true }
        ]*/
        // 存放路由数据
        const menuRouters = []
        // 获取一级菜单路由
        menuList.forEach((m, i) => {
          if (m.parentId == null || m.parentId === 0) {
            m.fullPath = '/' + m.path
            const module = {
              path: '/' + m.path,
              component: Layout,
              redirect: '/permission/page', // 后端返回，可配置
              alwaysShow: true,
              meta: { id: m.id, title: m.name, fullPath: '/' + m.path }
            }
            menuRouters.push(module)
          }
        })

        // 定义递归方法
        function convertTree(routers) {
          routers.forEach(r => {
            menuList.forEach((m, i) => {
              if (m.parentId && m.parentId === r.meta.id) {
                if (!r.children) r.children = []
                m.fullPath = r.meta.fullPath + '/' + m.path
                const menu = {
                  path: m.path,
                  // 注意: webpack 编译es6 动态引入 import() 时不能传入变量。需要字符串模板。坑
                  component: () => import(`@/views${m.fullPath}`),
                  meta: { id: m.id, title: m.name, fullPath: r.meta.fullPath + '/' + m.path }
                }
                r.children.push(menu)
              }
            })
            if (r.children) convertTree(r.children)
          })
        }

        // 递归填充
        convertTree(menuRouters)

        /* 调试代码
        const routers = {
            path: '/icon',
            component: Layout,
            children: [
              {
                path: 'index',
                component: () => import('@/views/icons/index'),
                name: 'Icons',
                meta: { title: 'Icons', icon: 'icon', noCache: true }
              }
            ]
        }
        menuRouters.push(routers)*/
        console.info(menuRouters)
        commit('SET_USERROUTERS', menuRouters)
        commit('SET_BUTTONS', btnList)
        commit('SET_ROLES', roles)
        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        commit('SET_INTRODUCTION', introduction)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        resetRouter()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  changeRoles({ commit, dispatch }, role) {
    return new Promise(async resolve => {
      const token = role + '-token'

      commit('SET_TOKEN', token)
      setToken(token)

      const { roles } = await dispatch('getInfo')

      resetRouter()

      // generate accessible routes map based on roles
      const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })

      // dynamically add accessible routes
      router.addRoutes(accessRoutes)

      // reset visited views and cached views
      dispatch('tagsView/delAllViews', null, { root: true })

      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
