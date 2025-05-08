<template>
  <q-dialog
    :model-value="modelValue"
    persistent
    @update:model-value="updateShow"
  >
    <q-card style="width: 96%; max-width: 800px" class="q-pa-md">
      <q-card-section class="flex justify-between items-center">
        <h3 class="text-lg font-medium">
          {{ isEditing ? "Editar cliente" : "Nuevo cliente" }}
        </h3>
        <q-btn flat round dense icon="close" @click="closeModal" />
      </q-card-section>

      <q-card-section class="q-pt-none">
        <div>
          <q-tabs
            v-model="currentTab"
            dense
            class="text-grey"
            active-color="primary"
            indicator-color="primary"
            align="justify"
            narrow-indicator
          >
            <q-tab name="client" label="Cliente" />
            <q-tab name="location" label="Locación" />
            <q-tab name="images" label="Imagenes" />
          </q-tabs>
        </div>
        <q-tab-panels v-model="currentTab" animated>
          <q-tab-panel name="client">
            <div class="row q-col-gutter-sm">
              <div class="col-12 col-md-4">
                <div class="row">
                  <div class="col-12 flex justify-center">
                    <q-avatar size="150px">
                      <img :src="profilePhotoSrc || '/default.png'" />
                    </q-avatar>
                  </div>
                  <div class="col-12 flex justify-center q-mt-md">
                    <q-btn
                      dense
                      unelevated
                      padding="5px"
                      icon="photo_camera"
                      color="primary"
                      class="q-mx-xs"
                      @click="openFileBrowser('profilePhotoInput')"
                    />
                    <q-btn
                      dense
                      padding="5px"
                      v-if="profilePhotoSrc"
                      unelevated
                      icon="close"
                      color="red"
                      @click="clearProfilePhoto"
                    />
                  </div>
                  <input
                    type="file"
                    ref="profilePhotoInput"
                    accept="image/*"
                    style="display: none"
                    class="q-mx-xs"
                    @change="handleProfilePhotoChange"
                  />
                </div>
              </div>
              <div class="col-12 col-md-8">
                <div class="row q-col-gutter-sm">
                  <div class="col-12 col-md-6">
                    <label>
                      Nombre
                      <span class="text-red-500" v-if="!isEditing">*</span>
                    </label>
                    <q-input
                      v-model="clientFormData.name"
                      outlined
                      dense
                      maxlength="25"
                      class="mt-1"
                      placeholder="Ingrese el nombre"
                      :error="v$.form.name.$invalid && v$.form.name.$dirty"
                      @blur="v$.form.name.$touch"
                    >
                      <template
                        v-slot:error
                        v-if="v$.form.name.$invalid && v$.form.name.$dirty"
                      >
                        {{ getErrorMessage(v$.form.name.$errors, "name") }}
                      </template>
                    </q-input>
                  </div>
                  <div class="col-12 col-md-6">
                    <label>
                      Dni
                      <span class="text-red-500" v-if="!isEditing">*</span>
                    </label>
                    <q-input
                      v-model="clientFormData.dni"
                      outlined
                      dense
                      class="mt-1"
                      placeholder="Ingrese el correo"
                      :error="v$.form.dni.$invalid && v$.form.dni.$dirty"
                      @blur="v$.form.dni.$touch"
                    >
                      <template
                        v-slot:error
                        v-if="v$.form.dni.$invalid && v$.form.dni.$dirty"
                      >
                        {{ getErrorMessage(v$.form.dni.$errors, "email") }}
                      </template>
                    </q-input>
                  </div>
                  <div class="col-12 col-md-6">
                    <label>
                      Dirección
                      <span class="text-red-500" v-if="!isEditing">*</span>
                    </label>
                    <q-input
                      v-model="clientFormData.address"
                      outlined
                      dense
                      class="mt-1"
                      placeholder="Ingrese la dirección"
                      :error="
                        v$.form.address.$invalid && v$.form.address.$dirty
                      "
                      @blur="v$.form.address.$touch"
                    >
                      <template
                        v-slot:error
                        v-if="
                          v$.form.address.$invalid && v$.form.address.$dirty
                        "
                      >
                        {{
                          getErrorMessage(v$.form.address.$errors, "address")
                        }}
                      </template>
                    </q-input>
                  </div>
                  <div class="col-12 col-md-6">
                    <label>
                      Teléfono
                      <span class="text-red-500" v-if="!isEditing">*</span>
                    </label>
                    <q-input
                      v-model="clientFormData.phone"
                      outlined
                      dense
                      class="mt-1"
                      placeholder="Ingrese el teléfono"
                      :error="v$.form.phone.$invalid && v$.form.phone.$dirty"
                      @blur="v$.form.phone.$touch"
                    >
                      <template
                        v-slot:error
                        v-if="v$.form.phone.$invalid && v$.form.phone.$dirty"
                      >
                        {{ getErrorMessage(v$.form.phone.$errors, "phone") }}
                      </template>
                    </q-input>
                  </div>
                  <div class="col-12">
                    <label>
                      Correo
                      <span class="text-red-500" v-if="!isEditing">*</span>
                    </label>
                    <q-input
                      v-model="clientFormData.email"
                      outlined
                      dense
                      type="email"
                      class="mt-1"
                      placeholder="Ingrese el correo"
                      :error="v$.form.email.$invalid && v$.form.email.$dirty"
                      @blur="v$.form.email.$touch"
                    >
                      <template
                        v-slot:error
                        v-if="v$.form.email.$invalid && v$.form.email.$dirty"
                      >
                        {{ getErrorMessage(v$.form.email.$errors, "email") }}
                      </template>
                    </q-input>
                  </div>
                </div>
              </div>
            </div>
          </q-tab-panel>
          <q-tab-panel name="images">
            <div class="row flex items-center q-col-gutter-sm hg-photo">
              <div class="col-12">
                <div class="row">
                  <input
                    type="file"
                    ref="galleryPhotosInput"
                    accept="image/*"
                    multiple
                    style="display: none"
                    @change="handleGalleryPhotosChange"
                  />

                  <div class="col-12">
                    <q-carousel
                      v-if="galleryPhotosPreview.length > 0"
                      v-model="carouselIndex"
                      animated
                      infinite
                      control-color="primary"
                      control-type="push"
                      arrows
                      height="340px"
                    >
                      <q-carousel-slide
                        v-for="(src, index) in galleryPhotosPreview"
                        :key="index"
                        :name="index"
                      >
                        <q-img
                          :src="src"
                          :aspect-ratio="1"
                          spinner-color="primary"
                          spinner-size="82px"
                          fit="contain"
                          style="height: 320px; object-fit: contain"
                        />
                        <q-btn
                          unelevated
                          class="btn-delete"
                          size="16px"
                          color="red-5"
                          dense
                          round
                          icon="close"
                          @click="removeGalleryPhoto(index)"
                        />
                      </q-carousel-slide>
                    </q-carousel>
                  </div>
                  <div class="col-12 flex justify-center q-gutter-x-sm q-mt-sm">
                    <q-btn
                      v-if="galleryPhotosPreview.length < 3"
                      unelevated
                      icon="photo_camera"
                      label="Foto Documentos"
                      color="primary"
                      @click="openFileBrowser('galleryPhotosInput')"
                    />
                  </div>
                </div>
              </div>
            </div>
          </q-tab-panel>
          <q-tab-panel name="location">
            <p>LOCALIDAD</p>
            <Map
              ref="mapRef"
              :geolocation="clientGeolocation"
              :isEditing="props.isEditing"
              @location-selected="updateClientGeolocation"
            />
          </q-tab-panel>
        </q-tab-panels>
        <div class="row q-col-gutter-sm">
          <div class="col-12 col-md-6">
            <q-btn
              flat
              no-caps
              :label="previousTabLabel()"
              color="grey-7"
              class="full-width"
              @click="previousTab"
            />
          </div>
          <div class="col-12 col-md-6">
            <q-btn
              unelevated
              class="full-width"
              no-caps
              :label="nextTab()"
              color="primary"
              @click="saveClient"
            />
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, watch } from "vue";
import { useClients } from "src/composables/useClients";
import { useVuelidate } from "@vuelidate/core";
import { CreateClientPayload } from "src/types/clients.types";
import Map from "src/components/Map.vue";
import { pathImage } from "src/boot/axios";
import { useMap } from "src/composables/useMap";

