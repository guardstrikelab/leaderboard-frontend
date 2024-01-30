<template>
  <el-select v-model="selectedTrackId" class="mb16" :placeholder="$t('submission.trackPH')" @change="handleChangeTrack" style="width: 300px">
    <el-option v-for="item in tracks" :key="item.id" :label="item.name" :value="item.id" />
  </el-select>
  <el-table :data="submissionList" stripe style="width: 100%">
    <el-table-column fixed type="index" label="#" width="60" :index="(i) => (i + 1).toString().padStart(2, '0')" />
    <el-table-column fixed prop="id" :label="$t('submission.submissionId')" width="130" />
    <el-table-column prop="status" :label="$t('submission.status')" width="100">
      <template #default="{ row }">
        <span :class="['submis-status', row.status]">{{ row.status?.charAt(0).toUpperCase() + row.status.slice(1) }}</span>
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
    <el-table-column prop="is_public" :label="$t('submission.showOnLeaderboard')" width="170">
      <template #default="{ row }">
        <el-switch
          v-model="row.is_public"
          size="small"
          :before-change="
            () => {
              return beforeChange(row);
            }
          " />
        <span class="ml8">{{ row.is_public ? $t('submission.public') : $t('submission.private') }}</span>
      </template>
    </el-table-column>
    <el-table-column fixed="right" :label="$t('operate')">
      <template #default="{ row }">
        <div class="flex">
          <el-tooltip class="box-item" effect="light" :content="$t('cancel')" placement="top-start">
            <span class="icon-button mr8" @click="cancelSubmis(row)">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-Cancel"></use>
              </svg>
            </span>
          </el-tooltip>
          <el-tooltip class="box-item" effect="light" :content="$t('submission.rerun')" placement="top-start" v-if="store.state.isHost === 1">
            <span class="icon-button mr8" @click="reRun(row)">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-load"></use>
              </svg>
            </span>
          </el-tooltip>
          <el-tooltip class="box-item" effect="light" :content="$t('submission.resume')" placement="top-start">
            <span class="icon-button" @click="resume(row)" :class="{ disabled: row.status !== 'failed' }">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-kaishi"></use>
              </svg>
            </span>
          </el-tooltip>
        </div>
      </template>
    </el-table-column>
  </el-table>

  <el-button link class="mt24" @click="loadMore" v-if="pager.total > pager.pageNum * pager.pageSize">
    <svg class="icon mr8" aria-hidden="true">
      <use xlink:href="#icon-load"></use>
    </svg>
    <span>{{ $t('loadMore') }}...</span>
  </el-button>
</template>

<script setup>
import { computed, onBeforeMount, onMounted, reactive, ref } from 'vue';
import { getSubmission, updateSubmission, updateSubmissionMeta, reRunSubmission, resumeSubmission } from '@/api/challenge';
import { formatTime, oaMessageBox } from '@/utils/tool';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';

const store = useStore();
const { t } = useI18n();
const props = defineProps({
  challengeId: [String, Number],
  allowCancel: Boolean,
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
  getSubmission(props.challengeId, selectedTrackId.value, { page: pager.pageNum }).then((res) => {
    pager.total = res.count;
    let result = res.results || [];
    submissionList.value = pager.pageNum === 1 ? result : submissionList.value.concat(result);
  });
};
const beforeChange = (row) => {
  return updateSubmission(props.challengeId, selectedTrackId.value, row.id, {
    is_public: !row.is_public,
  }).then((res) => {
    ElMessage.success(res.is_public ? t('submission.changeMade') + t('submission.public') : t('submission.changeMade') + t('submission.private'));
    return true;
  });
};
const cancelSubmis = (row) => {
  if (!props.allowCancel && row.status != 'submitted') {
    ElMessage.error(t('submission.notCancelled'));
    return;
  }
  oaMessageBox({
    title: t('cancel'),
    message: t('submission.sureCancelSubmission'),
  })
    .then(() => {
      updateSubmissionMeta(props.challengeId, row.id, { status: 'cancelled' }).then((res) => {
        ElMessage.success(t('submission.cancelSuccess'));
        handleChangeTrack();
      });
    })
    .catch(() => {});
};
const reRun = (row) => {
  reRunSubmission(row.id).then((res) => {
    handleChangeTrack();
  });
};

const resume = (row) => {
  resumeSubmission(row.id).then((res) => {
    handleChangeTrack();
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
