<template>
  <v-app>
    <header-app></header-app>
    <v-content>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-content>
    <footer-comp></footer-comp>
  </v-app>
</template>

<script>
import header from "../src/components/headerComponent.vue";
import footer from "../src/components/footerComponent.vue";

export default {
  components: { "header-app": header, "footer-comp": footer },
  created() {
    this.$store.dispatch("setUsers", {
      method: "get",
      url: "http://localhost:8080/src/dataFiles/users.json"
    });
    if (localStorage.getItem("loggedUser")) {
      this.$store.dispatch(
        "setLoggedUser",
        JSON.parse(localStorage.getItem("loggedUser"))
      );
      this.$router.push(this.$route.fullPath);
      this.signInFlag = true;
    } else {
      //this.$router.push("home");
            this.$router.push(this.$route.fullPath);
    }
  },
  computed: {
    loggedUser(){ 
      return this.$store.getters.getLoggedUser;
    }
  }
};
</script>

<style>
</style>
