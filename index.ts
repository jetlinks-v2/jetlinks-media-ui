const routerModules = import.meta.glob('./views/**/index.vue')

const MODULE_CODE = 'media'

const getAsyncRoutesMap = () => {
    const modules = {}
    Object.keys(routerModules).forEach(item => {
        const code = item.replace('./views/', '').replace('/index.vue', '')
        const key = `${MODULE_CODE}/${code}`
        modules[key] = routerModules[item]
    })

    return modules
}

const getExtraRoutesMap = () => {
    return {
        // [`${MODULE_CODE}/Product`]: {
        //     children: [
        //         {
        //             code: 'Detail',
        //             url: '/detail:id',
        //             name: '详情信息',
        //             component: () => import('./views/Product/Detail/index.vue')
        //         }
        //     ]
        // },
        'media/Device': {
            children: [
                {
                    code: 'Save',
                    name: '详情',
                    url: '/save:id',
                    component: () => import('./views/Device/Save/index.vue')
                },
                {
                    code: 'Channel',
                    name: '通道',
                    url: '/channel:id',
                    component: () => import('./views/Device/Channel/index.vue')
                },
                {
                    code: 'Playback',
                    name: '回放',
                    url: '/playback:id',
                    component: () => import('./views/Device/Playback/index.vue')
                }
            ]
        },
        'media/Cascade': {
            children: [
                {
                    code: 'Save',
                    name: '详情',
                    url: '/save:id',
                    component: () => import('./views/Cascade/Save/index.vue')
                },
                {
                    code: 'Channel',
                    name: '通道',
                    url: '/channel:id',
                    component: () => import('./views/Cascade/Channel/index.vue')
                }
            ]
        },
        'media/AutoVideo/Plan': {
            children: [
                {
                    code: 'Detail',
                    name: '详情',
                    url: '/detail/:id',
                    component: () => import('./views/AutoVideo/Plan/Detail/index.vue')
                },
                {
                    code: 'Channel',
                    name: '通道',
                    url: '/channel:id',
                    component: () => import('./views/Cascade/Channel/index.vue')
                }
            ]
        },
        'media/Stream': {
            children: [
                {
                    code: 'Detail',
                    name: '详情',
                    url: '/detail/:id',
                    component: () => import('./views/Stream/Detail/index.vue')
                },
            ]
        }
    }
}

export default {
    getAsyncRoutesMap,
    getExtraRoutesMap
}
