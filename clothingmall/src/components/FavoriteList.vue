<template>
  <div class="favorite-list">
    <div class="section-header">
      <h3>我的收藏</h3>
      <div class="view-mode">
        <button 
          class="mode-btn"
          :class="{ active: viewMode === 'grid' }"
          @click="viewMode = 'grid'"
        >
          <i class="iconfont icon-grid"></i>
        </button>
        <button 
          class="mode-btn"
          :class="{ active: viewMode === 'list' }"
          @click="viewMode = 'list'"
        >
          <i class="iconfont icon-list"></i>
        </button>
      </div>
    </div>

    <!-- 商品列表 -->
    <div 
      class="product-list"
      :class="viewMode"
    >
      <div 
        v-for="item in favorites" 
        :key="item.id"
        class="product-item"
      >
        <router-link 
          :to="{ name: 'ProductDetail', params: { id: item.productId }}"
          class="product-image"
        >
          <img :src="item.image" :alt="item.name">
        </router-link>
        
        <div class="product-info">
          <router-link 
            :to="{ name: 'ProductDetail', params: { id: item.productId }}"
            class="product-name"
          >{{ item.name }}</router-link>
          
          <div class="product-price">
            <span class="current-price">¥{{ item.price }}</span>
            <span 
              v-if="item.originalPrice" 
              class="original-price"
            >¥{{ item.originalPrice }}</span>
          </div>
          
          <div class="product-meta">
            <div class="rating">
              <span class="stars">
                <i 
                  v-for="n in 5" 
                  :key="n"
                  class="iconfont"
                  :class="n <= item.rating ? 'icon-star-filled' : 'icon-star'"
                ></i>
              </span>
              <span class="rating-count">({{ item.ratingCount }})</span>
            </div>
            <span class="sales">月销 {{ item.monthlySales }}</span>
          </div>
        </div>

        <div class="product-actions">
          <button 
            class="action-btn primary"
            @click="addToCart(item)"
          >
            <i class="iconfont icon-cart"></i>
            加入购物车
          </button>
          <button 
            class="action-btn"
            @click="removeFavorite(item.id)"
          >
            <i class="iconfont icon-delete"></i>
            取消收藏
          </button>
        </div>
      </div>
    </div>

    <!-- 分页器 -->
    <div class="pagination-wrapper">
      <el-pagination
        :current-page="currentPage"
        :page-size="pageSize"
        :total="total"
        layout="prev, pager, next"
        @current-change="handlePageChange"
      />
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'FavoriteList',
  data() {
    return {
      viewMode: 'grid',
      currentPage: 1,
      pageSize: 12,
      total: 0
    }
  },
  computed: {
    ...mapState('favorite', ['favorites'])
  },
  created() {
    this.fetchFavorites()
  },
  methods: {
    ...mapActions('favorite', ['fetchFavorites', 'removeFavorite']),
    ...mapActions('cart', ['addToCart']),
    handlePageChange(page) {
      this.currentPage = page
      this.fetchFavorites({
        page: this.currentPage,
        pageSize: this.pageSize
      })
    },
    async handleAddToCart(item) {
      try {
        await this.addToCart({
          productId: item.productId,
          quantity: 1
        })
        this.$message.success('已添加到购物车')
      } catch (error) {
        this.$message.error('添加失败')
      }
    },
    async handleRemoveFavorite(id) {
      try {
        await this.$confirm('确定要取消收藏该商品吗？')
        await this.removeFavorite(id)
        this.$message.success('已取消收藏')
      } catch (error) {
        if (error === 'cancel') return
        this.$message.error('操作失败')
      }
    }
  }
}
</script>

<style scoped>
.favorite-list {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h3 {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.view-mode {
  display: flex;
  gap: 10px;
}

.mode-btn {
  width: 32px;
  height: 32px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #fff;
  color: #666;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mode-btn:hover,
.mode-btn.active {
  border-color: #ff4d4f;
  color: #ff4d4f;
}

.product-list {
  margin-bottom: 20px;
}

.product-list.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
}

.product-list.list .product-item {
  display: grid;
  grid-template-columns: 200px 1fr auto;
  gap: 20px;
  padding: 20px;
  border: 1px solid #eee;
  border-radius: 4px;
  margin-bottom: 15px;
}

.product-image {
  display: block;
  position: relative;
  overflow: hidden;
}

.grid .product-image {
  aspect-ratio: 1;
}

.list .product-image {
  width: 200px;
  height: 200px;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.product-image:hover img {
  transform: scale(1.05);
}

.product-info {
  padding: 15px 0;
}

.list .product-info {
  padding: 0;
}

.product-name {
  display: block;
  color: #333;
  text-decoration: none;
  margin-bottom: 10px;
  font-size: 14px;
  line-height: 1.4;
}

.grid .product-name {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  height: 40px;
}

.product-price {
  margin-bottom: 10px;
}

.current-price {
  color: #ff4d4f;
  font-size: 18px;
  font-weight: 500;
}

.original-price {
  color: #999;
  text-decoration: line-through;
  font-size: 14px;
  margin-left: 5px;
}

.product-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #999;
  font-size: 12px;
}

.rating {
  display: flex;
  align-items: center;
  gap: 5px;
}

.stars {
  color: #ffd700;
}

.product-actions {
  display: flex;
  gap: 10px;
}

.grid .product-actions {
  flex-direction: column;
}

.action-btn {
  padding: 8px 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #fff;
  color: #666;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
}

.action-btn:hover {
  border-color: #999;
  color: #333;
}

.action-btn.primary {
  background: #ff4d4f;
  border-color: #ff4d4f;
  color: #fff;
}

.action-btn.primary:hover {
  background: #ff2629;
  border-color: #ff2629;
}

.pagination-wrapper {
  display: flex;
  justify-content: center;
}

@media (max-width: 768px) {
  .favorite-list {
    padding: 15px;
  }
  
  .product-list.list .product-item {
    grid-template-columns: 1fr;
  }
  
  .list .product-image {
    width: 100%;
    height: auto;
    aspect-ratio: 1;
  }
  
  .product-actions {
    flex-direction: column;
    width: 100%;
  }
  
  .action-btn {
    width: 100%;
  }
}
</style> 