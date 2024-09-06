export default [
    {
        code: 'iot',
        name: '物联网',
        owner: 'iot',
        id: '9c21f88182e7cc75cbdfa8e4b7844272',
        url: '/iot',
        icon: 'icon-wulianwang',
        sortIndex: 1,
        permissions: [],
        children: [
            {
                code: 'link',
                name: '运维管理',
                owner: 'iot',
                //parentId: '1',
                id: 'bd55cdc9d0c1700afe628f572f91c22e',
                url: '/iot/link',
                icon: 'icon-yunweiguanli-1',
                permissions: [],
                sortIndex: 4,
                children: [
                    {
                        code: 'media/Stream',
                        name: '流媒体服务',
                        owner: 'iot',
                        //parentId: '1-4',
                        id: '82fd382e97bc132aa1a6cc926d804d48',
                        sortIndex: 7,
                        url: '/iot/link/Stream',
                        icon: 'icon-xuanzetongdao1',
                        showPage: ['media-server'],
                        permissions: [],
                        buttons: [
                            {
                                id: 'view',
                                name: '查看',
                                permissions: [
                                    {
                                        permission: 'media-server',
                                        actions: ['query'],
                                    },
                                ],
                            },
                            {
                                id: 'delete',
                                name: '删除',
                                permissions: [
                                    {
                                        permission: 'media-server',
                                        actions: ['query', 'delete'],
                                    },
                                ],
                            },
                            {
                                id: 'update',
                                name: '编辑',
                                permissions: [
                                    {
                                        permission: 'media-server',
                                        actions: ['query', 'save'],
                                    },
                                ],
                            },
                            {
                                id: 'action',
                                name: '启/禁用',
                                permissions: [
                                    {
                                        permission: 'media-server',
                                        actions: ['query', 'save'],
                                    },
                                ],
                            },
                            {
                                id: 'add',
                                name: '新增',
                                permissions: [
                                    {
                                        permission: 'media-server',
                                        actions: ['query', 'save'],
                                    },
                                ],
                            },
                        ],
                        accessSupport: { text: "不支持", value: "unsupported" },
                        supportDataAccess: false
                    },
                ]
            }
        ]
    },
    {
        code: 'media',
        name: '视频中心',
        owner: 'iot',
        id: 'a0ca3cb1035b1484e04344f85a688d71',
        url: '/media',
        icon: 'icon-shipinwangguan',
        sortIndex: 2,
        permissions: [],
        buttons: [],
        children: [
            {
                code: 'media/Home',
                name: '首页',
                owner: 'iot',
                //parentId: '2',
                id: 'a7693e3ccb4144fc66c4b6b7a716576b',
                sortIndex: 1,
                url: '/media/home',
                icon: 'icon-zhihuishequ',
                permissions: [],
                buttons: [],
                showPage: ['media-device'],
                accessSupport: { text: "不支持", value: "unsupported" },
                supportDataAccess: false
            },
            {
                code: 'media/DashBoard',
                name: '仪表盘',
                owner: 'iot',
                //parentId: '2',
                id: 'cc989fbfa0cd7f70f6a1154c89f2b9a4',
                sortIndex: 2,
                url: '/media/dashboard',
                icon: 'icon-keshihua',
                permissions: [
                    {
                        permission: 'media-device',
                        actions: ['query'],
                    },
                ],
                buttons: [],
                showPage: ['media-device'],
                accessSupport: { text: "不支持", value: "unsupported" },
                supportDataAccess: false
            },
            {
                code: 'media/Device',
                name: '视频设备',
                owner: 'iot',
                //parentId: '2',
                id: 'c4d640af0a00ce619a429e7d1c2d2bb8',
                sortIndex: 3,
                url: '/media/device',
                icon: 'icon-shipinwangguan',
                showPage: ['media-device'],
                permissions: [
                    {
                        permission: 'media-gateway',
                        actions: ['enable', 'disable', 'query', 'save', 'delete'],
                    },
                    {
                        permission: 'file',
                        actions: ['upload-static'],
                    },
                    {
                        permission: 'media-record',
                        actions: ['record', 'query', 'sync'],
                    },
                    {
                        permission: 'media-channel',
                        actions: ['query'],
                    },
                    {
                        permission: 'device-gateway',
                        actions: ['query', 'save', 'delete'],
                    },
                    {
                        permission: 'gb28181-cascade',
                        actions: ['bind', 'unbind', 'enable', 'disable', 'query', 'save', 'delete'],
                    },
                    {
                        permission: 'device-product',
                        actions: ['query', 'save', 'delete'],
                    },
                    {
                        permission: 'media-device',
                        actions: ['stop', 'ptz', 'record', 'query', 'start', 'save', 'delete'],
                    },
                ],
                buttons: [
                    {
                        id: 'view',
                        name: '查看',
                        permissions: [
                            {
                                permission: 'media-device',
                                actions: ['query'],
                            },
                        ],
                    },
                    {
                        id: 'delete',
                        name: '删除',
                        permissions: [
                            {
                                permission: 'media-device',
                                actions: ['delete'],
                            },
                        ],
                    },
                    {
                        id: 'update',
                        name: '编辑',
                        permissions: [
                            {
                                permission: 'file',
                                actions: ['upload-static'],
                            },
                            {
                                permission: 'device-gateway',
                                actions: ['query'],
                            },
                            {
                                permission: 'media-device',
                                actions: ['stop', 'ptz', 'record', 'query', 'start', 'save'],
                            },
                            {
                                permission: 'media-channel',
                                actions: ['query', 'save'],
                            },
                            {
                                permission: 'gb28181-cascade',
                                actions: ['bind', 'unbind', 'query', 'save'],
                            },
                            {
                                permission: 'device-product',
                                actions: ['query'],
                            },
                        ],
                    },
                    {
                        id: 'add',
                        name: '新增',
                        description: '',
                        permissions: [
                            {
                                permission: 'media-device',
                                actions: ['query', 'save'],
                            },
                            {
                                permission: 'device-gateway',
                                actions: ['query'],
                            },
                            {
                                permission: 'device-product',
                                actions: ['query'],
                            },
                            {
                                permission: 'file',
                                actions: ['upload-static'],
                            },
                        ],
                    },
                ],
                accessSupport: { text: "间接支持", value: "indirect" },
                supportDataAccess: false,
                indirectMenus: ['1b136e7e4e4e74bb24b91802e4cfcd2d']
            },
            {
                code: 'media/SplitScreen',
                name: '分屏展示',
                owner: 'iot',
                //parentId: '2',
                id: '33ad7bae1dcb991bfe434d62fb2c72ba',
                sortIndex: 4,
                url: '/media/SplitScreen',
                icon: 'icon-fenpingzhanshi1',
                showPage: ['media-device'],
                permissions: [
                    {
                        permission: 'media-channel',
                        actions: ['query'],
                    },
                    {
                        permission: 'media-device',
                        actions: ['stop', 'ptz', 'record', 'query', 'start', 'save', 'delete'],
                    },
                ],
                buttons: [
                    {
                        id: 'view',
                        name: '查看',
                        description: '',
                        permissions: [
                            {
                                permission: 'media-device',
                                actions: ['query'],
                            },
                        ],
                    },
                ],
                accessSupport: { text: "间接支持", value: "indirect" },
                supportDataAccess: false,
                indirectMenus: ['c4d640af0a00ce619a429e7d1c2d2bb8']
            },
            {
                code: 'media/Cascade',
                name: '国标级联',
                owner: 'iot',
                //parentId: '2',
                id: '1e00baa93418f820671f24ed45db59ae',
                sortIndex: 5,
                url: '/media/Cascade',
                icon: 'icon-guojijilian',
                showPage: ['gb28181-cascade'],
                permissions: [
                    {
                        permission: 'gb28181-cascade',
                        actions: ['bind', 'unbind', 'enable', 'disable', 'query', 'save', 'delete'],
                    },
                ],
                buttons: [
                    {
                        id: 'view',
                        name: '查看',
                        permissions: [
                            {
                                permission: 'gb28181-cascade',
                                actions: ['query'],
                            },
                        ],
                    },
                    {
                        id: 'action',
                        name: '启/禁用',
                        permissions: [
                            {
                                permission: 'gb28181-cascade',
                                actions: ['enable', 'disable', 'query', 'save'],
                            },
                        ],
                    },
                    {
                        id: 'push',
                        name: '推送',
                        permissions: [
                            {
                                permission: 'media-channel',
                                actions: ['query'],
                            },
                            {
                                permission: 'gb28181-cascade',
                                actions: ['query'],
                            },
                        ],
                    },
                    {
                        id: 'channel',
                        name: '选择通道',
                        permissions: [
                            {
                                permission: 'media-device',
                                actions: ['query'],
                            },
                            {
                                permission: 'media-channel',
                                actions: ['query'],
                            },
                            {
                                permission: 'gb28181-cascade',
                                actions: ['bind', 'unbind', 'query', 'save'],
                            },
                        ],
                    },
                    {
                        id: 'delete',
                        name: '删除',
                        permissions: [
                            {
                                permission: 'gb28181-cascade',
                                actions: ['delete'],
                            },
                            {
                                permission: 'media-server',
                                actions: ['delete'],
                            },
                        ],
                    },
                    {
                        id: 'update',
                        name: '编辑',
                        permissions: [
                            {
                                permission: 'gb28181-cascade',
                                actions: ['query', 'save'],
                            },
                            {
                                permission: 'media-server',
                                actions: ['save'],
                            },
                        ],
                    },
                    {
                        id: 'add',
                        name: '新增',
                        permissions: [
                            {
                                permission: 'gb28181-cascade',
                                actions: ['query', 'save'],
                            },
                        ],
                    },
                ],
                accessSupport: { text: "支持", value: "support" },
                supportDataAccess: true,
                assetType: 'gbCascade'
            },
        ],
    },
]
