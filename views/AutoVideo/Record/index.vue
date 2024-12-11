<template>
    <j-page-container>
        <FullPage>
            <div class="bound">
                <div class="bound_device">
                    <div>{{ $t('Record.index.312702-0') }}</div>
                    <ChannelTree
                        :height="700"
                        type="unbind"
                        v-model:deviceId="deviceId"
                        v-model:channelId="channelId"
                        @select="treeSelect"
                    />
                </div>
                <div class="bound_channel">
                    <div style="padding: 12px 24px 0;display: flex">
                        <div class="catalogue">{{ $t('Record.index.312702-1') }}</div>
                        <a-breadcrumb>
                            <a-breadcrumb-item v-for="name in pathsName">{{
                                name
                            }}</a-breadcrumb-item>
                        </a-breadcrumb>
                    </div>
                    <pro-search
                        :columns="columns"
                        @search="handleSearch"
                        :params="params"
                          target="auto-video-record"
                        style="padding-bottom: 0; margin-bottom: 0"
                    ></pro-search>
                    <j-pro-table
                        style="max-height: calc(100vh - 276px)"
                        ref="tableRef"
                        :columns="columns"
                        mode="table"
                        :params="params"
                        :request="query"
                    >
                        <template #fileSize="slotProps">
                            {{slotProps.fileSize ? (slotProps.fileSize / 1024 / 1024).toFixed(2):0 }}M
                        </template>
                        <template #duration="slotProps">
                            {{ slotProps.duration ?formatTime(slotProps.duration) :0 }}
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
                                        type="link"
                                        style="padding: 0px"
                                        :tooltip="{
                                            ...i.tooltip,
                                        }"
                                        @click="i.onClick"
                                    >
                                        <AIcon :type="i.icon" />
                                    </j-permission-button> </template
                            ></a-space> </template
                    ></j-pro-table>
                </div>
            </div>
            <PlayBack :data="playbackData" v-if="playbackVisible" @close="playbackVisible = false"/>
        </FullPage>
    </j-page-container>
</template>

<script setup>
import { cloneDeep } from 'lodash-es';
import ChannelTree from '../components/ChannelTree/index.vue';
import PlayBack from '../components/Playback/index.vue';
import { queryRecord } from '../../../api/auto';
import { formatTime } from '../../../utils/utils';
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();
const playbackData = ref();
const playbackVisible = ref(false);
const params = ref();
const deviceId = ref();
const channelId = ref();
const tableRef = ref();
const pathsName = ref();

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
        title: $t('Record.index.312702-2'),
        dataIndex: 'name',
        key: 'name',
        ellipsis: true,
        search: {
            type: 'string',
            first: true,
        },
    },
    {
        title: $t('Record.index.312702-3'),
        dataIndex: 'manufacturer',
        key: 'manufacturer',
        ellipsis: true,
    },
    {
        title: $t('Record.index.312702-4'),
        dataIndex: 'address',
        ellipsis: true,
        key: 'address',
        search: {
            type: 'string',
        },
    },
    {
        title: $t('Record.index.312702-5'),
        scopedSlots: true,
        key:'duration',
        dataIndex:'duration',
    },
    {
        title: $t('Record.index.312702-6'),
        scopedSlots: true,
        key:'fileSize',
        dataIndex:'fileSize',
    },
    {
        title: $t('Record.index.312702-7'),
        key: 'action',
        width: 100,
        scopedSlots: true,
    },
];

/**
 * 搜索
 * @param params
 */
const handleSearch = (e) => {
    params.value = e;
};

const getActions = (data, type) => {
    if (!data) return [];
    const actions = [
        {
            key: 'backPlay',
            text: $t('Record.index.312702-8'),
            tooltip: {
                title: $t('Record.index.312702-8'),
            },
            icon: 'PlayCircleOutlined',
            onClick: () => {
                playbackData.value = cloneDeep(data);
                playbackVisible.value = true;
            },
        },
    ];
    return actions;
};

const query = (params) => {
    const _params = params;
    const defaultParams = {
        terms:[]
    };

    if (deviceId.value) {
        defaultParams.terms?.push({
            column: 'deviceId',
            value: deviceId.value,
            type: 'and',
        });
    }

    if (channelId.value) {
        defaultParams.terms?.push({
            column: 'channelId',
            //   termType: 'in',
            value: channelId.value,
            type: 'or',
        });
    }

    _params.terms = [...defaultParams.terms, ..._params.terms];

    return queryRecord('video',_params);
};

const treeSelect = ({ node }) => {
    const {  channelCatalog } = node;
    pathsName.value = channelCatalog;
};

watch(() => [deviceId.value, channelId.value], () => {
  tableRef.value.reload()
}, { deep: true })

</script>

<style lang="less" scoped>
.bound {
    padding: 0 20px;
    margin-top: 20px;
    display: flex;
    .bound_device {
        flex: 1;
    }
    .bound_channel {
        flex: 4;
        .catalogue{
            color:#1A1A1A
        }
        :deep(.ant-breadcrumb-link){
            color:#777777
        }
    }
}
</style>
