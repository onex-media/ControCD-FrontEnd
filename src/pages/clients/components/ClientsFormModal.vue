<template>
  <q-dialog :model-value="modelValue" persistent @update:model-value="updateShow">
    <q-card class="credit-card">
      <div class="sticky-tabs">
        <q-card-section class="justify-between items-center">
          <div class="flex justify-between items-center">
            <h3 class="credit-card__title">
              {{ isEditing ? "Editar cliente" : "Nuevo cliente" }}
            </h3>
            <q-btn flat round dense icon="close" @click="closeModal" />
          </div>
          <!--   <div>
          <p class="client-card__description">
            Estás a punto de crear un nuevo cliente. Al hacerlo, el cliente tendrá acceso a las
            funcionalidades y beneficios de la ruta, incluyendo acceso a
            Créditos y Otras funcionalidades.
          </p>
        </div> -->
        </q-card-section>
        <div style="overflow-x: auto">
          <q-tabs
            v-model="currentTab"
            dense
            class="text-grey"
            active-color="primary"
            indicator-color="primary"
            align="justify"
            no-caps
            narrow-indicator
            
          >
            <q-tab name="client" label="Deudor"  />
            <q-tab name="guarantor" label="Fiador" :disable="!clientTabInvalid" />
            <q-tab name="credit" label="Crédito" :disable="!guarantorTabInvalid" />
            <q-tab name="images" label="Imágenes" :disable="!creditTabInvalid" />
          </q-tabs>
        </div>
      </div>

      <q-card-section class="q-pt-none">
        <q-tab-panels v-model="currentTab" animated class="q-mt-lg">
          <q-tab-panel name="client">
            <div class="row" ref="clientForm">
              <div class="col-12 flex justify-center items-center q-mb-md">
                <div class="col-12 flex justify-center">
                  <div class="avatar-container relative-position">
                    <q-avatar size="100px">
                      <img :src="profilePhotoSrc || '/default.png'" />
                    </q-avatar>
                    <div class="avatar-overlay flex justify-end items-end">
                      <div class="button-group q-pa-xs">
                        <q-btn round dense unelevated padding="5px" icon="photo_camera" color="primary" class="q-mx-xs"
                          @click.stop="openFileBrowser('profilePhotoInput')" />
                        <q-btn round dense padding="5px" v-if="profilePhotoSrc" unelevated icon="close" color="red"
                          class="q-mx-xs" @click.stop="clearProfilePhoto" />
                      </div>
                    </div>
                  </div>
                </div>
                <input type="file" ref="profilePhotoInput" accept="image/*" style="display: none" class="q-mx-xs"
                  @change="handleProfilePhotoChange" />
              </div>
              <div class="col-12">
                <div class="row q-col-gutter-sm">
                  <div class="col-12 col-md-6">
                    <label>
                      Documento
                      <span class="text-red-500" v-if="!isEditing">*</span>
                    </label>
                    <q-input
                      v-model="clientFormData.dni"
                      ref="dniInput"
                      outlined
                      dense
                      class="mt-1"
                      placeholder="Ingrese el documento"
                      :rules="[
                        (val) => !!val || 'Documento requerido',
                        (val) =>
                          /^[0-9]+$/.test(val) || 'Solo números permitidos',
                      ]">
                      <template v-slot:prepend>
                        <q-icon name="badge" size="20px" />
                      </template>
                    </q-input>
                  </div>
                  <div class="col-12 col-md-6">
                    <label>
                      Nombre
                      <span class="text-red-500" v-if="!isEditing">*</span>
                    </label>
                    <q-input
                      v-model="clientFormData.name"
                      ref="nameInput"
                      outlined
                      dense
                      maxlength="25"
                      class="mt-1"
                      placeholder="Ingrese el nombre"
                      :rules="[
                        (val) => !!val || 'Campo requerido',
                        (val) => val.length <= 45 || 'Máximo 45 caracteres',
                        (val) =>
                          /^[a-zA-Z ]+$/.test(val) ||
                          'Solo letras y espacios permitidos',
                      ]">
                      <template v-slot:prepend>
                        <q-icon name="person" size="20px" />
                      </template>
                    </q-input>
                  </div>

                  <div class="col-12 col-md-6">
                    <label>
                      Dirección de cobro
                      <span class="text-red-500" v-if="!isEditing">*</span>
                    </label>
                    <q-input
                      v-model="clientFormData.address"
                      ref="addressInput"
                      outlined
                      dense
                      class="mt-1"
                      placeholder="Haga clic para seleccionar en el mapa"
                      :rules="[
                        (val) => !!val || 'Dirección de cobro requerida',
                      ]" @click="openMapDialog">
                      <template v-slot:prepend>
                        <q-icon name="place" class="cursor-pointer" size="20px" @click.stop="openMapDialog" />
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
                      ref="phoneInput"
                      outlined
                      dense
                      class="mt-1"
                      placeholder="Ingrese el teléfono"
                      :rules="[
                        (val) => !!val || 'Teléfono requerido',
                        (val) =>
                          /^[0-9]+$/.test(val) || 'Solo números permitidos',
                        (val) => val.length <= 13 || 'Máximo 13 caracteres',
                      ]">
                      <template v-slot:prepend>
                        <q-icon name="phone" size="20px" />
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
                      ref="emailInput"
                      outlined
                      dense
                      type="email"
                      class="mt-1"
                      placeholder="Ingrese el correo"
                      :rules="[
                        (val) => !!val || 'Email requerido',
                        (val) => /.+@.+\..+/.test(val) || 'Email inválido',
                      ]">
                      <template v-slot:prepend>
                        <q-icon name="mail" size="20px" />
                      </template>
                    </q-input>
                  </div>
                  <div class="col-12">
                    <label>
                      Nombre de la empresa
                      <span class="text-red-500" v-if="!isEditing">*</span>
                    </label>
                    <q-input
                      v-model="clientFormData.companyName"
                      ref="companyNameInput"
                      outlined
                      dense
                      class="mt-1"
                      placeholder="Ingrese el nombre de la empresa"
                      :rules="[
                        (val) => !!val || 'Nombre de la empresa requerido',
                        (val) => val.length <= 45 || 'Máximo 45 caracteres',
                      ]">
                      <template v-slot:prepend>
                        <q-icon name="business" size="20px" />
                      </template>
                    </q-input>
                  </div>
                </div>
              </div>
            </div>
          </q-tab-panel>

          <q-tab-panel name="guarantor">
            <div class="row">
              <div class="col-12">
                <div class="row q-col-gutter-sm">
                  <div class="col-12 col-md-6">
                    <label>
                      Documento del fiador
                      <span class="text-red-500" v-if="!isEditing">*</span>
                    </label>
                    <q-input v-model="clientFormData.guarantorDni" outlined dense class="mt-1"
                      placeholder="Ingrese el documento del fiador" :rules="[
                        (val) => !!val || 'Documento del fiador requerido',
                        (val) =>
                          /^[0-9]+$/.test(val) || 'Solo números permitidos',
                      ]">
                      <template v-slot:prepend>
                        <q-icon name="badge" size="20px" />
                      </template>
                    </q-input>
                  </div>
                  <div class="col-12 col-md-6">
                    <label>
                      Nombre del fiador
                      <span class="text-red-500" v-if="!isEditing">*</span>
                    </label>
                    <q-input v-model="clientFormData.guarantorName" outlined dense maxlength="25" class="mt-1"
                      placeholder="Ingrese el nombre del fiador" :rules="[
                        (val) => !!val || 'Nombre del fiador requerido',
                        (val) => val.length <= 45 || 'Máximo 45 caracteres',
                        (val) =>
                          /^[a-zA-Z ]+$/.test(val) ||
                          'Solo letras y espacios permitidos',
                      ]">
                      <template v-slot:prepend>
                        <q-icon name="person" size="20px" />
                      </template>
                    </q-input>
                  </div>

                  <div class="col-12 col-md-6">
                    <label>
                      Teléfono
                      <span class="text-red-500" v-if="!isEditing">*</span>
                    </label>
                    <q-input v-model="clientFormData.guarantorPhone" outlined dense class="mt-1"
                      placeholder="Ingrese el teléfono" :rules="[
                        (val) => !!val || 'Teléfono del fiador requerido',
                        (val) =>
                          /^[0-9]+$/.test(val) || 'Solo números permitidos',
                        (val) => val.length <= 13 || 'Máximo 13 caracteres',
                      ]">
                      <template v-slot:prepend>
                        <q-icon name="phone" size="20px" />
                      </template>
                    </q-input>
                  </div>
                  <div class="col-12 col-md-6">
                    <label>
                      Dirección
                      <span class="text-red-500" v-if="!isEditing">*</span>
                    </label>
                    <q-input v-model="clientFormData.guarantorAddress" outlined dense class="mt-1"
                      placeholder="Ingrese la dirección del fiador" :rules="[
                        (val) => !!val || 'Dirección del fiador requerida',
                        (val) => val.length <= 45 || 'Máximo 45 caracteres',
                      ]">
                      <template v-slot:prepend>
                        <q-icon name="location_on" size="20px" />
                      </template>
                    </q-input>
                  </div>
                </div>
              </div>
            </div>
          </q-tab-panel>
          <q-tab-panel name="credit">
            <div class="row">
              <div class="col-12">
                <div class="row q-col-gutter-sm">
                  <div class="col-12 col-md-6">
                    <label>Valor del crédito
                      <span class="text-red-500">*</span></label>
                    <q-input v-model="clientFormData.creditValue" outlined dense type="number" class="mt-1"
                      placeholder="Ingrese el valor" :rules="[
                        (val) => !!val || 'Valor requerido',
                        (val) =>
                          /^[0-9]+$/.test(val) || 'Solo números permitidos',
                      ]" @update:model-value="calculateInstallmentValue">
                      <template v-slot:prepend>
                        <q-icon name="attach_money" size="20px" />
                      </template>
                    </q-input>
                  </div>

                  <div class="col-12 col-md-6">
                    <label>Tasa de interés (%)
                      <span class="text-red-500">*</span></label>
                    <q-input v-model="clientFormData.interestRate" outlined dense type="number" class="mt-1"
                      placeholder="Ingrese la tasa" :rules="[
                        (val) => !!val || 'Tasa requerida',
                        (val) => val <= 100 || 'Máximo 100%',
                      ]" @update:model-value="calculateInstallmentValue">
                      <template v-slot:prepend>
                        <q-icon name="percent" size="20px" />
                      </template>
                    </q-input>
                  </div>

                  <div class="col-12 col-md-6">
                    <label>Cantidad de cuotas
                      <span class="text-red-500">*</span></label>
                    <q-input v-model="clientFormData.installmentCount" outlined dense type="number" class="mt-1"
                      placeholder="Número de cuotas" :rules="[
                        (val) => !!val || 'Cuotas requeridas',
                        (val) =>
                          /^[0-9]+$/.test(val) || 'Solo números permitidos',
                      ]" @update:model-value="calculateInstallmentValue">
                      <template v-slot:prepend>
                        <q-icon name="list_alt" size="20px" />
                      </template>
                    </q-input>
                  </div>
                  <div class="col-12 col-md-6">
                    <label>Valor de la cuota
                      <span class="text-red-500">*</span></label>
                    <q-input :model-value="installmentValue" outlined dense type="number" class="mt-1" disable
                      placeholder="Valor de la cuota" :rules="[
                        (val) => !!val || 'Valor requerido',
                        (val) =>
                          /^[0-9]+$/.test(val) || 'Solo números permitidos',
                      ]">
                      <template v-slot:prepend>
                        <q-icon name="list_alt" size="20px" />
                      </template>
                    </q-input>
                  </div>
                  <div class="col-12 col-md-6">
                    <label>Frecuencia de pago
                      <span class="text-red-500">*</span></label>
                    <q-select v-model="clientFormData.paymentFrequency" :options="paymentFrequencyOptions" outlined
                      dense class="mt-1" placeholder="Seleccione frecuencia"
                      :rules="[(val) => !!val || 'Frecuencia requerida']">
                      <template v-slot:prepend>
                        <q-icon name="repeat" size="20px" />
                      </template>
                    </q-select>
                  </div>

                  <div
                    class="col-12"
                    v-if="clientFormData.paymentFrequency === 'Diaria'"
                  >
                    <label>
                      Excepto los días
                      <span class="text-red-500">*</span>
                    </label>

                    <div class="q-gutter-sm q-mt-sm q-px-sm">
                      <q-chip
                        v-for="day in weekDays"
                        :key="day"
                        clickable
                        :color="
                          clientFormData.excludedDays?.includes(day)
                            ? 'primary'
                            : 'grey-5'
                        "
                        text-color="white"
                        @click="toggleExcludedDay(day)"
                        class="q-pa-xs flex justify-center items-center"
                        style="
                          min-width: 75px;
                          height: 30px;
                          padding: 0;
                          line-height: normal;
                        ">
                        <span style="
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            width: 100%;
                            font-size: 12px;
                          ">
                          {{ day }}
                        </span>
                      </q-chip>
                    </div>
                  </div>
                  <div class="col-12">
                    <hr />
                  </div>

                  <div class="col-12">
                    <q-expansion-item v-model="microInsuranceExpanded" header-class=" custom-expansion-header"
                      label="Microseguros" dense expand-icon-class="text-primary">
                      <div class="row q-col-gutter-sm q-mt-sm">
                        <div class="col-12 col-md-6">
                          <label>Porcentaje de microseguro</label>
                          <q-input v-model="clientFormData.microInsurancePercentage" outlined dense type="number"
                            class="mt-1" placeholder="0-100%" min="0" max="100" :rules="[
                              (val) =>
                                /^[0-9]+$/.test(val) ||
                                'Solo números permitidos',
                              (val) => val <= 100 || 'Máximo 100%',
                            ]">
                            <template v-slot:prepend>
                              <q-icon name="percent" size="20px" />
                            </template>
                          </q-input>
                        </div>
                        <div class="col-12 col-md-6">
                          <label>Monto de microseguro</label>
                          <q-input v-model="microInsuranceAmountCalculated" outlined dense type="number" class="mt-1"
                            placeholder="Monto" disable>
                            <template v-slot:prepend>
                              <q-icon name="attach_money" size="20px" />
                            </template>
                          </q-input>
                        </div>
                      </div>
                    </q-expansion-item>
                  </div>

                  <div class="col-12 col-md-6 q-mt-lg">
                    <q-checkbox :model-value="advancedPayment" @update:model-value="toggleAdvancedPayment" />
                    <label class="text-caption"> Pago adelantado </label>
                  </div>

                  <!--     <div  class=" col-12 col-md-6">
                    <label>
                      Fecha primera cuota
                      <span class="text-red-500">*</span>
                    </label>
                    <q-input
                      :model-value="firstInstallmentDate"
                      outlined
                      dense
                      class="mt-1"
                      placeholder="Seleccione fecha"
                      disabled
                      :rules="[(val) => !!val || 'Fecha requerida']"
                    >
                      <template v-slot:prepend>
                        <q-icon name="event" />
                      </template>
                    </q-input>
                  </div> -->
                </div>
              </div>
            </div>
          </q-tab-panel>
          <q-tab-panel name="images">
            <div class="row flex items-center q-col-gutter-sm mb-5">
              <input
                type="file"
                ref="galleryPhotoInput1"
                accept="image/*"
                style="display: none"
                @change="(event) => handleGalleryPhotoChange(event, 0)"
              />
              <input
                type="file"
                ref="galleryPhotoInput2"
                accept="image/*"
                style="display: none"
                @change="(event) => handleGalleryPhotoChange(event, 1)"
              />
              <input
                type="file"
                ref="galleryPhotoInput3"
                accept="image/*"
                style="display: none"
                @change="(event) => handleGalleryPhotoChange(event, 2)"
              />

              <!-- Nueva interfaz para subida de imágenes -->
              <div class="col-12">
                <div class="row q-col-gutter-sm q-mb-md justify-center">
                  <div
                    v-for="(item, index) in galleryItems"
                    :key="index"
                    class="column items-center q-pa-sm"
                  >
                    <div class="q-mb-xs">{{ item.label }}</div>
                    <div
                      class="upload-container"
                      @click="openFileBrowser(item.ref)"
                      style="position: relative"
                    >
                      <template v-if="galleryPhotosPreview[index]">
                        <q-img
                          :src="galleryPhotosPreview[index]"
                          class="upload-preview"
                        />
                        <q-btn
                          class="btn-delete"
                          size="sm"
                          color="red"
                          round
                          dense
                          icon="close"
                          @click.stop="removeGalleryPhoto(index)"
                          style="position: absolute; top: 5px; right: 5px"
                        />
                      </template>

                      <div v-else class="upload-area flex flex-center column">
                        <q-img
                          src="/icons/archivo.png"
                          class="svg-white"
                          width="50px"
                        />
                        <div class="text-weight-medium q-mt-sm">
                          SELECCIONAR ARCHIVO
                        </div>
                        <div class="text-caption text-grey-7 q-mt-xs">
                          JPG, PNG - Máx. 2 MB
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </q-tab-panel>
        </q-tab-panels>
        <div class="sticky-buttons">
          <div v-if="!q.screen.lt.md" class="row q-col-gutter-sm mr-4">
            <div class="col-12 flex justify-end">
              <q-btn
                unelevated
                no-caps
                :label="nextTab()"
                color="primary"
                @click="saveClient"
                class="mr-2"
              />
              <q-btn
                unelevated
                no-caps
                :label="previousTabLabel()"
                color="grey-3"
                text-color="primary"
                @click="previousTab"
              />
            </div>
          </div>
          <div v-else class="row q-col-gutter-sm q-pa-md">
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
            <div class="col-12 col-md-6">
              <q-btn
                unelevated
                no-caps
                :label="previousTabLabel()"
                color="grey-3"
                text-color="primary"
                class="full-width"
                @click="previousTab"
              />
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>

  <q-dialog v-model="showMapDialog" persistent>
    <q-card style="width: 90vw; max-width: 400px; height: auto; max-height: 80vh">
      <q-card-section class="flex justify-between items-center">
        <h6>Seleccione la dirección de cobro en el mapa</h6>
        <q-btn flat round dense icon="close" @click="showMapDialog = false" />
      </q-card-section>
      <q-card-section class="q-pt-none" style="height: calc(100% - 100px)">
        <Map ref="mapRef" :geolocation="addressGeolocation" :isEditing="true"
          @location-selected="updateAddressLocation" />
      </q-card-section>
      <q-card-actions align="right">
        <q-btn unelevated label="Confirmar" color="primary" no-caps @click="confirmAddressSelection" v-close-popup />
        <q-btn flat label="Cancelar" color="grey-7" no-caps v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, watch } from "vue";
