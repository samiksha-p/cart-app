<template>
  <div>
    <v-progress-circular class="loading" v-if="!isFetching" :size="100" :width="7" indeterminate></v-progress-circular>
    <v-layout justify-center v-if="isFetching">
      <v-flex>
        <!-- class="pa-5 ma-5"-->
        <v-card elevation="24" max-width="800" class="mx-auto">
          <v-carousel hide-delimiters>
            <v-carousel-item
              v-for="(item,i) in deals"
              :key="i"
              @click="selectedCard(item.categoryId)"
              :src="item.image"
            >
              <!-- <v-layout align-center fill-height justify-center>
                <div class="display-1">{{ item.name }}</div>
              </v-layout> -->
            </v-carousel-item>
          </v-carousel>
        </v-card>
      </v-flex>

      <!--
    <v-flex xs12 md12>
      <v-toolbar color="cyan lighten-4">
        <v-toolbar-title>Categories</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>

      <v-card>
        <v-container  fluid grid-list-md>
          <v-layout row wrap >
            <v-flex  xs6 md4 v-for="card in categories" :key="card">
              <v-card style="cursor: pointer" @click='selectCard(card)'>
              <v-card-title>
                <div class="text-truncate">
                   <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <span v-on="on"><strong>{{categoryList[card].name}}</strong></span>
                      </template>
                      <span>{{categoryList[card].name}}</span>
                   </v-tooltip>
                </div>
                </v-card-title>
                <v-img :src="categoryList[card].image" contain height="200px">
              </v-img>
              </v-card>
            </v-flex>
          </v-layout>
        </v-container>
        <v-btn color="cyan lighten-1" @click='selectCard("All")'>View All</v-btn>
      </v-card>
      </v-flex>-->
    </v-layout>
  </div>
</template>

<script>
export default {
  data() {
    return {
      msg: "Welcome to Your Home app",
      isFetching: false
    };
  },
  created() {
    if (!localStorage.getItem("loggedUser")) {
      console.log("You are unautherized");
      //this.$router.push({ path: "/main" });
    }
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

    this.$store
      .dispatch("setDeals", {
        method: "get",
        url: "http://localhost:8080/src/dataFiles/deals.json"
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
    selectedCard(iData) {
      console.log(iData);
      this.$router.push({ path: "/products/" + iData });
    }
  },
  computed: {
    categories() {
      if (this.$store.getters && this.$store.getters.getProducts) {
        return [
          ...new Set(
            this.$store.getters.getProducts.products.map(
              data => data.categoryId
            )
          )
        ];
      } else return {};
    },
    categoryList() {
      if (this.$store.getters && this.$store.getters.getCategory) {
        return this.$store.getters.getCategory;
      } else return [];
    },
    deals() {
      if (this.$store.getters && this.$store.getters.getDeals) {
        return this.$store.getters.getDeals;
      } else return [];
    }
  }
};
</script>

<style>
.loading {
  margin-left: 50%;
  margin-top: 15%;
  color: cyan;
}
</style>
