<template>
  <q-dialog :model-value="modelValue" persistent>
    <q-card class="conformation-card">
      <div class="flex items-start">
        <div class="flex-shrink-0">
          <div class="rounded-full flex items-center justify-center">
            <AtentionIcon />
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
              }} Esta acción desactivara indefinidamente toda la información asociada a esta ruta, incluyendo, Clientes,
              Miembros y toda la información asociada.
            </p>
          </div>
          <div class="mt-4 flex justify-end space-x-3 actions">
            <template v-if="selectedMember?.status !== 'active'">
              <q-btn no-caps label="Confirmar" unelevated class="atention-button" @click="$emit('confirm-toggle')" />
              <q-btn flat no-caps class="atention-button-cancel" label="Cancelar" @click="$emit('cancel-toggle')" />
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
import AtentionIcon from "./assets/AtentionIcon.vue";

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
