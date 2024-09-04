<template>
  <j-page-container>
    <a-row :gutter="24">
      <a-col :span="14">
        <BootCard
            :cardData="deviceBootConfig"
            cardTitle="视频中心引导"
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
            cardTitle="设备接入推荐步骤"
            tooltip="不同的设备因为通信协议的不同，存在接入步骤的差异"
            :dataList="deviceStepDetails"
        />
      </a-col>
    </a-row>

    <!-- 选择设备 -->
    <a-modal
        title="选择设备"
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
          model="table"
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
import {onlyMessage} from '@/utils/comm';

import bottom6 from '../../assets/home/bottom-6.png'
import bottom7 from '../../assets/home/bottom-7.png'
import bottom8 from '../../assets/home/bottom-8.png'
import {useAuthStore} from "@/store";

const menuStory = useMenuStore();

// 权限控制
const { hasPermission } = useAuthStore();

const deviceBootConfig: bootConfig[] = [
  {
    english: 'STEP1',
    label: '添加视频设备',
    link: 'media/Device/Save',
    auth: hasPermission('media/Device:add'),
  },
  {
    english: 'STEP2',
    label: '分屏展示',
    link: 'media/SplitScreen',
  },
  {
    english: 'STEP3',
    label: '国标级联',
    link: 'media/Cascade',
  },
];

const deviceStepDetails: recommendList[] = [
  {
    title: '添加视频设备',
    details: '根据视频设备的传输协议，在已创建的产品下添加对应的设备。',
    iconUrl: bottom6,
    linkUrl: 'media/Device/Save',
    auth: hasPermission('media/Device:add'),
  },
  {
    title: '查看通道',
    details: '查看设备下的通道数据，可以进行直播、录制等操作。',
    iconUrl: bottom7,
    linkUrl: 'media/Device/Channel',
    linkUrl: '',
    auth: hasPermission('media/Device:view'),
    onClick: (row: any) => {
      if (hasPermission('media/Device:view')) {
        visible.value = true;
      } else {
        onlyMessage('暂无权限，请联系管理员', 'warning');
      }
    },
  },
  {
    title: '分屏展示',
    details: '对多个通道的视频流数据进行分屏展示。',
    iconUrl: bottom8,
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
    title: '名称',
    dataIndex: 'name',
    key: 'name',
    ellipsis: true,
    search: {
      type: 'string',
      first: true,
    },
  },
  {
    title: '通道数量',
    dataIndex: 'channelNumber',
    key: 'channelNumber',
    width: 100,
    scopedSlots: true,
  },
  {
    title: '状态',
    dataIndex: 'state',
    key: 'state',
    scopedSlots: true,
    search: {
      type: 'select',
      options: [
        {label: '在线', value: 'online'},
        {label: '离线', value: 'offline'},
        {label: '禁用', value: 'notActive'}
      ],
      handleValue: (v: any) => {
        return v;
      },
    },
    width: 80
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
    onlyMessage('请选择设备', 'warning');
  }
};
</script>
