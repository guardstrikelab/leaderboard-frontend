<template>
  <div class="logo">
    <img src="@/assets/images/logo.png" alt />
  </div>

  <template v-if="status === 1">
    <div class="restext">{{ $t('reset.restext') }}</div>
    <div class="auth-submit-btn" @click="goLogin">{{ $t('reset.login') }}</div>
  </template>
  <template v-else>
    <div class="greet">{{ $t('greeting') }}</div>
    <el-form
      ref="inputForm"
      :model="form"
      :rules="rules"
      class="auth-form"
      label-position="top"
      :validate-on-rule-change="false"
      require-asterisk-position="right">
      <el-form-item :label="$t('reset.setpw')" prop="password">
        <el-input
          class="input-item"
          type="password"
          v-model.trim="form.password"
          :placeholder="$t('reset.passwordPH')"
          @keypress.enter="validateForm"
          maxlength="32"
          show-password></el-input>
      </el-form-item>
      <el-form-item :label="$t('reset.confirmpw')" prop="confirmpw">
        <el-input
          class="input-item"
          type="password"
          v-model.trim="form.confirmpw"
          :placeholder="$t('reset.confirmpwPH')"
          @keypress.enter="validateForm"
          maxlength="32"
          show-password></el-input>
      </el-form-item>
      <div class="auth-submit-btn" @click="validateForm">{{ $t('reset.submit') }}</div>
    </el-form>
    <div class="center">
      <a style="color: #ffffff" href="/auth/signup">{{ $t('reset.goSingup') }}</a>
    </div>
  </template>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';
import { resetConfirm } from '@/api/user';

const store = useStore();
const router = useRouter();
const route = useRoute();
const { t, locale } = useI18n();
const status = ref(0);

const form = reactive({
  username: '',
  password: '',
});

const validatePass = (rule, value, callback) => {
  if (value !== form.password) {
    callback(new Error(t('reset.confirmpwVerify1')));
  } else {
    callback();
  }
};

const rules = reactive({
  password: [
    { required: true, message: t('reset.passwordVerify1'), trigger: 'blur' },
    { pattern: /^.{6,}$/, message: t('reset.passwordVerify2'), trigger: 'blur' },
    { pattern: /^([A-Za-z\d]|[`\-=[\]\\;,./~!@#$%^&*()_+{}|:"<>?])+$/, message: '请输入英文字母、数字或英文符号', trigger: 'blur' },
  ],
  confirmpw: [
    { required: true, message: t('reset.passwordVerify1'), trigger: 'blur' },
    { validator: validatePass, trigger: 'blur' },
  ],
});

const inputForm = ref();
const validateForm = () => {
  inputForm.value.validate((valid) => {
    if (valid) {
      submit();
    }
  });
};
const submit = () => {
  resetConfirm({
    new_password1: form.password,
    new_password2: form.confirmpw,
    token: route.params.token,
    uid: route.params.uid,
  }).then((res) => {
    status.value = 1;
    ElMessage.success(res.detail);
  });
};
const goLogin = () => {
  router.push('/auth/login');
};
</script>

<style lang="scss" scoped>
.logo {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
}
.greet {
  margin-bottom: 32px;
}
.restext {
  margin-top: 68px;
  margin-bottom: 68px;
}

.center {
  text-align: center;
}
</style>
