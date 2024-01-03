<template>
  <div class="title mb24">{{ $t('challenge.leaderboard') }}</div>
  <div class="mb24">
    <div v-html="description" class="editor-content-view"></div>
  </div>

  <div class="flex-center mb16">
    <el-select v-model="curSplitId" :placeholder="$t('submission.phasePH')" @change="splitChange" style="width: 360px" class="mr16">
      <el-option v-for="item in splits" :key="item.id" :label="getSplitLabel(item)" :value="item.id" />
    </el-select>
    <!-- <el-checkbox :label="$t('leaderboard.orderScore')" name="type" v-model="isByScore" @change="splitChange"></el-checkbox> -->

    <el-select v-model="curOrderBy" :placeholder="$t('submission.orderPH')" @change="splitChange" style="width: 360px" class="mr16">
      <el-option v-for="item in labels" :key="item" :label="item" :value="item" />
    </el-select>
  </div>

  <el-table :data="leaderboardList" stripe style="width: 100%" header-cell-class-name="thBg">
    <el-table-column fixed prop="rank" :label="$t('leaderboard.rank')" width="80" />
    <el-table-column fixed sortable prop="submission__participant_team__team_name" :label="$t('leaderboard.team')" width="250" />
    <!-- <el-table-column sortable prop="filtering_score" :label="$t('leaderboard.score')" /> -->
    <el-table-column sortable :label="label" v-for="(label, i) in labels" :key="label" width="280">
      <template #default="{ row }">
        {{ row.result[i] }}
      </template>
    </el-table-column>
    <el-table-column
      sortable
      prop="submission__submitted_at"
      :label="$t('leaderboard.lastSubmission')"
      :formatter="
        (row) => {
          return formatTime(row.submission__submitted_at);
        }
      "
      width="200" />
  </el-table>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue';
import { getPhaseSplit, getLeaderboard } from '@/api/challenge';
import { formatTime } from '@/utils/tool';

const props = defineProps(['challengeId', 'description']);
const curSplitId = ref('');
const splits = ref([]);
const isByScore = ref(false);
const curOrderBy = ref('');
const labels = ref([
  'Driving score',
  'Route completion',
  'Infraction penalty',
  'Collisions pedestrians',
  'Collisions vehicles',
  'Collisions layout',
  'Red light infractions',
  'Stop sign infractions',
  'Off-road infractions',
  'Route deviations',
  'Route timeouts',
  'Agent blocked',
  'Yield emergency vehicle infractions',
  'Scenario timeouts',
  'Min speed infractions',
]);
const getSplitLabel = (item) => {
  return `Phase: ${item.challenge_phase_name}`;
};
onMounted(() => {
  getPhaseSplit(props.challengeId).then((res) => {
    splits.value = res || [];
  });
});
const pager = reactive({
  total: 0,
  pageNum: 1,
  pageSize: 1000,
});
const leaderboardList = ref([]);
const splitChange = () => {
  getLeaderboard(curSplitId.value, { page_size: 1000, order_by: curOrderBy.value || undefined }).then((res) => {
    pager.total = res.count;
    leaderboardList.value = res.results || [];
    leaderboardList.value.forEach((item, i) => {
      item.rank = (i + 1).toString().padStart(2, '0');
    });
    if (leaderboardList.value.length > 0) {
      labels.value = leaderboardList.value[0].leaderboard__schema?.labels || [];
    } else {
      labels.value = [];
    }
  });
};
</script>

<style lang="scss" scoped>
.title {
  font-weight: 700;
}
</style>
