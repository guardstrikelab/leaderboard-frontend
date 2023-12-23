<template>
  <el-breadcrumb>
    <el-breadcrumb-item :to="index == levelList.length - 1 ? '' : { path: item.path }" v-for="(item, index) in levelList" :key="item.path">
      {{ item.meta.title }}
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
const route = useRoute();
const levelList = computed(() => {
  return route.matched.filter((item) => item.meta && item.meta.title);
});
</script>
<style lang="scss" scoped>
:deep(.el-breadcrumb__item) {
  &:last-child {
    .el-breadcrumb__inner {
      color: var(--text-color);
    }
  }
  .el-breadcrumb__separator {
    color: var(--text-color);
    font-weight: 400;
  }
  .el-breadcrumb__inner.is-link {
    font-weight: 400;
    color: #b1bbcb;
    &:hover {
      color: #4562e3;
    }
  }
}
</style>
