<template>
  <el-button text @click="goBack">
    <svg class="icon mr8" aria-hidden="true" style="font-size: 12px">
      <use xlink:href="#icon-Back"></use>
    </svg>
    {{ $t('back') }}
  </el-button>
  <div class="main">
    <div class="second-title">{{ $t('user.profile') }}</div>
    <div class="flex-between top">
      <div class="flex-center">
        <el-avatar :size="64" :src="avatar" style="margin: 0 40px" />
        <div>
          <div style="margin-bottom: 14px">{{ store.state.userInfo?.username }}</div>
          <div>{{ store.state.userInfo?.email }}</div>
        </div>
      </div>
      <div class="top-right">
        <el-progress type="circle" :percentage="percentage" :width="65" :stroke-width="7" color="#6D87F9" />
        <div style="margin-top: 12px">{{ $t('user.profileCompleted') }}</div>
      </div>
    </div>
    <div class="content">
      <div class="flex-between item">
        <div class="label">{{ $t('user.password') }}</div>
        <el-button plain @click="changePassword">{{ $t('user.changePassword') }}</el-button>
      </div>
      <div class="flex-between item">
        <div class="label">{{ $t('user.firstName') }}</div>
        <el-input v-model.trim="form.first_name" placeholder="-" maxlength="32"></el-input>
      </div>
      <div class="flex-between item">
        <div class="label">{{ $t('user.lastName') }}</div>
        <el-input v-model.trim="form.last_name" placeholder="-" maxlength="32"></el-input>
      </div>
      <div class="flex-between item">
        <div class="label">{{ $t('user.affilliate') }}</div>
        <el-input v-model.trim="form.affiliation" placeholder="-" maxlength="32"></el-input>
      </div>
      <div class="flex-between item">
        <div class="label">GITHUB</div>
        <el-input v-model.trim="form.github_url" placeholder="-" maxlength="32"></el-input>
      </div>
    </div>
    <div class="footer">
      <el-button type="primary" @click="save"> {{ $t('save') }} </el-button>
    </div>
  </div>

  <!-- 更改密码 -->
  <el-dialog
    v-model="passwordDialog.visible"
    :title="$t('user.changePassword')"
    width="500"
    class="oa-dialog"
    :close-on-click-modal="false"
    :close-on-press-escape="false">
    <el-form :model="passwordDialog" :rules="rules" ref="passwordRef" label-position="top" require-asterisk-position="right">
      <el-form-item :label="$t('user.oldPassword')" prop="old_password">
        <el-input
          type="password"
          v-model.trim="passwordDialog.old_password"
          :placeholder="$t('user.oldPasswordPH')"
          maxlength="32"
          show-password></el-input>
      </el-form-item>
      <el-form-item :label="$t('user.newPassword')" prop="new_password1">
        <el-input
          type="password"
          v-model.trim="passwordDialog.new_password1"
          :placeholder="$t('user.newPasswordPH')"
          maxlength="32"
          show-password></el-input>
      </el-form-item>
      <el-form-item :label="$t('user.confirmpw')" prop="new_password2">
        <el-input
          type="password"
          v-model.trim="passwordDialog.new_password2"
          :placeholder="$t('user.confirmpwPH')"
          maxlength="32"
          show-password
          @keypress.enter="passwordSubmit"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="between">
        <div></div>
        <div>
          <el-button @click="passwordDialog.visible = false" text bg>{{ $t('cancel') }}</el-button>
          <el-button type="primary" @click="passwordSubmit"> {{ $t('submit') }} </el-button>
        </div>
      </div>
    </template>
  </el-dialog>
</template>
<script setup>
import { computed, onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { getUser, updateUser, updatePassword } from '@/api/user';
import { useI18n } from 'vue-i18n';
import avatar from '@/assets/images/avatar.png';

const { t, locale } = useI18n();
const store = useStore();
const router = useRouter();
const goBack = () => {
  if (window.history.length > 1) {
    router.back();
  } else {
    router.push('/');
  }
};
const form = reactive({
  first_name: '',
  last_name: '',
  affiliation: '',
  github_url: '',
  google_scholar_url: '',
  linkedin_url: '',
});
const percentage = computed(() => {
  let value = 2;
  if (form.first_name) {
    value += 1;
  }
  if (form.last_name) {
    value += 1;
  }
  if (form.affiliation) {
    value += 1;
  }
  if (form.github_url) {
    value += 1;
  }
  return Math.round((100 * value) / 6);
});
const save = () => {
  updateUser({
    first_name: form.first_name,
    last_name: form.last_name,
    affiliation: form.affiliation,
    github_url: form.github_url,
    google_scholar_url: form.google_scholar_url,
    linkedin_url: form.linkedin_url,
  }).then((res) => {
    ElMessage.success(t('user.profileUpdatedSuccess'));
    queryUser();
  });
};
const queryUser = () => {
  getUser().then((res) => {
    form.first_name = res.first_name;
    form.last_name = res.last_name;
    form.affiliation = res.affiliation;
    form.github_url = res.github_url || '';
    form.google_scholar_url = res.google_scholar_url || '';
    form.linkedin_url = res.linkedin_url || '';
  });
};
onMounted(() => {
  queryUser();
});

const passwordDialog = reactive({
  visible: false,
  old_password: '',
  new_password1: '',
  new_password2: '',
});

const changePassword = () => {
  passwordDialog.visible = true;
};
const passwordRef = ref();
const passwordSubmit = () => {
  passwordRef.value.validate((valid) => {
    if (valid) {
      updatePassword({
        old_password: passwordDialog.old_password,
        new_password1: passwordDialog.new_password1,
        new_password2: passwordDialog.new_password2,
      }).then((res) => {
        ElMessage.success(t('user.pwChangeSuccess'));
        passwordDialog.visible = false;
      });
    }
  });
};

const validatePass = (rule, value, callback) => {
  if (value !== passwordDialog.new_password1) {
    callback(new Error(t('user.confirmpwVerify1')));
  } else {
    callback();
  }
};

const rules = reactive({
  old_password: [
    { required: true, message: t('user.oldPwVerify1'), trigger: 'blur' },
    { pattern: /^.{8,}$/, message: t('user.oldPwVerify2'), trigger: 'blur' },
  ],
  new_password1: [
    { required: true, message: t('user.newPwVerify1'), trigger: 'blur' },
    { pattern: /^.{8,}$/, message: t('user.oldPwVerify2'), trigger: 'blur' },
  ],
  new_password2: [{ validator: validatePass, trigger: 'blur' }],
});
</script>

<style lang="scss" scoped>
.main {
  width: 1000px;
  margin: 60px auto 0;
  .top {
    height: 130px;
    background: linear-gradient(87deg, rgba(51, 60, 113, 0.9412) 0%, #121732 100%);
    border-radius: 10px 10px 10px 10px;
    margin-top: 40px;
    margin-bottom: 24px;
    font-size: 16px;
    .top-right {
      font-size: 12px;
      color: #b1bacc;
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-right: 50px;
      :deep(.el-progress--circle) {
        .el-progress__text span {
          font-size: 16px;
          font-weight: 700;
          color: #6d87f9;
          line-height: 16px;
        }
      }
    }
  }
  .content {
    border-top: 1px solid #434d60;
    .item {
      height: 96px;
      border-bottom: 1px solid #434d60;
      padding: 0 16px;
      .el-input {
        width: 500px;
      }
    }
  }
  .footer {
    display: flex;
    justify-content: flex-end;
    padding: 40px 16px 24px;
  }
}

:deep(.el-form-item__error) {
  left: initial;
  right: 0;
  top: -26px;
}
</style>
