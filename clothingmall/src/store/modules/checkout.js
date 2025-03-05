import order from '@/api/order'

const state = {
  checkoutItems: [],
  selectedAddress: null,
  loading: false
}

const mutations = {
  SET_CHECKOUT_ITEMS(state, items) {
    state.checkoutItems = items
  },
  SET_SELECTED_ADDRESS(state, address) {
    state.selectedAddress = address
  },
  SET_LOADING(state, status) {
    state.loading = status
  }
}

const actions = {
  setCheckoutItems({ commit }, items) {
    commit('SET_CHECKOUT_ITEMS', items)
  },
  initCheckout({ state, commit }) {
    if (!state.checkoutItems || state.checkoutItems.length === 0) {
      throw new Error('没有可结算的商品')
    }
  },
  setSelectedAddress({ commit }, address) {
    commit('SET_SELECTED_ADDRESS', address)
  },
  async createOrder({ commit, state, rootState }, { addressId, remark = '' }) {
    commit('SET_LOADING', true)
    try {
      const orderData = {
        uid: rootState.user.userInfo.uid,
        addressId,
        remark,
        items: state.checkoutItems.map(item => ({
          id: item.id,
          tid: item.tid,
          num: item.num,
          price: item.trappings.price,
          name: item.trappings.name,
          image: item.trappings.url,
          type: item.trappings.type
        }))
      }
      
      console.log('Creating order with data:', orderData)
      const response = await order.create(orderData)
      
      if (response.code === 200) {
        return response.data
      } else {
        throw new Error(response.message || '创建订单失败')
      }
    } catch (error) {
      console.error('创建订单失败:', error)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  }
}

const getters = {
  totalAmount: state => {
    return state.checkoutItems.reduce((total, item) => {
      return total + (item.trappings.price * Number(item.num))
    }, 0)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
} 