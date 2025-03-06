<template>
  <div class="address-management">
    <div class="section-header">
      <h3>收货地址</h3>
      <button class="add-address-btn" @click="showAddressForm()">
        <i class="iconfont icon-plus"></i>
        添加新地址
      </button>
    </div>

    <!-- 地址列表 -->
    <div class="address-list">
      <div v-for="address in addresses" :key="address.id" class="address-item"
        :class="{ active: selectedId === address.id }">
        <div class="address-content" @click="selectAddress(address.id)">
          <div class="address-header">
            <span class="name">{{ address.name }}</span>
            <span class="phone">{{ address.phone }}</span>
            <span v-if="address.isDefault" class="default-tag">默认</span>
          </div>

          <div class="address-detail">
            <span class="region">
              {{ address.province }} {{ address.city }} {{ address.district }}
            </span>
            <span class="street">{{ address.street }}</span>
          </div>
        </div>

        <div class="address-actions">
          <button class="action-btn" @click="showAddressForm(address)">编辑</button>
          <button v-if="!address.isDefault" class="action-btn" @click="setDefault(address.id)">设为默认</button>
          <button v-if="!address.isDefault" class="action-btn delete" @click="deleteAddress(address.id)">删除</button>
        </div>
      </div>
    </div>

    <!-- 地址表单弹窗 -->
    <el-dialog :title="editingAddress ? '编辑地址' : '新增地址'" :visible.sync="showDialog" width="500px">
      <el-form ref="addressForm" :model="addressForm" :rules="rules" label-width="80px">
        <el-form-item label="收货人" prop="name">
          <el-input v-model="addressForm.name" />
        </el-form-item>

        <el-form-item label="手机号码" prop="phone">
          <el-input v-model="addressForm.phone" />
        </el-form-item>

        <el-form-item label="所在地区" prop="region">
          <el-cascader v-model="addressForm.region" :options="regionOptions" placeholder="请选择省/市/区" />
        </el-form-item>

        <el-form-item label="详细地址" prop="street">
          <el-input v-model="addressForm.street" type="textarea" :rows="2" />
        </el-form-item>

        <el-form-item>
          <el-checkbox v-model="addressForm.isDefault">
            设为默认收货地址
          </el-checkbox>
        </el-form-item>
      </el-form>

      <div slot="footer">
        <el-button @click="showDialog = false">取消</el-button>
        <el-button type="primary" @click="saveAddress">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'

import regions from '@/utils/regions'
import address from '@/api/address'

export default {
  name: 'AddressManagement',
  props: {
    value: {
      type: [String, Number],
      default: ''
    }
  },
  data() {
    return {
      addresses: [],
      showDialog: false,
      editingAddress: null,
      addressForm: {
        name: '',
        phone: '',
        region: [],
        street: '',
        isDefault: false
      },
      regions: regions,
      rules: {
        name: [
          { required: true, message: '请输入收货人姓名', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
        ],
        region: [
          { required: true, message: '请选择所在地区', trigger: 'change' }
        ],
        street: [
          { required: true, message: '请输入详细地址', trigger: 'blur' },
          { min: 5, max: 100, message: '长度在 5 到 100 个字符', trigger: 'blur' }
        ]
      },
      regionOptions: [] // 省市区数据
    }
  },
  computed: {
    selectedId: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('input', value)
      }
    },
    ...mapState('user', ['userInfo'])

  },
  created() {
    this.fetchAddresses()
    this.fetchRegionData()

  },
  methods: {
    async fetchAddresses() {
      
    // console.log(this.userInfo)

      // try {


        // TODO: 调用API获取地址列表
        const response = await address.list(this.userInfo.uid)

        console.log(response)

        this.addresses = response.data

        // 如果没有选中地址，默认选中默认地址
        // if (!this.selectedId && this.addresses.length) {
        //   const defaultAddress = this.addresses.find(addr => addr.isDefault)
        //   this.selectedId = defaultAddress?.id || this.addresses[0].id
        // }
      // } catch (error) {
      //   this.$message.error('获取地址列表失败')
      // }
    },
    async fetchRegionData() {
      try {
        // TODO: 调用API获取省市区数据
        const response = await this.$api.region.getList()
        this.regionOptions = response.data
      } catch (error) {
        this.$message.error('获取地区数据失败')
      }
    },
    showAddressForm(address = null) {
      this.editingAddress = address
      if (address) {
        // 编辑模式：填充表单数据
        const { province, city, district, ...rest } = address
        this.addressForm = {
          ...rest,
          region: [province, city, district]
        }
      } else {
        // 新增模式：重置表单
        this.addressForm = {
          name: '',
          phone: '',
          region: [],
          street: '',
          isDefault: false
        }
      }
      this.showDialog = true
    },
    async saveAddress() {
      try {
        await this.$refs.addressForm.validate()

        const [province, city, district] = this.addressForm.region
        const addressData = {
          ...this.addressForm,
          province,
          city,
          district
        }
        delete addressData.region

        if (this.editingAddress) {
          // 编辑地址
          await this.$api.address.update({
            id: this.editingAddress.id,
            ...addressData
          })
          this.$message.success('地址修改成功')
        } else {
          // 新增地址
          await this.$api.address.create(addressData)
          this.$message.success('地址添加成功')
        }

        this.showDialog = false
        this.fetchAddresses()
      } catch (error) {
        if (error.name === 'ValidationError') return
        this.$message.error('保存失败')
      }
    },
    selectAddress(id) {
      this.selectedId = id
    },
    async setDefault(id) {
      try {
        await this.$api.address.setDefault(id)
        this.$message.success('默认地址设置成功')
        this.fetchAddresses()
      } catch (error) {
        this.$message.error('设置失败')
      }
    },
    async deleteAddress(id) {
      try {
        await this.$confirm('确定要删除该地址吗？', '提示', {
          type: 'warning'
        })

        await this.$api.address.delete(id)
        this.$message.success('地址已删除')

        if (this.selectedId === id) {
          this.selectedId = ''
        }
        this.fetchAddresses()
      } catch (error) {
        if (error === 'cancel') return
        this.$message.error('删除失败')
      }
    }
  }
}
</script>

<style scoped>
.address-management {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h3 {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.add-address-btn {
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

.add-address-btn:hover {
  border-color: #333;
  color: #000;
}

.address-list {
  display: grid;
  gap: 15px;
}

.address-item {
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 15px;
  cursor: pointer;
  transition: all 0.3s;
}

.address-item:hover {
  border-color: #999;
}

.address-item.active {
  border-color: #ff4d4f;
}

.address-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 10px;
}

.name {
  font-weight: 500;
  color: #333;
}

.phone {
  color: #666;
}

.default-tag {
  padding: 2px 8px;
  background: #ff4d4f;
  color: #fff;
  border-radius: 2px;
  font-size: 12px;
}

.address-detail {
  color: #666;
  line-height: 1.5;
}

.address-actions {
  margin-top: 15px;
  display: flex;
  gap: 10px;
}

.action-btn {
  padding: 4px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #fff;
  color: #666;
  cursor: pointer;
  transition: all 0.3s;
}

.action-btn:hover {
  border-color: #999;
  color: #333;
}

.action-btn.delete:hover {
  border-color: #ff4d4f;
  color: #ff4d4f;
}

@media (max-width: 768px) {
  .address-management {
    padding: 15px;
  }

  .address-header {
    flex-wrap: wrap;
  }
}
</style>