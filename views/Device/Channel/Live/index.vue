<!-- 视频设备 - 播放 -->
<template>
    <a-modal
        v-model:visible="_vis"
        :title="$t('Live.index.5349821-0')"
        :width="type === 'share' ? '100%' : _type ? 1200 : 900"
        :class="{ share: type === 'share' }"
        :maskClosable="false"
        :keyboard="false"
        :destroyOnClose="true"
        @ok="_vis = false"
    >
        <template #closeIcon>
            <a-button :disabled="type === 'share'" type="text"
                ><AIcon type="CloseOutlined"
            /></a-button>
        </template>
        <div class="media-live">
            <div
                class="media-live-video"
                @mouseenter="visibleChange"
                @mouseleave="mouseleave"
            >
                <div :class="mediaToolClass" @mouseenter="showTool = true">
                    <div
                        class="tool-item"
                        v-if="type !== 'share' && showRecord"
                    >
                        <template v-if="isRecord === 0">
                            <a-dropdown
                                trigger="click"
                                @click="showToolLock = true"
                            >
                                <div>{{ $t('Live.index.5349821-1') }}</div>
                                <template #overlay>
                                    <a-menu @click="recordStart">
                                        <a-menu-item key="true" v-if="_type && route.query.type !== 'onvif'">
                                            <span style="padding-right: 12px"
                                                >{{ $t('Live.index.5349821-2') }}</span
                                            >
                                            <a-tooltip :title="$t('Live.index.5349821-3')">
                                                <a-icon
                                                    type="QuestionCircleOutlined"
                                                />
                                            </a-tooltip>
                                        </a-menu-item>
                                        <a-menu-item key="false">
                                            <span style="padding-right: 12px"
                                                >{{ $t('Live.index.5349821-4') }}</span
                                            >
                                            <a-tooltip :title="$t('Live.index.5349821-5')">
                                                <a-icon
                                                    type="QuestionCircleOutlined"
                                                />
                                            </a-tooltip>
                                        </a-menu-item>
                                    </a-menu>
                                </template>
                            </a-dropdown>
                        </template>
                        <div v-else-if="isRecord === 1">{{ $t('Live.index.5349821-6') }}</div>
                        <div
                            v-else-if="isRecord === 2"
                            @click.stop="recordStop"
                        >
                            {{ $t('Live.index.5349821-7') }}
                        </div>
                    </div>

                    <div class="tool-item" @click.stop="handleRefresh">
                        {{ $t('Live.index.5349821-8') }}
                    </div>
                    <ConfirmModal :title="$t('Live.index.5349821-9')" :onConfirm="handleReset">
                        <div class="tool-item">
                            {{ $t('Live.index.5349821-10') }}
                        </div></ConfirmModal
                    >
                </div>
                <LivePlayer
                    ref="player"
                    :live="true"
                    :url="url"
                    :protocol="mediaType"
                    autoplay
                />
            </div>
            <div class="media-live-actions" v-if="_type && showActions">
                <template v-if="(data.ptzType.value === 0 || data.ptzType.value === 1) && route.query.type !== 'onvif'">
                    <div class="title">
                        {{ $t('Live.index.5349821-11') }}
                    </div>
                    <div class="media-preset">
                        <Preset
                            :data="data"
                            @refresh="onRefresh"
                        />
                    </div>
                </template>
                <div class="title">
                    {{ $t('Live.index.5349821-12') }}
                </div>
                <div class="media-live-tool">
                    <RadioButton
                        v-model:value="mediaType"
                        :columns="4"
                        :options="[
                            { label: 'RTC', value: 'rtc'},
                            { label: 'MP4', value: 'mp4'},
                            { label: 'FLV', value: 'flv'},
                            { label: 'HLS', value: 'm3u8'},
                          ]"
                        @select="mediaStart"
                    />

                </div>
                <div class="title">
                    {{ $t('Live.index.5349821-13') }}
                </div>
                <div class="media-live-tool">
                    <RadioButton
                        v-model:value="speed"
                        :options="speedList"
                        @select="onMenuChange"
                    />
                </div>
                <div class="actions-tool">
                    <MediaTool
                        @onMouseDown="handleMouseDown"
                        @onMouseUp="handleMouseUp"
                    >
                        <template #center>
                            <div
                                :class="{ 'center': true, 'center-active': showAudio}"
                                @click="openAudioPlay"
                            >
                                <div class="center-volume" :style="{ height: `${volume}%`}"> </div>
                                <AIcon :type=" showAudio ? 'AudioOutlined' : 'AudioMutedOutlined' "/>
                                <!--                                <div>{{ $t('Live.index.5349821-13') }}</div>-->
                                <!--                                <j-dropdown>-->
                                <!--                                    <span-->
                                <!--                                        >{{ _speed }}<AIcon type="DownOutlined"-->
                                <!--                                    /></span>-->
                                <!--                                    <template #overlay>-->
                                <!--                                        <j-menu @click="onMenuChange">-->
                                <!--                                            <j-menu-item-->
                                <!--                                                :key="item.value"-->
                                <!--                                                v-for="item in speedList"-->
                                <!--                                            >-->
                                <!--                                                {{ item.label }}-->
                                <!--                                            </j-menu-item>-->
                                <!--                                        </j-menu>-->
                                <!--                                    </template>-->
                                <!--                                </j-dropdown>-->
                            </div>
                        </template>
                    </MediaTool>
                </div>

            </div>
        </div>
        <template #footer>
            <a-space v-if="type !== 'share'">
                <a-button @click="_vis = false">{{ $t('Live.index.5349821-14') }}</a-button>
                <a-button @click="_vis = false" type="primary">{{ $t('Live.index.5349821-15') }}</a-button>
            </a-space>
        </template>
    </a-modal>
    <Share v-if="visible" :data="data" @close="visible = false" />
