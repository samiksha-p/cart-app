import services from "../../services/axiosService";

export const productModule = {
  state: {
    products: [],
    cartItems: [],
    categoryList: [],
    deals:[]
  },
  mutations: {
    setProducts: (state, param) => {
      state.products = param;
    },
    setCategory: (state, param) => {
      state.categoryList = param;
    },
    setDeals: (state, param) => {
      state.deals = param;
    },
    addToCart: (state, param) => {
      var found = state.cartItems.findIndex(element => {
        return element.productId == param.productId;
      });
      if (found < 0) {
        param.count = 1;
        state.cartItems.push(param);
      } else {
        state.cartItems[found].count++;
      }
    },
    removeFromCart: (state, param) => {
      var found = state.cartItems.findIndex(element => {
        return element.productId == param.productId;
      });
      if (state.cartItems[found].count == 1) {
        state.cartItems.splice(found, 1);
      } else {
        state.cartItems[found].count--;
      }
      return state.cartItems;
    },
    emptyCart: state => {
      state.cartItems = [];
    }
  },
  getters: {
    getProducts: state => {
      return state.products;
    },
    getCartItems: state => {
      return state.cartItems;
    },
    getCategory: state => {
      return state.categoryList;
    },
    getDeals: state => {
      return state.deals;
    }
  },
  actions: {
    setProducts: ({ commit }, param) => {
      return new Promise((resolve, reject) => {
        new services().fetchData({ method: param.method, url: param.url }).then(
          function(result) {
            console.log("****** productsModule then ****", result);
            commit("setProducts", result.data);
            setTimeout(function() {
              resolve(result);
            }, 1000);
          },
          function(errorMessage) {
            console.log(errorMessage);
          }
        );
      });
    },
    setCategory: ({ commit }, param) => {
      return new Promise((resolve, reject) => {
        new services().fetchData({ method: param.method, url: param.url }).then(
          function(result) {
            console.log("****** productsModule category then ****", result);
            commit("setCategory", result.data.categories);
            setTimeout(function() {
              resolve(result);
            }, 1000);
          },
          function(errorMessage) {
            console.log(errorMessage);
          }
        );
      });
    },
    setDeals:({ commit }, param) => {
      return new Promise((resolve, reject) => {
        new services().fetchData({ method: param.method, url: param.url }).then(
          function(result) {
            console.log("****** productsModule category then ****", result);
            commit("setDeals", result.data.deals);
            setTimeout(function() {
              resolve(result);
            }, 1000);
          },
          function(errorMessage) {
            console.log(errorMessage);
          }
        );
      });
    },
    addToCart: ({ commit }, param) => {
      commit("addToCart", param);
    },
    removeFromCart: ({ commit }, param) => {
      commit("removeFromCart", param);
    },
    emptyCart: ({ commit }) => {
      commit("emptyCart");
    }
  }
};
