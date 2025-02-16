<template>
  <div class="carousel">
    <div class="carousel-container" ref="container">
      <div 
        class="carousel-items" 
        :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
      >
        <div 
          v-for="(item, index) in items" 
          :key="index" 
          class="carousel-item"
        >
          <img :src="item.image" :alt="item.title">
          <div class="carousel-caption" v-if="item.title || item.description">
            <h3>{{ item.title }}</h3>
            <p>{{ item.description }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 箭头导航 -->
    <button class="carousel-arrow prev" @click="prev">
      <i class="iconfont icon-arrow-left"></i>
    </button>
    <button class="carousel-arrow next" @click="next">
      <i class="iconfont icon-arrow-right"></i>
    </button>

    <!-- 指示器 -->
    <div class="carousel-indicators">
      <button 
        v-for="(item, index) in items" 
        :key="index"
        :class="{ active: currentIndex === index }"
        @click="goTo(index)"
      ></button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AppCarousel',
  props: {
    items: {
      type: Array,
      required: true,
      validator: (value) => {
        return value.every(item => 
          typeof item.image === 'string' && 
          (!item.title || typeof item.title === 'string') &&
          (!item.description || typeof item.description === 'string')
        )
      }
    },
    autoplay: {
      type: Boolean,
      default: true
    },
    interval: {
      type: Number,
      default: 3000
    }
  },
  data() {
    return {
      currentIndex: 0,
      timer: null
    }
  },
  mounted() {
    if (this.autoplay) {
      this.startAutoplay()
    }
  },
  beforeDestroy() {
    this.stopAutoplay()
  },
  methods: {
    next() {
      this.currentIndex = (this.currentIndex + 1) % this.items.length
    },
    prev() {
      this.currentIndex = this.currentIndex === 0 
        ? this.items.length - 1 
        : this.currentIndex - 1
    },
    goTo(index) {
      this.currentIndex = index
    },
    startAutoplay() {
      this.timer = setInterval(() => {
        this.next()
      }, this.interval)
    },
    stopAutoplay() {
      if (this.timer) {
        clearInterval(this.timer)
        this.timer = null
      }
    }
  }
}
</script>

<style scoped>
.carousel {
  position: relative;
  width: 100%;
  height: 400px;
  overflow: hidden;
}

.carousel-container {
  width: 100%;
  height: 100%;
}

.carousel-items {
  display: flex;
  height: 100%;
  transition: transform 0.5s ease;
}

.carousel-item {
  flex: 0 0 100%;
  position: relative;
}

.carousel-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.carousel-caption {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px;
  background: rgba(0, 0, 0, 0.5);
  color: white;
}

.carousel-caption h3 {
  margin: 0 0 10px;
  font-size: 24px;
}

.carousel-caption p {
  margin: 0;
  font-size: 16px;
}

.carousel-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.3);
  border: none;
  color: white;
  padding: 15px;
  cursor: pointer;
  transition: background 0.3s;
}

.carousel-arrow:hover {
  background: rgba(0, 0, 0, 0.5);
}

.carousel-arrow.prev {
  left: 10px;
}

.carousel-arrow.next {
  right: 10px;
}

.carousel-indicators {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
}

.carousel-indicators button {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  padding: 0;
}

.carousel-indicators button.active {
  background: white;
}
</style> 