import { useClients } from "src/composables/useClients";
import { CreateClientPayload } from "src/types/clients.types";
import Map from "src/components/Map.vue";
import { pathImage } from "src/boot/axios";
import { useMap } from "src/composables/useMap";
import { useQuasar } from "quasar";

const q = useQuasar();
const { setMarker } = useMap();
const { rules, closeModalWithoutValidation } = useClients();
const emit = defineEmits(["update:modelValue", "save-client", "close-modal"]);
const clientForm = ref<any>(null);

const clientTabInvalid = ref(false);
const guarantorTabInvalid = ref(false);
const creditTabInvalid = ref(false);


const props = defineProps({
  modelValue: Boolean,
  isEditing: Boolean,
  clientFormData: {
    type: Object as () => CreateClientPayload,
    required: true,
  },
});

const currentTab = ref("client");
const profilePhotoInput = ref<HTMLInputElement | null>(null);
const galleryPhotosInput = ref<HTMLInputElement | null>(null);
const profilePhotoPreview = ref<string | null>(null);
const carouselIndex = ref(0);
const mapRef = ref<any>(null);
const microInsuranceExpanded = ref(false);
const advancedPayment = ref(false);
const installmentValue = ref(0);

const galleryPhotoInput1 = ref<HTMLInputElement | null>(null);
const galleryPhotoInput2 = ref<HTMLInputElement | null>(null);
const galleryPhotoInput3 = ref<HTMLInputElement | null>(null);

