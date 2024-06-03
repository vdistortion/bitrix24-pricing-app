<template>
  <div class="app-toggle">
    <button
      v-for="(title, type) in types"
      :key="type"
      class="app-toggle__button"
      :class="{ active: type === data.active }"
      @click.stop="onClick(type)"
    >
      {{ title }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';

const props = defineProps({
  types: {
    type: Object,
    required: true,
  },
  defaultType: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(['click']);

const data = reactive({
  active: props.defaultType, // users, disabled
});

function onClick(type: string) {
  data.active = type;
  emit('click', type);
}
</script>

<style lang="scss">
.app-toggle {
  display: flex;
  justify-content: center;
  margin: 14px 0;

  &__button {
    border: 1px solid #e2e5e6;
    padding: 6px 14px 6px 16px;
    cursor: pointer;
    transition: all 0.53s;
    font-style: normal;
    font-weight: bold;
    font-size: 14px;
    line-height: 19px;
    background-color: #f5f7f8;
    color: #697281;

    &:first-child {
      border-radius: 25px 0 0 25px;
    }

    &:last-child {
      border-radius: 0 25px 25px 0;
    }

    &:only-child {
      border-radius: 25px;
    }

    &.active {
      background-color: transparent;
      color: #185ccf;
      cursor: default;
    }
  }
}
</style>
