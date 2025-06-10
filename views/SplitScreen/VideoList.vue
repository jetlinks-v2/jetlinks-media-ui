<template>
  <template v-if="data.length">
    <div v-for="item in data" :key="item.id" class="item">
      <div class="icon">
        <AIcon type="SettingFilled"/>
      </div>
      <div class="name">
        <span v-if="!visible">{{ item.name }}</span>
        <a-input v-else v-model:value="name" />
      </div>
      <div v-if="item.default" class="default">
        <AIcon type="PushpinFilled"/>
      </div>
      <div class="action">
        <a-dropdown>
          <div class="btn">
            <AIcon type="MoreOutlined"/>
          </div>
          <template #overlay>
            <a-menu @click="handleMenuClick">
              <a-menu-item key="setting">
                <a-button type="text">
                  <AIcon type="SettingOutlined"/>
                  设为默认
                </a-button>
              </a-menu-item>
              <a-menu-item key="edit">
                <a-button type="text">
                  <AIcon type="EditOutlined"/>
                  编辑
                </a-button>
              </a-menu-item>
              <a-menu-item key="delete">
                <a-button type="text" danger>
                  <AIcon type="DeleteOutlined"/>
                  删除
                </a-button>
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </div>
    </div>
  </template>
  <div v-else class="empty-box">
    <j-empty/>
  </div>
</template>

<script setup>
const props = defineProps({
  data: {
    type: Array,
    default: () => [],
  },
});
const visible = ref(false)
const name = ref(props.data.name)

const handleMenuClick = (e) => {
  console.log(e)
}
</script>

<style lang="less" scoped>
.empty-box {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.item {
  border-radius: 2px;
  background: #FFFFFF;
  padding: 12px;
  margin-bottom: 8px;
  display: flex;
  gap: 16px;
  align-items: center;
  cursor: pointer;

  .icon {
    color: @primary-color;
  }

  .name {
    flex: 1;
    min-width: 0;
    height: 24px;
  }

  .default {
    padding: 0 16px
  }

  .action {
    display: none;
  }

  .btn {
    width: 24px;
    height: 24px;
    border-radius: 2px;
    background: #F0F0F0;
    color: #777777;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  &:hover {
    .action {
      display: block;
    }
  }
}
</style>
