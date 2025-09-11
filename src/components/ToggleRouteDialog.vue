<template>
  <q-dialog :model-value="modelValue" persistent>
    <q-card class="w-[500px] p-6">
      <div class="flex items-start">
        <div class="flex-shrink-0">
          <div
            class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center"
          >
            <q-icon
              :name="selectedRoute?.status ? 'check_circle' : 'warning'"
              :class="
                selectedRoute?.status ? 'text-green-600' : 'text-blue-600'
              "
              class="text-xl"
            />
          </div>
        </div>
        <div class="ml-4 flex-1">
          <h3 class="text-lg font-medium text-gray-900">
            {{
              selectedRoute?.status
                ? "¡Atención! Activar vendedor"
                : "¡Atención! Desactivar vendedor"
            }}
          </h3>
          <div class="mt-2">
            <p class="text-sm text-gray-500">
              {{
                selectedRoute?.status
                  ? `Estas a punto de activar el vendedor! Con esta acción se reactiva toda la información asociada a esta ruta, incluyendo, Clientes y Miembros asociados.`
                  : `¿Está seguro de que desea desactivar el vendedor? Esta acción desactivará indefinidamente toda la información asociada a esta ruta, incluyendo, Clientes, Miembros y toda la información asociada.`
              }}
            </p>
          </div>
          <div class="mt-4 flex justify-end space-x-3">
            <q-btn
              flat
              no-caps
              label="Cancelar"
              color="gray"
              @click="$emit('cancel-toggle')"
            />
            <q-btn
              no-caps
              label="Confirmar"
              color="primary"
              @click="$emit('confirm-toggle')"
            />
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
  selectedRoute: Object,
});

const emit = defineEmits([
  "update:modelValue",
  "cancel-toggle",
  "confirm-toggle",
]);
</script>
