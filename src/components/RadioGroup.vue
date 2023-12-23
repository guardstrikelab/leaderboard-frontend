<template>
  <div class="flex">
    <div class="custom-radio success" :class="{ active: modelValue === true }" @click="$emit('update:modelValue', true)">
      <span class="dot"></span>
      <span class="label">True</span>
    </div>
    <div class="custom-radio danger" :class="{ active: modelValue === false }" @click="$emit('update:modelValue', false)">
      <span class="dot"></span>
      <span class="label">False</span>
    </div>
  </div>
</template>

<script setup>
const props = defineProps(['modelValue']);
const emit = defineEmits(['update:modelValue']);
</script>

<style lang="scss" scoped>
.custom-radio {
  width: 90px;
  height: 42px;
  border-radius: 2px 2px 2px 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  .dot {
    width: 4px;
    height: 4px;
    border-radius: 50%;
    margin-right: 5px;
  }
  .label {
    line-height: 14px;
    font-size: 14px;
  }
  & + .custom-radio {
    margin-left: 32px;
  }
  &.success {
    background: rgba(82, 244, 217, 0.2);
    color: rgba(82, 244, 217, 0.5);
    .dot {
      background: rgba(82, 244, 217, 0.5);
    }
    &.active {
      border: 1px solid #52f4d9;
      color: #52f4d9;
      .dot {
        background: #52f4d9;
      }
    }
  }
  &.danger {
    background: rgba(230, 89, 90, 0.2);
    color: rgba(230, 89, 90, 0.5);
    .dot {
      background: rgba(230, 89, 90, 0.5);
    }
    &.active {
      border: 1px solid #e6595a;
      color: #e6595a;
      .dot {
        background: #e6595a;
      }
    }
  }
}
</style>
