import {request} from '@jetlinks-web/core';

/**
 * 查询目录列表-树形
 * @param data
 */
export const queryTree = (data: any) => request.post('/media/catalog/_query/tree', data);

/**
 * 新增目录
 * @param data
 */
export const saveCatalog = (data: any) => request.patch('/media/catalog', data);

/**
 * 删除目录
 * @param id
 */
export const deleteCatalog = (id: string) => request.remove(`/media/catalog/${id}`);

/**
 * 修改目录
 * @param id
 */
export const updateCatalog = (id: string, data: any) => request.put(`/media/catalog/${id}`, data);

/**
 * 目录绑定通道
 * @param id
 * @param data
 */
export const bindChannel = (id: string, data: string[]) => request.post(`/media/catalog/${id}/_bind`, data);

/**
 * 目录解绑通道
 * @param id
 * @param data
 */
export const unbindChannel = (id: string, data: string[]) => request.post(`/media/catalog/${id}/_unbind`, data);

/**
 * 查询通道列表
 * @param data
 */
export const queryChannel = (data: any) => request.post('/media/channel/_query', data);

/**
 * 获取目录类型
 */
export const getCatalogType = () => request.get('/dictionary/catalog-type-group/items');
