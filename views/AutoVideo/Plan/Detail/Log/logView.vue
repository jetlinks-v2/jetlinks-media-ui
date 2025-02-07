<template>
    <a-drawer
        :title="$t('Log.logView.312705-0')"
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
                :label="$t('Log.logView.312705-1')"
                :contentStyle="{
                    color: data.state?.value === 'success' ? '#52C41A' : 'red',
                }"
            >
                {{ data.state?.text }}</a-descriptions-item
            >
            <a-descriptions-item :span="3" :label="$t('Log.logView.312705-2')">{{
                data.channelId
            }}</a-descriptions-item>
            <a-descriptions-item :span="3" :label="$t('Log.logView.312705-3')">{{
                data.channelName
            }}</a-descriptions-item>
            <a-descriptions-item :span="3" :label="$t('Log.logView.312705-4')">{{
                data.channelCatalog || '-'
            }}</a-descriptions-item>
            <a-descriptions-item :span="3" :label="$t('Log.logView.312705-5')">{{
                data.deviceId
            }}</a-descriptions-item>
            <a-descriptions-item :span="3" :label="$t('Log.logView.312705-6')">{{
                data.deviceName
            }}</a-descriptions-item>
            <a-descriptions-item :span="3" :label="$t('Log.logView.312705-7')">{{
                data.address
            }}</a-descriptions-item>
            <a-descriptions-item :span="3" :label="$t('Log.logView.312705-8')">{{
                data.manufacturer
            }}</a-descriptions-item>
            <a-descriptions-item :span="3" :label="$t('Log.logView.312705-9')">
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
import { JsonViewer } from 'vue3-json-viewer';
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();
const props = defineProps({
    data: {
        type: Object,
        default: () => ({}),
    },
});

const emit = defineEmits(['close']);
</script>

<style lang="less" scoped></style>
