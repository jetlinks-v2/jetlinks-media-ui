<template>
  <j-page-container>
    <FullPage>
      <div class="split-screen-container">
        <div class="split-screen-container-left">
          <ScreenPlayer
              ref="player"
              :players="players"
              v-model:screen="screen"
              showScreen
              @select="onSelect"
              v-model:activeItem="activeItem"
          >
            <template #extra>
              <a-popover
                  v-model:visible="_visible"
                  trigger="click"
                  :title="$t('SplitScreen.Right.index.1-1')"
              >
                <template #content>
                  <a-form
                      ref="formRef"
                      :model="formData"
                      layout="vertical"
                  >
                    <a-form-item
                        :label="$t('Player.ScreenPlayer.521467-5')"
                        name="name"
                        :rules="[
                            {
                                required: true,
                                message: $t('Player.ScreenPlayer.521467-6'),
                            },
                            {
                                max: 64,
                                message: $t('Player.ScreenPlayer.521467-7'),
                            },
                        ]"
                    >
                      <a-input
                          v-model:value="formData.name"
                          :placeholder="$t('Player.ScreenPlayer.521467-6')"
                      />
                    </a-form-item>
                    <a-button
                        type="primary"
                        @click="saveHistory"
                        :loading="loading"
                        block
                    >
                      {{ $t('Player.ScreenPlayer.521467-8') }}
                    </a-button>
                  </a-form>
                </template>
                <a-button type="primary">
                  <AIcon type="SaveOutlined"/>
                  {{ $t('SplitScreen.Right.index.1-1') }}
                </a-button>
              </a-popover>
            </template>
          </ScreenPlayer>
        </div>
        <div class="split-screen-container-right">
          <div class="title">{{$t('SplitScreen.Right.index.1-2')}}</div>
          <div class="right-list">
            <VideoList :data="list" @refresh="getHistory"/>
          </div>
          <div class="title">{{$t('SplitScreen.Right.index.1-3')}}</div>
          <div class="current-channel">
            <div>{{$t('SplitScreen.Right.index.1-4')}}</div>
            <div class="value">
              <j-ellipsis>{{activeItem?.name || $t('Playback.index.3127012-7')}}</j-ellipsis>
            </div>
          </div>
          <div class="right-tool">
            <MediaTool
                :zoom="activeItem.zoom"
                :directions="activeItem.directions"
                :voice="activeItem.voice"
                @onMouseDown="handleMouseDown"
                @onMouseUp="handleMouseUp"
            />
          </div>
        </div>
      </div>
    </FullPage>
  </j-page-container>
  <SelectChannel :screen="screen" v-if="current.visible" @close="current.visible = false" @save="onSave"/>
</template>

<script setup>
import ScreenPlayer from '@/components/Player/ScreenPlayer.vue';
import MediaTool from '@/components/Player/MediaTool.vue';
import VideoList from './VideoList.vue';
import SelectChannel from './SelectChannel/index.vue';
import {getSearchHistory, saveSearchHistory} from "@/api/comm";
import {onlyMessage} from "@/utils";
import {useI18n} from "vue-i18n";
import {DEFAULT_SAVE_CODE} from "@media/views/SplitScreen/data";
import channelApi from '../../api/channel';

const {t: $t} = useI18n();
const player = ref();
const current = reactive({
  value: false,
  index: -1,
})
const _visible = ref(false)
const screen = ref(1)
const formRef = ref();
const formData = ref({
  name: '',
});
const loading = ref()
const players = ref([])
const list = ref([])
const activeItem = ref({})

const circularAssignment = (sourceArr, targetArr, startPos) => {
  const targetLen = targetArr.length;
  sourceArr.forEach((item, index) => {
    const pos = (startPos - 1 + index) % targetLen; // 计算实际位置(从0开始)
    targetArr[pos] = item;
  });
  return targetArr;
}

/**
 * 获取视频链接
 * @param dId
 * @param cId
 */
