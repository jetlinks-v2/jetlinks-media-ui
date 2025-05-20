<template>
  <a-modal
    :title="$t('Channel.Bind.1046520-0')"
    visible
    :maskClosable="false"
    :confirmLoading="loading"
    width="60%"
    @cancel="emits('close')"
    @ok="handleSave"
  >
    <pro-search :columns="columns" @search="handleSearch" type="simple"></pro-search>
    <j-pro-table
      :columns="columns"
      mode="TABLE"
      :request="queryChannel"
      :params="params"
      :rowSelection="{
        selectedRowKeys: _selectedRowKeys,
        onSelectNone: onSelectNone,
        onSelect: onSelect,
        onSelectAll: onAllSelect,
      }"
      :defaultParams="{
        sorts: [{name:'createTime', order:'desc'}],
        pageSize: 6,
        terms: [
          {
            column: 'id$media-catalog-channel$not',
            value: []
          }
        ]
      }"
      :scroll="{y: '500px'}"
    >
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
    </j-pro-table>
  </a-modal>
</template>

<script setup lang="ts">
import { useRequest } from '@jetlinks-web/hooks';
import { onlyMessage } from '@jetlinks-web/utils';
import { queryChannel, bindChannel } from '@media/api/catalog';
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n()
const emits = defineEmits(['close', 'save'])
const selectCatalog = inject('selectCatalog', [])
const params = ref()
const _selectedRowKeys = ref<string[]>([])

const { loading, run: runBind } = useRequest(bindChannel, {
  immediate: false,
  onSuccess: () => {
    onlyMessage('绑定成功')
    emits('close')
    emits('save')
  },
}) 

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
const columns = [
  {
    title: $t('CardManagement.BindDevice.427957-3'),
    dataIndex: 'deviceName',
    ellipsis: true,
    search: {
      type: 'string'
    }
  },
  {
    title: $t('Record.index.104651-2'),
    dataIndex: 'name',
    ellipsis: true,
    search: {
      type: 'string'
    }
  },
  {
    title: $t('Record.index.104651-4'),
    dataIndex: 'address',
    ellipsis: true,
    search: {
      type: 'string'
    }
  },
  {
    title: $t('Record.index.312702-3'),
    dataIndex: 'manufacturer',
    ellipsis: true,
    search: {
      type: 'string'
    }
  },
  {
    title: $t('Log.index.689569-2'),
    dataIndex: 'status',
    scopedSlots: true,
  },
]

const handleSearch = (val: any) => {
  params.value = val;
}

const handleSave = async () => {
  if(!_selectedRowKeys.value.length){
    onlyMessage($t('Catalog.Right.BindChannel.1-1'), 'warning')
    return
  }
  runBind(selectCatalog?.value?.[0], _selectedRowKeys.value)
}
</script>