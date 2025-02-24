<template>
    <j-page-container>
        <FullPage>
            <a-card>
                <a-form
                    ref="formRef"
                    class="form"
                    layout="vertical"
                    :model="formData"
                    name="basic"
                    autocomplete="off"
                >
                    <a-row :gutter="[16, 0]">
                        <a-col :span="12">
                            <a-form-item
                                :label="$t('Detail.index.416932-0')"
                                name="name"
                                :rules="[
                                    {
                                        required: true,
                                        message: $t('Detail.index.416932-1'),
                                    },
                                    {
                                        max: 64,
                                        message: $t('Detail.index.416932-2'),
                                    },
                                ]"
                            >
                                <a-input
                                    v-model:value="formData.name"
                                    :placeholder="$t('Detail.index.416932-1')"
                                />
                            </a-form-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-item
                                :label="$t('Detail.index.416932-3')"
                                name="provider"
                                :rules="[
                                    {
                                        required: true,
                                        message: $t('Detail.index.416932-4'),
                                    },
                                ]"
                            >
                                <a-select
                                    ref="select"
                                    v-model:value="formData.provider"
                                    :options="options"
                                    :placeholder="$t('Detail.index.416932-4')"
                                ></a-select>
                            </a-form-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-item
                                :label="$t('Detail.index.416932-5')"
                                :name="['configuration', 'secret']"
                                :rules="[
                                    {
                                        max: 64,
                                        message: $t('Detail.index.416932-2'),
                                    },
                                ]"
                            >
                                <a-input-password
                                    :placeholder="$t('Detail.index.416932-6')"
                                    v-model:value="
                                        formData.configuration.secret
                                    "
                                />
                            </a-form-item>
                        </a-col>
                        <a-col :span="8" class="form-item">
                            <a-form-item
                                :name="['configuration', 'apiHost']"
                                :rules="[
                                    {
                                        required: true,
                                        message: $t('Detail.index.416932-7'),
                                    },
                                    {
                                        validator: validateAddress,
                                        message: $t('Detail.index.416932-8'),
                                    },
                                ]"
                            >
                                <template #label>
                                    API Host
                                    <a-tooltip
                                        :title="$t('Detail.index.416932-9')"
                                    >
                                        <AIcon
                                            type="QuestionCircleOutlined"
                                            style="margin-left: 2px"
                                        />
                                    </a-tooltip>
                                </template>
                                <a-input
                                    :placeholder="$t('Detail.index.416932-7')"
                                    v-model:value="
                                        formData.configuration.apiHost
                                    "
                                />
                            </a-form-item>
                        </a-col>
                        <a-col :span="4">
                            <a-form-item
                                class="form-item"
                                :name="['configuration', 'apiPort']"
                                :rules="[
                                    {
                                        required: true,
                                        message: $t('Detail.index.416932-10'),
                                    },
                                ]"
                            >
                                <div class="form-label"></div>

                                <a-input-number
                                    style="width: 100%"
                                    :min="1"
                                    :max="65535"
                                    :precision="0"
                                    :placeholder="$t('Detail.index.416932-11')"
                                    v-model:value="
                                        formData.configuration.apiPort
                                    "
                                    @change="changePort"
                                />
                            </a-form-item>
                        </a-col>
                        <div style="width: 100%; display: flex">
                            <a-col :span="8" class="form-item">
                                <a-form-item
                                    :name="['configuration', 'rtpIp']"
                                    :rules="[
                                        {
                                            required: true,
                                            message: $t('Detail.index.416932-12'),
                                        },
                                        {
                                            validator: validateAddress,
                                            message:
                                                $t('Detail.index.416932-8'),
                                        },
                                    ]"
                                >
                                    <template #label>
                                        RTP IP
                                        <a-tooltip
                                            :title="$t('Detail.index.416932-13')"
                                        >
                                            <AIcon
                                                type="QuestionCircleOutlined"
                                                style="margin-left: 2px"
                                            />
                                        </a-tooltip>
                                    </template>
                                    <a-input
                                        :placeholder="$t('Detail.index.416932-12')"
                                        v-model:value="
                                            formData.configuration.rtpIp
                                        "
                                    />
                                </a-form-item>
                            </a-col>
                            <a-col :span="4" v-if="!checked">
                                <a-form-item
                                    class="form-item"
                                    :name="['configuration', 'rtpPort']"
                                    :rules="[
                                        {
                                            required: true,
                                            message: $t('Detail.index.416932-10'),
                                        },
                                    ]"
                                >
                                    <div class="form-label"></div>

                                    <a-input-number
                                        style="width: 100%"
                                        :min="1"
                                        :max="65535"
                                        :precision="0"
                                        :placeholder="$t('Detail.index.416932-10')"
                                        v-model:value="
                                            formData.configuration.rtpPort
                                        "
                                    />
                                </a-form-item>
                            </a-col>
                            <a-col :span="4" v-if="checked">
                                <a-form-item
                                    class="form-item"
                                    :name="[
                                        'configuration',
                                        'dynamicRtpPortRange0',
                                    ]"
                                    :rules="[
                                        {
                                            required: true,
                                            message: $t('Detail.index.416932-14'),
                                        },
                                    ]"
                                >
                                    <div class="form-label"></div>
                                    <a-input-number
                                        style="width: 100%"
                                        :min="1"
                                        :max="
                                            formData.configuration
                                                .dynamicRtpPortRange1 || 65535
                                        "
                                        :precision="0"
                                        :placeholder="$t('Detail.index.416932-15')"
                                        v-model:value="
                                            formData.configuration
                                                .dynamicRtpPortRange0
                                        "
                                    />
                                </a-form-item>
                            </a-col>
                            <div class="form-item-checked" v-if="checked">
                                {{ $t('Detail.index.416932-16') }}
                            </div>
                            <a-col :span="4" v-if="checked">
                                <a-form-item
                                    class="form-item"
                                    :name="[
                                        'configuration',
                                        'dynamicRtpPortRange1',
                                    ]"
                                    :rules="[
                                        {
                                            required: true,
                                            message: $t('Detail.index.416932-17'),
                                        },
                                    ]"
                                >
                                    <div class="form-label"></div>
                                    <a-input-number
                                        style="width: 100%"
                                        :min="
                                            formData.configuration
                                                .dynamicRtpPortRange0 || 1
                                        "
                                        :max="65535"
                                        :precision="0"
                                        :placeholder="$t('Detail.index.416932-18')"
                                        v-model:value="
                                            formData.configuration
                                                .dynamicRtpPortRange1
                                        "
                                    />
                                </a-form-item>
                            </a-col>
                            <a-col :span="4">
                                <a-form-item
                                    class="form-item-checked2"
                                    :name="['configuration', 'dynamicRtpPort']"
                                >
                                    <div class="form-label"></div>
                                    <a-checkbox
                                        v-model:checked="
                                            formData.configuration
                                                .dynamicRtpPort
                                        "
                                    >
                                        {{ $t('Detail.index.416932-19') }}
                                    </a-checkbox>
                                </a-form-item>
                            </a-col>
                        </div>
                        <template
                            v-if="formData.provider === 'embedded-zlmedia'"
                        >
                            <a-col :span="24" style="margin-bottom: 6px">
                                IP
                                <a-tooltip>
                                    <template #title
                                    >{{ $t('Detail.index.416932-20') }}</template
                                    >
                                    <AIcon
                                        type="QuestionCircleOutlined"
                                        style="
                                            margin-left: 2px;
                                            margin-right: 6px;
                                        "
                                    />
                                </a-tooltip>
                                <a-checkbox
                                    v-model:checked="
                                        formData.configuration.distinguish
                                    "
                                >
                                    {{ $t('Detail.index.416932-21') }}
                                </a-checkbox>
                            </a-col>
                            <a-col :span="12">
                                {{ $t('Detail.index.416932-22') }}
                                <div class="item">
                                    <a-row :gutter="[16, 0]">
                                        <a-col :span="24">
                                            <a-form-item
                                                :name="[
                                                    'configuration',

                                                    'apiHost',
                                                ]"
                                                :rules="[
                                                    {
                                                        required: true,
                                                        message: $t('Detail.index.416932-23'),
                                                    },
                                                ]"
                                            >
                                                <a-input
                                                    v-model:value="
                                                        formData.configuration
                                                            .apiHost
                                                    "
                                                    :disabled="true"
                                                    :placeholder="$t('Detail.index.416932-23')"
                                                ></a-input>
                                            </a-form-item>
                                        </a-col>
                                        <a-col :span="8">
                                            <a-form-item
                                                :name="[
                                                    'configuration',
                                                    'rtspPort',
                                                ]"
                                                :rules="[
                                                    {
                                                        required: true,
                                                        message:
                                                            $t('Detail.index.416932-24'),
                                                    },
                                                ]"
                                            >
                                                <template #label>
                                                    {{ $t('Detail.index.416932-25') }}
                                                    <a-tooltip
                                                        :title="tooltipText('RTSP', 'Intranet')"
                                                    >
                                                        <AIcon
                                                            type="QuestionCircleOutlined"
                                                            style="
                                                                margin-left: 2px;
                                                            "
                                                        />
                                                    </a-tooltip>
                                                </template>
                                                <a-input-number
                                                    style="width: 100%"
                                                    :min="1"
                                                    :max="65535"
                                                    :precision="0"
                                                    :placeholder="$t('Detail.index.416932-25')"
                                                    v-model:value="
                                                        formData.configuration
                                                            .rtspPort
                                                    "
                                                />
                                            </a-form-item>
                                        </a-col>
                                        <a-col :span="8">
                                            <a-form-item
                                                class="form-item"
                                                :name="[
                                                    'configuration',
                                                    'rtmpPort',
                                                ]"
                                                :rules="[
                                                    {
                                                        required: true,
                                                        message:
                                                            $t('Detail.index.416932-27'),
                                                    },
                                                ]"
                                            >
                                                <template #label>
                                                    {{ $t('Detail.index.416932-28') }}
                                                    <a-tooltip
                                                        :title="tooltipText('RTMP', 'Intranet')"
                                                    >
                                                        <AIcon
                                                            type="QuestionCircleOutlined"
                                                            style="
                                                                margin-left: 2px;
                                                            "
                                                        />
                                                    </a-tooltip>
                                                </template>
                                                <a-input-number
                                                    style="width: 100%"
                                                    :min="1"
                                                    :max="65535"
                                                    :precision="0"
                                                    :placeholder="$t('Detail.index.416932-28')"
                                                    v-model:value="
                                                        formData.configuration
                                                            .rtmpPort
                                                    "
                                                />
                                            </a-form-item>
                                        </a-col>
                                        <a-col :span="8">
                                            <a-form-item
                                                class="form-item"
                                                :name="[
                                                    'otherConfiguration',
                                                    'internalNet',
                                                    'rtcPort',
                                                ]"
                                                :rules="[
                                                    {
                                                        required: true,
                                                        message:
                                                            $t('Detail.index.416932-30'),
                                                    },
                                                ]"
                                            >
                                                <template #label>
                                                    {{ $t('Detail.index.416932-31') }}
                                                    <a-tooltip
                                                        :title="tooltipText('RTC', 'Intranet')"
                                                    >
                                                        <AIcon
                                                            type="QuestionCircleOutlined"
                                                            style="
                                                                margin-left: 2px;
                                                            "
                                                        />
                                                    </a-tooltip>
                                                </template>
                                                <a-input-number
                                                    style="width: 100%"
                                                    :min="1"
                                                    :max="65535"
                                                    :precision="0"
                                                    :placeholder="$t('Detail.index.416932-28')"
                                                    v-model:value="
                                                        formData
                                                            .otherConfiguration
                                                            .internalNet.rtcPort
                                                    "
                                                />
                                            </a-form-item>
                                        </a-col>
                                        <a-col :span="8">
                                            <a-form-item
                                                class="form-item"
                                                :name="[
                                                    'otherConfiguration',
                                                    'internalNet',
                                                    'mp4Port',
                                                ]"
                                                :rules="[
                                                    {
                                                        required: true,
                                                        message:
                                                            $t('Detail.index.416932-33'),
                                                    },
                                                ]"
                                            >
                                                <template #label>
                                                    {{ $t('Detail.index.416932-34') }}
                                                    <a-tooltip
                                                        :title="tooltipText('MP4', 'Intranet')"
                                                    >
                                                        <AIcon
                                                            type="QuestionCircleOutlined"
                                                            style="
                                                                margin-left: 2px;
                                                            "
                                                        />
                                                    </a-tooltip>
                                                </template>
                                                <a-input-number
                                                    style="width: 100%"
                                                    :min="1"
                                                    :max="65535"
                                                    :precision="0"
                                                    disabled
                                                    :placeholder="$t('Detail.index.416932-34')"
                                                    v-model:value="
                                                        formData
                                                            .otherConfiguration
                                                            .internalNet.mp4Port
                                                    "
                                                />
                                            </a-form-item>
                                        </a-col>
                                        <a-col :span="8">
                                            <a-form-item
                                                class="form-item"
                                                :name="[
                                                    'otherConfiguration',
                                                    'internalNet',
                                                    'hlsPort',
                                                ]"
                                                :rules="[
                                                    {
                                                        required: true,
                                                        message:
                                                            $t('Detail.index.416932-36'),
                                                    },
                                                ]"
                                            >
                                                <template #label>
                                                    {{ $t('Detail.index.416932-37') }}
                                                    <a-tooltip
                                                        :title="tooltipText('HLS', 'Intranet')"
                                                    >
                                                        <AIcon
                                                            type="QuestionCircleOutlined"
                                                            style="
                                                                margin-left: 2px;
                                                            "
                                                        />
                                                    </a-tooltip>
                                                </template>
                                                <a-input-number
                                                    style="width: 100%"
                                                    :min="1"
                                                    :max="65535"
                                                    :precision="0"
                                                    disabled
                                                    :placeholder="$t('Detail.index.416932-37')"
                                                    v-model:value="
                                                        formData
                                                            .otherConfiguration
                                                            .internalNet.hlsPort
                                                    "
                                                />
                                            </a-form-item>
                                        </a-col>
                                        <a-col :span="8">
                                            <a-form-item
                                                class="form-item"
                                                :name="[
                                                    'otherConfiguration',
                                                    'internalNet',
                                                    'flvPort',
                                                ]"
                                                :rules="[
                                                    {
                                                        required: true,
                                                        message:
                                                            $t('Detail.index.416932-39'),
                                                    },
                                                ]"
                                            >
                                                <template #label>
                                                    {{ $t('Detail.index.416932-40') }}
                                                    <a-tooltip
                                                        :title="tooltipText('FLV', 'Intranet')"
                                                    >
                                                        <AIcon
                                                            type="QuestionCircleOutlined"
                                                            style="
                                                                margin-left: 2px;
                                                            "
                                                        />
                                                    </a-tooltip>
                                                </template>
                                                <a-input-number
                                                    style="width: 100%"
                                                    :min="1"
                                                    :max="65535"
                                                    :precision="0"
                                                    disabled
                                                    :placeholder="$t('Detail.index.416932-40')"
                                                    v-model:value="
                                                        formData
                                                            .otherConfiguration
                                                            .internalNet.flvPort
                                                    "
                                                />
                                            </a-form-item>
                                        </a-col>
                                    </a-row>
                                </div>
                            </a-col>
                            <template v-if="formData.configuration.distinguish">
                                <a-col :span="12">
                                    {{ $t('Detail.index.416932-42') }}
                                    <div class="item">
                                        <a-row :gutter="[16, 0]">
                                            <a-col :span="24"
                                            ><a-form-item
                                                :name="[
                                                        'otherConfiguration',
                                                        'outerNet',
                                                        'ip',
                                                    ]"
                                                :rules="[
                                                        {
                                                            required: true,
                                                            message:
                                                                $t('Detail.index.416932-43'),
                                                        },
                                                    ]"
                                            ><a-input
                                                :placeholder="$t('Detail.index.416932-43')"
                                                v-model:value="
                                                            formData
                                                                .otherConfiguration
                                                                .outerNet.ip
                                                        "
                                            ></a-input></a-form-item
                                            ></a-col>
                                            <a-col :span="8">
                                                <a-form-item
                                                    :name="[
                                                        'otherConfiguration',
                                                        'outerNet',
                                                        'rtspPort',
                                                    ]"
                                                    :rules="[
                                                        {
                                                            required: true,
                                                            message:
                                                                $t('Detail.index.416932-24'),
                                                        },
                                                    ]"
                                                >
                                                    <template #label>
                                                        {{ $t('Detail.index.416932-44') }}
                                                        <a-tooltip
                                                            :title="tooltipText('RTSP')"
                                                        >
                                                            <AIcon
                                                                type="QuestionCircleOutlined"
                                                                style="
                                                                    margin-left: 2px;
                                                                "
                                                            />
                                                        </a-tooltip>
                                                    </template>
                                                    <a-input-number
                                                        style="width: 100%"
                                                        :min="1"
                                                        :max="65535"
                                                        :precision="0"
                                                        :placeholder="$t('Detail.index.416932-25')"
                                                        v-model:value="
                                                            formData
                                                                .otherConfiguration
                                                                .outerNet
                                                                .rtspPort
                                                        "
                                                    />
                                                </a-form-item>
                                            </a-col>
                                            <a-col :span="8">
                                                <a-form-item
                                                    class="form-item"
                                                    :name="[
                                                        'otherConfiguration',
                                                        'outerNet',
                                                        'rtmpPort',
                                                    ]"
                                                    :rules="[
                                                        {
                                                            required: true,
                                                            message:
                                                                $t('Detail.index.416932-27'),
                                                        },
                                                    ]"
                                                >
                                                    <template #label>
                                                        {{ $t('Detail.index.416932-45') }}
                                                        <a-tooltip
                                                            :title="tooltipText('RTMP', 'Extranet')"
                                                        >
                                                            <AIcon
                                                                type="QuestionCircleOutlined"
                                                                style="
                                                                    margin-left: 2px;
                                                                "
                                                            />
                                                        </a-tooltip>
                                                    </template>
                                                    <a-input-number
                                                        style="width: 100%"
                                                        :min="1"
                                                        :max="65535"
                                                        :precision="0"
                                                        :placeholder="$t('Detail.index.416932-28')"
                                                        v-model:value="
                                                            formData
                                                                .otherConfiguration
                                                                .outerNet
                                                                .rtmpPort
                                                        "
                                                    />
                                                </a-form-item>
                                            </a-col>
                                            <a-col :span="8">
                                                <a-form-item
                                                    class="form-item"
                                                    :name="[
                                                        'otherConfiguration',
                                                        'outerNet',
                                                        'rtcPort',
                                                    ]"
                                                    :rules="[
                                                        {
                                                            required: true,
                                                            message:
                                                                $t('Detail.index.416932-30'),
                                                        },
                                                    ]"
                                                >
                                                    <template #label>
                                                        {{ $t('Detail.index.416932-31') }}
                                                        <a-tooltip
                                                            :title="tooltipText('RTC', 'Extranet')"
                                                        >
                                                            <AIcon
                                                                type="QuestionCircleOutlined"
                                                                style="
                                                                    margin-left: 2px;
                                                                "
                                                            />
                                                        </a-tooltip>
                                                    </template>
                                                    <a-input-number
                                                        style="width: 100%"
                                                        :min="1"
                                                        :max="65535"
                                                        :precision="0"
                                                        :placeholder="$t('Detail.index.416932-28')"
                                                        v-model:value="
                                                            formData
                                                                .otherConfiguration
                                                                .outerNet
                                                                .rtcPort
                                                        "
                                                    />
                                                </a-form-item>
                                            </a-col>
                                            <a-col :span="8">
                                                <a-form-item
                                                    class="form-item"
                                                    :name="[
                                                        'otherConfiguration',
                                                        'outerNet',
                                                        'mp4Port',
                                                    ]"
                                                    :rules="[
                                                        {
                                                            required: true,
                                                            message:
                                                                $t('Detail.index.416932-33'),
                                                        },
                                                    ]"
                                                >
                                                    <template #label>
                                                        {{ $t('Detail.index.416932-34') }}
                                                        <a-tooltip
                                                            :title="tooltipText('MP4', 'Extranet')"
                                                        >
                                                            <AIcon
                                                                type="QuestionCircleOutlined"
                                                                style="
                                                                    margin-left: 2px;
                                                                "
                                                            />
                                                        </a-tooltip>
                                                    </template>
                                                    <a-input-number
                                                        style="width: 100%"
                                                        :min="1"
                                                        :max="65535"
                                                        :precision="0"
                                                        :placeholder="$t('Detail.index.416932-34')"
                                                        v-model:value="
                                                            formData
                                                                .otherConfiguration
                                                                .outerNet
                                                                .mp4Port
                                                        "
                                                    />
                                                </a-form-item>
                                            </a-col>
                                            <a-col :span="8">
                                                <a-form-item
                                                    class="form-item"
                                                    :name="[
                                                        'otherConfiguration',
                                                        'outerNet',
                                                        'hlsPort',
                                                    ]"
                                                    :rules="[
                                                        {
                                                            required: true,
                                                            message:
                                                                $t('Detail.index.416932-36'),
                                                        },
                                                    ]"
                                                >
                                                    <template #label>
                                                        {{ $t('Detail.index.416932-37') }}
                                                        <a-tooltip
                                                            :title="tooltipText('HLS', 'Extranet')"
                                                        >
                                                            <AIcon
                                                                type="QuestionCircleOutlined"
                                                                style="
                                                                    margin-left: 2px;
                                                                "
                                                            />
                                                        </a-tooltip>
                                                    </template>
                                                    <a-input-number
                                                        style="width: 100%"
                                                        :min="1"
                                                        :max="65535"
                                                        :precision="0"
                                                        :placeholder="$t('Detail.index.416932-37')"
                                                        v-model:value="
                                                            formData
                                                                .otherConfiguration
                                                                .outerNet
                                                                .hlsPort
                                                        "
                                                    />
                                                </a-form-item>
                                            </a-col>
                                            <a-col :span="8">
                                                <a-form-item
                                                    class="form-item"
                                                    :name="[
                                                        'otherConfiguration',
                                                        'outerNet',
                                                        'flvPort',
                                                    ]"
                                                    :rules="[
                                                        {
                                                            required: true,
                                                            message:
                                                                $t('Detail.index.416932-39'),
                                                        },
                                                    ]"
                                                >
                                                    <template #label>
                                                        {{ $t('Detail.index.416932-40') }}
                                                        <a-tooltip
                                                            :title="tooltipText('FLV', 'Extranet')"
                                                        >
                                                            <AIcon
                                                                type="QuestionCircleOutlined"
                                                                style="
                                                                    margin-left: 2px;
                                                                "
                                                            />
                                                        </a-tooltip>
                                                    </template>
                                                    <a-input-number
                                                        style="width: 100%"
                                                        :min="1"
                                                        :max="65535"
                                                        :precision="0"
                                                        :placeholder="$t('Detail.index.416932-40')"
                                                        v-model:value="
                                                            formData
                                                                .otherConfiguration
                                                                .outerNet
                                                                .flvPort
                                                        "
                                                    />
                                                </a-form-item>
                                            </a-col>
                                        </a-row>
                                    </div>
                                </a-col>
                            </template>
                        </template>

                        <a-col :span="24">
                            <a-form-item>
                                <a-button
                                    v-if="view === 'false'"
                                    html-type="submit"
                                    type="primary"
                                    @click.prevent="onSubmit"
                                    :loading="loading"
                                >{{ $t('Detail.index.416932-46') }}</a-button
                                >
                            </a-form-item>
                        </a-col>
                    </a-row>
                </a-form>
            </a-card>
        </FullPage>
    </j-page-container>
