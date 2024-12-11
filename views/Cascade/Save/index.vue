<!-- 国标级联新增/编辑 -->
<template>
  <j-page-container>
    <a-card>
      <a-row :gutter="24">
        <a-col :span="12">
          <a-form ref="formRef" layout="vertical" :model="formData">
            <a-row :gutter="24">
              <TitleComponent :data="$t('Save.index.122693-0')"/>
              <a-col :span="12">
                <a-form-item
                    :label="$t('Save.index.122693-1')"
                    name="cascadeName"
                    :rules="[
                                        {
                                            required: true,
                                            message: $t('Save.index.122693-2'),
                                        },
                                        {
                                            max: 64,
                                            message: $t('Save.index.122693-3'),
                                        },
                                    ]"
                >
                  <a-input
                      v-model:value="formData.cascadeName"
                      :placeholder="$t('Save.index.122693-2')"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item
                    :label="$t('Save.index.122693-4')"
                    name="proxyStream"
                    :rules="[
                                        {
                                            required: true,
                                            message: $t('Save.index.122693-5'),
                                        },
                                    ]"
                >
                  <a-radio-group
                      button-style="solid"
                      v-model:value="formData.proxyStream"
                  >
                    <a-radio-button :value="true">
                      {{ $t('Save.index.122693-6') }}
                    </a-radio-button>
                    <a-radio-button :value="false">
                      {{ $t('Save.index.122693-7') }}
                    </a-radio-button>
                  </a-radio-group>
                </a-form-item>
              </a-col>

              <TitleComponent :data="$t('Save.index.122693-8')"/>
              <a-col :span="12">
                <a-form-item
                    name="clusterNodeId"
                    :rules="[
                                        {
                                            required: true,
                                            message: $t('Save.index.122693-9'),
                                        },
                                    ]"
                >
                  <template #label>
                                        <span>
                                            {{ $t('Save.index.122693-10') }}
                                            <a-tooltip
                                                :title="$t('Save.index.122693-11')"
                                            >
                                                <AIcon
                                                    type="QuestionCircleOutlined"
                                                    style="margin-left: 2px"
                                                />
                                            </a-tooltip>
                                        </span>
                  </template>
                  <a-select
                      v-model:value="formData.clusterNodeId"
                      :placeholder="$t('Save.index.122693-9')"
                      :options="clustersList"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item
                    :label="$t('Save.index.122693-12')"
                    name="name"
                    :rules="[
                                        {
                                            required: true,
                                            message: $t('Save.index.122693-13'),
                                        },
                                        {
                                            max: 64,
                                            message: $t('Save.index.122693-3'),
                                        },
                                    ]"
                >
                  <a-input
                      v-model:value="formData.name"
                      :placeholder="$t('Save.index.122693-13')"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="24">
                <a-form-item
                    :label="$t('Save.index.122693-14')"
                    name="sipId"
                    :rules="[
                                        {
                                            required: true,
                                            message: $t('Save.index.122693-15'),
                                        },
                                        {
                                            max: 64,
                                            message: $t('Save.index.122693-3'),
                                        },
                                    ]"
                >
                  <a-input
                      v-model:value="formData.sipId"
                      :placeholder="$t('Save.index.122693-15')"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item
                    :label="$t('Save.index.122693-16')"
                    name="domain"
                    :rules="[
                                        {
                                            required: true,
                                            message: $t('Save.index.122693-17'),
                                        },
                                        {
                                            max: 64,
                                            message: $t('Save.index.122693-3'),
                                        },
                                    ]"
                >
                  <a-input
                      v-model:value="formData.domain"
                      :placeholder="$t('Save.index.122693-17')"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item
                    :label="$t('Save.index.122693-18')"
                    name="remoteAddress"
                    :rules="[
                                        {
                                            required: true,
                                            message: $t('Save.index.122693-19'),
                                        },
                                        {
                                            validator: checkSIP,
                                        },
                                    ]"
                >
                  <a-row :gutter="10">
                    <a-col :span="14">
                      <a-input
                          v-model:value="
                                                    formData.remoteAddress
                                                "
                          :placeholder="$t('Save.index.122693-20')"
                      />
                    </a-col>
                    <a-col :span="10">
                      <a-input-number
                          :min="1"
                          :max="65535"
                          v-model:value="
                                                    formData.remotePort
                                                "
                          :placeholder="$t('Save.index.122693-21')"
                          style="width: 100%"
                          :precision="0"
                      />
                    </a-col>
                  </a-row>
                </a-form-item>
              </a-col>

              <a-col :span="24">
                <a-form-item
                    :label="$t('Save.index.122693-22')"
                    name="localSipId"
                    :rules="[
                                        {
                                            required: true,
                                            message: $t('Save.index.122693-23'),
                                        },
                                        {
                                            max: 64,
                                            message: $t('Save.index.122693-3'),
                                        },
                                    ]"
                >
                  <a-input
                      v-model:value="formData.localSipId"
                      :placeholder="$t('Save.index.122693-24')"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item
                    name="host"
                    :rules="[
                                        {
                                            required: true,
                                            message: $t('Save.index.122693-25'),
                                        },
                                        {
                                            validator: checkLocalSIP,
                                        },
                                    ]"
                >
                  <template #label>
                                        <span>
                                            {{ $t('Save.index.122693-26') }}
                                            <a-tooltip
                                                :title="$t('Save.index.122693-27')"
                                            >
                                                <AIcon
                                                    type="QuestionCircleOutlined"
                                                    style="margin-left: 2px"
                                                />
                                            </a-tooltip>
                                        </span>
                  </template>
                  <a-row :gutter="10">
                    <a-col :span="14">
                      <a-select
                          v-model:value="formData.host"
                          :placeholder="$t('Save.index.122693-28')"
                          :options="allList"
                          @change="setPorts"
                          showSearch
                      />
                    </a-col>
                    <a-col :span="10">
                      <a-select
                          v-model:value="formData.port"
                          :placeholder="$t('Save.index.122693-29')"
                          :options="allListPorts"
                      />
                    </a-col>
                  </a-row>
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item
                    :label="$t('Save.index.122693-30')"
                    name="publicHost"
                    :rules="[
                                        {
                                            required: true,
                                            message: $t('Save.index.122693-31'),
                                        },
                                        {
                                            validator: checkPublicSIP,
                                        },
                                    ]"
                >
                  <a-row :gutter="10">
                    <a-col :span="14">
                      <a-input
                          v-model:value="
                                                    formData.publicHost
                                                "
                          :placeholder="$t('Save.index.122693-20')"
                      />
                    </a-col>
                    <a-col :span="10">
                      <a-input-number
                          :min="1"
                          :max="65535"
                          v-model:value="
                                                    formData.publicPort
                                                "
                          :placeholder="$t('Save.index.122693-21')"
                          style="width: 100%"
                          :precision="0"
                      />
                    </a-col>
                  </a-row>
                </a-form-item>
              </a-col>
              <a-col :span="24">
                <a-form-item
                    :label="$t('Save.index.122693-32')"
                    name="transport"
                    :rules="[
                                        {
                                            required: true,
                                            message: $t('Save.index.122693-33'),
                                        },
                                    ]"
                >
                  <a-radio-group
                      button-style="solid"
                      v-model:value="formData.transport"
                      @change="handleTransportChange"
                  >
                    <a-radio-button value="UDP">
                      UDP
                    </a-radio-button>
                    <a-radio-button value="TCP">
                      TCP
                    </a-radio-button>
                  </a-radio-group>
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item
                    :label="$t('Save.index.122693-34')"
                    name="user"
                    :rules="[
                                        {
                                            required: true,
                                            message: $t('Save.index.122693-35'),
                                        },
                                        {
                                            max: 64,
                                            message: $t('Save.index.122693-3'),
                                        },
                                    ]"
                >
                  <a-input
                      v-model:value="formData.user"
                      :placeholder="$t('Save.index.122693-35')"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item
                    :label="$t('Save.index.122693-36')"
                    name="password"
                    :rules="[
                                        {
                                            required: true,
                                            message: $t('Save.index.122693-37'),
                                        },
                                        {
                                            max: 64,
                                            message: $t('Save.index.122693-3'),
                                        },
                                    ]"
                >
                  <a-input-password
                      v-model:value="formData.password"
                      :placeholder="$t('Save.index.122693-37')"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item
                    :label="$t('Save.index.122693-38')"
                    name="manufacturer"
                    :rules="[
                                        {
                                            required: true,
                                            message: $t('Save.index.122693-39'),
                                        },
                                        {
                                            max: 64,
                                            message: $t('Save.index.122693-3'),
                                        },
                                    ]"
                >
                  <a-input
                      v-model:value="formData.manufacturer"
                      :placeholder="$t('Save.index.122693-39')"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item
                    :label="$t('Save.index.122693-40')"
                    name="model"
                    :rules="[
                                        {
                                            required: true,
                                            message: $t('Save.index.122693-41'),
                                        },
                                        {
                                            max: 64,
                                            message: $t('Save.index.122693-3'),
                                        },
                                    ]"
                >
                  <a-input
                      v-model:value="formData.model"
                      :placeholder="$t('Save.index.122693-41')"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item
                    :label="$t('Save.index.122693-42')"
                    name="firmware"
                    :rules="[
                                        {
                                            required: true,
                                            message: $t('Save.index.122693-43'),
                                        },
                                        {
                                            max: 64,
                                            message: $t('Save.index.122693-3'),
                                        },
                                    ]"
                >
                  <a-input
                      v-model:value="formData.firmware"
                      :placeholder="$t('Save.index.122693-43')"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item
                    :label="$t('Save.index.122693-44')"
                    name="keepaliveInterval"
                    :rules="[
                                        {
                                            required: true,
                                            message: $t('Save.index.122693-45'),
                                        },
                                        {
                                            pattern: /^[1-9]\d*$/,
                                            message: $t('Save.index.122693-46'),
                                        }
                                    ]"
                >
                  <a-input-number
                      :min="1"
                      :max="10000"
                      v-model:value="
                                            formData.keepaliveInterval
                                        "
                      :placeholder="$t('Save.index.122693-45')"
                      style="width: 100%"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item
                    :label="$t('Save.index.122693-47')"
                    name="registerInterval"
                    :rules="[
                                        {
                                            required: true,
                                            message: $t('Save.index.122693-48'),
                                        },
                                        {
                                            pattern: /^[1-9]\d*$/,
                                            message: $t('Save.index.122693-46'),
                                        }
                                    ]"
                >
                  <a-input-number
                      :min="1"
                      :max="10000"
                      v-model:value="
                                            formData.registerInterval
                                        "
                      :placeholder="$t('Save.index.122693-48')"
                      style="width: 100%"
                  />
                </a-form-item>
              </a-col>
            </a-row>

            <a-form-item>
              <a-button
                  type="primary"
                  @click="handleSubmit"
                  :loading="btnLoading"
              >
                {{ $t('Save.index.122693-49') }}
              </a-button>
            </a-form-item>
          </a-form>
        </a-col>
        <a-col :span="12">
          <div class="doc">
            <h1>{{ $t('Save.index.122693-50') }}</h1>
            <div>
              {{ $t('Save.index.122693-51') }}
            </div>
            <div>
              <a-alert
                  :message="$t('Save.index.122693-52')"
                  type="info"
                  show-icon
              />
            </div>
            <h1>{{ $t('Save.index.122693-53') }}</h1>
            <div>
              {{ $t('Save.index.122693-54') }}
            </div>
            <h2>1、{{ $t('Save.index.122693-14') }}</h2>
            <div>{{ $t('Save.index.122693-56') }}<b>SIP ID</b>。</div>
            <div class="image">
              <a-image
                  width="100%"
                  :src="cascade.doc2"
              />
            </div>
            <h2>{{ $t('Save.index.122693-57') }}</h2>
            <div>{{ $t('Save.index.122693-56') }}<b>{{ $t('Save.index.122693-58') }}</b>。</div>
            <div class="image">
              <a-image
                  width="100%"
                  :src="cascade.doc1"
              />
            </div>
            <h2>3、{{ $t('Save.index.122693-18') }}</h2>
            <div>{{ $t('Save.index.122693-56') }}<b>{{ $t('Save.index.122693-60') }}</b>。</div>
            <div class="image">
              <a-image
                  width="100%"
                  :src="cascade.doc3"
              />
            </div>
            <h2>4、{{ $t('Save.index.122693-22') }}</h2>
            <div>
              {{ $t('Save.index.122693-62') }}<b>{{ $t('Save.index.122693-60') }}</b>。
              {{ $t('Save.index.122693-63') }}({{ $t('Save.index.122693-64') }}){{ $t('Save.index.122693-65') }}({{ $t('Save.index.122693-66') }}){{ $t('Save.index.122693-67') }}({{ $t('Save.index.122693-68') }}){{ $t('Save.index.122693-69') }}({{ $t('Save.index.122693-70') }}){{ $t('Save.index.122693-71') }}
              {{ $t('Save.index.122693-72') }}
            </div>
            <h2>5、{{ $t('Save.index.122693-26') }}</h2>
            <div>
              {{ $t('Save.index.122693-74') }}<b>{{ $t('Save.index.122693-75') }}</b>{{ $t('Save.index.122693-76') }}
            </div>
            <h2>6、{{ $t('Save.index.122693-34') }}</h2>
            <div>
              {{ $t('Save.index.122693-78') }}<b
            >{{ $t('Save.index.122693-22') }}</b
            >{{ $t('Save.index.122693-79') }}
            </div>
            <h2>7、{{ $t('Save.index.122693-36') }}</h2>
            <div>
              {{ $t('Save.index.122693-81') }}
            </div>
            <h2>8、{{ $t('Save.index.122693-38') }}/{{ $t('Save.index.122693-40') }}/{{ $t('Save.index.122693-42') }}</h2>
            <div>
              {{ $t('Save.index.497102-0') }}{{ $t('Save.index.122693-40') }}、{{ $t('Save.index.122693-42') }}。
            </div>
            <h2>{{ $t('Save.index.122693-84') }}</h2>
            <div>
              {{ $t('Save.index.122693-85') }}
            </div>
            <h2>{{ $t('Save.index.122693-86') }}</h2>
            <div>
              {{ $t('Save.index.122693-87') }}
              {{ $t('Save.index.122693-88') }}
            </div>
          </div>
        </a-col>
      </a-row>
    </a-card>
  </j-page-container>
