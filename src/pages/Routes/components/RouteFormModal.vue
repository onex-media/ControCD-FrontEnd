<template>
  <q-dialog :model-value="modelValue" persistent @update:model-value="updateShow">
    <q-card style="width: 96%; max-width: 700px" class="q-pa-md">
      <q-card-section class="flex justify-between items-center">
        <h3 class="text-lg font-medium">
          {{ isEditing ? "Editar ruta" : "Nueva ruta" }}
        </h3>
        <q-btn flat round dense icon="close" @click="closeModal" />
      </q-card-section>
      <q-card-section>
        <p class="text-sm text-grey-7">
          <span v-if="isEditing">
            Estas editando la información preestablecida de la ruta (Nombre de la ruta). Los cambios que realices aquí
            se reflejarán en toda la información asociada a esta ruta.
          </span>
          <span v-else>
            ¡Hola! Para crear una nueva ruta,
            necesitamos que completes la información de todos los campos obligatorios.
          </span>
        </p>
      </q-card-section>
      <q-card-section>
        <h2 class="text-center text-primary text-h5 q-mb-md">Detalles</h2>
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-6">
            <label>
              Nombre de la ruta <span class="text-red-500">*</span>
            </label>
            <q-input v-model="routeForm.name" outlined dense maxlength="25" class="mt-1"
              placeholder="Ingrese el nombre" />
          </div>
          <div class="col-12 col-md-6">
            <label>
              Sector de la ruta <span class="text-red-500">*</span>
            </label>
            <q-input v-model="routeForm.sector" outlined maxlength="25" dense class="mt-1"
              placeholder="Ingrese el sector" />
          </div>
          <div class="col-12">
            <label class="block text-sm font-medium text-gray-700">
              Asignar miembros responsables
              <span class="text-red-500">*</span>
            </label>
            <q-select v-model="routeForm.members" :options="membersOptions" outlined dense multiple use-chips emit-value
              map-options option-value="id" option-label="name" class="mt-1" behavior="menu"
              placeholder="Busca por nombre de usuario o rol del miembro" />
          </div>
        </div>
        <div class="row q-mt-md q-col-gutter-md">
          <div class="col-12 col-md-6">
            <q-btn unelevated flat no-caps label="Cancelar" class="full-width" color="gray" @click="closeModal" />
          </div>
          <div class="col-12 col-md-6">
            <q-btn unelevated no-caps class="full-width" :label="isEditing ? 'Guardar' : 'Crear'" color="primary"
              @click="saveRoute" />
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits } from "vue";
import { useMembers } from "src/composables/useMembers";

const props = defineProps({
  modelValue: Boolean,
  isEditing: Boolean,
  routeForm: {
    type: Object,
    required: true,
  },
  departments: {
    type: Array,
    required: true,
    default: () => [],
  },
  membersOptions: {
    type: Array,
    required: true,
    default: () => [],
  },
  routesOptions: {
    type: Array,
    required: true,
    default: () => [],
  },
  vValidate: {
    type: Object,
    required: true,
  },
});
const emit = defineEmits(["update:modelValue", "save-route", "close-modal"]);

const { closeModalWithoutValidation } = useMembers();

const closeModal = () => {
  closeModalWithoutValidation();
  emit("update:modelValue", false);
};

const updateShow = (value: boolean) => {
  emit("update:modelValue", value);
};

const saveRoute = () => {
  emit("save-route");
};

const v$ = props.vValidate;
</script>
