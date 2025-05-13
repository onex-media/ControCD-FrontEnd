<template>
  <q-dialog :model-value="modelValue" persistent @update:model-value="updateShow" @before-show="loadData"
    @before-hide="handlerCloseModal">
    <q-card class="member-card">
      <!--Header form-->
      <q-card-section>
        <div class="flex justify-between items-center">
          <h3 class="member-card__title">
            {{ isEditing ? "Editar miembro" : "Nuevo miembro" }}
          </h3>
          <q-btn flat round dense icon="close" @click="closeModal" />
        </div>
        <div>
          <p class="member-card__description">
            Estás a punto de crear un nuevo miembro en el equipo. Este tendrá
            acceso a las funcionalidades y beneficios de la plataforma como,
            Gestión de clientes, Gestión de cobros y Otras funcionalidades
            específicas dependiendo del rol del miembro.
          </p>
        </div>
      </q-card-section>
      <!--End header form-->

      <!--Body form-->
      <q-card-section>
        <!--Tab panel header-->
        <q-tabs no-caps v-model="currentTab" dense class="text-grey" indicator-color="primary" align="justify"
          narrow-indicator>
          <q-tab name="personal" label="Info. Personal" />
          <q-tab name="routes" label=" Asignar ruta" />
        </q-tabs>
        <!--End tab panel header-->

        <q-tab-panels v-model="currentTab" animated class="q-mt-md">
          <q-tab-panel name="personal">
            <div class="row q-col-gutter-sm" v-if="memberForm">
              <div class="col-12 col-md-6">
                <label>
                  Nombre
                  <span class="text-red-500" v-if="!isEditing">*</span>
                </label>
                <q-input v-model="memberForm.name" outlined dense maxlength="25" class="mt-1"
                  placeholder="Ingrese el nombre" :error="v$.form.name.$invalid && v$.form.name.$dirty"
                  @blur="v$.form.name.$touch">
                  <template v-slot:error v-if="v$.form.name.$invalid && v$.form.name.$dirty">
                    {{ getErrorMessage(v$.form.name.$errors, "name") }}
                  </template>
                </q-input>
              </div>
              <div class="col-12 col-md-6">
                <label>
                  Cédula
                  <span class="text-red-500" v-if="!isEditing">*</span>
                </label>
                <q-input v-model="memberForm.identification" outlined dense maxlength="10" class="mt-1"
                  placeholder="Ingrese la cédula" :error="v$.form.identification.$invalid &&
                    v$.form.identification.$dirty
                    " @blur="v$.form.identification.$touch">
                  <template v-slot:error v-if="v$.form.identification.$invalid &&
                    v$.form.identification.$dirty
                    ">
                    {{
                      getErrorMessage(
                        v$.form.identification.$errors,
                        "identification"
                      )
                    }}
                  </template>
                </q-input>
              </div>
              <div class="col-12 col-md-6">
                <label>
                  Dirección
                  <span class="text-red-500" v-if="!isEditing">*</span>
                </label>
                <q-input v-model="memberForm.address" outlined dense maxlength="30" class="mt-1"
                  placeholder="Ingrese la dirección" :error="v$.form.address.$invalid && v$.form.address.$dirty"
                  @blur="v$.form.address.$touch">
                  <template v-slot:error v-if="v$.form.address.$invalid && v$.form.address.$dirty">
                    {{ getErrorMessage(v$.form.address.$errors, "address") }}
                  </template>
                </q-input>
              </div>
              <div class="col-12 col-md-6">
                <label>
                  Teléfono
                  <span class="text-red-500" v-if="!isEditing">*</span>
                </label>
                <q-input v-model="memberForm.phone" type="number" outlined dense maxlength="25" class="mt-1"
                  placeholder="Ingrese el teléfono" :error="v$.form.phone.$invalid && v$.form.phone.$dirty"
                  @blur="v$.form.phone.$touch">
                  <template v-slot:error v-if="v$.form.phone.$invalid && v$.form.phone.$dirty">
                    {{ getErrorMessage(v$.form.phone.$errors, "phone") }}
                  </template>
                </q-input>
              </div>
              <div class="col-12 col-md-12">
                <label>
                  Correo
                  <span class="text-red-500" v-if="!isEditing">*</span>
                </label>
                <q-input v-model="memberForm.email" outlined dense class="mt-1" placeholder="Ingrese el correo"
                  :error="v$.form.email.$invalid && v$.form.email.$dirty" @blur="v$.form.email.$touch">
                  <template v-slot:error v-if="v$.form.email.$invalid && v$.form.email.$dirty">
                    {{ getErrorMessage(v$.form.email.$errors, "email") }}
                  </template>
                </q-input>
              </div>
              <div class="col-12 col-md-6">
                <label>
                  Contraseña
                  <span class="text-red-500" v-if="!isEditing">*</span>
                </label>
                <q-input v-model="memberForm.password" outlined dense maxlength="30" class="mt-1"
                  placeholder="Ingrese la contraseña" :type="showPassword ? 'text' : 'password'"
                  :error="v$.form.password.$invalid && v$.form.password.$dirty" @blur="v$.form.password.$touch">
                  <template v-slot:append>
                    <q-icon :name="showPassword ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                      @click="showPassword = !showPassword" />
                  </template>
                  <template v-slot:error v-if="v$.form.password.$invalid && v$.form.password.$dirty">
                    {{ getErrorMessage(v$.form.password.$errors, "password") }}
                  </template>
                </q-input>
              </div>
              <div class="col-12 col-md-6">
                <label class="block text-sm font-medium text-gray-700">
                  Rol del miembro
                  <span class="text-red-500">*</span>
                </label>
                <q-select label="Selecciona el rol del miembro" v-model="memberForm.role_id" :options="roles" emit-value
                  map-options option-value="id" option-label="name" outlined dense behavior="menu" class="mt-1"
                  :error="v$.form.role_id.$invalid && v$.form.role_id.$dirty" @blur="v$.form.role_id.$touch" />
              </div>
            </div>
          </q-tab-panel>

          <q-tab-panel name="routes">
            <div>
              <label> Rutas </label>
              <q-select label="Selecciona una ruta" v-model="memberForm.routes" :options="routes" multiple dense
                outlined emit-value map-options use-chips option-value="id" option-label="name" behavior="menu"
                placeholder="Seleccione las rutas" class="mt-1" />
              <p class="mt-2 text-sm text-gray-500">
                Seleccione las rutas a las que pertenecerá este miembro
              </p>
            </div>
          </q-tab-panel>
        </q-tab-panels>

        <div class="row q-col-gutter-sm q-mt-lg">
          <div class="col-12 col-md-2 offset-md-8">
            <q-btn :loading="savingMember" v-if="currentTab === 'routes'" unelevated class="full-width" no-caps
              :label="isEditing ? 'Guardar' : 'Crear'" color="primary" @click="saveMember" />
            <q-btn v-if="currentTab === 'personal'" unelevated class="full-width" no-caps label="Siguiente"
              color="primary" @click="currentTab = 'routes'" />
          </div>
          <div class="col-12 col-md-2">
            <q-btn flat no-caps label="Cancelar" class="full-width cancel-button" @click="closeModal" />
          </div>
        </div>
      </q-card-section>
      <!--End body form-->
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import { ref, watch, computed } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { useMembers } from "src/composables/useMembers";

