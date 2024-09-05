import {request} from '@jetlinks-web/core'

/**
 * 设备配置
 * @param id 设备id
 * @returns
 */
export const queryDeviceConfig = (id: string) => request.get(`/device-instance/${id}/config-metadata`)
