<template>
    <div v-if="loading">
        <pro-search
            :columns="columns"
            style="margin-bottom: 0"
            target="AutoVideoPlanLog"
            @search="handleSearch"
        ></pro-search>
        <j-pro-table
            ref="tableRef"
            :columns="columns"
            :params="params"
            mode="table"
            :request="(e) => queryLogs(route.params.id, e)"
        >
            <template #createTime="slotProps">
                {{ dayjs(slotProps.createTime).format('YYYY-MM-DD HH:mm:ss') }}
            </template>
            <template #state="slotProps">
                {{ slotProps.state?.text }}
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
                            :tooltip="{
                                ...i.tooltip,
                            }"
                            @click="i.onClick"
                        >
                            <AIcon :type="i.icon" />
                        </j-permission-button> </template
                ></a-space> </template
        ></j-pro-table>
        <logView
            v-if="logsVisible"
            :data="logData"
            @close="logsVisible = false"
        />
    </div>
</template>

<script setup name="Log">
import { queryLogs } from '../../../../../api/auto';
import dayjs from 'dayjs';
import logView from './logView.vue';
import { useRouteQuery } from '@vueuse/router';
import { onBeforeUnmount } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();
const route = useRoute();
const params = ref();
const tableRef = ref();
const logsVisible = ref(false);
const logData = ref({});

const q = useRouteQuery('q');
const searchTarget = useRouteQuery('target');
const loading = ref(false)

const columns = [
    {
        title: $t('Log.index.312704-0'),
        dataIndex: 'createTime',
        key: 'createTime',
        scopedSlots: true,
        search: {
            type: 'date',
        },
    },
    {
        title: $t('Log.index.312704-1'),
        dataIndex: 'channelId',
        key: 'channelId',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: $t('Log.index.312704-2'),
        dataIndex: 'channelName',
        key: 'channelName',
        ellipsis: true,
        search: {
            type: 'string',
            first: true,
        },
    },
    {
        title: $t('Log.index.312704-3'),
        dataIndex: 'deviceId',
        key: 'deviceId',
        ellipsis: true,
        search: {
            type: 'string',
            first: true,
        },
    },
    {
        title: $t('Log.index.312704-4'),
        dataIndex: 'deviceName',
        ellipsis: true,
        key: 'deviceName',
        search: {
            type: 'string',
        },
    },
    {
        title: $t('Log.index.312704-5'),
        dataIndex: 'state',
        key: 'state',
        scopedSlots: true,
        width: 100,
        search: {
            type: 'select',
            options: [
                { label: $t('Log.index.312704-6'), value: 'success' },
                { label: $t('Log.index.312704-7'), value: 'fail' },
            ],
        },
    },
    {
        title: $t('Log.index.312704-8'),
        key: 'action',
        width: 100,
        scopedSlots: true,
    },
];

const videoTags = inject('video-tags');

/**
 * 搜索
 * @param params
 */
const handleSearch = (e) => {
    params.value = e;
};

const getActions = (data) => {
    if (!data) return [];
    const actions = [
        {
            key: 'view',
            text: $t('Log.index.312704-9'),
            tooltip: {
                title: $t('Log.index.312704-9'),
            },
            icon: 'EyeOutlined',
            onClick: () => {
                logsVisible.value = true;
                logData.value = data;
            },
        },
    ];
    return actions;
};

watch(
    () => q.value,
    () => {
        searchTarget.value = 'AutoVideoPlanLog';
        q.value = encodeURI(
            JSON.stringify({ terms: [{ terms: videoTags.terms }] }),
        );
        setTimeout(() => {
            loading.value = true;
        }, 0);
    },
    { immediate: true, deep: true },
);

onBeforeUnmount(() => {
    videoTags.terms = [];
    q.value = null;
    searchTarget.value = null;
});
</script>

<style lang="less"></style>
