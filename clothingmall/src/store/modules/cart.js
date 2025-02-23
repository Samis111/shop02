import cart from '@/api/cart'

const state = {
  cartItems: [],
  loading: false
}

const mutations = {
  SET_CART_ITEMS(state, items) {
    state.cartItems = items
  },
  SET_LOADING(state, status) {
    state.loading = status
  },
  UPDATE_ITEM_QUANTITY(state, { id, quantity }) {
    const item = state.cartItems.find(item => item.id === id)
    if (item) {
      item.quantity = quantity
    }
  },
  REMOVE_ITEM(state, id) {
    state.cartItems = state.cartItems.filter(item => item.id !== id)
  },
  UPDATE_ITEM_SELECTED(state, { id, selected }) {
    const item = state.cartItems.find(item => item.id === id)
    if (item) {
      item.selected = selected
    }
  },
  CLEAR_CART(state) {
    state.cartItems = []
  }
}

const actions = {
  // 获取购物车列表
  async fetchCartItems({ commit }) {
    commit('SET_LOADING', true)
    try {
      const response = await cart.list()
      if (response.code === 200) {
        commit('SET_CART_ITEMS', response.data)
      } else {
        throw new Error(response.message)
      }
    } catch (error) {
      console.error('获取购物车列表失败:', error)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  // 添加商品到购物车
  async addToCart({ commit, rootState }, data) {
    try {
      // 确保有用户ID
      if (!data.uid) {
        data.uid = rootState.user.userInfo.id
      }
      console.log('Adding to cart:', data)
      const response = await cart.add(data)
      if (response.code === 200) {
        await dispatch('fetchCartItems')
      } else {
        throw new Error(response.message)
      }
    } catch (error) {
      console.error('添加到购物车失败:', error)
      throw error
    }
  },

  // 更新商品数量
  async updateQuantity({ commit }, data) {
    try {
      const response = await cart.update(data)
      if (response.code === 200) {
        commit('UPDATE_ITEM_QUANTITY', data)
      } else {
        throw new Error(response.message)
      }
    } catch (error) {
      console.error('更新商品数量失败:', error)
      throw error
    }
  },

  // 删除商品
  async removeItem({ commit }, id) {
    try {
      const response = await cart.delete(id)
      if (response.code === 200) {
        commit('REMOVE_ITEM', id)
      } else {
        throw new Error(response.message)
      }
    } catch (error) {
      console.error('删除商品失败:', error)
      throw error
    }
  },

  // 选择/取消选择商品
  async toggleSelected({ commit }, { id, selected }) {
    try {
      const response = await cart.select({ ids: [id], selected })
      if (response.code === 200) {
        commit('UPDATE_ITEM_SELECTED', { id, selected })
      } else {
        throw new Error(response.message)
      }
    } catch (error) {
      console.error('更新商品选择状态失败:', error)
      throw error
    }
  },

  // 清空购物车
  async clearCart({ commit }) {
    try {
      const response = await cart.clear()
      if (response.code === 200) {
        commit('CLEAR_CART')
      } else {
        throw new Error(response.message)
      }
    } catch (error) {
      console.error('清空购物车失败:', error)
      throw error
    }
  }
}

const getters = {
  cartCount: state => state.cartItems.length,
  selectedItems: state => state.cartItems.filter(item => item.selected),
  totalPrice: state => {
    return state.cartItems
      .filter(item => item.selected)
      .reduce((total, item) => total + item.price * item.quantity, 0)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
} 