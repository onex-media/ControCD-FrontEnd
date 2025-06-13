<template>
  <q-dialog
    :model-value="modelValue"
    persistent
    @update:model-value="updateShow"
  >
    <q-card class="client-card">
      <q-card-section class="flex justify-between items-center">
        <h3 class="client-card__title">
          {{ isEditing ? "Editar cliente" : "Nuevo cliente" }}
        </h3>
        <q-btn flat round dense icon="close" @click="closeModal" />
      </q-card-section>

      <q-card-section class="q-pt-none">
        <div style="overflow-x: auto">
          <q-tabs
            v-model="currentTab"
            dense
            class="text-grey"
            active-color="primary"
            indicator-color="primary"
            align="justify"
            narrow-indicator
          >
            <q-tab name="client" label="Deudor" />
            <q-tab name="guarantor" label="Fiador" />
            <q-tab name="credit" label="Crédito" />
            <q-tab name="images" label="Imágenes" />
          </q-tabs>
        </div>

        <q-tab-panels v-model="currentTab" animated class="q-mt-lg">
          <q-tab-panel name="client">
            <div class="row">
              <div class="col-12 flex justify-center items-center q-mb-md">
                <div class="col-12 flex justify-center">
                  <div class="avatar-container relative-position">
                    <q-avatar size="100px">
                      <img :src="profilePhotoSrc || '/default.png'" />
                    </q-avatar>
                    <div
                      class="avatar-overlay flex justify-center items-center"
                    >
                      <q-btn
                        round
                        dense
                        unelevated
                        padding="5px"
                        icon="photo_camera"
                        color="primary"
                        class="q-mx-xs"
                        @click.stop="openFileBrowser('profilePhotoInput')"
                      />
                      <q-btn
                        round
                        dense
                        padding="5px"
                        v-if="profilePhotoSrc"
                        unelevated
                        icon="close"
                        color="red"
                        class="q-mx-xs"
                        @click.stop="clearProfilePhoto"
                      />
                    </div>
                  </div>
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
              <div class="col-12">
                <div class="row q-col-gutter-sm">
                  <div class="col-12 col-md-6">
                    <label>
                      Documento
                      <span class="text-red-500" v-if="!isEditing">*</span>
                    </label>
                    <q-input
                      v-model="clientFormData.dni"
                      outlined
                      dense
                      class="mt-1"
                      placeholder="Ingrese el correo"
                      :rules="[(val) => !!val || 'Documento requerido']"
                    >
                      <template v-slot:prepend>
                        <q-icon name="badge" />
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
                      outlined
                      dense
                      maxlength="25"
                      class="mt-1"
                      placeholder="Ingrese el nombre"
                      :rules="[(val) => !!val || 'Campo requerido']"
                    >
                      <template v-slot:prepend>
                        <q-icon name="person" />
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
                      outlined
                      dense
                      class="mt-1"
                      placeholder="Haga clic para seleccionar en el mapa"
                      readonly
                      @click="openMapDialog"
                    >
                      <template v-slot:prepend>
                        <q-icon
                          name="place"
                          class="cursor-pointer"
                          @click.stop="openMapDialog"
                        />
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
                      :rules="[(val) => !!val || 'Teléfono requerido']"
                    >
                      <template v-slot:prepend>
                        <q-icon name="phone" />
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
                      :rules="[
                        (val) => !!val || 'Email requerido',
                        (val) => /.+@.+\..+/.test(val) || 'Email inválido',
                      ]"
                    >
                      <template v-slot:prepend>
                        <q-icon name="mail" />
                      </template>
                    </q-input>
                  </div>
                  <div class="col-12 col-md-6">
                    <label>
                      Nombre de la empresa
                      <span class="text-red-500" v-if="!isEditing">*</span>
                    </label>
                    <q-input
                      v-model="clientFormData.companyName"
                      outlined
                      dense
                      class="mt-1"
                      placeholder="Ingrese el nombre de la empresa"
                      :rules="[
                        (val) => !!val || 'Nombre de la empresa requerido',
                      ]"
                    >
                      <template v-slot:prepend>
                        <q-icon name="business" />
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
                    <q-input
                      v-model="clientFormData.guarantorDni"
                      outlined
                      dense
                      class="mt-1"
                      placeholder="Ingrese el documento del fiador"
                      :rules="[
                        (val) => !!val || 'Documento del fiador requerido',
                      ]"
                    >
                      <template v-slot:prepend>
                        <q-icon name="badge" />
                      </template>
                    </q-input>
                  </div>
                  <div class="col-12 col-md-6">
                    <label>
                      Nombre del fiador
                      <span class="text-red-500" v-if="!isEditing">*</span>
                    </label>
                    <q-input
                      v-model="clientFormData.guarantorName"
                      outlined
                      dense
                      maxlength="25"
                      class="mt-1"
                      placeholder="Ingrese el nombre del fiador"
                      :rules="[(val) => !!val || 'Nombre del fiador requerido']"
                    >
                      <template v-slot:prepend>
                        <q-icon name="person" />
                      </template>
                    </q-input>
                  </div>

                  <div class="col-12 col-md-6">
                    <label>
                      Teléfono
                      <span class="text-red-500" v-if="!isEditing">*</span>
                    </label>
                    <q-input
                      v-model="clientFormData.guarantorPhone"
                      outlined
                      dense
                      class="mt-1"
                      placeholder="Ingrese el teléfono"
                      :rules="[
                        (val) => !!val || 'Teléfono del fiador requerido',
                      ]"
                    >
                      <template v-slot:prepend>
                        <q-icon name="phone" />
                      </template>
                    </q-input>
                  </div>
                  <div class="col-12 col-md-6">
                    <label>
                      Dirección
                      <span class="text-red-500" v-if="!isEditing">*</span>
                    </label>
                    <q-input
                      v-model="clientFormData.guarantorAddress"
                      outlined
                      dense
                      class="mt-1"
                      placeholder="Ingrese la dirección del fiador"
                      :rules="[
                        (val) => !!val || 'Dirección del fiador requerida',
                      ]"
                    >
                      <template v-slot:prepend>
                        <q-icon name="location_on" />
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
                  <!-- Valor del crédito -->
                  <div class="col-12 col-md-6">
                    <label
                      >Valor del crédito
                      <span class="text-red-500">*</span></label
                    >
                    <q-input
                      v-model="clientFormData.creditValue"
                      outlined
                      dense
                      type="number"
                      class="mt-1"
                      placeholder="Ingrese el valor"
                      :rules="[(val) => !!val || 'Valor requerido']"
                      @update:model-value="calculateInstallmentValue"
                    >
                      <template v-slot:prepend>
                        <q-icon name="attach_money" />
                      </template>
                    </q-input>
                  </div>

                  <!-- Tasa de interés -->
                  <div class="col-12 col-md-6">
                    <label
                      >Tasa de interés (%)
                      <span class="text-red-500">*</span></label
                    >
                    <q-input
                      v-model="clientFormData.interestRate"
                      outlined
                      dense
                      type="number"
                      class="mt-1"
                      placeholder="Ingrese la tasa"
                      :rules="[(val) => !!val || 'Tasa requerida']"
                      @update:model-value="calculateInstallmentValue"
                    >
                      <template v-slot:prepend>
                        <q-icon name="percent" />
                      </template>
                    </q-input>
                  </div>

                  <!-- Cantidad de cuotas -->
                  <div class="col-12 col-md-6">
                    <label
                      >Cantidad de cuotas
                      <span class="text-red-500">*</span></label
                    >
                    <q-input
                      v-model="clientFormData.installmentCount"
                      outlined
                      dense
                      type="number"
                      class="mt-1"
                      placeholder="Número de cuotas"
                      :rules="[(val) => !!val || 'Cuotas requeridas']"
                      @update:model-value="calculateInstallmentValue"
                    >
                      <template v-slot:prepend>
                        <q-icon name="list_alt" />
                      </template>
                    </q-input>
                  </div>
                  <div class="col-12 col-md-6">
                    <label
                      >Valor de la cuota
                      <span class="text-red-500">*</span></label
                    >
                    <q-input
                      :model-value="installmentValue"
                      outlined
                      dense
                      type="number"
                      class="mt-1"
                      readonly
                      placeholder="Valor de la cuota"
                      :rules="[(val) => !!val || 'Valor requerido']"
                    >
                      <template v-slot:prepend>
                        <q-icon name="list_alt" />
                      </template>
                    </q-input>
                  </div>
                  <!-- Frecuencia de pago -->
                  <div class="col-12 col-md-6">
                    <label
                      >Frecuencia de pago
                      <span class="text-red-500">*</span></label
                    >
                    <q-select
                      v-model="clientFormData.paymentFrequency"
                      :options="paymentFrequencyOptions"
                      outlined
                      dense
                      class="mt-1"
                      placeholder="Seleccione frecuencia"
                      :rules="[(val) => !!val || 'Frecuencia requerida']"
                    >
                      <template v-slot:prepend>
                        <q-icon name="repeat" />
                      </template>
                    </q-select>
                  </div>

                  <div
                    class="col-12 col-md-6"
                    v-if="clientFormData.paymentFrequency === 'Diaria'"
                  >
                    <label>
                      Excepto los días
                      <span class="text-red-500">*</span>
                    </label>
                    <div class="q-gutter-sm q-mt-sm">
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
                      >
                        {{ day }}
                      </q-chip>
                    </div>
                  </div>

                  <!-- Sección de microseguros -->
                  <div class="col-12">
                    <q-expansion-item
                      v-model="microInsuranceExpanded"
                      label="Microseguros"
                      caption="(Opcional)"
                      class="q-mt-md"
                      dense
                      expand-icon-class="text-primary"
                    >
                      <div class="row q-col-gutter-sm q-mt-sm">
                        <div class="col-12 col-md-6">
                          <label>Porcentaje de microseguro</label>
                          <q-input
                            v-model="clientFormData.microInsurancePercentage"
                            outlined
                            dense
                            type="number"
                            class="mt-1"
                            placeholder="0-100%"
                            min="0"
                            max="100"
                          >
                            <template v-slot:prepend>
                              <q-icon name="percent" />
                            </template>
                          </q-input>
                        </div>
                        <div class="col-12 col-md-6">
                          <label>Monto de microseguro</label>
                          <q-input
                            v-model="microInsuranceAmountCalculated"
                            outlined
                            dense
                            type="number"
                            class="mt-1"
                            placeholder="Monto"
                            readonly
                          >
                            <template v-slot:prepend>
                              <q-icon name="attach_money" />
                            </template>
                          </q-input>
                        </div>
                      </div>
                    </q-expansion-item>
                  </div>

                  <div class="col-12 col-md-6 q-mt-lg">
                    <q-checkbox
                      :model-value="advancedPayment"
                      @update:model-value="toggleAdvancedPayment"
                    />
                    <label class="text-caption"> Pago adelantado </label>
                  </div>

                  <div class="col-12 col-md-6">
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
                      readonly
                      :rules="[(val) => !!val || 'Fecha requerida']"
                    >
                      <template v-slot:prepend>
                        <q-icon name="event" />
                      </template>
                    </q-input>
                  </div>
                </div>
              </div>
            </div>
          </q-tab-panel>
          <q-tab-panel name="images">
            <div class="row flex items-center q-col-gutter-sm mb-5">
              <div class="col-12">
                <div class="row q-col-gutter-sm q-mb-md">
                  <!-- Inputs de archivo ocultos -->
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

                  <!-- Contenedor para las tres imágenes -->
                  <div class="col-12 flex justify-center q-gutter-sm">
                    <div
                      v-for="(item, index) in galleryItems"
                      :key="index"
                      class="image-container text-center"
                    >
                      <div class="text-caption q-mb-xs">{{ item.label }}</div>
                      <div v-if="galleryPhotosPreview[index]">
                        <q-img
                          :src="galleryPhotosPreview[index]"
                          style="
                            width: 150px;
                            height: 150px;
                            border-radius: 8px;
                          "
                        />
                        <q-btn
                          class="btn-delete q-mt-md"
                          size="md"
                          color="red-5"
                          dense
                          round
                          icon="close"
                          @click="removeGalleryPhoto(index)"
                        />
                      </div>
                      <q-btn
                        v-else
                        unelevated
                        color="primary"
                        class="custom-upload-btn"
                        :disable="index >= 1 && !isCreditComplete"
                        @click="openFileBrowser(item.ref)"
                      >
                        <q-icon name="photo_camera" />
                      </q-btn>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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

  <q-dialog v-model="showMapDialog" persistent>
    <q-card
      style="width: 90vw; max-width: 400px; height: auto; max-height: 80vh"
    >
      <q-card-section class="flex justify-between items-center">
        <h6>Seleccione la dirección de cobro en el mapa</h6>
        <q-btn flat round dense icon="close" @click="showMapDialog = false" />
      </q-card-section>
      <q-card-section class="q-pt-none" style="height: calc(100% - 100px)">
        <Map
          ref="mapRef"
          :geolocation="addressGeolocation"
          :isEditing="true"
          @location-selected="updateAddressLocation"
        />
      </q-card-section>
      <q-card-actions align="right">
        <q-btn
          unelevated
          label="Confirmar"
          color="primary"
          no-caps
          @click="confirmAddressSelection"
          v-close-popup
        />
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
});

