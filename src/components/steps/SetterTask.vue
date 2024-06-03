<template>
  <bx-alert
    v-if="data.error"
    title=""
    size="xs"
    color="danger"
    icon="warning"
    @close="alertClose"
    >{{ data.errorText }}</bx-alert
  >
  <form class="setter-task" @submit.prevent>
    <div class="setter-task__item">
      <bx-input
        v-model="data.title"
        placeholder="Введите название задачи"
        size="lg"
        underline
      ></bx-input>
    </div>
    <div class="setter-task__item">
      <bx-textarea v-model="data.description" resize="no" style="width: 100%"></bx-textarea>
    </div>
    <ul class="form-input-group">
      <li v-if="!isDeal" class="form-input-group__item">
        <span class="form-input-group__title">Сделка</span>
        <bx-entity-selector
          :list="data.deal"
          displayField="title"
          inline
          clickable
          @add="onAddDeal"
          @click="onDeal"
          @delete="onDeleteDeal"
        ></bx-entity-selector>
      </li>
      <li class="form-input-group__item">
        <span class="form-input-group__title">Постановщик</span>
        <bx-entity-selector
          :list="data.manager"
          inline
          clickable
          @add="onAddManager"
          @click="onUser"
          @delete="onDeleteManager"
        ></bx-entity-selector>
      </li>
      <li v-if="!assignedTasks.length" class="form-input-group__item">
        <span class="form-input-group__title">
          {{ data.responsible.length > 1 ? 'Ответственные' : 'Ответственный' }}
        </span>
        <bx-entity-selector
          :list="data.responsible"
          inline
          multiple
          clickable
          @add="onAddUsers"
          @click="onUser"
          @delete="onDeleteUser"
        ></bx-entity-selector>
      </li>
      <li class="form-input-group__item">
        <span class="form-input-group__title">Крайний срок</span>
        <bx-input-date
          v-model="data.deadline"
          format="dd.MM.yyyy 17:00"
          placeholder="Нет крайнего срока"
          class="datepicker"
        ></bx-input-date>
      </li>
    </ul>
    <div class="setter-task__submit">
      <bx-button v-if="assignedTasks.length" color="success" type="submit" @click="onSubmitUpdate">
        Обновить {{ data.responsible.length > 1 ? 'задачи' : 'задачу' }} (Ctrl+Enter)
      </bx-button>
      <bx-button v-else color="success" type="submit" @click="onSubmit">
        Поставить {{ data.responsible.length > 1 ? 'задачи' : 'задачу' }} (Ctrl+Enter)
      </bx-button>
      <bx-button v-if="assignedTasks.length" color="light-border" @click="clearForm"
        >Новая задача</bx-button
      >
      <div style="margin-left: 12px">
        {{ fullTitle }}
        <span v-if="assignedTasks.length">
          (<span v-for="(id, index) in assignedTasks" :key="id">
            <bx-link :href="getHref(id)">{{ id }}</bx-link
            >{{ index !== assignedTasks.length - 1 ? ', ' : '' }} </span
          >)
        </span>
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
import { computed, inject, onBeforeUnmount, onMounted, reactive, watch } from 'vue';
import type { IBitrix24Library, IUser } from 'bitrix24-library';
import BxButton from 'vue-bitrix24/BxButton';
import BxInput from 'vue-bitrix24/BxInput';
import BxEntitySelector from 'vue-bitrix24/BxEntitySelector';
import BxAlert from 'vue-bitrix24/BxAlert';
import BxTextarea from 'vue-bitrix24/BxTextarea';
import BxInputDate from '../BitrixDatepicker.vue';
import BxLink from '../AppLink.vue';
import { useRootStore } from '@/stores/RootStore';
import config from '@/config';

const $BX24: IBitrix24Library | undefined = inject('$BX24');
const store = useRootStore();

const users = computed(() => store.users);
const currentUser: any = computed(() => store.currentUser);
const currentDeal = computed(() => store.currentDeal);
const isDeal = computed(() => store.isDeal);
const assignedTasks = computed(() => store.assignedTasks);

const data = reactive({
  title: '',
  description: '',
  dealId: '',
  managerId: '',
  deadline: null,
  deal: [] as any[],
  manager: [] as any[],
  responsible: [] as any[],
  error: false,
  errorText: '',
});

const fullTitle = computed(() => {
  if (data.title) return [config.prefix, data.title].join('');
  return '';
});

function getHref(id: string) {
  return `/company/personal/user/${currentUser.value.id}/tasks/task/view/${id}/`;
}

function onAddManager() {
  if (!$BX24) return;
  $BX24.selectUser().then((user: IUser) => {
    data.manager = [user];
    data.managerId = user.id;
  });
}

