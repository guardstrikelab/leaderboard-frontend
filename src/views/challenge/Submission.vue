<template>
  <div class="title mb24">{{ $t('submission.guidelines') }}</div>
  <div class="mb24">
    <div v-html="guidelines" class="editor-content-view"></div>
  </div>

  <div v-if="!approved">
    <div class="title mb24">
      <span>{{ $t('submission.deregisterChallenge') }}:</span>
      <el-button type="primary" @click="deregister" class="ml16">{{ $t('submission.deregister') }}</el-button>
    </div>
    <div class="describe mb24">{{ $t('submission.notApproved') }}</div>
  </div>

  <template v-else>
    <div class="title mb24 mt32">{{ $t('submission.submission') }}</div>
    <div class="mb24">{{ $t('submission.selectPhase') }}</div>

    <div class="selected-bar btw mb16" v-if="curPhase.id">
      <div>
        <span class="label mr8">{{ $t('submission.todayRemain') }}:</span>
        <span class="value">{{ curPhase.max_submissions_per_day }}</span>
      </div>
      <div>
        <span class="label mr8">{{ $t('submission.monthRemain') }}:</span>
        <span class="value">{{ curPhase.max_submissions_per_month }}</span>
      </div>
      <div>
        <span class="label mr8">{{ $t('submission.totalRemain') }}:</span>
        <span class="value">{{ curPhase.max_submissions }}</span>
      </div>
    </div>
    <div class="selected-bar mb16" v-else>
      <span>—</span>
    </div>
    <div class="phase-box mb32" :class="{ more: phases.length > 1 }">
      <div class="phase-card" v-for="item in phases" :key="item" @click="handleSelect(item)">
        <div class="flex-between mb16">
          <div class="second-title">{{ item.name }}</div>
          <el-radio class="custom-radio" :model-value="curPhase.id" :label="item.id"></el-radio>
        </div>
        <div class="row mb16">
          <span class="label mr8">{{ $t('submission.startDate') }}:</span>
          <span class="value">{{ formatTime(item.start_date) }}</span>
        </div>
        <div class="row">
          <span class="label mr8">{{ $t('submission.endDate') }}:</span>
          <span class="value">{{ formatTime(item.end_date) }}</span>
        </div>
      </div>
    </div>
    <div v-if="curPhase.id">
      <div class="title mb24">{{ $t('submission.instruction') }}</div>
      <div class="instr_con mb32">
        <div class="subTitle mb16">1. {{ $t('submission.install') }}</div>
        <div class="flex-center mb24">
          <span class="command ellipsis">$ {{ commandTxt1 }}</span>
          <span class="copy ml16" v-copyText="{ txt: commandTxt1, msg: $t('submission.copySuccess') }">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-copy"></use>
            </svg>
          </span>
        </div>

        <div class="subTitle mb16">2. {{ $t('submission.addToken') }}</div>
        <div class="flex-center mb24">
          <span class="command ellipsis">$ {{ commandTxt2 }}</span>
          <span class="copy ml16" v-copyText="{ txt: commandTxt2, msg: $t('submission.copySuccess') }">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-copy"></use>
            </svg>
          </span>
        </div>
        <div class="subTitle mb16">3. {{ $t('submission.submission') }}</div>
        <div class="flex-center mb24">
          <span class="command ellipsis">$ {{ commandTxt3 }}</span>
          <span class="copy ml16" v-copyText="{ txt: commandTxt3, msg: $t('submission.copySuccess') }">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-copy"></use>
            </svg>
          </span>
        </div>
        <div class="subTitle mb24">4. {{ $t('submission.flagTxt') }}</div>
        <div class="subTitle flex-center">
          <span> 5. {{ $t('submission.forMore') }}</span>
          <el-link type="primary" :underline="false" class="ml5" href="https://github.com/guardstrikelab/arena-cli" target="_blank">
            {{ $t('submission.referDocument') }}
          </el-link>
        </div>
      </div>
    </div>

    <div class="title mb24">{{ $t('submission.list') }}</div>
    <el-select v-model="selectedPhaseId" class="mb16" :placeholder="$t('submission.phasePH')" @change="handleChangePhase" style="width: 300px">
      <el-option v-for="item in phases" :key="item.id" :label="item.name" :value="item.id" />
    </el-select>
    <el-table :data="submissionList" stripe style="width: 100%">
      <el-table-column fixed type="index" label="#" width="50" :index="(i) => (i + 1).toString().padStart(2, '0')" />
      <el-table-column prop="status" :label="$t('submission.status')">
        <template #default="{ row }">
          <span :class="['submis-status', row.status]">{{ row.status?.charAt(0).toUpperCase() + row.status.slice(1) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="execution_time" :label="$t('submission.executTime')" width="160" />
      <!-- <el-table-column prop="input_file" :label="$t('submission.submittedFile')">
        <template #default="{ row }">
          <el-link type="primary" v-if="row.input_file" :href="row.input_file" target="_blank">Link</el-link>
          <span v-else>-</span>
        </template>
      </el-table-column> -->
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
</template>

<script setup>
import { computed, onBeforeMount, onMounted, reactive, ref } from 'vue';
import { getSubmission, updateSubmission, updateSubmissionMeta, reRunSubmission, resumeSubmission } from '@/api/challenge';
import { formatTime, oaMessageBox } from '@/utils/tool';
import { getJwtToken } from '@/utils/auth';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';

const store = useStore();
const { t } = useI18n();
const props = defineProps({
  challengeId: [String, Number],
  approved: Boolean,
  allowCancel: Boolean,
  guidelines: {
    type: String,
    default: '',
  },
  phases: {
    type: Array,
    default: [],
  },
});
const emit = defineEmits(['callback']);
const curPhase = ref({});
const handleSelect = (item) => {
  curPhase.value = item;
};
onMounted(() => {
  if (props.phases.length > 0) {
    curPhase.value = props.phases[0];
  }
});

const commandTxt1 = 'pip install arena-cli';
const commandTxt2 = `arena set_token ${getJwtToken()}`;
const commandTxt3 = computed(() => {
  return `arena push <image>:<tag> --phase ${curPhase.value.slug}`;
});
const deregister = () => {
  emit('callback');
};

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
  getSubmission(props.challengeId, selectedPhaseId.value, { page: pager.pageNum }).then((res) => {
    pager.total = res.count;
    let result = res.results || [];
    submissionList.value = pager.pageNum === 1 ? result : submissionList.value.concat(result);
  });
};
const beforeChange = (row) => {
  return updateSubmission(props.challengeId, selectedPhaseId.value, row.id, {
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
        handleChangePhase();
      });
    })
    .catch(() => {});
};
const reRun = (row) => {
  reRunSubmission(row.id).then((res) => {
    handleChangePhase();
  });
};

const resume = (row) => {
  resumeSubmission(row.id).then((res) => {
    handleChangePhase();
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
