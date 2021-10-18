<template>
  <section v-if="loading" class="loading loading-show">
    <div class="text-center">
      <v-progress-circular
        :size="80"
        :width="10"
        color="primary"
        indeterminate
        class="vertical-center"
      ></v-progress-circular>
    </div>
  </section>
</template>

<script>
import { EventBus } from "./../main";

export default {
  methods: {},
  data() {
    return {
      loading: false,
    };
  },
  mounted() {
    EventBus.$on("loadingShow", () => {
      this.loading = true;
    });

    EventBus.$on("loadingClose", () => {
      this.loading = false;
    });
  },
};
</script>

<style scoped>
.loading {
  background-color: rgba(0, 0, 0, 0.7);
  bottom: 0;
  left: 0;
  opacity: 0;
  position: fixed;
  right: 0;
  top: 0;
  transition: all 0.3s;
  -moz-transition: all 0.3s;
  -webkit-transition: all 0.3s;
  z-index: -1;
}

.loading.loading-show {
  opacity: 1;
  z-index: 10000;
}

.vertical-center {
  margin: 0;
  position: absolute;
  top: 50%;
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);
}
</style>
