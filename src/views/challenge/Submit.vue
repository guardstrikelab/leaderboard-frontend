<template>
  <el-collapse :model-value="['1', '2']" class="oa-collapse">
    <el-collapse-item :title="$t('submission.guidelines')" name="1">
      <div v-html="guidelines" class="editor-content-view"></div>
      <div v-if="!approved" class="mt24">
        <div class="title mb24">
          <span>{{ $t('submission.deregisterChallenge') }}:</span>
          <el-button type="primary" @click="deregister" class="ml16">{{ $t('submission.deregister') }}</el-button>
        </div>
        <div class="describe mb24">{{ $t('submission.notApproved') }}</div>
      </div>
    </el-collapse-item>
    <el-collapse-item :title="$t('submission.submission')" name="2" v-if="approved">
      <div class="mb24">{{ $t('submission.selectTrack') }}</div>
      <div class="selected-bar btw mb16" v-if="curTrack.id">
        <div>
          <span class="label mr8">{{ $t('submission.todayRemain') }}:</span>
          <span class="value">{{ curTrack.max_submissions_per_day }}</span>
        </div>
        <div>
          <span class="label mr8">{{ $t('submission.monthRemain') }}:</span>
          <span class="value">{{ curTrack.max_submissions_per_month }}</span>
        </div>
        <div>
          <span class="label mr8">{{ $t('submission.totalRemain') }}:</span>
          <span class="value">{{ curTrack.max_submissions }}</span>
        </div>
      </div>
      <div class="selected-bar mb16" v-else>
        <span>—</span>
      </div>
      <div class="track-box mb32" :class="{ more: tracks.length > 1 }">
        <div class="track-card" v-for="item in tracks" :key="item" @click="handleSelect(item)">
          <div class="flex-between mb16">
            <div class="second-title">{{ item.name }}</div>
            <el-radio class="custom-radio" :model-value="curTrack.id" :label="item.id"></el-radio>
          </div>
          <div class="row mb16">
            <span class="label mr8">{{ $t('submission.startDate') }}:</span>
            <span class="value">{{ formatTime(item.start_date) }}</span>
          </div>
          <div class="row">
            <span class="label mr8">{{ $t('submission.endDate') }}:</span>
            <span class="value">{{ formatTime(item.end_date) }}</span>
          </div>
        </div>
      </div>
      <div class="mb24">{{ $t('submission.instruction') }}</div>
      <div class="instr_con mb16">
        <div class="subTitle mb16">1. {{ $t('submission.install') }}</div>
        <div class="flex-center mb24">
          <span class="command ellipsis">$ {{ commandTxt1 }}</span>
          <span class="copy ml16" v-copyText="{ txt: commandTxt1, msg: $t('submission.copySuccess') }">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-copy"></use>
            </svg>
          </span>
        </div>

        <div class="subTitle mb16">2. {{ $t('submission.addToken') }}</div>
        <div class="flex-center mb24">
          <span class="command ellipsis">$ {{ commandTxt2 }}</span>
          <span class="copy ml16" v-copyText="{ txt: commandTxt2, msg: $t('submission.copySuccess') }">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-copy"></use>
            </svg>
          </span>
        </div>
        <div class="subTitle mb16">3. {{ $t('submission.submission') }}</div>
        <div class="flex-center mb24">
          <span class="command ellipsis">$ {{ commandTxt3 }}</span>
          <span class="copy ml16" v-copyText="{ txt: commandTxt3, msg: $t('submission.copySuccess') }">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-copy"></use>
            </svg>
          </span>
        </div>
        <div class="subTitle mb24">4. {{ $t('submission.flagTxt') }}</div>
        <div class="subTitle flex-center">
          <span> 5. {{ $t('submission.forMore') }}</span>
          <el-link type="primary" :underline="false" class="ml5" href="https://github.com/guardstrikelab/arena-cli" target="_blank">
            {{ $t('submission.referDocument') }}
          </el-link>
        </div>
      </div>
    </el-collapse-item>
  </el-collapse>
</template>

<script setup>
import { computed, onBeforeMount, onMounted, reactive, ref } from 'vue';
import { formatTime } from '@/utils/tool';
import { getJwtToken } from '@/utils/auth';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';

const store = useStore();
const { t } = useI18n();
const props = defineProps({
  challengeId: [String, Number],
  approved: Boolean,
  allowCancel: Boolean,
  guidelines: {
    type: String,
    default: '',
  },
  tracks: {
    type: Array,
    default: [],
  },
});
const emit = defineEmits(['callback']);
const curTrack = ref({});
const handleSelect = (item) => {
  curTrack.value = item;
};
onMounted(() => {
  if (props.tracks.length > 0) {
    curTrack.value = props.tracks[0];
  }
});

const commandTxt1 = 'pip install arena-cli';
const commandTxt2 = `arena set_token ${getJwtToken()}`;
const commandTxt3 = computed(() => {
  return `arena push <image>:<tag> --track ${curTrack.value.slug}`;
});
const deregister = () => {
  emit('callback');
};
</script>

<style lang="scss" scoped>
.title {
  font-weight: 700;
}
.describe {
  line-height: 21px;
}
.selected-bar {
  height: 48px;
  background: #2a335e;
  border-radius: 4px 4px 4px 4px;
  border: 1px solid #4562e3;
  padding: 0 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  &.btw {
    justify-content: space-between;
  }
  .value {
    font-size: 20px;
    font-weight: 700;
    line-height: 20px;
  }
}
.track-box {
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 24px 20px;
  &.more {
    grid-template-columns: repeat(2, 1fr);
  }
  .track-card {
    height: 123px;
    background: #282f3b;
    border-radius: 2px 2px 2px 2px;
    border: 1px solid #404b64;
    padding: 24px 24px 24px 35px;
    cursor: pointer;
    .row {
      height: 14px;
      font-weight: 700;
    }
  }
}
.instr_con {
  padding-left: 24px;
}
.command {
  height: 32px;
  background: #282f3b;
  border-radius: 2px 2px 2px 2px;
  border: 1px solid #404b64;
  padding: 8px;
  display: inline-block;
  max-width: 80%;
}
.copy {
  width: 32px;
  height: 32px;
  background: #404b64;
  border-radius: 2px 2px 2px 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
</style>
