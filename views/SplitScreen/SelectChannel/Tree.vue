<template>
  <div class="left-content">
    <a-input-search allowClear placeholder="请输入设备名称" v-model:value="searchValue" @search="onSearch"/>
    <div>选择设备及目录查看已绑定的通道：</div>
    <j-empty v-if="!treeData.length"/>
    <a-tree
        v-else
        :show-line="{ showLeafIcon: false }"
        :show-icon="true"
        :tree-data="treeData"
        :fieldNames="{ title: 'name', key: 'id' }"
        @select="onSelect"
        v-model:expandedKeys="expandedKeys"
        :selectedKeys="selectedKeys"
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
const selectedKeys = ref([]); // 展开的key
const allTreeData = ref([]);
const searchValue = ref();
const _searchValue = ref();

const emit = defineEmits(['select']);

const treeData = computed(() => {
  return allTreeData.value.filter(i => !_searchValue.value || i.name.includes(_searchValue.value))
})

const onSelect = (_, {node}) => {
  if (node.dataRef) {
    selectedKeys.value = [node.dataRef.id]
    emit('select', node.dataRef);
  }
};

const onSearch = (val) => {
  _searchValue.value = val;
}

/**
 * 获取设备列表
 */

const getDeviceList = async () => {
  const res = await cascadeApi.getMediaTree({paging: false});
  if (res.success) {
    allTreeData.value = res.result.sort((a, b) => b.createTime - a.createTime)
    const first = allTreeData.value[0];
    if (first) {
      selectedKeys.value = [first.id]
      emit('select', first);
    }
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
