<!--  -->
<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-table :data="roleList" border stripe>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']"
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
            >
              <el-col :span="5">
                <el-tag>{{ item1.authName }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <el-row
                  :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']"
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag type="warning">{{ item2.authName }}</el-tag
                    ><i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      type="danger"
                      v-for="(item3, i3) in item2.children"
                      :key="i3"
                      closable
                      @close="removeRightById(scope.row, item3.id)"
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini"
              >编辑</el-button
            >
            <el-button type="danger" icon="el-icon-delete" size="mini"
              >删除</el-button
            >
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="showSetRoleDialog(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <role-dialog
      :setRoleDialogVisable="setRoleDialogVisable"
      @close="close"
      :rightsList="rightsList"
      :defKeys="defKeys"
      :roleId="roleId"
      @getRoleList="getRoleList()"
    ></role-dialog>
  </div>
</template>

<script>
import RoleDialog from "./RoleDialog.vue";
export default {
  components: { RoleDialog },
  data() {
    return {
      roleList: [],
      setRoleDialogVisable: false,
      rightsList: [],
      defKeys: [],
      roleId: 0,
    };
  },
  created() {
    this.getRoleList();
  },
  methods: {
    getLeafKeys(node, arr) {
      if (!node.children) return arr.push(node.id);
      node.children.forEach((item) => {
        this.getLeafKeys(item, arr);
      });
    },
    async showSetRoleDialog(node) {
      this.roleId = node.id;
      this.setRoleDialogVisable = true;
      const { data: res } = await this.$axios.get("rights/tree");
      if (res.meta.status !== 200) return this.$message.error("失败");
      this.getLeafKeys(node, this.defKeys);
      this.rightsList = res.data;
      console.log(this.rightsList);
    },
    close() {
      this.setRoleDialogVisable = false;
      this.defKeys = [];
    },
    async getRoleList() {
      const { data: res } = await this.$axios.get("roles");
      this.roleList = res.data;
    },
    async removeRightById(role, rightId) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该文件, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          // cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (confirmResult === "confirm") {
        const { data: res } = await this.$axios.delete(
          `roles/${role.id}/rights/${rightId}`
        );
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
        this.$message.success("删除角色成功");
        role.children = res.data;
      } else {
        this.$message.info("取消删除角色");
      }
    },
  },
};
</script>
<style lang='less' scoped>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>