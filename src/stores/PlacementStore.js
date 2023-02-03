import { defineStore } from 'pinia';
import { useRootStore } from './RootStore';
import config from '../config';

export const usePlacementStore = defineStore('placementStore', {
  state() {
    return {
      placementList: [],
    };
  },

  getters: {
    appLink() {
      const rootStore = useRootStore();
      let path = `/marketplace/view/${rootStore.appCode}/`;
      return encodeURI(path);
    },
    appTag() {
      return (id) => {
        return `[URL=${this.appLink}?params[ID]=${id}]${config.buttonName}[/URL]`;
      };
    },
  },

  actions: {
    setList(list) {
      if (list) this.placementList = list;
    },
    bind(item) {
      const rootStore = useRootStore();
      rootStore.batch.bind(item.placement, item.name).then((list) => {
        this.setList(list);
      });
    },
    unbind(placement) {
      const rootStore = useRootStore();
      rootStore.batch.unbind(placement).then((list) => {
        this.setList(list);
      });
    },
  },
});