const getMediaUrl = (dId, cId) => {
  return channelApi.ptzStart(dId, cId, 'mp4');
};

const onSave = (dt) => {
  current.visible = false
  const _dt = dt.map(item => {
    return {
      ...item,
      url: getMediaUrl(item.deviceId, item.channelId)
    }
  })
  // 请求接口判断是否支持摄像头操作
  const arr = new Array(screen.value).fill({
    name: '',
    deviceId: '',
    channelId: '',
    url: '',
    voice: false,
    directions: false,
    zoom: false
  });
  players.value = circularAssignment(_dt, arr, current.index + 1)
}

const onSelect = (index) => {
  current.index = index
  current.visible = true
}

/**
 * 点击控制按钮
 * @param type 控制类型
 */
const handleMouseDown = (type) => {
  if(activeItem.value.directions || !activeItem.value.deviceId || !activeItem.value.channelId) return
  channelApi.ptzTool(
      activeItem.value.deviceId,
      activeItem.value.channelId,
      type,
      90,
  );
};
const handleMouseUp = () => {
  if(activeItem.value.directions || !activeItem.value.deviceId || !activeItem.value.channelId) return
  channelApi.ptzStop(activeItem.value.deviceId, activeItem.value.channelId);
};

/**
 * 获取历史分屏
 */
const getHistory = async (first = false) => {
  const res = await getSearchHistory(DEFAULT_SAVE_CODE);
  if (res.success) {
    list.value = res.result;
  //   if(first){
  //     // 找到默认的历史数据，播放
  //     const item = res.result[0]?.content
  //     if(item){
  //       const obj = JSON.parse(item) || {}
  //       screen.value = obj.screen || 1
  //       const _playersList = obj.players || []
  //       players.value = _playersList.map(item => {
  //         return {
  //           name: '',
  //           deviceId: '',
  //           channelId: '',
  //           voice: false,
  //           directions: false,
  //           zoom: false,
  //           ...item,
  //           url: item.deviceId && item.channelId ?getMediaUrl(item.deviceId, item.channelId) : ''
  //         }
  //       })
  //     }
  //   }
  }
};

const saveHistory = async () => {
  const resp = await formRef.value.validate();
  const arr = (player.value?.players || []).map(i => {
    return {
      deviceId: i.deviceId,
      channelId: i.channelId,
      name: i.name
    }
  })
  if (resp) {
    const param = {
      name: formData.value.name,
      content: JSON.stringify({
        screen: screen.value,
        players: arr
      }),
    };
    loading.value = true;
    const res = await saveSearchHistory(param, DEFAULT_SAVE_CODE);
    loading.value = false;
    if (res.success) {
      _visible.value = false;
      getHistory();
      onlyMessage($t('Player.ScreenPlayer.521467-12'));
      formRef.value.resetFields();
    } else {
      onlyMessage($t('Player.ScreenPlayer.521467-13'), 'error');
    }
  }
};

onMounted(() => {
  getHistory(true)
})
</script>

<style lang="less" scoped>
.split-screen-container {
  padding: 24px;
  display: flex;
  gap: 16px;
  height: 100%;

  &-left {
    min-width: 0;
    flex: 1;
    height: 100%;
  }

  &-right {
    width: 350px;
    background-color: #F5F5F5;
    padding: 24px 16px;
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 16px;
    overflow-y: auto;

    .title {
      color: #1A1A1A;
      font-size: 16px;
      font-weight: 500;
    }

    .current-channel {
      color: #777777;
      display: flex;
      gap: 12px;

      .value {
        color: #1A1A1A;
        font-size: 13px;
        flex: 1;
        min-width: 0;
      }
    }

    .right-list {
      flex: 1;
      min-height: 100px;
      overflow-y: auto;
    }

    .right-tool {
      min-height: 340px;
      padding: 0 24px;
      overflow: hidden;
    }
  }
}
</style>
