<template>
    <div class="card-wrapper">
        <div class="card-header">
            <div class="title">{{ title }}</div>
            <div class="tools">
                <a-space>
                    <a-radio-group
                        v-model:value="dimension"
                        button-style="solid"
                    >
                        <a-radio-button value="today">{{ $t('components.Card.240764-0') }}</a-radio-button>
                        <a-radio-button value="week">{{ $t('components.Card.240764-1') }}</a-radio-button>
                        <a-radio-button value="month">{{ $t('components.Card.240764-2') }}</a-radio-button>
                        <a-radio-button value="year">{{ $t('components.Card.240764-3') }}</a-radio-button>
                    </a-radio-group>
                    <a-range-picker
                        format="YYYY-MM-DD HH:mm:ss"
                        valueFormat="x"
                        v-model:value="dateRange"
                        @change="onChange"
                    />
                </a-space>
            </div>
        </div>
        <div v-if="chartData.length" class="chart" ref="chartRef"></div>
        <a-empty v-else class="no-data" :description="$t('components.Card.240764-4')" ></a-empty>
    </div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts';
import dayjs from 'dayjs';
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();
// const { proxy } = <any>getCurrentInstance();
type Emits = {
    (e: 'change', data: any): void;
};
const emits = defineEmits<Emits>();

const props = defineProps({
    title: { type: String, default: '' },
    // 图表数据
    chartData: { type: Array, default: () => [] },

});

// 统计时间维度
const dimension = ref('week');
const dateRange = ref<any>([
  dayjs().subtract(1, 'week').format('x'),
  dayjs().format('x'),
]);

/**
 * 绘制图表
 */
const chartRef = ref();
const createChart = () => {
    nextTick(() => {
        if (!chartRef.value) {
            return; // 如果不存在，直接返回，不执行初始化操作
        }
        const myChart = echarts.init(chartRef.value as HTMLElement);
        const sData: number[] = props.chartData.map(
            (m: any) => m.value && m.value.toFixed(0),
        );

        const maxY = Math.max.apply(null, sData.length ? sData : [0]);
        const options = {
            grid: {
                left: maxY > 100000 ? 90 : 50,
                right: '5%',
                top: '5%',
                bottom: '10%',
            },
            tooltip: {
                trigger: 'axis',
                formatter: '{b0}<br />{a0}: {c0}',
            },
            xAxis: {
                type: 'category',
                data: props.chartData.map((m: any) => m.x),
            },
            yAxis: {
                type: 'value',
                // minInterval: 1,
            },
            series: [
                // {
                //     name: '播放数量(人次)',
                //     data: sData,
                //     type: 'bar',
                //     barWidth: 16,
                //     itemStyle: {
                //         color: '#2f54eb',
                //     },
                // },
                // {
                //     name: '播放数量(人次)',
                //     type: 'line',
                //     symbol: 'circle',
                //     showSymbol: false,
                //     smooth: true,
                //     lineStyle: {
                //         color: '#a5fff9',
                //     },
                //     data: sData,
                // },
                {
                    name: $t('components.Card.744979-0'),
                    data: sData,
                    type: 'line',
                    smooth: true,
                    symbolSize: 0, // 拐点大小
                    color: '#ADC6FF',
                    areaStyle: {
                        color: {
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [
                                {
                                    offset: 0,
                                    color: '#ADC6FF', // 100% 处的颜色
                                },
                                {
                                    offset: 1,
                                    color: '#FFFFFF', //   0% 处的颜色
                                },
                            ],
                            global: false, // 缺省为 false
                        },
                    },
                },
            ],
        };

        myChart.setOption(options);
        window.addEventListener('resize', function () {
            myChart.resize();
        });
    });

};

const onChange = ()=>{
    dimension.value = 'other'
}

watch(
    () => props.chartData,
    (val) => {
        createChart();
    },
    { deep: true },
);

watch(
    () => dateRange.value,
    (val) => {
        emits('change', {
            time: {
                start: val[0],
                end: val[1],
            },
        });
    },
    { immediate: true, deep: true },
);
watch(
    () => dimension.value,
    (val) => {
        if (val === 'today') {
            dateRange.value[0] = dayjs().startOf('day').format('x');
        }
        if (val === 'week') {
            dateRange.value[0] = dayjs().subtract(1, 'week').format('x');
        }
        if (val === 'month') {
            dateRange.value[0] = dayjs().subtract(1, 'month').format('x');
        }
        if (val === 'year') {
            dateRange.value[0] = dayjs().subtract(1, 'year').format('x');
        }
        dateRange.value[1] = dayjs().format('x');
    },
);
</script>

<style scoped lang="less">
.card-wrapper {
    padding: 24px;
    background-color: #fff;
    .card-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 24px;
        .title {
            font-weight: 700;
            font-size: 16px;
        }
    }
    .chart,
    .no-data {
        width: 100%;
        min-height: calc(100vh - 450px);
    }
    .no-data {
        display: flex;
        flex-direction: column;
        justify-content: center;
    }
}
</style>
