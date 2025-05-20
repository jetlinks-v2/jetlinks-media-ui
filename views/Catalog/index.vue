<template>
  <j-page-container>
    <full-page>
      <div style="padding: 16px;">
        <a-row :gutter="16" :wrap="false">
          <a-col flex="400px">
            <Left />
          </a-col>
          <a-col flex="1">
            <Right />
          </a-col>
        </a-row>
      </div>
   </full-page>
  </j-page-container>
</template>

<script setup lang="ts">
import Left from './Left/index.vue'
import Right from './Right/index.vue'

const selectCatalog = ref([]);

provide('selectCatalog', selectCatalog)
</script>