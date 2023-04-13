<template>
  <div>
    <bread-crumb>
      <span
        slot="goback"
        style="float: right"
        @click="$router.go(-1)"
        class="doaction"
      >
        返回</span
      ></bread-crumb
    >

    <el-card style="margin-top: 20px">
      <!-- 步骤 -->
      <el-steps :active="step" align-center>
        <el-step title="上传数据" description="上传房产数据"></el-step>
        <el-step title="数据验证" description="验证数据是否正确"></el-step>
        <el-step title="导入成功" description="房产数据导入成功"></el-step>
      </el-steps>
      <div v-if="step == 1">
        <!-- 上传 -->
        <el-upload
          class="upload-demo"
          drag
          action="/"
          accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          :before-upload="parseFile"
        >
          <i class="el-icon-upload"></i>

          <div class="el-upload-text">
            <p v-if="file">已选择：{{ file.name }}</p>
            点击或拖拽访固定资产导入文件到此处，导入住在、商户数量受许可限制
          </div>
        </el-upload>
        <el-button type="primary" @click="upFileParse">下一步</el-button>
      </div>

      <div v-if="step == 2">
        <table-step2 :tableData="rightData" :tableHead="tableHead2">
          <p slot="title" style="text-align: left">
            可导入数据{{ rightData.length }}条
          </p>
        </table-step2>

        <table-step2 :tableData="errorData" :tableHead="tableHead3">
          <p slot="title" style="text-align: left">
            不可导入数据{{ errorData.length }}条
          </p>
        </table-step2>

        <el-button @click="step--"> 上一步</el-button>
        <el-button type="primary" @click="gotoStep3">下一步</el-button>
      </div>

      <div v-if="step == 3">
        <data-create-suc>
          <div slot="suce-info">数据导入成功</div>
          <div slot="mention-info">本次共导入{{ rightData.length }}条数据</div>
        </data-create-suc>
        <el-button @click="step = 1">继续导入</el-button>
        <el-button @click="gotoList" type="primary">查看房产</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import breadCrumb from "components/breadCrumb";
import tableStep2 from "./components/tableStep2.vue";
import dataCreateSuc from "components/dataCreateSuc.vue";
import { mixins } from "@/minxin";
import DataCreateSuc from "../../../components/dataCreateSuc.vue";
export default {
  components: { breadCrumb, tableStep2, dataCreateSuc, DataCreateSuc },
  mixins: [mixins],
  data() {
    return {
      file: null,
      errorData: [],
      rightData: [],
      step: 1,
      chunkList: [],
      tableHead2: [
        { prop: "detail", label: "详细" },
        { prop: "construction_area", label: "建筑面积" },
        { prop: "name", label: "业主姓名" },
        { prop: "idcard", label: "业主身份证号" },
        { prop: "phone", label: "业主电话号码" },
      ],
    };
  },
  mounted() {},
  computed: {
    tableHead3() {
      let res = [];
      res.push(...this.tableHead2);
      res.push({ prop: "error", label: "错误原因" });
      return res;
    },
  },
  methods: {
    parseFile(file) {
      this.file = file; //文件里面本身就有一个uid
      this.chunkList = this.createChunk(this.file);
      return false;
    },
    //  上传文件、给后端进行解析
    async upFileParse() {
      if (!this.file) {
        this.notifyError("请选择文件");
      } else {
        // 数据处理
        const uploadList = this.chunkList.map(({ file }, index) => ({
          file,
          size: file.size,
          percent: 0,
          chunkName: `${this.file.name}-${index}`,
          fileName: this.file.name,
          index,
        }));
        const requestList = uploadList
          .map(({ file, fileName, index, chunkName }) => {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("fileName", fileName);
            formData.append("chunkName", chunkName);
            return { formData, index };
          })
          .map(({ formData }) => {
            return new Promise((resolve) => {
              //并发请求
              this.$request({
                url: "/building/chunk",
                method: "post",
                data: formData,
              }).then((res) => {
                resolve(res); //需要返回一个状态码
              });
            });
          });

        await Promise.all(requestList).then((res) => {
          //如果res是一个数组，如果每一项都是200，就说明每一个分片都上传成功
          let istrue = res.every((item) => item.data.code === 200);
          // 所有的切片都上传成功之后，在向后端发送请求
          if (istrue) {
            this.getTotalData();
          }
        });
      }
    },
    gotoList() {
      this.step = 1;
      this.file = null;
      this.rightData = [];
      this.errorData = [];
      this.$router.push({ name: "building"});
    },
    //获取全部数据
    getTotalData() {
      this.$request({
        url: "/building/parse",
        method: "post",
        data: {
          id: this.file.uid,
        },
      }).then((res) => {
        this.rightData = res.data.data.rightData;
        this.errorData = res.data.data.errorData;
        this.step++;
        this.file = null;
      });
    },
    //文件切片
    createChunk(file, size = 10 * 1024) {
      const chunkList = [];
      let cur = 0;
      while (cur < file.size) {
        chunkList.push({ file: file.slice(cur, cur + size) });
        cur += size;
      }
      return chunkList;
    },
    //将正确的数据提交到后端
    gotoStep3() {
      this.$request({
        url: "/building/import",
        method: "post",
        data: {
          community_id: this.community_id,
          buildings: this.rightData,
        },
      }).then(() => {
        this.step++;
      });
    },
  },
};
</script>

<style scoped>
.upload-demo {
  width: 80%;
  margin: 20px auto;
  height: auto;
}
</style>
<style>
.upload-demo .el-upload .el-upload-dragger {
  height: auto;
  width: 600px;
  padding-bottom: 20px;
}
</style>
