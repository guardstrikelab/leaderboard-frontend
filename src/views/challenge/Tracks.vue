<template>
  <el-collapse :model-value="['0', '1', '2', '3', '4']" class="oa-collapse">
    <el-collapse-item :title="track.name" :name="index.toString()" v-for="(track, index) in tracks" :key="track">
      <div class="con">
        <div class="con_top">
          <div class="menu">
            <div class="value">{{ formatTime(track.start_date) }}</div>
            <div class="name">{{ $t('addTrack.startDate') }}</div>
          </div>
          <div class="menu">
            <div class="value">{{ formatTime(track.end_date) }}</div>
            <div class="name">{{ $t('addTrack.endDate') }}</div>
          </div>
          <div class="divide"></div>
          <div class="menu">
            <div class="value">{{ track.max_submissions_per_day }}</div>
            <div class="name">{{ $t('addTrack.maxSubmiPerDay') }}</div>
          </div>
          <div class="menu">
            <div class="value">{{ track.max_submissions_per_month }}</div>
            <div class="name">{{ $t('addTrack.maxSubmiPerMonth') }}</div>
          </div>
          <div class="menu">
            <div class="value">{{ track.max_submissions }}</div>
            <div class="name">{{ $t('addTrack.maxSubmissions') }}</div>
          </div>
        </div>
        <div v-html="track.description" class="editor-content-view"></div>
      </div>
    </el-collapse-item>
  </el-collapse>
</template>

<script setup>
import { formatTime } from '@/utils/tool';
const props = defineProps({
  tracks: {
    type: Array,
    default: [],
  },
});
</script>

<style lang="scss" scoped>
.con {
  line-height: 24px;
  margin-bottom: 10px;
  padding-top: 12px;
  .con_top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 32px;
    .menu {
      .value {
        height: 20px;
        font-size: 18px;
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
</style>
