<!--  -->
<template>
  <el-container class="home-container">
    <el-header>
      <div>
        <img src="../assets/img/calf-elephant.jpg" alt="" />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="primary" size="default" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="collapse-btn" @click="isCollapse = !isCollapse">|||</div>
        <el-menu
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#409bff"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="activePath"
        >
          <el-submenu
            :index="item.id + ''"
            v-for="item in menuList"
            :key="item.id"
          >
            <!-- 一级菜单 -->
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/' + subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
              class="menu-item"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/welcome' }"
            >首页</el-breadcrumb-item
          >
          <el-breadcrumb-item>用户管理</el-breadcrumb-item>
          <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import instance from "../network/request";
export default {
  data() {
    return {
      menuList: [],
      isCollapse: false,
      activePath: "",
    };
  },
  created() {
    this.getMenuList();
    this.activePath = window.sessionStorage.getItem("activePath");
  },
  methods: {
    logout() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    async getMenuList() {
      const { data: res } = await instance.get("menus");
      if (res.meta.status !== 200) return this.$message.err(res.meta.msg);
      this.menuList = res.data;
    },
  },
};
</script>
<style scoped lang="less">
.collapse-btn {
  color: #fff;
  letter-spacing: 1.5px;
  padding: 5px 0;
  cursor: pointer;
}
.el-menu {
  border-right: none;
}
.home-container {
  height: 100vh;
}
.el-aside {
  background-color: #333744;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 0;
  > div {
    display: flex;
    align-items: center;
  }
  img {
    height: 60px;
    width: 60px;
    border-radius: 50%;
  }
  span {
    margin-left: 10px;
    color: white;
    font-size: 20px;
  }
}
.el-main {
  background-color: #eaedf1;
}
.menu-item {
  padding-left: 10px;
}
</style>