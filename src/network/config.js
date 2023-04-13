import axios from "axios";
const codeMessage = {
  200: "服务器成功返回请求的数据",
  201: "新建或修改数据成功",
  204: "删除数据成功",
  400: "发出的请求有错误，服务器没有进行新建或修改数据的操作",
  401: "用户没有访问权限（令牌、用户名、密码错误）",
};
export function request(config) {
  const instance = axios.create({
    baseURL: "/pc",
  });
  instance.interceptors.request.use(
    (config) => {
      let token = localStorage.getItem("token");
      if (token) {
        config.headers["x-Token"] = token;
      } 
      return config;
    },
    () => {}
  );
  instance.interceptors.response.use(
    (res) => {
      if (Object.keys(codeMessage).includes(`${res.data.code}`)) {
        this.notifySuccess(codeMessage[res.data.code]);
      }
      return res;
    },
    (err) => {
      console.log(err);
      return err;
    }
  );
  return instance(config);
}
