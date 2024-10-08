<template>
  <div style="width: 95%; margin: 0 auto">
    <div class="media-live-tool">
      <a-radio-group
          v-model:value="mediaType"
          button-style="solid"
          @change="mediaStart"
      >
        <a-radio-button value="mp4">MP4</a-radio-button>
        <a-radio-button value="flv">FLV</a-radio-button>
        <a-radio-button value="m3u8">HLS</a-radio-button>
      </a-radio-group>
      <div class="media-live-share" v-if="type !== 'share'">
        <a-button type="link" @click="onShare">
          <AIcon type="ShareAltOutlined"/>
          分享视频
        </a-button>
      </div>
    </div>
    <div class="media-live">
      <div class="media-live-video">
        <div
            :class="mediaToolClass"
            @mouseleave="mouseleave"
            @mouseenter="showTool = true"
        >
          <div class="tool-item" v-if="type !== 'share'">
            <template v-if="isRecord === 0">
              <a-dropdown
                  trigger="click"
                  @visibleChange="visibleChange"
                  @click="showToolLock = true"
              >
                <div>开始录像</div>
                <template #overlay>
                  <a-menu @click="recordStart">
                    <a-menu-item key="true" v-if="_type">
                                            <span style="padding-right: 12px"
                                            >本地存储</span
                                            >
                      <a-tooltip title="存储在设备本地">
                        <a-icon
                            type="QuestionCircleOutlined"
                        />
                      </a-tooltip>
                    </a-menu-item>
                    <a-menu-item key="false">
                                            <span style="padding-right: 12px"
                                            >云端存储</span
                                            >
                      <a-tooltip title="存储在服务器中">
                        <a-icon
                            type="QuestionCircleOutlined"
                        />
                      </a-tooltip>
                    </a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown>
            </template>
            <div v-else-if="isRecord === 1">请求录像中</div>
            <div
                v-else-if="isRecord === 2"
                @click.stop="recordStop"
            >
              停止录像
            </div>
          </div>

          <div class="tool-item" @click.stop="handleRefresh">
            刷新
          </div>
          <ConfirmModal
              title="重置将断开直播, 可能会影响其他播放者"
              :onConfirm="handleReset"
          >
            <div class="tool-item">重置</div>
          </ConfirmModal
          >
        </div>
        <LivePlayer
            ref="player"
            :live="true"
            :url="url"
            :protocol="mediaType"
            autoplay
        />
      </div>
      <div class="media-live-actions" v-if="_type">
        <div class="actions-tool">
          <MediaTool
              @onMouseDown="handleMouseDown"
              @onMouseUp="handleMouseUp"
          >
            <template #center>
              <div class="center">
                <div>转速控制</div>
                <a-dropdown>
                                    <span
                                    >{{ _speed }}<AIcon type="DownOutlined"
                                    /></span>
                  <template #overlay>
                    <a-menu @click="onMenuChange">
                      <a-menu-item
                          :key="item.value"
                          v-for="item in speedList"
                      >
                        {{ item.label }}
                      </a-menu-item>
                    </a-menu>
                  </template>
                </a-dropdown>
              </div>
            </template>
          </MediaTool>
        </div>
        <div class="media-preset">
          <Preset :data="data" @refresh="onRefresh" :share="true"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {PropType} from 'vue';
import LivePlayer from '@/components/Player/index.vue';
import MediaTool from '@/components/Player/mediaTool.vue';
import channelApi from '../../../../api/channel';
import Preset from './Preset.vue';
import {onlyMessage} from '@jetlinks-web/utils';

type Emits = {
  (e: 'update:visible', data: boolean): void;
  (e: 'refresh'): void;
};
const emit = defineEmits<Emits>();

const props = defineProps({
  visible: {type: Boolean, default: false},
  data: {
    type: Object as PropType<Partial<Record<string, any>>>,
    default: () => ({}),
  },
  type: {
    type: String as PropType<'share' | 'normal'>,
    default: 'normal',
  },
  readOnly: {
    type: Boolean,
    default: false,
  },
});

