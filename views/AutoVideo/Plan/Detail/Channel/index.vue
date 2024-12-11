<template>
    <div>
        <a-spin :spinning="spinning">
            <div class="channelControl">
                <div class="bind">{{ $t('Channel.index.312709-0') }}{{ bindCount }}</div>
                <a-space v-if="editType">
                    <a-button @click="clearBind">{{ $t('Channel.index.312709-1') }}</a-button>
                    <a-button @click="showBind">{{ $t('Channel.index.312709-2') }}</a-button>
                </a-space>
                <div v-else>
                    <j-permission-button
                        type="link"
                        hasPermission="device/Instance:action"
                        @click="editType = true"
                    >
                        <AIcon type="EditOutlined" />
                    </j-permission-button>
                </div>
            </div>
            <div class="bound">
                <div class="bound_device">
                    <div v-if="showBody">{{ $t('Channel.index.312709-3') }}</div>
                    <ChannelTree
                        ref="treeRef"
                        :height="700"
                        :id="route.params.id"
                        v-model:deviceId="deviceId"
                        v-model:channelId="channelId"
                        @select="treeSelect"
                        @load="onLoad"
                    />
                </div>
                <div v-if="showBody" class="bound_channel">
                    <div style="padding: 12px 24px 0; display: flex">
                        <div class="catalogue">{{ $t('Channel.index.312709-4') }}</div>
                        <a-breadcrumb>
                            <a-breadcrumb-item v-for="name in pathsName">{{
                                name
                            }}</a-breadcrumb-item>
                        </a-breadcrumb>
                    </div>
                    <pro-search
                        :columns="columns"
                        :params="params"
                        type="simple"
                        style="padding-bottom: 0; margin-bottom: 0"
                        @search="handleSearch"
                    ></pro-search>
                    <j-pro-table
                        style="min-height: calc(100% - 60px)"
                        ref="tableRef"
                        model="table"
                        rowKey="channelId"
                        :columns="columns"
                        :request="query"
                        :params="params"
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
                                <template v-if="editType">
                                    <j-permission-button
                                        type="link"
                                        style="padding: 0px"
                                        key="play"
                                        :tooltip="{ title: $t('Channel.index.312709-5') }"
                                        @click="
                                            () => {
                                                onPlay(slotProps);
                                            }
                                        "
                                    >
                                        <AIcon type="VideoCameraOutlined" />
                                    </j-permission-button>

                                    <j-permission-button
                                        type="link"
                                        style="padding: 0px"
                                        key="unbind"
                                        :tooltip="{ title: $t('Channel.index.312709-6') }"
                                        :popConfirm="{
                                            title: $t('Channel.index.312709-7'),
                                            okText: $t('Channel.index.312709-8'),
                                            cancelText: $t('Channel.index.312709-9'),
                                            onConfirm: () => {
                                                unBind(slotProps);
                                            },
                                        }"
                                    >
                                        <AIcon type="DisconnectOutlined" />
                                    </j-permission-button>
                                </template>
                                <template v-else>
                                    <j-permission-button
                                        type="link"
                                        style="padding: 0px"
                                        key="playback"
                                        :tooltip="{ title: $t('Channel.index.312709-10') }"
                                        @click="
                                            () => {
                                                onPlayBack(slotProps);
                                            }
                                        "
                                    >
                                        <AIcon type="HistoryOutlined" />
                                    </j-permission-button>
                                    <j-permission-button
                                        type="link"
                                        style="padding: 0px"
                                        key="logs"
                                        :tooltip="{ title: $t('Channel.index.312709-11') }"
                                        @click="
                                            () => {
                                                onLogs(slotProps);
                                            }
                                        "
                                    >
                                        <AIcon type="ExceptionOutlined" />
                                    </j-permission-button>
                                </template>
                            </j-space>
                        </template>
                    </j-pro-table>
                </div>
            </div>
            <div v-if="showBody && editType">
                <a-button
                    type="primary"
                    :loading="saveLoading"
                    @click="saveChannel"
                    >{{ $t('Channel.index.312709-12') }}</a-button
                >
            </div>
            <div v-if="!showBody" class="video-unbind-tip">{{ $t('Channel.index.312709-13') }}</div>
        </a-spin>

        <Bind
            v-if="bindVisible"
            :cacheDeviceIds="cacheDeviceIds"
            @closeBind="bindVisible = false"
            @submit="submit"
        />
        <PlayBack
            v-if="playbackVisible"
            :data="playbackData"
            :scheduleId="route.params.id"
            @close="playbackVisible = false"
        />
        <Live
            v-model:visible="playerVis"
            :data="playData"
            @refresh="tableRef.reload()"
        />
        <!-- <Logs v-if="logsVisible" @close="logsVisible = false" /> -->
    </div>
