import { BASE_API_PATH } from "../utils/variable";
import {request} from '@jetlinks-web/core'
import { SearchHistoryList } from '../utils/types'

export const FILE_UPLOAD = `${BASE_API_PATH}/file/static`;

export const FileUpload = `${BASE_API_PATH}/file/upload`;

/**
 * 保存查询记录
 * @param data
 * @param target
 */
export const saveSearchHistory = (data: any, target:string) => request.post(`/user/settings/${target}`, data)

/**
 * 获取查询记录
 * @param target
 */
export const getSearchHistory = (target:string) => request.get<SearchHistoryList[]>(`/user/settings/${target}`)

/**
 * 删除指定查询记录
 * @param id
 * @param target
 */
export const deleteSearchHistory = (target:string, id:string) => request.remove<SearchHistoryList[]>(`/user/settings/${target}/${id}`)

/**
 * 获取当前系统版本
 */
export const systemVersion = () => request.get<{edition?: string}>('/system/version')

/**
 * 聚合查询
 * @param data
 * @returns
 */
export const queryDashboard = (data: Record<string, any>) => request.post(`/dashboard/_multi`, data)

export const fileUpload = (data: any) => request.post('/file/static', data)

export const lowCodeUrl = () => request.get('/system/config/low-code')
