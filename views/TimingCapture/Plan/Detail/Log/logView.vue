<template>
    <a-drawer
        :title="$t('Log.logView.855189-0')"
        visible
        @close="emit('close')"
        :maskClosable="false"
        width="600px"
    >
        <a-descriptions
            bordered
            size="small"
            :column="1"
            :labelStyle="{
                width: '100px',
                textAlign: 'right',
                justifyContent: 'end',
            }"
        >
            <a-descriptions-item
                :span="3"
                :label="$t('Log.logView.855189-1')"
                :contentStyle="{
                    color: data.state?.value === 'success' ? '#52C41A' : 'red',
                }"
            >
                {{ data.state?.text }}</a-descriptions-item
            >
            <a-descriptions-item :span="3" :label="$t('Log.logView.855189-2')">{{
                data.channelId
            }}</a-descriptions-item>
            <a-descriptions-item :span="3" :label="$t('Log.logView.855189-3')">{{
                data.channelName
            }}</a-descriptions-item>
            <a-descriptions-item :span="3" :label="$t('Log.logView.855189-4')">{{
                data.channelCatalog || '-'
            }}</a-descriptions-item>
            <a-descriptions-item :span="3" :label="$t('Log.logView.855189-5')">{{
                data.deviceId
            }}</a-descriptions-item>
            <a-descriptions-item :span="3" :label="$t('Log.logView.855189-6')">{{
                data.deviceName
            }}</a-descriptions-item>
            <a-descriptions-item :span="3" :label="$t('Log.logView.855189-7')">{{
                data.address
            }}</a-descriptions-item>
            <a-descriptions-item :span="3" :label="$t('Log.logView.855189-8')">{{
                data.manufacturer
            }}</a-descriptions-item>
            <a-descriptions-item :span="3" :label="$t('Log.logView.855189-9')">
                <div style="max-height: 400px; overflow-y: auto">
                    <JsonViewer
                        :value="data"
                        :expanded="true"
                        :expandDepth="4"
                    />
                </div>
            </a-descriptions-item>
        </a-descriptions>
    </a-drawer>
</template>

<script setup name="logView">
import JsonViewer from 'vue3-json-viewer';
import i18n from '@/locales/index'
const $t = i18n.global.t
const props = defineProps({
    data: {
        type: Object,
        default: () => ({}),
    },
});

const emit = defineEmits(['close']);
</script>

<style lang="less" scoped></style>
