export default {
  namespaced: true,
  state: {
    items: [], // 收藏商品列表
    loading: false,
    error: null
  },
  getters: {
    favoriteItems: state => state.items,
    isFavorite: state => productId => state.items.some(item => item.productId === productId),
    isLoading: state => state.loading,
    error: state => state.error
  },
  mutations: {
    SET_FAVORITE_ITEMS(state, items) {
      state.items = items
    },
    ADD_FAVORITE_ITEM(state, item) {
      if (!state.items.some(i => i.productId === item.productId)) {
        state.items.push(item)
      }
    },
    REMOVE_FAVORITE_ITEM(state, productId) {
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
    async fetchFavorites({ commit }) {
      commit('SET_LOADING', true)
      try {
        // TODO: 调用API获取收藏列表
        const response = await this._vm.$api.favorites.getList()
        commit('SET_FAVORITE_ITEMS', response.data)
        commit('SET_ERROR', null)
      } catch (error) {
        commit('SET_ERROR', error.message)
        console.error('获取收藏列表失败:', error)
      } finally {
        commit('SET_LOADING', false)
      }
    },
    async toggleFavorite({ commit, getters }, product) {
      commit('SET_LOADING', true)
      try {
        const isFavorite = getters.isFavorite(product.id)
        if (isFavorite) {
          // 取消收藏
          await this._vm.$api.favorites.remove(product.id)
          commit('REMOVE_FAVORITE_ITEM', product.id)
        } else {
          // 添加收藏
          await this._vm.$api.favorites.add(product.id)
          commit('ADD_FAVORITE_ITEM', {
            productId: product.id,
            name: product.name,
            price: product.price,
            image: product.image
          })
        }
        commit('SET_ERROR', null)
        return !isFavorite
      } catch (error) {
        commit('SET_ERROR', error.message)
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    }
  }
} 