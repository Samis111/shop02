<template>
  <div class="banner-management">
    <!-- 操作栏 -->
    <div class="action-bar">
      <el-button type="primary" @click="handleAdd">
        添加轮播图
      </el-button>
    </div>

    <!-- 轮播图列表 -->
    <el-table
      v-loading="loading"
      :data="banners"
      border
      row-key="id"
      style="width: 100%"
    >
      <el-table-column prop="id" label="ID" width="80"></el-table-column>
      
      <el-table-column label="图片" width="200">
        <template slot-scope="scope">
          <el-image
            :src="scope.row.image"
            :preview-src-list="[scope.row.image]"
            fit="cover"
            class="banner-image"
          ></el-image>
        </template>
      </el-table-column>
      
      <el-table-column prop="title" label="标题"></el-table-column>
      
      <el-table-column prop="link" label="链接" show-overflow-tooltip></el-table-column>
      
      <el-table-column label="排序" width="120">
        <template slot-scope="scope">
          <el-input-number 
            v-model="scope.row.sort"
            :min="1"
            size="mini"
            @change="value => handleSortChange(scope.row, value)"
          ></el-input-number>
        </template>
      </el-table-column>
      
      <el-table-column label="状态" width="100">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            :active-value="1"
            :inactive-value="0"
            @change="handleStatusChange(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      
      <el-table-column label="操作" width="150" fixed="right">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            @click="handleEdit(scope.row)"
          >编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 轮播图表单对话框 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="600px"
    >
      <el-form
        ref="bannerForm"
        :model="bannerForm"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item label="标题" prop="title">
          <el-input v-model="bannerForm.title"></el-input>
        </el-form-item>
        
        <el-form-item label="图片" prop="image">
          <el-upload
            class="banner-uploader"
            :action="uploadUrl"
            :show-file-list="false"
            :on-success="handleImageSuccess"
            :before-upload="beforeImageUpload"
          >
            <img v-if="bannerForm.image" :src="bannerForm.image" class="preview-image">
            <i v-else class="el-icon-plus uploader-icon"></i>
          </el-upload>
          <div class="image-tip">建议尺寸：1920 x 500</div>
        </el-form-item>
        
        <el-form-item label="链接" prop="link">
          <el-input v-model="bannerForm.link" placeholder="请输入跳转链接"></el-input>
        </el-form-item>
        
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="bannerForm.sort" :min="1"></el-input-number>
        </el-form-item>
        
        <el-form-item label="状态" prop="status">
          <el-switch
            v-model="bannerForm.status"
            :active-value="1"
            :inactive-value="0"
          ></el-switch>
        </el-form-item>
      </el-form>
      
      <div slot="footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="handleSubmit">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import bannerApi from '@/api/admin/banner'

export default {
  name: 'BannerManagement',
  data() {
    return {
      loading: false,
      banners: [],
      
      // 对话框
      dialogVisible: false,
      dialogTitle: '',
      submitting: false,
      
      // 表单
      bannerForm: {
        title: '',
        image: '',
        link: '',
        sort: 1,
        status: 1
      },
      
      // 表单验证规则
      rules: {
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' }
        ],
        image: [
          { required: true, message: '请上传图片', trigger: 'change' }
        ],
        link: [
          { required: true, message: '请输入链接', trigger: 'blur' }
        ]
      },
      
      // 上传地址
      uploadUrl: process.env.VUE_APP_BASE_API + '/admin/upload/banner'
    }
  },
  created() {
    this.fetchBanners()
  },
  methods: {
    // 获取轮播图列表
    async fetchBanners() {
      this.loading = true
      try {
        const res = await bannerApi.list()
        this.banners = res.data
      } catch (error) {
        this.$message.error('获取轮播图列表失败')
      } finally {
        this.loading = false
      }
    },
    
    // 添加轮播图
    handleAdd() {
      this.dialogTitle = '添加轮播图'
      this.bannerForm = {
        title: '',
        image: '',
        link: '',
        sort: 1,
        status: 1
      }
      this.dialogVisible = true
    },
    
    // 编辑轮播图
    handleEdit(row) {
      this.dialogTitle = '编辑轮播图'
      this.bannerForm = { ...row }
      this.dialogVisible = true
    },
    
    // 删除轮播图
    handleDelete(row) {
      this.$confirm('确认删除该轮播图吗？', '提示', {
        type: 'warning'
      }).then(async () => {
        try {
          await bannerApi.delete(row.id)
          this.$message.success('删除成功')
          this.fetchBanners()
        } catch (error) {
          this.$message.error('删除失败')
        }
      }).catch(() => {})
    },
    
    // 提交表单
    handleSubmit() {
      this.$refs.bannerForm.validate(async valid => {
        if (!valid) return
        
        this.submitting = true
        try {
          if (this.bannerForm.id) {
            await bannerApi.update(this.bannerForm.id, this.bannerForm)
          } else {
            await bannerApi.create(this.bannerForm)
          }
          
          this.$message.success('保存成功')
          this.dialogVisible = false
          this.fetchBanners()
        } catch (error) {
          this.$message.error('保存失败')
        } finally {
          this.submitting = false
        }
      })
    },
    
    // 图片上传相关方法
    handleImageSuccess(res) {
      this.bannerForm.image = res.data.url
    },
    
    beforeImageUpload(file) {
      const isImage = file.type.startsWith('image/')
      const isLt5M = file.size / 1024 / 1024 < 5

      if (!isImage) {
        this.$message.error('上传图片只能是图片格式!')
      }
      if (!isLt5M) {
        this.$message.error('上传图片不能超过 5MB!')
      }
      
      return isImage && isLt5M
    },
    
    // 排序变更
    async handleSortChange(row, value) {
      try {
        await bannerApi.updateSort({
          id: row.id,
          sort: value
        })
        this.$message.success('排序更新成功')
      } catch (error) {
        this.$message.error('排序更新失败')
        row.sort = row.sort // 恢复原值
      }
    },
    
    // 状态切换
    async handleStatusChange(row) {
      try {
        await bannerApi.update(row.id, { status: row.status })
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
.banner-management {
  .action-bar {
    margin-bottom: 20px;
  }
  
  .banner-image {
    width: 160px;
    height: 80px;
  }
  
  .banner-uploader {
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
    
    .uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 320px;
      height: 160px;
      line-height: 160px;
      text-align: center;
    }
    
    .preview-image {
      width: 320px;
      height: 160px;
      display: block;
      object-fit: cover;
    }
  }
  
  .image-tip {
    color: #909399;
    font-size: 12px;
    margin-top: 5px;
  }
}
</style> 