</template>

<script lang="ts" setup name="StreamDetail">
import { onlyMessage } from '@jetlinks-web/utils';
import { queryProviders, queryDetail, save, update } from '../../../api/stream';
import type { FormInstance } from 'ant-design-vue';
import { omit } from 'lodash-es';
import { FormDataType } from '../type';
import { testIpv4_6 } from '@/utils/validate';
import i18n from '@/locales/index'
const $t = i18n.global.t
const router = useRouter();
const route = useRoute();
const view = route.query.view as string;
const id = route.params.id as string;

const formRef = ref<FormInstance>();

const loading = ref(false);
const options = ref([]);
const checked = ref(false);
const Validator = {
    regDomain: new RegExp(
        /^https?:\/\/(([a-zA-Z0-9_-])+(\.)?)*(:\d+)?(\/((\.)?(\?)?=?&?[a-zA-Z0-9_-](\?)?)*)*$/i,
    ),
    regOnlyNumber: new RegExp(/^\d+$/),
};

const validateAddress = (_rule: any, value: string): Promise<any> =>
    new Promise(async (resolve, reject) => {
        if (testIpv4_6(value) || Validator.regDomain.test(value)) {
            return resolve('');
        } else {
            return value ? reject($t('Detail.index.416932-8')) : resolve('');
        }
    });

