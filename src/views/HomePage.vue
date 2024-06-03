<template>
  <project-price v-if="isTask"></project-price>
  <setter-task v-else></setter-task>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRootStore } from '@/stores/RootStore';
import ProjectPrice from '../components/steps/ProjectPrice.vue';
import SetterTask from '../components/steps/SetterTask.vue';

const store = useRootStore();
const isTask = computed(() => store.isTask);
</script>
