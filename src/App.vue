<template>
  <dev-panel></dev-panel>
  <the-breadcrumbs v-if="isDeal"></the-breadcrumbs>
  <router-view></router-view>
</template>

<script>
import { mapState, mapActions } from 'pinia';
import { useRootStore } from './stores/RootStore';
import DevPanel from './components/dev/DevPanel.vue';
import TheBreadcrumbs from './components/TheBreadcrumbs.vue';

export default {
  methods: mapActions(useRootStore, ['init']),
  computed: mapState(useRootStore, ['isDeal']),
  created() {
    this.init().catch(console.warn);
  },
  components: {
    DevPanel,
    TheBreadcrumbs,
  },
  name: 'app',
};
</script>

<style lang="stylus">
body
  font-family Roboto, sans-serif
  margin 0
</style>
