import {request} from '@jetlinks-web/core'
import {ProductItem} from '../views/Device/typings'

/**
 * 根据产品ID获取产品详情
 * @param id 产品ID
 * @returns
 */
export const detail = (id: string) => request.get<ProductItem>(`/device-product/${id}`)

/**
 * 产品分类
 * @param data 查询条件
 */
export const category = (data: any) => request.get('/device/category/_tree?paging=false', data)

/**
 * 根据指定的接入方式获取产品需要的配置信息
 * @pId 产品id
 * @accessId 设备接入id
 */
export const getAccessConfig = (pId: string, accessId: string) => request.get(`/device-product/${pId}/${accessId}/config-metadata`)



