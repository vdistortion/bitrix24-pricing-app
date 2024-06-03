<template>
  <dev-panel></dev-panel>
  <app-breadcrumbs v-if="isDeal"></app-breadcrumbs>
  <router-view></router-view>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRootStore } from '@/stores/RootStore';
import DevPanel from './components/dev/DevPanel.vue';
import AppBreadcrumbs from './components/AppBreadcrumbs.vue';

const store = useRootStore();
const isDeal = computed(() => store.isDeal);

store.init().catch(console.warn);
</script>

<style lang="scss">
@import 'https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900&display=swap';

body {
  font-family: 'Roboto Flex', sans-serif;
  margin: 0;
}
</style>
