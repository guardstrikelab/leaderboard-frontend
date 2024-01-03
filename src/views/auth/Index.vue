<template>
  <div class="container">
    <div class="operation">
      <!-- <lang-select></lang-select> -->
    </div>
    <main>
      <router-view />
    </main>
  </div>
</template>

<script setup>
import LangSelect from '@/components/LangSelect.vue';
</script>

<style lang="scss" scoped>
.container {
  width: 100vw;
  height: 100vh;
  min-width: 900px;
  background-image: url('@/assets/images/login_bg.png');
  background-position: center;
  background-size: cover;
  .operation {
    position: absolute;
    top: 23px;
    right: 60px;
  }
  main {
    width: 400px;
    position: absolute;
    right: 15.63%;
    top: 50%;
    transform: translateY(-50%);
    min-height: 300px;
  }
}
</style>
