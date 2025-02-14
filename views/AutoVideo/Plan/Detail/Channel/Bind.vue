<template>
    <a-modal
        visible
        :title="$t('Channel.Bind.3127010-0')"
        :width="1200"
        @cancel="emit('closeBind')"
        @ok="submit"
    >
        <div class="bindControl">
            <div class="bind_left">
                <div>{{ $t('Channel.Bind.3127010-1') }}</div>
                <ChannelTree
                    type="unBind"
                    v-model:deviceId="deviceId"
                    v-model:channelId="channelId"
                    @select="selectDevice"
                />
            </div>
            <div class="bind_right">
                <div style="padding: 12px 24px 0;display: flex;">
                    <div class="catalogue">{{ $t('Channel.Bind.3127010-2') }}</div>
                    <a-breadcrumb>
                        <a-breadcrumb-item v-for="name in pathsName">{{
                            name
                        }}</a-breadcrumb-item>
                    </a-breadcrumb>
                </div>
                <pro-search
                    :columns="columns"
                    style="padding-bottom: 0;"
                    type="simple"
                    @search="handleSearch"
                ></pro-search>
                <div style="height: 500px">
                  <j-pro-table
                      v-if="deviceId"
                      style="min-height: calc(100% - 60px); padding-top: 0"
                      ref="tableRef"
                      mode="table"
                      rowKey="channelId"
                      :columns="columns"
                      :request="query"
                      :params="params"
                      :rowSelection="{
                        selectedRowKeys: _selectedRowKeys,
                        onSelect: onSelectChange,
                        onSelectAll: selectAll,
                        onSelectNone: () => (_selectedRowKeys = []),
                    }"
                  >
                    <template #status="slotProps">
                      <BadgeStatus
                          :text="slotProps.status.text"
                          :status="slotProps.status.value"
                          :statusNames="{
                                online: 'success',
                                offline: 'error',
                            }"
                      />
                    </template>
                    <template #action="slotProps">
                      <j-space :size="16">
                        <template
                            v-for="i in getActions(slotProps, 'table')"
                            :key="i.key"
                        >
                          <j-permission-button
                              :disabled="i.disabled"
                              :popConfirm="i.popConfirm"
                              type="link"
                              :tooltip="{
                                        ...i.tooltip,
                                    }"
                              @click="i.onClick"
                          >
                            <AIcon :type="i.icon" />
                          </j-permission-button> </template
                        ></j-space> </template
                    ></j-pro-table>
                </div>
            </div>
        </div>
    </a-modal>
    <Live
        v-model:visible="playerVis"
        :data="playData"
        @refresh="tableRef.reload()"
    />
</template>

<script setup>
import ChannelTree from '../../../components/ChannelTree/index.vue';
import Live from '../../../../Device/Channel/Live/index.vue';
import { queryBoundChannel } from '../../../../../api/auto';
import { cloneDeep, omit } from 'lodash-es';
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();
const emit = defineEmits(['closeBind', 'submit']);

const props = defineProps({
    cacheDeviceIds: {
        type: Object,
        default: () => ({}),
    },
});

const tableRef = ref();

const _selectedRowKeys = ref([]);
const playData = ref();
const playerVis = ref(false);
const route = useRoute();

const deviceId = ref();
const channelId = ref();
const params = ref();

const cacheSelected = ref({});

