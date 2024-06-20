<template>
  <div class="container">
    <div class="container-main mb24">
      <div class="title">{{ ruleForm.title }}</div>
      <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        :rules="rules"
        label-width="200px"
        label-position="top"
        size="default"
        status-icon
        hide-required-asterisk>
        <el-form-item :label="$t('addTrack.name')" prop="name">
          <el-input v-model="ruleForm.name" maxlength="100" />
        </el-form-item>
        <el-form-item :label="$t('addChall.desc')" prop="description">
          <editor v-model="ruleForm.description"></editor>
        </el-form-item>
        <el-form-item>
          <div class="flex-between" style="width: 100%">
            <el-form-item :label="$t('addTrack.startDate')" prop="start_date" required>
              <el-date-picker
                v-model="ruleForm.start_date"
                type="datetime"
                placeholder="Select date and time"
                value-format="YYYY-MM-DDTHH:mm:ssZ"
                style="width: 500px" />
            </el-form-item>
            <el-form-item :label="$t('addTrack.endDate')" prop="end_date" required>
              <el-date-picker
                v-model="ruleForm.end_date"
                type="datetime"
                placeholder="Select date and time"
                value-format="YYYY-MM-DDTHH:mm:ssZ"
                style="width: 500px" />
            </el-form-item>
          </div>
        </el-form-item>
        <el-form-item :label="$t('addTrack.codename')" prop="codename" required>
          <el-input v-model="ruleForm.codename" maxlength="100" />
        </el-form-item>
        <el-form-item :label="$t('addTrack.maxSubmiPerDay')" prop="max_submissions_per_day" required>
          <el-input v-model="ruleForm.max_submissions_per_day" maxlength="32" />
        </el-form-item>
        <el-form-item :label="$t('addTrack.maxSubmiPerMonth')" prop="max_submissions_per_month" required>
          <el-input v-model="ruleForm.max_submissions_per_month" maxlength="32" />
        </el-form-item>
        <el-form-item :label="$t('addTrack.maxSubmissions')" prop="max_submissions" required>
          <el-input v-model="ruleForm.max_submissions" maxlength="32" />
        </el-form-item>
        <el-form-item prop="metrics" label="Metrics">
          <div class="flex-center">
            <Vue3JsonEditor
              id="json-editor"
              style="width: 800px"
              mode="code"
              v-model="ruleForm.metrics"
              :show-btns="false"
              :expandedOnStart="true"
              @json-change="onJsonChange"
              @has-error="onError"
            />
          </div>
        </el-form-item>
        <el-form-item prop="leaderboard_public">
          <span class="inline-title">{{ $t('addTrack.lbPublic') }}</span>
          <el-switch v-model="ruleForm.leaderboard_public" size="small" />
          <span class="note ml16">
            <svg class="icon" aria-hidden="true" style="font-size: 12px">
              <use xlink:href="#icon-zhushi"></use>
            </svg>
            {{ $t('addTrack.isLeaderboardPublicNote') }}
          </span>
        </el-form-item>
        <el-form-item prop="is_public">
          <span class="inline-title">{{ $t('addTrack.isPublic') }}</span>
          <el-switch v-model="ruleForm.is_public" size="small" />
          <span class="note ml16">
            <svg class="icon" aria-hidden="true" style="font-size: 12px">
              <use xlink:href="#icon-zhushi"></use>
            </svg>
            {{ $t('addTrack.isTrackPublicNote') }}
          </span>
        </el-form-item>
        <el-form-item prop="is_submission_public">
          <span class="inline-title">{{ $t('addTrack.isSubmiPublic') }}</span>
          <el-switch v-model="ruleForm.is_submission_public" size="small" />
          <span class="note ml16">
            <svg class="icon" aria-hidden="true" style="font-size: 12px">
              <use xlink:href="#icon-zhushi"></use>
            </svg>
            {{ $t('addTrack.isSubmissionDefaultPublicNote') }}
          </span>
        </el-form-item>
        <el-form-item prop="is_restricted_to_select_one_submission">
          <span class="inline-title">{{ $t('addTrack.isRestrictedToSelectOneSubmission') }}</span>
          <el-switch v-model="ruleForm.is_restricted_to_select_one_submission" size="small" />
        </el-form-item>
        <el-form-item class="hidden" prop="is_partial_submission_evaluation_enabled">
          <span class="inline-title">{{ $t('addTrack.isPartialSubmissionEvaluationEnabled') }}</span>
          <el-switch v-model="ruleForm.is_partial_submission_evaluation_enabled" size="small" />
        </el-form-item>
        <!-- <el-form-item :label="$t('addTrack.allowedSubmissionFileTypes')" prop="allowed_submission_file_types" required>
          <el-input v-model="ruleForm.allowed_submission_file_types" placeholder="eg: .json, .zip" />
        </el-form-item> -->
      </el-form>
    </div>
    <el-button style="width: 180px; border-radius: 2px" type="primary" @click="submitForm(ruleFormRef)">
      {{ ruleForm.id ? $t('save') : $t('create') }}
    </el-button>
    <el-button style="width: 180px; border-radius: 2px" @click="cancelForm()">{{ $t('cancel') }}</el-button>
  </div>
