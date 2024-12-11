<template>
    <div>
        <div class="rule-item">
            <span>{{ $t('Rule.index.855183-0') }}</span>
            <a-switch
                v-if="editType"
                v-model:checked="_state"
                checkedValue="enabled"
                unCheckedValue="disabled"
            ></a-switch>
            <div v-else>
                <a-badge
                    :status="
                        detail?.state?.value === 'enabled' ? 'success' : 'error'
                    "
                />
                {{ detail?.state?.value === 'enabled' ? $t('Rule.index.855183-1') : $t('Rule.index.855183-2') }}
                <j-permission-button
                    type="link"
                    :hasPermission="true"
                    @click="editType = true"
                >
                    <AIcon type="EditOutlined" />
                </j-permission-button>
            </div>
        </div>
        <div class="rule-item">
            <div>{{ $t('Rule.index.855183-3') }}<span style="color: red">*</span></div>
            <a-input-number
                v-if="editType"
                :precision="0"
                :min="1"
                :max="99999"
                :placeholder="$t('Rule.index.855183-4')"
                v-model:value="detail.saveDays"
                style="width: 200px"
            ></a-input-number>
            <div v-else style="margin-left: 10px">{{ detail.saveDays }}</div>
            <div class="retentionCycleTip">
                {{ $t('Rule.index.855183-5') }}
            </div>
        </div>

        <div>
            <!-- <span>录制时段：</span> -->
            <Calendar
                v-model:value="detail.others.times"
                v-model:trigger="detail.others.trigger"
                type="timing"
                :disabled="!editType"
            />
        </div>
        <a-button
            v-if="editType"
            style="margin-top: 20px"
            type="primary"
            @click="handleSave"
            >{{ $t('Rule.index.855183-6') }}</a-button
        >
    </div>
</template>

<script setup lang="ts" name="Rule">
import Calendar from '../../../../AutoVideo/components/Calendar/index.vue';
import { inject, onMounted, reactive, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { updatePlan } from '../../../../../api/auto';
import { onlyMessage } from '@jetlinks-web/utils';
import i18n from '@/locales/index'
const $t = i18n.global.t

const props = defineProps({
    first: {
        type: Boolean,
        default: true,
    }
})

const route = useRoute();
const editType = ref();
const detail = inject<any>('detail');
const _state = ref();

const handleArr = (arr) => {
    const schedules = [];
    arr.forEach((item) => {
        if (item.times.length !== 0) {
            item.times.forEach((i) => {
                if (i?.period?.from !== '') {
                    schedules.push(i);
                }
            });
        }
    });
    return schedules;
};

const handleSave = async () => {
    const schedules = handleArr(detail.value?.others.times);
    detail.value.state.value = _state.value;
    if (detail.value.others.trigger === 'week') {
        detail.value.schedules = schedules;
    } else {
        detail.value.schedules = schedules.map((item) => {
            const { when, ...other } = item;
            return {
                ...other,
                scheduleTags: when,
            };
        });
    }
    if (!detail.value.saveDays) {
        onlyMessage($t('Rule.index.855183-7'), 'error');
        return;
    }
    const res = await updatePlan(detail.value);
    if (res.success) {
        onlyMessage($t('Rule.index.855183-8'));
        editType.value = false;
    }
};


watch(
    () => detail.value?.state?.value,
    (val) => {
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
    margin-bottom: 24px;
    display: flex;
    justify-items: center;
    align-items: center;
    .retentionCycleTip {
        font-size: 12px;
        margin-top: 5px;
        margin-left: 10px;
        color: #a3a3a3;
    }
}
</style>
