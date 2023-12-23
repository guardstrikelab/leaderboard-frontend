<template>
  <el-select v-model="selectedPhaseId" class="mb16" :placeholder="$t('submission.phasePH')" @change="handleChangePhase">
    <el-option v-for="item in phases" :key="item.id" :label="item.name" :value="item.id" />
  </el-select>
  <el-table :data="submissionList" stripe style="width: 100%">
    <el-table-column fixed type="index" label="#" width="50" :index="(i) => (i + 1).toString().padStart(2, '0')" />
    <el-table-column prop="participant_team" :label="$t('submission.team')"> </el-table-column>
    <el-table-column prop="created_by" :label="$t('submission.createdBy')"> </el-table-column>
    <el-table-column prop="status" :label="$t('submission.status')">
      <template #default="{ row }">
        <span :class="['submis-status', row.status]">{{ row.status.charAt(0).toUpperCase() + row.status.slice(1) }}</span>
      </template>
    </el-table-column>
    <el-table-column prop="execution_time" :label="$t('submission.executTime')" />
    <el-table-column prop="submission_result_file" :label="$t('submission.resultFile')">
      <template #default="{ row }">
        <el-link type="primary" v-if="row.submission_result_file" :href="row.submission_result_file" target="_blank">Link</el-link>
        <span v-else>-</span>
      </template>
    </el-table-column>
    <el-table-column prop="stdout_file" :label="$t('submission.stdoutFile')">
      <template #default="{ row }">
        <el-link type="primary" v-if="row.stdout_file" :href="row.stdout_file" target="_blank">Link</el-link>
        <span v-else>-</span>
      </template>
    </el-table-column>
    <el-table-column prop="stderr_file" :label="$t('submission.stderrFile')">
      <template #default="{ row }">
        <el-link type="primary" v-if="row.stderr_file" :href="row.stderr_file" target="_blank">Link</el-link>
        <span v-else>-</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="submitted_at"
      :label="$t('submission.submittedAt')"
      :formatter="
        (row) => {
          return formatTime(row.submitted_at);
        }
      " />
  </el-table>

  <el-button link class="mt24" @click="loadMore" v-if="pager.total > pager.pageNum * pager.pageSize">
    <svg class="icon mr8" aria-hidden="true">
      <use xlink:href="#icon-load"></use>
    </svg>
    <span>{{ $t('loadMore') }}...</span>
  </el-button>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue';
import { challengePhase, getAllSubmissions } from '@/api/challenge';
import { formatTime } from '@/utils/tool';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const props = defineProps(['challengeId']);
const phases = ref([]);

onMounted(() => {
  challengePhase(props.challengeId).then((res) => {
    phases.value = res.results || [];
  });
});

const selectedPhaseId = ref('');
const pager = reactive({
  total: 0,
  pageNum: 1,
  pageSize: 10,
});
const submissionList = ref([]);
const handleChangePhase = () => {
  pager.pageNum = 1;
  getSubmissionList();
};
const getSubmissionList = () => {
  getAllSubmissions(props.challengeId, selectedPhaseId.value, { page: pager.pageNum }).then((res) => {
    pager.total = res.count;
    let result = res.results || [];
    submissionList.value = pager.pageNum === 1 ? result : submissionList.value.concat(result);
  });
};

const loadMore = () => {
  pager.pageNum += 1;
  getSubmissionList();
};
</script>

<style lang="scss" scoped>
.title {
  font-weight: 700;
}
.describe {
  line-height: 21px;
}
.selected-bar {
  height: 48px;
  background: #2a335e;
  border-radius: 4px 4px 4px 4px;
  border: 1px solid #4562e3;
  padding: 0 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  &.btw {
    justify-content: space-between;
  }
}
.phase-box {
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 24px 20px;
  &.more {
    grid-template-columns: repeat(2, 1fr);
  }
  .phase-card {
    height: 123px;
    background: #282f3b;
    border-radius: 2px 2px 2px 2px;
    border: 1px solid #404b64;
    padding: 24px 24px 24px 35px;
    cursor: pointer;
    .row {
      height: 14px;
      font-weight: 700;
    }
  }
}
.instr_con {
  padding-left: 24px;
}
.command {
  height: 32px;
  background: #282f3b;
  border-radius: 2px 2px 2px 2px;
  border: 1px solid #404b64;
  padding: 8px;
  display: inline-block;
  max-width: 80%;
}
.copy {
  width: 32px;
  height: 32px;
  background: #404b64;
  border-radius: 2px 2px 2px 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.submis-status {
  &::before {
    content: '';
    display: inline-block;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    margin-right: 5px;
    vertical-align: middle;
  }
  &.finished {
    color: #09b66d;
    &::before {
      background-color: #09b66d;
    }
  }
  &.queued {
    color: #dece68;
    &::before {
      background-color: #dece68;
    }
  }
  &.failed {
    color: #e6595a;
    &::before {
      background-color: #e6595a;
    }
  }
  &.cancelled {
    color: #cdced4;
    &::before {
      background-color: #cdced4;
    }
  }
  &.running {
    color: #52f4d9;
    &::before {
      background-color: #52f4d9;
    }
  }
  &.submitted {
    color: #00b2ff;
    &::before {
      background-color: #00b2ff;
    }
  }
  &.resuming {
    color: #94a7fa;
    &::before {
      background-color: #94a7fa;
    }
  }
}
</style>
