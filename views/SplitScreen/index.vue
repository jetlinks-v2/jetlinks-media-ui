<template>
    <j-page-container>
        <FullPage>
          <div class="split-screen-container">
            <div class="split-screen-container-left" @click="onSelect">
              <ScreenPlayer
                  ref="player"
                  :id="deviceId"
                  :channelId="channelId"
                  :onMouseUp="
                                (id, cId) => channelApi.ptzStop(id, cId)
                            "
                  :onMouseDown="
                                (id, cId, type) =>
                                    channelApi.ptzTool(id, cId, type)
                            "
                  :historyHandle="(dId, cId) => getMediaUrl(dId, cId)"
                  showScreen
              />
            </div>
            <div class="split-screen-container-right">
              <div class="title">分屏配置列表</div>
              <div class="right-list">
                <VideoList :data="list" />
              </div>
              <div class="title">通道控制</div>
              <div class="current-channel">
                <div>当前通道</div>
                <div class="value">
                  <j-ellipsis>暂无数据</j-ellipsis>
                </div>
              </div>
              <div class="right-tool">
                <MediaTool @onMouseDown="handleMouseDown" @onMouseUp="handleMouseUp" />
              </div>
            </div>
          </div>
        </FullPage>
    </j-page-container>
  <SelectChannel v-if="visible" @close="visible = false" />
</template>

<script setup>
import ScreenPlayer from '@/components/Player/ScreenPlayer.vue';
import MediaTool from '@/components/Player/MediaTool.vue';
import channelApi from "../../api/channel";
import VideoList from './VideoList.vue';
import SelectChannel from './SelectChannel/index.vue';

const deviceId = ref('');
const channelId = ref('');
const player = ref();
const list = ref(new Array(100).fill(0).map((i, index) => ({id: index + '123', name: '分屏配置' + index, default: index === 2})));
const visible = ref(false)
/**
 * 获取视频链接
 * @param dId
 * @param cId
 */
const getMediaUrl = (dId, cId) => {
  return channelApi.ptzStart(dId, cId, 'mp4');
};

const handleMouseDown = () => {

}

const handleMouseUp = () => {

}

const onSelect = () => {
  visible.value = true
}
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
    width: 300px;
    background-color: #F5F5F5;
    padding: 24px 16px;
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 16px;

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
      min-height: 0;
      overflow-y: auto;
    }

    .right-tool {
      height: 300px;
    }
  }
}
</style>
