<template>
  <div></div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { getChallengeHomeDetail } from '@/api/challenge';

const router = useRouter();
getChallengeHomeDetail().then(
  (res) => {
    if (res?.id) {
      router.push(`/challenge/detail/${res.id}`);
    } else {
      router.push(`/challenge`);
    }
  },
  (err) => {
    router.push(`/challenge`);
  }
);
</script>

<style></style>
