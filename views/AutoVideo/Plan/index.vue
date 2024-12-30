<template>
    <j-page-container>
        <pro-search
            :columns="columns"
            target="auto-video-plan"
            @search="handleSearch"
        />

        <FullPage>
            <j-pro-table
                ref="tableRef"
                :columns="columns"
                mode="CARD"
                :defaultParams="{
                    sorts: [{ name: 'createTime', order: 'desc' }],
                    terms: [
                        {
                            column: 'type',
                            value: 'video',
                        },
                    ],
                }"
                :gridColumn="2"
                :gridColumns="[1, 2]"
                :request="queryList"
                :params="params"
            >
                <template #headerLeftRender>
                    <j-permission-button
                        type="primary"
                        @click="handleAdd"
                        hasPermission="media/AutoVideo/Plan:add"
                    >
                        <template #icon><AIcon type="PlusOutlined" /></template>
                        {{ $t('Plan.index.312701-0') }}
                    </j-permission-button>
                </template>
                <template #card="slotProps">
                    <CardBox
                        @click="() => handleClick(slotProps)"
                        :value="slotProps"
                        :actions="getActions(slotProps, 'card')"
                        v-bind="slotProps"
                        :showStatus="true"
                        :status="slotProps.state.value"
                        :statusText="
                            slotProps.state?.value === 'enabled'
                                ? $t('Plan.index.312701-1')
                                : $t('Plan.index.312701-2')
                        "
                        :statusNames="{
                            enabled: 'processing',
                            disabled: 'error',
                        }"
                    >
                        <template #img>
                            <slot name="img">
                                <img :src="deviceImg.deviceMedia" alt=""/>
                            </slot>
                        </template>
                        <template #content>
                            <j-ellipsis style="width: calc(100% - 100px)">
                                <span style="font-size: 16px; font-weight: 700">
                                    {{ slotProps.name }}
                                </span>
                            </j-ellipsis>
                            <a-row>
                                <a-col :span="6">
                                    <div class="card-item-content-text">
                                        {{ $t('Plan.index.312701-3') }}
                                    </div>
                                    <j-ellipsis style="width: calc(100% - 20px)">
                                        <div>{{ slotProps.id }}</div>
                                    </j-ellipsis>
                                </a-col>
                                <a-col :span="6">
                                    <div class="card-item-content-text">
                                        {{ $t('Plan.index.312701-4') }}
                                    </div>
                                    <div>
                                        {{
                                            dayjs(slotProps.createTime).format(
                                                'YYYY-MM-DD HH:mm:ss',
                                            )
                                        }}
                                    </div>
                                </a-col>
                                <a-col :span="6">
                                    <div class="card-item-content-text">
                                        {{ $t('Plan.index.312701-5') }}
                                    </div>
                                    <j-ellipsis
                                        style="width: calc(100% - 20px)"
                                        >{{ slotProps.saveDays}}</j-ellipsis
                                    >
                                </a-col>
                                <a-col :span="6">
                                    <div class="card-item-content-text">
                                        {{ $t('Plan.index.312701-6') }}
                                    </div>
                                    <div>
                                        {{
                                            slotProps.others?.trigger === 'week'
                                                ? $t('Plan.index.312701-7')
                                                : $t('Plan.index.312701-8')
                                        }}
                                    </div>
                                </a-col>
                            </a-row>
                        </template>
                        <template #actions="item">
                            <j-permission-button
                                :disabled="item.disabled"
                                :popConfirm="item.popConfirm"
                                :tooltip="{
                                    ...item.tooltip,
                                }"
                                @click="item.onClick"
                                :hasPermission="'media/AutoVideo/Plan:' + item.key"
                            >
                                <AIcon
                                    type="DeleteOutlined"
                                    v-if="item.key === 'delete'"
                                />
                                <template v-else>
                                    <AIcon :type="item.icon" />
                                    <span>{{ item?.text }}</span>
                                </template>
                            </j-permission-button>
                        </template>
                    </CardBox>
                </template>
            </j-pro-table>
        </FullPage>
    </j-page-container>
    <AddPlan v-if="addVisible" @closeModal="addVisible = false"></AddPlan>
