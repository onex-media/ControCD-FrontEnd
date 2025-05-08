<template>
  <!-- Create/Edit Credit Modal -->
  <q-dialog :model-value="modelValue" persistent>
    <q-card class="w-[600px]">
      <q-card-section class="flex justify-between items-center">
        <h3 class="text-lg font-medium">
          {{ isEditing ? "Editar crédito" : "Nuevo crédito" }}
        </h3>
        <q-btn flat round dense icon="close" @click="closeModal" />
      </q-card-section>

      <q-card-section class="q-pt-none">
        <p class="text-sm text-gray-500 mb-6">
          {{
            isEditing
              ? `Estás editando el crédito ${selectedCredit?.id}`
              : "Estás creando un nuevo crédito. Para que este crédito se cree exitosamente, es necesario que rellenes todos los campos obligatorios."
          }}
        </p>

        <div class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700">
              Cliente <span class="text-red-500">*</span>
            </label>
            <q-select
              behavior="menu"
              v-model="creditForm.client_id"
              :options="clientOptions"
              option-value="value"
              option-label="label"
              outlined
              dense
              use-input
              hide-selected
              fill-input
              input-debounce="0"
              @filter="filterClients"
              emit-value
              map-options
              class="mt-1"
              placeholder="Busca por nombre del cliente o Número de identificación"
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No se encontraron resultados
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
            <p class="mt-2 text-sm text-gray-500">
              Selecciona y designa un cliente para este crédito.
            </p>
          </div>

          <div
            class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4"
          >
            <div>
              <label class="block text-sm font-medium text-gray-700">
                Ruta <span class="text-red-500">*</span>
              </label>
              <q-select
                behavior="menu"
                v-model="creditForm.route_id"
                :options="routeOptions"
                option-value="value"
                option-label="label"
                @update:model-value="handleRouteChange"
                outlined
                dense
                class="mt-1"
                placeholder="Selecciona una ruta"
                emit-value
                map-options
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">
                Valor del crédito <span class="text-red-500">*</span>
              </label>
              <q-input
                v-model="creditForm.credit_value"
                type="number"
                outlined
                dense
                class="mt-1"
                prefix="$"
                placeholder="Ingrese un valor"
              />
            </div>
          </div>

          <div
            class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4"
          >
            <div>
              <label class="block text-sm font-medium text-gray-700">
                Cantidad de cuotas <span class="text-red-500">*</span>
              </label>
              <q-input
                v-model="creditForm.number_installments"
                type="number"
                outlined
                dense
                class="mt-1"
                placeholder="Ingrese una cantidad"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">
                Fecha primera cuota <span class="text-red-500">*</span>
              </label>
              <q-input
                v-model="creditForm.first_quota_date"
                outlined
                dense
                mask="date"
                class="mt-1"
              >
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy
                      cover
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-date
                        v-model="creditForm.first_quota_date"
                        mask="YYYY-MM-DD"
                      />
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
          </div>

          <div
            class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4"
          >
            <div>
              <label class="block text-sm font-medium text-gray-700">
                Frecuencia de pago <span class="text-red-500">*</span>
              </label>
              <q-select
                v-model="creditForm.payment_frequency"
                :options="[
                  { label: 'Diario', value: 'daily' },
                  { label: 'Semanal', value: 'weekly' },
                  { label: 'Quincenal', value: 'biweekly' },
                  { label: 'Mensual', value: 'monthly' },
                ]"
                option-value="value"
                option-label="label"
                outlined
                dense
                emit-value
                map-options
                class="mt-1"
                placeholder="Selecciona una opción"
                behavior="menu"
              />
            </div>
          </div>

          <div>
            <div class="flex items-center justify-between">
              <label class="block text-sm font-medium text-gray-700">
                Fiador <span class="text-red-500">*</span>
              </label>
              <q-btn flat dense unelevated @click="handleOpenGuarantorModal()"
                >Crear fiador</q-btn
              >
            </div>
            <q-select
              behavior="menu"
              v-model="creditForm.guarantor_id"
              :options="guarantersOptions"
              option-value="id"
              option-label="name"
              outlined
              dense
              use-input
              hide-selected
              fill-input
              input-debounce="0"
              emit-value
              map-options
              class="mt-1"
              placeholder="Busca fiador"
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No se encontraron resultados
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
            <p class="mt-2 text-sm text-gray-500">
              Selecciona y designa un fiador para este crédito.
            </p>
          </div>

          <div class="flex justify-end">
            <q-btn
              outline
              no-caps
              color="primary"
              icon="calculate"
              label="Simular crédito"
              @click="simulateCredit"
            />
          </div>
        </div>
      </q-card-section>

      <q-card-actions align="right" class="px-6 py-4 border-t">
        <q-btn
          flat
          no-caps
          label="Cancelar"
          color="gray"
          class="mr-3"
          @click="closeModal"
        />
        <q-btn
          @click="saveCredit"
          no-caps
          :label="isEditing ? 'Guardar' : 'Crear'"
          color="primary"
          :loading="saving"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useVuelidate } from "@vuelidate/core";
import { defineProps } from "vue";

const emit = defineEmits([
  "update:modelValue",
  "save-credit",
  "close-modal",
  "open-guarantor-modal",
  "close-modal",
]);

const props = defineProps({
  modelValue: Boolean,
  isEditing: Boolean,
  creditForm: {
    type: Object,
    required: true,
    default: () => ({
      client_id: null,
      guarantor_id: null,
      route_id: null,
      credit_value: null,
      number_installments: null,
      first_quota_date: "",
      payment_frequency: null,
      payment_day: null,
      credit_counts: {
        green: 0,
        blue: 0,
        red: 0,
      },
    }),
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
  clientOptions: {
    type: Array,
    required: true,
    default: () => [],
  },
  routeOptions: {
    type: Array,
    required: true,
    default: () => [],
  },
  paymentDayOptions: {
    type: Array,
    required: true,
    default: () => [],
  },
  guarantersOptions: {
    type: Array,
    required: true,
    default: () => [],
  },
});

const saveCredit = () => {
  emit("save-credit");
};

const closeModal = () => {
  emit("update:modelValue", false);
};

const handleOpenGuarantorModal = () => {
  emit("open-guarantor-modal");
};
</script>