</template>

<script setup>
import Editor from '@/components/Editor.vue';
import { onBeforeUnmount, ref, shallowRef, onMounted, reactive } from 'vue';
import { createTrack, getTrackDetail } from '@/api/host';
import { getChallengeDetail } from '@/api/challenge';
import { useRouter } from 'vue-router';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { Vue3JsonEditor } from 'vue3-json-editor'

const route = useRoute();
const { t } = useI18n();
const router = useRouter();
const metrics_json_has_error = ref(false)
const ruleForm = reactive({
  id: undefined,
  name: '',
  description: '',
  leaderboard_public: false,
  is_public: true,
  is_submission_public: true,
  start_date: '',
  end_date: '',
  test_annotation_file: '',
  codename: '',
  max_submissions_per_day: '',
  max_submissions_per_month: '',
  max_submissions: '',
  is_restricted_to_select_one_submission: false,
  is_partial_submission_evaluation_enabled: true,
  allowed_submission_file_types: '',
  metrics: {
    "labels":
    [
        "Metric name 1",
        "Metric name 2",
        "Metric name 3",
        "Metric name 4",
        "Metric name 5"
    ],
    "metadata":
    {
        "Metric name 1":
        {
            "description": "description1"
        },
        "Metric name 2":
        {
            "description": "description1"
        },
        "Metric name 3":
        {
            "description": "description1"
        },
        "Metric name 4":
        {
            "description": "description1"
        }
    },
    "default_order_by": "Driving score"
  }
});

const ruleFormRef = ref();

const validatehtml = (rule, value, callback) => {
  if (!value || value == `<p><br></p>`) {
    callback(new Error(rule.field + ' is required'));
  } else {
    callback();
  }
};
const onJsonChange = (value) => {
  metrics_json_has_error.value = false
  ruleForm.metrics = value 
}
const onError = (value) => {
  metrics_json_has_error.value = true
  console.log(value)
}
const validate_metrics = (rule, value, callback) => {
  if (metrics_json_has_error.value){
    callback(new Error('invalid json metrics! Please check web console for details.'));
  } else if(!value.hasOwnProperty("labels") ){
    callback(new Error(rule.field + ' has no `labels` found'));
  } else if(!value.hasOwnProperty("default_order_by") ){
    callback(new Error(rule.field + ' has no `default_order_by` found'));
  } else {
    callback();
  }
};
const rules = reactive({
  name: [
    { required: true, message: 'title is required', trigger: 'blur' },
    { min: 3, max: 100, message: 'Length should be 3 to 100', trigger: 'blur' },
  ],
  description: [{ validator: validatehtml, trigger: 'blur' }],
  evaluation_details: [{ validator: validatehtml, trigger: 'blur' }],
  terms_and_conditions: [{ validator: validatehtml, trigger: 'blur' }],
  submission_guidelines: [{ validator: validatehtml, trigger: 'blur' }],
  leaderboard_description: [{ validator: validatehtml, trigger: 'blur' }],
  metrics: [{ validator: validate_metrics, trigger: 'blur' }],
  max_submissions_per_day: [{ pattern: /^-?\d+(\.\d+)?$/, message: 'Enter numbers only', trigger: 'blur' }],
  max_submissions_per_month: [{ pattern: /^-?\d+(\.\d+)?$/, message: 'Enter numbers only', trigger: 'blur' }],
  max_submissions: [{ pattern: /^-?\d+(\.\d+)?$/, message: 'Enter numbers only', trigger: 'blur' }],
});