</template>

<script setup lang="ts">
import { PropType } from 'vue';
import LivePlayer from '@/components/Player/index.vue';
import MediaTool from '@/components/Player/mediaTool.vue';
import RadioButton from '../../../../components/RadioButton.vue';
import channelApi from '../../../../api/channel';
import Share from './Share.vue';
import Preset from './Preset.vue';
import { useSystemStore } from '@/store/system';
import { mediaConfigMap } from '../data';
import { onlyMessage } from '@jetlinks-web/utils';
import {closeAudio, openAudio} from "./audio";
import {closeVideo, creatRTCUrl} from "./video";
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();

type Emits = {
    (e: 'update:visible', data: boolean): void;
    (e: 'refresh'): void;
};
const emit = defineEmits<Emits>();

const props = defineProps({
    visible: { type: Boolean, default: false },
    data: {
        type: Object as PropType<Partial<Record<string, any>>>,
        default: () => ({}),
    },
    type: {
        type: String as PropType<'share' | 'normal'>,
        default: 'normal',
    },
});

const route = useRoute();
const system = useSystemStore();
const _vis = computed({
    get: () => props.visible,
    set: (val) => emit('update:visible', val),
});

// 播放器
const player = ref();
// 视频地址
const url = ref('');
const showAudio = ref(false);
// 视频类型
const mediaType = ref<'mp4' | 'flv' | 'hls' | 'rtc'>('mp4');
const showTool = ref(false);
const showToolLock = ref(false);

const visible = ref(false);
const volume = ref(0)

const _type = computed(() => {
    return route.query.type !== 'fixed-media';
});

const showRecord = computed(() => {
    const key = mediaConfigMap.get(route.query.type + '-record');
    return system.configInfo?.media?.[key] != 'false';
});

const showActions = computed(() => {
    const key = mediaConfigMap.get(route.query.type + '-ptz');

    const status = system.configInfo?.media?.[key] != 'false';

    return status
});

const speedList = [
    { label: $t('Live.index.5349821-16'), value: 180 },
    { label: $t('Live.index.5349821-17'), value: 90 },
    { label: $t('Live.index.5349821-18'), value: 45 },
];
const speed = ref(90);
const local = ref();
const _speed = computed(() => {
    return speedList.find((item) => item.value === speed.value)?.label;
});

const openAudioPlay = () => {
    if (showAudio.value === false) {
        openAudio(
            props.data.deviceId,
            props.data.channelId,
            {
                volume(v) {
                    volume.value = v
                }
            }
        )
        showAudio.value = true
    } else {
        closeAudio()
        volume.value = 0
        showAudio.value = false
    }
}

