<template>
  <div class="title">{{ $t('overview.view.title') }}</div>
  <div class="con">
    <!-- <p>{{ $t('overview.view.con1') }}</p>
    <p>{{ $t('overview.view.con2') }}</p>
    <p>{{ $t('overview.view.con3') }}</p>
    <p>{{ $t('overview.view.con4') }}</p>
    <p>{{ $t('overview.view.con5') }}</p> -->
    <div v-html="detailInfo.description" class="editor-content-view"></div>
  </div>
  <div class="title">{{ $t('overview.eval.title') }}</div>
  <div class="con">
    <!-- <p>{{ $t('overview.eval.con1') }}</p>
    <p>{{ $t('overview.eval.con2') }}</p> -->
    <div v-html="detailInfo.evaluation_details" class="editor-content-view"></div>
  </div>
  <div class="title">{{ $t('overview.term.title') }}</div>
  <div class="con">
    <div v-html="detailInfo.terms_and_conditions" class="editor-content-view"></div>
    <!-- <p class="subTitle">{{ $t('overview.term.con1') }}</p>
    <p>{{ $t('overview.term.con2') }}</p>
    <p class="subTitle">{{ $t('overview.term.sub1T') }}</p>
    <p>
      {{ $t('overview.term.sub1C1') }}
    </p>
    <p>
      {{ $t('overview.term.sub1C2') }}
    </p>
    <p class="subTitle">{{ $t('overview.term.sub2T') }}</p>
    <p>
      {{ $t('overview.term.sub2C1') }}
    </p>
    <p class="subTitle">{{ $t('overview.term.sub3T') }}</p>
    <p>
      {{ $t('overview.term.sub3C1') }}
    </p>
    <p>{{ $t('overview.term.con3') }}</p> -->
  </div>
  <div v-for="phase in phases" :key="phase">
    <div class="title">{{ $t('overview.phase') }}: {{ phase.name }}</div>
    <div class="con">
      <div v-html="phase.description" class="editor-content-view mb10"></div>
      <p>{{ $t('addPhase.startDate') }}: {{ formatTime(phase.start_date) }}</p>
      <p>{{ $t('addPhase.endDate') }}: {{ formatTime(phase.end_date) }}</p>
      <p>{{ $t('addPhase.maxSubmiPerDay') }}: {{ phase.max_submissions_per_day }}</p>
      <p>{{ $t('addPhase.maxSubmiPerMonth') }}: {{ phase.max_submissions_per_month }}</p>
      <p>{{ $t('addPhase.maxSubmissions') }}: {{ phase.max_submissions }}</p>
    </div>
  </div>
</template>

<script setup>
import { formatTime } from '@/utils/tool';
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
.title {
  font-weight: 700;
  margin-bottom: 24px;
  font-size: 16px;
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
</style>
