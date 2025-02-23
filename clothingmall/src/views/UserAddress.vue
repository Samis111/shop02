<template>
  <div class="user-address">
    <h2>收货地址管理</h2>
    
    <!-- 添加地址按钮 -->
    <div class="address-actions">
      <el-button type="primary" @click="showAddressDialog = true">
        <i class="el-icon-plus"></i> 新增收货地址
      </el-button>
    </div>

    <!-- 地址列表 -->
    <div class="address-list">
      <el-card v-for="address in addresses" :key="address.id" class="address-item">
        <div class="address-info">
          <div class="recipient">
            <span class="name">{{ address.name }}</span>
            <span class="phone">{{ address.phone }}</span>
            <el-tag size="small" type="success" v-if="address.isDefault">默认</el-tag>
          </div>
          <div class="address-detail">
            {{ address.province }}{{ address.city }}{{ address.district }}{{ address.detail }}
          </div>
        </div>
        <div class="address-actions">
          <el-button type="text" @click="handleEdit(address)">编辑</el-button>
          <el-button type="text" @click="handleDelete(address.id)">删除</el-button>
          <el-button 
            type="text" 
            v-if="!address.isDefault"
            @click="handleSetDefault(address.id)"
          >
            设为默认
          </el-button>
        </div>
      </el-card>
    </div>

    <!-- 地址编辑对话框 -->
    <el-dialog 
      :title="editingAddress.id ? '编辑地址' : '新增地址'" 
      :visible.sync="showAddressDialog"
    >
      <el-form :model="editingAddress" :rules="rules" ref="addressForm" label-width="100px">
        <el-form-item label="收货人" prop="name">
          <el-input v-model="editingAddress.name"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="phone">
          <el-input v-model="editingAddress.phone"></el-input>
        </el-form-item>
        <el-form-item label="所在地区" prop="region">
          <el-cascader
            v-model="editingAddress.region"
            :options="regions"
            @change="handleRegionChange"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="detail">
          <el-input type="textarea" v-model="editingAddress.detail"></el-input>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="editingAddress.isDefault">设为默认收货地址</el-checkbox>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="showAddressDialog = false">取消</el-button>
        <el-button type="primary" @click="handleSaveAddress">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'UserAddress',
  data() {
    return {
      addresses: [],
      showAddressDialog: false,
      editingAddress: {
        id: null,
        name: '',
        phone: '',
        region: [],
        province: '',
        city: '',
        district: '',
        detail: '',
        isDefault: false
      },
      regions: [], // 省市区数据
      rules: {
        name: [
          { required: true, message: '请输入收货人姓名', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
        ],
        region: [
          { required: true, message: '请选择所在地区', trigger: 'change' }
        ],
        detail: [
          { required: true, message: '请输入详细地址', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.fetchAddresses()
  },
  methods: {
    async fetchAddresses() {
      try {
        const response = await this.$api.address.list()
        this.addresses = response.data
      } catch (error) {
        this.$message.error('获取地址列表失败：' + error.message)
      }
    },
    handleEdit(address) {
      this.editingAddress = { ...address }
      this.showAddressDialog = true
    },
    async handleDelete(id) {
      try {
        await this.$confirm('确定要删除这个地址吗？')
        await this.$api.address.delete(id)
        this.$message.success('删除成功')
        this.fetchAddresses()
      } catch (error) {
        if (error !== 'cancel') {
          this.$message.error('删除失败：' + error.message)
        }
      }
    },
    async handleSetDefault(id) {
      try {
        await this.$api.address.setDefault(id)
        this.$message.success('设置成功')
        this.fetchAddresses()
      } catch (error) {
        this.$message.error('设置失败：' + error.message)
      }
    },
    handleRegionChange(value) {
      if (value.length === 3) {
        [this.editingAddress.province, this.editingAddress.city, this.editingAddress.district] = value
      }
    },
    async handleSaveAddress() {
      try {
        await this.$refs.addressForm.validate()
        if (this.editingAddress.id) {
          await this.$api.address.update(this.editingAddress)
        } else {
          await this.$api.address.create(this.editingAddress)
        }
        this.$message.success('保存成功')
        this.showAddressDialog = false
        this.fetchAddresses()
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
.user-address {
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

.address-actions {
  margin-bottom: 20px;
}

.address-list {
  display: grid;
  gap: 20px;
}

.address-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.address-info {
  flex: 1;
}

.recipient {
  margin-bottom: 10px;
}

.name {
  font-weight: bold;
  margin-right: 10px;
}

.phone {
  color: #666;
  margin-right: 10px;
}

.address-detail {
  color: #333;
  line-height: 1.5;
}

.address-actions {
  display: flex;
  gap: 10px;
}
</style> 