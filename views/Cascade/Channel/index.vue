<!-- 国标级联-通道列表 -->
<template>
  <j-page-container>
    <FullPage>
      <JProTable
        ref="listRef"
        mode="table"
        :columns="columns"
        type="TREE"
        :alertShow="false"
        v-model:expandedRowKeys="expandedRowKeys"
        :request="(e) => CascadeApi.getCatalogAndChannel(route.query.id, e)"
        :params="params"
        :rowSelection="{
            selectedRowKeys: map(_selectedRowKeys, 'id'),
            onSelectNone: onSelectNone,
            onSelect: onSelect,
            onSelectAll: onAllSelect,
        }"
    >
      <template #headerLeftRender>
        <h3>{{ $t('BindChannel.index.122696-3') }}</h3>
      </template>
      <template #headerRightRender>
        <j-permission-button type="primary" :loading="loading" @click="handleSave">保存</j-permission-button>
      </template>
      <template #gbChannelId="slotProps">
        <a-space>
          <j-ellipsis style="width: 200px;">
            {{ slotProps.gbChannelId }}
          </j-ellipsis>
          <a-button v-if="slotProps.bindId" type="link" @click="handleShowPopover(slotProps)">
            <AIcon type="EditOutlined"/>
          </a-button>
          <a-popover
            v-if="_data === slotProps.id"
            :visible="true"
            trigger="click"
          >
            <template #title>
              <div class="header">
                <span>{{ $t('Channel.index.122695-5') }}</span>
                <div @click="handleClose">
                  <AIcon type="CloseOutlined"/>
                </div>
              </div>
            </template>
            <template #content>
              <div class="simple-form">
                <a-input
                    v-model:value="gbID"
                    @change="validField(slotProps)"
                    :placeholder="$t('Channel.index.122695-6')"
                />
                <div
                    class="error"
                    v-if="valid && !valid?.passed"
                >
                  <!-- {{ valid?.reason }} -->
                  {{ $t('Channel.index.122695-7') }}
                </div>
              </div>
              <a-button
                  type="primary"
                  @click="handleSaveGbChannelId(slotProps)"
                  :loading="loading"
                  style="width: 100%"
              >
                {{ $t('Channel.index.122695-8') }}
              </a-button>
            </template>
          </a-popover>
        </a-space>
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
    </FullPage>
  </j-page-container>
</template>

<script setup lang="ts">
import CascadeApi from '../../../api/cascade';
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
    title: $t('Channel.index.122695-11'),
    dataIndex: 'gbChannelId',
    key: 'gbChannelId',
    scopedSlots: true,
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
    title: $t('Cascade.index.122691-24'),
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

const _data = ref('')
/**
 * 验证ID是否存在
 */
const valid = ref<{ passed: string; reason: string }>();
const gbID = ref('');
const params = ref<Record<string, any>>({});

/**
 * 搜索
 * @param params
 */
const handleSearch = (e: any) => {
  params.value = e;
};

/**
 * 取消
 */
 const handleClose = () => {
  _data.value = ''
  valid.value = undefined;
  gbID.value = '';
};

const handleShowPopover = (data: any) => {
  _data.value = data.id
};

const validField = async (data: any) => {
    const { result } = await CascadeApi.validateField(<string>route.query.id, [
        gbID.value,
    ]);
    valid.value = result;
};
const handleSaveGbChannelId = async (data: any) => {
    if (!gbID.value) onlyMessage($t('Channel.index.122695-6'), 'error');
    if (!valid.value?.passed) return;

    loading.value = true;
    const resp = await CascadeApi.updateGbChannelId(data.bindId, {
        gbChannelId: gbID.value,
    });
    loading.value = false;
    if (resp.success) {
        onlyMessage($t('Channel.index.122695-20'));
        listRef.value?.reload();
        valid.value = undefined;
        gbID.value = '';
        _data.value = '';
    } else {
        onlyMessage($t('Channel.index.122695-21'), 'error');
    }
};

const listRef = ref();
const _selectedRowKeys = ref<string[]>([]);
const expandedRowKeys = ref<string[]>([]);

const onSelectNone = () => {
  _selectedRowKeys.value = [];
};

const onSelect = (record: any, selected: boolean, selectedRows: any) => {
  if (selected) {
    _selectedRowKeys.value = [...selectedRows]
  } else {
    _selectedRowKeys.value.splice(_selectedRowKeys.value.findIndex((item) => item.id === record.id), 1)
  }
};

const onAllSelect = (selected: boolean, _: any, keys: any[]) => {
  _selectedRowKeys.value = [..._]
};

const loading = ref(false);
const handleSave = async () => {
  loading.value = true;
  const resp = await CascadeApi.bindCatalogOrChannel(
      route.query.id as string,
      _selectedRowKeys.value.map((item: any) => {
        return {
          id: item.id,
          gbChannelId: item.gbChannelId,
          channelType: item.channelType?.value,
          channelCatalogType: item.channelCatalogType?.value
        }
      }),
  ).finally(() => {
    loading.value = false;  
  })
  if (resp.success) {
    onlyMessage($t('BindChannel.index.122696-12'));
    listRef.value?.reload();
  } else {
    onlyMessage($t('BindChannel.index.122696-13'), 'error');
  }
};

watch(() => listRef.value?.dataSource, (val) => {
  if(val) {
    function treeMap(arr: any[]) {
      arr.forEach((item) => {
        if (item.children) {
          expandedRowKeys.value.push(item.id)
          treeMap(item.children)
        }
        if (item.bind) {
          _selectedRowKeys.value.push(item)
        }
      })
    }
    treeMap(val)
  }
})

onMounted(() => {
  handleSearch({terms: []})
})
</script>
<style lang="less" scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.simple-form {
  margin-bottom: 10px;

  .error {
    color: red;
  }
}
</style>