const { setMarker } = useMap();
const { rules, closeModalWithoutValidation } = useClients();
const emit = defineEmits(["update:modelValue", "save-client", "close-modal"]);

const props = defineProps({
  modelValue: Boolean,
  isEditing: Boolean,
  clientFormData: {
    type: Object as () => CreateClientPayload,
    required: true,
  },
  fiadorFormData: {
    type: Object,
    required: false,
    default: () => ({ name: "", address: "", phone: "", email: "" }),
  },
});

console.log("clientFormData", props.clientFormData);

const v$ = useVuelidate(rules, {
  form: props.clientFormData,
  fiadorForm: props.fiadorFormData,
});
const currentTab = ref("client");
const profilePhotoInput = ref<HTMLInputElement | null>(null);
const profilePhotoPreview = ref<string | null>(null);
const carouselIndex = ref(0);
const galleryPhotosInput = ref<HTMLInputElement | null>(null);
const mapRef = ref<any>(null);

interface Geolocation {
  latitude: number | null;
  longitude: number | null;
}

const clientGeolocation = ref<Geolocation>({
  latitude: null,
  longitude: null,
});

const profilePhotoSrc = computed(() => {
  if (profilePhotoPreview.value) {
    return profilePhotoPreview.value;
  } else if (
    props.clientFormData.profilePhoto &&
    props.clientFormData.profilePhoto.length > 0
  ) {
    return `${pathImage}${props.clientFormData.profilePhoto[0]}`;
  }
  return null;
});

