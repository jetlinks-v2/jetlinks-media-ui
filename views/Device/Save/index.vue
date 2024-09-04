<!-- 视频设备新增/编辑 -->
<template>
  <j-page-container>
    <a-card>
      <a-row :gutter="24">
        <a-col :span="12">
          <a-form ref="formRef" :model="formData" layout="vertical">
            <a-form-item
                label="接入方式"
                name="channel"
                :rules="{
                                required: true,
                                message: '请选择接入方式',
                            }"
            >
              <RadioCard
                  layout="horizontal"
                  :options="PROVIDER_OPTIONS"
                  :checkStyle="true"
                  :disabled="!!route.query.id"
                  v-model="formData.channel"
                  @change="handleChannelChange"
              />
            </a-form-item>
            <a-row :gutter="24">
              <a-col :span="8">
                <ProUpload
                    v-model:modelValue="formData.photoUrl"
                />
              </a-col>
              <a-col :span="16">
                <a-form-item
                    label="ID"
                    name="id"
                    :rules="[
                                        {
                                            required:
                                                formData.channel ===
                                                'gb28181-2016',
                                            message: '请输入ID',
                                        },
                                        {
                                            max: 64,
                                            message: '最多输入64个字符',
                                        },
                                        {
                                            pattern: /^[a-zA-Z0-9_\-]+$/,
                                            message:
                                                '请输入英文或者数字或者-或者_',
                                        },
                                    ]"
                >
                  <a-input
                      v-model:value="formData.id"
                      placeholder="请输入ID"
                      :disabled="!!route.query.id"
                  />
                </a-form-item>
                <a-form-item
                    label="设备名称"
                    name="name"
                    :rules="[
                                        {
                                            required: true,
                                            message: '请输入设备名称',
                                        },
                                        {
                                            max: 64,
                                            message: '最多可输入64个字符',
                                        },
                                    ]"
                >
                  <a-input
                      v-model:value="formData.name"
                      placeholder="请输入设备名称"
                  />
                </a-form-item>
              </a-col>
            </a-row>
            <a-form-item
                label="所属产品"
                name="productId"
                :rules="{
                                required: true,
                                message: '请选择所属产品',
                            }"
            >
              <a-row :gutter="[0, 10]">
                <a-col :span="!!route.query.id ? 24 : 22">
                  <a-select
                      v-model:value="formData.productId"
                      placeholder="请选择所属产品"
                      :disabled="!!route.query.id"
                      showSearch
                      @change="handleProductChange"
                  >
                    <a-select-option
                        v-for="(item, index) in productList"
                        :key="index"
                        :value="item.id"
                        :label="item.name"
                    >
                      {{ item.name }}
                    </a-select-option>
                  </a-select>
                </a-col>
                <a-col :span="2" v-if="!route.query.id">
                  <j-permission-button
                      type="link"
                      @click="saveProductVis = true"
                      hasPermission="device/Product:add"
                  >
                    <AIcon type="PlusOutlined"/>
                  </j-permission-button>
                </a-col>
              </a-row>
            </a-form-item>
            <a-form-item
                label="接入密码"
                :name="['others', 'access_pwd']"
                :rules="[
                                {
                                    required: true,
                                    message: '请输入接入密码',
                                },
                                {
                                    max: 64,
                                    message: '最多可输入64个字符',
                                },
                            ]"
                v-if="formData.channel === 'gb28181-2016'"
            >
              <a-input-password
                  v-model:value="formData.others.access_pwd"
                  placeholder="请输入接入密码"
              />
            </a-form-item>
            <template v-if="formData.channel === 'onvif'">
              <a-form-item
                  label="接入地址"
                  :name="['others', 'onvifUrl']"
                  :rules="[
                                    {
                                        required: true,
                                        message: '请输入接入地址',
                                    },
                                    {
                                        max: 64,
                                        message: '最多可输入64个字符',
                                    },
                                ]"
              >
                <a-input
                    v-model:value="formData.others.onvifUrl"
                    placeholder="请输入接入地址"
                ></a-input>
              </a-form-item>
              <a-form-item
                  label="接入账户"
                  :name="['others', 'onvifUsername']"
                  :rules="[
                                    {
                                        required: true,
                                        message: '请输入接入账户',
                                    },
                                    {
                                        max: 64,
                                        message: '最多可输入64个字符',
                                    },
                                ]"
              >
                <a-input
                    v-model:value="
                                        formData.others.onvifUsername
                                    "
                    placeholder="请输入接入账户"
                ></a-input>
              </a-form-item>
              <a-form-item
                  label="接入密码"
                  :name="['others', 'onvifPassword']"
                  :rules="[
                                    {
                                        required: true,
                                        message: '请输入接入密码',
                                    },
                                    {
                                        max: 64,
                                        message: '最多可输入64个字符',
                                    },
                                ]"
              >
                <a-input-password
                    v-model:value="
                                        formData.others.onvifPassword
                                    "
                    placeholder="请输入接入密码"
                ></a-input-password>
              </a-form-item>
            </template>
            <template v-if="formData.channel === 'media-plugin'">
              <a-form-item
                  :name="['others', item.property]"
                  v-for="item in metadata?.properties || []"
                  :key="item"
                  :label="item.name"
                  :rules="[
                                    {
                                        required:
                                            !!item?.type?.expands?.required,
                                        message: `${
                                            item.type.type === 'enum' ||
                                            'boolean'
                                                ? '请选择'
                                                : '请输入'
                                        }${item.name}`,
                                    },
                                ]"
              >
                <a-input
                    placeholder="请输入"
                    v-if="item.type.type === 'string'"
                    v-model:value="
                                        formData.others[item.property]
                                    "
                ></a-input>
                <a-input-password
                    placeholder="请输入"
                    v-if="item.type.type === 'password'"
                    v-model:value="
                                        formData.others[item.property]
                                    "
                ></a-input-password>
                <a-select
                    placeholder="请选择"
                    v-if="
                                        item.type.type === 'enum' ||
                                        item.type.type === 'boolean'
                                    "
                    v-model:value="
                                        formData.others[item.property]
                                    "
                    :options="getOptions(item)"
                >
                </a-select>
                <a-input-number
                    v-if="
                                        [
                                            'int',
                                            'float',
                                            'double',
                                            'long',
                                        ].includes(item.type.type)
                                    "
                    v-model:value="
                                        formData.others[item.property]
                                    "
                    placeholder="请输入"
                ></a-input-number>
              </a-form-item>
            </template>
            <template v-if="!!route.query.id">
              <a-form-item
                  v-if="formData.channel === 'gb28181-2016'"
                  label="流传输模式"
                  name="streamMode"
                  :rules="{
                                    required: true,
                                    message: '请选择流传输模式',
                                }"
              >
                <a-radio-group
                    button-style="solid"
                    v-model:value="formData.streamMode"
                >
                  <a-radio-button value="UDP">
                    UDP
                  </a-radio-button>
                  <a-radio-button value="TCP_PASSIVE">
                    TCP被动
                  </a-radio-button>
                </a-radio-group>
              </a-form-item>
              <a-form-item
                  label="设备厂商"
                  name="manufacturer"
                  :rules="[
                                    {
                                        max: 64,
                                        message: '最多可输入64位字符',
                                        trigger: 'change',
                                    },
                                ]"
              >
                <a-input
                    v-model:value="formData.manufacturer"
                    placeholder="请输入设备厂商"
                />
              </a-form-item>
              <a-form-item
                  label="设备型号"
                  name="model"
                  :rules="[
                                    {
                                        max: 64,
                                        message: '最多可输入64位字符',
                                        trigger: 'change',
                                    },
                                ]"
              >
                <a-input
                    v-model:value="formData.model"
                    placeholder="请输入设备型号"
                />
              </a-form-item>
              <a-form-item
                  label="固件版本"
                  name="firmware"
                  :rules="[
                                    {
                                        max: 64,
                                        message: '最多可输入64位字符',
                                        trigger: 'change',
                                    },
                                ]"
              >
                <a-input
                    v-model:value="formData.firmware"
                    placeholder="请输入固件版本"
                />
              </a-form-item>
            </template>
            <a-form-item label="说明">
              <a-textarea
                  v-model:value="formData.description"
                  show-count
                  :maxlength="200"
                  :rows="5"
                  placeholder="请输入说明"
              />
            </a-form-item>
            <a-form-item>
              <a-button
                  type="primary"
                  @click="handleSubmit"
                  :loading="btnLoading"
              >
                保存
              </a-button>
            </a-form-item>
          </a-form>
        </a-col>
        <a-col :span="12">
          <div
              v-if="formData.channel === 'gb28181-2016'"
              class="doc"
              style="height: 800"
          >
            <h1>1.概述</h1>
            <div>
              视频设备通过GB/T28181接入平台整体分为2部分，包括平台端配置和设备端配置，不同的设备端配置的路径或页面存在差异，但配置项基本大同小异。
            </div>
            <h1>2.配置说明</h1>
            <h1>平台端配置</h1>
            <h2>1、ID</h2>
            <div>设备唯一标识，请填写设备端配置的设备编号。</div>
            <h2>2、所属产品</h2>
            <div>
              只能选择接入方式为GB/T28281的产品，若当前无对应产品，可点击右侧快速添加按钮，填写产品名称和选择GB/T28181类型的网关完成产品创建
            </div>
            <h2>3、接入密码</h2>
            <div>
              配置接入密码，设备端配置的密码需与该密码一致。该字段可在产品-设备接入页面进行统一配置，配置后所有设备将继承产品配置。设备单独修改后将脱离继承关系。
            </div>
            <h1>设备端配置</h1>
            <div>
              各个厂家、不同设备型号的设备端配置页面布局存在差异，但配置项基本大同小异，此处以大华摄像头为例作为接入配置示例
            </div>
            <div class="image">
              <a-image
                  width="100%"
                  :src="doc1"
              />
            </div>
            <h2>1、SIP服务器编号/SIP域</h2>
            <div>
              SIP服务器编号填入该设备所属产品-接入方式页面“连接信息”的SIP。
              SIP域通常为SIP服务器编号的前10位。
            </div>
            <div class="image">
              <a-image
                  width="100%"
                  :src="doc2"
              />
            </div>
            <h2>2、SIP服务器IP/端口</h2>
            <div>
              SIP服务器IP/端口填入该设备所属产品-接入方式页面中“连接信息”的IP/端口。
            </div>
            <div class="image">
              <a-image
                  width="100%"
                  :src="doc3"
              />
            </div>
            <h2>3、设备编号</h2>
            <div>
              设备编号为设备唯一性标识，物联网平台的设备接入没有校验该字段，输入任意数字均不影响设备接入平台。
            </div>
            <h2>4、注册密码</h2>
            <div>
              填入该设备所属产品-接入方式页面中“GB28281配置”处的接入密码
            </div>
            <div class="image">
              <a-image
                  width="100%"
                  :src="doc4"
              />
            </div>
            <h2>5、其他字段</h2>
            <div>不影响设备接入平台，可保持设备初始化值。</div>
          </div>

          <div v-else-if="formData.channel === 'fixed-media'" class="doc" style="height: 600">
            <h1>1.概述</h1>
            <div>
              视频设备通过RTSP、RTMP固定地址接入平台分为2步。
            </div>
            <div>1、添加视频设备</div>
            <div>2、添加视频下的通道地址。</div>
            <div>
              注：当前页面为新增视频设备，新增完成后点击设备的“通道”按钮，添加通道。
            </div>
            <h1>2.配置说明</h1>
            <h2>1、ID</h2>
            <div>
              设备唯一标识，若不填写，系统将自动生成唯一标识。
            </div>
            <h2>2、所属产品</h2>
            <div>
              只能选择接入方式为固定地址的产品，若当前无对应产品，可点击右侧快速添加按钮，填写产品名称和选择固定地址类型的网关完成产品创建。
            </div>
          </div>
          <div v-else-if="formData.channel === 'onvif'" class="doc" style="height: 600">
            <h1>1.概述</h1>
            <div>
              JetLinks平台支持通过Onvif方式接入视频设备。分为两个部分，包括平台端配置和设备端配置。本文通过海康摄像头为例将onvif视频接入到平台播放。
            </div>
            <h1>2.配置说明</h1>
            <div>
              设备端配置
            </div>
            <div>
              1.本文以海康监控为例演示，登录海康监控设备后台，进入配置>网络>高级配置>集成协议，用户自定义输入用户名和密码，完成用户添加。
            </div>
            <div class="image">
              <a-image
                  width="100%"
                  :src="doc5"
              />
            </div>
            <div>平台端配置</div>
            <div>ID：设备唯一标识，若不填写，系统将自动生成唯一标识</div>
            <div>设备名称：用户自定义输入小于或等于64位字符</div>
            <div>
              所属产品：选择接入方式为Onvif的产品，若当前无对应产品，可点击右侧快速添加按钮，填写产品名称和选择Onvif类型的网关完成产品创建
            </div>
            <div>
              接入地址：不同平台的摄像头接入地址组合方式不一致，请参考对应品牌接入Onvif的地址设置。如海康：http://ip/onvif/device_service。IP地址来自于海康监控设备端后台：配置>网络>基本配置>TCP/IP
            </div>
            <div class="image">
              <a-image
                  width="100%"
                  :src="doc6"
              />
            </div>
            <div>接入账户：输入设备端配置时添加的用户名</div>
            <div>接入密码：输入设备端配置时添加的密码</div>
            <div class="image">
              <a-image
                  width="100%"
                  :src="doc7"
              />
            </div>
            <h1>3.所有配置项填写完成，点击保存。</h1>
          </div>
          <div v-else-if="formData.channel === 'media-plugin'" class="doc" style="height: 600">
            <h1>1.概述</h1>
            <div>
              JetLinks平台支持通过调用SDK或API请求将第三方系统视频设备数据接入到平台。
            </div>
            <h1>2.配置说明</h1>
            <div>2.1平台端配置</div>
            <div>ID：设备唯一标识，若不填写，系统将自动生成唯一标识</div>
            <div>设备名称：用户自定义输入小于或等于64位字符</div>
            <div>
              所属产品：选择接入方式为插件视频接入的产品，若当前无对应产品，可点击右侧快速添加按钮，填写产品名称和选择插件类型的网关完成产品创建。
            </div>
            <h1>3.所有配置项填写完成，点击保存。</h1>
          </div>
        </a-col>
      </a-row>
    </a-card>

    <SaveProduct
        v-model:visible="saveProductVis"
        v-model:productId="formData.productId"
        v-model:password="formData.others.access_pwd"
        :channel="formData.channel"
        @close="getProductList"
    />
  </j-page-container>
