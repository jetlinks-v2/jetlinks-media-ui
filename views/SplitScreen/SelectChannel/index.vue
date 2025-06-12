<template>
  <a-modal visible title="选择视频源" :width="1200" @cancel="emits('close')" @ok="onSave">
    <a-alert>
      <template #message>
        当前分屏模式:{{screen}}分屏，最多可选择<span class="alert-num">{{screen}}</span>项，已选择<span class="alert-num">{{_selectedRow.length}}</span>项
      </template>
      <template #closeText v-if="_selectedRow.length">
        <a-button size="small" type="link" @click.stop="onCancel">取消选择</a-button>
      </template>
    </a-alert>
    <div class="select-channel-box">
      <div class="left">
        <Tree @select="onSelect" />
      </div>
      <div class="right">
        <template v-if="current && current.id">
          <ChannelTable :key="current.id" :data="current" v-model:selectedKeys="_selectedRow" />
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
import {onlyMessage} from "@jetlinks-web/utils";
const props = defineProps({
  screen: {
    type: Number,
    default: 1
  }
})
const emits = defineEmits(['close', 'save'])

const current = ref()
const _selectedRow = ref([]);
const onSelect = (node) => {
  current.value = node
}

const onCancel = () => {
  _selectedRow.value = []
}

const onSave = () => {
  if(_selectedRow.value.length > props.screen){
    onlyMessage(`最多只能选择${props.screen}项`, 'error')
  } else if(_selectedRow.value.length === 0){
    onlyMessage('至少选择一项', 'error')
  } else {
    emits('save', _selectedRow.value)
  }
}
</script>

<style lang="less" scoped>
.alert-num {
  color: @primary-color;
}
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
