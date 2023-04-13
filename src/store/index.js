import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);
import tags from "./tags";
const store = new Vuex.Store({
  state: {
    token: localStorage.getItem("token") ? localStorage.getItem("token") : "",
    userInfo: {},
    postInfo: {},
    sliderbgc: 1,
    headbgc: 1,
  },
  getters: {
    getToken(state) {
      return state.token;
    },
    getUserInfo(state) {
      return state.userInfo;
    },
    getPostInfo(state) {
      return state.postInfo;
    },
  },
  mutations: {
    convertbgc(state, val) {
      state.sliderbgc = val;
    },
    convertheadbgc(state, val) {
      state.headbgc = val;
    },
    setToken(state, val) {
      state.token = val;
      localStorage.setItem("token", JSON.stringify(val));
    },
    removeToken(state) {
      state.token = null;
      localStorage.removeItem("token");
    },
    setUserInfo(state, val) {
      state.userInfo = Object.assign({}, val); //不能assign（userinfo，val）因为退出登录的时候并没有清空vuex存储的这个信息
    },
    setPostInfo(state, val) {
      state.postInfo = Object.assign({}, val);
    },
  },
  modules:{
	tags
  }
});
export default store;
