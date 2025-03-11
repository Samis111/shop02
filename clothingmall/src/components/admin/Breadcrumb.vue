<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{ path: '/admin' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item v-if="currentRoute.meta.title">
      {{ currentRoute.meta.title }}
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
export default {
  name: 'Breadcrumb',
  computed: {
    currentRoute() {
      return this.$route
    }
  }
}
</script> 