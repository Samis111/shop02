<template>
  <footer class="footer">
    <div class="footer-content">
      <!-- 联系方式 -->
      <div class="footer-section">
        <h3>联系我们</h3>
        <p>客服电话：400-123-4567</p>
        <p>服务时间：9:00-21:00</p>
        <p>电子邮箱：service@fashion.com</p>
      </div>

      <!-- 服务条款 -->
      <div class="footer-section">
        <h3>服务条款</h3>
        <ul>
          <li><router-link to="/terms">使用条款</router-link></li>
          <li><router-link to="/privacy">隐私政策</router-link></li>
          <li><router-link to="/shipping">配送说明</router-link></li>
          <li><router-link to="/return">退换货政策</router-link></li>
        </ul>
      </div>

      <!-- 友情链接 -->
      <div class="footer-section">
        <h3>友情链接</h3>
        <ul>
          <li v-for="(link, index) in friendlyLinks" :key="index">
            <a :href="link.url" target="_blank">{{ link.name }}</a>
          </li>
        </ul>
      </div>

      <!-- 关注我们 -->
      <div class="footer-section">
        <h3>关注我们</h3>
        <div class="social-media">
          <a href="#" class="social-icon"><i class="iconfont icon-weixin"></i></a>
          <a href="#" class="social-icon"><i class="iconfont icon-weibo"></i></a>
          <a href="#" class="social-icon"><i class="iconfont icon-douyin"></i></a>
        </div>
      </div>
    </div>

    <!-- 版权信息 -->
    <div class="copyright">
      <p>© 2024 时尚商城 版权所有 | ICP备案号：京ICP备12345678号</p>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'AppFooter',
  data() {
    return {
      friendlyLinks: [
        { name: '时尚资讯', url: 'https://fashion-news.com' },
        { name: '潮流趋势', url: 'https://fashion-trends.com' },
        { name: '品牌故事', url: 'https://brand-stories.com' },
        { name: '时尚博客', url: 'https://fashion-blog.com' }
      ]
    }
  }
}
</script>

<style scoped>
.footer {
  background-color: #f8f8f8;
  padding: 40px 0 20px;
  margin-top: 50px;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  padding: 0 20px;
}

.footer-section {
  flex: 1;
  margin: 0 15px;
}

.footer-section h3 {
  font-size: 18px;
  color: #333;
  margin-bottom: 20px;
}

.footer-section ul {
  list-style: none;
  padding: 0;
}

.footer-section li {
  margin-bottom: 10px;
}

.footer-section a {
  color: #666;
  text-decoration: none;
  font-size: 14px;
}

.footer-section a:hover {
  color: #333;
}

.social-media {
  display: flex;
  gap: 15px;
}

.social-icon {
  font-size: 24px;
  color: #666;
}

.social-icon:hover {
  color: #333;
}

.copyright {
  text-align: center;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #ddd;
}

.copyright p {
  color: #999;
  font-size: 12px;
}
</style> 