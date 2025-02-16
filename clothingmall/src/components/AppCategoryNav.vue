<template>
  <div class="category-nav">
    <ul class="category-list">
      <li 
        v-for="(category, index) in categories" 
        :key="index"
        class="category-item"
        @mouseenter="activeIndex = index"
        @mouseleave="activeIndex = null"
      >
        <router-link :to="category.path" class="category-link">
          <i :class="['iconfont', category.icon]"></i>
          {{ category.name }}
        </router-link>
        
        <!-- 二级分类 -->
        <div class="sub-categories" v-show="activeIndex === index">
          <div class="sub-category-group" v-for="(group, gIndex) in category.children" :key="gIndex">
            <h4 class="group-title">{{ group.title }}</h4>
            <ul class="sub-category-list">
              <li v-for="(item, iIndex) in group.items" :key="iIndex">
                <router-link :to="item.path">{{ item.name }}</router-link>
              </li>
            </ul>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'AppCategoryNav',
  data() {
    return {
      activeIndex: null,
      categories: [
        {
          name: '女装',
          path: '/category/women',
          icon: 'icon-women',
          children: [
            {
              title: '上装',
              items: [
                { name: 'T恤', path: '/category/women/t-shirt' },
                { name: '衬衫', path: '/category/women/shirt' },
                { name: '卫衣', path: '/category/women/hoodie' }
              ]
            },
            {
              title: '下装',
              items: [
                { name: '牛仔裤', path: '/category/women/jeans' },
                { name: '休闲裤', path: '/category/women/pants' },
                { name: '半身裙', path: '/category/women/skirt' }
              ]
            }
          ]
        },
        {
          name: '男装',
          path: '/category/men',
          icon: 'icon-men',
          children: [
            {
              title: '上装',
              items: [
                { name: 'T恤', path: '/category/men/t-shirt' },
                { name: '衬衫', path: '/category/men/shirt' },
                { name: '夹克', path: '/category/men/jacket' }
              ]
            },
            {
              title: '下装',
              items: [
                { name: '牛仔裤', path: '/category/men/jeans' },
                { name: '休闲裤', path: '/category/men/pants' },
                { name: '运动裤', path: '/category/men/sports' }
              ]
            }
          ]
        },
        // 可以继续添加更多分类...
      ]
    }
  }
}
</script>

<style scoped>
.category-nav {
  width: 200px;
  background: #fff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.category-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.category-item {
  position: relative;
}

.category-link {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  color: #333;
  text-decoration: none;
  transition: background-color 0.3s;
}

.category-link:hover {
  background-color: #f5f5f5;
}

.category-link i {
  margin-right: 10px;
  font-size: 18px;
}

.sub-categories {
  position: absolute;
  left: 100%;
  top: 0;
  width: 400px;
  background: #fff;
  box-shadow: 2px 0 5px rgba(0,0,0,0.1);
  padding: 20px;
  display: flex;
  flex-wrap: wrap;
  z-index: 10;
}

.sub-category-group {
  width: 50%;
  padding: 10px;
}

.group-title {
  margin: 0 0 10px;
  font-size: 14px;
  color: #999;
}

.sub-category-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sub-category-list li {
  margin: 5px 0;
}

.sub-category-list a {
  color: #666;
  text-decoration: none;
  font-size: 14px;
}

.sub-category-list a:hover {
  color: #333;
}
</style> 