<template>
    <j-page-container
        :tabList="list"
        :showBack="true"
        :tabActiveKey="tabActiveKey"
        @tabChange="onTabChange"
    >
        <template #title>
            <div class="video-detail-title">
                <div class="title-body">
                    <div v-if="!isEdit">
                        <span>
                            {{ detail?.name || '----' }}
                        </span>
                        <j-permission-button
                            type="link"
                            :hasPermission="true"
                            :loading="loading"
                            @click="onSave(!isEdit)"
                        >
                            <AIcon type="EditOutlined" />
                        </j-permission-button>
                    </div>
                    <div v-else>
                        <a-space>
                            <div>
                                <a-input
                                    v-model:value="_value"
                                    @change="validateName"
                                />
                                <div v-if="nameTips" class="tips">
                                    {{ nameTips }}
                                </div>
                            </div>
                            <a-button @click="cancel">{{ $t('Detail.index.594355-0') }}</a-button>
                            <j-permission-button
                                type="primary"
                                @click="onSave(!isEdit)"
                                >{{ $t('Detail.index.594355-1') }}</j-permission-button
                            >
                        </a-space>
                    </div>
                </div>
            </div>
        </template>
        <template #content>
            <a-descriptions size="small" :column="4">
                <a-descriptions-item :label="$t('Detail.index.594355-2')">{{
                    detail?.id
                }}</a-descriptions-item>
                <a-descriptions-item :label="$t('Detail.index.594355-3')">{{
                    detail.creatorName
                }}</a-descriptions-item>
                <a-descriptions-item :label="$t('Detail.index.594355-4')">
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
import { onMounted, ref, watch, provide } from 'vue';
import { useRoute } from 'vue-router';
import { updatePlan, queryList } from '../../../../api/auto';
import { usePlanDetailContent } from './utils';
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();
const isEdit = ref(false);
const route = useRoute();
const _value = ref();
const nameTips = ref();
const loading = ref(false);
const tabActiveKey = ref('Rule');
const first = ref(true)
const detail = ref({
    schedules: [],
    saveDays:1,
    others: {
        retention: 1,
        times: [],
        trigger: 'week',
    },
});

usePlanDetailContent(detail);

provide('video-tags', {
    tag: tabActiveKey,
    terms: [],
});

const list = [
    {
        key: 'Rule',
        tab: $t('Detail.index.594355-5'),
    },
    {
        key: 'Channel',
        tab: $t('Detail.index.594355-6'),
    },
    {
        key: 'Log',
        tab: $t('Detail.index.594355-7'),
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
        detail.value = Object.assign(
            {
                schedules: [],
                saveDays: 1,
                others: {
                    retention: 1,
                    times: [],
                    trigger: 'week',
                },
            },
            res.result.data?.[0],
        );
    }
};

const onSave = async (val) => {
    if (nameTips.value) {
        return;
    }
    if (!val) {
        loading.value = true;
        const res = await updatePlan({
            id: route.params.id,
            name: _value.value,
            type: 'video',
        }).finally(() => {
            loading.value = false;
            isEdit.value = val;
        });
        if (res.success) {
            refresh();
        }
    } else {
        isEdit.value = val;
    }
};

const validateName = () => {
    if (!_value.value) {
        nameTips.value = $t('Detail.index.594355-8');
    } else if (_value.value.length > 64) {
        nameTips.value = $t('Detail.index.594355-9');
    } else {
        nameTips.value = '';
    }
};

const cancel = () => {
    isEdit.value = false;
    nameTips.value = '';
    _value.value = detail.value?.name;
};

watch(
    () => detail.value?.name,
    (val) => {
        if (val) {
            _value.value = val;
        }
    },
    { immediate: true },
);

onMounted(() => {
    refresh();
});
</script>

<style lang="less" scoped>
.video-detail-title {
    display: flex;
    align-items: center;
    justify-content: center;

    .title-body {
        display: flex;
    }
    .tips {
        font-size: 12px;
        color: red;
        font-weight: 400;
        position: absolute;
        top: 82px;
    }
}
</style>
