<template>
  <a-modal
    visible
    :title="data.id ? $t('Config.index.133246-12') : $t('Config.index.133246-0')"
    width="600px"
    :maskClosable="false"
    :confirmLoading="loading"
    @ok="handleSave"
    @cancel="handleCancel"
  >
    <a-form ref="formRef" layout="vertical" :model="formData" :rules="rules">
      <a-form-item :label="$t('Catalog.Left.Save.1-1')" name="name">
        <a-input v-model:value="formData.name" :placeholder="$t('Catalog.Left.Save.1-2')" />
      </a-form-item>
      <a-form-item :label="$t('Catalog.Left.Save.1-3')" name="code">
        <a-input v-model:value="formData.code" :placeholder="$t('Catalog.Left.Save.1-4')"></a-input>
      </a-form-item>
      <a-form-item :label="$t('Catalog.Left.Save.1-5')" name="type">
        <a-select v-model:value="formData.type" :options="typeList" :placeholder="$t('Catalog.Left.Save.1-6')" :fieldNames="{label: 'text'}" />
      </a-form-item>
      <a-form-item :label="$t('Catalog.Left.Save.1-7')" name="manufacturer">
        <a-input v-model:value="formData.manufacturer" :placeholder="$t('Catalog.Left.Save.1-8')" />
      </a-form-item>
      <a-form-item :label="$t('Catalog.Left.Save.1-9')" name="model">
        <a-input v-model:value="formData.model" :placeholder="$t('Catalog.Left.Save.1-10')" />
      </a-form-item>
      <a-form-item :label="$t('Catalog.Left.Save.1-11')" name="address">
        <a-input v-model:value="formData.address" :placeholder="$t('Catalog.Left.Save.1-12')" />
      </a-form-item>
      <a-form-item :label="$t('Catalog.Left.Save.1-13')">
        <a-textarea v-model:value="formData.description" :placeholder="$t('Catalog.Left.Save.1-14')" showCount :maxlength="200"/>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
import { useRequest } from '@jetlinks-web/hooks'
import { saveCatalog, getCatalogType } from '@media/api/catalog'
import { onlyMessage } from '@jetlinks-web/utils'
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()
const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
  }
})
const emits = defineEmits(['close', 'save'])

const { loading, run: runSave } = useRequest(saveCatalog, {
  immediate: false,
  onSuccess: () => {
    onlyMessage($t('Debug.index.013560-11'))
    emits('close')
    emits('save')
  }
}) 

const { data: typeList } = useRequest(getCatalogType, {
  immediate: true
})
const formRef = ref()
const formData = reactive({
  name: '',
  code: '',
  type: undefined,
  manufacturer: '',
  model: '',
  address: '',
  description: ''
})

const rules = {
  name: [
    { required: true, message: $t('Catalog.Left.Save.1-2'), trigger: 'blur' },
    { max: 64, message: $t('CardManagement.Save.427943-17'), trigger: 'blur' }
  ],
  code: [
    { required: true, message: $t('Catalog.Left.Save.1-4'), trigger: 'blur' },
    { max: 64, message: $t('CardManagement.Save.427943-17'), trigger: 'blur' }
  ],
  type: [
    { required: true, message: $t('Catalog.Left.Save.1-6'), trigger: 'blur' },
    { max: 64, message: $t('CardManagement.Save.427943-17'), trigger: 'blur' }
  ],
  model: [
    { max: 64, message: $t('CardManagement.Save.427943-17'), trigger: 'blur' }
  ],
  manufacturer: [
    { max: 64, message: $t('CardManagement.Save.427943-17'), trigger: 'blur' }
  ],
  address: [
    { max: 64, message: $t('CardManagement.Save.427943-17'), trigger: 'blur' }
  ],
}

const handleSave = () => {
  // 这里添加保存逻辑
  formRef.value.validate().then(() => {
    runSave(formData)
  })
}

const handleCancel = () => {
  emits('close')
}

watch(() => props.data, (newVal) => {
  Object.assign(formData, newVal)
}, { immediate: true })
</script>

<style lang="less" scoped>
// 可以根据需要添加样式
</style>