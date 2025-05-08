<template>
  <section class="min-h-screen q-py-xl container-app">
    <ClientsFormModal
      v-if="showCreateModal"
      v-model:modelValue="showCreateModal"
      :isEditing="isEditing"
      :clientFormData="clientFormData"
      :fiadorFormData="fiadorFormData"
      @save-client="saveClientHandler"
      @close-modal="closeModal"
    />
    <GuarantorFormModal
      v-if="showGuarantorModal"
      v-model:modelValue="showGuarantorModal"
      :isEditing="isEditingGuarantor"
      :guarantorFormData="guarantorFormData"
      @save-guarantor="saveGuarantorHandler"
      @close-modal="closeGuarantorModal"
    />
    <div class="flex justify-end items-center mb-6">
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
          label="Nuevo cliente"
          no-caps
          @click="showCreateModal = true"
        >
          <img
            src="/icons/FolderSimpleStar.svg"
            class="ml-4 svg-white"
            alt=""
          />
        </q-btn>
        <q-btn
          unelevated
          color="primary"
          label="Nuevo fiador"
          no-caps
          @click="showGuarantorModal = true"
        >
          <img
            src="/icons/FolderSimpleStar.svg"
            class="ml-4 svg-white"
            alt=""
          />
        </q-btn>
      </div>
    </div>

    <div class="q-my-lg">
      <TabletClients
        v-if="clients.data"
        :dataClients="clients"
        :paginationClients="paginationClients"
        @edit="editClient"
      />
    </div>

    <DialogConfirmation
      v-model="showDeleteModal"
      title="¡Atención! Eliminación de cliente"
      icon="warning"
      :description="`¿Está seguro de que desea eliminar al cliente ${selectedClient?.name}? Esta acción es irreversible y eliminará permanentemente toda la información asociada a este cliente.`"
      @confirm="deleteClient"
    />
  </section>
</template>

<script setup>
import { ref, onMounted } from "vue";
import ClientsFormModal from "./components/ClientsFormModal.vue";
import { useClients } from "src/composables/useClients";
import DialogConfirmation from "src/components/DialogConfirmation.vue";
import TabletClients from "./components/TabletClients.vue";
import GuarantorFormModal from "./components/GuarantorFormModal.vue";
import { useGuarantors } from "src/composables/useGuarantors";

const {
  showCreateModal,
  showDeleteModal,
  isEditing,
  selectedClient,
  clientFormData,
  fiadorFormData,
  paginationClients,
  totalClients,
  clients,
  closeModalWithoutValidation,
  saveClient,
  editClient,
  deleteClient: deleteClientFunc,
  fetchClients,
} = useClients();

const {
  showGuarantorModal,
  isEditingGuarantor,
  guarantorFormData,
  closeGuarantorModalWithoutValidation,
  saveGuarantor,
  fetchGuarantorsSelect,
} = useGuarantors();

const search = ref("");

const formatNumber = (value) => {
  return new Intl.NumberFormat("es-CO", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

const saveClientHandler = async () => {
  await saveClient();
};

const deleteClient = async () => {
  await deleteClientFunc();
  await fetchClients();
};

const confirmDeleteClient = (client) => {
  selectedClient.value = client;
  showDeleteModal.value = true;
};

const closeModal = () => {
  closeModalWithoutValidation();
};

const saveGuarantorHandler = async () => {
  await saveGuarantor();
};

const closeGuarantorModal = () => {
  closeGuarantorModalWithoutValidation();
};

onMounted(async () => {
  await fetchClients();
  await fetchGuarantorsSelect();
});
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
