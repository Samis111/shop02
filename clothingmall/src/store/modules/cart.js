import cartApi from '@/api/cart'

export default {
  namespaced: true,
  state: {
    cartItems: [], // 购物车商品列表
    loading: false,
    error: null
  },
  getters: {
    totalCount: state => state.cartItems.reduce((sum, item) => sum + item.quantity, 0),
    totalAmount: state => state.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    cartItems: state => state.cartItems,
    isLoading: state => state.loading,
    error: state => state.error
  },
  mutations: {
    SET_CART_ITEMS(state, items) {
      state.cartItems = items
    },
    ADD_CART_ITEM(state, item) {
      state.cartItems.push(item)
    },
    UPDATE_CART_ITEM(state, { id, quantity }) {
      const item = state.cartItems.find(i => i.id === id)
      if (item) {
        item.quantity = quantity
      }
    },
    REMOVE_CART_ITEM(state, id) {
      state.cartItems = state.cartItems.filter(item => item.id !== id)
    },
    SET_LOADING(state, loading) {
      state.loading = loading
    },
    SET_ERROR(state, error) {
      state.error = error
    }
  },
  actions: {
    async fetchCartItems({ commit }) {
      try {
        const response = await cartApi.list()
        commit('SET_CART_ITEMS', response.data)
      } catch (error) {
        console.error('获取购物车失败:', error)
        throw error
      }
    },
    async addToCart({ commit }, { product, quantity = 1 }) {
      try {
        const response = await cartApi.add({
          productId: product.id,
          quantity
        })
        commit('ADD_CART_ITEM', response.data)
      } catch (error) {
        console.error('添加到购物车失败:', error)
        throw error
      }
    },
    async updateCartItem({ commit }, { id, quantity }) {
      try {
        await cartApi.update(id, quantity)
        commit('UPDATE_CART_ITEM', { id, quantity })
      } catch (error) {
        console.error('更新购物车失败:', error)
        throw error
      }
    },
    async removeFromCart({ commit }, id) {
      try {
        await cartApi.remove(id)
        commit('REMOVE_CART_ITEM', id)
      } catch (error) {
        console.error('删除购物车商品失败:', error)
        throw error
      }
    }
  }
} 