function onAddUsers() {
  if (!$BX24) return;
  $BX24.selectUsers().then((users: IUser[]) => {
    users.forEach((user) => {
      data.responsible.push(user);
    });
  });
}

function onAddDeal() {
  if (!$BX24) return;
  $BX24.selectCRM({ entityType: ['deal'] }).then((result: any) => {
    const deal = result.deal[0];
    const dealId = deal.id.substring(2);
    data.dealId = deal.id;
    data.deal = [deal];
    store.getDeal(dealId);
  });
}

function onUser(_: any, item: any) {
  if ($BX24) $BX24.openLink(`/company/personal/user/${item.id}/`);
}

function onDeal(_: any, item: any) {
  if ($BX24) $BX24.openLink(item.url);
}

function validateForm() {
  if (!data.title) {
    data.errorText = 'Не указано название задачи';
  } else if (!data.responsible.length) {
    data.errorText = 'Не указан ответственный';
  }

  if (data.errorText) {
    data.error = true;

    setTimeout(() => {
      data.error = false;
      data.errorText = '';
    }, 5000);
  }
}

function onSubmit() {
  validateForm();
  if (data.error) return;

  const tasks = data.responsible.map((responsible: { id: string }) => ({
    fields: {
      TITLE: fullTitle.value,
      DESCRIPTION: data.description,
      UF_CRM_TASK: [data.dealId],
      CREATED_BY: data.managerId,
      RESPONSIBLE_ID: responsible.id,
      DEADLINE: data.deadline,
    },
  }));

  store.setTasks(tasks);
}

function onSubmitUpdate() {
  validateForm();
  if (data.error) return;

  const tasks = assignedTasks.value.map((id: string) => ({
    id,
    fields: {
      TITLE: fullTitle.value,
      DESCRIPTION: data.description,
      UF_CRM_TASK: [data.dealId],
      CREATED_BY: data.managerId,
      DEADLINE: data.deadline,
    },
  }));

  store.updateTasks(tasks);
}

function clearForm() {
  data.title = '';
  data.description = '';
  data.deadline = null;
  data.responsible = [];
  onDeleteDeal();
  onDeleteManager();
  store.deleteAssignedTasks();
}

function onDeleteDeal() {
  if (currentDeal.value) {
    const { id } = currentDeal.value;
    data.dealId = `D_${id}`;
    data.deal = [currentDeal.value];
  } else {
    data.dealId = '';
    data.deal = [];
  }
}

function onDeleteManager() {
  data.managerId = currentUser.value.id;
  data.manager = [currentUser.value];
}

function onDeleteUser(index: number) {
  data.responsible.splice(index, 1);
}

function alertClose() {
  data.error = false;
  data.errorText = '';
}

function onKeydown(e: KeyboardEvent) {
  const isCtrlEnter = e.ctrlKey && e.code === 'Enter';

  if (isCtrlEnter) {
    e.preventDefault();
    if (assignedTasks.value.length) onSubmitUpdate();
    else onSubmit();
  }
}

watch(currentUser, (user: any) => {
  data.managerId = user.id;
  data.manager = [user];
});

watch(currentDeal, (deal: any) => {
  if (deal) {
    data.dealId = `D_${deal.id}`;
    data.deal = [deal];
    data.managerId = deal.assignedId;
    // @ts-ignore
    const user = users.value[deal.assignedId];
    data.manager = [user];
  }
});

onMounted(() => {
  window.addEventListener('keydown', onKeydown);
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown);
});
</script>

<style lang="scss">
body {
  background-color: rgb(238, 242, 244);
}

#app {
  padding: 20px 20px 0;
}

.setter-task {
  padding: 15px;
  background-color: #fff;
  border-radius: 10px;

  &__submit {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1;
    display: flex;
    column-gap: 12px;
    align-items: center;
    padding: 15px 15px 5px;
    margin-top: 5px;
    box-shadow: 0 -2px 4px 0 #c6c9cb;
    background-color: #ffffff;
  }

  .datepicker {
    display: inline-block;
  }

  textarea {
    border: 0;
  }
}

.form-input-group {
  padding: 0 5px;
  margin: 6px 0 0;
  background-color: #f8f9fa;
  list-style-type: none;
  border-radius: 8px;

  &__item + &__item {
    border-top: 1px solid #e6e9ec;
  }

  &__item {
    padding: 11px 30px 11px 0;
    margin: 0 20px;
  }

  &__title {
    color: #5e6675;
    font-size: 14px;
    text-align: left;
    padding-right: 10px;
    line-height: 20px;
    display: inline-block;
    vertical-align: middle;
    width: 130px;
    margin: 11px 4px 11px 0;
  }
}
</style>
