<template>
  <div class="product-review">
    <!-- 评价统计 -->
    <div class="review-stats">
      <div class="rating-overview">
        <div class="average-rating">
          <span class="rating-score">{{ averageRating }}</span>
          <div class="rating-stars">
            <i 
              v-for="n in 5" 
              :key="n"
              class="iconfont"
              :class="n <= Math.round(averageRating) ? 'icon-star-filled' : 'icon-star'"
            ></i>
          </div>
        </div>
        <div class="rating-count">共 {{ total }} 条评价</div>
      </div>
      
      <div class="rating-bars">
        <div 
          v-for="(item, index) in ratingStats" 
          :key="5 - index"
          class="rating-bar-item"
        >
          <span class="star-level">{{ 5 - index }}星</span>
          <div class="progress-bar">
            <div 
              class="progress"
              :style="{ width: item.percentage + '%' }"
            ></div>
          </div>
          <span class="percentage">{{ item.percentage }}%</span>
        </div>
      </div>
    </div>

    <!-- 筛选工具栏 -->
    <div class="review-toolbar">
      <div class="filter-tags">
        <button 
          v-for="tag in filterTags"
          :key="tag.value"
          class="filter-tag"
          :class="{ active: selectedTags.includes(tag.value) }"
          @click="toggleTag(tag.value)"
        >
          {{ tag.label }}
          <span class="count">({{ tag.count }})</span>
        </button>
      </div>
      
      <div class="sort-options">
        <select v-model="sortBy">
          <option value="time">按时间排序</option>
          <option value="rating">按评分排序</option>
          <option value="useful">按有用程度排序</option>
        </select>
      </div>
    </div>

    <!-- 评价列表 -->
    <div class="review-list">
      <div 
        v-for="review in reviews" 
        :key="review.id"
        class="review-item"
      >
        <div class="review-header">
          <div class="reviewer-info">
            <img :src="review.avatar" :alt="review.nickname" class="avatar">
            <span class="nickname">{{ review.nickname }}</span>
          </div>
          <div class="review-rating">
            <div class="stars">
              <i 
                v-for="n in 5" 
                :key="n"
                class="iconfont"
                :class="n <= review.rating ? 'icon-star-filled' : 'icon-star'"
              ></i>
            </div>
            <span class="review-time">{{ formatTime(review.createTime) }}</span>
          </div>
        </div>

        <div class="review-content">
          <p class="review-text">{{ review.content }}</p>
          
          <!-- 评价图片 -->
          <div v-if="review.images && review.images.length" class="review-images">
            <div 
              v-for="(image, index) in review.images"
              :key="index"
              class="image-item"
              @click="showImagePreview(review.images, index)"
            >
              <img :src="image" :alt="'评价图片' + (index + 1)">
            </div>
          </div>

          <!-- 商品信息 -->
          <div class="product-attrs">
            <span class="attr-item">颜色：{{ review.color }}</span>
            <span class="attr-item">尺码：{{ review.size }}</span>
          </div>

          <!-- 商家回复 -->
          <div v-if="review.reply" class="merchant-reply">
            <span class="reply-label">商家回复：</span>
            <p class="reply-content">{{ review.reply }}</p>
          </div>
        </div>

        <div class="review-footer">
          <button 
            class="useful-btn"
            :class="{ active: review.isUseful }"
            @click="toggleUseful(review)"
          >
            <i class="iconfont icon-thumb-up"></i>
            有用({{ review.usefulCount }})
          </button>
        </div>
      </div>
    </div>

    <!-- 分页 -->
    <app-pagination
      :total="total"
      :current-page.sync="currentPage"
      :page-size="pageSize"
      @change="handlePageChange"
    />

    <!-- 图片预览 -->
    <el-image-viewer
      v-if="showViewer"
      :on-close="closeViewer"
      :url-list="previewImages"
      :initial-index="previewIndex"
    />
  </div>
</template>

<script>
import AppPagination from './AppPagination.vue'

