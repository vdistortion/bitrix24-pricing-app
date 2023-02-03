<template>
  <app-toggle
    class="the-breadcrumbs"
    :types="pages"
    default-type="/"
    @click="onClick"
  ></app-toggle>
</template>

<script>
import AppToggle from './AppToggle.vue';
import config from '../config';

export default {
  methods: {
    onClick(path) {
      this.$router.push(path);
    },
  },
  computed: {
    pages() {
      const pages = config.steps.map((step) => [step.path, step.name]);
      return Object.fromEntries(pages);
    },
  },
  components: {
    AppToggle,
  },
  name: 'the-breadcrumbs',
};
</script>

<style lang="stylus">
.the-breadcrumbs
  margin 20px 0
</style>
