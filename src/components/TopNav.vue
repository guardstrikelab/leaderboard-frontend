<template>
  <div class="page-top">
    <div class="top-left">
      <img alt="OASIS DATA" class="logo" src="../assets/images/logo.png" />
    </div>
    <div class="top-right">
      <!-- <lang-select></lang-select> -->
      <!-- <el-divider direction="vertical" style="border-color: #394253; height: 32px; margin: 0 24px" /> -->
      <el-popover
        v-if="store.state.token"
        ref="popperRef"
        popper-class="logout-popper"
        placement="bottom-end"
        :width="220"
        :offset="20"
        :show-arrow="false">
        <template #reference>
          <div class="flex-center">
            <el-avatar :size="32" :src="store.state.userInfo?.avatar || avatar" style="margin-right: 8px" />
            <span>{{ store.state.userInfo?.username ?? '' }}</span>
            <svg class="icon ml8" aria-hidden="true">
              <use xlink:href="#icon-jiantou"></use>
            </svg>
          </div>
        </template>

        <div>
          <div class="top mb8">
            <el-avatar :size="32" :src="store.state.userInfo?.avatar || avatar" style="margin-right: 8px" />
            <span>
              {{ store.state.userInfo?.username ?? '' }}
            </span>
          </div>
          <div @click="toUser" class="item mb8">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-Profile"></use>
            </svg>
            <span>{{ $t('user.profile') }}</span>
          </div>
          <div @click="handleLogout" class="item">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-a-Logout"></use>
            </svg>
            <span>{{ $t('user.logout') }}</span>
          </div>
        </div>
      </el-popover>
      <el-button v-else type="primary" @click="goLogin">{{ $t('login.login') }}</el-button>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';
import { logout } from '@/api/user';
import LangSelect from '@/components/LangSelect.vue';
import avatar from '@/assets/images/avatar.png';

const { t, locale } = useI18n();
const route = useRoute();
const router = useRouter();
const store = useStore();

let popperRef = ref();
let toUser = () => {
  router.push({ name: 'User' });
  popperRef.value.hide();
};
const handleLogout = () => {
  store.dispatch('logOut').then((res) => {
    ElMessage.success(res.detail);
    router.push('/');
  });
};

const goLogin = () => {
  router.push('/auth/login');
};
const changeLanguage = () => {
  locale.value = 'en';
  store.dispatch('setLanguage', 'en');
};
</script>
<style lang="scss" scoped>
.page-top {
  height: 100%;
  display: flex;
  justify-content: space-between;
  .top-left {
    display: flex;
    align-items: center;
    .logo {
      height: 32px;
      margin-right: 33px;
    }
    .fisrt-menu {
      height: 100%;
      --el-menu-bg-color: transparent;
      :deep(.el-menu-item) {
        font-weight: 700;
        &.is-active {
          border-bottom-width: 3px;
        }
      }
      & + .fisrt-menu {
        margin-left: 24px;
      }
    }
  }
  .top-right {
    display: flex;
    align-items: center;
    :deep(.el-input__wrapper) {
      background-color: rgba(255, 255, 255, 0.7);
    }
  }
}
</style>
