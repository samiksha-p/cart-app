import login from "../components/loginComponent.vue";
import home from "../components/homeComponent.vue";
import detail from "../components/detailComponent.vue";
import products from "../components/productsComponent.vue";
import cart from "../components/cartComponent.vue";

export default [
  { name: "Login", component: login, path: "/login" },
  { name: "Home", component: home, path: "/home" },
  { name: "", component: home, path: "/" },
  { name: "detail", component: detail, path: "/detail/:id", props: true },
  { name: "cart", component: cart, path: "/cart" },
  { name: "products", component: products, path: "/products/:id" }
];
