<template>
    <div class="top-card">
        <div class="top-card-content">
            <div class="content-left">
                <div class="content-left-title">
                    <a-space>
                        <span>{{ title }}</span>
                        <a-tooltip placement="top" v-if="tooltip">
                            <template #title>
                                <span>{{ tooltip }}</span>
                            </template>
                            <AIcon type="QuestionCircleOutlined" />
                        </a-tooltip>
                    </a-space>
                </div>
                <div class="content-left-value">{{ value }}</div>
            </div>
            <div class="content-right">
                <img :src="img" alt="" />
            </div>
        </div>
        <div class="top-card-footer">
            <template v-for="(item, index) in footer" :key="index">
                <span v-if="!item?.status">{{ item?.title }}</span>
                <a-badge v-else :text="item.title" :status="item.status" />
                <div class="footer-item-value">{{ item?.value }}</div>
            </template>
        </div>
    </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue';
import type { Footer } from '../typings';

const props = defineProps({
    title: { type: String, default: '' },
    tooltip: { type: String, default: '' },
    img: { type: String, default: '' },
    footer: { type: Array as PropType<Footer[]>, default: '' },
    value: { type: Number, default: 0 },
});
</script>

<style lang="less" scoped>
.top-card {
    display: flex;
    flex-direction: column;
    // height: 200px;
    padding: 24px;
    background-color: #fff;
    border: 1px solid #e0e4e8;
    border-radius: 2px;
    .top-card-content {
        display: flex;
        flex-direction: row;
        flex-grow: 1;
        .content-left {
            height: 100%;
            width: 50%;
            &-title {
                color: rgba(0, 0, 0, 0.64);
            }
            &-value {
                padding: 12px 0;
                color: #323130;
                font-weight: 700;
                font-size: 36px;
            }
        }
        .content-right {
            width: 0;
            height: 100%;
            display: flex;
            flex-grow: 1;
            align-items: flex-end;
            justify-content: flex-end;
            img {
                width: 100px;
                height: 100%;
                transform: translateY(2px);
            }
        }
    }
    .top-card-footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-top: 16px;
        border-top: 1px solid #f0f0f0;
        .footer-item-value {
            color: #323130;
            font-weight: 700;
            font-size: 16px;
        }
    }
}
</style>
