<template>
  <div class="left-content">
    <a-input-search placeholder="请输入设备名称" />
    <a-tree
        :show-line="{ showLeafIcon: false }"
        :show-icon="true"
        :tree-data="treeData"
        :fieldNames="{ title: 'name', key: 'id' }"
        @select="onSelect"
        v-model:expandedKeys="expandedKeys"
    >
      <template #title="{name}">
        <div class="name">
          <j-ellipsis>{{ name }}</j-ellipsis>
        </div>
      </template>
      <template #icon>
      </template>
    </a-tree>
  </div>
</template>

<script setup>
import cascadeApi from '../../../api/cascade';

const expandedKeys = ref([]); // 展开的key
const treeData = ref([]);

const emit = defineEmits(['select']);

const onSelect = (_, {node}) => {
  emit('select', node.dataRef);
};

/**
 * 获取设备列表
 */

const getDeviceList = async () => {
  const res = await cascadeApi.getMediaTree({paging: false});
  if (res.success) {
    treeData.value = res.result.sort((a, b) => b.createTime - a.createTime)
  }
};

getDeviceList();
</script>

<style lang="less" scoped>
.name {
  display: flex;
  align-items: center;
}

.left-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
