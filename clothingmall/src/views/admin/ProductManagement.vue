<template>
  <div class="product-management">
    <!-- 搜索和操作栏 -->
    <div class="action-bar">
      <div class="search-area">
        <el-input v-model="searchQuery.name" placeholder="商品名称" style="width: 200px" @keyup.enter.native="handleSearch">
          <el-button slot="append" icon="el-icon-search" @click="handleSearch"></el-button>
        </el-input>

        <el-select v-model="searchQuery.brand" placeholder="品牌" clearable>
          <el-option v-for="brand in brands" :key="brand.id" :label="brand.name" :value="brand.id"></el-option>
        </el-select>


      </div>

      <el-button type="primary" @click="handleAdd">
        添加商品
      </el-button>
    </div>

    <!-- 商品列表 -->
    <el-table v-loading="loading" :data="products" border style="width: 100%">
      <el-table-column prop="id" label="ID" width="80"></el-table-column>

      <el-table-column label="商品图片" width="120">
        <template slot-scope="scope">
          <img :src="scope.row.url" :alt="scope.row.name" class="product-image">
        </template>
      </el-table-column>

      <el-table-column prop="name" label="商品名称"></el-table-column>

      <el-table-column prop="type" label="品牌"></el-table-column>


      <el-table-column label="价格" width="120">
        <template slot-scope="scope">
          ¥{{ scope.row.price.toFixed(2) }}
        </template>
      </el-table-column>


      <!-- <el-table-column label="状态" width="100">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.status" :active-value="1" :inactive-value="0"
            @change="handleStatusChange(scope.row)"></el-switch>
        </template>
      </el-table-column> -->

      <el-table-column label="操作" width="150" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>



    <!-- 商品表单对话框 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="700px">
      <el-form ref="productForm" :model="productForm"  label-width="100px">
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="productForm.name"></el-input>
        </el-form-item>

        <el-form-item label="商品图片" prop="image">
          <el-upload class="image-uploader" :action="uploadUrl" :show-file-list="false" :on-success="handleImageSuccess"
            :before-upload="beforeImageUpload">
            <img v-if="productForm.url" :src="productForm.url" class="preview-image">
            <i v-else class="el-icon-plus image-uploader-icon"></i>
          </el-upload>
        </el-form-item>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="品牌" prop="brandId">
              <el-select v-model="productForm.type" placeholder="请选择品牌">
                <el-option v-for="brand in brands" :key="brand.id" :label="brand.name" :value="brand.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="价格" prop="price">
              <el-input-number v-model="productForm.price" :precision="2" :step="0.1" :min="0"></el-input-number>
            </el-form-item>
          </el-col>


        </el-row>

        <el-form-item label="商品描述" prop="node">
          <el-input type="textarea" v-model="productForm.node" :rows="4"></el-input>
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
import productApi from '@/api/admin/product'
import brandApi from '@/api/admin/brand'

export default {
  name: 'ProductManagement',
  data() {
    return {
      // 列表数据
      products: [],
      loading: false,
      page: 1,
      pageSize: 10,
      total: 0,

      // 搜索条件
      searchQuery: {
        name: '',
        brand: '',
        category: ''
      },

      // 品牌和分类数据
      brands: [],
      categories: [],

      // 对话框
      dialogVisible: false,
      dialogTitle: '',
      submitting: false,

      // 表单数据
      productForm: {
        name: '',
        url: '',
        brandId: '',
        categoryId: '',
        price: 0,
        stock: 0,
        description: ''
      },

      // 表单验证规则
     

      uploadUrl: 'api/file/upload'
    }
  },

  created() {
    this.fetchProducts()
    this.fetchBrands()
    this.fetchCategories()
  },

  methods: {
    // 获取商品列表
    async fetchProducts() {
      this.loading = true
      try {
        const params = {
          page: this.page,
          pageSize: this.pageSize,
          ...this.searchQuery
        }
        const res = await productApi.list(params)
        this.products = res.data

      } catch (error) {
        console.error('获取商品列表失败:', error)
        this.$message.error('获取商品列表失败')
      } finally {
        this.loading = false
      }
    },

    // 获取品牌列表
    async fetchBrands() {
      try {
        const res = await brandApi.list()
        this.brands = res.data
      } catch (error) {
        console.error('获取品牌列表失败:', error)
      }
    },

    // 获取分类列表
    async fetchCategories() {
      // 实现获取分类列表的逻辑
    },

    // 搜索
    handleSearch() {
      this.page = 1
      this.fetchProducts()
    },

    // 添加商品
    handleAdd() {
      this.dialogTitle = '添加商品'
      this.productForm = {
        name: '',
        
        brandId: '',
        categoryId: '',
        price: 0,
        stock: 0,
        description: ''
      }
      this.dialogVisible = true
    },

    // 编辑商品
    handleEdit(row) {

      console.log(row)

      this.dialogTitle = '编辑商品'
      this.productForm = { ...row }

      this.dialogVisible = true
    },

    // 删除商品
    handleDelete(row) {
      this.$confirm('确认删除该商品吗？', '提示', {
        type: 'warning'
      }).then(async () => {
        try {
          await productApi.delete(row.id)
          this.$message.success('删除成功')
          this.fetchProducts()
        } catch (error) {
          this.$message.error('删除失败')
        }
      }).catch(() => { })
    },

    // 提交表单
    handleSubmit() {
      this.$refs.productForm.validate(async valid => {
        if (!valid) return

        this.submitting = true
        try {
          if (this.productForm.id) {
            await productApi.update(this.productForm.id, this.productForm)
          } else {
            await productApi.create(this.productForm)
          }

          this.$message.success('保存成功')
          this.dialogVisible = false
          this.fetchProducts()
        } catch (error) {
          this.$message.error('保存失败')
        } finally {
          this.submitting = false
        }
      })
    },

    // 图片上传相关方法
    handleImageSuccess(res) {

      

      this.productForm.url = res.data
      this.productForm.name=999

      console.log(this.productForm)

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

    // 分页方法
    handleSizeChange(val) {
      this.pageSize = val
      this.fetchProducts()
    },

    handleCurrentChange(val) {
      this.page = val
      this.fetchProducts()
    },

    // 状态切换
    async handleStatusChange(row) {
      try {
        await productApi.updateStatus(row.id, row.status)
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
.product-management {
  .action-bar {
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;

    .search-area {
      display: flex;
      gap: 10px;
    }
  }

  .product-image {
    width: 60px;
    height: 60px;
    object-fit: cover;
    border-radius: 4px;
  }

  .pagination-container {
    margin-top: 20px;
    text-align: right;
  }

  .image-uploader {
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

    .image-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 150px;
      height: 150px;
      line-height: 150px;
      text-align: center;
    }

    .preview-image {
      width: 150px;
      height: 150px;
      display: block;
      object-fit: cover;
    }
  }
}
</style>