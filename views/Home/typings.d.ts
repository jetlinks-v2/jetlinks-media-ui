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

// 推荐步骤每项
export interface recommendList {
    title: string;
    details: string;
    iconUrl: string;
    linkUrl: string;
    params?: any;
    auth?: boolean;
    onClick?: Function
}

export interface bootConfig {
    english: string,
    label: string,
    link: string,
    auth?: boolean,
    image?: string,
    params?: any,
}