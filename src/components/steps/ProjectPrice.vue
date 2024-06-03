<template>
  <h3>Расценка проекта</h3>
  <pre>{{ currentTask }}</pre>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRootStore } from '@/stores/RootStore';

const store = useRootStore();
const currentTask = computed(() => store.currentTask);
</script>