</template>

<script setup lang="ts">
import {onlyMessage} from '@/utils/comm';
import DeviceApi from '../../../api/device';
import {PROVIDER_OPTIONS} from '../const';
import type {ProductType} from '../typings';
import SaveProduct from './SaveProduct.vue';
import {notification} from 'ant-design-vue';
import {omit} from 'lodash-es';
import {queryDeviceConfig} from '../../../api/instance';
import RadioCard from '../../../components/RadioCard/index.vue';

import deviceMedia from '../../../assets/device/device-media.png';
import doc1 from '../../../assets/device/doc1.png';
import doc2 from '../../../assets/device/doc2.png';
import doc3 from '../../../assets/device/doc3.png';
import doc4 from '../../../assets/device/doc4.png';
import doc5 from '../../../assets/device/doc5.png';
import doc6 from '../../../assets/device/doc6.png';
import doc7 from '../../../assets/device/doc7.png';

const route = useRoute();

// 表单数据
const formData = ref<any>({
  id: '',
  name: '',
  channel: 'gb28181-2016',
  photoUrl: deviceMedia,
  productId: undefined,
  description: '',
  others: {
    access_pwd: '',
    onvifUrl: '',
    onvifPassword: '',
    onvifUsername: '',
  },
  // 编辑字段
  streamMode: '',
  manufacturer: '',
  model: '',
  firmware: '',
});

