<template>
  <div class="title mb24">{{ $t('challenge.challenge') }}</div>
  <div class="card mb24" v-for="item in challengeList" :key="item" @click="goDetail(item)">
    <div class="left-con">
      <div class="second-title mb24">{{ item.title }}</div>
      <div class="describe mb24">
        <div v-html="item.short_description" class="editor-content-view"></div>
      </div>
      <div class="flex-center">
        <div class="custom-tag">{{ $t('challenge.ongoing') }}</div>
        <div class="custom-tag">{{ formatTime(item.start_date) }} -- {{ formatTime(item.end_date) }}</div>
        <div class="participant-tag" v-if="participantIds.includes(item.id)">
          <svg class="icon mr8" aria-hidden="true" style="font-size: 24px">
            <use xlink:href="#icon-Participant"></use>
          </svg>
          {{ $t('challenge.participated') }}
        </div>
      </div>
    </div>
    <div class="right-con" :style="{ backgroundImage: item.image ? 'url(' + item.image + ')' : 'url(' + racePng + ')' }"></div>
  </div>
  <el-button link @click="loadMore" v-if="pager.total > pager.pageNum * pager.pageSize">
    <svg class="icon mr8" aria-hidden="true">
      <use xlink:href="#icon-load"></use>
    </svg>
    <span>{{ $t('loadMore') }}...</span>
  </el-button>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { getAllChallenges } from '@/api/host';
import { getParticipatedChallenge } from '@/api/challenge';
import { formatTime } from '@/utils/tool';
import racePng from '../../assets/images/banner.png';

const router = useRouter();
const raceInfo = ref([
  {
    id: 100,
  },
  {
    id: 93,
  },
]);
const goDetail = (item) => {
  router.push(`/challenge/detail/${item.id}`);
};
const challengeList = ref([]);
const pager = reactive({
  total: 0,
  pageNum: 1,
  pageSize: 10,
});
const getChallenges = () => {
  const loading = ElLoading.service();
  getAllChallenges('present', 'approved', 'public', {
    page: pager.pageNum,
  })
    .then((res) => {
      pager.total = res.count;
      let result = res.results || [];
      challengeList.value = pager.pageNum === 1 ? result : challengeList.value.concat(result);
    })
    .finally((res) => {
      loading.close();
    });
};
const participantIds = ref([]);
const getParticipatedIds = () => {
  getParticipatedChallenge().then((res) => {
    participantIds.value = res || [];
  });
};
onMounted(() => {
  getChallenges();
  getParticipatedIds();
});

const loadMore = () => {
  pager.pageNum += 1;
  getChallenges();
};
</script>

<style lang="scss" scoped>
.card {
  min-height: 200px;
  background: linear-gradient(90deg, #282f3b 0%, #1d242e 100%);
  padding: 24px 16px;
  display: flex;
  justify-content: space-between;
  cursor: pointer;
  .left-con {
    height: 100%;
    padding-left: 9px;
    .describe {
      line-height: 28px;
      min-height: 84px;
    }
    .participant-tag {
      height: 32px;
      background: rgba(69, 98, 227, 0.5);
      border-radius: 2px 2px 2px 2px;
      display: flex;
      align-items: center;
      padding: 0 8px 0 4px;
      margin-left: 16px;
    }
  }
  .right-con {
    width: 439px;
    flex-shrink: 0;
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    margin-left: 93px;
  }
}
</style>
