<!-- 视频设备新增/编辑 -->
<template>
  <j-page-container>
    <a-card>
      <a-row :gutter="24">
        <a-col :span="12">
          <a-form ref="formRef" :model="formData" layout="vertical">
            <a-form-item
              :label="$t('Save.index.5349810-0')"
              name="channel"
              :rules="{
                required: true,
                message: $t('Save.index.5349810-1'),
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
                <ProUpload v-model:modelValue="formData.photoUrl" />
              </a-col>
              <a-col :span="16">
                <a-form-item
                  label="ID"
                  name="id"
                  :rules="[
                    {
                      required: formData.channel === 'gb28181-2016',
                      message: $t('Save.index.5349810-2'),
                    },
                    {
                      max: 64,
                      message: $t('Save.index.5349810-3'),
                    },
                    {
                      pattern: /^[a-zA-Z0-9_\-]+$/,
                      message: $t('Save.index.5349810-4'),
                    },
                  ]"
                >
                  <a-input
                    v-model:value="formData.id"
                    :placeholder="$t('Save.index.5349810-2')"
                    :disabled="!!route.query.id"
                  />
                </a-form-item>
                <a-form-item
                  :label="$t('Save.index.5349810-5')"
                  name="name"
                  :rules="[
                    {
                      required: true,
                      message: $t('Save.index.5349810-6'),
                    },
                    {
                      max: 64,
                      message: $t('Save.index.5349810-7'),
                    },
                  ]"
                >
                  <a-input
                    v-model:value="formData.name"
                    :placeholder="$t('Save.index.5349810-6')"
                  />
                </a-form-item>
              </a-col>
            </a-row>
            <a-form-item
              :label="$t('Save.index.5349810-8')"
              name="productId"
              :rules="{
                required: true,
                message: $t('Save.index.5349810-9'),
              }"
            >
              <a-row :gutter="[0, 10]">
                <a-col :span="!!route.query.id ? 24 : 22">
                  <a-select
                    v-model:value="formData.productId"
                    :placeholder="$t('Save.index.5349810-9')"
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
                    <AIcon type="PlusOutlined" />
                  </j-permission-button>
                </a-col>
              </a-row>
            </a-form-item>
            <a-form-item
              :label="$t('Save.index.5349810-10')"
              :name="['others', 'access_pwd']"
              :rules="[
                {
                  required: true,
                  message: $t('Save.index.5349810-11'),
                },
                {
                  max: 64,
                  message: $t('Save.index.5349810-7'),
                },
              ]"
              v-if="formData.channel === 'gb28181-2016'"
            >
              <a-input-password
                v-model:value="formData.others.access_pwd"
                :placeholder="$t('Save.index.5349810-11')"
              />
            </a-form-item>
            <template v-if="formData.channel === 'onvif'">
              <a-form-item
                :label="$t('Save.index.5349810-12')"
                :name="['others', 'onvifUrl']"
                :rules="[
                  {
                    required: true,
                    message: $t('Save.index.5349810-13'),
                  },
                  {
                    max: 64,
                    message: $t('Save.index.5349810-7'),
                  },
                ]"
              >
                <a-input
                  v-model:value="formData.others.onvifUrl"
                  :placeholder="$t('Save.index.5349810-13')"
                ></a-input>
              </a-form-item>
              <a-form-item
                :label="$t('Save.index.5349810-14')"
                :name="['others', 'onvifUsername']"
                :rules="[
                  {
                    required: true,
                    message: $t('Save.index.5349810-15'),
                  },
                  {
                    max: 64,
                    message: $t('Save.index.5349810-7'),
                  },
                ]"
              >
                <a-input
                  v-model:value="formData.others.onvifUsername"
                  :placeholder="$t('Save.index.5349810-15')"
                ></a-input>
              </a-form-item>
              <a-form-item
                :label="$t('Save.index.5349810-10')"
                :name="['others', 'onvifPassword']"
                :rules="[
                  {
                    required: true,
                    message: $t('Save.index.5349810-11'),
                  },
                  {
                    max: 64,
                    message: $t('Save.index.5349810-7'),
                  },
                ]"
              >
                <a-input-password
                  v-model:value="formData.others.onvifPassword"
                  :placeholder="$t('Save.index.5349810-11')"
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
                    required: !!item?.type?.expands?.required,
                    message: `${
                      item.type.type === 'enum' || 'boolean'
                        ? $t('Save.index.5349810-16')
                        : $t('Save.index.5349810-17')
                    }${item.name}`,
                  },
                ]"
              >
                <a-input
                  :placeholder="$t('Save.index.5349810-17')"
                  v-if="item.type.type === 'string'"
                  v-model:value="formData.others[item.property]"
                ></a-input>
                <a-input-password
                  :placeholder="$t('Save.index.5349810-17')"
                  v-if="item.type.type === 'password'"
                  v-model:value="formData.others[item.property]"
                ></a-input-password>
                <a-select
                  :placeholder="$t('Save.index.5349810-16')"
                  v-if="
                    item.type.type === 'enum' || item.type.type === 'boolean'
                  "
                  v-model:value="formData.others[item.property]"
                  :options="getOptions(item)"
                >
                </a-select>
                <a-input-number
                  v-if="
                    ['int', 'float', 'double', 'long'].includes(item.type.type)
                  "
                  v-model:value="formData.others[item.property]"
                  :placeholder="$t('Save.index.5349810-17')"
                ></a-input-number>
              </a-form-item>
            </template>
            <template v-if="!!route.query.id">
              <a-form-item
                v-if="formData.channel === 'gb28181-2016'"
                :label="$t('Save.index.5349810-18')"
                name="streamMode"
                :rules="{
                  required: true,
                  message: $t('Save.index.5349810-19'),
                }"
              >
                <a-radio-group
                  button-style="solid"
                  v-model:value="formData.streamMode"
                >
                  <a-radio-button value="UDP"> UDP </a-radio-button>
                  <a-radio-button value="TCP_PASSIVE">
                    {{ $t("Save.index.5349810-20") }}
                  </a-radio-button>
                </a-radio-group>
              </a-form-item>
              <a-form-item
                :label="$t('Save.index.5349810-21')"
                name="manufacturer"
                :rules="[
                  {
                    max: 64,
                    message: $t('Save.index.5349810-22'),
                    trigger: 'change',
                  },
                ]"
              >
                <a-input
                  v-model:value="formData.manufacturer"
                  :placeholder="$t('Save.index.5349810-23')"
                />
              </a-form-item>
              <a-form-item
                :label="$t('Save.index.5349810-24')"
                name="model"
                :rules="[
                  {
                    max: 64,
                    message: $t('Save.index.5349810-22'),
                    trigger: 'change',
                  },
                ]"
              >
                <a-input
                  v-model:value="formData.model"
                  :placeholder="$t('Save.index.5349810-25')"
                />
              </a-form-item>
              <a-form-item
                :label="$t('Save.index.5349810-26')"
                name="firmware"
                :rules="[
                  {
                    max: 64,
                    message: $t('Save.index.5349810-22'),
                    trigger: 'change',
                  },
                ]"
              >
                <a-input
                  v-model:value="formData.firmware"
                  :placeholder="$t('Save.index.5349810-27')"
                />
              </a-form-item>
            </template>
            <a-form-item :label="$t('Save.index.5349810-28')">
              <a-textarea
                v-model:value="formData.description"
                show-count
                :maxlength="200"
                :rows="5"
                :placeholder="$t('Save.index.5349810-29')"
              />
            </a-form-item>
            <a-form-item>
              <a-button
                type="primary"
                @click="handleSubmit"
                :loading="btnLoading"
              >
                {{ $t("Save.index.5349810-30") }}
              </a-button>
            </a-form-item>
          </a-form>
        </a-col>
        <a-col :span="12">
          <div
            v-if="formData.channel === 'gb28181-2016'"
            class="doc"
            style="height: 800px"
          >
            <h1>{{ $t("Save.index.5349810-31") }}</h1>
            <div>
              {{ $t("Save.index.5349810-32") }}
            </div>
            <h1>{{ $t("Save.index.5349810-33") }}</h1>
            <h1>{{ $t("Save.index.5349810-34") }}</h1>
            <h2>1、ID</h2>
            <div>{{ $t("Save.index.5349810-35") }}</div>
            <h2>2、{{ $t("Save.index.5349810-8") }}</h2>
            <div>
              {{ $t("Save.index.5349810-37") }}
            </div>
            <h2>3、{{ $t("Save.index.5349810-10") }}</h2>
            <div>
              {{ $t("Save.index.5349810-39") }}
            </div>
            <h1>{{ $t("Save.index.5349810-40") }}</h1>
            <div>
              {{ $t("Save.index.5349810-41") }}
            </div>
            <div class="image">
              <a-image width="100%" :src="deviceImg.doc1" />
            </div>
            <h2>{{ $t("Save.index.5349810-42") }}</h2>
            <div>
              {{ $t("Save.index.5349810-43") }}
              {{ $t("Save.index.5349810-44") }}
            </div>
            <div class="image">
              <a-image width="100%" :src="deviceImg.doc2" />
            </div>
            <h2>{{ $t("Save.index.5349810-45") }}</h2>
            <div>
              {{ $t("Save.index.5349810-46") }}
            </div>
            <div class="image">
              <a-image width="100%" :src="deviceImg.doc3" />
            </div>
            <h2>{{ $t("Save.index.5349810-47") }}</h2>
            <div>
              {{ $t("Save.index.5349810-48") }}
            </div>
            <h2>{{ $t("Save.index.5349810-49") }}</h2>
            <div>
              {{ $t("Save.index.5349810-50") }}
            </div>
            <div class="image">
              <a-image width="100%" :src="deviceImg.doc4" />
            </div>
            <h2>{{ $t("Save.index.5349810-51") }}</h2>
            <div>{{ $t("Save.index.5349810-52") }}</div>
          </div>

          <div
            v-else-if="formData.channel === 'fixed-media'"
            class="doc"
            style="height: 600px"
          >
            <h1>{{ $t("Save.index.5349810-31") }}</h1>
            <div>
              {{ $t("Save.index.5349810-53") }}
            </div>
            <div>{{ $t("Save.index.5349810-54") }}</div>
            <div>{{ $t("Save.index.5349810-55") }}</div>
            <div>
              {{ $t("Save.index.5349810-56") }}
            </div>
            <h1>{{ $t("Save.index.5349810-33") }}</h1>
            <h2>1、ID</h2>
            <div>
              {{ $t("Save.index.5349810-57") }}
            </div>
            <h2>2、{{ $t("Save.index.5349810-8") }}</h2>
            <div>
              {{ $t("Save.index.5349810-58") }}
            </div>
          </div>
          <div
            v-else-if="formData.channel === 'onvif'"
            class="doc"
            style="height: 600px"
          >
            <h1>{{ $t("Save.index.5349810-31") }}</h1>
            <div>
              {{ $t("Save.index.5349810-59") }}
            </div>
            <h1>{{ $t("Save.index.5349810-33") }}</h1>
            <div>
              {{ $t("Save.index.5349810-40") }}
            </div>
            <div>
              {{ $t("Save.index.5349810-60") }}>{{
                $t("Save.index.5349810-61")
              }}>{{ $t("Save.index.5349810-62") }}>{{
                $t("Save.index.5349810-63")
              }}
            </div>
            <div class="image">
              <a-image width="100%" :src="deviceImg.doc5" />
            </div>
            <div>{{ $t("Save.index.5349810-34") }}</div>
            <div>{{ $t("Save.index.5349810-64") }}</div>
            <div>
              {{ $t("Save.index.5349810-5") }}{{ $t("Save.index.133456-0") }}
            </div>
            <div>
              {{ $t("Save.index.5349810-8") }}{{ $t("Save.index.133456-1") }}
            </div>
            <div>
              {{ $t("Save.index.5349810-12")
              }}{{ $t("Save.index.133456-2") }}>{{
                $t("Save.index.5349810-61")
              }}>{{ $t("Save.index.154832-0") }}>TCP/IP
            </div>
            <div class="image">
              <a-image width="100%" :src="deviceImg.doc6" />
            </div>
            <div>
              {{ $t("Save.index.5349810-14") }}{{ $t("Save.index.133456-3") }}
            </div>
            <div>
              {{ $t("Save.index.5349810-10") }}{{ $t("Save.index.133456-4") }}
            </div>
            <div class="image">
              <a-image width="100%" :src="deviceImg.doc7" />
            </div>
            <h1>{{ $t("Save.index.5349810-70") }}</h1>
          </div>
          <div
            v-else-if="formData.channel === 'media-plugin'"
            class="doc"
            style="height: 600px"
          >
            <h1>{{ $t("Save.index.5349810-31") }}</h1>
            <div>
              {{ $t("Save.index.5349810-71") }}
            </div>
            <h1>{{ $t("Save.index.5349810-33") }}</h1>
            <div>2.1{{ $t("Save.index.5349810-34") }}</div>
            <div>{{ $t("Save.index.5349810-64") }}</div>
            <div>
              {{ $t("Save.index.5349810-5") }}{{ $t("Save.index.133456-0") }}
            </div>
            <div>
              {{ $t("Save.index.5349810-8") }}{{ $t("Save.index.133456-5") }}
            </div>
            <h1>{{ $t("Save.index.5349810-70") }}</h1>
          </div>
          <div
            v-else-if="formData.channel === 'agent-media-device-gateway'"
            class="doc"
            style="height: 600px"
          >
            <h1>{{ $t("Save.index.179438-0") }}</h1>
            <div>
              {{ $t("Save.index.179438-1") }}
            </div>
            <div class="image">
              <a-image width="100%" :src="deviceImg.agentDoc" />
            </div>
            <h1>{{ $t("Save.index.179438-2") }}</h1>
            <div>{{ $t("Save.index.179438-3") }}</div>
            <div>
              {{ $t("Save.index.179438-4") }}
            </div>
            <div>{{ $t("Save.index.179438-5") }}</div>
            <div>
              {{ $t("Save.index.179438-6") }}
            </div>
            <h1>{{ $t("Save.index.179438-7") }}</h1>
          </div>
        </a-col>
      </a-row>
    </a-card>

    <SaveProduct
      v-model:visible="saveProductVis"
      v-model:productId="formData.productId"
      v-model:password="formData.others.access_pwd"
      :channels="[formData.channel]"
      @close="getProductList"
    />
  </j-page-container>
