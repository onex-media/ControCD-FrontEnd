<template>
  <q-dialog :model-value="modelValue" persistent @update:model-value="updateShow">
    <q-card class="q-pa-md seller-card">
      <q-form @submit.prevent="saveVendor" ref="form">
        <q-card-section class="flex justify-between items-center">
          <h3 class="text-h6 text-weight-bold">
            {{ isEditing ? "Editar Vendedor" : "Nuevo Vendedor" }}
          </h3>
          <q-btn flat round dense icon="close" @click="closeModal" />
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div class="row q-col-gutter-sm q-mb-md">
            <div class="col-12 col-md-4 flex justify-center items-center">
              <div class="col-12 flex justify-center">
                <div class="avatar-container relative-position">
                  <q-avatar size="100px">
                    <img :src="profilePhotoSrc || '/default.png'" />
                  </q-avatar>
                  <div class="avatar-overlay flex justify-center items-center">
                    <q-btn round dense unelevated padding="5px" icon="photo_camera" color="primary" class="q-mx-xs"
                      @click.stop="openFileBrowser('profilePhotoInput')" />
                    <q-btn round dense padding="5px" v-if="profilePhotoSrc" unelevated icon="close" color="red"
                      class="q-mx-xs" @click.stop="clearProfilePhoto" />
                  </div>
                </div>
              </div>
              <input type="file" ref="profilePhotoInput" accept="image/*" style="display: none" class="q-mx-xs"
                @change="handleProfilePhotoChange" />
            </div>

            <div class="col-12 col-md-8">
              <div class="col-12">
                <label>
                  Nombre
                  <span class="text-red-500">*</span>
                </label>
                <q-input v-model="vendorForm.name" outlined dense label="Nombre Completo *" maxlength="50"
                  :rules="[(val) => !!val || 'Campo requerido']">
                  <template v-slot:prepend>
                    <q-icon name="person" />
                  </template>
                </q-input>
              </div>
              <div class="col-12">
                <label>
                  Documento
                  <span class="text-red-500">*</span>
                </label>
                <q-input v-model="vendorForm.dni" outlined dense label="Documento *" :disable="isEditing"
                  mask="###########" :rules="[
                    (val) => !!val || 'Campo requerido',
                    (val) => val.length >= 7 || 'Debe tener al menos 7 dígitos',
                  ]">
                  <template v-slot:prepend>
                    <q-icon name="badge" />
                  </template>
                </q-input>
              </div>
            </div>
          </div>

          <div class="row q-col-gutter-sm q-mb-md">
            <div class="col-12">
              <label>
                Correo
                <span class="text-red-500">*</span>
              </label>
              <q-input v-model="vendorForm.email" outlined dense label="Correo Electrónico *" :rules="[
                (val) => !!val || 'Campo requerido',
                (val) => /.+@.+\..+/.test(val) || 'Correo no válido',
              ]">
                <template v-slot:prepend>
                  <q-icon name="alternate_email" />
                </template>
              </q-input>
            </div>

            <div class="col-12 col-md-6">
              <label>
                Contraseña
                <span class="text-red-500">*</span>
              </label>
              <q-input v-model="vendorForm.password" outlined dense :disabled="isEditing" label="Contraseña *"
                type="password" :rules="[
                  (val) =>
                    (!vendorForm.passwordConfirmation && !isEditing) ||
                    val === vendorForm.passwordConfirmation ||
                    'Las contraseñas no coinciden',
                ]">
                <template v-slot:prepend>
                  <q-icon name="lock" />
                </template>
              </q-input>
            </div>

            <div class="col-12 col-md-6">
              <label>
                Repetir Contraseña
                <span class="text-red-500">*</span>
              </label>
              <q-input v-model="vendorForm.passwordConfirmation" outlined dense label="Repetir Contraseña *"
                type="password" :rules="[
                  (val) =>
                    (!vendorForm.password && !isEditing) ||
                    val === vendorForm.password ||
                    'Las contraseñas no coinciden',
                ]">
                <template v-slot:prepend>
                  <q-icon name="lock_reset" />
                </template>
              </q-input>
            </div>
          </div>

          <div class="row q-col-gutter-sm q-mb-md">
            <div class="col-12 col-md-6">
              <label>
                País de la ruta
                <span class="text-red-500">*</span>
              </label>
              <q-select v-model="vendorForm.country_id" :options="countries" outlined dense
                label="Seleccione país de la ruta" emit-value map-options option-value="id" option-label="name"
                @update:model-value="handleCountryChange" :rules="[
                  (val) => !!val || 'Campo requerido',
                  (val) => val > 0 || 'Seleccione un país válido',
                ]">
                <template v-slot:prepend>
                  <q-icon name="public" />
                </template>
              </q-select>
            </div>

            <div class="col-12 col-md-6">
              <label>
                Ciudad de la ruta
                <span class="text-red-500">*</span>
              </label>
              <q-select v-model="vendorForm.city_id" :options="cities" outlined dense
                label="Seleccione ciudad de la ruta" :disable="!vendorForm.country_id" option-value="id"
                option-label="name" emit-value map-options :rules="[
                  (val) => !!val || 'Campo requerido',
                  (val) => val > 0 || 'Seleccione una ciudad válida',
                ]" clearable>
                <template v-slot:prepend>
                  <q-icon name="location_on" />
                </template>

                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey-8 text-center">
                      <div v-if="vendorForm.country_id">
                        No hay ciudades disponibles para este país.
                      </div>
                      <div v-else>Seleccione un país primero</div>
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>
          </div>

          <div class="row q-col-gutter-sm">
            <div class="col-12">
              <label> Asignar miembros </label>
              <q-select v-model="vendorForm.members" :options="membersOptions" outlined dense multiple use-chips
                emit-value map-options option-value="id" option-label="name" class="mt-1" behavior="menu"
                placeholder="Busca por nombre de usuario o rol del miembro">
                <template v-slot:prepend>
                  <q-icon name="verified_user" />
                </template>
              </q-select>
            </div>
          </div>
          <div class="row q-col-gutter-sm q-mt-lg">
            <div class="col-12 col-md-2 offset-md-8">
              <q-btn unelevated type="submit" :label="isEditing ? 'Guardar' : 'Crear'" color="primary" no-caps
                class="full-width" :loading="loading" />
            </div>
            <div class="col-12 col-md-2">
              <q-btn flat label="Cancelar" color="grey-7" class="full-width" no-caps @click="closeModal" />
            </div>
          </div>
        </q-card-section>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { defineProps, defineEmits, ref } from "vue";
