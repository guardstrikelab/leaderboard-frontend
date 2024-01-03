<template>
  <div class="participate" v-if="store.state.token">
    <div class="team_ul" v-if="teams.length > 0">
      <div class="team_li mb16" v-for="item in teams" :key="item.id" :class="{ active: item.id === activeId }" @click="handleSelect(item)">
        <div class="title">{{ item.team_name }}</div>
        <el-radio class="custom-radio" v-model="activeId" :label="item.id"></el-radio>
      </div>
      <el-pagination
        hide-on-single-page
        background
        layout="prev, pager, next"
        :total="pager.total"
        v-model:page-size="pager.pageSize"
        v-model:current-page="pager.pageNum"
        @size-change="getTeams"
        @current-change="getTeams"
        class="mt24 oa-pagination" />
      <el-button type="primary" size="large" class="long-button mt24" :disabled="!activeId" @click="participate">{{
        $t('participate.continue')
      }}</el-button>
    </div>
    <div class="team_ul nodata" v-else>
      <img src="@/assets/images/no_data.png" alt="" />
      <span>{{ $t('challenge.noTeam') }}</span>
      <span>{{ $t('challenge.startCreate') }}</span>
    </div>
    <div class="team_box">
      <div class="title mb24">{{ $t('team.createTeam') }}</div>
      <el-form :model="teamDialog" ref="teamRef" label-position="top" require-asterisk-position="right" :show-message="false">
        <el-form-item :label="$t('team.teamName')" prop="name" required>
          <el-input :placeholder="$t('team.teamNamePH')" v-model.trim="teamDialog.name" maxlength="100"></el-input>
        </el-form-item>
        <el-form-item :label="$t('team.url')" prop="url">
          <el-input :placeholder="$t('team.urlPH')" v-model.trim="teamDialog.url" maxlength="1000"></el-input>
        </el-form-item>
      </el-form>
      <div class="mt24">
        <el-button type="primary" :disabled="!teamDialog.name" @click="saveTeam"> {{ $t('create') }} </el-button>
      </div>
    </div>
  </div>
  <div class="notLog" v-else>
    <span>{{ $t('challenge.please') }}</span>
    <el-button class="ml8 mr8" type="primary" size="small" style="height: 20px; font-size: 14px; border-radius: 2px" @click="goLogin">
      {{ $t('challenge.login') }}
    </el-button>
    <span>{{ $t('challenge.partiChall') }}</span>
  </div>

  <el-dialog
    v-model="acceptDialog.visible"
    :title="$t('overview.term.title')"
    width="500"
    class="oa-dialog"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    align-center>
    <div class="accept-con">
      {{ $t('participate.accept_text1') }} <span @click="goTermDetail">{{ $t('participate.accept_text2') }}</span>
      {{ $t('participate.accept_text3') }}
    </div>
    <el-checkbox v-model="acceptDialog.accept" :label="$t('participate.accept_label')" />
    <template #footer>
      <div class="between">
        <div></div>
        <div>
          <el-button @click="acceptDialog.visible = false" text bg>{{ $t('cancel') }}</el-button>
          <el-button type="primary" :disabled="!acceptDialog.accept" @click="confirmParticipate"> {{ $t('challenge.participate') }} </el-button>
        </div>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { createTeam, getTeam } from '@/api/team';
import { partChallenge } from '@/api/challenge';
import { onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

const { t } = useI18n();
const router = useRouter();
const store = useStore();

const props = defineProps(['challengeId']);
const emit = defineEmits(['callback', 'openTerm']);
const pager = reactive({
  total: 0,
  pageNum: 1,
  pageSize: 5,
});
const teams = ref([]);
onMounted(() => {
  if (store.state.token) {
    getTeams();
  }
});

const getTeams = () => {
  const loading = ElLoading.service();
  getTeam({ page: pager.pageNum, page_size: pager.pageSize })
    .then((res) => {
      teams.value = res.results || [];
      pager.total = res.count;
    })
    .finally((res) => {
      loading.close();
    });
};

const activeId = ref();
const handleSelect = (row) => {
  activeId.value = row.id;
};

const teamDialog = reactive({
  name: '',
  url: '',
});
const teamRef = ref();
const saveTeam = () => {
  const loading = ElLoading.service();
  createTeam({
    team_name: teamDialog.name,
    team_url: teamDialog.url,
  })
    .then((res) => {
      teamRef.value.resetFields();
      ElMessage.success(t('team.createSuccess'));
      getTeams();
    })
    .catch((response) => {
      loading.close();
    });
};

const acceptDialog = reactive({
  visible: false,
  accept: false,
});
const participate = () => {
  acceptDialog.visible = true;
  acceptDialog.accept = false;
};

const confirmParticipate = () => {
  partChallenge(props.challengeId, activeId.value).then((res) => {
    emit('callback');
  });
};

const goTermDetail = () => {
  acceptDialog.visible = false;
  emit('openTerm');
};

const goLogin = () => {
  router.push('/auth/login');
};
</script>

<style lang="scss" scoped>
.participate {
  display: flex;
  .team_ul {
    flex-shrink: 0;
    width: 500px;
    .team_li {
      height: 68px;
      background: #282f3b;
      border-radius: 2px 2px 2px 2px;
      border: 1px solid #404b64;
      padding: 0 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
      &.active {
        border: 1px solid #4562e3;
      }
      .title {
        position: relative;
        padding-left: 11px;
        &::before {
          width: 3px;
          height: 16px;
          background-color: var(--el-color-primary);
          content: '';
          position: absolute;
          top: 50%;
          left: 0;
          transform: translateY(-50%);
        }
      }
    }
    .partici {
      width: 100%;
      height: 40px;
      background: #4562e3;
      border-radius: 2px 2px 2px 2px;
      opacity: 1;
    }
  }
  .nodata {
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    height: 290px;
    background: #282f3b;
    border-radius: 2px 2px 2px 2px;
    border: 1px solid #404b64;
    img {
      height: 100px;
      margin-bottom: 20px;
    }
    span {
      text-align: center;
      line-height: 21px;
    }
  }
  .team_box {
    flex: 1;
    margin-left: 32px;
    padding: 30px 30px 24px 30px;
    height: 290px;
    background: #292f3a;
    border-radius: 2px 2px 2px 2px;
    border: 1px solid #424e61;
    .title {
      font-size: 16px;
      font-weight: 700;
    }
  }
}
.long-button {
  width: 100%;
  border-radius: 2px;
}
.notLog {
  display: flex;
  height: 68px;
  background: #292f3a;
  border-radius: 2px 2px 2px 2px;
  border: 1px solid #424e61;
  align-items: center;
  justify-content: center;
}
.accept-con {
  color: #fff;
  margin-bottom: 10px;
  span {
    color: var(--el-color-primary);
    cursor: pointer;
    text-decoration: underline;
  }
}
.el-checkbox :deep(.el-checkbox__label) {
  color: #7f889a;
  font-size: 12px;
}
</style>