</template>

<script setup lang="ts">
import {onlyMessage} from '@jetlinks-web/utils';
import CascadeApi from '../../../api/cascade';
import {regIPv6} from '@/utils/regular'
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();
const router = useRouter();
const route = useRoute();
import {cascade} from '../../../assets/cascade/index'

// 表单数据
const formData = ref({
  id: route.query.id || undefined,
  // name: undefined,
  cascadeName: undefined,
  proxyStream: false,
  // 以下字段, 提交时需提取到sipConfigs[{}]字段当中
  clusterNodeId: undefined,
  name: undefined,
  sipId: undefined,
  domain: undefined,
  remoteAddress: undefined,
  remotePort: undefined,
  localSipId: undefined,
  host: undefined,
  port: undefined,
  // remotePublic: {
  //     host: undefined,
  //     port: undefined,
  // },
  publicHost: undefined,
  publicPort: undefined,
  transport: 'UDP',
  user: undefined,
  password: undefined,
  manufacturer: undefined,
  model: undefined,
  firmware: undefined,
  keepaliveInterval: '60',
  registerInterval: '3600',
});

/**
 * 获取集群节点
 */
const clustersList = ref([]);
const getClustersList = async () => {
  const {result} = await CascadeApi.clusters();
  clustersList.value = result.map((m: any) => ({
    label: m.name,
    value: m.id,
  }));
};

