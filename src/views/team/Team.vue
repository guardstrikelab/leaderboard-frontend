<template>
  <div class="flex-between mb24">
    <div class="title">{{ $t('team.team') }}</div>
    <el-button type="primary" @click="creatTeam">
      <svg class="icon mr8" aria-hidden="true">
        <use xlink:href="#icon-chuangjian"></use>
      </svg>
      {{ $t('team.createTeam') }}
    </el-button>
  </div>
  <div class="content">
    <div class="card" v-for="item in teamInfo" :key="item">
      <div class="flex-between mb16" style="height: 32px">
        <div class="second-title">{{ item.team_name }}</div>
        <div class="flex">
          <span class="icon-button mr8" v-if="item.created_by === store.state.userInfo?.username" @click="editTeam(item)">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-bianji"></use>
            </svg>
          </span>
          <span class="icon-button mr8" @click="intive(item)">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-yaoqing"></use>
            </svg>
          </span>
          <span class="icon-button" @click="removeTeam(item)">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-a-Logout"></use>
            </svg>
          </span>
        </div>
      </div>
      <div class="mb16">
        <span class="label mr8">{{ $t('team.createdBy') }}:</span>
        <span>{{ item.created_by }}</span>
      </div>
      <div class="member">
        <div class="label">{{ $t('team.members') }}:</div>
        <div class="con small-scrollbar">
          <p v-for="member in item.members" :key="member">{{ member.member_name }}（{{ member.email }}）</p>
        </div>
      </div>
    </div>
  </div>
  <div class="nodata" v-if="teamInfo.length === 0">
    <img src="@/assets/images/no_data.png" alt="" />
    <span>No team</span>
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

  <!-- 创建团队 -->
  <el-dialog
    v-model="teamDialog.visible"
    :title="teamDialog.id ? $t('team.editTeam') : $t('team.createTeam')"
    width="500"
    class="oa-dialog"
    :close-on-click-modal="false"
    :close-on-press-escape="false">
    <el-form :model="teamDialog" ref="teamRef" label-position="top" require-asterisk-position="right" :show-message="false">
      <el-form-item :label="$t('team.teamName')" prop="name" required>
        <el-input :placeholder="$t('team.teamNamePH')" v-model.trim="teamDialog.name" maxlength="100"></el-input>
      </el-form-item>
      <el-form-item :label="$t('team.url')" prop="url">
        <el-input :placeholder="$t('team.urlPH')" v-model.trim="teamDialog.url" maxlength="1000"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="between">
        <div></div>
        <div>
          <el-button @click="teamDialog.visible = false" text bg>{{ $t('cancel') }}</el-button>
          <el-button type="primary" :disabled="!teamDialog.name" @click="saveTeam"> {{ $t('save') }} </el-button>
        </div>
      </div>
    </template>
  </el-dialog>

  <!-- 团队邀请 -->
  <el-dialog
    v-model="intiveDialog.visible"
    :title="$t('team.intive')"
    width="500"
    class="oa-dialog"
    :close-on-click-modal="false"
    :close-on-press-escape="false">
    <!-- 当el-form下只有一个input时，按下enter会刷新页面，在el-form元素上添加@submit.prevent修饰符，这将阻止默认的提交行为。-->
    <el-form :model="intiveDialog" ref="intiveRef" label-position="top" @submit.prevent>
      <el-form-item :label="$t('team.email')" prop="email">
        <el-input v-model.trim="intiveDialog.email" :placeholder="$t('team.emailPH')" @keypress.enter="teamIntive"></el-input>
        <!-- <span>{{ $t('team.emailNote') }}</span> -->
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="between">
        <div></div>
        <div>
          <el-button @click="intiveDialog.visible = false" text bg>{{ $t('cancel') }}</el-button>
          <el-button type="primary" :disabled="!intiveDialog.email" @click="teamIntive"> {{ $t('send') }} </el-button>
        </div>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { onBeforeMount, onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { oaMessageBox } from '@/utils/tool';
import { useI18n } from 'vue-i18n';
import { createTeam, getTeam, updateTeam, removeSelf, inviteMember } from '@/api/team';

const { t } = useI18n();

const store = useStore();
const router = useRouter();
const teamDialog = reactive({
  visible: false,
  name: '',
  url: '',
  id: '',
});

const pager = reactive({
  total: 0,
  pageNum: 1,
  pageSize: 10,
});
const teamInfo = ref([]);
const getTeams = () => {
  const loading = ElLoading.service();
  getTeam({ page: pager.pageNum })
    .then((res) => {
      teamInfo.value = res.results || [];
      pager.total = res.count;
    })
    .finally((res) => {
      loading.close();
    });
};

const creatTeam = () => {
  teamDialog.name = '';
  teamDialog.url = '';
  teamDialog.id = '';
  teamDialog.visible = true;
};
const editTeam = (item) => {
  teamDialog.name = item.team_name;
  teamDialog.url = item.team_url;
  teamDialog.id = item.id;
  teamDialog.visible = true;
};
const saveTeam = () => {
  const loading = ElLoading.service();
  let api = teamDialog.id
    ? updateTeam(teamDialog.id, {
        team_name: teamDialog.name,
        team_url: teamDialog.url,
      })
    : createTeam({
        team_name: teamDialog.name,
        team_url: teamDialog.url,
      });

  api
    .then((res) => {
      ElMessage.success(t(teamDialog.id ? 'team.updateSuccess' : 'team.createSuccess'));
      teamDialog.visible = false;
      getTeams();
    })
    .catch((response) => {
      loading.close();
    });
};

const removeTeam = (item) => {
  oaMessageBox({
    title: t('team.removeYourself'),
    message: t('team.removeNote'),
  })
    .then(() => {
      removeSelf(item.id).then((res) => {
        ElMessage.success(t('team.removeSuccess'));
        getTeams();
      });
    })
    .catch(() => {});
};

const intiveDialog = reactive({
  visible: false,
  id: '',
  email: '',
});
const intive = (item) => {
  intiveDialog.visible = true;
  intiveDialog.id = item.id;
  intiveDialog.email = '';
};

const teamIntive = () => {
  inviteMember(intiveDialog.id, {
    email: intiveDialog.email,
  }).then((res) => {
    ElMessage.success(t('team.intiveSuccess'));
    intiveDialog.visible = false;
    getTeams();
  });
};
onBeforeMount(() => {
  getTeams();
});
</script>

<style lang="scss" scoped>
.content {
  display: grid;
  grid-gap: 24px;
  grid-template-columns: repeat(2, 1fr);
  .card {
    padding: 24px 16px 24px 27px;
    background-color: #282f3b;
    border: 1px solid #282f3b;
    &:hover {
      border: 1px solid #4562e3;
    }
    .label {
      color: #b1bbcb;
    }
    .member {
      height: 100px;
      background: #282f3b;
      border-radius: 2px 2px 2px 2px;
      border: 1px solid #404b64;
      padding-left: 110px;
      padding-right: 6px;
      padding-top: 8px;
      padding-bottom: 8px;
      position: relative;
      .label {
        position: absolute;
        left: 16px;
        top: 16px;
        line-height: 1;
      }
      .con {
        height: 100%;
        display: grid;
        grid-gap: 0px;
        grid-template-columns: repeat(2, 1fr);
        p {
          line-height: 30px;
        }
      }
    }
  }
}

.nodata {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 200px;
  img {
    margin-bottom: 10px;
  }
}
</style>
