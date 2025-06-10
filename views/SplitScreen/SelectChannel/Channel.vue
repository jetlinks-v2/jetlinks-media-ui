<template>
  <div style="display: flex">
    <div class="catalogue">{{ $t('Channel.index.312709-4') }}</div>
    <a-breadcrumb>
      <a-breadcrumb-item v-for="name in pathsName">{{name }}</a-breadcrumb-item>
    </a-breadcrumb>
  </div>
  <pro-search
      :columns="columns"
      :params="params"
      type="simple"
      style="padding: 0; margin: 0"
      @search="handleSearch"
  />
  <div style="min-height: 0; flex: 1">
    <j-pro-table
        ref="tableRef"
        mode="TABLE"
        rowKey="channelId"
        :columns="columns"
        :request="cascadeApi.queryChannelList"
        :params="params"
        :defaultParams="{
          terms: [
            {
              column: 'deviceId',
              value: data.id,
            },
          ],
        }"
        bodyStyle="padding: 0;"
        :rowSelection="{
            selectedRowKeys: _selectedRowKeys,
            onSelect: onSelectChange,
            onSelectAll: onSelectAllChange,
            onChange: onChange,
          }"
    >
      <template #status="slotProps">
        <JBadgeStatus
            :text="slotProps.status.text"
            :status="slotProps.status.value"
            :statusNames="{
                                    online: 'success',
                                    offline: 'error',
                                }"
        />
      </template>
      <template #action="slotProps">
        <j-permission-button
            type="link"
            :tooltip="{title: '播放'}"
        >
          <AIcon type="PlayCircleOutlined" />
        </j-permission-button>
      </template>
    </j-pro-table>
  </div>
</template>

<script setup>
import cascadeApi from "@media/api/cascade";

const props = defineProps({
  data: {
    type: Object,
    default: () => ({}),
  }
});
import {useI18n} from "vue-i18n";

const {t: $t} = useI18n();
const columns = [
  {
    title: 'ID',
    dataIndex: 'channelId',
    key: 'channelId',
    ellipsis: true,
    search: {
      type: 'string',
    },
  },
  {
    title: $t('Channel.index.312709-14'),
    dataIndex: 'name',
    key: 'name',
    ellipsis: true,
    search: {
      type: 'string',
      first: true,
    },
  },
  {
    title: $t('Channel.index.312709-15'),
    dataIndex: 'manufacturer',
    key: 'manufacturer',
    ellipsis: true,
  },
  {
    title: $t('Channel.index.312709-16'),
    dataIndex: 'address',
    ellipsis: true,
    key: 'address',
    search: {
      type: 'string',
    },
  },
  {
    title: $t('Channel.index.312709-17'),
    dataIndex: 'status',
    key: 'status',
    scopedSlots: true,
    width: 150,
    search: {
      type: 'select',
      options: [
        {label: $t('Channel.index.312709-18'), value: 'online'},
        {label: $t('Channel.index.312709-19'), value: 'offline'},
      ],
    },
  },
  {
    title: $t('Channel.index.312709-20'),
    key: 'action',
    width: 100,
    scopedSlots: true,
  },
];
const params = ref({});
const _selectedRowKeys = ref([]);

const pathsName = computed(() => {
  return props.data.name ? [props.data.name] : []
});

const handleClick = (dt) => {
  if (_selectedRowKeys.value.includes(dt.id)) {
    const _index = _selectedRowKeys.value.findIndex((i) => i === dt.id);
    _selectedRowKeys.value.splice(_index, 1);
  } else {
    _selectedRowKeys.value = [..._selectedRowKeys.value, dt.id];
  }
}

const getSelectedRowsKey = (selectedRows) => {
  return selectedRows.map((item) => item?.id).filter((i) => !!i);
}

const getSetRowKey = (selectedRows) => {
  return new Set([..._selectedRowKeys.value, ...getSelectedRowsKey(selectedRows)])
};
const onSelectChange = (record, selected, selectedRows) => {
  if (selected) {
    _selectedRowKeys.value = [...getSetRowKey(selectedRows)]
  } else {
    _selectedRowKeys.value = _selectedRowKeys.value.filter((item) => item !== record?.id);
  }
};

const onSelectAllChange = (selected, selectedRows, changeRows) => {
  const unRowsKeys = getSelectedRowsKey(changeRows);
  _selectedRowKeys.value = selected
      ? [...getSetRowKey(selectedRows)]
      : _selectedRowKeys.value
          .concat(unRowsKeys)
          .filter((item) => !unRowsKeys.includes(item));
};


const onChange = (selectedRowKeys) => {
  if (selectedRowKeys.length === 0) {
    _selectedRowKeys.value = [];
  }
};
const handleSearch = (e) => {
  params.value = e;
};
</script>

<style lang="less" scoped>

</style>