</template>

<script setup name="Channel">
import Bind from './Bind.vue';
import ChannelTree from '../../../components/ChannelTree/index.vue';
import PlayBack from '../../../components/Playback/index.vue';
import Live from '../../../../Device/Channel/Live/index.vue';
import {
    bindChannel,
    queryBoundChannel,
    unbindChannel,
    unbindChannelAll,
} from '../../../../../api/auto';
import { cloneDeep } from 'lodash-es';
import { onlyMessage } from '@jetlinks-web/utils';
import { useRequest } from '@jetlinks-web/hooks';
import { Modal } from 'ant-design-vue';
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();
const bindCount = ref(0);
const tableRef = ref();
const treeRef = ref();
const bindVisible = ref(false);
const playbackVisible = ref(false);
const logsVisible = ref(false);
const playbackData = ref();
const route = useRoute();

const editType = ref(false);
const playData = ref();
const playerVis = ref(false);
const pathsName = ref();

const deviceId = ref();
const channelId = ref();
const cacheDeviceIds = ref({});
const unBindChannelIds = ref({});
const currentDeviceId = ref();

const showBody = ref(false);
const saveLoading = ref(false);

const videoTags = inject('video-tags');

const { loading: spinning, run } = useRequest(unbindChannelAll, {
    immediate: false,
    onSuccess: async () => {
        await treeRef.value.getDeviceList();
        showBody.value = false;
        bindCount.value = 0;
    },
});

