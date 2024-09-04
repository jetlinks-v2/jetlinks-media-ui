import {request} from '@jetlinks-web/core'

// 获取当前用户可访问菜单
export const getMenuTree_api = (data: object) => request.post(`/menu/_all/tree`, data);

export const queryOwnThree = (data: any) => request.post<any>('/menu/user-own/tree', data)
/**
 * 校验编码唯一性
 * @param data
 */
export const validCode_api = (data: object) => request.get(`/menu/code/_validate`, data);


// 获取资产类型
export const getAssetsType_api = () => request.get(`/asset/types`);
// 获取菜单详情
export const getMenuInfo_api = (id: string) => request.get(`/menu/${id}`);
// 编辑菜单信息
export const saveMenuInfo_api = (data: object) => request.patch(`/menu`, data);
// 新增菜单信息
export const addMenuInfo_api = (data: object) => request.post(`/menu`, data);
// 删除菜单信息
export const delMenuInfo_api = (id: string) => request.remove(`/menu/${id}`);
