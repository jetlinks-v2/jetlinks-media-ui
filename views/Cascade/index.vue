<template>
  <j-page-container>
    <pro-search
        :columns="columns"
        target="media-cascade"
        @search="handleSearch"
    />
    <FullPage>
      <JProTable
          ref="listRef"
          :columns="columns"
          :request="(e:any) => lastValueFrom(e)"
          :defaultParams="{
            sorts: [{ name: 'createTime', order: 'desc' }],
          }"
          modeValue="CARD"
          :params="params"
          :gridColumns=[2,2,2]
      >
        <template #headerLeftRender>
          <j-permission-button
              type="primary"
              @click="handleAdd"
              hasPermission="media/Cascade:add"
          >
            <template #icon>
              <AIcon type="PlusOutlined"/>
            </template>
            {{ $t('Cascade.index.122691-0') }}
          </j-permission-button>
        </template>
        <template #card="slotProps">
          <CardBox
              :value="slotProps"
              :actions="getActions(slotProps, 'card')"
              v-bind="slotProps"
              :showStatus="true"
              :status="slotProps.status?.value"
              :statusText="slotProps.status?.text"
              :statusNames="{
                            enabled: 'success',
                            disabled: 'error',
                        }"
          >
            <template #img>
              <slot name="img">
                <img alt="" :src="cascade.cascade1"/>
              </slot>
            </template>
            <template #content>
              <j-ellipsis style="width: calc(100% - 100px)">
                                <span style="font-size: 16px; font-weight: 700">
                                    {{ slotProps.name }}
                                </span>
              </j-ellipsis>
              <p>{{ $t('Cascade.index.122691-1') }}{{ slotProps.count || 0 }}</p>
              <a-badge
                  :status="
                                    slotProps.status?.value === 'enabled'
                                        ? 'success'
                                        : 'error'
                                "
                  style="display: flex; align-items: center"
              >
                <template #text>
                  <j-ellipsis>
                    {{
                      `sip:${slotProps.sipConfigs[0]?.sipId}@${slotProps.sipConfigs[0]?.hostAndPort}`
                    }}
                  </j-ellipsis>
                </template>
              </a-badge>
            </template>
            <template #actions="item">
              <j-permission-button
                  :disabled="item.disabled"
                  :popConfirm="item.popConfirm"
                  :tooltip="{
                                    ...item.tooltip,
                                }"
                  @click="item.onClick"
                  :hasPermission="'media/Cascade:' + item.key"
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
        <template #sipId="slotProps">
          {{ slotProps.sipConfigs[0]?.sipId }}
        </template>
        <template #publicHost="slotProps">
          {{ slotProps.sipConfigs[0]?.publicHost }}
        </template>
        <template #count="slotProps">
          {{ slotProps.count || 0 }}
        </template>
        <template #status="slotProps">
          <a-badge
              :text="slotProps.status?.text"
              :status="
                            slotProps.status?.value === 'enabled'
                                ? 'success'
                                : 'error'
                        "
          />
        </template>
        <template #onlineStatus="slotProps">
          <a-badge
              :text="slotProps.onlineStatus?.text"
              :status="
                            slotProps.onlineStatus?.value === 'online'
                                ? 'success'
                                : 'error'
                        "
          />
        </template>
        <template #action="slotProps">
          <a-space :size="16">
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
                  :hasPermission="'media/Cascade:' + i.key"
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

    <Publish v-model:visible="publishVis" :data="currentData"/>
  </j-page-container>
</template>

<script setup lang="ts">
import CascadeApi from '../../api/cascade';
import {onlyMessage} from '@jetlinks-web/utils'
import Publish from './Publish/index.vue';
import {useMenuStore} from '@/store/menu';
import {cascade} from '../../assets/cascade/index'
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();
const menuStory = useMenuStore();

const listRef = ref<Record<string, any>>({});
const params = ref<Record<string, any>>({});