const galleryPhotosPreview = computed(() => {
  return props.clientFormData.galleryPhotos.map((photo) =>
    typeof photo === "string"
      ? `${pathImage}${photo}`
      : URL.createObjectURL(photo)
  );
});

const closeModal = () => {
  closeModalWithoutValidation();
  emit("update:modelValue", false);
};

const updateShow = (value: boolean) => {
  if (value) {
    profilePhotoPreview.value = null;
  }
  emit("update:modelValue", value);
};

const saveClient = () => {
  if (currentTab.value === "client") {
    currentTab.value = "images";
  } else {
    emit("save-client");
  }
};

const nextTab = () => {
  if (currentTab.value === "client") {
    return "Siguiente";
  } else {
    return props.isEditing ? "Guardar" : "Crear";
  }
};

const previousTab = () => {
  if (currentTab.value === "images") {
    currentTab.value = "client";
  } else {
    closeModal();
  }
};

const previousTabLabel = () => {
  if (currentTab.value === "images") {
    return "Atras";
  } else {
    return "Cancelar";
  }
};

const getErrorMessage = (errors: any, field: any) => {
  if (errors.required) {
    return `${field} es requerido`;
  }
  return "";
};

const openFileBrowser = (refName: string) => {
  if (refName === "profilePhotoInput" && profilePhotoInput.value) {
    profilePhotoInput.value.click();
  } else if (refName === "galleryPhotosInput" && galleryPhotosInput.value) {
    galleryPhotosInput.value.click();
  }
};

const handleProfilePhotoChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const file = input.files[0];
    props.clientFormData.profilePhoto = [file];
    const reader = new FileReader();
    reader.onload = (e) => {
      profilePhotoPreview.value = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
};

const handleGalleryPhotosChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files) {
    const files = Array.from(input.files).slice(0, 3);
    galleryPhotosPreview.value.length = 0;
    props.clientFormData.galleryPhotos = files;
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        galleryPhotosPreview.value.push(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    });
    input.value = "";
  }
};

const clearProfilePhoto = () => {
  props.clientFormData.profilePhoto = null;
  profilePhotoPreview.value = null;
};

const removeGalleryPhoto = (index: number) => {
  props.clientFormData.galleryPhotos.splice(index, 1);
  galleryPhotosPreview.value.splice(index, 1);
  if (galleryPhotosPreview.value.length === 0 && galleryPhotosInput.value) {
    galleryPhotosInput.value.value = "";
  } else if (carouselIndex.value >= galleryPhotosPreview.value.length) {
    carouselIndex.value = galleryPhotosPreview.value.length - 1;
  }
};

const updateClientGeolocation = (location: any) => {
  props.clientFormData.geolocation = {
    latitude: location.lat,
    longitude: location.lng,
  };
};

watch(
  () => props.clientFormData.geolocation,
  (newVal) => {
    if (newVal && newVal.latitude && newVal.longitude) {
      clientGeolocation.value = {
        latitude: newVal.latitude,
        longitude: newVal.longitude,
      };
    }
  },
  { immediate: true }
);

onMounted(async () => {
  // if (
  //   props.clientFormData.geolocation.latitude &&
  //   props.clientFormData.geolocation.longitude
  // ) {
  //   setClientLocation({
  //     lat: parseFloat(props.clientFormData.geolocation.latitude.toString()),
  //     lng: parseFloat(props.clientFormData.geolocation.longitude.toString()),
  //   });
  // }
});

watch(
  () => props.isEditing,
  (newVal) => {
    // if (
    //   newVal &&
    //   props.clientFormData.geolocation.latitude &&
    //   props.clientFormData.geolocation.longitude
    // ) {
    //   setClientLocation({
    //     lat: parseFloat(props.clientFormData.geolocation.latitude.toString()),
    //     lng: parseFloat(props.clientFormData.geolocation.longitude.toString()),
    //   });
    // }
  }
);
</script>

<style lang="scss" scoped>
.btn-delete {
  position: absolute;
  z-index: 1000;
  right: 5px;
  top: 0px;
}

.hg-photo {
  height: 400px;
}
</style>