const params = ref({
    terms: [
        {
            terms: [
                {
                    column: 'channelId$media-record-schedule-bind-channel',
                    value: [
                        {
                            column: 'scheduleId',
                            termType: 'eq',
                            value: route.params.id,
                        },
                    ],
                },
                {
                    column: 'deviceId$media-record-schedule-bind-device',
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
            column: 'deviceId',
            value: deviceId.value,
        },
    ],
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
                { label: $t('Channel.index.312709-18'), value: 'online' },
                { label: $t('Channel.index.312709-19'), value: 'offline' },
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

const onPlay = (record) => {
    playData.value = cloneDeep(record);
    playerVis.value = true;
};

const unBind = (record) => {
    const cacheDevice = cacheDeviceIds.value[deviceId.value];

    const cacheChannelIds = cacheDevice?.channelIds; // 获取当前树节点下缓存
    if (cacheDevice && cacheChannelIds.includes(record.channelId)) {
        // 清除缓存中的通道id
        cacheDeviceIds.value[deviceId.value].channelIds =
            cacheChannelIds.filter((id) => id !== record.channelId);
    } else {
        // 记录后端已绑定的id，保存时统一处理解除
        unBindChannelIds.value[record.channelId] = currentDeviceId.value;
    }
    tableRef.value.reload();
};

const onPlayBack = (record) => {
    console.log('onPlayBack', record);
    playbackData.value = cloneDeep(record);
    playbackVisible.value = true;
};

const onLogs = (record) => {
    videoTags.terms = [
        {
            column: 'channelId',
            termType: 'eq',
            value: record.channelId,
        },
    ];
    videoTags.tag.value = 'Log';
};
const showBind = () => {
    bindVisible.value = true;
};
/**
 * 搜索
 * @param params
 */
const handleSearch = (e) => {
    params.value = e;
};

const clearBind = () => {
    Modal.confirm({
        title: $t('Channel.index.312709-21'),
        onOk() {
            run(route.params.id);
            cacheDeviceIds.value = {};
        },
    });
};

const submit = (data) => {
    cacheDeviceIds.value = { ...data };
    treeRef.value.getDeviceList({ ...data });
    bindVisible.value = false;
    tableRef.value?.reload();
};

const query = (params) => {
    const _params = params;
    const defaultParams = {
        terms: [
            {
                terms: [
                    {
                        column: 'channelId$media-record-schedule-bind-channel',
                        value: [
                            {
                                column: 'scheduleId',
                                termType: 'eq',
                                value: route.params.id,
                            },
                        ],
                    },
                    {
                        column: 'deviceId$media-record-schedule-bind-device',
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
        ],
    };

    if (deviceId.value) {
        defaultParams.terms.push({
            column: 'deviceId',
            value: deviceId.value,
            type: 'and',
        });
    }

    if (cacheDeviceIds.value[deviceId.value]) {
        defaultParams.terms.push({
            column: 'channelId',
            termType: 'in',
            value: cacheDeviceIds.value[deviceId.value].channelIds.toString(),
            type: 'or',
        });
    }

    const keys = Object.keys(unBindChannelIds.value);
    if (keys.length) {
        defaultParams.terms.push({
            column: 'channelId',
            termType: 'nin',
            value: keys.toString(),
            type: 'and',
        });
    }

    _params.terms = [...defaultParams.terms, ..._params.terms];

    return queryBoundChannel(_params);
};

const saveChannel = async () => {
    const terms = [];
    Object.values(cacheDeviceIds.value).forEach(
        ({ channelIds, channelCatalog, paths }) => {
            const [deviceId] = paths;
            terms.push(
                ...channelIds.map((id) => ({
                    deviceId: deviceId,
                    channelId: id,
                    others: {
                        channelCatalog: channelCatalog.join('\/'),
                    },
                })),
            );
        },
    );

    saveLoading.value = true;
    const resp = await bindChannel(route.params.id, terms).finally(() => {
        saveLoading.value = false;
    });
    if (resp.success) {
        cacheDeviceIds.value = {};
        
    }
    const keys = Object.keys(unBindChannelIds.value);
    if (keys.length) {
        const unBindTerms = keys.map((channelId) => ({
            deviceId: unBindChannelIds.value[channelId],
            channelId,
        }));
        await unbindChannel(route.params.id, unBindTerms);
    }
    treeRef.value.getDeviceList();
    await getBindTotal();
    onlyMessage($t('Channel.index.312709-22'));
    editType.value = false;
};

const treeSelect = ({ node }) => {
    const { paths, channelCatalog } = node;

    currentDeviceId.value = paths[0];
    pathsName.value = channelCatalog;
    tableRef.value?.reload();
};

const getBindTotal = () => {
    const defaultParams = {
        terms: [
            {
                terms: [
                    {
                        column: 'channelId$media-record-schedule-bind-channel',
                        value: [
                            {
                                column: 'scheduleId',
                                termType: 'eq',
                                value: route.params.id,
                            },
                        ],
                    },
                    {
                        column: 'deviceId$media-record-schedule-bind-device',
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
        ],
    };
    queryBoundChannel(defaultParams).then((resp) => {
        if (resp.success) {
            bindCount.value = resp.result.total;
        }
    });
};

const onLoad = (data) => {
    showBody.value = data.length;
};

getBindTotal();
</script>

<style lang="less" scoped>
.channelControl {
    display: flex;
    align-items: center;
    .bind {
        margin-right: 20px;
    }
}
.bound {
    margin-top: 20px;
    display: flex;
    .bound_device {
        width: 230px;
    }
    .bound_channel {
        flex: 1 1 0;
        .catalogue {
            color: #1a1a1a;
        }
        :deep(.ant-breadcrumb-link) {
            color: #777777;
        }
    }
}

.video-unbind-tip {
    width: 100%;
    height: 100%;
    text-align: center;
    padding-top: 100px;
}
</style>
