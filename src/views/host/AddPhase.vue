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
        <el-form-item :label="$t('addPhase.name')" prop="name">
          <el-input v-model="ruleForm.name" />
        </el-form-item>
        <el-form-item :label="$t('addChall.desc')" prop="description">
          <editor v-model="ruleForm.description"></editor>
        </el-form-item>
        <el-form-item :label="$t('addPhase.lbPublic')" prop="leaderboard_public">
          <radio-group v-model="ruleForm.leaderboard_public"></radio-group>
        </el-form-item>
        <el-form-item :label="$t('addPhase.isPublic')" prop="is_public">
          <radio-group v-model="ruleForm.is_public"></radio-group>
        </el-form-item>
        <el-form-item :label="$t('addPhase.isSubmiPublic')" prop="is_submission_public">
          <radio-group v-model="ruleForm.is_submission_public"></radio-group>
        </el-form-item>
        <el-form-item :label="$t('addPhase.startDate')">
          <div class="flex-between" style="width: 100%">
            <el-form-item prop="start_date" required>
              <el-date-picker
                v-model="ruleForm.start_date"
                type="datetime"
                placeholder="Select date and time"
                value-format="YYYY-MM-DDTHH:mm:ssZ"
                style="width: 300px" />
            </el-form-item>
            <el-form-item :label="$t('addPhase.endDate')" prop="end_date" required>
              <el-date-picker
                v-model="ruleForm.end_date"
                type="datetime"
                placeholder="Select date and time"
                value-format="YYYY-MM-DDTHH:mm:ssZ"
                style="width: 300px" />
            </el-form-item>
          </div>
        </el-form-item>
        <el-form-item :label="$t('addPhase.codename')" prop="codename" required>
          <el-input v-model="ruleForm.codename" />
        </el-form-item>
        <el-form-item :label="$t('addPhase.maxSubmiPerDay')" prop="max_submissions_per_day" required>
          <el-input v-model="ruleForm.max_submissions_per_day" />
        </el-form-item>
        <el-form-item :label="$t('addPhase.maxSubmiPerMonth')" prop="max_submissions_per_month" required>
          <el-input v-model="ruleForm.max_submissions_per_month" />
        </el-form-item>
        <el-form-item :label="$t('addPhase.maxSubmissions')" prop="max_submissions" required>
          <el-input v-model="ruleForm.max_submissions" />
        </el-form-item>
        <el-form-item :label="$t('addPhase.isRestrictedToSelectOneSubmission')" prop="is_restricted_to_select_one_submission">
          <radio-group v-model="ruleForm.is_restricted_to_select_one_submission"></radio-group>
        </el-form-item>
        <el-form-item :label="$t('addPhase.isPartialSubmissionEvaluationEnabled')" prop="is_partial_submission_evaluation_enabled">
          <radio-group v-model="ruleForm.is_partial_submission_evaluation_enabled"></radio-group>
        </el-form-item>
        <el-form-item :label="$t('addPhase.allowedSubmissionFileTypes')" prop="allowed_submission_file_types" required>
          <el-input v-model="ruleForm.allowed_submission_file_types" placeholder="eg: .json, .zip" />
        </el-form-item>
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
import RadioGroup from '@/components/RadioGroup.vue';
import { onBeforeUnmount, ref, shallowRef, onMounted, reactive } from 'vue';
import { createPhase, getPhaseDetail } from '@/api/host';
import { getChallengeDetail } from '@/api/challenge';
import { useRouter } from 'vue-router';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';

const route = useRoute();
const { t } = useI18n();
const router = useRouter();

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
  is_partial_submission_evaluation_enabled: false,
  allowed_submission_file_types: '',
});

const ruleFormRef = ref();

const validatehtml = (rule, value, callback) => {
  if (!value || value == `<p><br></p>`) {
    callback(new Error(rule.field + ' is required'));
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
  max_submissions_per_day: [{ pattern: /^-?\d+(\.\d+)?$/, message: 'Enter numbers only', trigger: 'blur' }],
  max_submissions_per_month: [{ pattern: /^-?\d+(\.\d+)?$/, message: 'Enter numbers only', trigger: 'blur' }],
  max_submissions: [{ pattern: /^-?\d+(\.\d+)?$/, message: 'Enter numbers only', trigger: 'blur' }],
});

const submitForm = async (formEl) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      createPhase(route.params.challengeId, {
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
        max_submissions_per_day: ruleForm.max_submissions_per_day,
        max_submissions_per_month: ruleForm.max_submissions_per_month,
        max_submissions: ruleForm.max_submissions,
        is_restricted_to_select_one_submission: ruleForm.is_restricted_to_select_one_submission,
        is_partial_submission_evaluation_enabled: ruleForm.is_partial_submission_evaluation_enabled,
        allowed_submission_file_types: ruleForm.allowed_submission_file_types,
      }).then((res) => {
        ElMessage.success(ruleForm.id !== undefined ? t('addPhase.updateSuccess') : t('addPhase.createSuccess'));
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
  if (route.params.phaseId !== undefined) {
    getPhaseDetail(route.params.challengeId, route.params.phaseId).then((res) => {
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
  }
}
</style>
