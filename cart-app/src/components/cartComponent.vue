<template>
  <div class="headerSpace">
    <v-layout justify-end>
      <v-flex xs12>
        <v-toolbar color="grey lighten-2">
          <v-toolbar-title>My bag</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>

        <v-card>
          <v-container fluid grid-list-md>
            <v-layout row wrap>
              <v-flex xs12 md12 v-for="card in cartItems" :key="card.name">
                <v-card style="cursor:pointer">
                  <v-layout align-end>
                    <v-flex xs3>
                      <v-img :src="card.image" contain height="200px"></v-img>
                    </v-flex>
                    <v-flex xs9>
                      <v-card-title>
                        <div class="text-truncate">
                          <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                              <h2 v-on="on">{{card.name}}</h2>
                            </template>
                            <span>{{card.name}}</span>
                          </v-tooltip>
                        </div>
                        <v-spacer></v-spacer>
                        <v-icon @click="card.count=1;decreaseCart(card)">delete</v-icon>
                      </v-card-title>

                      <v-card-title>
                        <div>
                          <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                              <span v-on="on">Manufacturer : {{card.brand}}</span>
                            </template>
                            <span>{{card.brand}}</span>
                          </v-tooltip>
                        </div>
                      </v-card-title>

                      <v-card-title>
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on }">
                            <span v-on="on">{{card.description}}</span>
                          </template>
                          <span>{{card.description}}</span>
                        </v-tooltip>
                      </v-card-title>

                        <div >
                              <span v-if='deal' class='font-weight-bold'>Rs: {{(card.cost *  card.count) -( ( deal[card.categoryId] ? ((card.cost * card.count) * deal[card.categoryId].discount)/100 : 0))}}</span>
                              <span v-if='deal && deal[card.categoryId]' class='rateClass'>Rs : {{card.cost * card.count}}</span>
                              <span v-if='deal && deal[card.categoryId]' style='color:green'>{{deal[card.categoryId].discount}} off</span>
                        </div>
                    </v-flex>
                  </v-layout>
                  <v-card-actions>
                    <v-avatar class="avatarClassLeft" color="white">
                      <v-icon
                        :disabled="card.count == 1"
                        large
                        @click="decreaseCart(card)"
                        color="cyan darken-1"
                      >remove_circle</v-icon>
                    </v-avatar>
                    <span class="boxClass">{{card.count}}</span>

                    <v-avatar color="white">
                      <v-icon
                        :disabled="card.count ==10"
                        large
                        @click="increaseCart(card)"
                        color="cyan darken-1"
                      >add_circle</v-icon>
                    </v-avatar>
                  </v-card-actions>
                </v-card>
              </v-flex>
              <v-btn v-if="cartItems.length>0" color="cyan darken-2" @click="placeOrder">Place Order</v-btn>
              <h3 v-if="cartItems.length ==0">Your cart is empty. Please add products</h3>
              <v-btn route :to="home" color="cyan darken-2">Check products</v-btn>
            </v-layout>
          </v-container>
        </v-card>
      </v-flex>

      <v-flex xs12 sm5 md5 offset-xs1>
        <v-toolbar color="grey lighten-3">
          <v-toolbar-title class="font-weight-bold">Price details</v-toolbar-title>
        </v-toolbar>
        <v-card>
          <v-card-title>
            <div class="font-weight-bold">
              <span>Price :</span>
            </div>
            <v-spacer></v-spacer>
            <span>{{payableAmt}}</span>
          </v-card-title>
          <v-card-title>
            <div class="font-weight-bold">
              <span>Delivery :</span>
            </div>
            <v-spacer></v-spacer>
            <span>{{payableAmt >= 1000 ?  'Free' : ( payableAmt == 0 ? 0 : 200)}}</span>
          </v-card-title>
          <v-card-title>
            <div class="font-weight-bold">
              <span>Amount Payable :</span>
            </div>
            <v-spacer></v-spacer>
            <span>{{payableAmt >= 1000 ? payableAmt : ( payableAmt == 0 ? 0 : payableAmt+200) }}</span>
          </v-card-title>
        </v-card>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
export default {
  name: "app",
  data() {
    return {
      isFetching: false,
      home: "/home",
    };
  },
  methods: {
    increaseCart(iData) {
      this.$store.dispatch("addToCart", iData);
    },
    decreaseCart(iData) {
      this.$store.dispatch("removeFromCart", iData);
    },
    placeOrder() {
      if (localStorage.getItem("loggedUser")) {
        this.$store.dispatch("emptyCart");
        alert("Order placed successfully..!");
      } else {
        alert('Kindly login first..!!')
        console.log(this.signInFlag);
        this.$router.push("/login");
      }
      
    }
  },
  computed: {
    cartItems() {
      if (this.$store.getters && this.$store.getters.getCartItems) {
        return this.$store.getters.getCartItems;
      } else return 0;
    },
    payableAmt() {
      var amt = 0;
      if (this.$store.getters && this.$store.getters.getCartItems) {
        this.$store.getters.getCartItems.forEach(element => {
          amt += (element.cost * element.count) - (this.deal[element.categoryId] ? ((element.cost * element.count) * ( this.deal[element.categoryId].discount)/100) : 0);
        });
      }
      return amt;
    },
    deal() {
      if (this.$store.getters && this.$store.getters.getDeals) {
         var obj = {};
         this.$store.getters.getDeals.forEach(element => {
          obj[element.categoryId] = element;
        });
        return obj;
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
.avatarClassLeft {
  margin-left: 5%;
}

.boxClass {
  padding-left: 15px;
  padding-top: 2px;
  width: 40px;
  height: 28px;
  border: 1px solid #c2c2c2;
  margin: 0 9px;
}
.rateClass {
  margin-left: 5%;
  text-decoration: line-through;
}

.headerSpace {
  margin-top: 5%
}
</style>
