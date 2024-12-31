<template>
  <j-page-container>
    <a-row :gutter="24">
      <a-col :span="14">
        <BootCard
            :cardData="deviceBootConfig"
            :cardTitle="$t('Home.index.010851-0')"
        />
      </a-col>
      <a-col :span="10">
        <BasicCountCard/>
      </a-col>
      <a-col :span="24" style="margin: 20px 0">
        <PlatformPicCard/>
      </a-col>
      <a-col :span="24">
        <StepCard
            :cardTitle="$t('Home.index.010851-1')"
            :tooltip="$t('Home.index.010851-2')"
            :dataList="deviceStepDetails"
        />
      </a-col>
    </a-row>

    <!-- {{ $t('Home.index.010851-3') }} -->
    <a-modal
        :title="$t('Home.index.010851-3')"
        width="850px"
        v-model:visible="visible"
        :maskClosable="false"
        :destroyOnClose="true"
        @cancel="visible = false"
        @ok="handleSubmit"
    >
      <j-advanced-search
          type="simple"
          :columns="columns"
          @search="handleSearch"
      />
      <JProTable
          ref="tableRef"
          mode="table"
          rowKey="id"
          :columns="columns"
          :request="deviceApi.list"
          :defaultParams="{
                    sorts: [{ name: 'createTime', order: 'desc' }],
                }"
          :params="params"
          :rowSelection="{
                    type: 'radio',
                    selectedRowKeys: deviceItem?.id
                        ? [deviceItem.id]
                        : undefined,
                    onSelect: (record: any) => {
                        deviceItem = record;
                    }
                }"
          :alertRender="false"
      >
        <template #channelNumber="slotProps">
          <span>{{ slotProps.channelNumber || 0 }}</span>
        </template>
        <template #state="slotProps">
          <a-space>
            <a-badge
                :status="
                                slotProps.state.value === 'online'
                                    ? 'success'
                                    : 'error'
                            "
                :text="slotProps.state.text"
            />
          </a-space>
        </template>
      </JProTable>
    </a-modal>
  </j-page-container>
</template>

<script setup lang="ts">
import BootCard from '../../components/BootCard.vue';
import PlatformPicCard from '../../components/PlatformPicCard.vue';
import StepCard from '../../components/StepCard.vue';
import BasicCountCard from './components/BasicCountCard.vue';

import type {bootConfig, recommendList} from './typings';

import deviceApi from '../../api/device';

import {useMenuStore} from '@/store/menu';
import { onlyMessage } from '@jetlinks-web/utils';
import {homeImg} from "../../assets/home/index";
import {useAuthStore} from "@/store";
import i18n from '@/locales/index'
const $t = i18n.global.t
const menuStory = useMenuStore();

// 权限控制
const {hasPermission} = useAuthStore();

const deviceBootConfig: bootConfig[] = [
  {
    english: 'STEP1',
    label: $t('Home.index.010851-4'),
    link: 'media/Device/Save',
    auth: hasPermission('media/Device:add'),
  },
  {
    english: 'STEP2',
    label: $t('Home.index.010851-5'),
    link: 'media/SplitScreen',
  },
  {
    english: 'STEP3',
    label: $t('Home.index.010851-6'),
    link: 'media/Cascade',
  },
];

const deviceStepDetails: recommendList[] = [
  {
    title: $t('Home.index.010851-4'),
    details: $t('Home.index.010851-7'),
    iconUrl: homeImg.bottom6,
    linkUrl: 'media/Device/Save',
    auth: hasPermission('media/Device:add'),
  },
  {
    title: $t('Home.index.010851-8'),
    details: $t('Home.index.010851-9'),
    iconUrl: homeImg.bottom7,
    linkUrl: 'media/Device/Channel',
    linkUrl: '',
    auth: hasPermission('media/Device:view'),
    onClick: (row: any) => {
      if (hasPermission('media/Device:view')) {
        visible.value = true;
      } else {
        onlyMessage($t('Home.index.010851-10'), 'warning');
      }
    },
  },
  {
    title: $t('Home.index.010851-5'),
    details: $t('Home.index.010851-11'),
    iconUrl: homeImg.bottom8,
    linkUrl: 'media/SplitScreen',
  },
];

// 选择设备
const visible = ref(false);
const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    ellipsis: true,
    search: {
      type: 'string',
      defaultTermType: 'eq',
    },
  },
  {
    title: $t('Home.index.010851-12'),
    dataIndex: 'name',
    key: 'name',
    ellipsis: true,
    search: {
      type: 'string',
      first: true,
    },
  },
  {
    title: $t('Home.index.010851-13'),
    dataIndex: 'channelNumber',
    key: 'channelNumber',
    width: 100,
    ellipsis: true,
    scopedSlots: true,
  },
  {
    title: $t('Home.index.010851-14'),
    dataIndex: 'state',
    key: 'state',
    scopedSlots: true,
    search: {
      type: 'select',
      options: [
        {label: $t('Home.index.010851-15'), value: 'online'},
        {label: $t('Home.index.010851-16'), value: 'offline'},
        {label: $t('Home.index.010851-17'), value: 'notActive'}
      ],
      handleValue: (v: any) => {
        return v;
      },
    },
    width: 100
  },
];
const params = ref<Record<string, any>>({});

/**
 * 搜索
 * @param params
 */
const handleSearch = (e: any) => {
  params.value = e;
};

const deviceItem = ref();
const handleSubmit = () => {
  if (deviceItem.value && deviceItem.value.id) {
    menuStory.jumpPage(
        'media/Device/Channel',
        {},
        {
          id: deviceItem.value.id,
          type: deviceItem.value.provider,
        },
    );
  } else {
    onlyMessage($t('Home.index.010851-18'), 'warning');
  }
};
</script>
