import { createStore } from 'vuex';
import { getUser, updateUser, login, register, logout } from '@/api/user.js';
import { verifyHostUser } from '@/api/host.js';
import { getToken, setToken, removeToken, removeJwtToken } from '@/utils/auth';

export default createStore({
  state: {
    userInfo: {},
    token: getToken() || '',
    isHost: -1, // -1 未知， 0 不是host，1 是host
  },
  getters: {},
  mutations: {
    setUser(state, payload) {
      state.userInfo = payload;
    },
    setToken(state, payload) {
      state.token = payload;
    },
    setIsHost(state, payload) {
      state.isHost = payload;
    },
    clearStore(state) {
      state.userInfo = {};
      state.token = '';
      state.isHost = -1;
    },
  },
  actions: {
    // 登录
    login({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo)
          .then((res) => {
            if (res?.token) {
              setToken(res.token);
              commit('setToken', res.token);
              resolve();
            } else {
              reject(new Error('login fail'));
            }
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    // 注册
    signUp({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        register(userInfo)
          .then((res) => {
            if (res?.key) {
              setToken(res.key);
              commit('setToken', res.key);
              resolve();
            } else {
              reject(new Error('sign up fail'));
            }
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    // 获取当前用户信息
    getUserInfo({ commit }) {
      return getUser().then((res) => {
        commit('setUser', res);
      });
    },

    // 更新当前用户信息
    updateUser({ commit }, userInfo) {
      return updateUser(userInfo).then((res) => {
        commit('setUser', res);
      });
    },

    // 退出系统
    logOut({ commit }) {
      return new Promise((resolve, reject) => {
        logout()
          .then((res) => {
            removeToken();
            removeJwtToken();
            commit('clearStore');
            resolve(res);
          })
          .catch((error) => {
            removeToken();
            removeJwtToken();
            commit('clearStore');
            resolve();
          });
      });
    },

    // 验证用户是否是host
    verifyHostUser({ commit }) {
      return verifyHostUser().then(
        (res) => {
          commit('setIsHost', 1);
        },
        (err) => {
          commit('setIsHost', 0);
        }
      );
    },
  },
  modules: {},
});