console.log("clientFormData", props.clientFormData);

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

const galleryItems = ref([
  { label: "Documento", ref: "galleryPhotoInput1" },
  { label: "Foto Empresa", ref: "galleryPhotoInput2" },
  { label: "Cliente Dinero en mano", ref: "galleryPhotoInput3" },
]);

const microInsuranceAmountCalculated = computed(() => {
  const amount = Number(props.clientFormData.microInsuranceAmount) || 0;
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
    const reader = new FileReader();
    reader.onload = (e) => {
      // Actualizamos la vista previa en la posición index
      galleryPhotosPreview.value[index] = e.target?.result as string;
    };
    reader.readAsDataURL(file);

    // Actualizamos los datos del formulario
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

const galleryPhotosPreview = ref<(string | null)[]>([null, null, null]);

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
  if (!validateGuarantor()) {
    alert("Por favor complete todos los campos del fiador o deje todos vacíos");
    return;
  }

  if (!validateCredit()) {
    alert(
      "Por favor complete todos los campos del crédito o deje todos vacíos",
    );
    return;
  }

  if (currentTab.value === "client") {
    currentTab.value = "guarantor";
  } else if (currentTab.value === "guarantor") {
    currentTab.value = "credit";
  } else if (currentTab.value === "credit") {
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
  props.clientFormData.galleryPhotos[index] = null;
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
.client-card {
  width: 96%;
  max-width: 700px;
  padding: 16px;

  &__title {
    font-size: 24px;
    line-height: 125%;
    color: #000;
    font-weight: 500;
  }

  .q-separator {
    border-color: rgba(0, 0, 0, 0.08);
  }

  .text-caption {
    color: #6b7280;
  }

  .text-red-500 {
    color: #ef4444;
  }

  .relative-position {
    position: relative;
  }

  .flex {
    display: flex;
  }

  .justify-between {
    justify-content: space-between;
  }

  .items-center {
    align-items: end;
  }

  .q-col-gutter-lg {
    margin: -12px;
    > * {
      padding: 12px;
    }
  }

  .q-mb-md {
    margin-bottom: 16px;
  }

  .full-width {
    width: 100%;
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
</style>
