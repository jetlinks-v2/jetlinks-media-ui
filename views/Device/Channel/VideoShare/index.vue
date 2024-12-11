<template>
    <a-modal
        :title="$t('VideoShare.index.5349817-0')"
        visible
        @cancel="emit('close')"
        :maskClosable="false"
        width="900px"
    >
        <div class="top">
            <span>{{ $t('VideoShare.index.5349817-1') }}</span>
            <a-input-number
                v-if="isEdit"
                style="width: 200px"
                :precision="0"
                :min="1"
                v-model:value="expires"
            >
                <template #addonAfter>
                    <a-select
                        v-model:value="unit"
                        :options="[
                            { label: $t('VideoShare.index.5349817-2'), value: 'seconds' },
                            { label: $t('VideoShare.index.5349817-3'), value: 'minutes' },
                            { label: $t('VideoShare.index.5349817-4'), value: 'hours' },
                        ]"
                    />
                </template>
            </a-input-number>
            <div v-else>{{ expires }}{{ unitMap.get(unit) }}</div>
            <j-permission-button
                type="link"
                :hasPermission="true"
                @click="onClick"
            >
                <AIcon :type="isEdit ? 'CheckOutlined' : 'EditOutlined'" />
            </j-permission-button>
        </div>
        <a-table
            :columns="columns"
            :dataSource="dataSource"
            :pagination="false"
        >
            <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'actions'">
                    <a-button type="link" @click="onCopy(record)"
                        >{{ $t('VideoShare.index.5349817-5') }}</a-button
                    >
                </template>
            </template>
        </a-table>
        <template #footer>
            <a-button type="primary" @click="emit('close')">{{ $t('VideoShare.index.5349817-6') }}</a-button>
        </template>
    </a-modal>
</template>

<script setup lang="ts" name="Address">
import DeviceApi from '../../../../api/device';
import { onMounted, ref } from 'vue';
import { onlyMessage } from '@jetlinks-web/utils';
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();
const props = defineProps({

    data: {
        type: Object,
        default: () => ({}),
    },
});
const emit = defineEmits(['close']);
const types = ['flv', 'hls', 'mp4', 'rtmp', 'rtsp', 'rtc'];
const unitMap = new Map();
unitMap.set('seconds', $t('VideoShare.index.5349817-2'));
unitMap.set('minutes', $t('VideoShare.index.5349817-3'));
unitMap.set('hours', $t('VideoShare.index.5349817-4'));

const unit = ref('hours');
const expires = ref(1);
const dataSource = ref<any[]>([]);
const isEdit = ref(false);

const columns = [
    {
        title: $t('VideoShare.index.5349817-7'),
        dataIndex: 'type',
        key: 'type',
        ellipsis: true,
        width: 70,
    },
    {
        title: $t('VideoShare.index.5349817-8'),
        dataIndex: 'url',
        key: 'url',
        ellipsis: true,
    },
    {
        title: $t('VideoShare.index.5349817-9'),
        key: 'actions',
        width: 100,
    },
];

const handleResult = async (params?: any) => {
    const res = await DeviceApi.getShare(
        props.data.deviceId,
        props.data.channelId,
        params
            ? params
            : {
                  expires: 3600,
              },
    );
    if (res.success) {
        dataSource.value = types.map((item) => ({
            id: item,
            type: item,
            url: res.result[item],
        }));
    }
};

const onCopy = (record) => {
    console.log('navigator.clipboard====',navigator.clipboard);
    if (navigator.clipboard) {
        navigator.clipboard.writeText(record.url);
        onlyMessage($t('VideoShare.index.5349817-10'));
    } else {
        const input = document.createElement('input');
        input.value = record.url;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
        onlyMessage($t('VideoShare.index.5349817-10'));
    }
};

const onClick = () => {
    isEdit.value = !isEdit.value;
    if (!isEdit.value) {
        handleResult({
            expires:
                unit.value === 'hours'
                    ? expires.value * 3600
                    : unit.value === 'minutes'
                    ? expires.value * 60
                    : expires.value,
        });
    }
};

onMounted(() => {
    handleResult();
});
</script>

<style lang="less" scoped>
.top {
    margin-bottom: 10px;
    display: flex;
    align-items: center;
}
</style>
