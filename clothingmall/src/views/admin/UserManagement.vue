<template>
  <div class="user-management">
    <!-- 搜索栏 -->
    <div class="search-bar">
      <el-input v-model="searchQuery.keyword" placeholder="用户名" style="width: 200px"
        @keyup.enter.native="handleSearch">
        <el-button slot="append" icon="el-icon-search" @click="handleSearch"></el-button>
      </el-input>

      <el-select v-model="searchQuery.status" placeholder="状态" clearable>
        <el-option label="正常" :value="1"></el-option>
        <el-option label="禁用" :value="0"></el-option>
      </el-select>
    </div>

    <!-- 用户列表 -->
    <el-table v-loading="loading" :data="users" border style="width: 100%">
      <el-table-column prop="id" label="ID" width="80"></el-table-column>

      <el-table-column label="头像" width="80">
        <template slot-scope="scope">
          <el-avatar :src="scope.row.url" :alt="scope.row.username"></el-avatar>
        </template>
      </el-table-column>

      <el-table-column prop="username" label="用户名"></el-table-column>

      <el-table-column prop="name" label="昵称"></el-table-column>

      <el-table-column prop="phone" label="手机号"></el-table-column>
      <el-table-column prop="role" label="角色"></el-table-column>
    
      <el-table-column label="状态" width="100">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.status" :active-value="1" :inactive-value="0"
            @change="handleStatusChange(scope.row)"></el-switch>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="200" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleViewDetail(scope.row)">查看</el-button>
          <el-button size="mini" type="warning" @click="handleResetPassword(scope.row)">重置密码</el-button>
        </template>
      </el-table-column>
    </el-table>


    <!-- 用户详情对话框 -->
    <el-dialog title="用户详情" :visible.sync="detailVisible" width="600px">
      <div v-loading="detailLoading" class="user-detail">
        <div class="detail-header">
          <el-avatar :size="80" :src="currentUser.avatar"></el-avatar>
          <div class="user-info">
            <h3>{{ currentUser.username }}</h3>
            <p>{{ currentUser.nickname }}</p>
          </div>
        </div>

        <el-descriptions :column="2" border>
          <el-descriptions-item label="用户ID">{{ currentUser.id }}</el-descriptions-item>
          <el-descriptions-item label="注册时间">{{ formatTime(currentUser.createTime) }}</el-descriptions-item>
          <el-descriptions-item label="手机号">{{ currentUser.phone }}</el-descriptions-item>
          <el-descriptions-item label="邮箱">{{ currentUser.email }}</el-descriptions-item>
          <el-descriptions-item label="订单数">{{ currentUser.orderCount }}</el-descriptions-item>
          <el-descriptions-item label="消费金额">¥{{ currentUser.totalSpent }}</el-descriptions-item>
          <el-descriptions-item label="最近登录">{{ formatTime(currentUser.lastLoginTime) }}</el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="currentUser.status === 1 ? 'success' : 'danger'">
              {{ currentUser.status === 1 ? '正常' : '禁用' }}
            </el-tag>
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import userApi from '@/api/admin/user'
import { formatTime, formatTimeAgo } from '@/utils/format'

export default {
  name: 'UserManagement',
  data() {
    return {
      loading: false,
      users: [],
      page: 1,
      pageSize: 10,
      total: 0,
      searchQuery: {
        keyword: '',
        status: ''
      },

      // 用户详情
      detailVisible: false,
      detailLoading: false,
      currentUser: {}
    }
  },
  created() {
    this.fetchUsers()
  },
  methods: {
    formatTime,
    formatTimeAgo,

    // 获取用户列表
    async fetchUsers() {
      this.loading = true
      try {
        const res = await userApi.list({
          page: this.page,
          pageSize: this.pageSize,
          ...this.searchQuery
        })
        this.users = res.data
      
      } catch (error) {
        this.$message.error('获取用户列表失败')
      } finally {
        this.loading = false
      }
    },

    // 搜索
    handleSearch() {
      this.page = 1
      this.fetchUsers()
    },

    // 查看详情
    async handleViewDetail(row) {
      this.detailVisible = true
      this.detailLoading = true
      try {
        const res = await userApi.getDetail(row.id)
        this.currentUser = res.data
      } catch (error) {
        this.$message.error('获取用户详情失败')
      } finally {
        this.detailLoading = false
      }
    },

    // 重置密码
    handleResetPassword(row) {
      this.$confirm('确认重置该用户的密码吗？', '提示', {
        type: 'warning'
      }).then(async () => {
        try {
          await userApi.resetPassword(row.id)
          this.$message.success('密码重置成功')
        } catch (error) {
          this.$message.error('密码重置失败')
        }
      }).catch(() => { })
    },

    // 状态切换
    async handleStatusChange(row) {
      try {
        await userApi.updateStatus(row.id, row.state)
        this.$message.success('状态更新成功')
      } catch (error) {
        row.state = row.state === 1 ? 0 : 1 // 恢复状态
        this.$message.error('状态更新失败')
      }
    },

    // 分页方法
    handleSizeChange(val) {
      this.pageSize = val
      this.fetchUsers()
    },

    handleCurrentChange(val) {
      this.page = val
      this.fetchUsers()
    }
  }
}
</script>

<style lang="scss" scoped>
.user-management {
  .search-bar {
    margin-bottom: 20px;
    display: flex;
    gap: 10px;
  }

  .pagination-container {
    margin-top: 20px;
    text-align: right;
  }

  .user-detail {
    .detail-header {
      display: flex;
      align-items: center;
      margin-bottom: 20px;

      .user-info {
        margin-left: 20px;

        h3 {
          margin: 0 0 8px;
          font-size: 18px;
        }

        p {
          margin: 0;
          color: #666;
        }
      }
    }
  }
}
</style>