<template>
  <a-modal visible @cancel="emit('close')" :closable="false">
    <div class="content">
      <div style="margin-bottom: 5px;">
        {{ $t('Live.Share.5349822-0') }}{{ data.name }}{{ $t('Live.Share.5349822-1') }}
      </div>
      <a-input-group compact>
        <a-input
            v-model:value="url"
            ref="urlRef"
            style="width: calc(100% - 50px)"
        />
        <a-tooltip :title="$t('Live.Share.5349822-2')">
          <a-button @click="onCopy">
            <template #icon>
              <AIcon type="CopyOutlined"/>
            </template>
          </a-button>
        </a-tooltip>
      </a-input-group>
    </div>
    <template #footer>
      <a-button type="primary" @click="emit('close')">{{ $t('Live.Share.5349822-3') }}</a-button>
    </template>
  </a-modal>
</template>

<script lang="ts" setup>
import {getToken} from '@jetlinks-web/utils';
import {TOKEN_KEY} from '@jetlinks-web/constants'
import {PropType} from 'vue';
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();
const emit = defineEmits(['close', 'save']);
const props = defineProps({
  data: {
    type: Object as PropType<Partial<Record<string, any>>>,
    default: () => ({}),
  },
});
const token = getToken();
const route = useRoute();
const url = ref('');
const urlRef = ref<HTMLInputElement>()

watchEffect(() => {
  url.value = `${window.location.origin}#/media/device/Share?deviceId=${props.data.deviceId}&channelId=${props.data.channelId}&type=${route.query.type}&id=${props.data.id}&${TOKEN_KEY}=${token}`
})

const onCopy = () => {
  if (urlRef.value) {
    urlRef.value.select()
    document.execCommand('copy')
  }
}
</script>

<style lang="less" scoped>
.content {
  display: flex;
  flex-direction: column;
  margin: 60px 10px 40px 10px;
}
</style>