import { pathImage } from "src/boot/axios";
import { watch } from "vue";

const profilePhotoPreview = ref<File | string | null>(null);
const profilePhotoInput = ref<HTMLInputElement | null>(null);

const props = defineProps({
  modelValue: Boolean,
  isEditing: Boolean,
  vendorForm: {
    type: Object,
    required: true,
    default: () => ({
      profileImage: null,
      name: "",
      dni: "",
      email: "",
      userType: "",
      password: "",
      passwordConfirmation: "",
      country_id: null,
      city_id: null,
      roles: [],
    }),
  },
  membersOptions: {
    type: Array,
    required: true,
    default: () => [],
  },
  countries: {
    type: Array,
    default: () => [],
  },
  cities: {
    type: Array,
    default: () => [],
  },
  roleOptions: {
    type: Array,
    default: () => [
      { label: "Socio", value: "partner" },
      { label: "Asistente", value: "assistant" },
      { label: "Revisor", value: "reviewer" },
    ],
  },
  loading: Boolean,
});


const emit = defineEmits([
  "update:modelValue",
  "save-vendor",
  "close-modal",
  "country-changed",
  "open",
]);

const profilePhotoSrc: any = computed(() => {
  if (profilePhotoPreview.value) {
    return profilePhotoPreview.value;
  } else if (
    props.vendorForm.profilePhoto &&
    props.vendorForm.profilePhoto.length > 0
  ) {
    return `${pathImage}${props.vendorForm.profilePhoto[0]}`;
  }
  return null;
});

const openFileBrowser = (refName: string) => {
  if (refName === "profilePhotoInput" && profilePhotoInput.value) {
    profilePhotoInput.value.click();
  }
};

const handleProfilePhotoChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const file = input.files[0];
    props.vendorForm.profilePhoto = [file];
    const reader = new FileReader();
    reader.onload = (e) => {
      profilePhotoPreview.value = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
};

const clearProfilePhoto = () => {
  props.vendorForm.profilePhoto = null;
  profilePhotoPreview.value = null;
};

const handleCountryChange = (country: any) => {
  props.vendorForm.city_id = null;
  emit("country-changed", country);
};

const currentCities = (countryId: number) => props.cities[countryId] || [];

const handleImageUpload = (file: File) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    props.vendorForm.profileImage = e.target?.result;
  };
  reader.readAsDataURL(file);
};

const closeModal = () => {
  emit("update:modelValue", false);
  emit("close-modal");
};

const saveVendor = () => {
  emit("save-vendor");
};

const updateShow = (value: boolean) => {
  emit("update:modelValue", value);
};

watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal) {
      emit("open");
    }
  },
);
</script>

<style lang="scss" scoped>
.avatar-container {
  position: relative;
  display: inline-block;
  cursor: pointer;
  border-radius: 50%;

  .avatar-overlay {
    opacity: 1;
  }
}

.avatar-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  opacity: 0;
  transition: opacity 0.3s ease;
  display: flex;
  justify-content: center;
  align-items: center;
}

.q-btn {
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.1);
  }
}

.q-avatar {
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
}

label {
  color: #424242;
  font-size: 16px;
  font-weight: 400;
  line-height: 150%;
}

.q-separator {
  border-color: rgba(0, 0, 0, 0.08);
}

.text-caption {
  color: #6b7280;
}
</style>
