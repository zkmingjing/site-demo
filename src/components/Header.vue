<template>
  <header>
    <h1>我的博客</h1>
    <nav>
      <router-link to="/">首页</router-link>
      <router-link to="/about">关于</router-link>
    </nav>
  </header>
</template>

<script>
export default {
  name: 'Header',
};
</script>

<style scoped>
header {
  background-color: #f0f0f0;
  padding: 20px;
}
nav {
  margin-top: 10px;
}
</style> 