<!-- 国标级联-通道列表 -->
<template>
  <j-page-container>
    <pro-search :columns="columns" target="media" @search="handleSearch"/>
    <FullPage>
      <JProTable
          ref="listRef"
          mode="table"
          :columns="columns"
          :request="
                    (e) => CascadeApi.queryBindChannel(route?.query.id, e)
                "
          :defaultParams="{
                    sorts: [{ name: 'name', order: 'desc' }],
                }"
          :params="params"
          :rowSelection="{
                    selectedRowKeys: _selectedRowKeys,
                    onSelect: onSelectChange,
                    onSelectAll: selectAll,
                    onSelectNone: cancelSelectAll,
                }"
      >
        <template #headerLeftRender>
          <h3>{{ $t('Channel.index.122695-0') }}</h3>
        </template>
        <template #headerRightRender>
          <a-space>
            <a-button type="primary" @click="bindVis = true">
              {{ $t('Channel.index.122695-1') }}
            </a-button>
            <j-permission-button
                type="primary"
                :popConfirm="{
                                title: $t('Channel.index.122695-2'),
                                onConfirm: handleMultipleUnbind,
                            }"
            >{{ $t('Channel.index.122695-3') }}
            </j-permission-button
            >
          </a-space>
        </template>
        <template #gbChannelIdHeader="title">
          <a-tooltip
              :title="$t('Channel.index.122695-4')"
          >
            <a-space>
              <span>{{ title }}</span>
              <AIcon type="InfoCircleOutlined"/>
            </a-space>
          </a-tooltip>
        </template>
        <template #gbChannelId="slotProps">
          <div style="display: flex; align-items: center">
            <j-ellipsis style="width: 150px">
              {{ slotProps.gbChannelId }}
            </j-ellipsis>
            <a-button type="link" @click="handleShowPopover(slotProps)">
              <AIcon type="EditOutlined"/>
            </a-button>
            <a-popover
                v-if="_data === slotProps.channelId"
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
                    @click="handleSave(slotProps)"
                    :loading="loading"
                    style="width: 100%"
                >
                  {{ $t('Channel.index.122695-8') }}
                </a-button>
              </template>
            </a-popover>
          </div>
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
        <template #action="slotProps">
          <a-space :size="16">
            <template
                v-for="i in getActions(slotProps, 'table')"
                :key="i.key"
            >
              <j-permission-button
                  :disabled="i.disabled"
                  :popConfirm="i.popConfirm"
                  :tooltip="{
                                    ...i.tooltip,
                                }"
                  @click="i.onClick"
                  type="link"
                  style="padding: 0 5px"
              >
                <template #icon
                >
                  <AIcon :type="i.icon"
                  />
                </template>
              </j-permission-button>
            </template>
          </a-space>
        </template>
      </JProTable>
    </FullPage>

    <BindChannel v-if="bindVis" @submit="submitData" @cancel="cancel"/>
  </j-page-container>
</template>

<script setup lang="ts">
import CascadeApi from '../../../api/cascade';
import {onlyMessage} from '@jetlinks-web/utils';
import BindChannel from './BindChannel/index.vue';
import {useI18n} from 'vue-i18n';

const {t: $t} = useI18n();
const route = useRoute();

const columns = [
  {
    title: $t('Channel.index.122695-9'),
    dataIndex: 'deviceName',
    key: 'deviceName',
    // width: 200,
    // fixed: 'left',
    ellipsis: true,
    search: {
      type: 'string',
    },
  },
  {
    title: $t('Channel.index.122695-10'),
    dataIndex: 'name',
    ellipsis: true,
    key: 'name',
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
    width: 200,
    headerCell: 'gbChannelIdHeader', // 表头单元格插槽
    search: {
      type: 'string',
    },
  },
  {
    title: $t('Channel.index.122695-12'),
    dataIndex: 'address',
    key: 'address',
    ellipsis: true,
    search: {
      type: 'string',
    },
  },
  {
    title: $t('Channel.index.122695-13'),
    dataIndex: 'manufacturer',
    key: 'manufacturer',
    ellipsis: true,
    search: {
      type: 'string',
    },
  },
  {
    title: $t('Channel.index.122695-14'),
    dataIndex: 'status',
    key: 'status',
    scopedSlots: true,
    width: 150,
    search: {
      type: 'select',
      options: [
        {label: $t('Channel.index.122695-15'), value: 'online'},
        {label: $t('Channel.index.122695-16'), value: 'offline'},
      ],
      handleValue: (v: any) => {
        return v;
      },
    },
  },
  {
    title: $t('Channel.index.122695-17'),
    key: 'action',
    width: 100,
    scopedSlots: true,
  },
];

const params = ref<Record<string, any>>({});
const _data = ref('')

