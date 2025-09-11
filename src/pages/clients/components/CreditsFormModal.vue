<template>
  <q-dialog :model-value="modelValue" persistent @update:model-value="updateShow">
    <q-card class="credit-card">
      <div class="sticky-tabs">
        <q-card-section class="justify-between items-center">
          <div class="flex justify-between items-center">
            <h3 class="credit-card__title">
              {{ isEditing ? "Editar crédito" : "Nuevo crédito" }}
            </h3>
            <q-btn flat round dense icon="close" @click="closeModal" />
          </div>
        </q-card-section>
        <div style="overflow-x: auto">
          <q-tabs v-model="currentTab" dense class="text-grey" active-color="primary" indicator-color="primary"
            align="justify" no-caps narrow-indicator>
            <q-tab name="credit" label="Crédito" />
            <q-tab name="images" label="Imágenes" />
          </q-tabs>
        </div>
      </div>

      <q-card-section class="q-pt-none">
        <q-tab-panels v-model="currentTab" animated class="q-mt-lg">
          <q-tab-panel name="credit">
            <div class="row">
              <div class="col-12">
                <div class="row q-col-gutter-sm">
                  <div class="col-12 col-md-6">
                    <label>Valor del crédito
                      <span class="text-red-500">*</span></label>
                    <q-input v-model="creditFormData.creditValue" outlined dense type="number" class="mt-1"
                      placeholder="Ingrese el valor" :rules="[(val) => !!val || 'Valor requerido']"
                      @update:model-value="calculateInstallmentValue">
                      <template v-slot:prepend>
                        <q-icon name="attach_money" size="20px" />
                      </template>
                    </q-input>
                  </div>

                  <div class="col-12 col-md-6">
                    <label>Tasa de interés (%)
                      <span class="text-red-500">*</span></label>
                    <q-input v-model="creditFormData.interestRate" outlined dense type="number" class="mt-1"
                      placeholder="Ingrese la tasa" :rules="[(val) => !!val || 'Tasa requerida']"
                      @update:model-value="calculateInstallmentValue">
                      <template v-slot:prepend>
                        <q-icon name="percent" size="20px" />
                      </template>
                    </q-input>
                  </div>

                  <div class="col-12 col-md-6">
                    <label>Cantidad de cuotas
                      <span class="text-red-500">*</span></label>
                    <q-input v-model="creditFormData.installmentCount" outlined dense type="number"
                      placeholder="Número de cuotas" :rules="[(val) => !!val || 'Cuotas requeridas']"
                      @update:model-value="calculateInstallmentValue">
                      <template v-slot:prepend>
                        <q-icon name="list_alt" size="20px" />
                      </template>
                    </q-input>
                  </div>

                  <div class="col-12 col-md-6">
                    <label>Valor de la cuota
                      <span class="text-red-500">*</span></label>
                    <q-input :model-value="installmentValue" outlined dense type="number" disable
                      placeholder="Valor de la cuota" :rules="[(val) => !!val || 'Valor requerido']">
                      <template v-slot:prepend>
                        <q-icon name="list_alt" size="20px" />
                      </template>
                    </q-input>
                  </div>

                  <div class="col-12 col-md-6">
                    <label>Frecuencia de pago
                      <span class="text-red-500">*</span></label>
                    <q-select v-model="creditFormData.paymentFrequency" :options="paymentFrequencyOptions" outlined
                      dense class="mt-1" placeholder="Seleccione frecuencia"
                      :rules="[(val) => !!val || 'Frecuencia requerida']">
                      <template v-slot:prepend>
                        <q-icon name="repeat" size="20px" />
                      </template>
                    </q-select>
                  </div>

                  <div
                    class="col-12"
                    v-if="creditFormData.paymentFrequency === 'Diaria'"
                  >
                    <label>
                      Excepto los días
                      <span class="text-red-500">*</span>
                    </label>
                    <div class="q-gutter-sm q-mt-sm">
                      <q-chip v-for="day in weekDays" :key="day" clickable :color="creditFormData.excludedDays?.includes(day)
                          ? 'primary'
                          : 'grey-5'
                        " text-color="white" @click="toggleExcludedDay(day)"
                        class="q-pa-xs flex justify-center items-center" style="
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
                    <q-expansion-item v-model="microInsuranceExpanded" label="Microseguros"
                      header-class=" custom-expansion-header q-mb-md" dense expand-icon-class="text-primary">
                      <div class="row q-col-gutter-sm">
                        <div class="col-12 col-md-6">
                          <label>Porcentaje de microseguro</label>
                          <q-input v-model="creditFormData.microInsurancePercentage" outlined dense type="number"
                            class="mt-1" placeholder="0-100%" min="0" max="100">
                            <template v-slot:prepend>
                              <q-icon name="percent" size="20px" />
                            </template>
                          </q-input>
                        </div>
                        <div class="col-12 col-md-6">
                          <label>Monto de microseguro</label>
                          <q-input
                            :model-value="microInsuranceAmountCalculated"
                            outlined
                            dense
                            type="number"
                            class="mt-1"
                            placeholder="Monto"
                            disable
                          >
                            <template v-slot:prepend>
                              <q-icon name="attach_money" />
                            </template>
                          </q-input>
                        </div>
                      </div>
                    </q-expansion-item>
                  </div>

                  <div class="col-12 col-md-6">
                    <q-checkbox :model-value="advancedPayment" @update:model-value="toggleAdvancedPayment" />
                    <label class=""> Pago adelantado </label>
                  </div>

                  <!--  <div class="col-12 col-md-6">
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
          <div v-if="!$q.screen.lt.md" class="row q-col-gutter-sm mr-4">
            <div class="col-12 flex justify-end">
              <q-btn
                unelevated
                no-caps
                :label="nextTab()"
                color="primary"
                @click="saveCredit"
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
                @click="saveCredit"
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
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, watch } from "vue";
import { CreateCreditPayload } from "src/types/credits.types";
import { useQuasar } from "quasar";
const emit = defineEmits(["update:modelValue", "save-credit", "close-modal"]);
const $q = useQuasar();

