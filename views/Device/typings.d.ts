type BaseItem = {
    id: string;
    name: string;
};
type State = {
    value: string;
    text: string;
};

export type DeviceItem = {
    photoUrl?: string;
    channelNumber: number;
    createTime: number;
    firmware: string;
    gatewayId: string;
    host: string;
    manufacturer: string;
    model: string;
    port: number;
    provider: string;
    state: State;
    streamMode: string;
    transport: string;
} & BaseItem;

type configuration = {
    access_pwd: string;
    stream_mode: string;
}

export type ProductType = {
    accessId: string;
    accessName: string;
    accessProvider: string;
    createTime: number;
    creatorId: string;
    deviceType: {
        text: string;
        value: string;
    };
    id: string;
    messageProtocol: string;
    metadata: string;
    modifierId: string;
    modifyTime: number;
    name: string;
    protocolName: string;
    state: number;
    transportProtocol: string;
    configuration: configuration;
}


type addressesType = {
    address: string;
    bad: boolean;
    disabled: boolean;
    health: number;
    ok: boolean;
}
export type gatewayType = {
    channel: string;
    channelId: string;
    channelInfo: {
        id: string;
        name: string;
        addresses: addressesType[];
    };
    id: string;
    name: string;
    protocol: string;
    protocolDetail: {
        id: string;
        name: string;
        description?: string;
    };
    provider: string;
    state: {
        text: string;
        value: string;
    };
    transport: string;
    transportDetail: {
        id: string;
        name: string;
        metadata: string;
        features: string[];
        routes: string[];
    };
    description?: string;
}

export interface ActionsType {
    key: string;
    text?: string;
    disabled?: boolean;
    permission?: boolean;
    onClick?: (data: any) => void;
    style?: CSSProperties;
    tooltip?: TooltipProps;
    popConfirm?: PopconfirmProps;
    icon?: string;
    children?: ActionsType[];
}

export const PROVIDER_OPTIONS = [
    { label: 'GB/T28181', value: 'gb28181-2016' },
    { label: '固定地址', value: 'fixed-media' },
    { label: 'Onvif', value: 'onvif'},
    { label: '插件', value: 'media-plugin'}
]

export type ProductItem = {
    id: string;
    name: string;
    classifiedId: string | string[];
    classifiedName: string;
    configuration: Record<string, any>;
    createTime: number;
    updateTime: number;
    creatorId: string;
    deviceType: DeviceType;
    deviceTypeId?: string;
    count?: number;
    messageProtocol: string;
    metadata: string;
    orgId: string;
    protocolName: string;
    state: number;
    transportProtocol: string;
    describe?: string;
    accessId?: string;
    accessName?: string;
    photoUrl?: string;
    storePolicy?: string;
    accessProvider?: string;
    modifyTime?: string;
};