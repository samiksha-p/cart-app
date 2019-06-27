<template>
  <div  class="headerSpace">
    <v-progress-circular class="loading" v-if="!isFetching" :size="100" :width="7" indeterminate></v-progress-circular>
    <v-layout pt-3 v-if="isFetching" app justify-center>
      <v-flex  xs12 sm3 d-flex>
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

              <v-card-title v-if="item.title == 'Category'">
                <v-flex >
                  <v-select @click="update" v-model="selectedCategory" :items="categoryList" item-value="name" item-text="name">
                      <template slot="item" slot-scope="data" >
                      <v-list-tile-content>
                          <v-list-tile-title @click="update(data.item.uniqueId)" v-html="data.item.name"></v-list-tile-title>
                      </v-list-tile-content>
                      </template>
                  </v-select>
                </v-flex>
              </v-card-title>
              <v-list v-if="item.title == 'Brand'">
              </v-list>
              <v-card-title v-if="item.title == 'Color'">
                <v-flex >
                  <v-select  v-model="selectedColor" :items="colors">
                  </v-select>
                </v-flex>
              </v-card-title>
              <v-card-title v-if="item.title == 'Brand'">
                <v-flex >
                  <v-select v-model="selectedBrand" :items="brandArr">
                  </v-select>
                </v-flex>
              </v-card-title>
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
                    <span v-if='deals.length>0 && deals[card.categoryId]' class='ml-3 font-weight-bold'>Rs: {{card.cost -(card.cost * deals[card.categoryId].discount)/100}}</span>
                    <span :class="{rateClass : deals[card.categoryId] , 'font-weight-bold' : !deals[card.categoryId], 'ml-2': true}">Rs : {{card.cost}}</span>
                    <span v-if='deals.length>0 && deals[card.categoryId]' style='color:green;margin:5%'>{{deals[card.categoryId].discount}} off</span>
                  </div>
                  
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                      v-if="!checkProductInCart(card.productId)"
                      color="cyan lighten-1"
                      @click="addToCart(card)"
                    >Add to Cart </v-btn>
                    <v-btn
                      v-if="checkProductInCart(card.productId)"
                      color="cyan lighten-1"
                      @click="removeFromCart(card)"
                    >Remove from Cart</v-btn>
                  </v-card-actions>
                </v-card>
              </v-flex>
            </v-layout>
              <v-flex v-if="products.length==0">
                <h2 class="text-xs-center">No data present</h2>
              </v-flex>
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
      selectedCategory : '',
      selectedCat : '',
      selectedColor: 'All',
      searchWord: "",
      selectedBrand : 'All',
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
        this.selectedCategory = this.id == 10? 'All' : response.data.categories[this.id].name;
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
    },
    update(iData){
      console.log('in update',iData,event)
       this.$router.push({ path: "/products/" + iData });
      //this.selectedCategory = iData;
    }
  },
  computed: {
    products() {
      
      if (this.$store.getters && this.$store.getters.getProducts.products) {
        return this.$store.getters.getProducts.products.filter(element => {
          console.log("#######****", this.brands);
          console.log(this.brands[element.brand].selected);
          return (
            (this.id == 10 ? true : element.categoryId == this.id) &&
            (this.selectedColor == 'All' ? true : element.color == this.selectedColor) &&
            (this.selectedBrand == 'All' ? true : element.brand == this.selectedBrand) &&
            element.cost >= this.priceRange[0] &&
            element.cost <= this.priceRange[1] &&
            (this.searchWord == ""
              ? true
              : element.name.toLowerCase().includes(this.searchWord) ||
                element.description.toLowerCase().includes(this.searchWord)) &&
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
        return [{ name : 'All' , uniqueId : 10 , icon : ""},...this.$store.getters.getCategory];
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
      if (this.$store.getters && this.$store.getters.getProducts) {
                return ['All',
                  ...new Set(
                    this.$store.getters.getProducts.products.map(
                      data => data.brand
                    )
                  )
                ];
              } else return [];
    },
    deal() {
      if (this.$store.getters && this.$store.getters.getDeals) {
        var found = this.$store.getters.getDeals.find(element => {
          return (
            (parseInt(this.id) == 0 && element.categoryId == 0) ? true : element.categoryId == parseInt(this.id)
          );
        });
        return found;
      } else null;
    },
    deals() {
      if (this.$store.getters && this.$store.getters.getDeals) {
        return this.$store.getters.getDeals;
      } else return [];
    },
    colors(){
        if (this.$store.getters && this.$store.getters.getProducts) {
                return ['All',
                  ...new Set(
                    this.$store.getters.getProducts.products.map(
                      data => data.color
                    )
                  )
                ];
              } else return [];
    }
  },
  watch:{
    '$route.params.id'(newId, oldId) {
        this.id = newId;
        //if(this.categoryList && this.categoryList.length> 0)
          //this.selectedCategory= this.categoryList[newId].name;
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
.headerSpace {
  height: 15%;
}
</style>
