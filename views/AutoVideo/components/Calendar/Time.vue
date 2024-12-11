<template>
    <div>
        <div v-if="type === 'auto'">
            <div v-for="(item, index) in dataSource" class="auto-items">
                <div class="label">{{ $t('Calendar.Time.3127119-0') }}{{ index + 1 }}</div>
                <a-time-range-picker
                    :value="[item.from, item.to]"
                    valueFormat="HH:mm:ss"
                    @change="
                        (v) => {
                            item.from = v?.[0] || '';
                            item.to = v?.[1] || '';
                            onChange();
                        }
                    "
                />
            </div>
        </div>
        <div v-else>
            <div v-for="(item, index) in dataSource" class="timing-items">
                <div>{{ $t('Calendar.Time.3127119-1') }}{{ index + 1 }}</div>
                <a-radio-group
                    v-model:value="item.mod"
                    option-type="button"
                    button-style="solid"
                    style="margin: 0 12px"
                    :options="[
                        { label: $t('Calendar.Time.3127119-2'), value: 'period' },
                        { label: $t('Calendar.Time.3127119-3'), value: 'once' },
                    ]"
                    @change="onChange"
                />
                <div v-if="item.mod === 'period'">
                    <a-time-range-picker
                        style="width: 200px"
                        :value="[item.period.from, item.period.to]"
                        valueFormat="HH:mm:ss"
                        @change="
                            (v) => {
                                item.period.from = v?.[0] || '';
                                item.period.to = v?.[1] || '';
                                onChange();
                            }
                        "
                    />
                    <span> {{ $t('Calendar.Time.3127119-4') }} </span>
                    <a-input-number
                        style="width: 120px"
                        :precision="0"
                        :min="1"
                        v-model:value="item.period.every"
                        @change="onChange"
                    >
                        <template #addonAfter>
                            <a-select
                                v-model:value="item.period.unit"
                                :options="[
                                    { label: $t('Calendar.Time.3127119-5'), value: 'seconds' },
                                    { label: $t('Calendar.Time.3127119-6'), value: 'minutes' },
                                    { label: $t('Calendar.Time.3127119-7'), value: 'hours' },
                                ]"
                                @select="onChange"
                            />
                        </template>
                    </a-input-number>
                    <span> {{ $t('Calendar.Time.3127119-3') }}</span>
                </div>
                <div v-else>
                    <a-time-picker
                        valueFormat="HH:mm:ss"
                        v-model:value="item.once.time"
                        format="HH:mm:ss"
                        style="width: 200px"
                        @change="onChange"
                    />
                    <span> {{ $t('Calendar.Time.3127119-3') }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts" name="Time">
import { onMounted, reactive, ref, watch } from 'vue';
import { cloneDeep } from 'lodash-es';
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();
const props = defineProps({
    value: {
        type: Array,
        default: [],
    },
    type: {
        type: String,
        default: 'auto',
    },
});

const emits = defineEmits(['change']);

const dataSource = ref([]);
const init = {
    from: '',
    to: '',
    mod: 'period',
    period: {
        unit: 'seconds',
        every: '',
        from: '',
        to: '',
    },
    once: {
        time: '',
    },
};

const onChange = () => {
    emits('change', dataSource.value);
};

onMounted(() => {
    if (props.value.length) {
        const _data = cloneDeep(props.value);
        dataSource.value = _data.map((item: any) => {
            if (item) {
                return {
                    from: item.from || '',
                    to: item.to || '',
                    mod: item.mod || 'period',
                    period: {
                        unit: item.period?.unit || 'seconds',
                        every: item.period?.every || '',
                        from: item.period?.from || '',
                        to: item.period?.to || '',
                    },
                    once: {
                        time: item.once?.time || '',
                    },
                };
            } else {
                return {
                    ...init,
                    period: { ...init.period },
                    once: { ...init.once },
                };
            }
        });
    } else {
        dataSource.value = Array.from(Array(6), () => ({
            ...init,
            period: { ...init.period },
            once: { ...init.once },
        }));
    }
});
</script>

<style lang="less" scoped>
.auto-items {
    display: flex;
    align-items: center;
    height: 40px;
    .label {
        margin-right: 24px;
    }
}
.timing-items {
    display: flex;
    align-items: center;
    height: 45px;
}
</style>
