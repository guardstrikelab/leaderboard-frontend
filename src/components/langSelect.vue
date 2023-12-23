<template>
  <el-dropdown popper-class="more-dropdown" style="vertical-align: middle" placement="bottom-end" @command="handleSetLanguage">
    <div class="pointer">
      <svg class="icon mr8" aria-hidden="true">
        <use xlink:href="#icon-yuyan"></use>
      </svg>
      <span>{{ locale === 'zh' ? $t('lang.chinese') : $t('lang.english') }}</span>
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item command="zh" :class="{ active: locale === 'zh' }">
          <span>{{ $t('lang.chinese') }}</span>
          <svg class="icon ml20" aria-hidden="true" v-if="locale === 'zh'">
            <use xlink:href="#icon-xuanzhe"></use>
          </svg>
        </el-dropdown-item>
        <el-dropdown-item command="en" :class="{ active: locale === 'en' }">
          <span>{{ $t('lang.english') }}</span>
          <svg class="icon ml20" aria-hidden="true" v-if="locale === 'en'">
            <use xlink:href="#icon-xuanzhe"></use>
          </svg>
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup>
import Cookies from 'js-cookie';
import { useI18n } from 'vue-i18n';
const { locale } = useI18n();

const handleSetLanguage = (lang) => {
  if (lang !== locale.value) {
    locale.value = lang;
    Cookies.set('language', lang);
    location.reload();
  }
};
</script>
