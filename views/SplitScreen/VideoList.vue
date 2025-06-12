<template>
  <template v-if="data.length">
    <div v-for="item in data" :key="item.id" class="item">
      <div class="icon">
        <AIcon type="SettingFilled"/>
      </div>
      <div class="name">
        <span v-if="!visible">{{ item.name }}</span>
        <a-input
            v-else
            v-model:value="name"
            @blur="onBlur"
            ref="inputRef"
            :maxLength="64"
        />
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
            <a-menu>
              <a-menu-item key="setting">
                <j-permission-button type="text" @click="setDefault(item)">
                  <AIcon type="SettingOutlined"/>
                  设为默认
                </j-permission-button>
              </a-menu-item>
              <a-menu-item key="edit">
                <j-permission-button type="text" @click="onEdit(item)">
                  <AIcon type="EditOutlined"/>
                  编辑
                </j-permission-button>
              </a-menu-item>
              <a-menu-item key="delete">
                <j-permission-button
                    type="text"
                    danger
                    :popConfirm="{
                        title: $t('Player.ScreenPlayer.521467-10'),
                        onConfirm: (e) => {
                            e?.stopPropagation();
                            deleteHistory(item.key);
                        }
                    }"
                >
                  <AIcon type="DeleteOutlined" />
                  删除
                </j-permission-button>
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
import {deleteSearchHistory, getSearchHistory, saveSearchHistory} from "@/api/comm";
import {DEFAULT_SAVE_CODE} from "@media/views/SplitScreen/data";
import {useI18n} from "vue-i18n";
import {onlyMessage} from "@jetlinks-web/utils";

const props = defineProps({
  data: {
    type: Array,
    default: () => []
  }
})
const emits = defineEmits(['refresh'])
const {t: $t} = useI18n();
const visible = ref(false)
const name = ref()
const current = ref({})
const inputRef = ref()

/**
 * 删除历史分屏
 * @param id
 */
const deleteHistory = (id) => {
  const response = deleteSearchHistory(DEFAULT_SAVE_CODE, id);
  response.then((res) => {
    if (res.success) {
      onlyMessage($t('Channel.index.1046519-22'))
      emits('refresh')
    }
  })
  return response
};

const onBlur = () => {
  if (name.value !== current.value.name) {
    updateHistory({...current.value, name: name.value})
  }
  setTimeout(() => {
    visible.value = false
  }, 100)
}

const updateHistory = (item) => {
  const response = saveSearchHistory(item, DEFAULT_SAVE_CODE);
  response.then((res) => {
    if (res.success) {
      onlyMessage($t('Channel.index.1046519-22'))
      emits('refresh')
    }
  })
  return response
}

const setDefault = async (item) => {
  const _item = props.data.find((i) => i.default);
  if (_item) {
    await updateHistory({..._item, default: false})
  }
  await updateHistory({...item, default: true})
}

const onEdit = (item) => {
  current.value = item
  name.value = item.name
  visible.value = true
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
