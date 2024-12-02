
import {request} from '@jetlinks-web/core'
//查询标签列表
export const queryTags = () => request.get('/calendar/tags')

//查询计划
export const queryList = (data:any) => request.post('/media/record/schedule/_query',data)

//查询计划不分页
export const queryListNoPaging = (data:any) => request.post('/media/record/schedule/_query/no-paging',data)

//查询录像记录
export const queryRecord = (type:string,data:any) => request.post(`/media/channel/${type}/record/agg`,data)

//查询录像文件
export const queryFiles = (data:any) => request.post('/media/record/schedule/files/_query',data)

//保存计划
export const savePlan = (data:any) => request.post('/media/record/schedule',data)

//编辑计划
export const updatePlan = (data:any) => request.patch('/media/record/schedule',data)

//启禁用计划
export const controlPlan = (id:string,data:any) => request.put(`/media/record/schedule/${id}`,data)

//删除计划
export const deletePlan = (id:string) => request.remove(`/media/record/schedule/${id}`)

//绑定通道
export const bindChannel = (scheduleId:string,data:any) => request.post(`/media/record/schedule/${scheduleId}/_bind`,data)

//绑定通道(按通道)
export const bindChannelAll = (channelId:string,type:string,isAll:boolean,data:any) => request.post(`/media/record/schedule/channel/${channelId}/${type}/_bind?all=${isAll}`,data)

//查询已绑定的通道
export const queryBoundChannel =(data:any) => request.post('/media/channel/_query',data)

//解绑通道
export const unbindChannel = (scheduleId:string,data:any) => request.post(`/media/record/schedule/${scheduleId}/_unbind`,data)

//查询执行日志
export const queryLogs = (scheduleId:string,data:any) => request.post(`/media/record/schedule/${scheduleId}/history/_query`,data)

export const unbindChannelAll = (scheduleId:string) => request.post(`/media/record/schedule/${scheduleId}/_bind-clear`)
