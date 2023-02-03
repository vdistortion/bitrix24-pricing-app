import { defineStore } from 'pinia';
import { usePlacementStore } from './PlacementStore';
import BitrixBatch from '../api/bitrix';

export const useRootStore = defineStore('rootStore', {
  state() {
    return {
      loader: true,
      appCode: '',
      BX24: {},
      batch: {},
      currentUser: null,
      currentTask: null,
      currentDeal: null,
      users: {},
      entity: '',
      entityId: '',
      assignedTasks: [],
    };
  },

  getters: {
    domain: (state) => state.BX24.getDomain(),
    portal: (state) => state.BX24.getDomain(true),
    isTask: (state) => state.entity === 'task',
    isDeal: (state) => state.entity === 'deal',
  },

  actions: {
    bx24init(BX24) {
      const views = {
        REST_APP_URI: 'task',
        CRM_DEAL_DETAIL_TAB: 'deal',
      };
      const { placement, options } = BX24.placement.info();
      if (views[placement]) this.entity = views[placement];
      if (options.ID) this.entityId = options.ID;

      this.BX24 = BX24;
      this.batch = new BitrixBatch(BX24, BX24.isAdmin());
    },

    toggleLoader(visible) {
      this.loader = visible;
    },

    deleteAssignedTasks() {
      this.assignedTasks = [];
    },

    init() {
      this.toggleLoader(true);
      const placementStore = usePlacementStore();

      return this.batch.load(this.entity, this.entityId).then((response) => {
        this.users = response.users;
        this.appCode = response.appCode;
        this.currentUser = response.currentUser;
        if (response.task) this.currentTask = response.task;
        if (response.deal) this.currentDeal = response.deal;
        placementStore.setList(response.placementList);
      }).catch(console.warn).finally(() => {
        this.toggleLoader(false);
      });
    },

    getDeal(id) {
      return this.batch.getDeal(id).then((response) => {
        this.currentDeal = response.deal;
      });
    },

    setTasks(tasks) {
      this.toggleLoader(true);
      const placementStore = usePlacementStore();

      return this.batch.setTasks(tasks).then((tasks) => {
        this.assignedTasks = Object.values(tasks).map(({ task }) => task.id);
        const requests = this.assignedTasks.map((id) => [id, placementStore.appTag(id)]);
        this.batch.writeComment(requests);
      }).finally(() => {
        this.toggleLoader(false);
      });
    },

    updateTasks(tasks) {
      this.toggleLoader(true);

      return this.batch.updateTasks(tasks).then((response) => {
        console.log(response);
      }).finally(() => {
        this.toggleLoader(false);
      });
    },
  },
});
