<template>
    <ShareLive :visible="true" type="share" :data="playData" :readOnly="true"/>
</template>

<script lang="ts" setup>
import { LocalStore } from '@jetlinks-web/utils'
import { TOKEN_KEY } from '@jetlinks-web/constants'
import ShareLive from '../Live/shareLive.vue';

import { useSystemStore } from '@/store/system';
const system = useSystemStore();
const playData = ref({
    deviceId: '',
    channelId: '',
    type: '',
    id:''
});

// 获取url信息
const route = useRoute();

watchEffect(() => {
    system.getSystemConfig()
    const obj: any = unref(route.query) || {};
    playData.value = {
        deviceId: obj?.deviceId || '',
        channelId: obj?.channelId || '',
        type: obj?.type,
        id:obj.id || ''
    };
    if(obj?.[TOKEN_KEY]){
        LocalStore.set(TOKEN_KEY, obj?.[TOKEN_KEY]);
    }
});
</script>
