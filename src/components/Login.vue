<!--  -->
<template>
  <div class="login">
    <div class="box">
      <div class="avatar">
        <img src="../assets/img/calf-elephant.jpg" alt="" />
      </div>
      <el-form
        label-width="0px"
        :model="loginForm"
        :rules="loginRules"
        ref="loginFormRef"
      >
        <el-form-item prop="username">
          <el-input
            prefix-icon="el-icon-s-custom"
            placeholder="请输入账号"
            v-model="loginForm.username"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            prefix-icon="el-icon-goods"
            placeholder="请输入密码"
            show-password
            v-model="loginForm.password"
          ></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" @click="submit">提交</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import instance from "../network/request";
export default {
  name: "Login",
  data() {
    return {
      loginForm: {
        username: "admin",
        password: "123456",
      },
      loginRules: {
        username: [
          { required: true, message: "请输入账号", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入活动密码", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    resetLoginForm() {
      this.$refs.loginFormRef.resetFields();
    },
    submit() {
      this.$refs.loginFormRef.validate(async (valid) => {
        if (!valid) return;
        else {
          const { data: res } = await instance.post("login", this.loginForm);
          if (res.meta.status !== 200) this.$message.error("登陆失败");
          else {
            this.$message.success("登录成功");
            window.sessionStorage.setItem("token", res.data.token);
            this.$router.push("/home");
          }
        }
      });
    },
  },
};
</script>
<style lang="less" scoped>
.login {
  background-color: tomato;
  height: 100%;
}
.box {
  width: 450px;
  height: 300px;
  background-color: gainsboro;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  .avatar {
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    box-shadow: 0 0 10px;
    position: absolute;
    left: 50%;
    right: 50%;
    transform: translate(-50%, -50%);
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: turquoise;
    }
  }
}
.el-form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
.btns {
  display: flex;
  justify-content: flex-end;
}
</style>