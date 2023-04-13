<template>
  <div>
    <bread-crumb></bread-crumb>
    <el-card style="margin-top: 20px">
      <div style="text-align: left;">
        <span>房产类型：</span>
        <el-radio-group v-model="filter">
          <el-radio-button :label="undefined">全部</el-radio-button>
          <el-radio-button :label="1">住宅</el-radio-button>
          <el-radio-button :label="2">车位</el-radio-button>
          <el-radio-button :label="3">仓库</el-radio-button>
          <el-radio-button :label="4">商户</el-radio-button>
          <el-radio-button :label="5">车库</el-radio-button>
        </el-radio-group>
      </div>
    </el-card>
    <el-card style="margin-top: 20px">
      <!-- 表格 -->
      <el-table :data="tableData">
        <el-table-column
          v-for="item of tableHeader"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
        >
          <div slot-scope="scope" v-if="item.prop === 'type'">
            <el-tag
              :style="{
                backgroundColor: buildingType(scope.row[item.prop]).color,
              }"
              >{{ buildingType(scope.row[item.prop]).value }}</el-tag
            >
          </div>
          <div slot-scope="scope" v-else-if="item.prop === 'created_at'">
            {{ (scope.row[item.prop] * 1000) | formatDate() }}
          </div>
          <div slot-scope="scope" v-else-if="item.prop === 'detail'">
            {{ detailInfo(scope.row) }}
          </div>
          <div slot-scope="scope" v-else-if="item.prop === 'action'" style="color: blue" class="doaction" @click="gotoDetail(scope.row.id)">查看</div>
          <div v-else slot-scope="scope">
            {{ scope.row[item.prop] }}
          </div>
        </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <pagnation-com
        :pagenum="pagenum"
        :pagesize="pagesize"
        :total="total"
        @handleSizeChange="handleSizeChange"
        @handlechangenum="handlechangenum"
        :pagesizes="pagesizes"
      ></pagnation-com>
    </el-card>
  </div>
</template>

<script>
import { mixins } from "@/minxin/index.js";
import breadCrumb from "components/breadCrumb";
import pagnationCom from "components/pagnationCom";
export default {
  name: "ListVue",
  components: { breadCrumb, pagnationCom },
  mixins: [mixins],
  data() {
    return {
      tableData: [],
      tableHeader: [
        { prop: "id", label: "编号" },
        { prop: "detail", label: "详细" },
        { prop: "type", label: "房产类型" },
        { prop: "created_at", label: "导入时间" },
        { prop: "action", label: "操作" },
      ],
      pagenum: 1,
      pagesize: 10,
      total: 1,
      pagesizes: [20, 50, 100, 200],
      filter: undefined,
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    // 获取数据
    getData() {
      this.$request({
        url: "/building/list",
        method: "post",
        data: {
          community_id: this.community_id,
          page_num: this.pagenum,
          page_size:this.pagesize,
          type: this.filter,
        },
      }).then((res) => {
        this.tableData = res.data.data.list;
        this.total = res.data.data.total;
      });
    },
	//查看详情
    gotoDetail(id){
this.$router.push({name:'detailbuilding',query:{id:id}})
	},
    
    handleSizeChange(val) {
      this.pagesize = val;
      this.getData();
    },
    handlechangenum(val) {
      this.pagenum = val;
      this.getData();
    },
  },
  computed: {},
  watch:{
	filter:{
		handler(){
			this.getData()
		}
	}
  }
};
</script>

<style></style>
