import Vuex from "vuex";
import Vue from "vue";
import { userModule } from "./modules/userModule";
import { productModule } from "./modules/productModule";

Vue.use(Vuex);

export const store = new Vuex.Store({
  modules: {
    users: userModule,
    products: productModule
  }
});
