import { createStore } from "vuex";

export default createStore({
  state: {
    userId: null,
  },
  getters: {},
  mutations: {
    setUserId(state, value) {
      state.userId = value;
    },
  },
  actions: {},
  modules: {},
});
