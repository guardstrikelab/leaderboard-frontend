<template>
  <div class="fixPop">
    <div class="flex-center top">
      <svg class="icon mr20" aria-hidden="true" style="font-size: 24px">
        <use xlink:href="#icon-email"></use>
      </svg>
      <span>
        {{ isSended ? $t('permission.continueVerify') : $t('permission.verifyEmail') }}
      </span>
    </div>
    <div class="subTitle" v-html="isSended ? $t('permission.hasSent') : $t('permission.getEmailTxt')"></div>

    <el-button type="primary" class="fot-btn" @click="send" :disabled="loading" v-if="!isSended">
      {{ $t('permission.resendEmail') }}
    </el-button>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { emailVerification } from '@/api/account.js';
const { t } = useI18n();
const loading = ref(false);
const isSended = ref(false);

const send = () => {
  loading.value = true;
  emailVerification()
    .then((res) => {
      ElMessage.success(t('permission.sentAgain'));
      isSended.value = true;
    })
    .finally((res) => {
      loading.value = false;
    });
};
</script>

<style lang="scss" scoped>
.fixPop {
  width: 500px;
  height: 174px;
  box-shadow: 0px 10px 20px 0px rgba(0, 0, 0, 0.2);
  border-radius: 6px 6px 6px 6px;
  border: 1px solid #424e61;
  background: #292f3a url('@/assets/images/fixPop_bg.png') no-repeat left top;
  padding: 36px 30px 30px;
  position: relative;
  margin-top: 150px;
  margin-left: 360px;
  .top {
    margin-bottom: 20px;
    span {
      font-size: 16px;
    }
  }
  .subTitle {
    padding-left: 44px;
    line-height: 20px;
  }
  .fot-btn {
    position: absolute;
    bottom: 30px;
    right: 30px;
  }
}
</style>