export default {
  name: 'ProductReview',
  components: {
    AppPagination
  },
  props: {
    productId: {
      type: [String, Number],
      required: true
    }
  },
  data() {
    return {
      total: 0,
      currentPage: 1,
      pageSize: 10,
      sortBy: 'time',
      selectedTags: [],
      reviews: [],
      ratingStats: [],
      filterTags: [
        { label: '全部', value: 'all', count: 0 },
        { label: '好评', value: 'good', count: 0 },
        { label: '中评', value: 'neutral', count: 0 },
        { label: '差评', value: 'bad', count: 0 },
        { label: '有图', value: 'hasImage', count: 0 },
        { label: '追评', value: 'additional', count: 0 }
      ],
      showViewer: false,
      previewImages: [],
      previewIndex: 0
    }
  },
  computed: {
    averageRating() {
      if (!this.ratingStats.length) return 0
      const totalScore = this.ratingStats.reduce((sum, item) => {
        return sum + (6 - item.level) * item.count
      }, 0)
      const totalCount = this.ratingStats.reduce((sum, item) => sum + item.count, 0)
      return totalCount ? (totalScore / totalCount).toFixed(1) : 0
    }
  },
  created() {
    this.fetchReviews()
  },
  methods: {
    async fetchReviews() {
      try {
        // TODO: 调用API获取评价数据
        const response = await this.$api.reviews.getList({
          productId: this.productId,
          page: this.currentPage,
          pageSize: this.pageSize,
          sort: this.sortBy,
          tags: this.selectedTags
        })
        
        this.reviews = response.data.items
        this.total = response.data.total
        this.ratingStats = response.data.ratingStats
        
        // 更新标签数量
        this.filterTags = this.filterTags.map(tag => ({
          ...tag,
          count: response.data.tagStats[tag.value] || 0
        }))
      } catch (error) {
        console.error('获取评价列表失败:', error)
        this.$message.error('获取评价失败')
      }
    },
    formatTime(timestamp) {
      const date = new Date(timestamp)
      const now = new Date()
      const diff = now - date
      
      // 小于1分钟
      if (diff < 60000) {
        return '刚刚'
      }
      
      // 小于1小时
      if (diff < 3600000) {
        const minutes = Math.floor(diff / 60000)
        return `${minutes}分钟前`
      }
      
      // 小于24小时
      if (diff < 86400000) {
        const hours = Math.floor(diff / 3600000)
        return `${hours}小时前`
      }
      
      // 小于30天
      if (diff < 2592000000) {
        const days = Math.floor(diff / 86400000)
        return `${days}天前`
      }
      
      // 大于30天，显示具体日期
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    },
    toggleTag(tag) {
      const index = this.selectedTags.indexOf(tag)
      if (index > -1) {
        this.selectedTags.splice(index, 1)
      } else {
        if (tag === 'all') {
          this.selectedTags = []
        } else {
          this.selectedTags = this.selectedTags.filter(t => t !== 'all')
          this.selectedTags.push(tag)
        }
      }
      this.currentPage = 1
      this.fetchReviews()
    },
    async toggleUseful(review) {
      try {
        const newStatus = !review.isUseful
        await this.$api.reviews.toggleUseful({
          reviewId: review.id,
          useful: newStatus
        })
        
        review.isUseful = newStatus
        review.usefulCount += newStatus ? 1 : -1
      } catch (error) {
        this.$message.error('操作失败')
      }
    },
    handlePageChange() {
      this.fetchReviews()
    },
    showImagePreview(images, index) {
      this.previewImages = images
      this.previewIndex = index
      this.showViewer = true
    },
    closeViewer() {
      this.showViewer = false
    }
  }
}
</script>

<style scoped>
.product-review {
  padding: 20px;
}

.review-stats {
  display: flex;
  gap: 40px;
  margin-bottom: 30px;
  padding: 20px;
  background: #f8f8f8;
  border-radius: 4px;
}

.rating-overview {
  text-align: center;
}

.average-rating {
  margin-bottom: 10px;
}

.rating-score {
  font-size: 36px;
  color: #ff4d4f;
  font-weight: bold;
}

.rating-stars {
  color: #ffd700;
  font-size: 18px;
}

.rating-count {
  color: #666;
}

.rating-bars {
  flex: 1;
}

.rating-bar-item {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.star-level {
  width: 40px;
  color: #666;
}

.progress-bar {
  flex: 1;
  height: 16px;
  background: #eee;
  border-radius: 8px;
  overflow: hidden;
}

.progress {
  height: 100%;
  background: #ffd700;
  transition: width 0.3s;
}

.percentage {
  width: 40px;
  color: #666;
}

.review-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.filter-tags {
  display: flex;
  gap: 10px;
}

.filter-tag {
  padding: 6px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #fff;
  cursor: pointer;
}

.filter-tag.active {
  background: #333;
  color: #fff;
  border-color: #333;
}

.sort-options select {
  padding: 6px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.review-item {
  padding: 20px;
  border-bottom: 1px solid #eee;
}

.review-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}

.reviewer-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.nickname {
  color: #333;
}

.review-rating {
  text-align: right;
}

.stars {
  color: #ffd700;
  margin-bottom: 5px;
}

.review-time {
  color: #999;
  font-size: 12px;
}

.review-content {
  margin-bottom: 15px;
}

.review-text {
  margin: 0 0 15px;
  color: #333;
  line-height: 1.6;
}

.review-images {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 15px;
}

.image-item {
  width: 100px;
  height: 100px;
  cursor: pointer;
}

.image-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 4px;
}

.product-attrs {
  display: flex;
  gap: 20px;
  color: #666;
  font-size: 14px;
  margin-bottom: 15px;
}

.merchant-reply {
  background: #f8f8f8;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 15px;
}

.reply-label {
  color: #333;
  font-weight: 500;
}

.reply-content {
  margin: 5px 0 0;
  color: #666;
}

.review-footer {
  display: flex;
  justify-content: flex-end;
}

.useful-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 6px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #fff;
  cursor: pointer;
}

.useful-btn.active {
  color: #ff4d4f;
  border-color: #ff4d4f;
}

@media (max-width: 768px) {
  .review-stats {
    flex-direction: column;
    gap: 20px;
  }
  
  .review-toolbar {
    flex-direction: column;
    gap: 10px;
  }
  
  .filter-tags {
    flex-wrap: wrap;
  }
}
</style> 