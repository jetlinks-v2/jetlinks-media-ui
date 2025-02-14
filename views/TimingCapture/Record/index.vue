<template>
    <j-page-container>
        <FullPage>
            <div class="bound">
                <div class="bound_device">
                    <div>{{ $t('Record.index.855180-0') }}</div>
                    <ChannelTree
                        :height="700"
                        type="unbind"
                        v-model:deviceId="deviceId"
                        v-model:channelId="channelId"
                        @select="treeSelect"
                    />
                </div>
                <div v-if="deviceId" class="bound_channel">
                    <div style="padding: 12px 24px 0;display: flex">
                        <div class="catalogue">{{ $t('Record.index.855180-1') }}</div>
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
                        target="timing-capture-record"
                        style="padding-bottom: 0; margin-bottom: 0"
                    ></pro-search>
                    <FullPage>
                        <j-pro-table
                            style="min-height: calc(100vh - 276px)"
                            ref="tableRef"
                            :columns="columns"
                            mode="table"
                            :params="params"
                            :request="query"
                        >
                        <template #fileSize="slotProps">
                            {{slotProps.fileSize ? (slotProps.fileSize / 1024 / 1024).toFixed(2):0 }}M
                        </template>
                            <template #action="slotProps">
                                <a-space :size="16">
                                    <template
                                        v-for="i in getActions(
                                            slotProps,
                                            'table',
                                        )"
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
                    </FullPage>
                </div>
                <div v-else  class="bound_channel_empty">
                    <j-empty></j-empty>
                </div>
            </div>
            <RecordPicture
                v-if="pictureVisible"
                :data="pictureData"
                @close="pictureVisible = false"
            />
        </FullPage>
    </j-page-container>
</template>

<script setup>
import { cloneDeep } from 'lodash-es';
import ChannelTree from '../../AutoVideo/components/ChannelTree/index.vue';
import RecordPicture from '../components/RecordPicture/index.vue';
import { queryRecord } from '../../../api/auto';
import i18n from '@/locales/index'
const $t = i18n.global.t
const pictureData = ref();
const pictureVisible = ref(false);
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
        title: $t('Record.index.855180-2'),
        dataIndex: 'name',
        key: 'name',
        ellipsis: true,
        search: {
            type: 'string',
            first: true,
        },
    },
    {
        title: $t('Record.index.855180-3'),
        dataIndex: 'manufacturer',
        key: 'manufacturer',
        ellipsis: true,
    },
    {
        title: $t('Record.index.855180-4'),
        dataIndex: 'address',
        ellipsis: true,
        key: 'address',
        search: {
            type: 'string',
        },
    },
    {
        title: $t('Record.index.855180-5'),
        dataIndex:'fileCount',
    },
    {
        title: $t('Record.index.855180-6'),
        scopedSlots: true,
        key:'fileSize',
        dataIndex:'fileSize',
    },
    {
        title: $t('Record.index.855180-7'),
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
            key: 'picture',
            text: $t('Record.index.855180-8'),
            tooltip: {
                title: $t('Record.index.855180-8'),
            },
            icon: 'EyeOutlined',
            onClick: () => {
                pictureData.value = cloneDeep(data);
                pictureData.value.pathsName = pathsName.value
                pictureVisible.value = true;
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

    return queryRecord( 'screenshot',_params);
};

const treeSelect = ({ node }) => {
    const {  channelCatalog } = node;
    pathsName.value = channelCatalog;
};

watch(() => [deviceId.value, channelId.value], () => {
  tableRef.value?.reload()
}, { deep: true })

</script>

<style lang="less" scoped>
.bound {
    padding: 24px;
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
    .bound_channel_empty{
        flex: 4;
        margin-top: 15%
    }
}
</style>
