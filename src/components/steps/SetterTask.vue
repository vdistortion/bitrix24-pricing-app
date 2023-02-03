<template>
  <bx-alert
    v-if="error"
    title=""
    size="xs"
    color="danger"
    icon="warning"
    @close="alertClose"
  >{{ errorText }}</bx-alert>
  <form class="setter-task" @submit.prevent>
    <div class="setter-task__item">
      <bx-input
        v-model="title"
        placeholder="Введите название задачи"
        size="lg"
        underline
      ></bx-input>
    </div>
    <div class="setter-task__item">
      <bx-textarea
        v-model="description"
        resize="no"
        style="width: 100%;"
      ></bx-textarea>
    </div>
    <ul class="form-input-group">
      <li v-if="!isDeal" class="form-input-group__item">
        <span class="form-input-group__title">Сделка</span>
        <bx-entity-selector
          :list="deal"
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
          :list="manager"
          inline
          clickable
          @add="onAddManager"
          @click="onUser"
          @delete="onDeleteManager"
        ></bx-entity-selector>
      </li>
      <li v-if="!assignedTasks.length" class="form-input-group__item">
        <span class="form-input-group__title">
          {{ responsible.length > 1 ? 'Ответственные' : 'Ответственный' }}
        </span>
        <bx-entity-selector
          :list="responsible"
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
          v-model="deadline"
          format="dd.MM.yyyy 17:00"
          placeholder="Нет крайнего срока"
          class="datepicker"
        ></bx-input-date>
      </li>
    </ul>
    <div class="setter-task__submit">
      <bx-button
        v-if="assignedTasks.length"
        color="success"
        type="submit"
        @click="onSubmitUpdate"
      >
        Обновить {{ responsible.length > 1 ? 'задачи' : 'задачу' }} (Ctrl+Enter)
      </bx-button>
      <bx-button
        v-else
        color="success"
        type="submit"
        @click="onSubmit"
      >
        Поставить {{ responsible.length > 1 ? 'задачи' : 'задачу' }} (Ctrl+Enter)
      </bx-button>
      <bx-button
        v-if="assignedTasks.length"
        color="light-border"
        @click="clearForm"
      >Новая задача</bx-button>
      <div style="margin-left: 12px;">
        {{ fullTitle }}
        <span v-if="assignedTasks.length">
          (<span
             v-for="(id, index) in assignedTasks"
             :key="id"
           >
            <bx-link
            :href="`/company/personal/user/${currentUser.id}/tasks/task/view/${id}/`"
            >{{ id }}</bx-link>{{ index !== assignedTasks.length - 1 ? ', ' : '' }}
          </span>)
        </span>
      </div>
    </div>
  </form>
</template>

<script>
import { mapState, mapActions } from 'pinia';
import { useRootStore } from '@/stores/RootStore';
import config from '@/config';

