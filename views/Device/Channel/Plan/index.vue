<template>
    <a-drawer
        :title="type === 'video' ? $t('Plan.index.973218-0') : $t('Plan.index.973218-1')"
        visible
        @close="emit('close')"
        :maskClosable="false"
        width="1000px"
    >   
        <a-spin v-if="loading"/>
        <div v-else class="content">
            <div v-if="list.length" class="items">
                <div v-for="(item, index) in list" class="item">
                    <div class="header">
                        <div>
                            <span>{{ $t('Plan.index.973218-2') }}{{ index + 1 }}: </span>
                            <planSelect
                                v-model:value="item.id"
                                :options="options"
                                :selectKeys="list"
                                :disabled="!editState"
                                @change="(option) => onChange(option, item)"
                            />
                        </div>
                        <j-permission-button
                            shape="circle"
                            :tooltip="{
                                title: $t('Plan.index.973218-3'),
                            }"
                            danger
                            @click="onDel(item)"
                        >
                            <AIcon type="DeleteOutlined" />
                        </j-permission-button>
                    </div>
                    <div v-if="item?.times" class="header-detail">
                        <span
                            >{{ $t('Plan.index.973218-4') }}
                            {{
                                item.trigger === 'week' ? $t('Plan.index.973218-5') : $t('Plan.index.973218-6')
                            }}
                        </span>
                        <span
                            >{{ $t('Plan.index.973218-7') }}
                            <a-badge
                                :status="
                                    item?.state?.value === 'enabled'
                                        ? 'success'
                                        : 'error'
                                "
                                :text="item?.state?.text"
                            />
                        </span>
                        <span>{{ $t('Plan.index.973218-8') }}{{ item.saveDays }}{{ $t('Plan.index.973218-9') }}</span>
                    </div>
                    <div v-if="item?.times" class="calendar">
                        <Calendar
                            v-model:value="item.times"
                            v-model:trigger="item.trigger"
                            type="timing"
                            :view="true"
                            :disabled="true"
                        />
                    </div>
                </div>
                <a-button
                    v-if="editState"
                    @click="onAdd(list.length)"
                    class="add-btn"
                    >{{ $t('Plan.index.973218-10') }}</a-button
                >
            </div>
            <div v-else class="empty">
                <img
                    :src="
                        type === 'video'
                            ? deviceImg.videoPlan
                            : deviceImg.capturePlan
                    "
                />
                <div class="noPlanTip">
                    {{ $t('Plan.index.973218-11') }}{{ type === 'video' ? $t('Plan.index.973218-12') : $t('Plan.index.973218-13') }}{{ $t('Plan.index.973218-2') }}
                </div>
                <div>
                    {{ $t('Plan.index.973218-14') }}{{
                        type === 'video' ? $t('Plan.index.973218-12') : $t('Plan.index.973218-13')
                    }}{{ $t('Plan.index.973218-15') }}
                </div>
                <div class="addPlan">
                    <a-button shape="round" @click="onAdd(0)">
                        {{
                            type === 'video'
                                ? $t('Plan.index.973218-16')
                                : $t('Plan.index.973218-17')
                        }}
                    </a-button>
                </div>
            </div>
        </div >
        <template #footer>
            <a-button v-if="editState" type="primary" @click="onSave"
                >{{ $t('Plan.index.973218-18') }}</a-button
            >
        </template>
    </a-drawer>
</template>

<script setup lang="ts" name="Plan">
import { ref } from 'vue';
import Calendar from '../../../AutoVideo/components/Calendar/index.vue';
import { queryListNoPaging, bindChannelAll } from '../../../../api/auto';
import planSelect from './planSelect.vue';
import { onlyMessage } from '@jetlinks-web/utils';
import { deviceImg } from "../../../../assets";
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();
const emit = defineEmits(['close']);

const props = defineProps({
    type: {
        type: String,
        default: 'video',
    },
    data: {
        type: Object,
        default: () => {
            return {};
        },
    },
});

const editState = ref(true);
const options = ref([]);
const list = ref<any[]>([]);
const loading = ref(false);

const onAdd = (index: any) => {
    list.value.push({
        index: index,
    });
};

const onDel = (item: any) => {
    list.value = list.value.filter((i) => i.index !== item.index);
};

const onSave = async () => {
    // console.log('list.value====', list.value);
    // console.log('props.data====', props.data);
    const items = list.value?.map((item) => {
        if (item.id) {
            return {
                name: item.name,
                scheduleId: item.id,
                deviceId: props.data.deviceId,
                channelId: props.data.channelId,
                others: {
                    channelCatalog: `${props.data.deviceName}/${props.data.name}`,
                    times: item.times,
                    trigger: item.trigger,
                },
            };
        }
    }).filter(i=>i);
    // console.log('items====', items);
    const res = await bindChannelAll(
        props.data.channelId,
        props.type,
        true,
        items,
    );
    if (res.success) {
        onlyMessage($t('Plan.index.973218-19'));
        emit('close');
    }
};

const onChange = (option: any, item: any) => {
    console.log('option====', option, item);
    item.times = option.others?.times || [];
    item.trigger = option.others?.trigger;
    item.name = option.name;
    item.state = option.state;
    item.saveDays = option.saveDays;
};

const getPlanList = async () => {
    const res = await queryListNoPaging({
        paging: false,
        sorts: [{ name: 'createTime', order: 'desc' }],
        terms: [{ column: 'type', value: props.type, termType: 'eq' }],
    });
    if (res.success) {
        options.value = res.result;
    }
};

const getBinds = async () => {
    loading.value = true;
    const item = {
        paging: false,
        sorts: [{ name: 'createTime', order: 'desc' }],
        terms: [
            { column: 'type', value: props.type, termType: 'eq', type: 'and' },
            {
                column: 'id$media-record-channel-bind-schedule',
                value: [
                    {
                        column: 'channelId',
                        termType: 'eq',
                        value: props.data.channelId,
                    },
                    {
                        column: 'deviceId',
                        termType: 'eq',
                        value: props.data.deviceId,
                    },
                ],
            },
        ],
    };
    const res = await queryListNoPaging(item).finally(() => {
        loading.value = false;
    });
    if (res.success) {
        // console.log('res,result====',res.result);
        list.value = res.result.map((item, index) => ({
            ...item,
            index: index,
            id: item.id,
            times: item.others?.times || [],
            trigger: item.others?.trigger || 'week',
        }));
        // editState.value = !!res.result.length
    }
};

onMounted(() => {
    getPlanList();
    getBinds();
});
</script>

<style lang="less" scoped>
.content {
    .items {
        margin-bottom: 12px;
        width: 100%;
        .item {
            width: 100%;
            padding: 12px;
            margin-top: 12px;
            background-color: #fafafa;

            // border: 1px dashed #8b8b8ba9;
            border-radius: 4px;
            .header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                :deep(.ant-btn-dangerous) {
                    background: rgba(255, 77, 79, 0.1);
                    border: none;
                }
            }
            .header-detail {
                margin-top: 10px;
                > span {
                    margin-right: 40px;
                    color: #1a1a1a;
                }
            }
            .calendar {
                padding-top: 12px;
                padding-left: 40px;
            }
        }
        .add-btn {
            width: 100%;
            margin-top: 12px;
        }
    }
    .empty {
        height: 200px;
        align-items: center;
        text-align: center;
        margin-top: 20%;
        div {
            margin-top: 10px;
        }
        .noPlanTip {
            font-size: 16px;
            font-weight: 500;
            color: #1a1a1a;
        }
    }
}
</style>