const route = useRoute();

const _vis = computed({
  get: () => props.visible,
  set: (val) => emit('update:visible', val),
});

// 播放器
const player = ref();
// 视频地址
const url = ref('');
// 视频类型
const mediaType = ref<'mp4' | 'flv' | 'hls' | 'rtc'>('mp4');
const showTool = ref(false);
const showToolLock = ref(false);

const visible = ref(false);

const _type = computed(() => {
  return route.query.type !== 'fixed-media';
});

const speedList = [
  {label: '高', value: 180},
  {label: '中', value: 90},
  {label: '低', value: 45},
];
const speed = ref(90);

const _speed = computed(() => {
  return speedList.find((item) => item.value === speed.value)?.label;
});

const onMenuChange = (val: any) => {
  speed.value = val.key;
};

const mouseleave = () => {
  if (!showToolLock.value) {
    showTool.value = false;
  }
};

const visibleChange = (v: boolean) => {
  showTool.value = v;
};

const getPopupContainer = (trigger: HTMLElement) => {
  return trigger?.parentNode || document.body;
};

const mediaToolClass = computed(() => {
  return {
    'media-tool': true,
    'media-tool-show': showTool.value,
  };
});

/**
 * 媒体开始播放
 */
const mediaStart = () => {
  url.value = channelApi.ptzStart(
      props.data.deviceId,
      props.data.channelId,
      mediaType.value,
  );
};

// 录像状态
const isRecord = ref(0); // 0：停止录像； 1：请求录像中； 2：开始录像
/**
 * 查询录像状态
 */
const getIsRecord = async () => {
  const {result} = await channelApi.ptzIsRecord(
      props.data.deviceId,
      props.data.channelId,
  );
  isRecord.value = result ? 2 : 0;
};

/**
 * 开始录像
 */
const recordStart = async ({key}: { key: string }) => {
  showToolLock.value = false;
  showTool.value = false;
  isRecord.value = 1;
  const local = key === 'true';
  const res = await channelApi
      .recordStart(props.data.deviceId, props.data.channelId, {local})
      .catch(() => ({success: false}));
  if (res.success) {
    isRecord.value = 2;
  } else {
    isRecord.value = 0;
  }
};

/**
 * 停止录像
 */
const recordStop = async () => {
  const res = await channelApi.recordStop(
      props.data.deviceId,
      props.data.channelId,
  );
  if (res.success) {
    isRecord.value = 0;
  }
};

/**
 * 刷新
 */
const handleRefresh = () => {
  // player.value.play();
  url.value = '';
  setTimeout(() => {
    mediaStart();
  }, 500);
};

/**
 * 重置
 */
const handleReset = () => {
  const response = channelApi.mediaStop(props.data.deviceId, props.data.channelId);
  response.then((res) => {
    onlyMessage('操作成功!')
  })
  return response
};

/**
 * 点击控制按钮
 * @param type 控制类型
 */
const handleMouseDown = (type: string) => {
  channelApi.ptzTool(
      props.data.deviceId,
      props.data.channelId,
      type,
      speed.value,
  );
};
const handleMouseUp = () => {
  channelApi.ptzStop(props.data.deviceId, props.data.channelId);
};

/**
 * 分享视频
 */
const onShare = () => {
  visible.value = true;
};

const onRefresh = () => {
  emit('refresh');
};

watch(
    () => _vis.value,
    (val: boolean) => {
      if (val) {
        mediaStart();
        getIsRecord();
      } else {
        // url置空, 即销毁播放器
        url.value = '';
      }
    },
    {
      immediate: true,
    },
);
</script>
<style lang="less" scoped>
@import './index.less';

:deep(.live-player-stretch-btn) {
  display: none;
}

:deep(.vjs-icon-spinner) {
  display: none;
}

.center {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.media-preset {
  :deep(.ant-table-header) {
    user-select: none;
  }
}
</style>
