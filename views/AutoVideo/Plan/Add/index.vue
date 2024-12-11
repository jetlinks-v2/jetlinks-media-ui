<template>
    <a-modal
        visible
        :title="$t('Add.index.312707-0')"
        :confirmLoading="loading"
        :maskClosable="false"
        @ok="submitData"
        @cancel="$emit('closeModal')"
    >
        <a-form ref="formRef" layout="vertical" :model="formData">
            <a-form-item
                :label="$t('Add.index.312707-1')"
                name="name"
                :rules="[
                    {
                        required: true,
                        message: $t('Add.index.312707-2'),
                    },
                    {
                        max: 64,
                        message: $t('Add.index.312707-3'),
                    },
                ]"
            >
                <a-input v-model:value="formData.name"></a-input>
            </a-form-item>
        </a-form>
    </a-modal>
</template>

<script setup>
import {savePlan} from '../../../../api/auto';
import {onlyMessage} from '@jetlinks-web/utils';
import {useMenuStore} from '@/store/menu';
import {useRequest} from '@jetlinks-web/hooks'
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();
const emit = defineEmits(['closeModal']);
const formRef = ref();
const formData = ref({
    name: '',
    type: 'video',
});
const menuStory = useMenuStore();

const {loading, run} = useRequest(savePlan, {
    immediate: false,
    onSuccess(res) {
        onlyMessage($t('Add.index.312707-4'));
        menuStory.jumpPage(
            'media/AutoVideo/Plan/Detail',
            {
                params: {
                    id: res.result.id,
                },
                query: {
                    type: 'edit',
                },
            },
        );
    }
})
const submitData = () => {
    formRef.value.validate().then(() => {
        run(formData.value);
    });
};
</script>
<style lang="less" scoped></style>
