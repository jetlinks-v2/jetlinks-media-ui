<template>
  <div class="contents-tree">
    <a-input-search v-model:value="searchValue" :placeholder="$t('Tree.index.5349815-0')" @search="onSearch"></a-input-search>
    <j-permission-button type="primary" block style="margin: 16px 0;" @click="handleAdd">{{ $t('Config.index.133246-0') }}</j-permission-button>
    <a-tree :tree-data="treeData" :selectedKeys="selectedKeys" blockNode showIcon @select="handleSelect" :field-names="{title: 'name', key: 'id'}">
      <template #switcherIcon="{ switcherCls }">
        <AIcon type="DownOutlined" :class="switcherCls"></AIcon>
      </template>
      <template #title="{dataRef}">
        <div class="node-title">
          <a-space align="start">
            <AIcon type="FolderOutlined"></AIcon>
            <j-ellipsis>{{ dataRef.name }}</j-ellipsis>
          </a-space>
          <a-space>
            <j-permission-button
              v-for="action in getActions(dataRef)"
              :key="action.key"
              type="link"
              style="padding: 0;"
              :tooltip="{
                title: action.title
              }" 
              :danger="action.key === 'delete'"
              @click.stop="action.onClick?.()"
              :popConfirm="action.popConfirm"
            >
              <AIcon :type="action.icon"></AIcon>
            </j-permission-button>
          </a-space>
        </div>
      </template>
    </a-tree>
    <Save v-if="saveVisible" :data="current" @close="saveVisible = false" @save="onSaveCatalog"/>
  </div>
</template>

<script setup lang="ts">
import { onlyMessage } from '@jetlinks-web/utils';
import Save from './Save.vue';
import { deleteCatalog, queryTree } from '@media/api/catalog'
import { useRequest } from '@jetlinks-web/hooks';
import { debounce, cloneDeep, omit, map } from 'lodash-es';
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n()
const saveVisible = ref(false);
const current = ref({});
const selectedKeys = inject('selectCatalog', [])
const treeData = ref<any[]>([]);
const searchValue = ref('')
const treeMap = new Map() // 数据的map版本

const { run: runQueryTree } = useRequest(queryTree, {
  immediate: true,
  onSuccess: (res) => {
    handleTreeMap(res.result)
    treeData.value = res.result;
    selectedKeys.value = [treeData.value[0].id];
  }
})
const getActions = (data: any) => {
  return [
    {
      title: $t('Config.index.133246-12'),
      key: 'update',
      icon: 'EditOutlined',
      onClick: () => {
        saveVisible.value = true;
        current.value = {
          ...data,
          type: data.type.value
        };
      }
    },
    {
      title: $t('Catalog.Left.index.1-1'),
      key: 'add',
      icon: 'PlusCircleOutlined',
      onClick: () => {
        saveVisible.value = true;
        current.value = {
          parentId: data.id,
        };
      }
    },
    {
      title: $t('Config.index.133246-14'),
      key: 'delete',
      icon: 'DeleteOutlined',
      popConfirm: {
        title: $t('CardManagement.index.427944-75'),
        onConfirm: async () => {
          const res = await deleteCatalog(data.id);
          if (res.success) {
            onlyMessage($t('Debug.index.013560-11'));
            runQueryTree();
          }
        }
      }
    }
  ]
}

//选中
const handleSelect = (_selectedKeys: any, info: any) => {
  if(!info.selected) {
    return;
  }
  selectedKeys.value = _selectedKeys;
}

//新增
const handleAdd = () => {
  saveVisible.value = true;
  current.value = {};
}

//保存
const onSaveCatalog = (data: any) => {
  runQueryTree();
}

const ArrayToTree = (list: any[]): any[] => {
    const treeList: any[] = []
    // 所有项都使用对象存储起来
    const map = {}

    // 建立一个映射关系：通过id快速找到对应的元素
    list.forEach((item) => {
        if (!item.children) {
            item.children = []
        }
        map[item.id] = item
    })

    list.forEach((item) => {
        // 对于每一个元素来说，先找它的上级
        //    如果能找到，说明它有上级，则要把它添加到上级的children中去
        //    如果找不到，说明它没有上级，直接添加到 treeList
        const parent = map[item.parentId]
        // 如果存在则表示item不是最顶层的数据
        if (parent) {
            parent.children.push(item)
        } else {
            // 如果不存在 则是顶层数据
            treeList.push(item)
        }
    })
    // 返回出去
    return treeList
}

// 搜索
const onSearch = debounce(() => {
  const key = searchValue.value
  const treeArray = new Map()
  if (key) {
    const searchTree: string[] = []
    treeMap.forEach((item) => {
      if (item.name.includes(key)) {
        searchTree.push(item.parentId)
        treeArray.set(item.id, item)
      }
    })
    dig(searchTree)
    treeData.value = ArrayToTree(cloneDeep([...treeArray.values()]))
  } else {
    runQueryTree();
    treeData.value = ArrayToTree(cloneDeep([...treeMap.values()]))
  }

  function dig(_data: any[]): any {
    const pIds: string[] = []
    if (!_data.length) return
    _data.forEach((item) => {
      if (treeMap.has(item)) {
        const _item = treeMap.get(item)
        pIds.push(_item.parentId)
        treeArray.set(item, _item)
      }
    })
  }
}, 500)

// 将树形数组转化为map形式，以便筛选时操作
function handleTreeMap(_data: any[]) {
  if (_data) {
    _data.map((item) => {
      treeMap.set(item.id, omit(cloneDeep(item), ['children']))
      if (item.children) {
        handleTreeMap(item.children)
      }
    })
  }
}
</script>

<style lang="less" scoped>
  .contents-tree {
    padding: 18px 0;
    .node-title {
      display: flex;
      justify-content: space-between;
      gap: 8px;
    }
  }
</style>