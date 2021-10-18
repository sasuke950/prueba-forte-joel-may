<template>
  <v-app :light="true">
    <router-view></router-view>
    <loading></loading>
  </v-app>
</template>


<script>
import Loading from "./components/Loading.vue";

export default {
  name: "app",
  components: {
    Loading,
  },
  data() {
    return {};
  },
};
</script>

<style>
</style>
