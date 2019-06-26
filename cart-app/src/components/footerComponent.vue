<template>
<div class='space'>
  <v-footer height="auto">
      <v-layout justify-center row wrap>
        <v-flex grey darken-4 py-3 text-xs-center white--text xs12 >
          &copy;2019 — <strong>{{msg}}</strong>
        </v-flex>
      </v-layout>
    </v-footer>
</div>
  
</template>

<script>

export default {
  name: 'app',
  data () {
    return {
      msg: 'MyApp'
    }
  }
}
</script>

<style>
.v-footer {
       position: fixed;
       bottom: 0px;
       left: 0px;
       width: 100%;
       }
</style>