const onMenuChange = (val: any) => {
    speed.value = val.key;
};

const mouseleave = () => {
    if (!showToolLock.value) {
        showTool.value = false;
    }
};

const visibleChange = () => {
    showTool.value = true;
};

const getPopupContainer = (trigger: HTMLElement) => {
    return trigger?.parentNode || document.body;
};

const mediaToolClass = computed(() => {
    return {
        'media-tool': true,
        'media-tool-show': showTool.value,
    };
});

/**
 * 媒体开始播放
 */
const mediaStart = async () => {
    if (mediaType.value !== 'rtc') {
        url.value = channelApi.ptzStart(
            props.data.deviceId,
            props.data.channelId,
            mediaType.value,
        );
    } else {
      url.value = (await creatRTCUrl(props.data.deviceId, props.data.channelId)) as string
    }
};

// 录像状态
const isRecord = ref(0); // 0：停止录像； 1：请求录像中； 2：开始录像
/**
 * 查询录像状态
 */
const getIsRecord = async () => {
    const { result } = await channelApi.ptzIsRecord(
        props.data.deviceId,
        props.data.channelId,
    );
    isRecord.value = result ? 2 : 0;
};

/**
 * 开始录像
 */
const recordStart = async ({ key }: { key: string }) => {
    showToolLock.value = false;
    showTool.value = false;
    isRecord.value = 1;
    local.value = key === 'true';
    const res = await channelApi
        .recordStart(props.data.deviceId, props.data.channelId, {
            local: local.value,
        })
        .catch(() => ({ success: false }));
    if (res.success) {
        isRecord.value = 2;
    } else {
        isRecord.value = 0;
    }
};

/**
 * 停止录像
 */
const recordStop = async () => {
    const res = await channelApi.recordStop(
        props.data.deviceId,
        props.data.channelId,
        { local: local.value },
    );
    if (res.success) {
        isRecord.value = 0;
    }
};

/**
 * 刷新
 */
const handleRefresh = () => {
    // player.value.play();
    url.value = '';
    setTimeout(() => {
        mediaStart();
    }, 500);
};

/**
 * 重置
 */
const handleReset =  () => {
    const resp = channelApi.mediaStop(props.data.deviceId, props.data.channelId);
    resp.then((res)=>{
        if(res.success){
            onlyMessage($t('Live.index.5349821-19'))
        }
    })
    return resp
};

/**
 * 点击控制按钮
 * @param type 控制类型
 */
const handleMouseDown = (type: string) => {
    channelApi.ptzTool(
        props.data.deviceId,
        props.data.channelId,
        type,
        speed.value,
    );
};
const handleMouseUp = () => {
    channelApi.ptzStop(props.data.deviceId, props.data.channelId);
};

/**
 * 分享视频
 */
const onShare = () => {
    visible.value = true;
};

const onRefresh = () => {
    emit('refresh');
};

const voiceMouseDown = () => {

}

const voiceMouseUp = () => {

}

watch(
    () => _vis.value,
    (val: boolean) => {
        if (val) {
            setTimeout(() => {
                mediaStart();
            }, 100)
            getIsRecord();
        } else {
            // url置空, 即销毁播放器
            url.value = '';
            closeVideo()
            closeVideo()
        }
    },
    {
        immediate: true,
    },
);
</script>
<style lang="less" scoped>
@import './index.less';
:deep(.live-player-stretch-btn) {
    display: none;
}
:deep(.vjs-icon-spinner) {
    display: none;
}

.center {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32px;
    width: 100%;
    height: 100%;
    border-radius: inherit;
    transition: background .15s;
    position: relative;
    overflow: hidden;

    &.center-active {
        color: @primary-color;
    }

    .center-volume {
        height: 100%;
        width: 100%;
        bottom: 0;
        position: absolute;
        background-color: rgba(24, 144, 255, 0.2);
    }
}

.media-live-actions {
    .title {
        margin-bottom: 4px;
    }
}

.media-preset {
    margin-bottom: 12px;
}

.media-live-tool {
    justify-content: center;

    :deep(.radio-button) {
        width: 100%;
    }
}
</style>
