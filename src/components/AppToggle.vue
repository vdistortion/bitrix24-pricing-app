<template>
  <div class="app-toggle">
    <button
      v-for="(title, type) in types"
      :key="type"
      class="app-toggle__button"
      :class="{ active: type === active }"
      @click="onClick(type)"
    >{{ title }}</button>
  </div>
</template>

<script>
export default {
  methods: {
    onClick(type) {
      this.active = type;
      this.$emit('click', type);
    },
  },
  data() {
    return {
      active: this.defaultType,
    };
  },
  emits: ['click'],
  props: {
    types: {
      type: Object,
      required: true,
    },
    defaultType: {
      type: String,
      required: true,
    },
  },
  name: 'app-toggle',
};
</script>

<style lang="stylus">
.app-toggle
  &__button
    border 1px solid #e2e5e6
    padding 6px 14px 6px 16px
    cursor pointer
    transition all .53s
    font-style normal
    font-weight 600
    font-size 14px
    line-height 19px
    background-color #f5f7f8
    color #697281
    &:first-child
      border-radius 25px 0 0 25px
    &:last-child
      border-radius 0 25px 25px 0
    &.active
      background-color transparent
      color #185ccf
      cursor default
</style>
