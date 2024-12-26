<template>
  <j-page-container>
    <pro-search
      :columns="columns"
      target="notice-config"
      @search="handleSearch"
    />
    <FullPage>
      <JProTable
        ref="listRef"
        :columns="columns"
        :request="DeviceApi.list"
        modeValue="CARD"
        :defaultParams="{
          sorts: [{ name: 'createTime', order: 'desc' }],
        }"
        :params="params"
      >
        <template #headerLeftRender>
          <j-permission-button
            type="primary"
            @click="handleAdd"
            hasPermission="media/Device:add"
          >
            <template #icon>
              <AIcon type="PlusOutlined"/>
            </template>
            {{ $t('Device.index.534980-0') }}
          </j-permission-button>
        </template>
        <template #card="slotProps">
          <CardBox
            @click="() => showSummary(slotProps)"
            :value="slotProps"
            :actions="getActions(slotProps, 'card')"
            v-bind="slotProps"
            :showStatus="true"
            :status="slotProps.state.value"
            :statusText="slotProps.state.text"
            :statusNames="{
              online: 'processing',
              offline: 'error',
            }"
          >
            <template #img>
              <slot name="img">
                <img :src="deviceImg.deviceMedia"/>
              </slot>
            </template>
            <template #content>
              <j-ellipsis style="width: calc(100% - 100px)">
                                <span style="font-size: 16px; font-weight: 700">
                                    {{ slotProps.name }}
                                </span>
              </j-ellipsis>
              <a-row>
                <a-col :span="12">
                  <div class="card-item-content-text">
                    {{ $t('Device.index.534980-1') }}
                  </div>
                  <j-ellipsis style="width: calc(100% - 20px)">
                    <div>{{ slotProps.manufacturer }}</div>
                  </j-ellipsis>
                </a-col>
                <a-col :span="12">
                  <div class="card-item-content-text">
                    {{ $t('Device.index.534980-2') }}
                  </div>
                  <div>{{ slotProps.channelNumber }}</div>
                </a-col>
                <a-col :span="12">
                  <div class="card-item-content-text">
                    {{ $t('Device.index.534980-3') }}
                  </div>
                  <j-ellipsis
                    style="width: calc(100% - 20px)"
                  >{{ slotProps.model }}
                  </j-ellipsis
                  >
                </a-col>
                <a-col :span="12">
                  <div class="card-item-content-text">
                    {{ $t('Device.index.534980-4') }}
                  </div>
                  <div>
                    {{ providerType[slotProps.provider] }}
                  </div>
                </a-col>
              </a-row>
            </template>
            <template #actions="item">
              <j-permission-button
                :disabled="item.disabled"
                :popConfirm="item.popConfirm"
                :tooltip="{
                                    ...item.tooltip,
                                }"
                @click="item.onClick"
                :hasPermission="
                                    'media/Device:' +
                                    (item.key !== 'updateChannel'
                                        ? item.key
                                        : 'update')
                                "
              >
                <AIcon
                  type="DeleteOutlined"
                  v-if="item.key === 'delete'"
                />
                <template v-else>
                  <AIcon :type="item.icon"/>
                  <span>{{ item?.text }}</span>
                </template>
              </j-permission-button>
            </template>
          </CardBox>
        </template>

        <template #channelNumber="slotProps">
          {{ slotProps.channelNumber || 0 }}
        </template>
        <template #provider="slotProps">
          {{ providerType[slotProps.provider] }}
        </template>
        <template #productId="slotProps">
          {{ getProductName(slotProps.productId) }}
        </template>
        <template #state="slotProps">
          <a-badge
            :text="slotProps.state?.text"
            :status="
              slotProps.state?.value === 'online'
                ? 'success'
                : 'error'
            "
          />
        </template>
        <template #action="slotProps">
          <a-space>
            <template
              v-for="i in getActions(slotProps, 'table')"
              :key="i.key"
            >
              <j-permission-button
                :danger="i.key === 'delete'"
                :disabled="i.disabled"
                :popConfirm="i.popConfirm"
                :tooltip="{
                  ...i.tooltip,
                }"
                @click="i.onClick"
                type="link"
                style="padding: 0px"
                :hasPermission="
                  'media/Device:' +
                  (i.key !== 'updateChannel' &&
                  i.key !== 'viewDevice'
                    ? i.key
                    : 'update')
                "
              >
                <template #icon
                >
                  <AIcon :type="i.icon"
                  />
                </template>
              </j-permission-button>
            </template>
          </a-space>
        </template>
      </JProTable>
    </FullPage>
    <Summary v-if="visibleSummary" :deviceId="deviceId" @closeDrawer="visibleSummary = false"></Summary>
  </j-page-container>
</template>

<script setup lang="ts">
import DeviceApi from '../../api/device';
import {onlyMessage} from '@jetlinks-web/utils';
import {PROVIDER_OPTIONS} from './const';
import {providerType} from './const';
import {encodeQuery} from '@/utils/encodeQuery';
import {useMenuStore} from '@/store/menu';
import Summary from './Summary/index.vue';
import {deviceImg} from "../../assets/device/index";
import {useI18n} from 'vue-i18n';

const {t: $t} = useI18n();
const menuStory = useMenuStore();

