import {request} from '@jetlinks-web/core'

/**
 * 获取插件支持的产品信息
 * 用于在产品选择接入方式后，选择产品类型。
 * 即将平台中当前产品与插件中指定的产品绑定，然后把插件的物模型保存到产品并且绑定产品ID映射关系
 * @param id
 */
export const getProductsById = (id: string) => request.get(`/plugin/driver/${id}/products`)

/**
 *
 * @param type product：产品;device：设备
 * @param pluginId 设备接入id
 * @param internalId 产品或者设备id
 * @param externalId  映射id
 */
export const savePluginData = (type: string, pluginId: string, internalId: string, externalId: string) => request.patch(`/plugin/mapping/${type}/${pluginId}/${internalId}`, externalId, {headers: {'Content-Type': "text/plain"}})