const showPassword = ref(false);
const currentTab = ref<string>("personal");

const props = defineProps({
  modelValue: Boolean,
  isEditing: Boolean,
  memberForm: {
    type: Object,
    required: true,
    default: () => ({ name: "", identification: "", rutas: [] }),
  },
  departments: {
    type: Array,
    required: true,
    default: () => [],
  },
  routesOptions: {
    type: Object,
    required: true,
    default: () => ({ data: [] }),
  },
  cities: {
    type: Array,
    required: true,
    default: () => [],
  },
  roles: {
    type: Array,
    required: true,
    default: () => [],
  },
  savingMember: {
    type: Boolean,
    default: () => false
  }
});

const emit = defineEmits(["update:modelValue", "save-member", "close-modal", "load-data"]);
const { rules, closeModalWithoutValidation, getErrorMessage } = useMembers();
const v$ = useVuelidate(rules, { form: props.memberForm });

const routes = computed(() => props.routesOptions.data);

const closeModal = () => {
  closeModalWithoutValidation();
  emit("update:modelValue", false);
  handlerCloseModal();
};

const updateShow = (value: boolean) => {
  emit("update:modelValue", value);
};

const touchAllFields = () => {
  if (v$.value) {
    v$.value.$touch();
    const formFields = v$.value.form;
    Object.keys(formFields).forEach((field) => {
      if (formFields[field] && typeof formFields[field].$touch === "function") {
        formFields[field].$touch();
      }
    });
  }
};

const saveMember = () => {
  touchAllFields();
  if (v$.value.$invalid) {
    return;
  }
  emit("save-member");
};

const loadData = () => {
  emit('load-data')
}

const handlerCloseModal = () => {
  emit('close-modal')
}

watch(
  () => props.memberForm,
  (newVal) => {
    if (v$.value) {
      if (newVal.city_id) {
        v$.value.form.city_id.$touch();
      }
      if (newVal.role_id) {
        v$.value.form.role_id.$touch();
      }
    }
  },
  { deep: true }
);
</script>
