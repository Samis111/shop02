<template>
  <div class="user-profile">
    <h2>个人中心</h2>
    <el-form :model="userForm" label-width="100px" ref="userForm">
      <el-form-item label="用户名">
        <el-input v-model="userForm.username" disabled></el-input>
      </el-form-item>
      <el-form-item label="昵称">
        <el-input v-model="userForm.nickname"></el-input>
      </el-form-item>
      <el-form-item label="手机号">
        <el-input v-model="userForm.phone"></el-input>
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input v-model="userForm.email"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSubmit">保存修改</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'UserProfile',
  data() {
    return {
      userForm: {
        username: '',
        nickname: '',
        phone: '',
        email: ''
      }
    }
  },
  computed: {
    ...mapState('user', ['userInfo'])
  },
  created() {
    this.initUserForm()
  },
  methods: {
    initUserForm() {
      if (this.userInfo) {
        this.userForm = { ...this.userInfo }
      }
    },
    async handleSubmit() {
      try {
        await this.$refs.userForm.validate()
        await this.$api.user.updateUserInfo(this.userForm)
        this.$message.success('保存成功')
      } catch (error) {
        if (error !== false) {
          this.$message.error('保存失败：' + error.message)
        }
      }
    }
  }
}
</script>

<style scoped>
.user-profile {
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

h2 {
  margin-bottom: 30px;
  font-size: 24px;
  color: #333;
}
</style> 