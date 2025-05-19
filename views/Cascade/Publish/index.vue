<!-- 国标级联-推送 -->
<template>
  <a-modal
      v-model:visible="_vis"
      :title="$t('Publish.index.122692-0')"
      :cancelText="$t('Publish.index.122692-1')"
      :okText="$t('Publish.index.122692-2')"
      width="600px"
      @ok="_vis = false"
      @cancel="_vis = false"
  >
    <a-card>
      <a-space align="start" size="large">
        <AIcon type="CheckCircleFilled" class="status-icon success"></AIcon>
        <div>
          <p>成功数</p>
          <a-space size="large">
            <span class="count">{{ successCount }}</span>
            <a-space size="middle">
              <span>其中通道数量</span>
              <span>{{ data.count }}</span>
            </a-space>
          </a-space>
        </div>
      </a-space>
    </a-card>
    <div style="margin: 8px;"></div>
    <a-card>
      <a-space size="large">
        <AIcon type="CloseCircleFilled" class="status-icon fail"></AIcon>
        <div>
          <p>失败数</p>
          <a-space size="large">
            <span class="count">{{ failCount }}</span>
            <a
                v-if="errMessage.length"
                @click="
                              downloadJson(
                                  errMessage || '',
                                  data.name + $t('Publish.index.122692-5'),
                              )
                          "
            >{{ $t('Publish.index.122692-6') }}</a
            >
          </a-space>
        </div>
      </a-space>
    </a-card>
    <div v-if="flag">
      <a-textarea :rows="10" v-model:value="errStr"/>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import {LocalStore} from '@jetlinks-web/utils'
import {TOKEN_KEY} from '@jetlinks-web/constants'
import {BASE_API} from '@jetlinks-web/constants';
import {EventSourcePolyfill} from 'event-source-polyfill';
import {PropType} from 'vue';
import {downloadJson} from "@/utils"
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();
type Emits = {
  (e: 'update:visible', data: boolean): void;
};
const emit = defineEmits<Emits>();

const props = defineProps({
  visible: {type: Boolean, default: false},
  data: {
    type: Object as PropType<Partial<Record<string, any>>>,
    default: () => ({}),
  },
});

const _vis = computed({
  get: () => props.visible,
  set: (val) => emit('update:visible', val),
});

watch(
    () => _vis.value,
    (val: boolean) => {
      if (val) {
        publish()
      } else {
        failCount.value = 0;
        successCount.value = 0;
        errMessage.value = [];
      }
    },
);

/**
 * 推送
 */
const successCount = ref<number>(0);
const failCount = ref<number>(0);
const flag = ref<boolean>(false);
const errMessage = ref<any[]>([]);
const errStr = computed(() => JSON.stringify(errMessage.value));
const publish = () => {
  successCount.value = 0;
  const activeAPI = `${BASE_API}/media/gb28181-cascade/${
      props.data.id
  }/bindings/publish?:X_Access_Token=${LocalStore.get(TOKEN_KEY)}`;
  const source = new EventSourcePolyfill(activeAPI);
  source.onmessage = (e: any) => {
    const res = JSON.parse(e.data);
    if (res.successful) {
      successCount.value += 1;
    } else {
      failCount.value += 1;
      if (errMessage.value.length <= 5) {
        errMessage.value.push({...res});
      }
    }
  };
  source.onerror = () => {
    source.close();
  };
  source.onopen = () => {
  };
};
</script>
<style lang="less" scoped>
.status-icon {
  font-size: 80px;
  &.success {
    color: var(--ant-success-color);
  }
  &.fail {
    color: var(--ant-error-color);
  }
}
.count {
  font-size: 24px;
  font-weight: bold;
}
</style>