export default {
  methods: {
    ...mapActions(useRootStore, ['getDeal', 'setTasks', 'updateTasks', 'deleteAssignedTasks']),

    onAddManager() {
      this.$BX24.selectUser().then((user) => {
        this.manager = [user];
        this.managerId = user.id;
      });
    },

    onAddUsers() {
      this.$BX24.selectUsers().then((users) => {
        users.forEach((user) => {
          this.responsible.push(user);
        });
      });
    },

    onAddDeal() {
      this.$BX24.selectCRM({ entityType: ['deal'] }).then((result) => {
        const deal = result.deal[0];
        const dealId = deal.id.substring(2);
        this.dealId = deal.id;
        this.deal = [deal];
        this.getDeal(dealId);
      });
    },

    onUser(_, item) {
      this.$BX24.openLink(`/company/personal/user/${item.id}/`);
    },

    onDeal(_, item) {
      this.$BX24.openLink(item.url);
    },

    validateForm() {
      if (!this.title) {
        this.errorText = 'Не указано название задачи';
      } else if (!this.responsible.length) {
        this.errorText = 'Не указан ответственный';
      }

      if (this.errorText) {
        this.error = true;

        setTimeout(() => {
          this.error = false;
          this.errorText = '';
        }, 5000);
      }
    },

    onSubmit() {
      this.validateForm();
      if (this.error) return;

      const tasks = this.responsible.map((responsible) => ({
        fields: {
          TITLE: this.fullTitle,
          DESCRIPTION: this.description,
          UF_CRM_TASK: [this.dealId],
          CREATED_BY: this.managerId,
          RESPONSIBLE_ID: responsible.id,
          DEADLINE: this.deadline,
        },
      }));

      this.setTasks(tasks);
    },

    onSubmitUpdate() {
      this.validateForm();
      if (this.error) return;

      const tasks = this.assignedTasks.map((id) => ({
        id,
        fields: {
          TITLE: this.fullTitle,
          DESCRIPTION: this.description,
          UF_CRM_TASK: [this.dealId],
          CREATED_BY: this.managerId,
          DEADLINE: this.deadline,
        },
      }));

      this.updateTasks(tasks);
    },

    clearForm() {
      this.title = '';
      this.description = '';
      this.deadline = null;
      this.responsible = [];
      this.onDeleteDeal();
      this.onDeleteManager();
      this.deleteAssignedTasks();
    },

    onDeleteDeal() {
      if (this.currentDeal) {
        this.dealId = `D_${this.currentDeal.id}`;
        this.deal = [this.currentDeal];
      } else {
        this.dealId = '';
        this.deal = [];
      }
    },

    onDeleteManager() {
      this.managerId = this.currentUser.id;
      this.manager = [this.currentUser];
    },

    onDeleteUser(index) {
      this.responsible.splice(index, 1);
    },

    alertClose() {
      this.error = false;
      this.errorText = '';
    },

    onKeydown(e) {
      const isCtrlEnter = e.ctrlKey && e.code === 'Enter';

      if (isCtrlEnter) {
        e.preventDefault();
        if (this.assignedTasks.length) this.onSubmitUpdate();
        else this.onSubmit();
      }
    },
  },
  computed: {
    ...mapState(useRootStore, ['users', 'currentUser', 'currentDeal', 'isDeal', 'assignedTasks']),

    fullTitle() {
      if (this.title) return [config.prefix, this.title].join('');
      return '';
    },
  },
  watch: {
    currentUser(user) {
      this.managerId = user.id;
      this.manager = [user];
    },
    currentDeal(deal) {
      if (deal) {
        this.dealId = `D_${deal.id}`;
        this.deal = [deal];
        this.managerId = deal.assignedId;
        this.manager = [this.users[deal.assignedId]];
      }
    },
  },
  created() {
    window.addEventListener('keydown', this.onKeydown);
  },
  beforeUnmount() {
    window.removeEventListener('keydown', this.onKeydown);
  },
  data() {
    return {
      title: '',
      description: '',
      dealId: '',
      managerId: '',
      deadline: null,
      deal: [],
      manager: [],
      responsible: [],
      error: false,
      errorText: '',
    };
  },
  inject: ['$BX24'],
  name: 'setter-task',
};
</script>

<style lang="stylus">
body
  background-color rgb(238, 242, 244)
#app
  padding 20px 20px 0

.setter-task
  padding 15px
  background-color #fff
  border-radius 10px
  &__submit
    position fixed
    left 0
    right 0
    bottom 0
    z-index 1
    display flex
    column-gap 12px
    align-items center
    padding 15px 15px 5px
    margin-top 5px
    box-shadow 0 -2px 4px 0 #c6c9cb
    background-color #ffffff
  .datepicker
    display inline-block
  textarea
    border 0

.form-input-group
  padding 0 5px
  margin 6px 0 0
  background-color #f8f9fa
  list-style-type none
  border-radius 8px
  &__item + &__item
    border-top 1px solid #e6e9ec
  &__item
    padding 11px 30px 11px 0
    margin 0 20px
  &__title
    color #5e6675
    font-size 14px
    text-align left
    padding-right 10px
    line-height 20px
    display inline-block
    vertical-align middle
    width 130px
    margin 11px 4px 11px 0
    float left
</style>