const galleryPhotosPreview = ref<(string | null)[]>([null, null, null]);

const galleryItems = ref([
  { label: "Documento", ref: "galleryPhotoInput1" },
  { label: "Foto Empresa", ref: "galleryPhotoInput2" },
  { label: "Cliente Dinero en mano", ref: "galleryPhotoInput3" },
]);

const dniInput = ref<any>(null);
const nameInput = ref<any>(null);
const addressInput = ref<any>(null);
const phoneInput = ref<any>(null);
const emailInput = ref<any>(null);
const companyNameInput = ref<any>(null);

const validateClientTab = async () => {
  const validations = await Promise.all([
    dniInput.value?.validate(),
    nameInput.value?.validate(),
    addressInput.value?.validate(),
    phoneInput.value?.validate(),
    emailInput.value?.validate(),
    companyNameInput.value?.validate(),
  ]);
  

  return validations.every((valid) => valid === true);
};

const microInsuranceAmountCalculated = computed(() => {
  const amount = Number(props.clientFormData.microInsurancePercentage) || 0;
  const credit = Number(props.clientFormData.creditValue) || 0;
  return (amount * credit) / 100;
});

interface Geolocation {
  latitude: number | null;
  longitude: number | null;
}

const showMapDialog = ref(false);
const addressGeolocation = ref<Geolocation>({
  latitude: null,
  longitude: null,
});

