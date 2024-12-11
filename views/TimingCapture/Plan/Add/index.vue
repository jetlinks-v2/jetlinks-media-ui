<template>
    <a-modal
        visible
        :title="$t('Add.index.855182-0')"
        @ok="submitData"
         :maskClosable="false"
        @cancel="emit('closeModal')"
    >
        <a-form ref="formRef" layout="vertical" :model="formData">
            <a-form-item
                :label="$t('Add.index.855182-1')"
                name="name"
                :rules="[
                    {
                        required: true,
                        message: $t('Add.index.855182-2'),
                    },
                    {
                        max: 64,
                        message: $t('Add.index.855182-3'),
                    },
                ]"
            >
                <a-input
                    v-model:value="formData.name"
                    :placeholder="$t('Add.index.855182-2')"
                ></a-input>
            </a-form-item>
        </a-form>
    </a-modal>
</template>

<script setup>
import { savePlan } from '../../../../api/auto';
import { onlyMessage } from "@jetlinks-web/utils"
import i18n from '@/locales/index'
const $t = i18n.global.t
const emit = defineEmits(['closeModal']);
const formRef = ref();
const formData = reactive({
    name: '',
});
const submitData =async () => {
    const res = await formRef.value?.validate();
    if(res){
        const resp = await savePlan({
            ...res,
            type:'screenshot'
        });
        if (resp.status === 200) {
            onlyMessage($t('Add.index.855182-4'));
            emit('closeModal',resp.result.id);
        }
    }
}

</script>
<style lang="less" scoped></style>
