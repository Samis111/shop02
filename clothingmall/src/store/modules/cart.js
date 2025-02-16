export default {
  namespaced: true,
  state: {
    items: [], // 购物车商品列表
    loading: false,
    error: null
  },
  getters: {
    totalCount: state => state.items.reduce((sum, item) => sum + item.quantity, 0),
    totalAmount: state => state.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    cartItems: state => state.items,
    isLoading: state => state.loading,
    error: state => state.error
  },
  mutations: {
    SET_CART_ITEMS(state, items) {
      state.items = items
    },
    ADD_CART_ITEM(state, item) {
      const existingItem = state.items.find(i => i.productId === item.productId)
      if (existingItem) {
        existingItem.quantity += item.quantity
      } else {
        state.items.push(item)
      }
    },
    UPDATE_CART_ITEM(state, { productId, quantity }) {
      const item = state.items.find(i => i.productId === productId)
      if (item) {
        item.quantity = quantity
      }
    },
    REMOVE_CART_ITEM(state, productId) {
      state.items = state.items.filter(item => item.productId !== productId)
    },
    SET_LOADING(state, loading) {
      state.loading = loading
    },
    SET_ERROR(state, error) {
      state.error = error
    }
  },
  actions: {
    async fetchCart({ commit }) {
      commit('SET_LOADING', true)
      try {
        // TODO: 调用API获取购物车数据
        const response = await this._vm.$api.cart.getList()
        commit('SET_CART_ITEMS', response.data)
        commit('SET_ERROR', null)
      } catch (error) {
        commit('SET_ERROR', error.message)
        console.error('获取购物车失败:', error)
      } finally {
        commit('SET_LOADING', false)
      }
    },
    async addToCart({ commit }, { product, quantity = 1 }) {
      commit('SET_LOADING', true)
      try {
        // TODO: 调用API添加商品到购物车
        await this._vm.$api.cart.add({
          productId: product.id,
          quantity
        })
        commit('ADD_CART_ITEM', {
          productId: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity
        })
        commit('SET_ERROR', null)
      } catch (error) {
        commit('SET_ERROR', error.message)
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    }
  }
} 