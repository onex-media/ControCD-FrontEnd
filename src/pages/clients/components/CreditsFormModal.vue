<template>
  <q-dialog :model-value="modelValue" persistent @update:model-value="updateShow">
    <q-card class="credit-card">
      <q-card-section class="justify-between items-center">
        <div class="flex justify-between items-center">
          <h3 class="credit-card__title">
            {{ isEditing ? "Editar crédito" : "Nuevo crédito" }}
          </h3>
          <q-btn flat round dense icon="close" @click="closeModal" />
        </div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <div style="overflow-x: auto">
          <q-tabs v-model="currentTab" dense class="text-grey" active-color="primary" indicator-color="primary"
            align="justify" no-caps narrow-indicator>
            <q-tab name="credit" label="Crédito" />
            <q-tab name="images" label="Imágenes" />
          </q-tabs>
        </div>

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

                  <div class="col-12 col-md-6" v-if="creditFormData.paymentFrequency === 'Diaria'">
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
                          <q-input :model-value="microInsuranceAmountCalculated" outlined dense type="number"
                            class="mt-1" placeholder="Monto" disable>
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
              <div class="col-12">
                <div class="row q-col-gutter-sm q-mb-md">
                  <!-- Inputs de archivo ocultos -->
                  <input type="file" ref="galleryPhotoInput1" accept="image/*" style="display: none"
                    @change="(event) => handleGalleryPhotoChange(event, 0)" />
                  <input type="file" ref="galleryPhotoInput2" accept="image/*" style="display: none"
                    @change="(event) => handleGalleryPhotoChange(event, 1)" />
                  <input type="file" ref="galleryPhotoInput3" accept="image/*" style="display: none"
                    @change="(event) => handleGalleryPhotoChange(event, 2)" />

                  <!-- Contenedor para las tres imágenes -->
                  <div class="col-12 flex justify-center q-gutter-sm">
                    <div v-for="(item, index) in galleryItems" :key="index" class="image-container text-center">
                      <div class="text-caption q-mb-xs">{{ item.label }}</div>
                      <div v-if="galleryPhotosPreview[index]">
                        <q-img :src="galleryPhotosPreview[index]" style="
                            width: 150px;
                            height: 150px;
                            border-radius: 8px;
                          " />
                        <q-btn class="btn-delete q-mt-md" size="md" color="red-5" dense round icon="close"
                          @click="removeGalleryPhoto(index)" />
                      </div>
                      <q-btn v-else unelevated color="primary" class="custom-upload-btn"
                        :disable="index >= 1 && !isCreditComplete" @click="openFileBrowser(item.ref)">
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
            <q-btn flat no-caps :label="previousTabLabel()" color="grey" class="full-width" @click="previousTab" />
          </div>
          <div class="col-12 col-md-6">
            <q-btn unelevated class="full-width" no-caps :label="nextTab()" color="primary" @click="saveCredit" />
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, watch } from "vue";
import { CreateCreditPayload } from "src/types/credits.types";

const emit = defineEmits(["update:modelValue", "save-credit", "close-modal"]);

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
  { label: "Foto Empresa", ref: "galleryPhotoInput1" },
  { label: "Cliente Dinero en mano", ref: "galleryPhotoInput2" },
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
  width: 96%;
  max-width: 700px;
  padding: 16px;

  &__title {
    font-size: 24px;
    line-height: 125%;
    color: #000;
    font-weight: 500;
  }
}

.btn-delete {
  position: absolute;
  z-index: 1000;
  right: 5px;
  top: 0px;
}

.custom-upload-btn {
  width: 150px;
  height: 150px;
  font-size: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
}

.q-chip {
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.05);
  }
}

/* .image-container {
  position: relative;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 10px;
  background: #f9fafb;
  transition: all 0.3s ease;

  &:hover {
    border-color: #3b82f6;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
}

.q-expansion-item {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 0 10px;
  margin-top: 16px;
} */
.custom-expansion-header {
  padding: 0 !important;
}

:deep(.custom-expansion-header) {
  padding: 0 !important;
}

/* :deep(.q-card__section--vert) {
  padding: 16px 0;
}
 */

:deep(.q-tab-panel) {
  padding: 0 !important;
}

@media (max-width: 600px) {
  :deep(.q-field--dense .q-field__control, .q-field--dense .q-field__marginal) {
    height: 33px !important;
  }

  :deep(.q-field--auto-height.q-field--dense .q-field__control,
    .q-field--auto-height.q-field--dense .q-field__native) {
    min-height: 33px !important;
  }
}
</style>
