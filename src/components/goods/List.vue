<!--  -->
<template>
  <div class="list">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-upload
      action="http://127.0.0.1:8888/api/private/v1/upload"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      list-type="picture"
      :headers="headersObj"
      :on-success="handleSuccess"
    >
      <el-button size="small" type="primary">点击上传</el-button>
      <div slot="tip" class="el-upload__tip">
        只能上传jpg/png文件，且不超过500kb
      </div>
    </el-upload>
    <quill-editor ref="myQuillEditor" v-model="content"></quill-editor>
    <el-card>
      <div id="main" style="width: 600px; height: 400px"></div>
    </el-card>
  </div>
</template>

<script>
import * as echarts from "echarts";
import _ from "lodash";
export default {
  data() {
    return {
      headersObj: {
        Authorization: window.sessionStorage.getItem("token"),
      },
      content: "",
      options: {
        title: {
          text: "用户来源",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#E9EEF3",
            },
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            boundaryGap: false,
          },
        ],
        yAxis: [
          {
            type: "value",
          },
        ],
      },
    };
  },
  async mounted() {
    var myChart = echarts.init(document.getElementById("main"));
    const { data: res } = await this.$axios.get("reports/type/1");
    console.log(res.data);
    // const result = _.merge(res.data, this.options);
    // console.log(result);
    // 绘制图表
    myChart.setOption(res.data);
  },
  methods: {
    handlePreview() {},
    handleRemove() {},
    handleSuccess(response, file, fileList) {
      console.log(response);
      console.log(file);
      console.log(fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
  },
};
</script>
<style scoped>
.list >>> .el-upload-list__item {
  width: 300px;
  margin-left: 10px;
}
.list >>> .el-upload-list {
  display: flex;
}
.list >>> .ql-container {
  min-height: 300px;
}
</style>