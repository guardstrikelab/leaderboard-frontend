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
      </div>
    </div>
    <!-- :style="{ backgroundImage: 'url(' + item.image + ')' }" -->
    <div class="right-con"></div>
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
import { formatTime } from '@/utils/tool';

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
  getAllChallenges('present', 'approved', 'public', {
    page: pager.pageNum,
  }).then((res) => {
    pager.total = res.count;
    let result = res.results || [];
    challengeList.value = pager.pageNum === 1 ? result : challengeList.value.concat(result);
  });
};
onMounted(() => {
  getChallenges();
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
  }
  .right-con {
    width: 439px;
    flex-shrink: 0;
    background: url(@/assets/images/race.png) no-repeat center;
    background-size: contain;
    margin-left: 93px;
  }
}
</style>