const submitForm = async (formEl) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      createTrack(route.params.challengeId, {
        id: ruleForm.id,
        name: ruleForm.name,
        description: ruleForm.description,
        leaderboard_public: ruleForm.leaderboard_public,
        is_public: ruleForm.is_public,
        is_submission_public: ruleForm.is_submission_public,
        start_date: ruleForm.start_date,
        end_date: ruleForm.end_date,
        test_annotation_file: ruleForm.test_annotation_file,
        codename: ruleForm.codename,
        max_submissions_per_day: parseInt(ruleForm.max_submissions_per_day),
        max_submissions_per_month: parseInt(ruleForm.max_submissions_per_month),
        max_submissions: parseInt(ruleForm.max_submissions),
        is_restricted_to_select_one_submission: ruleForm.is_restricted_to_select_one_submission,
        is_partial_submission_evaluation_enabled: ruleForm.is_partial_submission_evaluation_enabled,
        metrics: ruleForm.metrics,
        // allowed_submission_file_types: ruleForm.allowed_submission_file_types,
      }).then((res) => {
        ElMessage.success(ruleForm.id !== undefined ? t('addTrack.updateSuccess') : t('addTrack.createSuccess'));
        router.push('/host');
      });
    }
  });
};

const cancelForm = () => {
  router.push('/host');
};

onMounted(() => {
  if (route.params.challengeId !== undefined) {
    getChallengeDetail(route.params.challengeId).then((res) => {
      ruleForm.title = res.title;
    });
  }
  if (route.params.trackId !== undefined) {
    getTrackDetail(route.params.challengeId, route.params.trackId).then((res) => {
      ruleForm.name = res.name;
      ruleForm.description = res.description;
      ruleForm.leaderboard_public = res.leaderboard_public;
      ruleForm.is_public = res.is_public;
      ruleForm.is_submission_public = res.is_submission_public;
      ruleForm.start_date = res.start_date;
      ruleForm.end_date = res.end_date;
      ruleForm.test_annotation_file = res.test_annotation_file;
      ruleForm.codename = res.codename;
      ruleForm.max_submissions_per_day = res.max_submissions_per_day;
      ruleForm.max_submissions_per_month = res.max_submissions_per_month;
      ruleForm.max_submissions = res.max_submissions;
      ruleForm.is_restricted_to_select_one_submission = res.is_restricted_to_select_one_submission;
      ruleForm.is_partial_submission_evaluation_enabled = res.is_partial_submission_evaluation_enabled;
      ruleForm.allowed_submission_file_types = res.allowed_submission_file_types;
      ruleForm.metrics = res.metrics
      ruleForm.id = res.id;
    });
  }
});
</script>

<style lang="scss" scoped>
.container {
  width: 1200px;
  margin: 0 auto;

  .container-main {
    padding: 32px 40px 24px 40px;
    background: #292f3a;
    border-radius: 4px 4px 4px 4px;
    border: 1px solid #424e61;
    .title {
      height: 18px;
      font-size: 18px;
      font-family: Helvetica, Helvetica;
      font-weight: 700;
      color: #ffffff;
      line-height: 18px;
      text-align: center;
      margin-bottom: 36px;
    }
    .inline-title {
      margin-right: 20px;
      min-width: 260px;
      display: inline-block;
    }
    .note {
      color: #7f889a;
      font-size: 12px;
    }
    .hidden {
      visibility: hidden;
    }
    ::v-deep {
      .jsoneditor-poweredBy {
          display: none !important;
      }
      div.jsoneditor-outer {
          height: 300px;
      }
      div.jsoneditor-menu {
          background-color: #12171f00;
          border: 1px solid #424e61;
      }
      div.jsoneditor-modes {
        visibility: hidden;
      }
      div.jsoneditor {
          border: 1px solid #000;
      }
    }
    #json-editor > div.jsoneditor {
      border: 1px solid #424e61;
      .jsoneditor-menu {
        background-color: #12171f00;
      }
    }
  }
}
</style>