/**
 * SIP本地地址
 */
const allList = ref<any[]>([]);
const getAllList = async () => {
  const {result} = await CascadeApi.all();
  allList.value = result.map((m: any) => ({
    label: m.host,
    value: m.host,
    ...m,
  }));
  setPorts();
};


const handleTransportChange = () => {
  formData.value.host = undefined;
  formData.value.port = undefined;
  setPorts();
};
/**
 * 获取端口
 */
const allListPorts = ref([]);
const setPorts = () => {
  if (!formData.value.host) {
    allListPorts.value = []
    return
  }
  ;
  allListPorts.value = allList.value
      .find((f: any) => f.host === formData.value.host)
      ?.ports[formData.value.transport || '']?.map((m: string) => ({
    label: m,
    value: m,
  }));
};

/**
 * 获取详情
 */
const getDetail = async () => {
  if (!route.query.id) return;
  const res = await CascadeApi.detail(route.query.id as string);
  const {id, name, proxyStream, sipConfigs, ...others} = res.result;
  Object.keys(formData.value).forEach((key: string) => {
    if (key === 'id') formData.value[key] = id;
    else if (key === 'cascadeName') formData.value[key] = name;
    else if (key === 'proxyStream') formData.value[key] = proxyStream;
    else formData.value[key] = sipConfigs[0][key];
  });
  // console.log('formData.value: ', formData.value);
};


