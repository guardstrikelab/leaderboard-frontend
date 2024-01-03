<template>
  <template v-if="status == 1">
    <div class="logo">
      <img src="@/assets/images/logo.png" alt />
    </div>
    <div>{{ $t('forget.restext') }}</div>
    <div class="auth-submit-btn" @click="goBack">{{ $t('forget.backloginTxt') }}</div>
  </template>
  <template v-else>
    <div class="top">
      <div class="title">{{ $t('forget.title') }}</div>
      <div class="operation">
        <a href="/auth/login">{{ $t('forget.backlogin') }}</a>
      </div>
    </div>
    <div class="greet">{{ $t('forget.prompt') }}</div>
    <el-form
      ref="inputForm"
      :model="form"
      :rules="rules"
      class="auth-form"
      label-position="top"
      :validate-on-rule-change="false"
      require-asterisk-position="right"
      @submit.prevent>
      <el-form-item :label="$t('forget.email')" prop="email">
        <el-input
          v-model.trim="form.email"
          :placeholder="$t('forget.emailPH')"
          class="input-item"
          maxlength="70"
          @keypress.enter="validateForm"></el-input>
      </el-form-item>
      <div class="auth-submit-btn" @click="validateForm">{{ $t('forget.submit') }}</div>
    </el-form>
  </template>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { passwReset } from '@/api/user';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

const router = useRouter();
const { t } = useI18n();
const status = ref(0);

const form = reactive({
  email: '',
});

const rules = reactive({
  email: [{ type: 'email', required: true, message: t('forget.emailVerify1'), trigger: 'blur' }],
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
  passwReset({
    email: form.email,
  })
    .then((res) => {
      status.value = 1;
    })
    .finally((res) => {
      loading.close();
    });
};

const goBack = () => {
  router.push('/auth/login');
};
</script>

<style lang="scss" scoped>
.top {
  width: 100%;
  margin-bottom: 24px;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  .title {
    font-size: 32px;
    line-height: 32px;
  }
  a {
    color: #fff;
  }
}

.logo {
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
