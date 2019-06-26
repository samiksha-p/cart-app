<template>
  <div class='space'>
    <v-toolbar height=80 dark fixed flat class="grey darken-4">
    <!--  <v-toolbar-side-icon @click="navFlag = !navFlag"></v-toolbar-side-icon> -->
      <v-toolbar-title > My cart </v-toolbar-title>
      <v-icon>shopping_cart</v-icon>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-layout >
          <v-flex v-if='loggedUser'>
            <v-card class='pa-2' flat color="grey darken-4">
              <v-responsive>
                <v-avatar size="60">
                  <img :src="loggedUser.dp">
                </v-avatar>
              </v-responsive>
            </v-card>
          </v-flex>
          <v-flex >
            <v-card flat height='0'>
            <v-card-text >
                <h2 v-if='loggedUser'>{{loggedUser.name}} {{loggedUser.lastName}}</h2>
              <v-btn v-if='!loggedUser' flat  @click="toLogin">Sign in</v-btn> 
                <v-icon v-if='loggedUser' class='pr-2 pl-1 pt-1' @click="logout">logout</v-icon>
                <v-badge class='pr-1 pl-2' overlap color="cyan darken-2">
                  <template v-slot:badge>
                    <span>{{cartItems.length}}</span>
                  </template>
                  <v-icon  @click="viewCart">shopping_cart</v-icon>
                </v-badge>
              
            </v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
      </v-toolbar-items>
    </v-toolbar>
<!--
    <v-navigation-drawer v-model="navFlag" app clipped temporary>
      <v-list class="pa-1">
        <v-list-tile avatar>
          <v-list-tile-avatar>
            <img :src="loggedUser.dp">
          </v-list-tile-avatar>

          <v-list-tile-content>
            <v-list-tile-title>{{loggedUser.name}} {{loggedUser.lastName}}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>

      <v-list>
        <v-list-tile v-for="(itm,i) in items" :key="i" router :to="itm.route">
          <v-list-tile-action>
            <v-icon>{{itm.icon}}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{itm.title}}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer> -->
  </div>
</template>

<script>
import {mapState} from 'vuex'

export default {
  data() {
    return {
      msg: "Welcome to Your header app",
      loginPath: { path: "/" },
       signInFlag: false,
      tempFlag: false,
      items: [
        { title: "Table view", icon: "dashboard", route: "/table" },
        { title: "Card view", icon: "image", route: "/card" },
      ],
      navFlag: false
    };
  },
  methods: {
    logout() {
      delete localStorage.loggedUser;
      this.$store.dispatch("setLoggedUser", null);
      this.$router.push(this.loginPath);
      console.log(this.$router);
    },
    viewCart(){
      console.log('in cart')
      this.$router.push({ path: "/cart" });
    },
    toLogin(){
      console.log('in cart')
      this.$router.push({ path: "/login" });
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
  computed:{
    loggedUser() {
      if(this.$store.getters && this.$store.getters.getLoggedUser){
        return this.$store.getters.getLoggedUser
        }
      },
    cartItems() {
      if(this.$store.getters && this.$store.getters.getCartItems){
        console.log(this.$store.getters.getCartItems)
        return this.$store.getters.getCartItems
        }else
        return 0
    },
  } 
    
};
</script>

<style>
.space{
  height : 10vh;
}
.newClass{
  padding: 1%
}
</style>
