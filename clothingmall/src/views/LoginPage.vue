<template>
  <div class="login-page">
    <div class="form-container">
      <div class="form-header">
        <h2>{{ isLogin ? '登录' : '注册' }}</h2>
        <div class="switch-form">
          {{ isLogin ? '还没有账号？' : '已有账号？' }}
          <span class="switch-btn" @click="switchForm">
            {{ isLogin ? '立即注册' : '去登录' }}
          </span>
        </div>
      </div>

      <!-- 登录表单 -->
      <el-form v-if="isLogin" ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form">
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" placeholder="用户名/手机号/邮箱" prefix-icon="el-icon-user" />
        </el-form-item>

        <el-form-item prop="password">
          <el-input v-model="loginForm.password" type="password" placeholder="密码" prefix-icon="el-icon-lock"
            show-password />
        </el-form-item>

        <div class="form-options">
          <el-checkbox v-model="rememberMe">记住我</el-checkbox>
          <span class="forget-pwd" @click="forgetPassword">忘记密码？</span>
        </div>

        <el-button type="primary" class="submit-btn" :loading="loading" @click="handleLogin">登录</el-button>

        <!-- 第三方登录 -->
 
      </el-form>

      <!-- 注册表单 -->
      <el-form v-else ref="registerForm" :model="registerForm" :rules="registerRules" class="register-form">
        <el-form-item prop="username">
          <el-input v-model="registerForm.username" placeholder="请输入用户名" prefix-icon="el-icon-user" />
        </el-form-item>

        <el-form-item prop="phone">
          <el-input v-model="registerForm.phone" placeholder="请输入手机号" prefix-icon="el-icon-mobile-phone">
            <template #append>
              <el-button :disabled="!!countdown" @click="sendCode">
                {{ countdown ? `${countdown}s` : '获取验证码' }}
              </el-button>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item prop="code">
          <el-input v-model="registerForm.code" placeholder="请输入验证码" prefix-icon="el-icon-message" />
        </el-form-item>

        <el-form-item prop="password">
          <el-input v-model="registerForm.password" type="password" placeholder="请设置密码" prefix-icon="el-icon-lock"
            show-password />
        </el-form-item>

        <el-form-item prop="confirmPassword">
          <el-input v-model="registerForm.confirmPassword" type="password" placeholder="请确认密码"
            prefix-icon="el-icon-lock" show-password />
        </el-form-item>

        <div class="agreement">
          <el-checkbox v-model="agreeTerms">
            我已阅读并同意
            <span class="link">《用户协议》</span>和
            <span class="link">《隐私政策》</span>
          </el-checkbox>
        </div>

        <el-button type="primary" class="submit-btn" :loading="loading" @click="handleRegister">注册</el-button>
      </el-form>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'LoginPage',
  data() {
    // 密码确认验证
    const validateConfirmPassword = (rule, value, callback) => {
      if (value !== this.registerForm.password) {
        callback(new Error('两次输入的密码不一致'))
      } else {
        callback()
      }
    }

    return {
      isLogin: true,
      loading: false,
      rememberMe: false,
      agreeTerms: false,
      countdown: 0,
      loginForm: {
        username: '',
        password: ''
      },
      registerForm: {
        username: '',
        phone: '',
        code: '',
        password: '',
        confirmPassword: ''
      },
      loginRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
        ]
      },
      registerRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, message: '用户名长度不能小于3位', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          { len: 6, message: '验证码长度应为6位', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请设置密码', trigger: 'blur' },
          { min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: '请确认密码', trigger: 'blur' },
          { validator: validateConfirmPassword, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    ...mapActions({
      loginAction: 'user/login',
      registerAction: 'user/register'
    }),
    switchForm() {
      this.isLogin = !this.isLogin
    },
    async handleLogin() {
      try {
        await this.$refs.loginForm.validate()
        this.loading = true

        await this.loginAction({
          username: this.loginForm.username,
          password: this.loginForm.password,
          remember: this.rememberMe
        })

        this.$message.success('登录成功')
        const redirect = this.$route.query.redirect || '/'
        this.$router.push(redirect)
      } catch (error) {
        if (error.message) {
          this.$message.error(error.message)
        }
      } finally {
        this.loading = false
      }
    },
    async handleRegister() {
      if (!this.agreeTerms) {
        this.$message.warning('请阅读并同意用户协议和隐私政策')
        return
      }

      try {
        await this.$refs.registerForm.validate()
        this.loading = true

        await this.registerAction({
          username: this.registerForm.username,
          phone: this.registerForm.phone,
          code: this.registerForm.code,
          password: this.registerForm.password
        })

        this.$message.success('注册成功，请登录')
        this.isLogin = true
      } catch (error) {
        if (error.message) {
          this.$message.error(error.message)
        }
      } finally {
        this.loading = false
      }
    },
    async sendCode() {
      try {
        if (!this.registerForm.phone) {
          this.$message.warning('请先输入手机号')
          return
        }

        await this.$api.user.sendCode(this.registerForm.phone)
        this.$message.success('验证码已发送')

        // 开始倒计时
        this.countdown = 60
        const timer = setInterval(() => {
          this.countdown--
          if (this.countdown === 0) {
            clearInterval(timer)
          }
        }, 1000)
      } catch (error) {
        this.$message.error('验证码发送失败')
      }
    },
    forgetPassword() {
      // TODO: 实现忘记密码功能
      this.$message.info('忘记密码功能开发中')
    }
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f5f5f5;
  padding: 20px;
}

.form-container {
  width: 100%;
  max-width: 400px;
  padding: 30px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.form-header {
  text-align: center;
  margin-bottom: 30px;
}

.form-header h2 {
  margin: 0 0 10px;
  color: #333;
}

.switch-form {
  color: #666;
  font-size: 14px;
}

.switch-btn {
  color: #ff4d4f;
  cursor: pointer;
}

.switch-btn:hover {
  text-decoration: underline;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.forget-pwd {
  color: #666;
  font-size: 14px;
  cursor: pointer;
}

.forget-pwd:hover {
  color: #ff4d4f;
}

.submit-btn {
  width: 100%;
}

.third-party-login {
  margin-top: 30px;
}

.divider {
  display: flex;
  align-items: center;
  margin: 20px 0;
  color: #999;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: #eee;
}

.divider span {
  padding: 0 15px;
  font-size: 12px;
}

.third-party-btns {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.third-party-btn {
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  background: #f5f5f5;
  cursor: pointer;
  transition: all 0.3s;
}

.third-party-btn:hover {
  transform: translateY(-2px);
}

.third-party-btn.wechat {
  color: #07c160;
}

.third-party-btn.alipay {
  color: #1677ff;
}

.agreement {
  margin: 20px 0;
  font-size: 14px;
}

.link {
  color: #ff4d4f;
  cursor: pointer;
}

.link:hover {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .form-container {
    padding: 20px;
  }
}
</style>