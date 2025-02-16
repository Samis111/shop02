<template>
  <div class="product-image">
    <!-- 主图展示区 -->
    <div 
      class="main-image"
      @mousemove="handleMouseMove"
      @mouseleave="handleMouseLeave"
    >
      <img 
        :src="currentImage" 
        :alt="alt"
        ref="mainImage"
      >
      <!-- 放大镜 -->
      <div 
        v-show="showMagnifier"
        class="magnifier"
        :style="magnifierStyle"
      >
        <div 
          class="magnifier-content"
          :style="magnifierContentStyle"
        ></div>
      </div>
    </div>

    <!-- 缩略图列表 -->
    <div class="thumbnail-list">
      <button 
        class="nav-btn prev"
        :disabled="currentIndex === 0"
        @click="prevImage"
      >
        <i class="iconfont icon-arrow-left"></i>
      </button>
      
      <div class="thumbnails" ref="thumbnails">
        <div 
          v-for="(image, index) in images" 
          :key="index"
          class="thumbnail"
          :class="{ active: currentIndex === index }"
          @click="selectImage(index)"
        >
          <img :src="image" :alt="`${alt} - ${index + 1}`">
        </div>
      </div>

      <button 
        class="nav-btn next"
        :disabled="currentIndex === images.length - 1"
        @click="nextImage"
      >
        <i class="iconfont icon-arrow-right"></i>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProductImage',
  props: {
    images: {
      type: Array,
      required: true,
      validator: value => value.every(item => typeof item === 'string')
    },
    alt: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      currentIndex: 0,
      showMagnifier: false,
      magnifierPos: { x: 0, y: 0 },
      magnifierSize: 100, // 放大镜尺寸
      zoomRatio: 2 // 放大倍数
    }
  },
  computed: {
    currentImage() {
      return this.images[this.currentIndex]
    },
    magnifierStyle() {
      const { x, y } = this.magnifierPos
      const offset = this.magnifierSize / 2
      return {
        width: `${this.magnifierSize}px`,
        height: `${this.magnifierSize}px`,
        left: `${x - offset}px`,
        top: `${y - offset}px`
      }
    },
    magnifierContentStyle() {
      const { x, y } = this.magnifierPos
      const image = this.$refs.mainImage
      if (!image) return {}

      const rect = image.getBoundingClientRect()
      const percentX = (x / rect.width) * 100
      const percentY = (y / rect.height) * 100

      return {
        backgroundImage: `url(${this.currentImage})`,
        backgroundPosition: `${percentX}% ${percentY}%`,
        backgroundSize: `${this.zoomRatio * 100}%`
      }
    }
  },
  methods: {
    selectImage(index) {
      this.currentIndex = index
    },
    prevImage() {
      if (this.currentIndex > 0) {
        this.currentIndex--
      }
    },
    nextImage() {
      if (this.currentIndex < this.images.length - 1) {
        this.currentIndex++
      }
    },
    handleMouseMove(event) {
      const image = this.$refs.mainImage
      if (!image) return

      const rect = image.getBoundingClientRect()
      this.magnifierPos = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
      }
      this.showMagnifier = true
    },
    handleMouseLeave() {
      this.showMagnifier = false
    }
  }
}
</script>

<style scoped>
.product-image {
  width: 100%;
  max-width: 600px;
}

.main-image {
  position: relative;
  width: 100%;
  padding-top: 100%;
  overflow: hidden;
  border: 1px solid #eee;
  border-radius: 4px;
  cursor: zoom-in;
}

.main-image img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.magnifier {
  position: absolute;
  border: 1px solid #ddd;
  border-radius: 50%;
  overflow: hidden;
  pointer-events: none;
  z-index: 1;
}

.magnifier-content {
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
}

.thumbnail-list {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
}

.thumbnails {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  flex: 1;
}

.thumbnails::-webkit-scrollbar {
  display: none;
}

.thumbnail {
  flex: 0 0 80px;
  height: 80px;
  border: 2px solid transparent;
  border-radius: 4px;
  cursor: pointer;
  overflow: hidden;
  transition: border-color 0.3s;
}

.thumbnail.active {
  border-color: #333;
}

.thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.nav-btn {
  width: 32px;
  height: 32px;
  border: 1px solid #ddd;
  border-radius: 50%;
  background: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.nav-btn:hover:not(:disabled) {
  border-color: #333;
  color: #333;
}

.nav-btn:disabled {
  color: #ddd;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .thumbnail {
    flex: 0 0 60px;
    height: 60px;
  }
}
</style> 