const metadata = ref<any>({
  properties: [],
});
const handleChannelChange = () => {
  formData.value.productId = undefined;
  getProductList();
};

/**
 * 获取所属产品
 */
const productList = ref<ProductType[]>([]);
const getProductList = async () => {
  const params = {
    paging: false,
    sorts: [{name: 'createTime', order: 'desc'}],
    terms: [
      {column: 'accessProvider', value: formData.value.channel},
      {column: 'state', value: 1},
    ],
  };
  const {result} = await DeviceApi.queryProductList(params);
  productList.value = result;
  if (result.length && !route.query.id) {
    formData.value.productId = result[0]?.id
    formData.value.others.access_pwd = result[0]?.configuration?.access_pwd
    formData.value.streamMode = result[0]?.configuration?.stream_mode
  }

};

const handleProductChange = () => {
  formData.value.others.access_pwd =
      productList.value.find((f: any) => f.id === formData.value.productId)
          ?.configuration.access_pwd || '';
  formData.value.streamMode =
      productList.value.find((f: any) => f.id === formData.value.productId)
          ?.configuration.stream_mode || '';
};

//获取物模型下拉选项
const getOptions = (i: any) => {
  if (i.type.type === 'enum') {
    return (i.type?.elements || []).map((item) => {
      return {
        label: item?.text,
        value: item?.value,
      };
    });
  } else if (i.type.type === 'boolean') {
    return [
      {
        label: i.type?.falseText,
        value: i.type?.falseValue,
      },
      {
        label: i.type?.trueText,
        value: i.type?.trueValue,
      },
    ];
  }
  return undefined;
};
/**
 * 新增产品
 */
