<template>
  <div style="display: flex">
    <div class="catalogue">{{ $t('Channel.index.312709-4') }}</div>
    <div style="flex: 1; min-width: 0">
      <j-ellipsis>
        {{pathsName}}
      </j-ellipsis>
    </div>
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
        :alertShow="false"
        bodyStyle="padding: 0;"
        :rowSelection="{
            selectedRowKeys: _selectedRowKeys,
            onSelect: onSelectChange,
            onSelectAll: onSelectAllChange,
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
          <AIcon type="PlayCircleOutlined"/>
        </j-permission-button>
      </template>
    </j-pro-table>
  </div>
</template>

<script setup>
import cascadeApi from "@media/api/cascade";
import {useI18n} from "vue-i18n";
import {map} from "lodash-es";

const props = defineProps({
  data: {
    type: Object,
    default: () => ({}),
  },
  selectedKeys: {
    type: Array,
    default: () => [],
  }
});
const emits = defineEmits(['update:selectedKeys']);

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
const tableRef = ref();

const pathsName = computed(() => {
  return props.data.name
});

const onSelectChange = (record, selected) => {
  const obj = {
    channelId: record.channelId,
    deviceId: record.deviceId,
    name: record.name,
  }
  if (selected) {
    emits('update:selectedKeys', [...props.selectedKeys, obj])
  } else {
    emits('update:selectedKeys', props.selectedKeys.filter((item) => item.channelId !== record?.channelId))
  }
};

const onSelectAllChange = (selected, _, changeRows) => {
  const _list = changeRows.map((item) => ({
    channelId: item.channelId,
    deviceId: item.deviceId,
    name: item.name,
  }))
  if(selected){
    emits('update:selectedKeys', [...props.selectedKeys, ..._list])
  } else {
    const _data = props.selectedKeys.filter((item) => {
      return !map(_list, 'channelId').includes(item.channelId)
    })
    emits('update:selectedKeys', _data)
  }
};
const handleSearch = (e) => {
  params.value = e;
};

watch(() => props.selectedKeys, () => {
  _selectedRowKeys.value = map(props.selectedKeys, 'channelId');
}, {deep: true, immediate: true})
</script>

<style lang="less" scoped>

</style>
