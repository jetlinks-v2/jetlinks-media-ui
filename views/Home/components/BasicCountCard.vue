<template>
  <div class="device-count-container">
    <h5 class="title">
      <span>{{ $t('components.BasicCountCard.010852-0') }}</span>
      <a style="font-size: 12px;" @click="jumpPage">
        {{ $t('components.BasicCountCard.010852-1') }}
      </a>
    </h5>
    <div class="box-list">
      <div class="box-item">
        <div class="label">{{ $t('components.BasicCountCard.010852-2') }}</div>
        <div class="value">{{ deviceCount }}</div>
        <img :src="homeImg.top1" alt=""/>
      </div>
      <div class="box-item">
        <div class="label">{{ $t('components.BasicCountCard.010852-3') }}</div>
        <div class="value">{{ channelCount }}</div>
        <img :src="homeImg.product" alt=""/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import homeApi from '../../../api/home';
import {useMenuStore} from '@/store/menu';
import {homeImg} from "../../../assets/home/index";
import i18n from '@/locales/index'
const $t = i18n.global.t
const menuStory = useMenuStore();

const channelCount = ref(0);
const deviceCount = ref(0);

onMounted(() => {
  getData();
});

const getData = () => {
  homeApi.deviceCount({}).then((resp) => {
    deviceCount.value = resp.result;
  });
  homeApi.channelCount({}).then((resp) => {
    channelCount.value = resp.result;
  });
};

const jumpPage = () => {
  menuStory.jumpPage('media/DashBoard', {
    id: ':id',
  });
};
</script>

<style lang="less" scoped>
.device-count-container {
  background-color: #fff;
  padding: 24px 14px;

  :deep(.ant-card-body) {
    padding-top: 0;
  }

  .title {
    position: relative;
    z-index: 2;
    display: flex;
    justify-content: space-between;
    margin-bottom: 12px;
    padding-left: 18px;
    font-weight: 700;
    font-size: 18px;

    &::before {
      position: absolute;
      top: 50%;
      left: 0;
      width: 8px;
      height: 8px;
      background-color: #1d39c4;
      border: 1px solid #b4c0da;
      transform: translateY(-50%);
      content: ' ';
    }
  }

  .box-list {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 24px;
    gap: 24px;

    .box-item {
      position: relative;
      padding: 16px;
      background: linear-gradient(135.62deg,
      #f6f7fd 22.27%,
      hsla(0, 0%, 100%, 0.86) 91.82%);
      border-radius: 2px;
      box-shadow: 0 4px 18px #efefef;

      .label {
        color: #4f4f4f;
      }

      .value {
        margin: 20px 0;
        color: rgba(0, 0, 0, 0.85);
        font-weight: 700;
        font-size: 20px;
      }

      img {
        position: absolute;
        right: 10%;
        bottom: 0;
        width: 90px;
        height: 90px;
      }
    }
  }
}
</style>