const columns = [
  {
    title: $t('Cascade.index.122691-2'),
    dataIndex: 'name',
    key: 'name',
    width: 200,
    fixed: 'left',
    ellipsis: true,
    search: {
      type: 'string',
    },
  },
  {
    title: $t('Cascade.index.122691-3'),
    dataIndex: 'sipId',
    key: 'sipId',
    scopedSlots: true,
    ellipsis: true,
  },
  {
    title: $t('Cascade.index.122691-4'),
    dataIndex: 'publicHost',
    key: 'publicHost',
    scopedSlots: true,
    ellipsis: true,
  },
  {
    title: $t('Cascade.index.122691-5'),
    dataIndex: 'count',
    key: 'count',
    scopedSlots: true,
    ellipsis: true,
    width: 100,
  },
  {
    title: $t('Cascade.index.122691-6'),
    dataIndex: 'status',
    key: 'status',
    scopedSlots: true,
    width: 100,
    ellipsis: true,
    search: {
      type: 'select',
      options: [
        {label: $t('Cascade.index.122691-7'), value: 'enabled'},
        {label: $t('Cascade.index.122691-8'), value: 'disabled'},
      ],
      handleValue: (v: any) => {
        return v;
      },
    },
  },
  {
    title: $t('Cascade.index.122691-9'),
    dataIndex: 'onlineStatus',
    key: 'onlineStatus',
    scopedSlots: true,
    ellipsis: true,
    width: 100,
    search: {
      type: 'select',
      options: [
        {label: $t('Cascade.index.122691-10'), value: 'online'},
        {label: $t('Cascade.index.122691-11'), value: 'offline'},
      ],
      handleValue: (v: any) => {
        return v;
      },
    },
  },
  {
    title: $t('Cascade.index.122691-12'),
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
  params.value = e;
};

/**
 * 处理表格数据
 * @param params
 */
const lastValueFrom = (params: any) => {
  return new Promise(async (resolve) => {
    const res = await CascadeApi.list(params);
    res.result.data.forEach(async (item: any) => {
      const resp = await CascadeApi.queryBindChannel(item.id, {});
      item.count = resp.result.total;
    });
    setTimeout(() => {
      resolve(res);
    }, 1000);
  });
};

/**
 * 新增
 */
const handleAdd = () => {
  menuStory.jumpPage('media/Cascade/Save', {params: {id: ':id'}});
};

const publishVis = ref(false);
const currentData = ref();
/**
 * 按钮
 * @param data
 * @param type
 */
const getActions = (
    data: Partial<Record<string, any>>,
    type: 'card' | 'table',
): any => {
  if (!data) return [];
  const actions = [
    {
      key: 'update',
      text: $t('Cascade.index.122691-13'),
      tooltip: {
        title: $t('Cascade.index.122691-13'),
      },
      icon: 'EditOutlined',
      onClick: () => {
        menuStory.jumpPage('media/Cascade/Save', {params: {id: data.id}, query: {id: data.id}},
        );
      },
    },
    {
      key: 'channel',
      text: $t('Cascade.index.122691-14'),
      tooltip: {
        title: $t('Cascade.index.122691-14'),
      },
      icon: 'LinkOutlined',
      onClick: () => {
        menuStory.jumpPage(
            'media/Cascade/Channel',
            {
              params: {id: data.id}, query: {id: data.id}
            }
        );
      },
    },
    {
      key: 'push',
      text: $t('Cascade.index.122691-15'),
      tooltip: {
        title:
            data.status?.value === 'disabled'
                ? $t('Cascade.index.122691-16')
                : $t('Cascade.index.122691-15'),
      },
      disabled: data.status?.value === 'disabled',
      icon: 'ShareAltOutlined',
      onClick: () => {
        publishVis.value = true;
        currentData.value = data;
      },
    },
    {
      key: 'action',
      text: data.status?.value === 'enabled' ? $t('Cascade.index.122691-8') : $t('Cascade.index.122691-17'),
      tooltip: {
        title: data.status?.value === 'enabled' ? $t('Cascade.index.122691-8') : $t('Cascade.index.122691-17'),
      },
      icon:
          data.status?.value === 'enabled'
              ? 'StopOutlined'
              : 'PlayCircleOutlined',
      popConfirm: {
        title: $t('Cascade.index.542776-0', [data.status?.value === 'enabled' ? $t('Cascade.index.122691-8') : $t('Cascade.index.122691-17')]),
        onConfirm: () => {
          let response =
              data.status.value === 'enabled'
                  ? CascadeApi.disabled(data.id)
                  : CascadeApi.enabled(data.id);
          response.then((res) => {
            if (res.success) {
              onlyMessage($t('Cascade.index.122691-19'));
              listRef.value?.reload();
            } else {
              onlyMessage($t('Cascade.index.122691-20'), 'error');
            }
          });
          return response;
        },
      },
    },
    {
      key: 'delete',
      text: $t('Cascade.index.122691-21'),
      tooltip: {
        title:
            data.status?.value === 'enabled'
                ? $t('Cascade.index.122691-22')
                : $t('Cascade.index.122691-21'),
      },
      disabled: data.status?.value === 'enabled',
      popConfirm: {
        title: $t('Cascade.index.122691-23'),
        onConfirm: () => {
          const response = CascadeApi.del(data.id);
          response.then((resp) => {
            if (resp.status === 200) {
              onlyMessage($t('Cascade.index.122691-19'));
              listRef.value?.reload();
            } else {
              onlyMessage($t('Cascade.index.122691-20'), 'error');
            }
          });
          return response
        },
      },
      icon: 'DeleteOutlined',
    },
  ];
  return actions;
};
</script>