</template>

<script setup lang="ts">
import { onlyMessage } from "@jetlinks-web/utils";
import DeviceApi from "../../../api/device";
import { PROVIDER_OPTIONS } from "../const";
import type { ProductType } from "../typings";
import SaveProduct from "./SaveProduct.vue";
import { notification } from "ant-design-vue";
import { omit } from "lodash-es";
import { queryDeviceConfig } from "../../../api/instance";
import RadioCard from "../../../components/RadioCard/index.vue";

import { deviceImg } from "../../../assets/device/index";
import { useI18n } from "vue-i18n";

const { t: $t } = useI18n();
const route = useRoute();

// 表单数据
const formData = ref<any>({
  id: "",
  name: "",
  channel: "gb28181-2016",
  photoUrl: deviceImg.deviceMedia,
  productId: undefined,
  description: "",
  others: {
    access_pwd: "",
    onvifUrl: "",
    onvifPassword: "",
    onvifUsername: "",
  },
  // 编辑字段
  streamMode: "",
  manufacturer: "",
  model: "",
  firmware: "",
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
    sorts: [{ name: "createTime", order: "desc" }],
    terms: [
      { column: "accessProvider", value: formData.value.channel },
      { column: "state", value: 1 },
    ],
  };
  const { result } = await DeviceApi.queryProductList(params);
  productList.value = result;
  if (result.length && !route.query.id) {
    formData.value.productId = result[0]?.id;
    formData.value.others.access_pwd = result[0]?.configuration?.access_pwd;
    formData.value.streamMode = result[0]?.configuration?.stream_mode;
  }
};

