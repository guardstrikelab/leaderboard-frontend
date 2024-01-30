<template>
  <div class="common-layout">
    <el-container>
      <el-header>
        <top-nav></top-nav>
      </el-header>
      <el-container>
        <!-- 侧边栏 -->
        <el-aside :width="isCollapse ? '71px' : '232px'" class="small-scrollbar" v-if="store.state.token">
          <el-menu :default-active="activeSecondMenu" :collapse="isCollapse" router>
            <el-menu-item index="/challenge">
              <span class="icon-btn">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-Challenge"></use>
                </svg>
              </span>
              <template #title>{{ $t('challenge.challenge') }} </template>
            </el-menu-item>
            <el-menu-item index="/team">
              <span class="icon-btn">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-Team"></use>
                </svg>
              </span>
              <template #title>{{ $t('team.team') }}</template>
            </el-menu-item>
            <el-menu-item index="/host" v-if="store.state.isHost === 1">
              <span class="icon-btn">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-a-HostedChallenge"></use>
                </svg>
              </span>
              <template #title>{{ $t('host.hostchall') }}</template>
            </el-menu-item>
          </el-menu>

          <span class="icon-button toggle-btn" @click="toggleCollapse">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-shouqi1"></use>
            </svg>
          </span>
        </el-aside>

        <!-- 主体内容 -->
        <el-main :style="{ padding: store.state.token ? '24px' : '0 0 24px' }">
          <el-scrollbar>
            <breadcrumb class="mb24" v-if="route.meta?.showcrumb && store.state.token"></breadcrumb>
            <router-view v-slot="{ Component }">
              <keep-alive :include="getCachedComponentNames()">
                <component :is="Component"></component>
              </keep-alive>
            </router-view>
          </el-scrollbar>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import Breadcrumb from '@/components/Breadcrumb.vue';
import TopNav from '@/components/TopNav.vue';
import { useStore } from 'vuex';
import { verifyHostUser } from '@/api/host';

const route = useRoute();
const router = useRouter();
const store = useStore();
const isCollapse = ref(false);
const activeSecondMenu = computed(() => {
  const { meta, path } = route;
  if (meta && meta.activeMenu) {
    return meta.activeMenu;
  }
  return path;
});

const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value;
};

// 获取所有需要缓存的组件
const getCachedComponentNames = () => {
  const cachedComponents = [];
  for (const record of router.getRoutes()) {
    if (record.meta && record.meta.keepAlive) {
      cachedComponents.push(record.name);
    }
  }
  return cachedComponents;
};
onMounted(() => {
  if (store.state.token && store.state.isHost !== 0 && store.state.isHost !== 1) {
    store.dispatch('verifyHostUser');
  }
});
</script>

<style lang="scss" scoped>
.common-layout {
  background: linear-gradient(90deg, #131922 0%, #262b33 100%);
}
.el-header {
  background-color: #12171f;
}
.el-aside {
  height: calc(100vh - 60px);
  box-sizing: border-box;
  overflow-y: auto;
  padding: 16px 8px;
  position: relative;
  transition: 0.4s;
  overflow-x: hidden;
  border-right: 1px solid #434d60;
  .el-menu {
    --el-menu-icon-width: 24px;
    border: none;
    background-color: transparent;
    &.el-menu--collapse {
      --el-menu-base-level-padding: 15px;
      .el-menu-item {
        .icon-btn {
          margin-right: 0px;
        }
      }
    }
    .el-menu-item {
      height: 40px;
      margin-bottom: 8px;
      color: #ffffff;
      border-radius: 4px;
      .icon-btn {
        margin-right: 16px;
      }
      &.is-active {
        background-color: #353e4e;
        .icon-btn {
          background-color: var(--el-color-primary);
        }
      }
    }
  }
  .toggle-btn {
    position: absolute;
    bottom: 20px;
    left: 19px;
  }
}

.el-main {
  height: calc(100vh - 60px);
  box-sizing: border-box;
}
</style>
