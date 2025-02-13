<template>
    <div style="height: 100%">
        <div class="rule-item">
            <span>{{ $t('Rule.index.312706-0') }}</span>
            <a-switch
                v-if="editType"
                v-model:checked="_state"
                checkedValue="enabled"
                un-checked-value="disabled"
            ></a-switch>
            <div v-else>
                <a-badge
                    :status="
                        detail.state?.value === 'enabled' ? 'success' : 'error'
                    "
                />
                {{ detail.state?.value === 'enabled' ? $t('Rule.index.312706-1') : $t('Rule.index.312706-2') }}
                <j-permission-button
                    type="link"
                    hasPermission="device/Instance:action"
                    @click="editType = true"
                >
                    <AIcon type="EditOutlined" />
                </j-permission-button>
            </div>
        </div>
        <div class="rule-item">
            <div>
                {{ $t('Rule.index.312706-3') }}<span style="color: red; margin-right: 10px"
                    >*</span
                >
            </div>
            <a-input-number
                v-if="editType"
                :precision="0"
                :min="1"
                :max="99999"
                :placeholder="$t('Rule.index.312706-4')"
                style="width: 200px"
                v-model:value="detail.saveDays"
            ></a-input-number>
            <div v-else>{{ detail.saveDays }}</div>
            <div class="retentionCycleTip">
                {{ $t('Rule.index.312706-5') }}
            </div>
        </div>

        <div style="margin-bottom: 24px; height: calc(100% - 140px); overflow-y: auto">
            <!-- <span>录制时段：</span> -->
            <Calendar v-model:value="detail.others.times"  v-model:trigger="detail.others.trigger" :disabled="!editType"/>
        </div>
        <a-button
            v-if="editType"
            type="primary"
            :loading="loading"
            @click="save"
            >{{ $t('Rule.index.312706-6') }}</a-button
        >
    </div>
</template>

<script setup lang="ts" name="Rule">
import Calendar from '../../../components/Calendar/index.vue';
import { useRequest } from '@jetlinks-web/hooks';
import { updatePlan } from '../../../../../api/auto';
import { usePlanDetail } from '../utils';
import { onlyMessage } from '@jetlinks-web/utils';
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();
const props = defineProps({
    first: {
        type: Boolean,
        default: true,
    }
})

const route = useRoute();
const editType = ref();

const detail = usePlanDetail();
const _state = ref();

const { run, loading } = useRequest(updatePlan, {
    immediate: false,
    onSuccess() {
        onlyMessage($t('Rule.index.312706-7'));
        editType.value = false;
    },
});

const handleArr = (arr) => {
    const _newArr = [];
    arr.forEach((item) => {
        if (item.times.length !== 0) {
            item.times.forEach((i) => {
                if (i?.from) {
                    _newArr.push(i);
                }
            });
        }
    });
    return _newArr;
};

const save = () => {
    const durations = handleArr(detail.value?.others.times);
    const range = durations.map((item) => item.when[0]);
    const obj = {
        trigger: detail.value.others.trigger,
        mod: 'once',
    };
    if (detail.value.others.trigger === 'week') {
        obj['when'] = range;
        detail.value.others.durations = durations
    } else {
        obj['scheduleTags'] = range;
        detail.value.others.durations = durations.map((item) => {
            const { when, ...others } = item;
            return {
                ...others,
                scheduleTags: when,
            };
        });
    }
    detail.value.state.value = _state.value;
    detail.value.schedules = [obj]
    if (!detail.value.saveDays) {
        onlyMessage($t('Rule.index.312706-8'), 'error');
        return;
    }
    run(detail.value)
}

watch(
    () => detail.value?.state?.value,
    () => {
        _state.value = detail.value?.state?.value;
    },
    { immediate: true },
);

onMounted(()=>{
    if(props.first){
        editType.value = route.query?.type === 'edit'
    }else{
        editType.value = false
    }
})

</script>

<style lang="less">
.rule-item {
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    .retentionCycleTip {
        font-size: 12px;
        margin-top: 5px;
        margin-left: 10px;
        color: #a3a3a3;
    }
}
</style>
