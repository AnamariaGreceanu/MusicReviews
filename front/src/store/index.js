import { createStore } from "vuex";
import createPersistedState from "vuex-persistedstate";

export default createStore({
  state: {
    userId: null,
    token: null,
  },
  getters: {},
  mutations: {
    setUserId(state, value) {
      state.userId = value;
    },
    setToken(state, value) {
      state.token = value;
    },
  },
  actions: {},
  modules: {},
  plugins: [
    createPersistedState({
      storage: window.sessionStorage,
    }),
  ],
});