const handleSearch = (e: any) => {
  if (e.terms[0]?.terms[0]?.column === 'gbChannelId') {
    params.value = {
      terms: [
        {
          column: 'id$gb28181-cascade-channel',
          value: [
            {
              column: 'gb_channel_id',
              termType: e.terms[0]?.terms[0]?.termType,
              value: e.terms[0]?.terms[0]?.value,
            },
          ],
        },
        {
          terms: [
            {
              column: 'id$gb28181-cascade-channel',
              value: [
                {
                  column: 'gb_channel_id',
                  termType: 'isnull',
                  value: '1',
                },
              ],
            },
            {
              column: 'channelId',
              termType: e.terms[0]?.terms[0]?.termType,
              value: e.terms[0]?.terms[0]?.value,
            },
          ],
          type: 'or',
        },
      ],
    };
  } else {
    params.value = e;
  }
};

const listRef = ref();
const _selectedRowKeys = ref<string[]>([]);
const bindVis = ref(false);

const channelIdMap = new Map();
const onSelectChange = (row: any, selected: Boolean) => {
  const arr = new Set(_selectedRowKeys.value);
  if (selected) {
    arr.add(row.id);
    channelIdMap.set(row.id, row.channelId);
  } else {
    arr.delete(row.id);
    channelIdMap.delete(row.id);
  }
  _selectedRowKeys.value = [...arr.values()];
};
const selectAll = (selected: Boolean, selectedRows: any, changeRows: any) => {
  if (selected) {
    changeRows.map((i: any) => {
      if (!_selectedRowKeys.value.includes(i.id)) {
        _selectedRowKeys.value.push(i.id);
        channelIdMap.set(i.id, i.channelId);
      }
    });
  } else {
    const arr = changeRows.map((item: any) => item.id);
    const _ids: string[] = [];
    _selectedRowKeys.value.map((i: any) => {
      if (!arr.includes(i)) {
        _ids.push(i);
      } else {
        channelIdMap.delete(i);
      }
    });
    _selectedRowKeys.value = _ids;
  }
};

const cancelSelectAll = () => {
  _selectedRowKeys.value = [];
  channelIdMap.clear();
};
/**
 * 表格操作按钮
 * @param data 表格数据项
 * @param type 表格展示类型
 */
const getActions = (
    data: Partial<Record<string, any>>,
    type: 'card' | 'table',
): any => {
  if (!data) return [];
  const actions = [
    {
      key: 'delete',
      text: $t('Channel.index.122695-18'),
      tooltip: {
        title: $t('Channel.index.122695-18'),
      },
      icon: 'DisconnectOutlined',
      popConfirm: {
        title: $t('Channel.index.122695-19'),
        onConfirm: () => {
          const response = CascadeApi.unbindChannel(
              route.query.id as string,
              [data.channelId],
          );
          response.then((resp) => {
            if (resp.success) {
              onlyMessage($t('Channel.index.122695-20'));
              listRef.value?.reload();
            } else {
              onlyMessage($t('Channel.index.122695-21'), 'error');
            }
          });
          return response
        },
      },
    },
  ];
  return actions;
};

/**
 * 批量解绑
 */
const handleMultipleUnbind = async () => {
  if (!_selectedRowKeys.value.length) {
    onlyMessage($t('Channel.index.122695-22'), 'error');
    return;
  }
  const resp = await CascadeApi.unbindChannel(route.query.id as string, [
    ...channelIdMap.values(),
  ]);
  if (resp.success) {
    onlyMessage($t('Channel.index.122695-20'));
    _selectedRowKeys.value = [];
    channelIdMap.clear();
    listRef.value?.reload();
  } else {
    onlyMessage($t('Channel.index.122695-21'), 'error');
  }
};

/**
 * 编辑国标ID
 */
const gbID = ref('');
const loading = ref(false);
const handleSave = async (data: any) => {
  if (!gbID.value) onlyMessage($t('Channel.index.122695-6'), 'error');
  if (!valid.value?.passed) return;

  loading.value = true;
  const resp = await CascadeApi.updateGbChannelId(data.id, {
    gbChannelId: gbID.value,
  });
  loading.value = false;
  if (resp.success) {
    onlyMessage($t('Channel.index.122695-20'));
    listRef.value?.reload();
    valid.value = undefined;
    gbID.value = '';
    _data.value = ''
  } else {
    onlyMessage($t('Channel.index.122695-21'), 'error');
  }
};

/**
 * 验证ID是否存在
 */
const valid = ref<{ passed: string; reason: string }>();
const validField = async (data: any) => {
  const {result} = await CascadeApi.validateField(data.cascadeId, [
    gbID.value,
  ]);
  valid.value = result;
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
  _data.value = data.channelId
};

watch(() => _data.value, () => {
  const arr = listRef.value?.dataSource || []
  const dt = arr.find((i: any) => _data.value === i.id)
}, {
  immediate: true
})

const cancel = () => {
  bindVis.value = false
}
const submitData = () => {
  bindVis.value = false
  listRef.value?.reload()
}
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
