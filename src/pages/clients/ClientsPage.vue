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

    <div>
      <div
        :class="$q.screen.lt.md && 'q-px-md'"
        class="flex justify-between items-center q-mb-md"
      >
        <div class="flex items-center gap-2">
          <h1 class="text-2xl font-semibold">Clientes</h1>
        </div>
        <div class="flex gap-4 q-mt-md q-mb-sm">
          <div :class="$q.screen.lt.md && 'w-full'">
            <q-input
              outlined
              dense
              v-model="search"
              placeholder="Buscar"
              bg-color="white"
              debounce="500"
            >
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>

          <q-btn
            unelevated
            v-if="!$q.screen.lt.md && role === 5"
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
        </div>
      </div>

      <TabletClients
        v-if="clients.data"
        :dataClients="clients"
        :paginationcustom-client-table="paginationClients"
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

    <q-page-sticky
      v-if="$q.screen.lt.md && role === 5"
      position="bottom-right"
      :offset="[18, 18]"
    >
      <!--       <q-btn
          unelevated
          icon="add"
          color="primary"
          @click="showCreateModal = true"
          label="Nuevo cliente"
        /> -->

      <q-btn
        unelevated
        v-if="role === 5"
        color="primary"
        label="Nuevo cliente"
        no-caps
        @click="showCreateModal = true"
      >
        <img src="/icons/FolderSimpleStar.svg" class="ml-4 svg-white" alt="" />
      </q-btn>
    </q-page-sticky>
  </section>
</template>

<script setup>
import { ref, onMounted } from "vue";
import ClientsFormModal from "./components/ClientsFormModal.vue";
import { useClients } from "src/composables/useClients";
import DialogConfirmation from "src/components/DialogConfirmation.vue";
import TabletClients from "./components/TabletClients.vue";

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

const search = ref("");

const formatNumber = (value) => {
  return new Intl.NumberFormat("es-CO", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

const user = JSON.parse(localStorage.getItem("user"));
const role = user?.role_id;

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

onMounted(async () => {
  await fetchClients();
});
</script>

<!-- <style scoped>
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
</style> -->
