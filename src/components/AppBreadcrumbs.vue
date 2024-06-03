<template>
  <app-toggle class="app-breadcrumbs" :types="pages" default-type="/" @click="onClick"></app-toggle>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { steps, type StepType } from '@/config';
import AppToggle from './AppToggle.vue';

const router = useRouter();

function onClick(path: string) {
  router.push(path);
}

const pages = computed(() => {
  const pages = steps.map((step: StepType) => [step.path, step.name]);
  return Object.fromEntries(pages);
});
</script>

<style lang="scss">
.app-breadcrumbs {
  margin: 20px 0;
}
</style>
