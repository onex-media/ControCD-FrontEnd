<template>
  <q-dialog
    :model-value="modelValue"
    persistent
    @update:model-value="updateShow"
  >
    <q-card style="width: 96%; max-width: 700px" class="q-pa-md">
      <q-card-section class="flex justify-between items-center">
        <h3 class="text-lg font-medium">
          {{ isEditing ? "Editar fiador" : "Nuevo fiador" }}
        </h3>
        <q-btn flat round dense icon="close" @click="closeModal" />
      </q-card-section>
      <q-card-section>
        <p class="text-sm text-grey-7">
          {{
            isEditing
              ? "Estas editando la información preestablecida del fiador. Los cambios que realices aquí se reflejarán en toda la información asociada a este fiador."
              : "¡Hola! Para crear un nuevo fiador, necesitamos que completes la información de todos los campos obligatorios."
          }}
        </p>
      </q-card-section>
      <q-card-section>
        <h2 class="text-center text-primary text-h5 q-mb-md">Detalles</h2>
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-6">
            <label>
              Nombre del fiador <span class="text-red-500">*</span>
            </label>
            <q-input
              v-model="guarantorFormData.name"
              outlined
              dense
              maxlength="25"
              class="mt-1"
              placeholder="Ingrese el nombre"
            />
          </div>
          <div class="col-12 col-md-6">
            <label> Dirección <span class="text-red-500">*</span> </label>
            <q-input
              v-model="guarantorFormData.address"
              outlined
              maxlength="50"
              dense
              class="mt-1"
              placeholder="Ingrese la dirección"
            />
          </div>
          <div class="col-12 col-md-6">
            <label> DNI <span class="text-red-500">*</span> </label>
            <q-input
              v-model="guarantorFormData.dni"
              outlined
              dense
              class="mt-1"
              placeholder="Ingrese el DNI"
            />
          </div>
          <div class="col-12 col-md-6">
            <label> Teléfono <span class="text-red-500">*</span> </label>
            <q-input
              v-model="guarantorFormData.phone"
              outlined
              dense
              class="mt-1"
              placeholder="Ingrese el teléfono"
            />
          </div>
          <div class="col-12">
            <label> Email </label>
            <q-input
              v-model="guarantorFormData.email"
              outlined
              dense
              class="mt-1"
              placeholder="Ingrese el email"
            />
          </div>
        </div>
        <div class="row q-mt-md q-col-gutter-md">
          <div class="col-12 col-md-6">
            <q-btn
              unelevated
              flat
              no-caps
              label="Cancelar"
              class="full-width"
              color="gray"
              @click="closeModal"
            />
          </div>
          <div class="col-12 col-md-6">
            <q-btn
              unelevated
              no-caps
              class="full-width"
              :label="isEditing ? 'Guardar' : 'Crear'"
              color="primary"
              @click="saveGuarantor"
            />
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import { useGuarantors } from "src/composables/useGuarantors";

const props = defineProps({
  modelValue: Boolean,
  isEditing: Boolean,
  guarantorFormData: {
    type: Object,
    required: true,
  },
  clientsOptions: {
    type: Array,
    required: true,
    default: () => [],
  },
  vValidate: {
    type: Object,
    required: true,
  },
});
const emit = defineEmits([
  "update:modelValue",
  "save-guarantor",
  "close-modal",
]);

const { closeGuarantorModalWithoutValidation } = useGuarantors();

const closeModal = () => {
  closeGuarantorModalWithoutValidation();
  emit("update:modelValue", false);
};

const updateShow = (value: boolean) => {
  emit("update:modelValue", value);
};

const saveGuarantor = () => {
  emit("save-guarantor");
};

const v$ = props.vValidate;
</script>
