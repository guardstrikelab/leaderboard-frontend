<template>
  <div class="container">
    <div class="container-main mb24">
      <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        :rules="rules"
        label-width="200px"
        label-position="top"
        size="default"
        status-icon
        hide-required-asterisk>
        <el-form-item :label="$t('addChall.title')" prop="title">
          <el-input v-model="ruleForm.title" />
        </el-form-item>
        <el-form-item :label="$t('addChall.shortDesc')" prop="short_description">
          <editor v-model="ruleForm.short_description"></editor>
        </el-form-item>
        <el-form-item :label="$t('addChall.desc')" prop="description">
          <editor v-model="ruleForm.description"></editor>
        </el-form-item>
        <el-form-item :label="$t('addChall.evaluation')" prop="evaluation_details">
          <editor v-model="ruleForm.evaluation_details"></editor>
        </el-form-item>
        <el-form-item :label="$t('addChall.termsConditions')" prop="terms_and_conditions">
          <editor v-model="ruleForm.terms_and_conditions"></editor>
        </el-form-item>
        <el-form-item :label="$t('addChall.image')" prop="image">
          <el-upload class="avatar-uploader" name="image" :show-file-list="false" :on-change="onFileChange" :auto-upload="false">
            <img v-if="ruleForm.image" :src="ruleForm.imageUrl || ruleForm.image" class="avatar" />
            <span v-else class="avatar-uploader-icon">
              <svg class="icon" style="font-size: 24px" aria-hidden="true">
                <use xlink:href="#icon-chuangjian"></use>
              </svg>
              <span class="mt24">{{ $t('addChall.imagePH') }}</span>
            </span>
          </el-upload>
        </el-form-item>

        <el-form-item :label="$t('addChall.SubmiGuide')" prop="submission_guidelines">
          <editor v-model="ruleForm.submission_guidelines"></editor>
        </el-form-item>
        <el-form-item :label="$t('addChall.lbDesc')" prop="leaderboard_description">
          <editor v-model="ruleForm.leaderboard_description"></editor>
        </el-form-item>
        <el-form-item :label="$t('addChall.startDate')">
          <div class="flex-between" style="width: 100%">
            <el-form-item prop="start_date" required>
              <el-date-picker
                v-model="ruleForm.start_date"
                type="datetime"
                placeholder="Select date and time"
                value-format="YYYY-MM-DDTHH:mm:ssZ"
                style="width: 300px" />
            </el-form-item>
            <el-form-item :label="$t('addChall.endDate')" prop="end_date" required>
              <el-date-picker
                v-model="ruleForm.end_date"
                type="datetime"
                placeholder="Select date and time"
                value-format="YYYY-MM-DDTHH:mm:ssZ"
                style="width: 300px" />
            </el-form-item>
          </div>
        </el-form-item>
        <el-form-item :label="$t('addChall.published')" prop="published">
          <radio-group v-model="ruleForm.published"></radio-group>
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
import { createChallenge } from '@/api/host';
import { getChallengeDetail } from '@/api/challenge';
import { useRouter } from 'vue-router';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const router = useRouter();
const route = useRoute();

const ruleForm = reactive({
  id: undefined,
  title: '',
  short_description: '',
  description: '',
  evaluation_details: '',
  terms_and_conditions: '',
  image: '',
  submission_guidelines: '',
  leaderboard_description: '',
  evaluation_script: '',
  remote_evaluation: false,
  is_docker_based: false,
  start_date: '',
  end_date: '',
  published: false,
});

const onFileChange = (uploadFile) => {
  if (!uploadFile.raw.type.startsWith('image/')) {
    ElMessage.error('Please select a picture!');
    return false;
  } else if (uploadFile.raw.size / 1024 / 1024 > 5) {
    ElMessage.error('Picture size can not exceed 5MB!');
    return false;
  }
  ruleForm.image = uploadFile.raw;
  ruleForm.imageUrl = URL.createObjectURL(uploadFile.raw);
};

const ruleFormRef = ref();

const validatehtml = (rule, value, callback) => {
  if (!value || value == `<p><br></p>`) {
    callback(new Error(rule.field + ' is required'));
  } else {
    callback();
  }
};

const rules = reactive({
  title: [
    { required: true, message: 'title is required', trigger: 'blur' },
    { min: 3, max: 100, message: 'Length should be 3 to 100', trigger: 'blur' },
  ],
  short_description: [{ validator: validatehtml, trigger: 'blur' }],
  description: [{ validator: validatehtml, trigger: 'blur' }],
  evaluation_details: [{ validator: validatehtml, trigger: 'blur' }],
  terms_and_conditions: [{ validator: validatehtml, trigger: 'blur' }],
  submission_guidelines: [{ validator: validatehtml, trigger: 'blur' }],
  leaderboard_description: [{ validator: validatehtml, trigger: 'blur' }],
});

const submitForm = async (formEl) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      let formData = new FormData();
      formData.append('title', ruleForm.title);
      formData.append('short_description', ruleForm.short_description);
      formData.append('description', ruleForm.description);
      formData.append('evaluation_details', ruleForm.evaluation_details);
      formData.append('terms_and_conditions', ruleForm.terms_and_conditions);
      formData.append('submission_guidelines', ruleForm.submission_guidelines);
      formData.append('leaderboard_description', ruleForm.leaderboard_description);
      formData.append('start_date', ruleForm.start_date);
      formData.append('end_date', ruleForm.end_date);
      formData.append('published', ruleForm.published);
      formData.append('image', ruleForm.image);
      if (ruleForm.id) {
        formData.append('id', ruleForm.id);
      }
      createChallenge(formData).then((res) => {
        ElMessage.success(ruleForm.id !== undefined ? t('addChall.updateSuccess') : t('addChall.createSuccess'));
        router.push('/host');
      });
    }
  });
};

const resetForm = (formEl) => {
  if (!formEl) return;
  formEl.resetFields();
};

const cancelForm = () => {
  router.push('/host');
};

onMounted(() => {
  if (route.params.challengeId !== undefined) {
    getChallengeDetail(route.params.challengeId).then((res) => {
      ruleForm.title = res.title;
      ruleForm.short_description = res.short_description;
      ruleForm.description = res.description;
      ruleForm.evaluation_details = res.evaluation_details;
      ruleForm.terms_and_conditions = res.terms_and_conditions;
      ruleForm.submission_guidelines = res.submission_guidelines;
      ruleForm.leaderboard_description = res.leaderboard_description;
      ruleForm.start_date = res.start_date;
      ruleForm.end_date = res.end_date;
      ruleForm.published = res.published;
      ruleForm.id = res.id;
      ruleForm.image = res.image;
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
    .avatar-uploader {
      :deep(.el-upload) {
        border-radius: 2px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        transition: var(--el-transition-duration-fast);
        img {
          max-width: 100%;
        }
      }
      .avatar-uploader-icon {
        width: 260px;
        height: 200px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        background: #343c4d;
        color: #7f889a;
        line-height: 12px;
      }
    }
  }
}
</style>
