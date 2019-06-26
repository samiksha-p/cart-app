<template>
  <div>
    <!-- 
    <v-toolbar v-if="!signInFlag" flat class="cyan lighten-2">
      <v-toolbar-title>Cart App</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn flat @click="signInFlag =!signInFlag">Sign in</v-btn>
        <v-btn flat @click="signUp();signUpFlag =!signUpFlag">Sign up</v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-flex  class="pa-5 ma-5">
      <v-card elevation="24" max-width="800" class='mx-auto' v-if="!signInFlag">
        <v-carousel>
          <v-carousel-item v-for="(item,i) in products" :key="i" @click='selectedCard(item)' :src="item.image">
            <v-layout align-center fill-height justify-center>
              <div class="display-1">{{ item.name }}</div>
            </v-layout>
          </v-carousel-item>
        </v-carousel>
      </v-card>
    </v-flex>
    
-->
    <!--<v-img v-if="!signInFlag" height="850" src="https://cdn.vuetifyjs.com/images/cards/docks.jpg"></v-img> -->
    <v-content v-if="!loggedUser">
      <v-container>
        <v-layout align-center justify-center>
          <v-flex class="elevation-12" xs12 sm8 md4>
            <v-card class="elevation-12">
              <v-toolbar dark color="cyan lighten-2">
                <v-toolbar-title>Login</v-toolbar-title>
                <v-spacer></v-spacer>
              </v-toolbar>
              <v-card-text>
                <v-form>
                  <v-text-field
                    prepend-icon="person"
                    name="login"
                    label="Login"
                    v-model="userId"
                    type="text"
                  ></v-text-field>
                  <v-text-field
                    prepend-icon="lock"
                    label="Password"
                    :append-icon="show? 'visibility' : 'visibility_off'"
                    @click:append="show =!show"
                    v-model="password"
                    :type="show ? 'text' : 'password'"
                  ></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-text>
                <h3>{{msg}}</h3>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="cyan lighten-1" @click="signIn()">Sign in</v-btn>
                <v-spacer></v-spacer>
                <v-icon
                  color="cyan lighten-1"
                  router
                  :to="loginPath"
                  @click="signInFlag =!signInFlag"
                >logout</v-icon>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </div>
</template>

<script>
export default {
  data() {
    return {
      msg: "",
      signInFlag: false,
      signUpFlag: false,
      userId: "",
      password: "",
      typedText: "",
      show: false,
      loginPath: { path: "/login" }
    };
  },
  created() {
    if (localStorage.getItem("loggedUser") && this.loggedUser) {
      console.log(this.$store);
      if (this.$route.fullPath == "/login" || this.$route.fullPath == "/")
        this.$router.push("/login");
      else this.$router.push(this.$route.fullPath);
    } else {
      console.log(this.signInFlag);
      this.$router.push("/login");
    }
    this.$store
      .dispatch("setProducts", {
        method: "get",
        url: "http://localhost:8080/src/dataFiles/products.json"
      })
      .then(response => {
        console.log(" ****** data home then", this.isFetching);
        this.isFetching = true;
      })
      .catch(err => {
        console.log(err);
        throw err;
      });
  },
  methods: {
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
    },
    selectedCard(iData){
       console.log(iData);
       this.$router.push({path :'/detail/'+iData.productId})
    },
    signUp() {
      alert("in signUp");
    }
  },
  computed: {
    loggedUser() {
      return this.$store.getters.getLoggedUser;
    },
    users() {
      return this.$store.getters.getUsers;
    },
    products() {
      if (this.$store.getters && this.$store.getters.getProducts.products) {
        return this.$store.getters.getProducts.products;
      } else return {};
    }
  }
};
</script>

<style>

.maskClass{
  display: block
}
</style>
