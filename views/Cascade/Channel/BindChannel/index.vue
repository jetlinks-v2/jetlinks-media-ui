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
        type="TREE"
        :request="(e) => CascadeApi.getCatalogAndChannel(route.query.id, e)"
        :params="params"
        :rowSelection="{
                selectedRowKeys: map(_selectedRowKeys, 'id'),
                onSelectNone: onSelectNone,
                onSelect: onSelect,
                onSelectAll: onAllSelect,
                getCheckboxProps: (record) => {
                  return {
                    disabled: record.bind,
                    checked: record.bind,
                  }
                }
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
      <template #channelType="slotProps">
        {{ slotProps.channelType.text }}
      </template>
    </JProTable>
  </a-modal>
</template>

<script setup lang="ts">
import CascadeApi from '../../../../api/cascade';
import {onlyMessage} from '@jetlinks-web/utils';
import { map } from 'lodash-es';
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
    title: '类型',
    dataIndex:'channelType',
    key:'channelType',
    ellipsis: true,
    scopedSlots: true,
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
  if (selected) {
    _selectedRowKeys.value.push(record)
  } else {
    _selectedRowKeys.value.splice(_selectedRowKeys.value.findIndex((item) => item.id === record.id), 1)
  }
};

const onAllSelect = (selected: boolean, _: any, keys: any[]) => {
  _selectedRowKeys.value = [..._]
};

const loading = ref(false);
const handleSave = async () => {
  if (!_selectedRowKeys.value.length) {
    onlyMessage($t('BindChannel.index.122696-11'), 'error');
    return;
  }
  loading.value = true;
  const resp = await CascadeApi.bindCatalogOrChannel(
      route.query.id as string,
      _selectedRowKeys.value.map((item: any) => {
        return {
          channelId: item.id,
          gbChannelId: item.gbChannelId,
          channelType: item.channelType?.value
        }
      }),
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