const formData = ref<FormDataType>({
    name: '',
    provider: undefined,
    configuration: {
        secret: '',
        apiHost: '',
        apiPort: '',
        rtpIp: '',
        rtpPort: '',
        rtspPort: '',
        rtmpPort: '',
        distinguish: false,
        dynamicRtpPort: false,
        // dynamicRtpPortRange: [],
        dynamicRtpPortRange0: '',
        dynamicRtpPortRange1: '',
    },
    otherConfiguration: {
        internalNet: {
            rtcPort: '',
            flvPort: '',
            mp4Port: '',
            hlsPort: '',
        },
        outerNet: {
            ip: '',
            rtcPort: '',
            flvPort: '',
            mp4Port: '',
            hlsPort: '',
            rtspPort: '',
            rtmpPort: '',
        },
    },
});

const changePort = (port: any) => {
    formData.value.otherConfiguration.internalNet.flvPort = port;
    formData.value.otherConfiguration.internalNet.mp4Port = port;
    formData.value.otherConfiguration.internalNet.hlsPort = port;
};

const onSubmit = async () => {
    let data: any = await formRef.value?.validate();
    let params = { ...data };
    const { configuration } = data;
    if (configuration.dynamicRtpPort) {
        const { dynamicRtpPortRange0, dynamicRtpPortRange1 } = configuration;
        delete configuration.dynamicRtpPortRange0;
        delete configuration.dynamicRtpPortRange1;
        params.configuration = {
            ...configuration,
            dynamicRtpPortRange: [dynamicRtpPortRange0, dynamicRtpPortRange1],
        };
    }

    const playerConfig = [
        {
            enabled: true,
            format: 'rtmp',
            publicHost: formData.value.configuration.distinguish
                ? formData.value.otherConfiguration.outerNet.ip
                : formData.value.configuration.rtpIp,
            port: formData.value.configuration.distinguish
                ? formData.value.otherConfiguration.outerNet.rtmpPort
                : formData.value.configuration.rtmpPort,
            localPort: formData.value.configuration.rtmpPort,
            tls: false,
        },
        {
            enabled: true,
            format: 'rtsp',
            publicHost: formData.value.configuration.distinguish
                ? formData.value.otherConfiguration.outerNet.ip
                : formData.value.configuration.rtpIp,
            port: formData.value.configuration.distinguish
                ? formData.value.otherConfiguration.outerNet.rtspPort
                : formData.value.configuration.rtspPort,
            localPort: formData.value.configuration.rtspPort,
            tls: false,
        },
        {
            enabled: true,
            format: 'rtc',
            publicHost: formData.value.configuration.distinguish
                ? formData.value.otherConfiguration.outerNet.ip
                : formData.value.configuration.rtpIp,
            port: formData.value.configuration.distinguish
                ? formData.value.otherConfiguration.outerNet.rtcPort
                : formData.value.otherConfiguration.internalNet.rtcPort,
            localPort: formData.value.otherConfiguration.internalNet.rtcPort,
            tls: false,
        },
        {
            enabled: true,
            format: 'flv',
            publicHost: formData.value.configuration.distinguish
                ? formData.value.otherConfiguration.outerNet.ip
                : formData.value.configuration.rtpIp,
            port: formData.value.configuration.distinguish
                ? formData.value.otherConfiguration.outerNet.flvPort
                : formData.value.otherConfiguration.internalNet.flvPort,
            localPort: formData.value.otherConfiguration.internalNet.flvPort,
            tls: false,
        },
        {
            enabled: true,
            format: 'mp4',
            publicHost: formData.value.configuration.distinguish
                ? formData.value.otherConfiguration.outerNet.ip
                : formData.value.configuration.rtpIp,
            port: formData.value.configuration.distinguish
                ? formData.value.otherConfiguration.outerNet.mp4Port
                : formData.value.otherConfiguration.internalNet.mp4Port,
            localPort: formData.value.otherConfiguration.internalNet.mp4Port,
            tls: false,
        },
        {
            enabled: true,
            format: 'hls',
            publicHost: formData.value.configuration.distinguish
                ? formData.value.otherConfiguration.outerNet.ip
                : formData.value.configuration.rtpIp,
            port: formData.value.configuration.distinguish
                ? formData.value.otherConfiguration.outerNet.hlsPort
                : formData.value.otherConfiguration.internalNet.hlsPort,
            localPort: formData.value.otherConfiguration.internalNet.hlsPort,
            tls: false,
        },
    ];

    params = omit(params, ['otherConfiguration']);
    if (params.provider === 'embedded-zlmedia') {
        params.configuration.distinguish =
            formData.value.configuration.distinguish;
        params.configuration.playerConfig = playerConfig;
    }
    loading.value = true;
    const response =
        id === ':id'
            ? await save(params).finally(() => {
                loading.value = false;
            })
            : await update({ ...params, id }).finally(() => {
                loading.value = false;
            });
    if (response.status === 200) {
        onlyMessage($t('Detail.index.416932-47'), 'success');
        router.push('/iot/link/Stream');
    }
};

