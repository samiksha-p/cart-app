<template>
  <div class="headerSpace">
    <v-toolbar tabs height="80" dark fixed flat class="grey darken-4">
      <v-toolbar-side-icon @click="navFlag = !navFlag"></v-toolbar-side-icon>
      <v-toolbar-title>My cart</v-toolbar-title>
      <v-icon @click="toHome">shopping_cart</v-icon>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-layout>
          <v-flex v-if="loggedUser">
            <v-card class="pa-2" flat color="grey darken-4">
              <v-responsive>
                <v-avatar size="60">
                  <img :src="loggedUser.dp">
                </v-avatar>
              </v-responsive>
            </v-card>
          </v-flex>
          <v-flex>
            <v-card flat height="0">
              <v-card-text>
                <h2 v-if="loggedUser">{{loggedUser.name}} {{loggedUser.lastName}}</h2>
                <v-btn v-if="!loggedUser" flat route to="/login">Sign in</v-btn>
                <v-icon v-if="loggedUser" class="pr-2 pl-1 pt-1" @click="logout">logout</v-icon>
                <v-badge class="pr-1 pl-2 mt-1" overlap color="cyan darken-2">
                  <template v-slot:badge>
                    <span>{{cartItems.length}}</span>
                  </template>
                  <v-icon @click="viewCart">shopping_cart</v-icon>
                </v-badge>
              </v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
      </v-toolbar-items>
      <template v-slot:extension>
        <v-tabs v-model="tab" color="grey darken-4" grow>
          <v-tabs-slider color="cyan"></v-tabs-slider>
          <v-tab router :to="'/products/' + item.uniqueId" v-for="item in categoryList" :key="item.uniqueId">{{ item.name }}</v-tab>
        </v-tabs>
      </template>
    </v-toolbar>

    <v-navigation-drawer v-model="navFlag" v-if="categoryList.length > 0" app clipped temporary>
      <v-toolbar color="cyan lighten-4" flat>
        <v-list>
          <v-list-tile>
            <v-list-tile-action>
              <v-icon>category</v-icon>
            </v-list-tile-action>
            <v-list-tile-title class="title">Categories</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-toolbar>
      <v-list>
        <v-list-tile
          v-for="(itm,i) in categories"
          :key="i"
          router
          :to="'/products/' + categoryList[itm].uniqueId"
        >
          <v-list-tile-action>
            <v-icon>{{categoryList[itm].icon}}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{categoryList[itm].name}}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  data() {
    return {
      msg: "Welcome to Your header app",
      loginPath: { path: "/" },
      signInFlag: false,
      isFetching: false,
      tempFlag: false,
      items: [
        { title: "Table view", icon: "dashboard", route: "/table" },
        { title: "Card view", icon: "image", route: "/card" }
      ],
      navFlag: false
    };
  },
  created() {
    this.$store
      .dispatch("setProducts", {
        method: "get",
        url: "http://localhost:8080/src/dataFiles/products.json"
      })
      .then(response => {
        console.log(" ****** data home then", this.isFetching);
      })
      .catch(err => {
        console.log(err);
        throw err;
      });

    this.$store
      .dispatch("setCategory", {
        method: "get",
        url: "http://localhost:8080/src/dataFiles/category.json"
      })
      .then(response => {
        this.isFetching = true;
      })
      .catch(err => {
        console.log(err);
        throw err;
      });
  },
  methods: {
    logout() {
      delete localStorage.loggedUser;
      this.$store.dispatch("setLoggedUser", null);
      this.$router.push(this.loginPath);
      console.log(this.$router);
    },
    viewCart() {
      console.log("in cart");
      this.$router.push({ path: "/cart" });
    },
    toLogin() {
      console.log("in cart");
      this.$router.push({ path: "/login" });
    },
    toHome(){
      this.$router.push({ path: "/home" });
    },
    signIn() {
      var found = this.users.find(element => {
        return (
          element.userId == this.userId && element.password == this.password
        );
      });
      if (found != undefined) {
        localStorage.setItem("loggedUser", JSON.stringify(found));
        this.$store.dispatch("setLoggedUser", found);
        this.$router.push("/home");
        this.signInFlag = !this.signInFlag;
      } else if (this.password == "" || this.userId == "") {
        this.msg = "Please enter valid data";
      } else {
        this.msg = "Sorry!! Try again";
        this.password = "";
        this.userId = "";
      }
    }
  },
  computed: {
    loggedUser() {
      if (this.$store.getters && this.$store.getters.getLoggedUser) {
        return this.$store.getters.getLoggedUser;
      }
    },
    cartItems() {
      if (this.$store.getters && this.$store.getters.getCartItems) {
        console.log(this.$store.getters.getCartItems);
        return this.$store.getters.getCartItems;
      } else return 0;
    },
    categories() {
      if (
        this.$store.getters &&
        this.$store.getters.getProducts &&
        this.$store.getters.getProducts.products
      ) {
        return [
          ...new Set(
            this.$store.getters.getProducts.products.map(
              data => data.categoryId
            )
          ),
          10
        ];
      } else return [];
    },
    categoryList() {
      if (this.$store.getters && this.$store.getters.getCategory) {
        console.log("************", [
          ...this.$store.getters.getCategory,
          { name: "All", uniqueId: "All", icon: "" }
        ]);
        return [
          { name: "All", uniqueId: 10, icon: "" },
          ...this.$store.getters.getCategory
        ];
      } else return [];
    }
  }
};
</script>

<style>
.headerSpace {
  height: 10vh;
}
.newClass {
  padding: 1%;
}
</style>
