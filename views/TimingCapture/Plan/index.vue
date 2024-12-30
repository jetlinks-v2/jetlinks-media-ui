<template>
    <j-page-container>
        <pro-search
            :columns="columns"
            target="timing-capture-plan"
            @search="handleSearch"
        />
        <FullPage>
            <JProTable
                ref="tableRef"
                :columns="columns"
                :request="queryList"
                mode="CARD"
                modelValue="CARD"
                :gridColumn="2"
                :gridColumns="[2]"
                :defaultParams="{
                    sorts: [{ name: 'createTime', order: 'desc' }],
                    terms: [{ column: 'type', value: 'screenshot',termType:'eq' }],
                }"
                :params="params"
            >
                <template #headerLeftRender>
                    <j-permission-button
                        type="primary"
                        @click="handleAdd"
                        hasPermission="media/TimingCapture/Plan:add"
                    >
                        <template #icon><AIcon type="PlusOutlined" /></template>
                        {{ $t('Plan.index.855181-0') }}
                    </j-permission-button>
                </template>
                <template #card="slotProps">
                    <CardBox
                        :value="slotProps"
                        :actions="getActions(slotProps, 'card')"
                          @click="() => handleClick(slotProps)"
                        v-bind="slotProps"
                        :showStatus="true"
                        :status="slotProps.state.value"
                        :statusText="
                            slotProps.state.value === 'enabled'
                                ? $t('Plan.index.855181-1')
                                : $t('Plan.index.855181-2')
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
                            <a-row :gutter="16" style="margin-top: 10px;">
                                <a-col :span="8">
                                    <div class="card-item-content-text">
                                        {{ $t('Plan.index.855181-3') }}
                                    </div>
                                    <j-ellipsis style="width: calc(100% - 20px)">
                                        <div>{{ slotProps.id }}</div>
                                    </j-ellipsis>
                                </a-col>
                                <a-col :span="8">
                                    <div class="card-item-content-text">
                                        {{ $t('Plan.index.855181-4') }}
                                    </div>
                                    <span>{{
                                        dayjs(slotProps?.createTime).format(
                                            'YYYY-MM-DD HH:mm:ss',
                                        )
                                    }}</span>
                                </a-col>
                                <a-col :span="8">
                                    <div class="card-item-content-text">
                                        {{ $t('Plan.index.855181-5') }}
                                    </div>
                                    <j-ellipsis
                                        style="width: calc(100% - 20px)"
                                        >{{
                                            slotProps?.saveDays
                                        }}</j-ellipsis
                                    >
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
                                 :hasPermission="'media/TimingCapture/Plan:' + item.key"
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
            </JProTable>
        </FullPage>
    </j-page-container>
    <AddPlan v-if="addVisible" @closeModal="onClose"></AddPlan>
</template>

<script setup lang="ts">
import { onlyMessage } from '@jetlinks-web/utils';
import { useMenuStore } from '@/store/menu';
import AddPlan from './Add/index.vue';
import { queryList ,controlPlan,deletePlan} from '../../../api/auto';
import dayjs from 'dayjs';
import { deviceImg } from "../../../assets";
import i18n from '@/locales/index'
const $t = i18n.global.t
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
        title: $t('Plan.index.855181-6'),
        dataIndex: 'name',
        key: 'name',
        search: {
            type: 'string',
            first: true,
        },
        ellipsis: true,
    },
    {
        title: $t('Plan.index.855181-7'),
        dataIndex: 'state',
        key: 'state',
        width: 100,
        search: {
            type: 'select',
            options: [
                { label: $t('Plan.index.855181-1'), value: 'enabled' },
                { label: $t('Plan.index.855181-2'), value: 'disabled' },
            ],
        },
    },
];

const getActions = (data, type) => {
    if (!data) return [];
    const actions = [
        {
            key: 'update',
            text: $t('Plan.index.855181-8'),
            tooltip: {
                title: $t('Plan.index.855181-8'),
            },
            icon: 'EditOutlined',
            onClick: () => {
                menuStory.jumpPage('media/TimingCapture/Plan/Detail', {
                    id: data.id,
                },{type:'edit'});
            },
        },
        {
            key: 'action',
            text: data.state.value === 'enabled' ? $t('Plan.index.855181-2') : $t('Plan.index.855181-9'),
            tooltip: {
                title: data.state.value === 'enabled' ? $t('Plan.index.855181-2') : $t('Plan.index.855181-9'),
            },
            icon: data.state.value === 'enabled' ? 'StopOutlined' : 'CheckCircleOutlined',
            popConfirm: {
                title: $t('Plan.index.987266-0', [data.state.value === 'enabled' ? $t('Plan.index.855181-2') : $t('Plan.index.855181-9')]),
                onConfirm: () => {
                    let response = undefined;
                    if (data.state.value === 'enabled') {
                        response = controlPlan(data.id,{
                            state:'disabled'
                        });
                    } else {
                        response = controlPlan(data.id,{
                            state:'enabled'
                        });
                    }
                    response.then((res) => {
                        if (res && res.status === 200) {
                            onlyMessage($t('Plan.index.855181-11'));
                            tableRef.value?.reload();
                        } else {
                            onlyMessage($t('Plan.index.855181-12'), 'error');
                        }
                    });
                    return response;
                },
            },
        },
        {
            key: 'delete',
            text: $t('Plan.index.855181-13'),
            tooltip: {
                title:
                    data.state.value === 'enabled' ? $t('Plan.index.855181-14') : $t('Plan.index.855181-13'),
            },
            disabled: data.state.value === 'enabled',
            popConfirm: {
                title: $t('Plan.index.855181-15'),
                onConfirm: () => {
                    const response = deletePlan(data.id);
                    response.then((resp) => {
                        if (resp.status === 200) {
                            onlyMessage($t('Plan.index.855181-11'));
                            tableRef.value?.reload();
                        } else {
                            onlyMessage($t('Plan.index.855181-12'), 'error');
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
        'media/TimingCapture/Plan/Detail',
        {
            id: data.id,
        },
        {
            type: 'view',
        },
    );
};

const onClose = (id?: string) => {
    addVisible.value = false;
    if(id){
        menuStory.jumpPage(
        'media/TimingCapture/Plan/Detail',
        {
            id: id,
        },
        {
            type: 'edit',
        },
    ); 
    }
}
</script>

<style lang="less" scoped></style>