const listRef = ref<Record<string, any>>({});
const params = ref<Record<string, any>>({});
const visibleSummary = ref(false);
const deviceId = ref();
const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    width: 200,
    fixed: 'left',
    search: {
      type: 'string',
    },
    ellipsis: true,
  },
  {
    title: $t('Device.index.534980-5'),
    dataIndex: 'name',
    key: 'name',
    search: {
      type: 'string',
      first: true,
    },
    ellipsis: true,
  },
  {
    title: $t('Device.index.534980-4'),
    dataIndex: 'provider',
    key: 'provider',
    scopedSlots: true,
    ellipsis: true,
    width: 120,
    search: {
      type: 'select',
      options: PROVIDER_OPTIONS,
      handleValue: (v: any) => {
        return v;
      },
    },
  },
  {
    title: $t('Device.index.534980-2'),
    dataIndex: 'channelNumber',
    key: 'channelNumber',
    scopedSlots: true,
    ellipsis: true,
    width: 100,
  },
  {
    title: $t('Device.index.534980-1'),
    dataIndex: 'manufacturer',
    key: 'manufacturer',
    ellipsis: true,
  },
  {
    title: $t('Device.index.534980-6'),
    dataIndex: 'productId',
    key: 'productId',
    scopedSlots: true,
    ellipsis: true,
    search: {
      type: 'select',
      options: async () => {
        return productList.value;
      },
      handleValue: (v: any) => {
        return v;
      },
    },
  },
  {
    title: $t('Device.index.534980-7'),
    dataIndex: 'state',
    key: 'state',
    scopedSlots: true,
    width: 100,
    search: {
      type: 'select',
      options: [
        {label: $t('Device.index.534980-8'), value: 'notActive'},
        {label: $t('Device.index.534980-9'), value: 'offline'},
        {label: $t('Device.index.534980-10'), value: 'online'},
      ],
      handleValue: (v: any) => {
        return v;
      },
    },
  },
  {
    title: $t('Device.index.534980-11'),
    key: 'action',
    fixed: 'right',
    width: 200,
    scopedSlots: true,
  },
];

/**
 * 搜索
 * @param params
 */
const handleSearch = (e: any) => {
  // console.log('handleSearch:', e);
  params.value = e;
};

/**
 * 新增
 */
const handleAdd = () => {
  menuStory.jumpPage('media/Device/Save', {params: {id: ':id'}});
};

const getActions = (
  data: Partial<Record<string, any>>,
  type: 'card' | 'table',
): any => {
  if (!data) return [];
  const actions = [
    {
      key: 'update',
      text: $t('Device.index.534980-12'),
      tooltip: {
        title: $t('Device.index.534980-12'),
      },
      icon: 'EditOutlined',
      onClick: () => {
        menuStory.jumpPage(
          'media/Device/Save',
          {params: {id: data.id}, query: {id: data.id}}
        );
      },
    },
    {
      key: 'view',
      text: $t('Device.index.534980-13'),
      tooltip: {
        title: $t('Device.index.534980-13'),
      },
      icon: 'PartitionOutlined',
      onClick: () => {
        menuStory.jumpPage(
          'media/Device/Channel',
          {
            params: {
              id: data.id,
              type: data.provider,
            }, query: {
              id: data.id,
              type: data.provider,
            }
          }
        );
      },
    },
    {
      key: 'viewDevice',
      text: $t('Device.index.534980-14'),
      tooltip: {
        title: $t('Device.index.534980-14'),
      },
      icon: 'EyeOutlined',
      onClick: () => {
        menuStory.jumpPage('device/Instance/Detail', {params: {id: data.id}});
      },
    },
    {
      key: 'delete',
      text: $t('Device.index.534980-15'),
      tooltip: {
        title:
          data.state.value === 'online' ? $t('Device.index.534980-16') : $t('Device.index.534980-15'),
      },
      disabled: data.state.value === 'online',
      popConfirm: {
        title: $t('Device.index.534980-17'),
        onConfirm: () => {
          const response = DeviceApi.del(data.id);
          response.then((resp) => {
            if (resp.status === 200) {
              onlyMessage($t('Device.index.534980-18'));
              listRef.value?.reload();
            } else {
              onlyMessage($t('Device.index.534980-19'), 'error');
            }
          });
          return response
        },
      },
      icon: 'DeleteOutlined',
    },
  ];

  let acts: any = [];
  if (type === 'card') {
    // 卡片不展示查看按钮
    const tempActs = actions.filter((f: any) => f.key !== 'viewDevice');
    acts =
      data.provider === 'fixed-media'
        ? tempActs.filter((f: any) => f.key !== 'updateChannel')
        : tempActs;
  } else {
    acts =
      data.provider === 'fixed-media'
        ? actions.filter((f: any) => f.key !== 'updateChannel')
        : actions;
  }
  return acts;
};

const productList = ref<any[]>([]);
const getProductList = () => {
  DeviceApi.getProductList(
    encodeQuery({
      terms: {
        messageProtocol$in: [
          'gb28181-2016',
          'fixed-media',
          'onvif',
          'media-plugin',
        ],
      },
    }),
  ).then((resp: any) => {
    productList.value = resp.result.map((pItem: any) => ({
      label: pItem.name,
      value: pItem.id,
    }));
  });
};
getProductList();

const getProductName = (pid: string) => {
  return productList.value.find((f: any) => f.value === pid)?.label;
};


const showSummary = (data: any) => {
  visibleSummary.value = true;
  deviceId.value = data.id;
};
</script>
