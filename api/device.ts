import {request} from '@jetlinks-web/core'
import type { ProductType } from '../views/Device/typings';

export default {
    // 列表
    list: (data: any) => request.post(`/media/device/_query/`, data),
    // 详情
    detail: (id: string): any => request.get(`/media/device/${id}`),
    // 新增
    save: (data: any) => request.post(`/media/device/${data.channel}`, data),
    // 修改
    update: (data: any) => request.put(`/media/device/${data.channel}/${data.id}`, data),
    del: (id: string) => request.remove(`/media/device/${id}`),
    // 更新通道
    updateChannels: (id: string) => request.post(`/media/device/${id}/channels/_sync`),
    // post查询产品列表
    queryProductList: (data: any) => request.post<ProductType[]>(`/device/product/_query/no-paging`, data),
    // get获取产品
    getProductList: (data: any) => request.get(`/device/product/_query/no-paging?paging=false`, data),
    // 快速添加产品
    saveProduct: (data: any) => request.post<any>(`/device/product`, data),
    // 产品发布
    deployProductById: (id: string) => request.post<any>(`/device/product/${id}/deploy`),
    // 查询设备接入配置
    queryProvider: (data?: any) => request.post<any>(`/gateway/device/detail/_query`, data),
    // 查询网关配置
    getConfiguration: (id: string, transport: string) => request.get<any>(`/protocol/${id}/${transport}/configuration`),
    //校验ID合法
    validateId: (id:string) => request.get<any>('/media/device/id/_validate',{id:id})
}