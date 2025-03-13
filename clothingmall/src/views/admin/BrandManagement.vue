<template>
  <div class="brand-management">
    <!-- 搜索和操作栏 -->
    <div class="action-bar">
      <el-input v-model="searchQuery" placeholder="搜索品牌名称" style="width: 200px" @keyup.enter.native="handleSearch">
        <el-button slot="append" icon="el-icon-search" @click="handleSearch"></el-button>
      </el-input>

      <el-button type="primary" @click="handleAdd">
        添加品牌
      </el-button>
    </div>

    <!-- 品牌列表 -->
    <el-table v-loading="loading" :data="brands" border style="width: 100%">
      <el-table-column prop="id" label="ID" width="80"></el-table-column>

      <el-table-column label="品牌Logo" width="120">
        <template slot-scope="scope">
          <img :src="scope.row.logo" :alt="scope.row.name" class="brand-logo">
        </template>
      </el-table-column>

      <el-table-column prop="type" label="品牌名称"></el-table-column>




      <el-table-column label="操作" width="150" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>



    <!-- 品牌表单对话框 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="500px">
      <el-form ref="brandForm" :model="brandForm" :rules="rules" label-width="80px">
        <el-form-item label="品牌名称" prop="type">
          <el-input v-model="brandForm.type"></el-input>
        </el-form-item>

        <el-form-item label="品牌Logo" prop="logo">
          <el-upload class="avatar-uploader" :action="uploadUrl" :show-file-list="false" :on-success="handleLogoSuccess"
            :before-upload="beforeLogoUpload">
            <img v-if="brandForm.logo" :src="brandForm.logo" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitting">
          确 定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import brandApi from '@/api/admin/brand'

export default {
  name: 'BrandManagement',
  data() {
    return {
      // 列表数据
      brands: [],
      loading: false,
      page: 1,
      pageSize: 10,
      total: 0,
      searchQuery: '',

      // 对话框
      dialogVisible: false,
      dialogTitle: '',
      submitting: false,

      // 表单数据
      brandForm: {
        name: '',
        type: '',
        logo: '',
        description: ''
      },

      // 表单验证规则
      rules: {
        name: [
          { required: true, message: '请输入品牌名称', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择品牌类型', trigger: 'change' }
        ],
        logo: [
          { required: true, message: '请上传品牌Logo', trigger: 'change' }
        ]
      },

      uploadUrl: 'api/file/upload'
    }
  },

  created() {
    this.fetchBrands()
  },

  methods: {
    // 获取品牌列表
    async fetchBrands() {
      this.loading = true
      try {
        const params = {
          page: this.page,
          pageSize: this.pageSize,
          query: this.searchQuery,
          searchQuery: this.searchQuery,
        }
        const res = await brandApi.list(params)
        this.brands = res.data

      } catch (error) {
        console.error('获取品牌列表失败:', error)
        this.$message.error('获取品牌列表失败')
      } finally {
        this.loading = false
      }
    },

    // 搜索
    handleSearch() {
      this.page = 1
      this.fetchBrands()
    },

    // 添加品牌
    handleAdd() {
      this.dialogTitle = '添加品牌'
      this.brandForm = {
        name: '',
        type: '',
        logo: '',
        description: ''
      }
      this.dialogVisible = true
    },

    // 编辑品牌
    handleEdit(row) {
      this.dialogTitle = '编辑品牌'
      this.brandForm = { ...row }
      this.dialogVisible = true
    },

    // 删除品牌
    handleDelete(row) {
      this.$confirm('确认删除该品牌吗？', '提示', {
        type: 'warning'
      }).then(async () => {
        try {
          await brandApi.delete(row.id)
          this.$message.success('删除成功')
          this.fetchBrands()
        } catch (error) {
          this.$message.error('删除失败')
        }
      }).catch(() => { })
    },

    // 提交表单
    handleSubmit() {
      this.$refs.brandForm.validate(async valid => {
        if (!valid) return

        this.submitting = true
        try {
          if (this.brandForm.id) {
            await brandApi.update(this.brandForm.id, this.brandForm)
          } else {
            await brandApi.create(this.brandForm)
          }

          this.$message.success('保存成功')
          this.dialogVisible = false
          this.fetchBrands()
        } catch (error) {
          this.$message.error('保存失败')
        } finally {
          this.submitting = false
        }
      })
    },

    // Logo上传相关方法
    handleLogoSuccess(res) {
      this.brandForm.logo = res.data
    },

    beforeLogoUpload(file) {
      const isImage = file.type.startsWith('image/')
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isImage) {
        this.$message.error('上传Logo只能是图片格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传Logo不能超过 2MB!')
      }

      return isImage && isLt2M
    },

    // 分页方法
    handleSizeChange(val) {
      this.pageSize = val
      this.fetchBrands()
    },

    handleCurrentChange(val) {
      this.page = val
      this.fetchBrands()
    },

    // 状态切换
    async handleStatusChange(row) {
      try {
        await brandApi.update(row.id, { status: row.status })
        this.$message.success('状态更新成功')
      } catch (error) {
        row.status = row.status === 1 ? 0 : 1 // 恢复状态
        this.$message.error('状态更新失败')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.brand-management {
  .action-bar {
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;
  }

  .brand-logo {
    width: 40px;
    height: 40px;
    object-fit: contain;
  }

  .pagination-container {
    margin-top: 20px;
    text-align: right;
  }

  .avatar-uploader {
    :deep(.el-upload) {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;

      &:hover {
        border-color: #409EFF;
      }
    }

    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 100px;
      height: 100px;
      line-height: 100px;
      text-align: center;
    }

    .avatar {
      width: 100px;
      height: 100px;
      display: block;
    }
  }
}
</style>