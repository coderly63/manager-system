<!--  -->
<template>
  <el-card class="box-card">
    <el-row :gutter="20">
      <el-col :span="8">
        <el-input
          placeholder="请输入内容"
          v-model="queryInfo.query"
          clearable
          @clear="getUserList"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="getUserList"
          ></el-button>
        </el-input>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" @click="dialogVisible = true"
          >添加用户</el-button
        >
      </el-col>
    </el-row>
    <el-table :data="userList" border stripe>
      <el-table-column type="index"> </el-table-column>
      <el-table-column label="姓名" prop="username"> </el-table-column>
      <el-table-column label="邮箱" prop="email"> </el-table-column>
      <el-table-column label="电话" prop="mobile"> </el-table-column>
      <el-table-column label="角色" prop="role_name"> </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.mg_state"
            @change="userStateChanged(scope.row)"
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="190px">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="removeUserById(scope.row.id)"
          ></el-button>
          <el-tooltip effect="dark" content="分配角色" placement="top">
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[1, 2, 3, 4]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
    <user-dialog
      :dialogVisible="dialogVisible"
      @close="dialogVisible = false"
      @getUserList="getUserList"
    ></user-dialog>
  </el-card>
</template>

<script>
import UserDialog from "../users/usercomps/UserDialog";
export default {
  components: { UserDialog },
  data() {
    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 2,
      },
      userList: [],
      total: 0,
      dialogVisible: false,
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$axios.get("users", {
        params: this.queryInfo,
      });
      if (res.meta.status !== 200)
        return this.$message.error("获取用户列表失败");
      this.userList = res.data.users;
      this.total = res.data.total;
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getUserList();
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getUserList();
    },
    async userStateChanged(userInfo) {
      const { data: res } = await this.$axios.put(
        `users/${userInfo.id}/state/${userInfo.mg_state}`
      );
      if (res.meta.status !== 200) {
        this.$message.error("更新状态失败");
        userInfo.mg_state = !userInfo.mg_state;
      }
      this.$message.success("更新状态成功");
    },
    removeUserById(id) {
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const { data: res } = await this.$axios.delete("users/" + id);
          if (res.meta.status !== 200) return this.$message.error("删除失败");
          this.getUserList();
          this.$message.success("已成功删除");
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
};
</script>
<style lang='less' scoped>
</style>