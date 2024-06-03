import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { usePlacementStore } from './PlacementStore';
import { batch, BX24 } from '@/api/bitrix';

export const useRootStore = defineStore('rootStore', () => {
  const loader = ref(false);
  const appCode = ref('');
  const currentUser = ref(null);
  const currentTask = ref(null);
  const currentDeal = ref(null);
  const users = ref({});
  const entity = ref('');
  const entityId = ref('');
  const assignedTasks = ref<string[]>([]);

  const domain = computed(() => (BX24 ? BX24.getDomain() : ''));
  const portal = computed(() => (BX24 ? BX24.getDomain(true) : ''));
  const isTask = computed(() => entity.value === 'task');
  const isDeal = computed(() => entity.value === 'deal');

  bx24init();

  function bx24init() {
    if (!BX24) return;
    const views: Record<string, string> = {
      REST_APP_URI: 'task',
      CRM_DEAL_DETAIL_TAB: 'deal',
    };
    const { placement, options } = BX24.placement.info();
    if (views[placement]) entity.value = views[placement];
    if (options.ID) entityId.value = options.ID;
  }

  function toggleLoader(visible: boolean) {
    loader.value = visible;
  }

  function deleteAssignedTasks() {
    assignedTasks.value = [];
  }

  function init() {
    if (!BX24) {
      return Promise.reject(new Error('Unable to initialize Bitrix24 JS library!'));
    }

    toggleLoader(true);
    const placementStore = usePlacementStore();

    return batch
      .load(entity.value, entityId.value)
      .then((response: any) => {
        users.value = response.users;
        appCode.value = response.info;
        currentUser.value = response.currentUser;
        if (response.task) currentTask.value = response.task;
        if (response.deal) currentDeal.value = response.deal;
        placementStore.setList(response.placementList);
      })
      .catch(console.warn)
      .finally(() => {
        toggleLoader(false);
      });
  }

  function getDeal(id: string) {
    return batch.getDeal(id).then((response: any) => {
      currentDeal.value = response.deal;
    });
  }

  function setTasks(tasks: any) {
    toggleLoader(true);
    const placementStore = usePlacementStore();

    return batch
      .setTasks(tasks)
      .then((tasks: any[]) => {
        assignedTasks.value = Object.values(tasks).map(({ task }) => task.id);
        const requests = assignedTasks.value.map((id) => [id, placementStore.appTag(id)]);
        batch.writeComment(requests);
      })
      .finally(() => {
        toggleLoader(false);
      });
  }

  function updateTasks(tasks: any) {
    toggleLoader(true);

    return batch
      .updateTasks(tasks)
      .then(console.info)
      .finally(() => {
        toggleLoader(false);
      });
  }

  return {
    loader,
    appCode,
    currentUser,
    currentTask,
    currentDeal,
    users,
    entity,
    entityId,
    assignedTasks,
    domain: domain.value,
    portal: portal.value,
    isTask: isTask.value,
    isDeal: isDeal.value,
    deleteAssignedTasks,
    init,
    getDeal,
    setTasks,
    updateTasks,
  };
});
