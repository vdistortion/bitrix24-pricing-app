<template>
  <bx-alert
    v-if="v$.title.$invalid && v$.title.$dirty"
    title=""
    size="xs"
    color="danger"
    icon="warning"
  >
    Не указано название задачи
  </bx-alert>
  <bx-alert
    v-if="v$.responsible.$invalid && v$.responsible.$dirty"
    title=""
    size="xs"
    color="danger"
    icon="warning"
  >
    Не указан ответственный
  </bx-alert>

  <form class="setter-task" @submit.prevent>
    <div class="setter-task__item">
      <bx-input
        v-model="v$.title.$model"
        placeholder="Введите название задачи"
        size="lg"
        underline
        :disabled="assignedTasks.length > 0"
      ></bx-input>
    </div>
    <div class="setter-task__item">
      <bx-textarea v-model="form.description" resize="no" style="width: 100%"></bx-textarea>
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
          {{ form.responsible.length > 1 ? 'Ответственные' : 'Ответственный' }}
        </span>
        <bx-entity-selector
          :list="form.responsible"
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
        <bitrix-datepicker
          v-model="form.deadline"
          format="dd.MM.yyyy 17:00"
          placeholder="Нет крайнего срока"
          class="datepicker"
        ></bitrix-datepicker>
      </li>
    </ul>
    <div class="setter-task__submit">
      <bx-button v-if="assignedTasks.length" color="success" type="submit" @click="onSubmitUpdate">
        Обновить {{ form.responsible.length > 1 ? 'задачи' : 'задачу' }} (Ctrl+Enter)
      </bx-button>
      <bx-button v-else color="success" type="submit" :disabled="v$.$invalid" @click="onSubmit">
        Поставить {{ form.responsible.length > 1 ? 'задачи' : 'задачу' }} (Ctrl+Enter)
      </bx-button>
      <bx-button v-if="assignedTasks.length" color="light-border" @click="clearForm"
        >Новая задача</bx-button
      >
      <div style="margin-left: 12px">
        {{ fullTitle }}
        <span v-if="assignedTasks.length">
          (<span v-for="(id, index) in assignedTasks" :key="id">
            <app-link :href="getHref(id)">{{ id }}</app-link
            >{{ index !== assignedTasks.length - 1 ? ', ' : '' }} </span
          >)
        </span>
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
import { computed, inject, onBeforeUnmount, onMounted, reactive, watch, type Ref } from 'vue';
import { useVuelidate, type Validation } from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import type { IBitrix24Library, IUser } from 'bitrix24-library';
import BxButton from 'vue-bitrix24/BxButton';
import BxInput from 'vue-bitrix24/BxInput';
import BxEntitySelector from 'vue-bitrix24/BxEntitySelector';
import BxAlert from 'vue-bitrix24/BxAlert';
import BxTextarea from 'vue-bitrix24/BxTextarea';
import BitrixDatepicker from '../BitrixDatepicker.vue';
import AppLink from '../AppLink.vue';
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
  deal: [] as any[],
  manager: [] as any[],
});

const form = reactive({
  title: '',
  description: '',
  dealId: '',
  managerId: '',
  responsible: [] as any[],
  deadline: null,
});

const rules = computed(() => ({
  title: {
    required,
  },
  responsible: {
    required,
  },
}));

const v$: Ref<Validation> = useVuelidate(rules, form);

const fullTitle = computed(() => {
  if (form.title) return [config.prefix, form.title].join('');
  return '';
});

watch(currentUser, (user: any) => {
  form.managerId = user.id;
  data.manager = [user];
});

watch(currentDeal, (deal: any) => {
  if (deal) {
    form.dealId = `D_${deal.id}`;
    data.deal = [deal];
    form.managerId = deal.assignedId;
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

function getHref(id: string) {
  return `/company/personal/user/${currentUser.value.id}/tasks/task/view/${id}/`;
}

function onAddManager() {
  if (!$BX24) return;
  $BX24.selectUser().then((user: IUser) => {
    data.manager = [user];
    form.managerId = user.id;
  });
}

function onAddUsers() {
  if (!$BX24) return;
  $BX24.selectUsers().then((users: IUser[]) => {
    users.forEach((user: any) => {
      form.responsible.push(user);
    });
    v$.value.responsible.$touch();
  });
}

function onAddDeal() {
  if (!$BX24) return;
  $BX24.selectCRM({ entityType: ['deal'] }).then((result: any) => {
    const deal = result.deal[0];
    const dealId = deal.id.substring(2);
    form.dealId = deal.id;
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

function onSubmit() {
  if (v$.value.$invalid) return;

  const tasks = form.responsible.map((responsible: { id: string }) => ({
    fields: {
      TITLE: fullTitle.value,
      DESCRIPTION: form.description,
      UF_CRM_TASK: [form.dealId],
      CREATED_BY: form.managerId,
      RESPONSIBLE_ID: responsible.id,
      DEADLINE: form.deadline,
    },
  }));

  store.setTasks(tasks);
}

function onSubmitUpdate() {
  if (v$.value.$invalid) return;

  const tasks = assignedTasks.value.map((id: string) => ({
    id,
    fields: {
      TITLE: fullTitle.value,
      DESCRIPTION: form.description,
      UF_CRM_TASK: [form.dealId],
      CREATED_BY: form.managerId,
      DEADLINE: form.deadline,
    },
  }));

  store.updateTasks(tasks);
}

function clearForm() {
  form.title = '';
  form.description = '';
  form.deadline = null;
  form.responsible = [];
  onDeleteDeal();
  onDeleteManager();
  store.deleteAssignedTasks();
}

function onDeleteDeal() {
  if (currentDeal.value) {
    const { id } = currentDeal.value;
    form.dealId = `D_${id}`;
    data.deal = [currentDeal.value];
  } else {
    form.dealId = '';
    data.deal = [];
  }
}

function onDeleteManager() {
  form.managerId = currentUser.value.id;
  data.manager = [currentUser.value];
}

function onDeleteUser(index: number) {
  form.responsible.splice(index, 1);
}

function onKeydown(e: KeyboardEvent) {
  const isCtrlEnter = e.ctrlKey && e.code === 'Enter';

  if (isCtrlEnter) {
    e.preventDefault();
    if (assignedTasks.value.length) onSubmitUpdate();
    else onSubmit();
  }
}
</script>

<style lang="scss">
body {
  background-color: rgb(238, 242, 244);
}

#app {
  padding: 20px 20px 0;
}

.ui-alert-close-btn {
  display: none;
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
    z-index: 10;
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
