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
    <el-form-item :label="$t('login.username')" prop="username">
      <el-input v-model.trim="form.username" :placeholder="$t('login.usernamePH')" class="input-item" maxlength="150"></el-input>
    </el-form-item>
    <el-form-item :label="$t('login.password')" prop="password">
      <el-input
        class="input-item"
        type="password"
        v-model.trim="form.password"
        :placeholder="$t('login.passwordPH')"
        @keypress.enter="validateForm"
        maxlength="128"
        show-password></el-input>
    </el-form-item>
    <!-- <el-form-item style="margin-top: 18px">
      <el-checkbox label="记住密码" name="type" v-model="pwdSave"></el-checkbox>
    </el-form-item> -->
    <div class="pointer" @click="forgetPassword">{{ $t('login.forgotpw') }}</div>
    <div class="auth-submit-btn" @click="validateForm">{{ $t('login.login') }}</div>
  </el-form>
  <div class="center">
    <a style="color: #ffffff" href="/auth/signup">{{ $t('login.goSingup') }}</a>
  </div>
</template>

<script setup>
import { onMounted, ref, reactive } from 'vue';
import { encrypt, decrypt } from '@/utils/jsencrypt';
import { useI18n } from 'vue-i18n';
import { useRouter, useRoute } from 'vue-router';
import { useStore } from 'vuex';

const store = useStore();
const { t } = useI18n();
const router = useRouter();
const route = useRoute();

const form = reactive({
  username: '',
  password: '',
});

const rules = reactive({
  username: [
    { required: true, message: t('login.usernameVerify1'), trigger: 'blur' },
    { pattern: /^.{3,}$/, message: t('login.usernameVerify2'), trigger: 'blur' },
  ],
  password: [
    { required: true, message: t('login.passwordVerify1'), trigger: 'blur' },
    { pattern: /^.{8,}$/, message: t('login.passwordVerify2'), trigger: 'blur' },
  ],
});

const pwdSave = ref(false);
const inputForm = ref();
const validateForm = () => {
  inputForm.value.validate((valid) => {
    if (valid) {
      submit();
    }
  });
};
const submit = () => {
  if (pwdSave.value) {
    setSave(form.username, form.password);
  } else {
    clearSave();
  }
  const loading = ElLoading.service();
  store
    .dispatch('login', {
      username: form.username,
      password: form.password,
    })
    .then((res) => {
      loading.close();
      router.push(route.query.redirect || '/challenge');
    })
    .catch((error) => {
      loading.close();
    });
};
const setSave = (name, pwd) => {
  const text = encrypt(name + ':' + pwd);
  localStorage.setItem('save', text);
};
const getSave = () => {
  let save = localStorage.getItem('save');
  if (!save) return;
  let text = decrypt(save);
  form.username = text.split(':')[0];
  form.password = text.split(':')[1];
  pwdSave.value = true;
};
const clearSave = () => {
  localStorage.removeItem('save');
};
const forgetPassword = () => {
  router.push('/auth/forget');
};

onMounted(() => {
  getSave();
});
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
