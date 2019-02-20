import Vue from 'vue'
import Vuex from 'vuex'
import axiosAuth from './axios-auth'
import axios from 'axios'

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
    }
  },
  actions: {
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
          dispatch('storeUser', authData)
          console.log(response);
        } catch (error) {
          console.log(error);
        }
    },
    async login({commit}, authData) {
        try {
          const response = await axiosAuth.post('verifyPassword?key=AIzaSyCsucng1viJQWlYaHqTioDbn-Y7AxTSJBs', {
            email: authData.email,
            password: authData.password,
            returnSecureToken: true
          });
          commit('authUser', {
            token: response.data.idToken,
            userId: response.data.localId
          });
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