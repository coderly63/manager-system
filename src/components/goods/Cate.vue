<!--  -->
<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-button type="primary" @click="showAddCateDialog" class="addBtn"
        >添加分类</el-button
      >

      <el-table
        :data="cateList"
        style="width: 100%; margin-bottom: 20px"
        row-key="cat_id"
        border
        :tree-props="{ children: 'children' }"
      >
        <el-table-column type="index" label="#">
          <template slot-scope="scope">{{ scope.row.index }}</template>
        </el-table-column>
        <el-table-column prop="cat_name" label="分类名称" sortable>
        </el-table-column>
        <el-table-column prop="cat_deleted" label="是否有效" sortable>
          <template slot-scope="scope">
            <i
              class="el-icon-circle-check"
              v-if="scope.row.cat_deleted === false"
              style="color: lightgreen"
            ></i>
            <i class="el-icon-circle-close" v-else></i>
          </template>
        </el-table-column>
        <el-table-column prop="cat_level" label="排序">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.cat_level === 0"
              >一级</el-tag
            >
            <el-tag type="warning" v-else-if="scope.row.cat_level === 1"
              >二级</el-tag
            >
            <el-tag type="danger" v-else>三级</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" icon="el-icon-edit"
              >编辑</el-button
            >
            <el-button type="danger" size="mini" icon="el-icon-delete"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-size="queryInfo.pagesize"
        layout="total, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <el-dialog
      title="提示"
      :visible.sync="addCateDialogVisible"
      width="30%"
      @close="addCateDialogClose"
    >
      <el-form
        ref="addCateFormRef"
        :model="addCateForm"
        label-width="80px"
        :rules="addCateFormRules"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
            v-model="selectedKeys"
            :options="parentCateList"
            :props="cascaderProps"
            @change="parentCateChange"
            clearable
            change-on-select
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      addCateFormRules: {
        cat_name: [{ required: true, message: "请输入账号", trigger: "blur" }],
      },
      cascaderProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      cateList: [],
      parentCateList: [],
      selectedKeys: [],
      total: 0,
      addCateDialogVisible: false,
      addCateForm: {
        cat_pid: 0,
        cat_name: "",
        cat_level: 0,
      },
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    // 监听对话框的关闭
    addCateDialogClose() {
      this.$refs.addCateFormRef.resetFields();
      this.addCateForm.cat_pid = 0;
      this.addCateForm.cat_level = 0;
      this.selectedKeys = [];
    },
    //点击dialog的确定按钮后提交addCateForm
    addCate() {
      this.$refs.addCateFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$axios.post(
          "categories",
          this.addCateForm
        );
        if (res.meta.status !== 201) return this.$message.error("更改失败");
        this.addCateDialogVisible = false;
        this.$message.success(res.meta.msg);
        this.getCateList();
      });
    },
    parentCateChange() {
      console.log(this.selectedKeys);
      if (this.selectedKeys.length > 0) {
        this.addCateForm.cat_pid = this.selectedKeys[
          this.selectedKeys.length - 1
        ];
        this.addCateForm.cat_level = this.selectedKeys.length;
      } else {
        this.addCateForm.cat_pid = 0;
        this.addCateForm.cat_level = 0;
      }
    },

    async getParentCateList() {
      const { data: res } = await this.$axios.get("categories", {
        params: { type: 2 },
      });
      if (res.meta.status !== 200) return this.$message.error("请求失败");
      this.parentCateList = res.data;
      console.log(this.parentCateList);
    },

    showAddCateDialog() {
      this.addCateDialogVisible = true;
      this.getParentCateList();
    },

    handleCurrentChange(currentPage) {
      this.queryInfo.pagenum = currentPage;
      this.getCateList();
    },

    async getCateList() {
      const { data: res } = await this.$axios.get("categories", {
        params: this.queryInfo,
      });
      if (res.meta.status !== 200) return this.message.error("获取失败");
      this.cateList = res.data.result;
      this.total = res.data.total;
      if (this.cateList) this.setTableIndex(this.cateList);
    },

    //给cateList绑定index
    setTableIndex(arr) {
      arr.forEach((item, key) => {
        item.index = key + 1;
        if (item.children) {
          this.setTableIndex(item.children);
        }
      });
    },
  },
};
</script>
<style lang='less' scoped>
.addBtn {
  float: left;
  margin-bottom: 10px;
}
</style>