const handleProductChange = () => {
  formData.value.others.access_pwd =
    productList.value.find((f: any) => f.id === formData.value.productId)
      ?.configuration.access_pwd || "";
  formData.value.streamMode =
    productList.value.find((f: any) => f.id === formData.value.productId)
      ?.configuration.stream_mode || "";
};

//获取物模型下拉选项
const getOptions = (i: any) => {
  if (i.type.type === "enum") {
    return (i.type?.elements || []).map((item) => {
      return {
        label: item?.text,
        value: item?.value,
      };
    });
  } else if (i.type.type === "boolean") {
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
    if (productData && formData.value.channel !== "media-plugin") {
      formData.value.others.access_pwd = formData.value.others.access_pwd
        ? formData.value.others.access_pwd
        : productData?.configuration?.access_pwd;
      formData.value.streamMode = formData.value.streamMode
        ? formData.value.streamMode
        : productData?.configuration?.stream_mode;
    }
    if (productData && formData.value.channel === "media-plugin") {
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
  if (
    formData.value.channel === "fixed-media" ||
    formData.value.channel === "agent-media-device-gateway"
  ) {
    // 固定地址
    params = !id
      ? extraParams
      : { id, streamMode, manufacturer, model, firmware, ...extraParams };
  } else if (formData.value.channel === "gb28181-2016") {
    // 国标
    others = omit(others, ["onvifUrl", "onvifPassword", "onvifUsername"]);
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
    params = !id ? { others, id, ...extraParams } : getParams();
  } else if (formData.value.channel === "onvif") {
    others = omit(others, ["access_pwd"]);
    params = !id
      ? { others, ...extraParams }
      : {
          id,
          streamMode,
          manufacturer,
          model,
          firmware,
          others,
          ...extraParams,
        };
  } else if (formData.value.channel === "media-plugin") {
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
            key: "error",
            message: $t("Save.index.5349810-74"),
          });
        }
      } else {
        res = await DeviceApi.update(params);
      }
      if (res?.success) {
        onlyMessage($t("Save.index.5349810-75"));
        history.back();
      }
    })
    .catch((err: any) => {
      console.log("err: ", err);
    })
    .finally(() => {
      btnLoading.value = false;
    });
};
</script>

<style lang="less" scoped>
@import "./index.less";
</style>
