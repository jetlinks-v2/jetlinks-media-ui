import {request} from '@jetlinks-web/core'

export const save = (data: object) => request.post(`/media/server`, data);

export const update = (data: object) => request.patch(`/media/server`, data);

export const query = (data: object) => request.post(`/media/server/_query`, data);

export const queryDetail = (id: string) => request.get(`/media/server/${id}`);

export const remove = (id: string) => request.remove(`/media/server/${id}`);

export const queryProviders = () => request.get(`/media/server/providers`);

export const enalbe = (id: string) => request.post(`/media/server/${id}/_enable`);

export const disable = (id: string) => request.post(`/media/server/${id}/_disable`);



