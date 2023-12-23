<template>
  <div class="logo">
    <img src="@/assets/images/logo.png" alt />
  </div>
  <div class="txt">{{ $t('permission.emailVerifiedSuccess') }}</div>
  <div class="auth-submit-btn" @click="goBack">{{ $t('login.login') }}</div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const goBack = () => {
  router.push('/auth/login');
};
</script>

<style lang="scss" scoped>
.logo {
  margin-bottom: 68px;
}
.txt {
  margin-bottom: 68px;
}
.center {
  text-align: center;
}
</style>
