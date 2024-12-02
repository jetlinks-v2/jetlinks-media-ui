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
                                label="流媒体名称"
                                name="name"
                                :rules="[
                                    {
                                        required: true,
                                        message: '请输入流媒体名称',
                                    },
                                    {
                                        max: 64,
                                        message: '最多可输入64个字符',
                                    },
                                ]"
                            >
                                <a-input
                                    v-model:value="formData.name"
                                    placeholder="请输入流媒体名称"
                                />
                            </a-form-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-item
                                label="服务商"
                                name="provider"
                                :rules="[
                                    {
                                        required: true,
                                        message: '请选择服务商',
                                    },
                                ]"
                            >
                                <a-select
                                    ref="select"
                                    v-model:value="formData.provider"
                                    :options="options"
                                    placeholder="请选择服务商"
                                ></a-select>
                            </a-form-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-item
                                label="密钥"
                                :name="['configuration', 'secret']"
                                :rules="[
                                    {
                                        max: 64,
                                        message: '最多可输入64个字符',
                                    },
                                ]"
                            >
                                <a-input-password
                                    placeholder="请输入密钥"
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
                                        message: '请输入API Host',
                                    },
                                    {
                                        validator: validateAddress,
                                        message: '请输入正确的IP地址或者域名',
                                    },
                                ]"
                            >
                                <template #label>
                                    API Host
                                    <a-tooltip
                                        title="调用流媒体接口时请求的服务地址"
                                    >
                                        <AIcon
                                            type="QuestionCircleOutlined"
                                            style="margin-left: 2px"
                                        />
                                    </a-tooltip>
                                </template>
                                <a-input
                                    placeholder="请输入API Host"
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
                                        message: '请输入端口',
                                    },
                                ]"
                            >
                                <div class="form-label"></div>

                                <a-input-number
                                    style="width: 100%"
                                    :min="1"
                                    :max="65535"
                                    :precision="0"
                                    placeholder="请输入输入端口"
                                    v-model:value="
                                        formData.configuration.apiPort
                                    "
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
                                            message: '请输入RTP IP',
                                        },
                                        {
                                            validator: validateAddress,
                                            message:
                                                '请输入正确的IP地址或者域名',
                                        },
                                    ]"
                                >
                                    <template #label>
                                        RTP IP
                                        <a-tooltip
                                            title="视频设备将流推送到该IP地址下，部分设备仅支持IP地址，建议全是用IP地址"
                                        >
                                            <AIcon
                                                type="QuestionCircleOutlined"
                                                style="margin-left: 2px"
                                            />
                                        </a-tooltip>
                                    </template>
                                    <a-input
                                        placeholder="请输入RTP IP"
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
                                            message: '请输入端口',
                                        },
                                    ]"
                                >
                                    <div class="form-label"></div>

                                    <a-input-number
                                        style="width: 100%"
                                        :min="1"
                                        :max="65535"
                                        :precision="0"
                                        placeholder="请输入端口"
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
                                            message: '请输入起始端口',
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
                                        placeholder="起始端口"
                                        v-model:value="
                                            formData.configuration
                                                .dynamicRtpPortRange0
                                        "
                                    />
                                </a-form-item>
                            </a-col>
                            <div class="form-item-checked" v-if="checked">
                                至
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
                                            message: '请输入终止端口',
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
                                        placeholder="终止端口"
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
                                        动态端口
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
                                    >对外分享的视频流地址</template
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
                                    区分内/外网
                                </a-checkbox>
                            </a-col>
                            <a-col :span="12">
                                内网
                                <div class="item">
                                    <a-row :gutter="[16, 0]">
                                        <a-col :span="24">
                                            <a-form-item
                                                :name="[
                                                    'configuration',

                                                    'rtpIp',
                                                ]"
                                                :rules="[
                                                    {
                                                        required: true,
                                                        message: '请输入内网IP',
                                                    },
                                                ]"
                                            >
                                                <a-input
                                                    v-model:value="
                                                        formData.configuration
                                                            .rtpIp
                                                    "
                                                    :disabled="true"
                                                    placeholder="请输入内网IP"
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
                                                            '请输入RTSP端口',
                                                    },
                                                ]"
                                            >
                                                <template #label>
                                                    RTSP 端口
                                                    <a-tooltip
                                                        title="对外分享的RTSP视频流地址对应端口"
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
                                                    placeholder="RTSP 端口"
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
                                                            '请输入RTMP端口',
                                                    },
                                                ]"
                                            >
                                                <template #label>
                                                    RTMP 端口
                                                    <a-tooltip
                                                        title="对外分享的RTMP视频流地址对应端口"
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
                                                    placeholder="RTMP 端口"
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
                                                            '请输入RTC端口',
                                                    },
                                                ]"
                                            >
                                                <template #label>
                                                    RTC 端口
                                                    <a-tooltip
                                                        title="对外分享的RTC视频流地址对应端口"
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
                                                    placeholder="RTMP 端口"
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
                                                            '请输入MP4端口',
                                                    },
                                                ]"
                                            >
                                                <template #label>
                                                    MP4端口
                                                    <a-tooltip
                                                        title="对外分享的MP4视频流地址对应端口"
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
                                                    placeholder="MP4端口"
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
                                                            '请输入HLS端口',
                                                    },
                                                ]"
                                            >
                                                <template #label>
                                                    HLS端口
                                                    <a-tooltip
                                                        title="对外分享的HLS视频流地址对应端口"
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
                                                    placeholder="HLS端口"
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
                                                            '请输入FLV端口',
                                                    },
                                                ]"
                                            >
                                                <template #label>
                                                    FLV端口
                                                    <a-tooltip
                                                        title="对外分享的FLV视频流地址对应端口"
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
                                                    placeholder="FLV端口"
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
                                    外网
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
                                                                '请输入外网IP',
                                                        },
                                                    ]"
                                            ><a-input
                                                placeholder="请输入外网IP"
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
                                                                '请输入RTSP端口',
                                                        },
                                                    ]"
                                                >
                                                    <template #label>
                                                        RTSP端口
                                                        <a-tooltip
                                                            title="对外分享的RTSP视频流地址对应端口"
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
                                                        placeholder="RTSP 端口"
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
                                                                '请输入RTMP端口',
                                                        },
                                                    ]"
                                                >
                                                    <template #label>
                                                        RTMP端口
                                                        <a-tooltip
                                                            title="对外分享的RTMP视频流地址对应端口"
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
                                                        placeholder="RTMP 端口"
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
                                                                '请输入RTC端口',
                                                        },
                                                    ]"
                                                >
                                                    <template #label>
                                                        RTC 端口
                                                        <a-tooltip
                                                            title="对外分享的RTC视频流地址对应端口"
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
                                                        placeholder="RTMP 端口"
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
                                                                '请输入MP4端口',
                                                        },
                                                    ]"
                                                >
                                                    <template #label>
                                                        MP4端口
                                                        <a-tooltip
                                                            title="对外分享的MP4视频流地址对应端口"
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
                                                        placeholder="MP4端口"
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
                                                                '请输入HLS端口',
                                                        },
                                                    ]"
                                                >
                                                    <template #label>
                                                        HLS端口
                                                        <a-tooltip
                                                            title="对外分享的HLS视频流地址对应端口"
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
                                                        placeholder="HLS端口"
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
                                                                '请输入FLV端口',
                                                        },
                                                    ]"
                                                >
                                                    <template #label>
                                                        FLV端口
                                                        <a-tooltip
                                                            title="对外分享的FLV视频流地址对应端口"
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
                                                        placeholder="FLV端口"
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
                                >保存</a-button
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
            return value ? reject('请输入正确的IP地址或者域名') : resolve('');
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
    params.configuration.distinguish = formData.value.configuration.distinguish;
    params.configuration.playerConfig = playerConfig;
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
        onlyMessage('操作成功', 'success');
        router.push('/iot/link/Stream');
    }
};

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
            configuration?.playerConfig.forEach((item: any) => {
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
