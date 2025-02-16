<template>
  <nav class="breadcrumb" v-if="breadcrumbs.length">
    <ul>
      <li v-for="(item, index) in breadcrumbs" :key="index">
        <template v-if="index === breadcrumbs.length - 1">
          <span class="current">{{ item.name }}</span>
        </template>
        <template v-else>
          <router-link :to="item.path">{{ item.name }}</router-link>
          <span class="separator">/</span>
        </template>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: 'AppBreadcrumb',
  props: {
    breadcrumbs: {
      type: Array,
      required: true,
      validator: (value) => {
        return value.every(item => 
          typeof item.name === 'string' && 
          typeof item.path === 'string'
        )
      }
    }
  }
}
</script>

<style scoped>
.breadcrumb {
  padding: 15px 0;
  background-color: #fff;
}

.breadcrumb ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  align-items: center;
}

.breadcrumb li {
  display: flex;
  align-items: center;
}

.breadcrumb a {
  color: #666;
  text-decoration: none;
}

.breadcrumb a:hover {
  color: #333;
}

.separator {
  margin: 0 8px;
  color: #999;
}

.current {
  color: #333;
  font-weight: 500;
}
</style> 