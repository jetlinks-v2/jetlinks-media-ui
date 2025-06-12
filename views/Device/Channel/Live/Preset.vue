<template>
  <div class="preset-container" :style="{'max-height': share ? '500px' : '180px'}">
    <div v-for="(record, index) in dataSource" class="preset-container-item">
      <div class="left">
        <div class="serial">{{index + 1}}</div>
        <a-input
            :disabled="record.flag || props.share"
            v-model:value="record.name"
        />
      </div>
      <div class="right-actions">
        <a-button
            type="link"
            style="padding: 0"
            v-if="!record.flag || props.share"
            :disabled="loading"
            @click="onSetting(record)"
        >
<!--          {{ $t('Live.Preset.5349826-0') }}-->
          <AIcon type="SaveOutlined" />
        </a-button>
        <template v-else>
          <a-space>
            <a-button
                danger
                type="link"
                :disabled="loading"
                style="padding: 0"
                @click="onDelete(record)"
            >
<!--              {{ $t('Live.Preset.5349826-1') }}-->
              <AIcon type="DeleteOutlined" />
            </a-button>
            <a-button
                type="link"
                :disabled="loading"
                style="padding: 0"
                @click="onInvoke(record)"
            >
<!--              {{ $t('Live.Preset.5349826-2') }}-->
              <AIcon type="InteractionOutlined" />
            </a-button>
          </a-space>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import channelApi from '../../../../api/channel';
import {onlyMessage} from '@jetlinks-web/utils';
import {isNumber, unionBy} from 'lodash-es';
import {PropType} from 'vue';
import {useI18n} from 'vue-i18n';

const {t: $t} = useI18n();
type Item = { id: string | number; name: string; flag?: boolean };
const props = defineProps({
  data: {
    type: Object as PropType<Partial<Record<string, any>>>,
    default: () => ({}),
  },
  share: {
    type: Boolean,
    default: false
  }
});

const emits = defineEmits(['refresh'])

const init = new Array(50).fill(0).map((_, index) => {
  return {
    id: String(index + 1),
    name: $t('Live.Preset.5349826-6', [index + 1]),
    flag: false,
  };
});

const dataSource = ref<Item[]>(init);
const loading = ref(false);
const route = useRoute()

const handleSearch = async (id: string, arr: Item[] = []) => {
  const params: Record<string, string> = {}
  if (route.query.type === 'gb28181-2016') {
    params.channel = props.data.channelId
  }
  const resp = await channelApi.opFunction(id, 'QueryPreset', params).catch((err) => {
    const el = document.getElementsByClassName('ant-notification');
    for (let i = 0; i < el.length; i++) {
      el[i].getElementsByClassName('ant-notification-notice-description')[0].innerHTML = '该通道无预置点位'
    }
    return {}
  });
  if (resp.success) {
    dataSource.value = unionBy([...arr, ...init], 'id').map((item) => {
      const _item = (resp.result?.[0] || []).find(
          (i: any) => i.id === item.id,
      );
      if (_item) {
        return {
          ..._item,
          name: item.name,
          flag: true,
        };
      }
      return item;
    });
  }
};

const saveInfo = async (preset: Item[]) => {
  const resp = await channelApi.update(props.data.id, {
    id: props.data.id,
    address: props.data.address,
    channelId: props.data.channelId,
    description: props.data.description,
    deviceId: props.data.deviceId,
    name: props.data.name,
    manufacturer: props.data.manufacturer,
    ptzType: props.data.ptzType?.value || 0,
    others: {
      ...props.data?.others,
      preset
    },
  });
  if (resp.status === 200) {
    emits('refresh')
  }
};

const onFunction = (id: string, functionId: string, params: any) => {
  loading.value = true;
  channelApi
      .opFunction(id, functionId, params)
      .then(async (resp) => {
        if (resp.status === 200) {
          onlyMessage($t('Live.Preset.5349826-7'));
          const preset = dataSource.value.map((item) => {
            return {
              id: item.id,
              name: item.name,
            };
          });
          if (params?.operation === 'SET') {
            // 保存名称
            await saveInfo(preset);
          }
          if (props.data?.deviceId) {
            await handleSearch(props.data?.deviceId, preset);
          }
        }
      })
      .finally(() => {
        loading.value = false;
      });
};

const onSetting = (obj: Item) => {
  if (!obj.id) return;
  const params = {
    operation: 'SET',
    presetIndex: isNumber(obj.id) ? Number(obj.id) : obj.id,
    channel: props.data?.channelId,
  };
  onFunction(props.data?.deviceId, 'Preset', params);
};

const onInvoke = (obj: Item) => {
  if (!obj.id) return;
  const params = {
    operation: 'CALL',
    presetIndex: isNumber(obj.id) ? Number(obj.id) : obj.id,
    channel: props.data?.channelId,
  };
  onFunction(props.data?.deviceId, 'Preset', params);
};

const onDelete = (obj: Item) => {
  if (!obj.id) return;
  const params = {
    operation: 'DEL',
    presetIndex: isNumber(obj.id) ? Number(obj.id) : obj.id,
    channel: props.data?.channelId,
  };
  onFunction(props.data?.deviceId, 'Preset', params);
};

watch(
    () => props.data.deviceId,
    () => {
      if (props.data?.deviceId) {
        handleSearch(props.data?.deviceId, props.data?.others?.preset);
      }
    },
    {
      immediate: true,
    },
);
</script>

<style lang="less" scoped>
.preset-container {
  width: 100%;
  max-height: 180px;
  overflow-y: auto;

  &-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-radius: 2px;
    background-color: #FFFFFF;
    padding: 12px;
    gap: 16px;

    &:not(:last-child) {
      margin-bottom: 8px;
    }

    .left {
      display: flex;
      align-items: center;
      gap: 8px;

      .serial {
        width: 18px;
        height: 18px;
        border-radius: 50%;
        background-color: rgba(22, 119, 255, 0.1);
        color: @primary-color;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
}

</style>
