import {request} from '@jetlinks-web/core'

export default {
    // 列表
    list: (data: any) => request.post<any>(`/media/gb28181-cascade/_query`, data),
    // 详情
    detail: (id: string): any => request.get(`/media/gb28181-cascade/${id}`),
    // 新增
    save: (data: any) => request.post(`/media/gb28181-cascade`, data),
    // 修改
    // update: (id: string, data: any) => request.put(`/media/gb28181-cascade/${id}`, data),
    update: (data: any) => request.patch(`/media/gb28181-cascade`, data),
    // 删除
    del: (id: string) => request.remove(`media/gb28181-cascade/${id}`),
    // 禁用
    disabled: (id: string) => request.post<any>(`/media/gb28181-cascade/${id}/_disabled`),
    // 启用
    enabled: (id: string) => request.post<any>(`/media/gb28181-cascade/${id}/_enabled`),

    // 新增/编辑 
    // 获取集群节点
    clusters: () => request.get<any>(`/network/resources/clusters`),
    // SIP本地地址
    all: () => request.get<any>(`/network/resources/alive/_all`),

    // 查询已绑定的通道, list列表字段通道数量, 来自下面接口的total
    queryBindChannel: (id: string, data: any) => request.post<any>(`/media/gb28181-cascade/${id}/bindings/_query`, data),
    // 绑定通道
    bindChannel: (id: string, data: string[]) => request.post<any>(`/media/gb28181-cascade/${id}/_bind`, data),
    // 解绑
    unbindChannel: (id: string, data: string[]) => request.post<any>(`/media/gb28181-cascade/${id}/_unbind`, data),
    // 验证国标ID是否存在
    validateField: (id: string, data: string[]): any => request.post(`/media/gb28181-cascade/${id}/gbChannelId/_validate`, data),
    // 更改国标ID
    updateGbChannelId: (id: string, data: any): any => request.put(`/media/gb28181-cascade/binding/${id}`, data),
    // 查询通道分页列表
    queryChannelList: (data: any): any => request.post(`/media/channel/_query`, data),
    // 查询通道不分页
    queryChannelNoPage: (data: any): any => request.post(`/media/channel/_query/no-paging`, data),
    // 推送
    publish: (id: string, params: any) => request.get(`/media/gb28181-cascade/${id}/bindings/publish`, params),

    // 分屏展示接口
    // 设备树
    getMediaTree: (data?: any) => request.post<any>(`/media/device/_query/no-paging`, data),
    // 查询目录和通道
    getCatalogAndChannel: (id: string, data?: any) => request.post<any>(`/media/gb28181-cascade/${id}/catalog/tree`, data),
    //绑定通道或目录
    bindCatalogOrChannel: (id: string, data: any) => request.post<any>(`/media/gb28181-cascade/${id}/catalog/_bind`, data),
    // 解绑通道或目录
    unbindCatalogOrChannel: (id: string, data: any) => request.post<any>(`/media/gb28181-cascade/${id}/catalog/_unbind`, data),
}