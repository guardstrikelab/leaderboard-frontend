<template>
  <div class="container">
    <div class="title mb24">{{ $t('host.ChallList') }}</div>

    <div class="flex-between mb16">
      <div class="flex-center">
        <el-input v-model="searchValue" :placeholder="$t('search')" clearable style="width: 240px" @keyup.enter="search" @clear="search">
          <template #prefix>
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-Search"></use>
            </svg>
          </template>
        </el-input>
        <el-tag
          v-if="multipleSelection.length > 0"
          class="ml16 custom-selected-tag"
          size="large"
          type="info"
          closable
          style="border-radius: 3px"
          @close="clearSelection">
          已选择{{ multipleSelection.length }}项
        </el-tag>
        <el-button v-if="multipleSelection.length > 0" type="danger" class="ml16" @click="batchDelete()">
          <svg class="icon mr8" aria-hidden="true">
            <use xlink:href="#icon-Delete"></use>
          </svg>
          批量删除
        </el-button>
      </div>
      <el-button type="primary" class="ml16" @click="creatChallenge">
        <svg class="icon mr8" aria-hidden="true" style="font-size: 12px">
          <use xlink:href="#icon-chuangjian"></use>
        </svg>
        {{ $t('addChall.createChall') }}
      </el-button>
    </div>

    <el-table
      :data="challengeList"
      stripe
      style="width: 100%"
      ref="multipleTableRef"
      header-cell-class-name="thBg"
      @expand-change="expandChange"
      row-key="id"
      @selection-change="handleSelectionChange">
      <!-- <el-table-column type="selection" width="55" /> -->
      <el-table-column type="expand">
        <template #default="props">
          <div class="expand-panel">
            <div class="title mb16">Challenge Tracks：</div>
            <el-table :data="props.row.trackList" :show-header="false">
              <el-table-column label="Name" prop="name" width="250" />
              <el-table-column label="Description" prop="description">
                <template #default="{ row }">
                  <div v-html="row.description"></div>
                </template>
              </el-table-column>
              <el-table-column :label="$t('operate')" width="100">
                <template #default="{ row }">
                  <div class="flex">
                    <el-tooltip class="box-item" effect="light" :content="$t('edit')" placement="top-start">
                      <span class="icon-button" @click="eidtTrack(props.row, row)">
                        <svg class="icon" aria-hidden="true">
                          <use xlink:href="#icon-bianji"></use>
                        </svg>
                      </span>
                    </el-tooltip>
                    <el-tooltip class="box-item" effect="light" :content="$t('delete')" placement="top-start">
                      <span class="icon-button" @click="deleteTrack(props.row, row)">
                        <svg class="icon" aria-hidden="true">
                          <use xlink:href="#icon-Delete"></use>
                        </svg>
                      </span>
                    </el-tooltip>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </template>
      </el-table-column>

      <el-table-column prop="id" label="ID" width="100" />
      <el-table-column prop="title" :label="$t('host.title')">
        <template #default="{ row }">
          <div class="underline" @click="$router.push(`/host/challenge/${row.id}`)">{{ row.title }}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="start_date"
        :label="$t('host.startDate_utc')"
        :formatter="
          (row) => {
            return formatTime(row.start_date);
          }
        " />
      <el-table-column
        prop="end_date"
        :label="$t('host.endDate_utc')"
        :formatter="
          (row) => {
            return formatTime(row.end_date);
          }
        " />
      <el-table-column prop="creator" :label="$t('host.creator')" width="150">
        <template #default="{ row }">
          <span>{{ row.creator?.created_by }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="published" :label="$t('host.publicyAvailable')" width="150">
        <template #default="{ row }">
          <span class="round-status success" v-if="row.published">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-xuanzhe"></use>
            </svg>
          </span>
          <span class="round-status error" v-else>
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-qingchu"></use>
            </svg>
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="is_registration_open" :label="$t('host.isRegistrationOpen')" width="150">
        <template #default="{ row }">
          <span class="round-status success" v-if="row.is_registration_open">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-xuanzhe"></use>
            </svg>
          </span>
          <span class="round-status error" v-else>
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-qingchu"></use>
            </svg>
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="enable_forum" :label="$t('host.enableForum')" width="150">
        <template #default="{ row }">
          <span class="round-status success" v-if="row.enable_forum">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-xuanzhe"></use>
            </svg>
          </span>
          <span class="round-status error" v-else>
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-qingchu"></use>
            </svg>
          </span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('operate')" width="150">
        <template #default="{ row }">
          <div class="flex">
            <el-tooltip class="box-item" effect="light" :content="$t('edit')" placement="top-start">
              <span class="icon-button" @click="eidtChallenge(row)">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-bianji"></use>
                </svg>
              </span>
            </el-tooltip>
            <el-tooltip class="box-item" effect="light" :content="$t('host.createTracks')" placement="top-start">
              <span class="icon-button" @click="creatTrack(row)">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-a-HostedChallenge"></use>
                </svg>
              </span>
            </el-tooltip>
            <el-tooltip class="box-item" effect="light" :content="$t('delete')" placement="top-start">
              <span class="icon-button" @click="deleteChallenge(row)">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-Delete"></use>
                </svg>
              </span>
            </el-tooltip>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      hide-on-single-page
      background
      layout="prev, pager, next"
      :total="pager.total"
      v-model:page-size="pager.pageSize"
      v-model:current-page="pager.pageNum"
      @size-change="getList"
      @current-change="getList"
      class="mt24 oa-pagination" />
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { getAllChallenges, delChallenge, delTrack } from '@/api/host';
import { challengeTrack } from '@/api/challenge';
import { formatTime } from '@/utils/tool';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const router = useRouter();
const creatChallenge = () => {
  router.push('/host/challenge/add');
};

onMounted(() => {
  getList();
});

/* --------------- 列表相关 ---------------- */
const searchValue = ref('');
const challengeList = ref([]);
const pager = reactive({
  total: 0,
  pageNum: 1,
  pageSize: 10,
});
const search = () => {
  pager.pageNum = 1;
  getList();
};
const multipleSelection = ref([]);
const handleSelectionChange = (val) => {
  multipleSelection.value = val;
};
const multipleTableRef = ref();
const clearSelection = () => {
  multipleTableRef.value.clearSelection();
};
const pagerChange = (e) => {
  getList();
};
const getList = () => {
  const loading = ElLoading.service();
  getAllChallenges('all', 'all', 'all', {
    page: pager.pageNum,
    title: searchValue.value,
  })
    .then((res) => {
      let resData = res.results || [];
      resData.forEach((item) => {
        item.trackList = [];
        item.loadTracks = false;
      });
      challengeList.value = resData;
      pager.total = res.count;
    })
    .finally((res) => {
      loading.close();
    });
};

const eidtChallenge = (row) => {
  router.push(`/host/challenge/edit/${row.id}`);
};

const creatTrack = (row) => {
  router.push(`/host/track/add/${row.id}`);
};

const deleteChallenge = (row) => {
  delChallenge(row.id).then((res) => {
    ElMessage.success(t('host.deleteSuccess'));
    getList();
  });
};
const batchDelete = () => {};

const eidtTrack = (challengeRow, trackRow) => {
  router.push(`/host/track/edit/${challengeRow.id}/${trackRow.id}`);
};
const deleteTrack = (challengeRow, trackRow) => {
  delTrack(challengeRow.id, trackRow.id).then((res) => {
    ElMessage.success(t('host.trackDeleteSuccess'));
    challengeTrack(challengeRow.id).then((res) => {
      challengeRow.trackList = res.results || [];
      challengeRow.loadTracks = true;
    });
  });
};
const expandChange = (row, expandedRows) => {
  if (!row.loadTracks) {
    challengeTrack(row.id).then((res) => {
      row.trackList = res.results || [];
      row.loadTracks = true;
    });
  }
};
</script>

<style lang="scss" scoped>
.container {
  .title {
    font-weight: 700;
  }
  .round-status {
    display: flex;
    width: 16px;
    height: 16px;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    font-size: 10px;
    &.success {
      background: #52f4d9;
      color: #fff;
    }
    &.error {
      background: #e6595a;
      color: #333333;
    }
  }
  .expand-panel {
    padding: 16px 50px 16px 80px;
    .title {
      font-size: 14px;
      font-weight: 700;
      color: #ffffff;
      line-height: 14px;
      text-indent: 10px;
    }
  }
  :deep(.el-table__expand-icon) {
    content: url('@/assets/images/shouqi.png') !important;
    height: 15px;
    padding: 1px;
    & > .el-icon {
      display: none !important;
    }
  }
  .underline {
    text-decoration: underline;
    cursor: pointer;
  }
}
</style>
