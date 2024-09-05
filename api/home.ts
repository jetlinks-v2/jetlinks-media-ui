import {request} from '@jetlinks-web/core'

export default {
    // 设备数量
    deviceCount: (params: any) => request.get<number>(`/media/device/_count`, params),
    // 通道数量
    channelCount: (data: any) => request.post<number>(`/media/channel/_count`, data),

}