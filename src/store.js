import Vue from 'vue'
import Vuex from 'vuex'
import axiosAuth from './axios-auth'


Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    idToken: null,
    userId: null
  },
  mutations: {
    authUser (state, userData) {
        state.idToken = userData.token,
        state.userId = userData.userId
    }
  },
  actions: {
    async signUp({commit}, authData) {
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
    }
  },
  getters: {

  }
})