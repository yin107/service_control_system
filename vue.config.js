//src/vue.config.js  这里的webpack配置会和公共的webpack.config.js进行合并
const path = require("path");

function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  lintOnSave: false, //是否再保存的时候使用'eslint-loader进行检查  默认为true  最好修改为false
  chainWebpack: (config) => {
    config.resolve.alias
      .set("@", resolve("src"))
      .set("assets", resolve("src/assets"))
      .set("components", resolve("src/components"))
      .set("network", resolve("src/network"))
      .set("views", resolve("src/views"));
  },
  devServer: {
    open: true,
    proxy: {
      "/pc": {
        target: "http://127.0.0.1:4523/m1/2437227-0-default",
        changeOrigin: true,
      },
    },
    host: "10.23.21.126",
    // httpsn:true,
    port: 8081,
    client: {
      webSocketURL: "ws://10.23.21.126:8081/ws",
    },
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  },
};
