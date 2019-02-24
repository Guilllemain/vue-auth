import Vue from 'vue'
import Vuex from 'vuex'
import axiosAuth from './axios-auth'
import axios from 'axios'
import router from './router'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    idToken: null,
    userId: null,
    user: null
  },
  mutations: {
    authUser (state, userData) {
        state.idToken = userData.token;
        state.userId = userData.userId;
    },
    storeUser (state, user) {
      state.user = user;
    },
    clearData (state) {
        state.idToken = null;
        state.userId = null;
    }
  },
  actions: {
    setLogoutTimer({commit}, duration) {
        setTimeout(() => {
            dispatch('logout')
        }, duration * 1000)
    },
    async signUp({commit, dispatch}, authData) {
        try {
          const response = await axiosAuth.post('signupNewUser?key=AIzaSyCsucng1viJQWlYaHqTioDbn-Y7AxTSJBs', {
            email: authData.email,
            password: authData.password,
            returnSecureToken: true
          });
          commit('authUser', {
            token: response.data.idToken,
            userId: response.data.localId
          });
          const now = new Date();
          const expirationDate = new Date(now.getTime() + response.data.expiresIn * 1000);
          localStorage.setItem('token', response.data.idToken);
          localStorage.setItem('userId', response.data.localId);
          localStorage.setItem('expirationDate', expirationDate);
          dispatch('storeUser', authData);
          dispatch('setLogoutTimer', response.data.expiresIn);
          router.replace('/dashboard');
          console.log(response);
        } catch (error) {
          console.log(error);
        }
    },
    autoLogin({commit}) {
        const token = localStorage.getItem('token');
        if (!token) return;
        const expirationDate = localStorage.getItem('expirationDate');
        const now = new Date();
        if (now >= expirationDate) return;
        const userId = localStorage.getItem('userId');
        commit('authUser', { token, userId });

    },
    async login({commit, dispatch}, authData) {
        try {
          const response = await axiosAuth.post('verifyPassword?key=AIzaSyCsucng1viJQWlYaHqTioDbn-Y7AxTSJBs', {
            email: authData.email,
            password: authData.password,
            returnSecureToken: true
          });
          const now = new Date();
          const expirationDate = new Date(now.getTime() + response.data.expiresIn * 1000);
          localStorage.setItem('token', response.data.idToken);
          localStorage.setItem('userId', response.data.localId);
          localStorage.setItem('expirationDate', expirationDate);
          commit('authUser', {
            token: response.data.idToken,
            userId: response.data.localId
          });
          dispatch('setLogoutTimer', response.data.expiresIn);
          router.replace('/dashboard');
          console.log(response);
        } catch (error) {
          console.log(error);
        }
    },
    async storeUser({commit, state}, userData) {
      if (!state.idToken) {
        return;  
      }
      try {
        const response = await axios.post(`users.json?auth=${state.idToken}`, userData);
        console.log(response);
      } catch (error) {
        console.log(error)
      }
    },
    async fetchUser({commit, state}) {
      if (!state.idToken) {
        return;  
      }
      try {
        const response = await axios.get(`users.json?auth=${state.idToken}`);
        console.log(response);
      } catch (error) {
        console.log(error)
      }
    },
    logout({commit}) {
        commit('clearData');
        localStorage.removeItem('expirationDate');
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        router.replace('/');
    }
  },
  getters: {
    user (state) {
      return state.user;
    },
    isAuthenticated (state) {
      return state.idToken !== null;
    }
  }
})