const validateGuarantor = () => {
  const guarantorFields = [
    props.clientFormData.guarantorDni,
    props.clientFormData.guarantorName,
    props.clientFormData.guarantorPhone,
    props.clientFormData.guarantorAddress,
  ];

  const isAnyFilled = guarantorFields.some(
    (field) => field && field.trim() !== "",
  );
  const areAllFilled = guarantorFields.every(
    (field) => field && field.trim() !== "",
  );

  if (isAnyFilled && !areAllFilled) {
    return false;
  }

  return true;
};

const validateCredit = () => {
  const creditFields = [
    props.clientFormData.creditValue,
    props.clientFormData.interestRate,
    props.clientFormData.installmentCount,
    props.clientFormData.paymentFrequency,
  ];

  const isAnyFilled = creditFields.some(
    (field) => field !== null && field !== undefined && field !== "",
  );
  const areAllFilled = creditFields.every(
    (field) => field !== null && field !== undefined && field !== "",
  );

  if (isAnyFilled && !areAllFilled) {
    return false;
  }

  return true;
};

const toggleExcludedDay = (day: string) => {
  const days = Array.isArray(props.clientFormData.excludedDays)
    ? [...props.clientFormData.excludedDays]
    : [];
  const index = days.indexOf(day);

  index === -1 ? days.push(day) : days.splice(index, 1);
  props.clientFormData.excludedDays = days;
};

