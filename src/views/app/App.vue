<template>
  <div id="app">
    <el-container v-if="layout === 'slider'">
      <el-aside width="200px">
        <nav-aside></nav-aside>
      </el-aside>
      <el-container>
        <el-header :style="{backgroundColor: headbgcchose,height:'100px',textAlign:'left'}">
          <header-vue
            :postInfo="getPostInfo"
            :userInfo="getUserInfo"
          ></header-vue>
        </el-header>
        <el-main>
          <keep-alive :include="['basicIndex', 'petVue']">
            <router-view></router-view>
          </keep-alive>
        </el-main>
      </el-container>
    </el-container>
    <router-view v-else></router-view>
  </div>
</template>

<script>
import navAside from "./components/nav.vue";
import headerVue from "./components/header.vue";
import { mapGetters } from "vuex";

export default {
  name: "App",
  components: {
    navAside,
    headerVue,
  },
  created() {

  },
  computed: {
    ...mapGetters(["getUserInfo", "getPostInfo"]),
    layout() {
      return this.$route.meta.layout;
    },
    headbgcchose() {
      let color;
      switch (this.$store.state.headbgc) {
        case 1:
          color = "#fff";
          break;
        case 2:
          color = "#545c64";
          break;
        case 3:
          color = "skyblue";
          break;
      }
      return color;
    },
  },
  watch: {
    $route(cur, old) {
      //在首页中刷新页面
      //判断userinfo里面有没有id信息，如果没有的话就要去想后端发送请求获取userinfo和postinfo信息
      if (this.getUserInfo.id == undefined && localStorage.getItem("token")) {
        this.$request({
          url: "/user/info",
          method: "get",
        }).then((res) => {
          if (res.data.code === 200) {
            this.$store.commit("setUserInfo", res.data.data.userInfo);
            this.$store.commit("setPostInfo", res.data.data.postInfo);
          }
        });
      }
    },
  },
};
</script>

<style scoped>
body {
  margin: 0px;
  padding: 0px;
  background-color: #e1e2e2;
}
.el-header,
.el-footer {
  background-color: #ffff;
  color: #333;
  text-align: center;
  line-height: 60px;
}

.el-aside {
  background-color: #ffff;
  color: #333;
  text-align: center;
  height: 100vh;
  overflow: auto;
}
#app {
  min-width: 1310px;
}
.el-main {
  background-color: #e9eef3;
  color: #333;
  text-align: center;

  height: 100vh;
  overflow: auto;
}
.el-container {
  height: 100vh;
  overflow: auto;
}
body > .el-container {
  height: 100vh;
  overflow: auto;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}
</style>