const pathsName = computed(() => {
    if (cacheSelected.value[deviceId.value]) {
        return cacheSelected.value[deviceId.value].channelCatalog;
    }
    return [];
});

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
        title: $t('Channel.Bind.3127010-3'),
        dataIndex: 'name',
        key: 'name',
        ellipsis: true,
        search: {
            type: 'string',
            first: true,
        },
    },
    {
        title: $t('Channel.Bind.3127010-4'),
        dataIndex: 'manufacturer',
        key: 'manufacturer',
        ellipsis: true,
    },
    {
        title: $t('Channel.Bind.3127010-5'),
        dataIndex: 'address',
        ellipsis: true,
        key: 'address',
        search: {
            type: 'string',
        },
    },
    {
        title: $t('Channel.Bind.3127010-6'),
        dataIndex: 'status',
        key: 'status',
        scopedSlots: true,
        width: 100,
        search: {
            type: 'select',
            options: [
                { label: $t('Channel.Bind.3127010-7'), value: 'online' },
                { label: $t('Channel.Bind.3127010-8'), value: 'offline' },
            ],
        },
    },
    {
        title: $t('Channel.Bind.3127010-9'),
        key: 'action',
        width: 80,
        scopedSlots: true,
    },
];
const getActions = (data, type) => {
    if (!data) return [];
    return [
        {
            key: 'view',
            text: $t('Channel.Bind.3127010-10'),
            tooltip: {
                title: $t('Channel.Bind.3127010-10'),
            },
            icon: 'PlayCircleOutlined',
            onClick: () => {
                playData.value = cloneDeep(data);
                playerVis.value = true;
            },
        },
    ];
};
const onSelectChange = (item, state) => {
    const oldChannelIds = cacheSelected.value[deviceId.value].channelIds;
    const arr = new Set([..._selectedRowKeys.value, ...oldChannelIds]);

    const currentDeviceChannel  = new Set([...oldChannelIds])
    if (state) {
        arr.add(item.channelId);
        currentDeviceChannel.add(item.channelId)
    } else {
        arr.delete(item.channelId);
        currentDeviceChannel.delete(item.channelId)
    }
    _selectedRowKeys.value = [...arr.values()];

    cacheSelected.value[deviceId.value].channelIds = [...currentDeviceChannel.values()];
};
const selectAll = (selected, selectedRows, changeRows) => {
    const oldChannelIds = cacheSelected.value[deviceId.value].channelIds;
    const selectedKeys = new Set([...oldChannelIds, ..._selectedRowKeys.value]);
    const currentDeviceChannel  = new Set([...oldChannelIds])
    if (selected) {
        changeRows.map((i) => {
            selectedKeys.add(i.channelId);
        });
        changeRows.map((i) => {
            currentDeviceChannel.add(i.channelId);
        });
    } else {
        changeRows.map((i) => {
            selectedKeys.delete(i.channelId);
        });
        changeRows.map((i) => {
            currentDeviceChannel.delete(i.channelId);
        });
    }

    cacheSelected.value[deviceId.value].channelIds = [...currentDeviceChannel.values()];
    _selectedRowKeys.value = [...selectedKeys.values()];
};

const selectDevice = ({ dId, node }) => {
    const _selectMap = { ...cacheSelected.value };

    if (!_selectMap[node.id]) {
        _selectMap[node.id] = {
            paths: node.paths,
            channelCatalog: node.channelCatalog,
            channelIds: [],
        };

        cacheSelected.value = _selectMap;
    }

    handleSearch([]);
};

const query = (queryParams) => {
    const _params = queryParams;
    const defaultParams = {
        terms: [
            {
                terms: [
                    {
                        column: 'channelId$media-record-schedule-bind-channel$not',
                        value: [
                            {
                                column: 'scheduleId',
                                termType: 'eq',
                                value: route.params.id,
                            },
                        ],
                    },
                ],
            },
            {
                column: 'catalogType',
                termType: 'eq',
                value: 'device',
                type: 'and',
            },
        ],
    };

    // 获取缓存中的绑定通道
    if (props.cacheDeviceIds[deviceId.value]) {
        const { channelIds } = props.cacheDeviceIds[deviceId.value];
        defaultParams.terms.push({
            column: 'channelId',
            termType: 'nin',
            value: channelIds.toString(),
            type: 'and',
        });
    }

    if (deviceId.value) {
        defaultParams.terms.push({
            column: 'deviceId',
            value: deviceId.value,
            type: 'and',
        });
    }

    _params.terms = [...defaultParams.terms, ..._params.terms];

    return queryBoundChannel(_params);
};

const handleSearch = (e) => {
    params.value = e;
};

const submit = () => {
    const paths = [];
    Object.keys(cacheSelected.value).forEach((key) => {
        if (!cacheSelected.value[key].channelIds.length) {
            paths.push(key);
        }
    });
    emit('submit', omit(cacheSelected.value, paths));
};

onMounted(() => {
    if (Object.keys(props.cacheDeviceIds)) {
        cacheSelected.value = cloneDeep(props.cacheDeviceIds);
    }
});
</script>
<style lang="less" scoped>
.bindControl {
    display: flex;
    .bind_left {
        width: 230px;
    }
    .bind_right {
        flex: 1 1 0;
        .catalogue{
            color:#1A1A1A
        }
        :deep(.ant-breadcrumb-link){
            color:#777777
        }
    }
}
</style>
