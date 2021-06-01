<!--  -->
<template>
  <div class="user-dialog">
    <el-dialog
      title="添加用户"
      :visible.sync="dialogVisible"
      width="30%"
      @close="dialogClose"
    >
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    let checkMobile = (rule, value, callback) => {
      const regMobile = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
      if (regMobile.test(value)) return callback();
      return callback(new Error("请输入正确的手机号"));
    };
    return {
      addForm: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      addFormRules: {
        username: [
          { required: true, message: "请输入账号", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "长度在 6 到 15 个字符",
            trigger: "blur",
          },
        ],
        email: [{ required: true, message: "请输入邮箱", trigger: "blur" }],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          {
            validator: checkMobile,
            trigger: "blur",
          },
        ],
      },
    };
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false,
    },
    getUserList: {
      type: Function,
      default: null,
    },
  },
  methods: {
    close() {
      this.$emit("close");
    },
    dialogClose() {
      this.$refs.addFormRef.resetFields();
    },
    addUser() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return;
        //发送axios网络请求
        const { data: res } = await this.$axios.post("users", this.addForm);
        if (res.meta.status !== 201) {
          this.$message.error("添加用户失败");
          this.$emit("close");
        } else {
          this.$message.success("添加用户成功");
          this.$emit("getUserList");
          this.$emit("close");
        }
      });
    },
  },
};
</script>
<style lang='less' scoped>
</style>