const tooltipText = computed(() => {
  return (val: string, key?: string) => {
    if(!formData.value.configuration.distinguish) {
      return $t('Detail.index.416932-48', [val])
    } else {
      if(key === 'Intranet') {
        return $t('Detail.index.416932-49', [val])
      } else {
        return $t('Detail.index.416932-50', [val])
      }
    }
  }
})
const detail = async (id: string) => {
    loading.value = true;
    const resp: any = await queryProviders();
    options.value = resp.result.map((item: any) => ({
        value: item.id,
        label: item.name,
    }));
    if (id !== ':id') {
        const res = await queryDetail(id);
        if (res.success) {
            const result = res.result as any;
            formData.value = { ...result };

            const { configuration } = result;
            if (configuration.dynamicRtpPort) {
                const { dynamicRtpPortRange } = configuration;
                delete configuration.dynamicRtpPortRange;
                formData.value.configuration = {
                    ...configuration,
                    dynamicRtpPortRange0: dynamicRtpPortRange[0],
                    dynamicRtpPortRange1: dynamicRtpPortRange[1],
                };
            }
            formData.value.otherConfiguration = {
                internalNet: {
                    rtcPort: '',
                    flvPort: '',
                    mp4Port: '',
                    hlsPort: '',
                },
                outerNet: {
                    ip: '',
                    rtcPort: '',
                    flvPort: '',
                    mp4Port: '',
                    hlsPort: '',
                    rtspPort: '',
                    rtmpPort: '',
                },
            };
            configuration?.playerConfig?.forEach((item: any) => {
                formData.value.otherConfiguration.internalNet[
                item.format + 'Port'
                    ] = item.localPort;
                if (configuration.distinguish) {
                    formData.value.otherConfiguration.outerNet[
                    item.format + 'Port'
                        ] = item.port;
                }
            });
            if (configuration.distinguish) {
                formData.value.otherConfiguration.outerNet.ip =
                    configuration?.playerConfig[0].publicHost;
            }
        }
    }
    loading.value = false;
};
detail(id);

watch(
    () => formData.value.configuration.dynamicRtpPort,
    (value) => {
        checked.value = value;
    },
    {
        deep: true,
        immediate: true,
    },
);
</script>

<style lang="less" scoped>
.form {
    .form-item-checked {
        padding: 0;
        padding-top: 35px;
    }
    .form-item-checked2 {
        padding-top: 5px;
    }
    .form-label {
        height: 30px;
        padding-bottom: 8px;
    }
    .item {
        padding: 0 8px;
        padding-top: 8px;
        box-sizing: border-box;
        border: 1px solid #d1d1d1;
        background-color: #e0e0e007;
        border-radius: 4px;
        margin-bottom: 10px;
    }
}
</style>
