<template>
  <q-dialog :model-value="modelValue" persistent>
    <q-card class="conformation-card">
      <div class="flex items-start">
        <div class="flex-shrink-0">
          <div class="rounded-full flex items-center justify-center">
            <AtentionIcon v-if="type === 'atention'" />
            <DangerIcon v-if="type === 'danger'" />
          </div>
        </div>
        <div class="ml-4 flex-1">
          <h3 class="text-lg font-medium text-gray-900">{{ title }}</h3>
          <div class="mt-2">
            <p class="text-sm text-gray-500">{{ description }}</p>
          </div>
          <div class="actions flex justify-end space-x-3">
            <q-btn no-caps :label="btnLabel" unelevated
              :class="{ 'danger-button': type === 'danger', 'atention-button': type === 'atention' }"
              @click="confirmAction" />
            <q-btn flat no-caps label="Cancelar"
              :class="{ 'danger-button-cancel': type === 'danger', 'atention-button-cancel': type === 'atention' }"
              color="gray" @click="closeDialog" />
          </div>
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits } from "vue";
import DangerIcon from "./assets/DangerIcon.vue";
import AtentionIcon from "./assets/AtentionIcon.vue";

const props = defineProps({
  modelValue: Boolean,
  title: String,
  icon: String,
  description: String,
  type: {
    type: String,
    default: () => 'atention'
  },
  btnLabel: {
    type: String,
    default: () => 'Confirmar'
  }
});

const emit = defineEmits(["update:modelValue", "confirm"]);

const closeDialog = () => {
  emit("update:modelValue", false);
};

const confirmAction = () => {
  emit("confirm");
  emit("update:modelValue", false);
};
</script>
