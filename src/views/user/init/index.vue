<template>
  <div>
    <div class="header">系统初始化信息</div>
    <!-- 信息 -->
    <div class="info">
      <!-- 个人信息 -->
      <el-card class="box-card">
        <div slot="header">
          <span>个人基本资料</span>
        </div>
        <!-- form表单区域 -->

        <el-form
          ref="usermessForm"
         :rules="usermessRules"
          :model="usermessForm"
          inline
        >
          <el-form-item label="姓名" prop="real_name" width="200">
            <el-input v-model="usermessForm.real_name"></el-input>
          </el-form-item>
          <el-form-item label="身份证号码" prop="idcard">
            <el-input v-model="usermessForm.idcard"></el-input>
          </el-form-item>
          <el-form-item label="手机号码" prop="phone">
            <el-input v-model="usermessForm.phone"></el-input>
          </el-form-item>
          <el-form-item label="登录账号" prop="account">
            <el-input v-model="usermessForm.account"></el-input>
          </el-form-item>
          <el-form-item label="登录密码" prop="password">
            <el-input
              v-model="usermessForm.password"
              type="password"
            ></el-input>
          </el-form-item>
          <el-form-item label="确认登录密码" prop="password2">
            <el-input
              v-model="usermessForm.password2"
              type="password"
            ></el-input>
          </el-form-item>
        </el-form>
      </el-card>

      <!-- 小区信息 -->
      <el-card class="box-card">
        <div slot="header">
          <span>初始化小区信息</span>
        </div>
        <el-form ref="commuForm" :model="commuForm" 
		:rules="commuRules"
		inline >
          <el-form-item label="小区名称" prop="name">
            <el-input v-model="commuForm.name"></el-input>
          </el-form-item>
          <el-form-item label="小区所在地" prop="address">
            <el-input v-model="commuForm.address"></el-input>
          </el-form-item>
          <el-form-item label="客服电话" prop="service_phone">
            <el-input v-model="commuForm.service_phone"></el-input>
          </el-form-item>
          <el-form-item label="NFC门禁" prop="access_nfc">
            <el-switch
              v-model="commuForm.access_nfc"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :active-value="1"
              :inactive-value="0"
            >
            </el-switch>
          </el-form-item>
          <el-form-item label="二维码门禁" prop="access_qrcode">
            <el-switch
              v-model="commuForm.access_qrcode"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :active-value="1"
              :inactive-value="0"
            >
            </el-switch>
          </el-form-item>
          <el-form-item label="远程开门" prop="access_remote">
            <el-switch
              v-model="commuForm.access_remote"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :active-value="1"
              :inactive-value="0"
            >
            </el-switch>
          </el-form-item>
          <el-form-item label="装修保证金" prop="fitment_pledge">
            <el-switch
              v-model="commuForm.fitment_pledge"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :active-value="1"
              :inactive-value="0"
            >
            </el-switch>
          </el-form-item>
          <el-form-item label="车位绑定车辆数" prop="carport_max_car">
            <el-input-number
              v-model="commuForm.carport_max_car"
              controls-position="right"
              :min="1"
            ></el-input-number>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
    <el-button @click="$router.push({ name: 'login' })">返回登录页</el-button>
    <el-button @click="regester()" type="primary">注册</el-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      usermessForm: {
        real_name: "",
        idcard: "",
        avatar_url: undefined,
        phone: undefined,
        account: '',
        password: '',
        password2: '',
      },
      //   需要自定义一些校验规则
      usermessRules: {
        real_name: [
          { required: true, message: "请输入您的真实姓名" },
          { max: 8, message: "姓名不能超过8个字符" },
        ],
        idcard: [
          { required: true, message: "请输入您的身份证号码" },
          { pattern: /^\d{17}\d|x$/i, message: "请输入正确的身份证号码" },
        ],
        phone: [
          { required: true, message: "请输入您的手机号码" },
          { pattern: /^\d{11}$/, message: "请输入正确的手机号码" },
        ],
        account: [
          { required: true, message: "请输入账号" },
          { min: 4, message: "账号的长度应该大于4个字符" },
        ],
        password: [
          { required: true, message: "请输入密码" },
          { min: 6, message: "密码的长度应该大于6个字符" },
        ],
        password2: [
          { required: true, message: "请确认密码" },
          { min: 6, message: "密码的长度应该大于6个字符" },
          {
            validator: (rule, val, cb) => {
              if (
                val &&
                this.usermessForm.password &&
                val === this.usermessForm.password
              ) {
                cb();
              } else {
                new Error("两次输入的密码不一致");
              }
            },
            message: "两次输入的密码不一致",
          },
        ],
      },
      commuForm: {
        name: "",
        address: '',
        service_phone: "",
        banner: "",
        access_nfc: 0,
        access_qrcode: 0,
        access_remote: 0,
        fitment_pledge: 0,
        carport_max_car: 1,
      },
      commuRules: {
        name: [
          { required: true, message: "请输入小区名称" },
          { max: 12, message: "小区名称不能超过12个字符" },
        ],
        address: [{ required: true }],
        service_phone: [
          { required: true, message: "请输入小区客户电话" },
          { pattern: /^\d{11}$/, message: "请输入正确的电话号码" },
        ],
        access_nfc: [{ required: true, type: "number" }],
        access_qrcode: [{ required: true, type: "number" }],
        access_remote: [{ required: true, type: "number" }],
        fitment_pledge: [{ required: true, type: "number" }],
        carport_max_car: [
          {
            required: true,
            pattern: /^\d+$/,
            message: "请输入正确的车位可绑定车辆的数目",
          },
        ],
      },
    };
  },
  methods: {
    checkForm(forName) {
      return new Promise((resolve, reject) => {
        this.$refs[forName].validate((valid) => {
          if (valid) {
            resolve();
          } else {
            reject("请输入正确的信息");
          }
        });
      });
    },
    regester() {
      // 先对两个form表单进行验证
      Promise.all([this.checkForm("usermessForm"), this.checkForm("commuForm")])
        .then(() => {
          //表单验证成功的话，就发送请求
          const { code, state } = this.$route.query;
          const obj2 = {
            province: "湖南省",
            city: "邵阳市",
            district: "洞口",
            code,
            state,
			open_id:1
          };
          const data = Object.assign(this.usermessForm, this.commuForm, obj2);

          delete data.address;
          this.$request({
            url: "/init/run",
            method: "post",
            data: data,
          })
            .then((res) => {
				console.log(res);
            // if(res.data.code==200){
			// 	this.notifySuccess('初始化成功');
			// }   在响应拦截器中进行
            })
            .catch((err) => {
              this.notifyError(err);
            });
        })
        .catch((err) => {
          this.notifyError(err);
        });
    },
  },
  name:"indexVue"
};
</script>

<style scoped>
.header {
  width: 100vw;
  height: 80px;
  line-height: 80px;
  font-size: 25px;
  text-align: center;
  margin-bottom: 20px;
  background-color: #fff;
}
.box-card {
  width: 90%;
  margin: 20px auto;
}
</style>
