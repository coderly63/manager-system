<!--  -->
<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert
        title="注意！只能为第三级分类设置相关参数"
        type="warning"
        :closable="false"
        show-icon
      >
      </el-alert>
      <el-row class="cat_row">
        <el-col>
          <span>选择商品分类：</span>
          <el-cascader
            v-model="selectedCateKeys"
            :options="cateList"
            @change="handleCascaderChange"
            :props="cateProps"
          ></el-cascader>
        </el-col>
      </el-row>
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            size="mini"
            @click="addDialogVisible = true"
            :disabled="isBtnDisabled"
            >添加参数</el-button
          >
          <el-table :data="tableData" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="handleClose(i, scope.row)"
                  >{{ item }}</el-tag
                >
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column
              prop="attr_name"
              label="参数名称"
            ></el-table-column>
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
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            size="mini"
            @click="addDialogVisible = true"
            :disabled="isBtnDisabled"
            >添加属性</el-button
          >
          <el-table :data="tableData" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="handleClose(i, scope.row)"
                  >{{ item }}</el-tag
                >
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column
              prop="attr_name"
              label="属性名称"
            ></el-table-column>
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
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <el-dialog
      :title="`添加${titleText}`"
      :visible.sync="addDialogVisible"
      width="30%"
    >
      <span>这是一段信息</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addDialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cateList: [],
      selectedCateKeys: [],
      cateProps: {
        checkStrictly: true,
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      activeName: "many",
      tableData: [],
      addDialogVisible: false,
    };
  },
  computed: {
    isBtnDisabled() {
      if (this.selectedCateKeys.length !== 3) return true;
      else return false;
    },
    titleText() {
      if (this.activeName === "many") return "动态属性";
      else return "静态属性";
    },
  },
  created() {
    this.getCateList();
  },
  methods: {
    async saveAttrValues(row) {
      const { data: res } = await this.$axios.put(
        `categories/${this.cateId()}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(" "),
        }
      );
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.$message.success(res.meta.msg);
    },
    handleClose(i, row) {
      row.attr_vals.splice(i, 1);
      this.saveAttrValues(row);
    },
    async handleInputConfirm(row) {
      console.log(row);
      if (row.inputValue.trim().length === 0) {
        row.inputValue = "";
        row.inputVisible = false;
        return;
      }
      row.attr_vals.push(row.inputValue.trim());
      this.saveAttrValues(row);
      row.inputValue = "";
      row.inputVisible = false;
    },
    showInput(row) {
      row.inputVisible = true;
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    cateId() {
      if (this.selectedCateKeys.length === 3)
        return this.selectedCateKeys[this.selectedCateKeys.length - 1];
      else return null;
    },
    handleTabClick() {
      this.handleCascaderChange();
      console.log(this.activeName);
    },
    async getCateList() {
      const { data: res } = await this.$axios.get("categories");
      if (res.meta.status !== 200) return this.$message.error("获取失败");
      this.cateList = res.data;
      console.log(this.cateList);
    },
    async handleCascaderChange() {
      if (this.selectedCateKeys.length !== 3) {
        this.selectedCateKeys = [];
        this.tableData = [];
        return;
      }
      this.tableData = [];
      const { data: res } = await this.$axios.get(
        `categories/${this.cateId()}/attributes`,
        {
          params: {
            sel: this.activeName,
          },
        }
      );
      if (res.meta.status !== 200) return this.$message.error("获取失败");
      console.log(res.data);
      res.data.forEach((item) => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(" ") : [];
        item.inputVisible = false;
        item.inputValue = "";
      });
      console.log(res.data);
      this.tableData = res.data;
    },
  },
};
</script>
<style lang='less' scoped>
.cat_row {
  margin: 10px 3px;
}
.el-tag {
  margin: 10px;
}
.input-new-tag {
  width: 130px;
}
</style>