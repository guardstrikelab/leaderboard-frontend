<template>
  <el-table :data="teams" stripe style="width: 100%" header-cell-class-name="thBg">
    <el-table-column type="expand">
      <template #default="{ row }">
        <div class="expandTable">
          <h3>{{ $t('approval.member') }}</h3>
          <el-table :data="row.members">
            <el-table-column label="Name" prop="member_name" />
            <el-table-column label="Email" prop="email" />
            <el-table-column label="Affiliated To" prop="profile.affiliation" />
            <!-- <el-table-column label="GITHUB" prop="profile.github_url" /> -->
          </el-table>
        </div>
      </template>
    </el-table-column>
    <el-table-column type="index" label="#" width="50" :index="(i) => (i + 1).toString().padStart(2, '0')" />
    <el-table-column prop="team_name" min-width="100" :label="$t('team.teamName')" />
    <el-table-column prop="created_by" :label="$t('team.createdBy')" />
    <el-table-column prop="id" :label="$t('approval.teamId')" />
    <!-- <el-table-column :label="$t('approval.member')" show-overflow-tooltip>
      <template #default="{ row }">
        {{ row.members.map((item) => item.member_name).join(';') }}
      </template>
    </el-table-column> -->
    <el-table-column :label="$t('approval.approval')" width="200">
      <template #default="{ row }">
        <el-switch
          v-model="row.approved"
          size="small"
          style="--el-switch-on-color: #13ce66"
          :active-text="$t('approval.approve')"
          :inactive-text="$t('approval.disagree')"
          :before-change="() => false"
          @click="handleApproval(row)" />
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup>
import { onBeforeMount, onMounted, reactive, ref } from 'vue';
import { getParticipantTeams, approveTeam, disapproveTeam } from '@/api/challenge';
import { formatTime } from '@/utils/tool';
import { getJwtToken } from '@/utils/auth';
import { useI18n } from 'vue-i18n';
import { oaMessageBox } from '@/utils/tool';

const { t } = useI18n();
const props = defineProps(['challengeId']);
const teams = ref([]);

onMounted(() => {
  getTeams();
});
const getTeams = () => {
  getParticipantTeams(props.challengeId).then((res) => {
    teams.value = res.participant_teams || [];
  });
};

const handleApproval = (row) => {
  if (row.approved) {
    disapprove(row);
  } else {
    approve(row);
  }
};
const approve = (row) => {
  oaMessageBox({
    title: t('approval.approveTeam'),
    message: t('approval.approveNote'),
  })
    .then(() => {
      approveTeam(props.challengeId, row.id).then((res) => {
        ElMessage.success(t('approval.approveSuccess'));
        getTeams();
      });
    })
    .catch(() => {});
};

const disapprove = (row) => {
  disapproveTeam(props.challengeId, row.id).then((res) => {
    ElMessage.success(t('approval.disapproveSuccess'));
    getTeams();
  });
};
</script>

<style lang="scss" scoped>
.approval-status {
  position: relative;
  padding-left: 9px;
  &::before {
    content: '';
    position: absolute;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
  }
  &.approve {
    color: #09b66d;
    &::before {
      background-color: #09b66d;
    }
  }
  &.disagree {
    color: #e6595a;
    &::before {
      background-color: #e6595a;
    }
  }
}
:deep(.el-switch__label) {
  color: #a3a6ad;
  &.is-active {
    color: var(--el-color-primary);
  }
}
.expandTable {
  padding: 10px 30px 16px;
  h3 {
    margin-bottom: 16px;
  }
}
</style>
