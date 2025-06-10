<!-- 视频设备-通道列表 -->
<template>
  <j-page-container>
    <div class="device-channel-warp">
      <Tree
          :deviceData="deviceData"
          :on-tree-load="(e) => (show = e)"
          :on-select="handleSelect"
      />
      <div class="right">
        <pro-search
            :columns="newColumns"
            target="channel"
            @search="handleSearch"
        />
        <FullPage>
          <JProTable
              ref="listRef"
              mode="table"
              :columns="newColumns"
              :request="(e:any) => ChannelApi.list(e, route?.query.id as string)"
              :defaultParams="{
                            sorts: [{ name: 'modifyTime', order: 'desc' }],
                        }"
              :params="params"
          >
            <template #headerLeftRender>
              <a-tooltip
                  v-if="
                                    ['gb28181-2016', 'onvif'].includes(
                                        route.query.type,
                                    )
                                "
                  :title="$t('Channel.index.5349818-0', [ route.query.type === 'onvif'
                                        ? 'Onvif'
                                        : 'GB/T28181'])"
              >
                <a-button type="primary" disabled>
                  {{ $t('Channel.index.5349818-1') }}
                </a-button>
              </a-tooltip>
              <j-permission-button
                  v-else
                  type="primary"
                  @click="handleAdd"
                  hasPermission="media/Device:add"
              >
                <AIcon type="PlusOutlined"/>
                {{ $t('Channel.index.5349818-1') }}
              </j-permission-button>
            </template>
            <template #headerRightRender>
              <j-permission-button
                  type="text"
                  :tooltip="{
                                    title:
                                        route?.query?.type === 'fixed-media'
                                            ? $t('Channel.index.5349818-2')
                                            : deviceData?.state?.value ===
                                              'offline'
                                            ? $t('Channel.index.5349818-3')
                                            : deviceData?.state?.value ===
                                              'notActive'
                                            ? $t('Channel.index.5349818-4')
                                            : $t('Channel.index.5349818-5'),
                                }"
                  :disabled="
                                    deviceData?.state?.value === 'offline' ||
                                    deviceData?.state?.value === 'notActive' ||
                                    route?.query?.type === 'fixed-media'
                                "
                  @click="refreshChanel"
              >
                <template #icon>
                  <AIcon
                      type="SyncOutlined"
                  />
                </template>
                {{ $t('Channel.index.5349818-5') }}
              </j-permission-button
              >
            </template>
            <template #status="slotProps">
              <a-space>
                <a-badge
                    :status="
                                        slotProps.status.value === 'online'
                                            ? 'success'
                                            : 'error'
                                    "
                    :text="slotProps.status.text"
                ></a-badge>
              </a-space>
            </template>
            <template #action="slotProps">
              <a-space :size="16">
                <template
                    v-for="i in getActions(slotProps, 'table')"
                    :key="i.key"
                >
                  <j-permission-button
                      v-if="
                        i.key !== 'play' &&
                        i.key !== 'backPlay' &&
                        i.key !== 'share' &&
                        i.key !== 'plan'
                      "
                      :danger="i.key === 'delete'"
                      :disabled="i.disabled"
                      :popConfirm="i.popConfirm"
                      :tooltip="{
                                            ...i.tooltip,
                                        }"
                      @click="i.onClick"
                      type="link"
                      style="padding: 3px"
                      :hasPermission="'media/Device:' + i.key"
                  >
                    <template #icon
                    >
                      <AIcon :type="i.icon"
                      />
                    </template>
                  </j-permission-button>
                  <!-- {{ $t('Channel.index.5349818-16') }}/播放不要权限控制 -->
                  <template v-else>
                    <a-tooltip
                        :key="i.key"
                        v-bind="i.tooltip"
                    >
                      <a-button
                          style="padding: 0px"
                          type="link"
                          @click="i.onClick &&i.onClick(slotProps)">
                        <a-button
                            :disabled="i.disabled"
                            style="padding: 0"
                            type="link"
                        >
                          <AIcon :type="i.icon"/>
                        </a-button>
                      </a-button>
                    </a-tooltip>
                  </template>
                </template>
              </a-space>
            </template>
          </JProTable>
        </FullPage>
      </div>
    </div>

    <Save
        v-model:visible="saveVis"
        :channelData="channelData"
        @submit="listRef.reload()"
    />
    <Live
        v-model:visible="playerVis"
        :data="playData"
        @refresh="listRef.reload()"
    />
    <VideoShare
        v-if="visible"
        @close="visible = false"
        :data="channelData"
    />
    <Plan
        v-if="planVis"
        :data="channelData"
        @close="planVis = false"
        :type="planType"
    />
  </j-page-container>
</template>

<script setup lang="ts">
import ChannelApi from '../../../api/channel';
import {useMenuStore} from '@/store/menu';
import Save from './Save.vue';
import Live from './Live/index.vue';
import Tree from './Tree/index.vue';
import {cloneDeep} from 'lodash-es';
import {onlyMessage} from '@jetlinks-web/utils';
import DeviceApi from '../../../api/device';
import VideoShare from './VideoShare/index.vue';
import Plan from './Plan/index.vue';
import {useI18n} from 'vue-i18n';

const {t: $t} = useI18n();
const menuStory = useMenuStore();
const route: any = useRoute();