const regDomain = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(?:\.|$)){4}$/
// /[j-zA-Z0-9][-j-zA-Z0-9]{0,62}(\.[j-zA-Z0-9][-j-zA-Z0-9]{0,62})+\.?/;

const ipv6 = new RegExp(/^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/)
/**
 * 上级SIP地址 字段验证
 * @param _
 * @param value 此处绑定的是 remoteAddress
 */
const checkSIP = (_: any, value: string) => {
  return checkHost(value, formData.value.remotePort);
};
/**
 * SIP远程地址 字段验证
 * @param _
 * @param value 此处绑定的是 publicHost
 */
const checkPublicSIP = (_: any, value: string) => {
  return checkHost(value, formData.value.publicPort);
};

/**
 * 字段验证
 * @param host ip
 * @param port 端口
 */
const checkHost = (host: string, port: string | number | undefined) => {
  if (!host) {
    return Promise.resolve();
  } else if (!host) {
    return Promise.reject(new Error($t('Save.index.122693-89')));
  } else if (host && !regDomain.test(host) && !regIPv6.test(host)) {
    return Promise.reject(new Error($t('Save.index.122693-90')));
  } else if (!port) {
    return Promise.reject(new Error($t('Save.index.122693-21')));
  } else if ((port && Number(port) < 1) || Number(port) > 65535) {
    return Promise.reject(new Error($t('Save.index.122693-91')));
  }
  return Promise.resolve();
};

