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
            新增
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
              <p>通道数量：{{ slotProps.count || 0 }}</p>
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

const menuStory = useMenuStore();

const listRef = ref<Record<string, any>>({});
const params = ref<Record<string, any>>({});

const columns = [
  {
    title: '名称',
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
    title: '上级SIP ID',
    dataIndex: 'sipId',
    key: 'sipId',
    scopedSlots: true,
    ellipsis: true,
  },
  {
    title: '上级SIP 地址',
    dataIndex: 'publicHost',
    key: 'publicHost',
    scopedSlots: true,
    ellipsis: true,
  },
  {
    title: '通道数量',
    dataIndex: 'count',
    key: 'count',
    scopedSlots: true,
    width: 100,
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    scopedSlots: true,
    width: 100,
    search: {
      type: 'select',
      options: [
        {label: '正常', value: 'enabled'},
        {label: '禁用', value: 'disabled'},
      ],
      handleValue: (v: any) => {
        return v;
      },
    },
  },
  {
    title: '级联状态',
    dataIndex: 'onlineStatus',
    key: 'onlineStatus',
    scopedSlots: true,
    width: 100,
    search: {
      type: 'select',
      options: [
        {label: '已连接', value: 'online'},
        {label: '未连接', value: 'offline'},
      ],
      handleValue: (v: any) => {
        return v;
      },
    },
  },
  {
    title: '操作',
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
      text: '编辑',
      tooltip: {
        title: '编辑',
      },
      icon: 'EditOutlined',
      onClick: () => {
        menuStory.jumpPage('media/Cascade/Save', {params: {id: data.id}, query: {id: data.id}},
        );
      },
    },
    {
      key: 'channel',
      text: '选择通道',
      tooltip: {
        title: '选择通道',
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
      text: '推送',
      tooltip: {
        title:
            data.status?.value === 'disabled'
                ? '禁用状态下不可推送'
                : '推送',
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
      text: data.status?.value === 'enabled' ? '禁用' : '启用',
      tooltip: {
        title: data.status?.value === 'enabled' ? '禁用' : '启用',
      },
      icon:
          data.status?.value === 'enabled'
              ? 'StopOutlined'
              : 'PlayCircleOutlined',
      popConfirm: {
        title: `确认${
            data.status?.value === 'enabled' ? '禁用' : '启用'
        }?`,
        onConfirm: () => {
          let response =
              data.status.value === 'enabled'
                  ? CascadeApi.disabled(data.id)
                  : CascadeApi.enabled(data.id);
          response.then((res) => {
            if (res.success) {
              onlyMessage('操作成功！');
              listRef.value?.reload();
            } else {
              onlyMessage('操作失败！', 'error');
            }
          });
          return response;
        },
      },
    },
    {
      key: 'delete',
      text: '删除',
      tooltip: {
        title:
            data.status?.value === 'enabled'
                ? '请先禁用, 再删除'
                : '删除',
      },
      disabled: data.status?.value === 'enabled',
      popConfirm: {
        title: '确认删除?',
        onConfirm: () => {
          const response = CascadeApi.del(data.id);
          response.then((resp) => {
            if (resp.status === 200) {
              onlyMessage('操作成功！');
              listRef.value?.reload();
            } else {
              onlyMessage('操作失败！', 'error');
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
