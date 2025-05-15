<template>
  <q-dialog :model-value="modelValue" persistent>
    <q-card class="w-[600px]">
      <q-card-section class="flex justify-between items-center">
        <h3 class="text-lg font-medium">
          {{ isEditing ? "Editar ciudad" : "Nueva ciudad" }}
        </h3>
        <q-btn flat round dense icon="close" @click="closeModal" />
      </q-card-section>

      <q-card-section class="q-pt-none">
        <p class="text-sm text-gray-500 mb-6">
          {{
            isEditing
              ? `Estás editando la ciudad ${selectedCity?.name}`
              : "Estás creando ciudad. Para que esta ciudad se cree exitosamente, es necesario que rellenes todos los campos obligatorios."
          }}
        </p>

        <div class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700">
              País <span class="text-red-500">*</span>
            </label>
            <q-select
              behavior="menu"
              v-model="cityForm.country_id"
              :options="props.countries"
              option-value="id"
              option-label="name"
              outlined
              dense
              emit-value
              map-options
             aria-placeholder="Selecciona un país"
              class="mt-1"
              placeholder="Selecciona un país"
            />
            <p class="mt-2 text-sm text-gray-500">
              Selecciona el país correspondiente a la ciudad
            </p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">
              Ciudad <span class="text-red-500">*</span>
            </label>
            <q-input
              v-model="cityForm.name"
              outlined
              dense
              class="mt-1"
              placeholder="Escribe el nombre de la ciudad"
            />
            <p class="mt-2 text-sm text-gray-500">
              Ingresa manualmente el nombre de la ciudad
            </p>
          </div>
        </div>
      </q-card-section>

      <q-card-actions align="right" class="px-6 py-4 border-t">
        <q-btn
          @click="saveCity"
          no-caps
          :label="isEditing ? 'Guardar' : 'Crear'"
          color="primary"
          :loading="saving"
        />
        <q-btn
          flat
          no-caps
          label="Cancelar"
          color="gray"
          class="mr-3"
          @click="closeModal"
        />
       
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { defineProps } from "vue";

const emit = defineEmits(["update:modelValue", "save-city", "close-modal"]);

const props = defineProps({
  modelValue: Boolean,
  isEditing: Boolean,
  selectedCity: Object,
  cityForm: {
    type: Object,
    required: true,
    default: () => ({
      name: "",
      country_id: null,
    }),
  },
  countries: {
    type: Array,
    required: true,
    default: () => [],
  },

  cities: {
    type: Array,
    required: true,
    default: () => [],
  },
});

const saveCity = () => {
  emit("save-city");
};

const closeModal = () => {
  emit("close-modal");
  emit("update:modelValue", false);
};
</script>
