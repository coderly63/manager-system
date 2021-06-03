<!--  -->
<template>
  <div>
    <el-dialog
      title="分配权限"
      :visible.sync="setRoleDialogVisable"
      width="30%"
    >
      <el-tree
        :data="rightsList"
        :props="rightsProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defKeys"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="$emit('close')">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    setRoleDialogVisable: {
      type: Boolean,
      default: false,
    },
    rightsList: {
      type: Array,
      default() {
        return [];
      },
    },
    defKeys: {
      type: Array,
      default() {
        return [];
      },
    },
    roleId: {
      type: Number,
    },
  },
  data() {
    return {
      rightsProps: {
        label: "authName",
        children: "children",
      },
    };
  },
  methods: {
    async allotRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ];
      const idStr = keys.join(",");
      const { data: res } = await this.$axios.post(
        `roles/${this.roleId}/rights`,
        {
          rids: idStr,
        }
      );
      if (res.meta.status !== 200) return this.$message.error("分配权限失败");
      this.$message.success("更新成功");
      this.$emit("getRoleList");
      this.$emit("close");
    },
  },
};
</script>
<style lang='less' scoped>
</style>