/**
 * SIP本地地址 字段验证
 * @param _
 * @param value
 */
const checkLocalSIP = (_: any, value: string) => {
  if (!value) {
    return Promise.resolve();
  } else if (!value) {
    return Promise.reject(new Error($t('Save.index.122693-28')));
  } else if (!formData.value.port) {
    return Promise.reject(new Error($t('Save.index.122693-29')));
  }
  return Promise.resolve();
};

/**
 * 表单提交
 */
const formRef = ref();
const btnLoading = ref<boolean>(false);
const handleSubmit = () => {
  // console.log('formData.value: ', formData.value);
  formRef.value
      .validate()
      .then(() => {
        const {
          id,
          cascadeName,
          proxyStream,
          // publicHost,
          // publicPort,
          ...extraFormData
        } = formData.value;
        const params = {
          id,
          name: cascadeName,
          proxyStream,
          sipConfigs: [
            {
              ...extraFormData,
              // remotePublic: {
              //     host: publicHost,
              //     port: publicPort,
              // },
            },
          ],
        };
        btnLoading.value = true;
        CascadeApi[id ? 'update' : 'save'](params)
            .then(() => {
              onlyMessage($t('Save.index.122693-92'));
              router.back();
            })
            .finally(() => {
              btnLoading.value = false;
            });
      })
      .catch((err: any) => {
        console.log('err: ', err);
      });
};

onMounted(async () => {
  await getDetail();
  getClustersList();
  getAllList();
});
</script>

<style lang="less" scoped>
 @import './index.less';
</style>
