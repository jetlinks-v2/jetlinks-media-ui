<!-- 国标级联-绑定通道 -->
<template>
  <a-modal
      visible
      :title="$t('BindChannel.index.122696-0')"
      :cancelText="$t('BindChannel.index.122696-1')"
      :okText="$t('BindChannel.index.122696-2')"
      width="80%"
      @ok="handleSave"
      @cancel="$emit('cancel')"
      :confirmLoading="loading"
  >
    <pro-search
        :columns="columns"
        @search="handleSearch"
        type="simple"
    />

    <JProTable
        ref="listRef"
        mode="table"
        :columns="columns"
        :request="CascadeApi.queryChannelList"
        :defaultParams="{
                sorts: [{ name: 'deviceName', order: 'asc' }, { name: 'name', order: 'asc' }],
                terms: [
                    {
                        column: 'id',
                        termType: 'cascade_channel$not',
                        type: 'and',
                        value: route.query.id,
                    },
                    {
                        column: 'catalogType',
                        termType: 'eq',
                        type: 'and',
                        value: 'device',
                    },
                ],
            }"
        :params="params"
        :rowSelection="{
                selectedRowKeys: _selectedRowKeys,
                onSelectNone: onSelectNone,
                onSelect: onSelect,
                onSelectAll: onAllSelect,
            }"
    >
      <template #headerLeftRender>
        <h3>{{ $t('BindChannel.index.122696-3') }}</h3>
      </template>
      <template #status="slotProps">
        <a-space>
          <a-badge
              :status="
                            slotProps.status.value === 'online'
                                ? 'success'
                                : 'error'
                        "
              :text="slotProps.status.text"
          ></a-badge>
        </a-space>
      </template>
    </JProTable>
  </a-modal>
</template>

<script setup lang="ts">
import CascadeApi from '../../../../api/cascade';
import {onlyMessage} from '@jetlinks-web/utils';
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();
const route = useRoute();

type Emits = {
  (e: 'cancel'): void;
  (e: 'submit'): void;
};
const emit = defineEmits<Emits>();

const columns = [
  {
    title: $t('BindChannel.index.122696-4'),
    dataIndex: 'deviceName',
    key: 'deviceName',
    ellipsis: true,
    search: {
      type: 'string',
    },
  },
  {
    title: $t('BindChannel.index.122696-5'),
    dataIndex: 'name',
    key: 'name',
    ellipsis: true,
    search: {
      type: 'string',
      first: true,
    },
  },
  {
    title: $t('BindChannel.index.122696-6'),
    dataIndex: 'address',
    key: 'address',
    ellipsis: true,
    search: {
      type: 'string',
    },
  },
  {
    title: $t('BindChannel.index.122696-7'),
    dataIndex: 'manufacturer',
    key: 'manufacturer',
    ellipsis: true,
    search: {
      type: 'string',
    },
  },
  {
    title: $t('BindChannel.index.122696-8'),
    dataIndex: 'status',
    key: 'status',
    scopedSlots: true,
    width: 150,
    search: {
      type: 'select',
      options: [
        {label: $t('BindChannel.index.122696-9'), value: 'online'},
        {label: $t('BindChannel.index.122696-10'), value: 'offline'},
      ],
      handleValue: (v: any) => {
        return v;
      },
    },
  },
];

const params = ref<Record<string, any>>({});

/**
 * 搜索
 * @param params
 */
const handleSearch = (e: any) => {
  params.value = e;
};

const listRef = ref();
const _selectedRowKeys = ref<string[]>([]);

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

const loading = ref(false);
const handleSave = async () => {
  if (!_selectedRowKeys.value.length) {
    onlyMessage($t('BindChannel.index.122696-11'), 'error');
    return;
  }
  loading.value = true;
  const resp = await CascadeApi.bindChannel(
      route.query.id as string,
      _selectedRowKeys.value,
  ).finally(() => {
    loading.value = false;
  })
  if (resp.success) {
    onlyMessage($t('BindChannel.index.122696-12'));
    emit('submit');
  } else {
    onlyMessage($t('BindChannel.index.122696-13'), 'error');
  }
};

onMounted(() => {
  handleSearch({terms: []})
})
</script>
