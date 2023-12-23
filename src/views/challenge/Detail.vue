<template>
  <div>
    <div class="banner"></div>
    <div class="digest">
      <div class="flex-between mb20" style="height: 32px">
        <div class="title">{{ detailInfo.title }}</div>
        <el-button v-if="teamDetail?.approved" type="primary" @click="deregister" class="ml16">{{ $t('submission.deregister') }}</el-button>
      </div>
      <div class="subTitle mb20">
        <div v-html="detailInfo.short_description" class="editor-content-view"></div>
      </div>
      <div class="flex-center">
        <div class="custom-tag">{{ formatTime(detailInfo.start_date) }} -- {{ formatTime(detailInfo.end_date) }}</div>
      </div>
    </div>
    <div class="content">
      <el-tabs v-model="activeName" class="demo-tabs">
        <el-tab-pane :label="$t('challenge.overview')" name="overview">
          <overview :detailInfo="detailInfo" :phases="phases"></overview>
        </el-tab-pane>
        <el-tab-pane :label="$t('challenge.participate')" name="participate" v-if="!teamDetail">
          <participate :challengeId="challengeId" @callback="getPartTeam('submission')"></participate>
        </el-tab-pane>
        <el-tab-pane :label="$t('challenge.submission')" name="submission" v-else>
          <submission
            :challengeId="challengeId"
            :approved="teamDetail.approved"
            :allowCancel="allowCancel"
            :phases="phases"
            @callback="deregister"></submission>
        </el-tab-pane>
        <el-tab-pane :label="$t('challenge.leaderboard')" name="leaderboard">
          <leader-board :challengeId="challengeId"></leader-board>
        </el-tab-pane>
        <el-tab-pane :label="$t('challenge.approval')" name="approval" v-if="isChallengeHost && manualApproval">
          <approval :challengeId="challengeId"></approval>
        </el-tab-pane>
        <el-tab-pane :label="$t('challenge.allSubmission')" name="allSubmission" v-if="isChallengeHost">
          <all-submission :challengeId="challengeId"></all-submission>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup>
import Participate from '@/views/challenge/Participate.vue';
import Overview from '@/views/challenge/Overview.vue';
import Submission from '@/views/challenge/Submission.vue';
import AllSubmission from '@/views/challenge/AllSubmission.vue';
import LeaderBoard from '@/views/challenge/Leaderboard.vue';
import Approval from '@/views/challenge/Approval.vue';
import { onBeforeMount, ref } from 'vue';
import { useRoute } from 'vue-router';
import { challengeTeam, deregisterChallenge, getChallengeUser, getChallengeDetail, challengePhase } from '@/api/challenge';
import { getAuthToken } from '@/api/account.js';
import { setJwtToken } from '@/utils/auth';
import { useI18n } from 'vue-i18n';
import { formatTime, oaMessageBox } from '@/utils/tool';
import { useStore } from 'vuex';

const { t } = useI18n();
const route = useRoute();
const store = useStore();
const challengeId = route.params.challengeId;
const activeName = ref('overview');
const teamDetail = ref();
const detailInfo = ref({});
const phases = ref([]);
const getPartTeam = (tabId) => {
  challengeTeam(challengeId).then((res) => {
    teamDetail.value = res;
    if (tabId) {
      activeName.value = tabId;
    }
  });
};
const clearPartTeam = (tabId) => {
  teamDetail.value = undefined;
  activeName.value = tabId;
};
onBeforeMount((res) => {
  challengeDetail();
  getPhases();
  if (store.state.token) {
    getAuthKey();
    getUserRole();
    getPartTeam();
  }
});

const getPhases = () => {
  challengePhase(challengeId).then((res) => {
    phases.value = res.results || [];
  });
};

const getAuthKey = () => {
  getAuthToken().then((res) => {
    // "expires_at": "2024-11-10T02:50:35Z"
    setJwtToken(res.token);
  });
};

const deregister = () => {
  oaMessageBox({
    title: t('submission.deregisterTeam'),
    message: t('submission.deregisterConfirm'),
  })
    .then(() => {
      deregisterChallenge(challengeId).then((res) => {
        ElMessage.success(t('submission.deregisterSuccess'));
        clearPartTeam('overview');
      });
    })
    .catch(() => {});
};

const isChallengeHost = ref(false); // 是否是该比赛的主办方
const manualApproval = ref(false); // 比赛团队是否需要人工审核
const allowCancel = ref(false); // 是否允许取消正在执行的任务
const getUserRole = () => {
  getChallengeUser(challengeId).then((res) => {
    isChallengeHost.value = res.is_challenge_host;
  });
};

const challengeDetail = () => {
  getChallengeDetail(challengeId).then((res) => {
    manualApproval.value = res.manual_participant_approval;
    allowCancel.value = res.allow_cancel_running_submissions;
    detailInfo.value = res || {};
  });
};
</script>

<style lang="scss" scoped>
.banner {
  height: 248px;
  background: url('@/assets/images/banner.png') no-repeat;
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
    &.is-active {
      color: var(--text-color);
    }
  }
  :deep(.el-tabs__active-bar) {
    height: 3px;
  }
}
</style>
