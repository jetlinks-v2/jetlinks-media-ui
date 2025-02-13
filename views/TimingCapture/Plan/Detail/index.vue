<template>
    <j-page-container
        :tabList="list"
        :showBack="true"
        :tabActiveKey="tabActiveKey"
        @tabChange="onTabChange"
    >
        <template #title>
            <div class="title">
                <div v-if="!isEdit">
                    {{ detail?.name || '-' }}
                    <j-permission-button
                        type="link"
                        :hasPermission="true"
                        :loading="loading"
                        @click="onSave(true)"
                    >
                        <AIcon type="EditOutlined" />
                    </j-permission-button>
                </div>
                <div v-else>
                    <a-space>
                        <div>
                            <a-input v-model:value="_value" @change="validateName" />
                            <div v-if="nameTips" class="tips">{{ nameTips }}</div>
                        </div>
                        <a-button @click="cancel">{{ $t('Detail.index.855186-0') }}</a-button>
                        <j-permission-button
                            type="primary"
                            @click="onSave(false)"
                            >{{ $t('Detail.index.855186-1') }}</j-permission-button
                        >
                    </a-space>
                </div>
            </div>
        </template>
        <template #content>
            <a-descriptions size="small" :column="4">
                <a-descriptions-item :label="$t('Detail.index.855186-2')">{{
                    detail?.id
                }}</a-descriptions-item>
                <a-descriptions-item :label="$t('Detail.index.855186-3')">{{
                    detail.creatorName
                }}</a-descriptions-item>
                <a-descriptions-item :label="$t('Detail.index.855186-4')">
                    {{
                        detail?.createTime
                            ? dayjs(detail.createTime).format(
                                  'YYYY-MM-DD HH:mm:ss',
                              )
                            : ''
                    }}</a-descriptions-item
                >
            </a-descriptions>
        </template>
        <FullPage>
            <div style="padding: 24px; height: 100%">
                <component :is="tabs[tabActiveKey]" @onJump="onTabChange" :key="tabActiveKey" :first="first"/>
            </div>
        </FullPage>
    </j-page-container>
</template>

<script setup name="Detail">
import Rule from './Rule/index.vue';
import Channel from './Channel/index.vue';
import Log from './Log/index.vue';
import dayjs from 'dayjs';
import { provide, ref } from 'vue';
import { updatePlan, queryList } from '../../../../api/auto';
import { useRoute } from 'vue-router';
import i18n from '@/locales/index'
const $t = i18n.global.t
const isEdit = ref(false);
const tabActiveKey = ref('Rule');
const first = ref(true)
const detail = ref({
    schedules: [],
    saveDays: '',
    others: {
        times: [],
        trigger: 'week',
    },
});
const route = useRoute();
const loading = ref(false);
const _value = ref();
const nameTips = ref()

provide('video-tags', {
    tag: tabActiveKey,
    terms: [],
});

const list = [
    {
        key: 'Rule',
        tab: $t('Detail.index.855186-5'),
    },
    {
        key: 'Channel',
        tab: $t('Detail.index.855186-6'),
    },
    {
        key: 'Log',
        tab: $t('Detail.index.855186-7'),
    },
];

const tabs = {
    Rule,
    Channel,
    Log,
};

const onTabChange = (e) => {
    tabActiveKey.value = e;
    first.value = false
};

const onSave = async (val) => {
    if(nameTips.value){
        return
    }
    if (!val) {
        loading.value = true;
        const res = await updatePlan({
            id: route.params.id,
            name: _value.value,
            type: 'screenshot',
        }).finally(() => {
            loading.value = false;
            isEdit.value = val;
        });
        if (res.status === 200) {
            refresh();
        }
    } else {
        isEdit.value = val;
    }
};

const refresh = async () => {
    const res = await queryList({
        terms: [
            {
                column: 'id',
                termType: 'eq',
                value: route.params.id,
            },
        ],
    });
    if (res.success) {
        // detail.value = res.result.data?.[0];
        detail.value = Object.assign(
            {
                schedules: [],
                saveDays: 1,
                others: {
                    times: [],
                    trigger: 'week',
                },
            },
            res.result.data?.[0],
        );
        _value.value = detail.value?.name;
    }
};

const validateName = () =>{
    if(!_value.value){
        nameTips.value = $t('Detail.index.855186-8')
    }else if(_value.value.length > 64){
        nameTips.value = $t('Detail.index.855186-9')
    }else{
        nameTips.value = ''
    }
}

const cancel = () =>{
    isEdit.value = false;
    nameTips.value = '';
    _value.value = detail.value?.name;
}

onMounted(() => {
    refresh();
});

provide('detail', detail);
</script>

<style lang="less" scoped>
.title {
    display: flex;
    align-items: center;
    justify-content: center;
    .tips{
        font-size: 12px;
        color: red;
        font-weight: 400;
        position: absolute;
        top: 82px;
    }
}
</style>