const props = defineProps({
  modelValue: Boolean,
  isEditing: Boolean,
  creditFormData: {
    type: Object as () => CreateCreditPayload,
    required: true,
  },
});

const currentTab = ref("credit");
const microInsuranceExpanded = ref(false);
const advancedPayment = ref(false);
const installmentValue = ref(0);

const galleryPhotoInput1 = ref<HTMLInputElement | null>(null);
const galleryPhotoInput2 = ref<HTMLInputElement | null>(null);
const galleryPhotoInput3 = ref<HTMLInputElement | null>(null);

const galleryItems = ref([
  /* { label: "Foto Empresa", ref: "galleryPhotoInput1" }, */
  { label: "Cliente Dinero en mano", ref: "galleryPhotoInput1" },
]);

const microInsuranceAmountCalculated = computed(() => {
  const amount = Number(props.creditFormData.microInsurancePercentage) || 0;
  const credit = Number(props.creditFormData.creditValue) || 0;
  return (amount * credit) / 100;
});

const toggleExcludedDay = (day: string) => {
  const days = Array.isArray(props.creditFormData.excludedDays)
    ? [...props.creditFormData.excludedDays]
    : [];
  const index = days.indexOf(day);

  index === -1 ? days.push(day) : days.splice(index, 1);
  props.creditFormData.excludedDays = days;
};

const toggleAdvancedPayment = (value: boolean) => {
  advancedPayment.value = value;
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

const calculateInstallmentValue = () => {
  const { creditValue, interestRate, installmentCount } = props.creditFormData;

  if (!creditValue || !interestRate || !installmentCount) {
    installmentValue.value = 0;
    return;
  }

  const totalWithInterest = +creditValue * (1 + +interestRate / 100);
  installmentValue.value = totalWithInterest / +installmentCount;
};

const firstInstallmentDate = computed(() => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const formatDate = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  return advancedPayment.value ? formatDate(today) : formatDate(tomorrow);
});

watch(
  [
    () => props.creditFormData.creditValue,
    () => props.creditFormData.interestRate,
    () => props.creditFormData.installmentCount,
  ],
  calculateInstallmentValue,
  { immediate: true },
);

const galleryPhotosPreview = ref<(string | null)[]>([null, null, null]);

const closeModal = () => {
  emit("update:modelValue", false);
  emit("close-modal");
};

const updateShow = (value: boolean) => {
  emit("update:modelValue", value);
};

const isCreditComplete = computed(() => {
  return (
    props.creditFormData.creditValue &&
    props.creditFormData.interestRate &&
    props.creditFormData.installmentCount &&
    props.creditFormData.paymentFrequency
  );
});

const saveCredit = () => {
  if (currentTab.value === "credit") {
    currentTab.value = "images";
    console.log("Guardar:", props.creditFormData);
  } else {
    console.log("Guardar crédito:", props.creditFormData);
    emit("save-credit");
  }
};

const nextTab = () => {
  if (currentTab.value === "credit") {
    return "Siguiente";
  } else {
    return props.isEditing ? "Guardar" : "Crear";
  }
};

const previousTab = () => {
  if (currentTab.value === "images") {
    currentTab.value = "credit";
  } else {
    closeModal();
  }
};

const previousTabLabel = () => {
  if (currentTab.value === "credit") {
    return "Cancelar";
  } else {
    return "Atras";
  }
};

const openFileBrowser = (refName: string) => {
  if (refName === "galleryPhotoInput1" && galleryPhotoInput1.value) {
    galleryPhotoInput1.value.click();
  } else if (refName === "galleryPhotoInput2" && galleryPhotoInput2.value) {
    galleryPhotoInput2.value.click();
  } else if (refName === "galleryPhotoInput3" && galleryPhotoInput3.value) {
    galleryPhotoInput3.value.click();
  }
};

const handleGalleryPhotoChange = (event: Event, index: number) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      galleryPhotosPreview.value[index] = e.target?.result as string;
    };
    reader.readAsDataURL(file);

    // Actualizamos los datos del formulario
    props.creditFormData.galleryPhotos[index] = file;
  }
  input.value = "";
};

const removeGalleryPhoto = (index: number) => {
  galleryPhotosPreview.value[index] = null;
  props.creditFormData.galleryPhotos[index] = null as any;
};

onMounted(() => {
  // Inicializar valores si estamos editando
  if (props.isEditing && props.creditFormData.galleryPhotos) {
    props.creditFormData.galleryPhotos.forEach((photo, index) => {
      if (photo instanceof File) {
        const reader = new FileReader();
        reader.onload = (e) => {
          galleryPhotosPreview.value[index] = e.target?.result as string;
        };
        reader.readAsDataURL(photo);
      } else if (typeof photo === "string") {
        // Si es una URL (en modo edición)
        galleryPhotosPreview.value[index] = photo;
      }
    });
  }
});
</script>

<style lang="scss" scoped>
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
