import { login, logout, getInfo } from '@/api/login'
import { getToken, removeToken } from '@/utils/auth'
import { closeWebSocket } from '@/websocket'
import md5 from 'js-md5'

const user = {
  state: {
    token: getToken(),
    adminName: '',
    adminPhone: '',
    adminType: ''
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_ADMIN_NAME: (state, adminName) => {
      state.adminName = adminName
    },
    SET_ADMIN_PHONE: (state, adminPhone) => {
      state.adminPhone = adminPhone
    },
    SET_ADMIN_TYPE: (state, adminType) => {
      state.adminType = adminType
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const username = userInfo.username.trim()
      const password = md5(userInfo.password.trim())
      console.log(password)
      return new Promise((resolve, reject) => {
        login(username, password).then(response => {
          if (response.code !== -1 && response.data !== '') {
            commit('SET_TOKEN', response.data.adminId)
          }
          resolve(response)
        }).catch(error => {
          console.log(error)
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo(state.token).then(response => {
          const data = response.data
          commit('SET_ADMIN_NAME', data.adminName)
          commit('SET_ADMIN_PHONE', data.adminPhone)
          commit('SET_ADMIN_TYPE', data.adminType)
          resolve(data)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ADMIN_NAME', '')
          commit('SET_ADMIN_PHONE', '')
          commit('SET_ADMIN_TYPE', '')
          removeToken()
          resolve()
          closeWebSocket()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    }
  }
}

export default user
