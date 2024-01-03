<template>
  <el-collapse v-model="activeNames">
    <el-collapse-item :title="$t('overview.view.title')" name="1">
      <div v-html="detailInfo.description" class="editor-content-view"></div>
    </el-collapse-item>
    <el-collapse-item :title="$t('overview.eval.title')" name="2">
      <div v-html="detailInfo.evaluation_details" class="editor-content-view"></div>
    </el-collapse-item>
    <el-collapse-item :title="$t('overview.term.title')" name="3" id="term">
      <div v-html="detailInfo.terms_and_conditions" class="editor-content-view"></div>
    </el-collapse-item>
    <el-collapse-item :title="$t('overview.phase')" name="4">
      <div v-for="phase in phases" :key="phase" class="plat">
        <div class="title">{{ phase.name }}</div>
        <div class="con">
          <div v-html="phase.description" class="editor-content-view mb10"></div>
          <p>{{ $t('addPhase.startDate') }}: {{ formatTime(phase.start_date) }}</p>
          <p>{{ $t('addPhase.endDate') }}: {{ formatTime(phase.end_date) }}</p>
          <p>{{ $t('addPhase.maxSubmiPerDay') }}: {{ phase.max_submissions_per_day }}</p>
          <p>{{ $t('addPhase.maxSubmiPerMonth') }}: {{ phase.max_submissions_per_month }}</p>
          <p>{{ $t('addPhase.maxSubmissions') }}: {{ phase.max_submissions }}</p>
        </div>
      </div>
    </el-collapse-item>
  </el-collapse>
</template>

<script setup>
import { formatTime } from '@/utils/tool';
import { ref } from 'vue';
const activeNames = ref(['1', '2', '3', '4']);
const props = defineProps({
  detailInfo: {
    type: Object,
    default(rawProps) {
      return {};
    },
  },
  phases: {
    type: Array,
    default: [],
  },
});
</script>

<style lang="scss" scoped>
.plat {
  padding-top: 15px;
  & + .plat {
    border-top: 1px dashed rgba(67, 77, 96, 0.6);
  }
  .title {
    margin-bottom: 24px;
    font-size: 14px;
  }
  .con {
    line-height: 24px;
    margin-bottom: 32px;
    p {
      & + P {
        margin-top: 12px;
      }
    }
    .subTitle {
      font-weight: 600;
    }
  }
}

.el-collapse {
  border: none;
  margin-top: -16px;
}
:deep(.el-collapse-item__header) {
  font-size: 14px;
  font-weight: 700;
}
:deep(.el-collapse-item__wrap) {
  border-bottom-color: rgba(67, 77, 96, 0.6);
}
.el-collapse-item:nth-last-child(1) {
  :deep(.el-collapse-item__wrap) {
    border-bottom: none;
  }
}
</style>
