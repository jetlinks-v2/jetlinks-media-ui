<template>
    <div class="closeIcon" @click="emit('closePreview')">
        <AIcon type="CloseOutlined" style="font-size: 20px"></AIcon>
    </div>
    <div class="preview">
        <div class="preview-img">
            <img :src="record.filePath" />
        </div>
        <div class="imgInfo">
            <div class="info-item">
                <div>{{ $t('RecordPicture.Preview.855187-0') }}</div>
                <div>
                    {{ dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss') }}
                </div>
            </div>
            <div class="info-item">
                <div>{{ $t('RecordPicture.Preview.855187-1') }}</div>
                <j-ellipsis :getPopupContainer="getPopupContainer">{{ channel.channelId }}</j-ellipsis>
            </div>
            <div class="info-item">
                <div>{{ $t('RecordPicture.Preview.855187-2') }}</div>
                <div>{{ channel.name || '-' }}</div>
            </div>
            <div class="info-item">
                <div>{{ $t('RecordPicture.Preview.855187-3') }}</div>
                <a-breadcrumb>
                    <a-breadcrumb-item v-for="name in channel?.pathsName">{{
                        name
                    }}</a-breadcrumb-item>
                </a-breadcrumb>
            </div>
            <div class="info-item">
                <div>{{ $t('RecordPicture.Preview.855187-4') }}</div>
                <div>{{ channel.address }}</div>
            </div>
            <div class="info-item">
                <div>{{ $t('RecordPicture.Preview.855187-5') }}</div>
                <div>{{ channel.manufacturer }}</div>
            </div>
            <div class="info-item">
                <div>{{ $t('RecordPicture.Preview.855187-6') }}</div>
                <div>{{ channel.deviceId }}</div>
            </div>
            <div class="info-item">
                <div>{{ $t('RecordPicture.Preview.855187-7') }}</div>
                <div>{{ channel.deviceName }}</div>
            </div>
        </div>
    </div>
</template>

<script setup>
import dayjs from 'dayjs';
import i18n from '@/locales/index'
const $t = i18n.global.t
const props = defineProps({
    record: {
        type: Object,
        default: () => ({}),
    },
    channel: {
        type: Object,
        default: () => ({}),
    },
});
const getPopupContainer = (node)=>{
    return node
}

const emit = defineEmits(['closePreview']);
</script>
<style lang="less" scoped>
.closeIcon {
    position: fixed;
    top: 7%;
    right: 15%;
    z-index: 2000;
}
.preview {
    position: fixed;
    left: 15%;
    right: 15%;
    top: 10%;
    bottom: 10%;
    background-color: white;
    display: flex;
    justify-content: space-around;
    z-index: 1200;
    .imgInfo {
        width: 20%;
        padding: 12px;
        // margin: 10px 20px;
    }
    .info-item {
        margin-top: 12px;
    }
    .preview-img {
        width: 80%;
        background-color: rgba(204, 204, 204);
        img {
            height: 90%;
            width: 90%;
            margin: 5%;
        }
    }
}
</style>