const columns = [
  {
    title: $t('Channel.index.5349818-6'),
    dataIndex: 'channelId',
    key: 'channelId',
    ellipsis: true,
    search: {
      type: 'string',
    },
  },
  {
    title: $t('Channel.index.5349818-7'),
    dataIndex: 'name',
    key: 'name',
    ellipsis: true,
    search: {
      type: 'string',
      first: true,
    },
  },
  {
    title: $t('Channel.index.5349818-8'),
    dataIndex: 'manufacturer',
    key: 'manufacturer',
    ellipsis: true,
  },
  {
    title: $t('Channel.index.5349818-9'),
    dataIndex: 'address',
    ellipsis: true,
    key: 'address',
    search: {
      type: 'string',
    },
  },
  {
    title: $t('Channel.index.5349818-10'),
    dataIndex: 'status',
    key: 'status',
    scopedSlots: true,
    width: 150,
    search: {
      type: 'select',
      options: [
        {label: $t('Channel.index.5349818-11'), value: 'online'},
        {label: $t('Channel.index.5349818-12'), value: 'offline'},
      ],
      handleValue: (v: any) => {
        return v;
      },
    },
  },
  {
    title: $t('Channel.index.5349818-13'),
    key: 'action',
    width: 280,
    scopedSlots: true,
  },
];

const newColumns = computed(() => {
  if (route.query.type === 'fixed-media') {
    return columns.filter((item) => item.key !== 'manufacturer');
  } else {
    return columns;
  }
});

const params = ref<Record<string, any>>({});
const deviceData = ref<any>();
const visible = ref(false);
const planVis = ref(false);
const planType = ref('');

/**
 * 搜索
 * @param params
 */
const handleSearch = (e: any) => {
  params.value = e;
};

const saveVis = ref(false);
const handleAdd = () => {
  channelData.value = undefined;
  saveVis.value = true;
};

const listRef = ref();
const playerVis = ref(false);
const channelData = ref();
const playData = ref();

/**
 * 表格操作按钮
 * @param data 表格数据项
 * @param type 表格展示类型
 */
const getActions = (
    data: Partial<Record<string, any>>,
    type: 'card' | 'table',
): any => {
  if (!data) return [];
  const actions = [
    {
      key: 'update',
      text: $t('Channel.index.5349818-14'),
      tooltip: {
        title: $t('Channel.index.5349818-14'),
      },
      icon: 'EditOutlined',
      onClick: () => {
        channelData.value = cloneDeep(data);
        saveVis.value = true;
      },
    },
    {
      key: 'play',
      text: $t('Channel.index.5349818-15'),
      tooltip: {
        title: $t('Channel.index.5349818-15'),
      },
      icon: 'PlayCircleOutlined',
      onClick: () => {
        playData.value = cloneDeep(data);
        playerVis.value = true;
      },
    },
    {
      key: 'backPlay',
      text: $t('Channel.index.5349818-16'),
      tooltip: {
        title: $t('Channel.index.5349818-16'),
      },
      icon: 'HistoryOutlined',
      onClick: () => {
        menuStory.jumpPage(
            'media/Device/Playback',
            {
              query: {
                id: route.query.id,
                type: route.query.type,
                channelId: data.channelId,
              }
            }
        );
      },
    },
    {
      key: 'plan',
      text: $t('Channel.index.5349818-17'),
      tooltip: {
        title: $t('Channel.index.5349818-17'),
      },
      icon: 'CameraOutlined',
      onClick: () => {
        planVis.value = true;
        planType.value = 'screenshot';
        channelData.value = cloneDeep(data);
      },
    },
    {
      key: 'plan',
      text: $t('Channel.index.5349818-18'),
      tooltip: {
        title: $t('Channel.index.5349818-18'),
      },
      icon: 'VideoCameraOutlined',
      onClick: () => {
        planType.value = 'video';
        planVis.value = true;
        channelData.value = cloneDeep(data);
      },
    },
    {
      key: 'share',
      text: $t('Channel.index.5349818-19'),
      tooltip: {
        title: $t('Channel.index.5349818-19'),
      },
      icon: 'ShareAltOutlined',
      onClick: () => {
        visible.value = true;
        channelData.value = cloneDeep(data);
      },
    },
    {
      key: 'delete',
      text: $t('Channel.index.5349818-20'),
      tooltip: {
        title: $t('Channel.index.5349818-20'),
      },
      popConfirm: {
        title: $t('Channel.index.5349818-21'),
        onConfirm: () => {
          const response = ChannelApi.del(data.id);
          response.then((resp) => {
            if (resp.status === 200) {
              onlyMessage($t('Channel.index.5349818-22'));
              listRef.value?.reload();
            } else {
              onlyMessage($t('Channel.index.5349818-23'), 'error');
            }
          });
          return response;
        },
      },
      icon: 'DeleteOutlined',
    },
  ];
  return ['onvif', 'gb28181-2016'].includes(route.query?.type)
      ? actions.filter((f) => f.key !== 'delete')
      : actions;
};

// 左侧树

const deviceId = computed(() => route.query.id as string);
const handleSelect = (key: string) => {
  if (key === deviceId.value && listRef.value?.reload) {
    params.value = {};
    listRef.value?.reload();
  } else {
    params.value = {
      terms: [
        {
          column: 'parentId',
          value: key,
        },
      ],
    };
  }
};
const refreshChanel = async () => {
  const res = await DeviceApi.updateChannels(deviceData.value.id);
  if (res.success) {
    onlyMessage($t('Channel.index.5349818-24'));
    listRef.value?.reload();
  }
};
onMounted(async () => {
  const deviceResp = await DeviceApi.detail(route.query.id);
  if (deviceResp.success) {
    deviceData.value = deviceResp.result;
  }
});
</script>
<style lang="less" scoped>
@import './index.less';
</style>