</template>

<script setup>
import { onlyMessage } from '@jetlinks-web/utils';
import { useMenuStore } from '@/store/menu';
import AddPlan from './Add/index.vue';
import dayjs from 'dayjs';
import { queryList, controlPlan, deletePlan } from '../../../api/auto';
import { deviceImg } from "../../../assets";
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();
const addVisible = ref(false);
const params = ref();
const menuStory = useMenuStore();
const tableRef = ref();

const columns = [
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        width: 200,
        fixed: 'left',
        search: {
            type: 'string',
        },
        ellipsis: true,
    },
    {
        title: $t('Plan.index.312701-9'),
        dataIndex: 'name',
        key: 'name',
        search: {
            type: 'string',
            first: true,
        },
        ellipsis: true,
    },
    {
        title: $t('Plan.index.312701-10'),
        dataIndex: 'state',
        key: 'state',
        width: 100,
        search: {
            type: 'select',
            options: [
                { label: $t('Plan.index.312701-1'), value: 'enabled' },
                { label: $t('Plan.index.312701-2'), value: 'disabled' },
            ],
        },
    },
];

const getActions = (data, type) => {
    if (!data) return [];
    const actions = [
        {
            key: 'update',
            text: $t('Plan.index.312701-11'),
            tooltip: {
                title: $t('Plan.index.312701-11'),
            },
            icon: 'EditOutlined',
            onClick: () => {
                menuStory.jumpPage(
                    'media/AutoVideo/Plan/Detail',
                  {
                    params:{
                        id: data.id,
                    },
                    query:{
                        type: 'edit',
                    },
                  }
                );
            },
        },
        {
            key: 'action',
            text: data.state.value === 'enabled' ? $t('Plan.index.312701-2') : $t('Plan.index.312701-12'),
            tooltip: {
                title: data.state.value === 'enabled' ? $t('Plan.index.312701-2') : $t('Plan.index.312701-12'),
            },
            icon:
                data.state.value === 'enabled'
                    ? 'StopOutlined'
                    : 'CheckCircleOutlined',
            popConfirm: {
                title: $t('Plan.index.359377-0', [data.state.value === 'enabled' ? $t('Plan.index.312701-2') : $t('Plan.index.312701-12')]),
                onConfirm: async () => {
                    const params = {
                        state:
                            data.state.value === 'enabled'
                                ? 'disabled'
                                : 'enabled',
                    };
                    const res = await controlPlan(data.id, params);
                    if (res.success) {
                        onlyMessage($t('Plan.index.312701-14'));
                        tableRef.value?.reload();
                    }
                },
            },
        },
        {
            key: 'delete',
            text: $t('Plan.index.312701-15'),
            tooltip: {
                title:
                    data.state.value === 'enabled' ? $t('Plan.index.312701-16') : $t('Plan.index.312701-15'),
            },
            disabled: data.state.value === 'enabled',
            popConfirm: {
                title: $t('Plan.index.312701-17'),
                onConfirm: () => {
                    const response = deletePlan(data.id);
                    response.then((resp) => {
                        if (resp.status === 200) {
                            onlyMessage($t('Plan.index.312701-18'));
                            tableRef.value?.reload();
                        } else {
                            onlyMessage($t('Plan.index.312701-19'), 'error');
                        }
                    });
                    return response;
                },
            },
            icon: 'DeleteOutlined',
        },
    ];
    return actions;
};

const handleAdd = () => {
    addVisible.value = true;
};
const handleSearch = (e) => {
    params.value = e;
};

const handleClick = (data) => {
    menuStory.jumpPage(
        'media/AutoVideo/Plan/Detail',
        {
            params: {
                id: data.id,
            },
            query: {
                type: 'view',
            }
        },
    );
};
</script>

<style lang="less" scoped></style>
