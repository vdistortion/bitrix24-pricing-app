<template>
  <project-price v-if="isTask"></project-price>
  <setter-task v-else></setter-task>
</template>

<script>
import { mapState } from 'pinia';
import { useRootStore } from '../stores/RootStore';
import ProjectPrice from '../components/steps/ProjectPrice.vue';
import SetterTask from '../components/steps/SetterTask.vue';

export default {
  computed: mapState(useRootStore, ['isTask']),
  components: {
    ProjectPrice,
    SetterTask,
  },
  name: 'home-page',
};
</script>
