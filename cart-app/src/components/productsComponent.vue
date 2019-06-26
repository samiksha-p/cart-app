<template>
  <div>
    <v-progress-circular class="loading" v-if="!isFetching" :size="100" :width="7" indeterminate></v-progress-circular>
    <v-layout v-if="isFetching" app justify-center>
      <v-flex xs12 sm3 d-flex>
        <v-text-field
          class="ml-3"
          v-model="searchWord"
          append-icon="search"
          label="Search your product"
        ></v-text-field>
      </v-flex>
    </v-layout>
    <v-layout justify-center v-if="isFetching">
      <v-flex xs12 md2>
        <v-toolbar color="grey lighten-2">
          <v-toolbar-title>Filter By</v-toolbar-title>
        </v-toolbar>
        <v-card>
          <v-list>
            <v-list-group
              v-for="item in items"
              :key="item.title"
              v-model="item.active"
              :prepend-icon="item.action"
              no-action
            >
              <template v-slot:activator>
                <v-list-tile>
                  <v-list-tile-content>
                    <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>
              </template>
              <v-container v-if="item.title == 'Price Range'" fluid grid-list-lg>
                <v-layout row wrap>
                  <v-range-slider
                    v-model="priceRange"
                    track-color="amber"
                    thumb-color="cyan lighten-1"
                    :max="1000"
                    :min="10"
                    :step="10"
                  ></v-range-slider>
                  <v-flex shrink style="width: 70px">
                    <v-text-field
                      v-model="priceRange[0]"
                      class="mt-0"
                      hide-details
                      single-line
                      type="number"
                    ></v-text-field>
                  </v-flex>
                  <v-spacer></v-spacer>
                  <v-flex shrink style="width: 70px">
                    <v-text-field
                      v-model="priceRange[1]"
                      class="mt-0"
                      hide-details
                      single-line
                      type="number"
                    ></v-text-field>
                  </v-flex>
                </v-layout>
              </v-container>

              <v-card-title v-if="id=='All' && item.title == 'Category'">
                <span>Category :</span>
                <v-flex class="selectClass">
                  <v-select :items="categoryList" v-model="selectedCategory" item-text="name"></v-select>
                </v-flex>
              </v-card-title>
              <v-list v-if="item.title == 'Brand'">
               <!-- <v-list-tile v-for="itm in brands" :key="itm">
                  <v-list-tile-action>
                    <v-checkbox v-model="itm.selected"></v-checkbox>
                  </v-list-tile-action>
                  <v-list-tile-content>
                    <v-list-tile-title>{{itm.name}}</v-list-tile-title>
                    <v-list-tile-sub-title>Allow notifications</v-list-tile-sub-title>
                  </v-list-tile-content>
                </v-list-tile> -->
              </v-list>
            </v-list-group>
          </v-list>
        </v-card>
      </v-flex>
      <v-flex xs12 md12 offset-xs1>
        <v-card>
          <v-container fluid grid-list-md>
            <v-layout row wrap v-if="products.length > 0">
              <v-flex xs12 md3 sm6 v-for="card in products" :key="card.name">
                <v-card style="cursor: pointer">
                  <v-img :src="card.image" contain class="imageClass" @click="selectCard(card)"></v-img>
                  <v-card-title>
                    <div class="text-truncate">
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                          <span v-on="on">
                            <strong>{{card.name}}</strong>
                          </span>
                        </template>
                        <span>{{card.name}}</span>
                      </v-tooltip>
                    </div>
                  </v-card-title>
                  <div >
                    <span v-if='deal' class='font-weight-bold'>Rs: {{card.cost -(card.cost * deal.discount)/100}}</span>
                    <span class="rateClass = deal">Rs : {{card.cost}} </span>
                    <span v-if='deal' style='color:green'>{{deal.discount}} off</span>
                  </div>
                  
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                      v-if="!checkProductInCart(card.productId)"
                      color="cyan darken-1"
                      @click="addToCart(card)"
                    >Add to Cart</v-btn>
                    <v-btn
                      v-if="checkProductInCart(card.productId)"
                      color="cyan lighten-1"
                      @click="removeFromCart(card)"
                    >Remove from Cart</v-btn>
                  </v-card-actions>
                </v-card>
              </v-flex>
              <v-flex v-if="products.length==0">
                <h2 class="text-xs-center">No data present</h2>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "app",
  data() {
    return {
      msg: "Welcome to Your data card",
      isFetching: false,
      id: this.$route.params.id,
      selectedCategory: "",
      searchWord: "",
      cartAction: "Add to Cart",
      cartFlag: false,
      priceRange: [20, 2000],
      items: [
        {
          action: "attach_money",
          title: "Price Range"
        },
        {
          action: "work",
          title: "Brand",
          active: false
        },
        {
          action: "category",
          title: "Category"
        },
        {
          action: "color_lens",
          title: "Color"
        }
      ]
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
    brandSelected(iData) {},
    selectCard(iData) {
      console.log(iData);
      this.$router.push({ path: "/detail/" + iData.productId });
    },
    checkProductInCart(id) {
      return (
        this.cartItems &&
        Object.keys(this.cartItems).length > 0 &&
        this.cartItems[id]
      );
    },
    addToCart(iData) {
      this.$store.dispatch("addToCart", iData);
    },
    removeFromCart(iData) {
      this.$store.dispatch("removeFromCart", iData);
    }
  },
  computed: {
    products() {
      if (this.$store.getters && this.$store.getters.getProducts.products) {
        return this.$store.getters.getProducts.products.filter(element => {
          console.log("#######****", this.brands);
          console.log(this.brands[element.brand].selected);
          return (
            (this.id == "All" ? true : element.categoryId == this.id) &&
            element.cost >= this.priceRange[0] &&
            element.cost <= this.priceRange[1] &&
            (this.searchWord == ""
              ? true
              : element.name.toLowerCase().includes(this.searchWord) ||
                element.description.toLowerCase().includes(this.searchWord)) &&
            (this.selectedCategory == ""
              ? true
              : element.categoryName == this.selectedCategory) &&
            this.brands[element.brand].selected
          );
        });
      } else return {};
    },
    cartItems() {
      if (this.$store.getters && this.$store.getters.getCartItems) {
        var obj = {};
        this.$store.getters.getCartItems.forEach(element => {
          obj[element.productId] = element;
        });
        return obj;
      } else return [];
    },
    categoryList() {
      if (this.$store.getters && this.$store.getters.getCategory) {
        console.log("******* cat *******", this.$store.getters.getCategory);
        return this.$store.getters.getCategory;
      } else return [];
    },
    brands() {
      if (this.$store.getters && this.$store.getters.getProducts) {
        var obj = {};
        this.$store.getters.getProducts.products.forEach(element => {
          obj[element.brand] = { name: element.brand, selected: true };
        });
        return obj;
      } else return {};
    },
    brandArr() {
      //console.log('%%%%%',this.brands.filter(brand => brand.selected))
      //return this.brands.filter(brand => { brand.selected})
    },
    deal() {
      if (this.$store.getters && this.$store.getters.getDeals) {
        var found = this.$store.getters.getDeals.find(element => {
          console.log('jjjjj ',parseInt(this.id) == 0 && element.categoryId == 0)
          console.log('kkk ',element.categoryId == parseInt(this.id))
          return (
            (parseInt(this.id) == 0 && element.categoryId == 0) ? true : element.categoryId == parseInt(this.id)
          );
        });
        return found;
      } else null;
    }
  }
};
</script>

<style scoped>
.loading {
  margin-left: 50%;
  margin-top: 15%;
  color: cyan;
}
.rateClass {
  margin-left: 5%;
  text-decoration: line-through;
}
.imageClass {
  height: 300px;
}
.flexClass {
  margin-left: 1%;
  margin-right: 5%;
}

.selectClass {
  width: 90%;
  margin-left: 5%;
}
</style>
