<template>
  <div>
    <div class="banner" :style="{ backgroundImage: detailInfo.image ? 'url(' + detailInfo.image + ')' : 'url(' + racePng + ')' }"></div>
    <div class="digest">
      <div class="flex-between mb20" style="height: 32px">
        <div class="title">{{ detailInfo.title }}</div>
      </div>
      <div class="subTitle mb20">
        <div v-html="detailInfo.short_description" class="editor-content-view"></div>
      </div>
      <div class="flex-center">
        <div class="custom-tag">{{ formatTime(detailInfo.start_date) }} -- {{ formatTime(detailInfo.end_date) }}</div>
      </div>
    </div>
    <div class="content">
      <overview :detailInfo="detailInfo" :phases="phases"></overview>
    </div>
  </div>
</template>

<script setup>
import Overview from '@/views/challenge/Overview.vue';
import { onBeforeMount, ref } from 'vue';
import { useRoute } from 'vue-router';
import { getChallengeDetail, challengePhase } from '@/api/challenge';
import { formatTime } from '@/utils/tool';
import racePng from '../../assets/images/banner.png';

const route = useRoute();
const challengeId = route.params.challengeId;
const detailInfo = ref({});
const phases = ref([]);

onBeforeMount((res) => {
  challengeDetail();
  getPhases();
});

const getPhases = () => {
  challengePhase(challengeId).then((res) => {
    phases.value = res.results || [];
  });
};

const challengeDetail = () => {
  getChallengeDetail(challengeId).then((res) => {
    detailInfo.value = res || {};
  });
};
</script>

<style lang="scss" scoped>
.banner {
  height: 248px;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
}
.digest {
  width: 1200px;
  min-height: 174px;
  margin: -60px auto 16px;
  background: #292f3a;
  border-radius: 4px 4px 4px 4px;
  border: 1px solid #424e61;
  padding: 24px 40px;
  .title {
    height: 24px;
    font-size: 24px;
  }
  .subTitle {
    line-height: 21px;
  }
}
.content {
  width: 1200px;
  min-height: 250px;
  background: #292f3a;
  border-radius: 4px 4px 4px 4px;
  border: 1px solid #424e61;
  margin: 0 auto 16px;
  padding: 24px 24px 20px;
}
</style>
