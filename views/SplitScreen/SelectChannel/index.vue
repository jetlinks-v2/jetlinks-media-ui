<template>
  <a-modal visible title="选择视频源" :width="1200" @cancel="emits('close')">
    <a-alert message="当前分屏模式" />
    <div class="select-channel-box">
      <div class="left">
        <Tree @select="onSelect" />
      </div>
      <div class="right">
        <template v-if="current && current.id">
          <ChannelTable :key="current.id" :data="current" />
        </template>
        <div v-else class="empty-box">
          <j-empty />
        </div>
      </div>
    </div>
  </a-modal>
</template>

<script setup>
import Tree from './Tree.vue'
import ChannelTable from './Channel.vue'

const emits = defineEmits(['close'])

const current = ref()

const onSelect = (node) => {
  current.value = node
}
</script>

<style lang="less" scoped>
.select-channel-box {
  display: flex;
  gap: 24px;
  height: 480px;
  margin-top: 16px;

  .left {
    height: 100%;
    width: 300px;
  }

  .right {
    height: 100%;
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 16px;

    .empty-box {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
    }
  }
}
</style>