const toggleAdvancedPayment = (value: boolean) => {
  advancedPayment.value = value;
  props.clientFormData.firstInstallmentDate = firstInstallmentDate.value;
};

const paymentFrequencyOptions = ref([
  "Diaria",
  "Semanal",
  "Quincenal",
  "Mensual",
]);

const weekDays = ref([
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
  "Domingo",
]);

const microInsuranceAmount = computed(() => {
  console.log(
    "props.clientFormData.microInsurancePercentage",
    props.clientFormData.microInsurancePercentage,
  );
  console.log(
    "props.clientFormData.creditValue",
    props.clientFormData.creditValue,
  );
  console.log(
    ((props.clientFormData.creditValue ?? 0) *
      (props.clientFormData.microInsurancePercentage ?? 0)) /
    100,
  );
  const creditValue = parseFloat(props.clientFormData.creditValue as any) || 0;
  const percentage =
    parseFloat(props.clientFormData.microInsurancePercentage as any) || 0;
  return creditValue * percentage;
});

console.log("microInsuranceAmount", microInsuranceAmount.value);

const calculateInstallmentValue = () => {
  const { creditValue, interestRate, installmentCount } = props.clientFormData;

  if (!creditValue || !interestRate || !installmentCount) {
    installmentValue.value = 0;
    return;
  }

  const totalWithInterest = +creditValue * (1 + +interestRate / 100);
  installmentValue.value = totalWithInterest / +installmentCount;
};

