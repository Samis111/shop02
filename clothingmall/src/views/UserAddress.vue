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
            :props="{
              value: 'value',
              label: 'label',
              children: 'children'
            }"
            placeholder="请选择省/市/区"
            filterable
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
import { mapState } from 'vuex'
import regions from '@/utils/regions'
import areaData from 'china-area-data'

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
      regions: regions,
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
  computed: {
    ...mapState('user', ['userInfo'])
  },
  created() {
    if (this.userInfo && this.userInfo.uid) {
      this.fetchAddresses()
    } else {
      this.$message.warning('用户信息不完整，请重新登录')
      this.$router.push('/login')
    }
  },
  methods: {
    async fetchAddresses() {
      if (!this.userInfo || !this.userInfo.uid) {
        this.$message.warning('用户信息不完整，请重新登录')
        this.$router.push('/login')
        return
      }

      try {
        console.log('Fetching addresses for user:', this.userInfo.uid)
        const response = await this.$api.address.list(this.userInfo.uid)
        if (response.code === 200) {
          this.addresses = response.data || []
        } else {
          throw new Error(response.message || '获取地址列表失败')
        }
      } catch (error) {
        console.error('获取地址列表失败:', error)
        this.$message.error('获取地址列表失败：' + (error.message || '未知错误'))
        this.addresses = []
      }
    },
    handleEdit(address) {
      // 从地址数据中提取区域编码
      const regionCodes = []
      if (address.province) {
        // 查找省份代码
        const provinceCode = Object.keys(areaData['86']).find(
          code => areaData['86'][code] === address.province
        )
        if (provinceCode) {
          regionCodes.push(provinceCode)
          
          // 查找城市代码
          const cities = areaData[provinceCode]
          const cityCode = Object.keys(cities).find(
            code => cities[code] === address.city
          )
          if (cityCode) {
            regionCodes.push(cityCode)
            
            // 查找区县代码
            const areas = areaData[cityCode]
            const areaCode = Object.keys(areas).find(
              code => areas[code] === address.district
            )
            if (areaCode) {
              regionCodes.push(areaCode)
            }
          }
        }
      }

      this.editingAddress = {
        ...address,
        region: regionCodes
      }
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
      if (value && value.length === 3) {
        const [provinceCode, cityCode, areaCode] = value
        // 立即更新省市区数据
        this.$set(this.editingAddress, 'province', areaData['86'][provinceCode])
        this.$set(this.editingAddress, 'city', areaData[provinceCode][cityCode])
        this.$set(this.editingAddress, 'district', areaData[cityCode][areaCode])
        console.log('Region changed:', {
          province: this.editingAddress.province,
          city: this.editingAddress.city,
          district: this.editingAddress.district
        })
      }
    },
    resetEditingAddress() {
      this.editingAddress = {
        id: null,
        name: '',
        phone: '',
        region: [],
        province: '',
        city: '',
        district: '',
        detail: '',
        isDefault: false
      }
    },
    async handleSaveAddress() {
      try {
        await this.$refs.addressForm.validate()
        
        // 检查区域是否已选择
        if (!this.editingAddress.region || this.editingAddress.region.length !== 3) {
          this.$message.error('请选择完整的省市区')
          return
        }

        // 确保省市区数据已正确设置
        const [provinceCode, cityCode, areaCode] = this.editingAddress.region
        const addressData = {
          id: this.editingAddress.id,
          uid: this.userInfo.uid,
          name: this.editingAddress.name,
          phone: this.editingAddress.phone,
          province: areaData['86'][provinceCode],
          city: areaData[provinceCode][cityCode],
          district: areaData[cityCode][areaCode],
          detail: this.editingAddress.detail,
          isDefault: this.editingAddress.isDefault
        }

        // 打印请求数据
        console.log('Request data:', addressData)

        let response
        if (this.editingAddress.id) {
          response = await this.$api.address.update(addressData)
          console.log('Update response:', response)
        } else {
          response = await this.$api.address.create(addressData)
          console.log('Create response:', response)
        }

        // 检查响应状态
        if (!response || response.code !== 200) {
          throw new Error(response?.message || '服务器响应异常')
        }
        
        this.$message.success('保存成功')
        this.showAddressDialog = false
        this.resetEditingAddress()
        await this.fetchAddresses()
      } catch (error) {
        console.error('Save address error:', error)
        if (error.response) {
          // 服务器响应错误
          console.error('Server error:', error.response)
          this.$message.error(`保存失败：${error.response.data?.message || '服务器错误'}`)
        } else if (error.request) {
          // 请求发送失败
          console.error('Request error:', error.request)
          this.$message.error('保存失败：网络请求失败')
        } else {
          // 其他错误
          console.error('Other error:', error)
          this.$message.error(`保存失败：${error.message || '未知错误'}`)
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

.el-cascader {
  width: 100%;
}
</style> 