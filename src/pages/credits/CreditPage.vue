<template>
  <section class="min-h-screen q-py-xl container-app">
    <CreditFormModal
      v-model="showCreateModal"
      :isEditing="isEditing"
      :selectedCredit="selectedCredit"
      :creditForm="creditForm"
      :clientOptions="clientOptions"
      :routeOptions="routeOptions"
      :guarantersOptions="guarantersOptions"
      @save-credit="saveCredit"
      @close-modal="closeModal"
      @open-guarantor-modal="showGuarantorModal = true"
    />

    <div>
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-semibold">Créditos</h1>
        <div class="flex items-center gap-4">
          <div class="relative">
            <q-input
              outlined
              dense
              v-model="search"
              placeholder="Buscar"
              bg-color="white"
            >
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>
          <q-btn
            unelevated
            color="primary"
            label="Nuevo crédito"
            no-caps
            @click="showCreateModal = true"
          >
            <img src="/icons/Scales.svg" class="ml-4 svg-white" />
          </q-btn>
        </div>
      </div>
      <TableCredits :credits="credits" :pagination="pagination" />
    </div>

    <q-dialog v-model="showDeleteModal" persistent>
      <q-card>
        <q-card-section class="flex justify-between items-center">
          <h3 class="text-lg font-medium">Confirmar eliminación</h3>
          <q-btn
            flat
            round
            dense
            icon="close"
            @click="showDeleteModal = false"
          />
        </q-card-section>
        <q-card-section>
          <p>
            ¿Estás seguro de que deseas eliminar el crédito
            {{ selectedCredit?.id }}?
          </p>
        </q-card-section>
        <q-card-actions align="right" class="px-6 py-4 border-t">
          <q-btn
            flat
            no-caps
            label="Cancelar"
            color="gray"
            class="mr-3"
            @click="showDeleteModal = false"
          />
          <q-btn
            no-caps
            label="Eliminar"
            color="negative"
            @click="deleteCredit"
            :loading="deleting"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showSuccessModal" persistent>
      <q-card>
        <q-card-section class="flex justify-between items-center">
          <h3 class="text-lg font-medium">{{ successMessage.title }}</h3>
          <q-btn
            flat
            round
            dense
            icon="close"
            @click="showSuccessModal = false"
          />
        </q-card-section>
        <q-card-section>
          <p>{{ successMessage.description }}</p>
          <ul v-if="successMessage.details">
            <li v-for="detail in successMessage.details" :key="detail.label">
              {{ detail.label }}: {{ detail.value }} {{ detail.suffix }}
            </li>
          </ul>
        </q-card-section>
        <q-card-actions align="right" class="px-6 py-4 border-t">
          <q-btn
            flat
            no-caps
            label="Cerrar"
            color="primary"
            @click="showSuccessModal = false"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <GuarantorFormModal
      v-if="showGuarantorModal"
      v-model:modelValue="showGuarantorModal"
      :isEditing="isEditingGuarantor"
      :guarantorFormData="guarantorFormData"
      @save-guarantor="saveGuarantor"
      @close-modal="closeGuarantorModal"
    />
  </section>
</template>

<script setup>
import { ref } from "vue";
import { useCredits } from "../../composables/useCredit";
import CreditFormModal from "./components/CreditFormModal.vue";
import { useGuarantors } from "src/composables/useGuarantors";

import GuarantorFormModal from "../clients/components/GuarantorFormModal.vue";
import TableCredits from "./components/TableCredits.vue";

const {
  credits,
  creditForm,
  showCreateModal,
  clientOptions,
  routeOptions,
  pagination,
  paymentDayOptions,
  closeModal,
  saveCredit,
} = useCredits();

const {
  guarantersOptions,
  showGuarantorModal,
  isEditingGuarantor,
  guarantorFormData,

  closeGuarantorModalWithoutValidation,
  saveGuarantor,
  fetchGuarantorsSelect,
} = useGuarantors();

const successMessage = ref({
  title: "",
  description: "",
  details: null,
});

// Computed
</script>

<style scoped>
.pagination-custom {
  .q-btn {
    padding: 8px 12px;
    font-size: 14px;
    min-height: unset;
    height: unset;
  }
}

:deep(.q-field) {
  margin-bottom: 0;
}

:deep(.q-field--outlined .q-field__control) {
  border-radius: 0.375rem;
}

:deep(.q-field--outlined .q-field__control:hover) {
  border-color: #d1d5db;
}

:deep(.q-field--focused .q-field__control) {
  border-color: #3b82f6;
}

:deep(.q-btn) {
  border-radius: 0.375rem;
}

:deep(.q-dialog__inner--minimized > div) {
  max-width: 600px;
}
</style>