watch(
  microInsuranceAmount,
  (newValue) => {
    console.log("Nuevo valor de microseguro:", newValue);
    props.clientFormData.microInsuranceAmount = newValue;
  },
  { immediate: true },
);

watch(
  [
    () => props.clientFormData.creditValue,
    () => props.clientFormData.interestRate,
    () => props.clientFormData.installmentCount,
  ],
  calculateInstallmentValue,
);

const firstInstallmentDate = computed(() => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const formatDate = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  return advancedPayment.value ? formatDate(today) : formatDate(tomorrow);
});

const updatePaymentDate = (isAdvanced: boolean) => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const formatDate = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  if (isAdvanced) {
    props.clientFormData.firstInstallmentDate = formatDate(today);
  } else {
    props.clientFormData.firstInstallmentDate = formatDate(yesterday);
  }
};

const handleGalleryPhotoChange = (event: Event, index: number) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const file = input.files[0];

    if (file.size > 10 * 1024 * 1024) {
      alert("El archivo excede 10 MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      galleryPhotosPreview.value[index] = e.target?.result as string;
    };
    reader.readAsDataURL(file);

    if (!props.clientFormData.galleryPhotos) {
      props.clientFormData.galleryPhotos = [];
    }
    props.clientFormData.galleryPhotos[index] = file;
  }
  input.value = "";
};

onMounted(() => {
  if (!props.clientFormData.firstInstallmentDate) {
    updatePaymentDate(advancedPayment.value);
  }
});

const openMapDialog = () => {
  if (
    props.clientFormData.geolocation?.latitude &&
    props.clientFormData.geolocation?.longitude
  ) {
    addressGeolocation.value = {
      latitude: props.clientFormData.geolocation.latitude,
      longitude: props.clientFormData.geolocation.longitude,
    };
  }
  showMapDialog.value = true;
};

const updateAddressLocation = (location: any) => {
  addressGeolocation.value = {
    latitude: location.lat,
    longitude: location.lng,
  };
};

