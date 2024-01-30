<template>
  <el-select v-model="selectedTrackId" class="mb16" :placeholder="$t('submission.trackPH')" @change="handleChangeTrack" style="width: 360px">
    <el-option v-for="item in tracks" :key="item.id" :label="item.name" :value="item.id" />
  </el-select>
  <el-table :data="submissionList" stripe style="width: 100%">
    <el-table-column fixed type="index" label="#" width="50" :index="(i) => (i + 1).toString().padStart(2, '0')" />
    <el-table-column fixed prop="participant_team" :label="$t('submission.team')" width="240"> </el-table-column>
    <el-table-column prop="created_by" :label="$t('submission.createdBy')" width="130"> </el-table-column>
    <el-table-column prop="status" :label="$t('submission.status')" width="100">
      <template #default="{ row }">
        <span :class="['submis-status', row.status]">{{ row.status.charAt(0).toUpperCase() + row.status.slice(1) }}</span>
      </template>
    </el-table-column>
    <el-table-column prop="execution_time" :label="$t('submission.executTime')" width="180" />
    <el-table-column prop="submission_result_file" :label="$t('submission.resultFile')" width="100">
      <template #default="{ row }">
        <el-link type="primary" v-if="row.submission_result_file" :href="row.submission_result_file" target="_blank">Link</el-link>
        <span v-else>-</span>
      </template>
    </el-table-column>
    <el-table-column prop="stdout_file" :label="$t('submission.stdoutFile')" width="100">
      <template #default="{ row }">
        <el-link type="primary" v-if="row.stdout_file" :href="row.stdout_file" target="_blank">Link</el-link>
        <span v-else>-</span>
      </template>
    </el-table-column>
    <el-table-column prop="stderr_file" :label="$t('submission.stderrFile')" width="100">
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
      "
      width="200" />
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
import { getAllSubmissions } from '@/api/challenge';
import { formatTime } from '@/utils/tool';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const props = defineProps({
  challengeId: [String, Number],
  tracks: {
    type: Array,
    default: [],
  },
});

onMounted(() => {
  if (props.tracks.length > 0) {
    selectedTrackId.value = props.tracks[0].id;
    getSubmissionList();
  }
});

const selectedTrackId = ref('');
const pager = reactive({
  total: 0,
  pageNum: 1,
  pageSize: 10,
});
const submissionList = ref([]);
const handleChangeTrack = () => {
  pager.pageNum = 1;
  getSubmissionList();
};
const getSubmissionList = () => {
  getAllSubmissions(props.challengeId, selectedTrackId.value, { page: pager.pageNum }).then((res) => {
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
