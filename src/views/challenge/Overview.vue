<template>
  <el-collapse v-model="activeNames" class="oa-collapse">
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
          <div class="con_top">
            <div class="menu">
              <div class="value">{{ formatTime(phase.start_date) }}</div>
              <div class="name">{{ $t('addPhase.startDate') }}</div>
            </div>
            <div class="menu">
              <div class="value">{{ formatTime(phase.end_date) }}</div>
              <div class="name">{{ $t('addPhase.endDate') }}</div>
            </div>
            <div class="divide"></div>
            <div class="menu">
              <div class="value">{{ phase.max_submissions_per_day }}</div>
              <div class="name">{{ $t('addPhase.maxSubmiPerDay') }}</div>
            </div>
            <div class="menu">
              <div class="value">{{ phase.max_submissions_per_month }}</div>
              <div class="name">{{ $t('addPhase.maxSubmiPerMonth') }}</div>
            </div>
            <div class="menu">
              <div class="value">{{ phase.max_submissions }}</div>
              <div class="name">{{ $t('addPhase.maxSubmissions') }}</div>
            </div>
          </div>
          <div v-html="phase.description" class="editor-content-view"></div>
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
    margin-bottom: 32px;
    font-size: 14px;
  }
  .con {
    line-height: 24px;
    margin-bottom: 32px;
    .con_top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 32px;
      .menu {
        .value {
          height: 20px;
          font-size: 20px;
          font-weight: 700;
          color: #ffffff;
          line-height: 20px;
          margin-bottom: 16px;
        }
        .name {
          height: 14px;
          font-size: 14px;
          color: #ffffff;
          line-height: 14px;
        }
      }
      .divide {
        height: 50px;
        border-right: 1px solid rgba(67, 77, 96, 0.6);
      }
    }
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
</style>
