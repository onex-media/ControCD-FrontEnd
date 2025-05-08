<template>
  <q-dialog :model-value="modelValue" persistent>
    <q-card class="w-[500px] p-6">
      <div class="flex items-start">
        <div class="flex-shrink-0">
          <div
            class="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center"
          >
            <q-icon :name="icon" class="text-red-600 text-xl" />
          </div>
        </div>
        <div class="ml-4 flex-1">
          <h3 class="text-lg font-medium text-gray-900">{{ title }}</h3>
          <div class="mt-2">
            <p class="text-sm text-gray-500">{{ description }}</p>
          </div>
          <div class="mt-4 flex justify-end space-x-3">
            <q-btn
              flat
              no-caps
              label="Cancelar"
              color="gray"
              @click="closeDialog"
            />
            <q-btn
              no-caps
              label="Confirmar"
              color="negative"
              @click="confirmAction"
            />
          </div>
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits } from "vue";

const props = defineProps({
  modelValue: Boolean,
  title: String,
  icon: String,
  description: String,
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
