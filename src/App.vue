<template>
  <div id="app">
    hello router
    <router-link to="/home">首页</router-link>
    <router-link to="/about">关于页面</router-link>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "app",
  created() {
    console.log(this.$router, this.$route);
  }
};
</script>


