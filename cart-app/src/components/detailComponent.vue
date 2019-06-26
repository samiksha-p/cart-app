<template>
  <v-layout>
    <v-progress-circular class="loading" v-if="!isFetching" :size="100" :width="7" indeterminate></v-progress-circular>
    <v-flex v-if="isFetching" xs12 sm12 md6 offset-sm3>
      <v-card>
        <v-img :src="products.image" contain height="500"></v-img>
        <v-card-title primary-title>
          <div>
            <h3 class="headline">{{ products.name }}</h3>
          </div>
        </v-card-title>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  name: "app",
  data() {
    return {
      id: this.$route.params.id,
      isFetching: false
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
        this.isFetching = true;
      })
      .catch(err => {
        console.log(err);
        throw err;
      });
  },
  computed: {
    products() {
      if (this.$store.getters && this.$store.getters.getProducts.products) {
        return this.$store.getters.getProducts.products.find(element => {
          return element.productId == this.id;
        });
      } else return {};
    },
  }
};
</script>

<style scoped>

.loading {
  margin-left: 50%;
  margin-top: 15%;
  color: cyan;
}
</style>
