<template>
  <div class="logo">
    <img src="@/assets/images/logo.png" alt />
  </div>
  <div class="greet">{{ $t('greeting') }}</div>
  <el-form
    ref="inputForm"
    :model="form"
    :rules="rules"
    class="auth-form"
    label-position="top"
    :validate-on-rule-change="false"
    require-asterisk-position="right">
    <el-form-item :label="$t('signup.username')" prop="username">
      <el-input v-model.trim="form.username" :placeholder="$t('signup.usernamePH')" class="input-item" maxlength="150"></el-input>
    </el-form-item>
    <el-form-item :label="$t('signup.email')" prop="email">
      <el-input v-model.trim="form.email" :placeholder="$t('signup.emailPH')" type="email" class="input-item" maxlength="70"></el-input>
    </el-form-item>
    <el-form-item :label="$t('signup.password')" prop="password">
      <el-input
        class="input-item"
        type="password"
        v-model.trim="form.password"
        :placeholder="$t('signup.passwordPH')"
        @keypress.enter="validateForm"
        maxlength="128"
        show-password></el-input>
    </el-form-item>
    <el-form-item :label="$t('signup.confirmpw')" prop="confirmpw">
      <el-input
        class="input-item"
        type="password"
        v-model.trim="form.confirmpw"
        :placeholder="$t('signup.confirmpwPH')"
        @keypress.enter="validateForm"
        maxlength="128"
        show-password></el-input>
    </el-form-item>
    <div class="auth-submit-btn" @click="validateForm">{{ $t('signup.signup') }}</div>
  </el-form>
  <div class="center">
    <a style="color: #ffffff" href="/auth/login">{{ $t('signup.goLogin') }}</a>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

const store = useStore();
const router = useRouter();
const { t, locale } = useI18n();

const form = reactive({
  username: '',
  password: '',
  confirmpw: '',
  email: '',
});

const validatePass = (rule, value, callback) => {
  if (value !== form.password) {
    callback(new Error(t('signup.confirmpwVerify1')));
  } else {
    callback();
  }
};

const rules = reactive({
  username: [
    { required: true, message: t('signup.usernameVerify1'), trigger: 'blur' },
    { pattern: /^.{3,}$/, message: t('signup.usernameVerify2'), trigger: 'blur' },
  ],
  email: [
    { required: true, message: t('signup.emailVerify1'), trigger: 'blur' },
    { type: 'email', message: t('signup.emailVerify2'), trigger: 'blur' },
  ],
  password: [
    { required: true, message: t('signup.passwordVerify1'), trigger: 'blur' },
    { pattern: /^.{8,}$/, message: t('signup.passwordVerify2'), trigger: 'blur' },
  ],
  confirmpw: [
    { required: true, message: t('signup.passwordVerify1'), trigger: 'blur' },
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
  const loading = ElLoading.service();
  store
    .dispatch('signUp', {
      username: form.username,
      password1: form.password,
      password2: form.confirmpw,
      email: form.email,
    })
    .then((res) => {
      loading.close();
      ElMessage.success(t('signup.registerSuccess'));
      router.push('/');
    })
    .catch((error) => {
      loading.close();
    });
};
</script>

<style lang="scss" scoped>
.logo {
  display: flex;
  margin-bottom: 24px;
}

.greet {
  margin-bottom: 32px;
  line-height: 1;
}

.center {
  text-align: center;
}
</style>