const confirmAddressSelection = async () => {
  if (addressGeolocation.value.latitude && addressGeolocation.value.longitude) {
    // Update main form geolocation
    props.clientFormData.geolocation = {
      latitude: addressGeolocation.value.latitude,
      longitude: addressGeolocation.value.longitude,
    };

    try {
      const address = await reverseGeocode(
        addressGeolocation.value.latitude,
        addressGeolocation.value.longitude,
      );
      props.clientFormData.address = address;
    } catch (error) {
      console.error("Error obteniendo dirección:", error);
      props.clientFormData.address = "Dirección seleccionada";
    }
  }
};

const reverseGeocode = (lat: number, lng: number): Promise<string> => {
  return new Promise((resolve, reject) => {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (data.display_name) {
          resolve(data.display_name);
        } else {
          reject("No se encontró dirección");
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};

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

const isCreditComplete = computed(() => {
  return (
    props.clientFormData.creditValue &&
    props.clientFormData.interestRate &&
    props.clientFormData.installmentCount &&
    props.clientFormData.paymentFrequency
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

const saveClient = async () => {
  if (currentTab.value === "client") {
    const isValid = await validateClientTab();

    if (!isValid) {
      q.notify({
        type: "negative",
        message: "Por favor complete todos los campos obligatorios",
        position: "bottom",
      });
      clientTabInvalid.value = false
      return;
    }
    clientTabInvalid.value = true;
    currentTab.value = "guarantor";
  } else if (currentTab.value === "guarantor") {
    const isValid = await validateGuarantor();

    if (!isValid) {
      q.notify({
        type: "negative",
        message:
          "Por favor complete todos los campos obligatorios del fiador o deje todos vacíos",
        position: "bottom",
      });
      guarantorTabInvalid.value = false
      return;
    }
    guarantorTabInvalid.value = true;
    currentTab.value = "credit";
  } else if (currentTab.value === "credit") {
    const isValid = await validateCredit();

    if (!isValid) {
      q.notify({
        type: "negative",
        message:
          "Por favor complete todos los campos obligatorios del crédito o deje todos vacíos",
        position: "bottom",
      });
      creditTabInvalid.value = false
      return;
    }
    creditTabInvalid.value = true;
    currentTab.value = "images";
  } else {
    emit("save-client");
  }
};

const nextTab = () => {
  if (currentTab.value === "client") {
    return "Siguiente";
  } else if (currentTab.value === "guarantor") {
    return "Siguiente";
  } else if (currentTab.value === "credit") {
    return "Siguiente";
  } else {
    return props.isEditing ? "Guardar" : "Crear";
  }
};

const previousTab = () => {
  if (currentTab.value === "credit") {
    currentTab.value = "guarantor";
  } else if (currentTab.value === "guarantor") {
    currentTab.value = "client";
  } else if (currentTab.value === "images") {
    currentTab.value = "credit";
  } else {
    closeModal();
  }
};

const previousTabLabel = () => {
  if (currentTab.value === "client") {
    return "Cancelar";
  } else {
    return "Atras";
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
  } else if (refName === "galleryPhotoInput1" && galleryPhotoInput1.value) {
    galleryPhotoInput1.value.click();
  } else if (refName === "galleryPhotoInput2" && galleryPhotoInput2.value) {
    galleryPhotoInput2.value.click();
  } else if (refName === "galleryPhotoInput3" && galleryPhotoInput3.value) {
    galleryPhotoInput3.value.click();
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

const removeImage = (index: number) => {
  props.clientFormData.attachedImages.splice(index, 1);
};

const removeGalleryPhoto = (index: number) => {
  galleryPhotosPreview.value[index] = null;

  if (props.clientFormData.galleryPhotos) {
    props.clientFormData.galleryPhotos[index] = null;
  }

  // Limpiar input específico
  if (index === 0 && galleryPhotoInput1.value) {
    galleryPhotoInput1.value.value = "";
  } else if (index === 1 && galleryPhotoInput2.value) {
    galleryPhotoInput2.value.value = "";
  } else if (index === 2 && galleryPhotoInput3.value) {
    galleryPhotoInput3.value.value = "";
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
  { immediate: true },
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
    position: absolute;
    opacity: 1;
    background-color: rgba(0, 0, 0, 0.3);
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 50%;
    transition: opacity 0.3s ease;
    display: flex;

    .button-group {
      position: absolute;
      bottom: 5px;
      right: 5px;
      display: flex;
    }
  }

  &:hover .avatar-overlay {
    opacity: 1;
  }
}

.sticky-tabs {
  position: sticky;
  top: 0;
  z-index: 100;
  background: white;
  /*   border-bottom: 1px solid #e0e0e0; */
  padding-top: 8px;
  padding-bottom: 8px;
}

.sticky-buttons {
  position: sticky;
  bottom: 0;
  z-index: 100;
  background: white;
  /* border-top: 1px solid #e0e0e0; */
  padding-top: 12px;
  padding-bottom: 15px;
}

.q-tab-panels {
  max-height: calc(100vh - 200px);
  overflow-y: auto;
}

.credit-card {
  width: 100%;
  max-width: 600px;

  &__title {
    font-size: 24px;
    line-height: 125%;
    color: #000;
    font-weight: 500;
  }

  .q-separator {
    border-color: rgba(0, 0, 0, 0.08);
  }
}

.btn-delete {
  position: absolute;
  z-index: 1000;
  right: 5px;
  top: 0px;
}

.hg-photo {
  height: 400px;
}

.custom-upload-btn {
  width: 150px;
  height: 150px;
  font-size: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.q-item {
  min-height: 48px;
  padding: 8px 0px !important;
  color: inherit;
  transition:
    color 0.3s,
    background-color 0.3s;
}

.custom-expansion-header {
  padding: 0 !important;
}

.upload-area {
  border: 2px dashed #ccc;
  border-radius: 8px;
  width: 200px;
  height: 150px;
  cursor: pointer;
  transition: all 0.3s;
}

.upload-area:hover {
  border-color: #1976d2;
  background-color: #f5f9ff;
}

.upload-preview {
  width: 200px;
  height: 150px;
  border-radius: 8px;
  border: 1px solid #eee;
  cursor: pointer;
}

.btn-delete {
  margin-top: -12px;
  margin-right: -12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

:deep(.custom-expansion-header) {
  padding: 0 !important;
}

:deep(.q-field--dense .q-field__control, .q-field--dense .q-field__marginal) {
  height: 30px !important;
}

:deep(
  .q-field--auto-height.q-field--dense .q-field__control,
  .q-field--auto-height.q-field--dense .q-field__native
) {
  min-height: 30px !important;
}
:deep(.q-field--dense) {
  .q-field__control {
    height: 30px !important;
    min-height: 30px !important;
  }

  .q-field__control-container {
    padding-top: 0 !important;
    padding-bottom: 0 !important;
    height: 100% !important;
  }

  .q-field__prepend,
  .q-field__append {
    height: 100% !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    padding-top: 0 !important;
    padding-bottom: 0 !important;
  }

  .q-icon {
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    transform: none !important;
    top: 0 !important;
    font-size: 18px;
  }
}

:deep(.q-field--dense .q-field__append .q-icon) {
  position: relative !important;
  transform: translateY(0) !important;
}

:deep(.q-field__messages) {
  line-height: 1.2 !important;
  min-height: 18px !important;
  padding-top: 2px !important;
}

:deep(.q-field--dense .q-select) {
  .q-field__control {
    height: 30px !important;
  }

  .q-field__inner {
    min-height: 100% !important;
    display: flex !important;
    align-items: center !important;
  }

  .q-field__control-container {
    height: 100% !important;
    min-height: 30px !important;
    padding-top: 0 !important;
    padding-bottom: 0 !important;
    display: flex !important;
    align-items: center !important;
  }

  .q-field__native {
    min-height: 100% !important;
    padding: 0 !important;
    display: flex !important;
    align-items: center !important;
    margin-top: 0 !important;
    line-height: 1 !important;
  }

  .q-field__input {
    padding: 0 !important;
    top: 0 !important;
    min-height: 100% !important;
    display: flex !important;
    align-items: center !important;
  }

  .q-field__native > span {
    display: flex !important;
    align-items: center !important;
    height: 100% !important;
    min-height: 30px !important;
    padding: 0 !important;
    line-height: 1 !important;
    transform: none !important;
    margin-top: 0 !important;
  }

  .q-field__prepend {
    height: 100% !important;
    min-height: 33px !important;
    padding-top: 0 !important;
    padding-bottom: 0 !important;
    display: flex !important;
    align-items: center !important;

    .q-icon {
      margin: 0 !important;
      top: 0 !important;
      transform: none !important;
    }
  }

  .q-field__append {
    height: 100% !important;
    min-height: 30px !important;
    padding-top: 0 !important;
    padding-bottom: 0 !important;
    display: flex !important;
    align-items: center !important;

    .q-icon {
      margin: 0 !important;
      top: 0 !important;
      transform: none !important;
    }
  }
}

:deep(.q-field--dense .q-select *) {
  transform: none !important;
  top: 0 !important;
  margin-top: 0 !important;
  margin-bottom: 0 !important;
}
</style>
