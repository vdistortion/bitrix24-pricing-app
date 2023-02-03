<template>
  <h3>Расценка проекта</h3>
  <pre>{{ currentTask }}</pre>
</template>

<script>
import { mapState } from 'pinia';
import { useRootStore } from '@/stores/RootStore';

export default {
  computed: mapState(useRootStore, ['currentTask']),
  name: 'project-price',
};
</script>
