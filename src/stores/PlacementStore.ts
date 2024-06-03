import { ref, computed, type Ref } from 'vue';
import { defineStore } from 'pinia';
import { batch } from '@/api/bitrix';
import config from '@/config';
import type { IPlacement } from '@/types';
import { useRootStore } from './RootStore';

export const usePlacementStore = defineStore('placementStore', () => {
  const placementList: Ref<Record<string, IPlacement>> = ref({});

  const appLink = computed(() => {
    const rootStore = useRootStore();
    let path = `/marketplace/view/${rootStore.appCode}/`;
    return encodeURI(path);
  });

  const appTag = computed(() => {
    return (id: string) => {
      return `[URL=${appLink.value}?params[ID]=${id}]${config.buttonName}[/URL]`;
    };
  });

  function setList(list: Record<string, IPlacement>) {
    if (list) placementList.value = list;
  }

  function bind(item: { placement: string; name: string }) {
    batch.bind(item.placement, item.name).then(setList);
  }

  function unbind(placement: string) {
    batch.unbind(placement).then(setList);
  }

  return {
    placementList,
    appLink,
    appTag,
    setList,
    bind,
    unbind,
  };
});
