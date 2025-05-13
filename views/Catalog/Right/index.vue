<template>
  <div class="right-channel">
    <pro-search :columns="columns" @search="handleSearch" style="padding-bottom: 0;" target="media-catalog"></pro-search>
    <j-pro-table
      ref="tableRef"
      :columns="columns" 
      mode="TABLE" 
      :request="queryChannelFn"
      :params="params"
      :defaultParams="{
        sorts: [{ name: 'createTime', order: 'desc' }],
      }" 
      :scroll="{y: '500px'}"
      :rowSelection="{
        selectedRowKeys: _selectedRowKeys,
        onSelectNone: onSelectNone,
        onSelect: onSelect,
        onSelectAll: onAllSelect,
      }"
    >
      <template #headerRightRender>
        <a-space>
          <j-permission-button type="primary" @click="visible = true" hasPermission="media/Catalog:bind">{{ $t('Channel.Bind.1046520-0') }}</j-permission-button>
          <j-permission-button 
            type="primary" 
            :popConfirm="{
              title: $t('Channel.index.122695-2'),
              onConfirm: () => {
                handleBatchUnbind()
              }
            }"
            hasPermission="media/Catalog:unbind"
          >
            {{ $t('Channel.index.122695-3') }}
          </j-permission-button>
        </a-space>
      </template>
      <template #status="scopedSlots">
        <j-badge-status
          :status="scopedSlots.status.value"
          :text="scopedSlots.status.text"
          :statusNames="{
            offline: 'error',
            online: 'success'
          }"
        >

        </j-badge-status>
      </template>
      <template #action="scopedSlots">
        <j-permission-button 
          type="link"
          :popConfirm="{
            title: $t('Channel.index.122695-2'),
            onConfirm: () => {
              handleUnBind([scopedSlots.id])
            }
          }"
          hasPermission="media/Catalog:unbind"
        >
          <AIcon type="DisconnectOutlined"></AIcon>
        </j-permission-button>
      </template>
    </j-pro-table>
    <BindChannel v-if="visible" @close="visible = false" @save="handleBind"/>
  </div>
</template>

<script setup lang="ts">
import { queryChannel, unbindChannel } from '@media/api/catalog';
import BindChannel from './BindChannel.vue';
import { onlyMessage } from '@jetlinks-web/utils';
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();
const visible = ref(false);
const tableRef = ref();
const selectCatalog = inject('selectCatalog', [])

const params = ref();

const columns = [
  {
    title: $t('CardManagement.BindDevice.427957-3'),
    dataIndex: 'deviceName',
    search: {
      type: 'string'
    }
  },
  {
    title: $t('Record.index.104651-2'),
    dataIndex: 'name',
    search: {
      type: 'string'
    }
  },
  {
    title: $t('Channel.Bind.1046520-5'),
    dataIndex: 'address',
    search: {
      type: 'string'
    }
  },
  {
    title: $t('Channel.Bind.1046520-4'),
    dataIndex: 'manufacturer',
    search: {
      type: 'string'
    }
  },
  {
    title: $t('Log.index.689569-2'),
    dataIndex: 'status',
    scopedSlots: true,
  },
  {
    title: $t('components.EditTable.7077012-3'),
    dataIndex:'action',
    scopedSlots: true,
    width: '80px',
  }
]

const _selectedRowKeys = ref<string[]>([])

const onSelectNone = () => {
  _selectedRowKeys.value = [];
};

const onSelect = (record: any, selected: boolean) => {
  const _set = new Set([..._selectedRowKeys.value])
  if (selected) {
    _set.add(record.id)
  } else {
    _set.delete(record.id)
  }
  _selectedRowKeys.value = [..._set]
};

const onAllSelect = (selected: boolean, _: any, keys: any[]) => {
  const _keys = keys.map(item => item.id) || []
  const _set = new Set([..._selectedRowKeys.value])
  _keys.map((i: any) => {
    if (selected) {
      _set.add(i)
    } else {
      _set.delete(i)
    }
  });
  _selectedRowKeys.value = [..._set]
};

const handleSearch = (e?: any) => {
  params.value = e;
}

const queryChannelFn = async (params: any) => {
  if(!selectCatalog.value?.length) {
    return new Promise(reject => {
      reject(0)
    })
  }
  return queryChannel({
    ...params,
    terms: [
      ...params.terms,
      {
        terms: [
          {
            column: 'id$media-catalog-channel',
            value: [
              {
                column: 'catalogId',
                value: selectCatalog.value?.[0]
              }
            ]
          }
        ]
      }
    ]
  })
}

//绑定
const handleBind = async (data: any) => {
  tableRef.value?.reload()
}

//解绑
const handleUnBind = async (data: string[]) => {
  const res = await unbindChannel(selectCatalog.value?.[0], data)
  if(res.success) {
    onlyMessage($t('Debug.index.013560-11'))
    _selectedRowKeys.value = []
    tableRef.value?.reload()
  }
}

//批量解绑
const handleBatchUnbind = async () => {
  if(!_selectedRowKeys.value.length) {
    onlyMessage($t('Catalog.Right.index.1-1'), 'warning')
    return
  }
  handleUnBind(_selectedRowKeys.value)
}

watch(() => selectCatalog?.value, () => {
  tableRef.value?.reload()
}, {deep: true})
</script>

<style lang="less" scoped>
  .right-channel {
    width: 100%;
    height: 90%;
  }
</style>