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
      <el-tabs v-model="activeName">
        <el-tab-pane :label="$t('challenge.overview')" name="overview">
          <div v-html="detailInfo.description" class="editor-content-view"></div>
        </el-tab-pane>
        <el-tab-pane :label="$t('challenge.evaluation')" name="evaluation">
          <el-collapse :model-value="['1', '2']" class="oa-collapse">
            <el-collapse-item :title="$t('overview.eval.title')" name="1">
              <div v-html="detailInfo.evaluation_details" class="editor-content-view"></div>
            </el-collapse-item>
            <el-collapse-item :title="$t('overview.term.title')" name="2">
              <div v-html="detailInfo.terms_and_conditions" class="editor-content-view"></div>
            </el-collapse-item>
          </el-collapse>
        </el-tab-pane>
        <el-tab-pane :label="$t('overview.tracks')" name="track">
          <tracks :tracks="tracks"></tracks>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup>
import Tracks from '@/views/challenge/Tracks.vue';
import { onBeforeMount, ref } from 'vue';
import { useRoute } from 'vue-router';
import { getChallengeDetail, challengeTrack } from '@/api/challenge';
import { formatTime } from '@/utils/tool';
import racePng from '../../assets/images/banner.png';

const route = useRoute();
const challengeId = route.params.challengeId;
const detailInfo = ref({});
const tracks = ref([]);
const activeName = ref('overview');

onBeforeMount((res) => {
  challengeDetail();
  getTracks();
});

const getTracks = () => {
  challengeTrack(challengeId).then((res) => {
    tracks.value = res.results || [];
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
  padding: 5px 24px 20px;
  :deep(.el-tabs__header) {
    margin-bottom: 24px;
  }
  :deep(.el-tabs__item) {
    height: 52px;
    font-weight: 400;
    font-size: 16px;
    &.is-active {
      color: var(--text-color);
    }
  }
  :deep(.el-tabs__active-bar) {
    height: 3px;
  }
}
</style>
