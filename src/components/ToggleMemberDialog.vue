<template>
  <q-dialog :model-value="modelValue" persistent>
    <q-card class="w-[500px] p-6">
      <div class="flex items-start">
        <div class="flex-shrink-0">
          <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
            <q-icon :name="selectedMember?.status === 'active' ? 'check_circle' : 'warning'" :class="selectedMember?.status === 'active' ? 'text-green-600' : 'text-blue-600'
              " class="text-xl" />
          </div>
        </div>
        <div class="ml-4 flex-1">
          <h3 class="text-lg font-medium text-gray-900">
            {{
              selectedMember?.status === 'active'
                ? "¡Atención! Activar miembro"
                : "¡Atención! Desactivar miembro"
            }}
          </h3>
          <div class="mt-2">
            <p class="text-sm text-gray-500">
              {{
                selectedMember?.status === 'active'
                  ? `!Estas punto de activar al miembro ${selectedMember?.name}!`
                  : `¿Está seguro de que desea desactivar al miembro ${selectedMember?.name}?`
              }}
            </p>
          </div>
          <div class="mt-4 flex justify-end space-x-3">
            <template v-if="selectedMember?.status !== 'active'">
              <q-btn flat no-caps label="Cancelar" color="gray" @click="$emit('cancel-toggle')" />
              <q-btn no-caps label="Confirmar" color="primary" @click="$emit('confirm-toggle')" />
            </template>
            <template v-else>
              <q-btn no-caps label="Continuar" color="primary" @click="$emit('confirm-toggle')" />
            </template>
          </div>
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";

const props = defineProps({
  modelValue: Boolean,
  selectedMember: Object,
});

const emit = defineEmits([
  "update:modelValue",
  "cancel-toggle",
  "confirm-toggle",
]);
</script>
