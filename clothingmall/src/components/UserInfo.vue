<template>
  <div class="user-info">
    <div class="section-header">
      <h3>个人信息</h3>
      <button class="edit-btn" @click="showEditForm">
        <i class="iconfont icon-edit"></i>
        编辑资料
      </button>
    </div>

    <!-- 个人信息展示 -->
    <div class="info-content">
      <div class="avatar-section">
        <div class="avatar-wrapper">
          <img :src="userInfo.avatar" :alt="userInfo.nickname">
        </div>
        <div class="user-name">
          <h4>{{ userInfo.nickname }}</h4>
          <span class="member-tag">{{ userInfo.memberLevel }}</span>
        </div>
      </div>

      <div class="info-list">
        <div class="info-item">
          <span class="label">手机号码</span>
          <span class="value">{{ formatPhone(userInfo.phone) }}</span>
        </div>
        <div class="info-item">
          <span class="label">电子邮箱</span>
          <span class="value">{{ userInfo.email || '未设置' }}</span>
        </div>
        <div class="info-item">
          <span class="label">性别</span>
          <span class="value">{{ genderText }}</span>
        </div>
        <div class="info-item">
          <span class="label">生日</span>
          <span class="value">{{ userInfo.birthday || '未设置' }}</span>
        </div>
      </div>
    </div>

    <!-- 编辑表单弹窗 -->
    <el-dialog title="编辑个人资料" :visible.sync="showDialog" width="500px">
      <el-form ref="userForm" :model="userForm" :rules="rules" label-width="80px">
        <el-form-item label="头像">
          <el-upload class="avatar-uploader" :action="uploadUrl" :show-file-list="false"
            :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
            <img v-if="userForm.avatar" :src="userForm.avatar" class="avatar">
            <i v-else class="iconfont icon-upload"></i>
          </el-upload>
        </el-form-item>

        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="userForm.nickname" />
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userForm.email" />
        </el-form-item>

        <el-form-item label="性别">
          <el-radio-group v-model="userForm.gender">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="2">女</el-radio>
            <el-radio :label="0">保密</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="生日">
          <el-date-picker v-model="userForm.birthday" type="date" placeholder="选择日期" format="yyyy-MM-dd"
            value-format="yyyy-MM-dd" />
        </el-form-item>
      </el-form>

      <div slot="footer">
        <el-button @click="showDialog = false">取消</el-button>
        <el-button type="primary" @click="saveUserInfo">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'UserInfo',
  data() {
    return {
      showDialog: false,
      userForm: {
        avatar: '',
        nickname: '',
        email: '',
        gender: 0,
        birthday: ''
      },
      rules: {
        nickname: [
          { required: true, message: '请输入昵称', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        email: [
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
        ]
      },
      uploadUrl: 'api/file/upload'
    }
  },
  computed: {
    userInfo() {
      return this.$store.state.user.info
    },
    genderText() {
      const genderMap = {
        0: '保密',
        1: '男',
        2: '女'
      }
      return genderMap[this.userInfo.gender] || '保密'
    }
  },
  methods: {
    formatPhone(phone) {
      return phone ? phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2') : ''
    },
    showEditForm() {
      this.userForm = {
        ...this.userInfo
      }
      this.showDialog = true
    },
    async saveUserInfo() {
      try {
        await this.$refs.userForm.validate()

        await this.$store.dispatch('user/updateUserInfo', this.userForm)
        this.$message.success('个人资料已更新')
        this.showDialog = false
      } catch (error) {
        if (error === false) return // 表单验证失败
        this.$message.error('更新失败')
      }
    },
    beforeAvatarUpload(file) {
      const isImage = file.type.startsWith('image/')
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isImage) {
        this.$message.error('只能上传图片文件')
        return false
      }
      if (!isLt2M) {
        this.$message.error('图片大小不能超过 2MB')
        return false
      }
      return true
    },
    handleAvatarSuccess(response) {
      this.userForm.avatar = response.data.url
    }
  }
}
</script>

<style scoped>
.user-info {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.section-header h3 {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.edit-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 8px 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #fff;
  color: #333;
  cursor: pointer;
  transition: all 0.3s;
}

.edit-btn:hover {
  border-color: #333;
  color: #000;
}

.avatar-section {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
}

.avatar-wrapper {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
}

.avatar-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-name {
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-name h4 {
  margin: 0;
  font-size: 20px;
  color: #333;
}

.member-tag {
  padding: 2px 8px;
  background: #ff4d4f;
  color: #fff;
  border-radius: 2px;
  font-size: 12px;
}

.info-list {
  display: grid;
  gap: 20px;
}

.info-item {
  display: flex;
  align-items: center;
}

.info-item .label {
  width: 80px;
  color: #666;
}

.info-item .value {
  color: #333;
}

.avatar-uploader {
  width: 100px;
  height: 100px;
  border: 1px dashed #ddd;
  border-radius: 50%;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-uploader i {
  font-size: 28px;
  color: #8c939d;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

@media (max-width: 768px) {
  .user-info {
    padding: 15px;
  }

  .avatar-section {
    flex-direction: column;
    text-align: center;
  }

  .user-name {
    flex-direction: column;
    gap: 5px;
  }
}
</style>