const saveProductVis = ref(false);

/**
 * 获取详情
 */
const getDetail = async () => {
  const res = await DeviceApi.detail(route.query.id as string);
  Object.assign(formData.value, res.result);
  formData.value.channel = res.result.provider;
  await getProductList();
  if (formData.value.productId) {
    const productData = productList.value.find((i: any) => {
      return i.id === formData.value.productId;
    });
    if (productData && formData.value.channel !== 'media-plugin') {
      formData.value.others.access_pwd = formData.value.others.access_pwd
          ? formData.value.others.access_pwd
          : productData?.configuration?.access_pwd;
      formData.value.streamMode = formData.value.streamMode
          ? formData.value.streamMode
          : productData?.configuration?.stream_mode;
    }
    if (productData && formData.value.channel === 'media-plugin') {
      if (!res.result.others || JSON.stringify(res.result?.others) === "{}") {
        formData.value.others = productData?.configuration;
      }
      const resp: any = await queryDeviceConfig(formData.value.id);
      if (resp.success) {
        metadata.value = resp?.result[0] || {
          properties: [],
        };
      }
    }
  }
};

onMounted(async () => {
  if (!route.query.id) {
    getProductList();
  } else {
    getDetail();
  }
});

/**
 * 表单提交
 */
const btnLoading = ref<boolean>(false);
const formRef = ref();
const handleSubmit = () => {
  let {
    others,
    id,
    streamMode,
    manufacturer,
    model,
    firmware,
    ...extraParams
  } = formData.value;
  let params: any;
  if (formData.value.channel === 'fixed-media') {
    // 固定地址
    params = !id
        ? extraParams
        : {id, streamMode, manufacturer, model, firmware, ...extraParams};
  } else if (formData.value.channel === 'gb28181-2016') {
    // 国标
    others = omit(others, ['onvifUrl', 'onvifPassword', 'onvifUsername']);
    const getParams = () => {
      if (others?.stream_mode) {
        others.stream_mode = streamMode;
      }
      return {
        others,
        id,
        streamMode,
        manufacturer,
        model,
        firmware,
        ...extraParams,
      };
    };
    params = !id ? {others, id, ...extraParams} : getParams();
  } else if (formData.value.channel === 'onvif') {
    others = omit(others, ['access_pwd']);
    params = !id
        ? {others, ...extraParams}
        : {
          id,
          streamMode,
          manufacturer,
          model,
          firmware,
          others,
          ...extraParams,
        };
  } else if (formData.value.channel === 'media-plugin') {
    params = !id
        ? extraParams
        : {
          id,
          streamMode,
          manufacturer,
          model,
          firmware,
          others,
          ...extraParams,
        };
  }

  formRef.value
      ?.validate()
      .then(async () => {
        btnLoading.value = true;
        let res;
        if (!route.query.id) {
          const resp: any = await DeviceApi.validateId(id);
          if (resp.status === 200 && resp?.result?.passed) {
            res = await DeviceApi.save(params);
          } else {
            notification.error({
              key: 'error',
              message: '设备ID已重复',
            });
          }
        } else {
          res = await DeviceApi.update(params);
        }
        if (res?.success) {
          onlyMessage('保存成功');
          history.back();
        }
      })
      .catch((err: any) => {
        console.log('err: ', err);
      })
      .finally(() => {
        btnLoading.value = false;
      });
};
</script>

<style lang="less" scoped>
@import './index.less';
</style>
