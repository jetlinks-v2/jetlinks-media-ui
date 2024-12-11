import i18n from '@/locales/index'
const $t = i18n.global.t
export const PROVIDER_OPTIONS = [
    {label: 'GB/T28181', value: 'gb28181-2016'},
    {label: $t('Device.const.534988-0'), value: 'fixed-media'},
    {label: 'Onvif', value: 'onvif'},
    {label: $t('Device.const.534988-1'), value: 'media-plugin'},
    {label: $t('Device.const.534988-2'), value: 'agent-media-device-gateway'}
]
export const streamMode = [
    {label: 'UDP', value: 'UDP'},
    {label: $t('Device.const.534988-3'), value: 'TCP_PASSIVE'},
]

export const providerType = {
    'gb28181-2016': 'GB/T28181',
    'fixed-media': $t('Device.const.534988-0'),
    'onvif': 'Onvif',
    'media-plugin': $t('Device.const.534988-1'),
    'agent-media-device-gateway':$t('Device.const.534988-2')
};