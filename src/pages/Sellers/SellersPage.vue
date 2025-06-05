<template>
  <section
    :class="[
      'min-h-screen ',
      { 'q-py-xl ': !selectedVendor },
      ,
      { 'container-app': !selectedVendor },
    ]"
  >
    <div class="q-mx-auto">
      <SellerFormModal
        v-model:modelValue="showCreateModal"
        :isEditing="isEditing"
        :vendorForm="vendorForm"
        :membersOptions="membersOptions"
        :countries="countries"
        :cities="showCitiesByCountry"
        @country-changed="handleCountryChange"
        @save-vendor="saveRoute"
        @close-modal="closeModal"
        @open="handleModalOpen"
      />

      <DialogConfirmation
        v-model="showDeleteModal"
        title="¡Atención! Eliminación de ruta"
        icon="warning"
        :description="`¿Está seguro de que desea eliminar la ruta ${selectedRoute?.name}? Esta acción es irreversible y eliminará permanentemente toda
                    la información asociada a esta ruta, incluyendo, Clientes,
                    Miembros y toda la información asociada.`"
        @confirm="deleteRoute"
      />

      <ToggleRouteDialog
        v-model="showToggleModal"
        :selectedRoute="selectedRoute"
        @cancel-toggle="cancelToggle"
        @confirm-toggle="confirmToggle"
      />
      <SellerDetailsView
        v-if="selectedVendor"
        :vendor="selectedVendor"
        :vendor-clients="vendorClients"
        :vendor-clients-pagination="vendorClientsPagination"
        @close-details="handleCloseDetails"
        @update-pagination="handlePaginationUpdate"
      />
      <div v-else>
        <div class="flex justify-between items-center q-mb-md">
          <div class="flex items-center gap-2">
            <h1 class="text-2xl font-semibold">Gestión de vendedores</h1>
          </div>
          <div class="flex gap-4">
            <div>
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
              color="primary"
              label="Nuevo vendedor"
              no-caps
              @click="showCreateModal = true"
            >
              <img src="/icons/plus-square.svg" class="ml-4 svg-white" alt="" />
            </q-btn>
          </div>
        </div>
        <TabletSellers
          v-if="dataRoutes"
          :data="dataRoutes"
          :paginationRoutes="paginationRoutes"
          @show-create-modal="showCreateModal = true"
          @edit-row="editRoute"
          @toggle-route="toggleRoute"
          @confirm-delete-row="confirmDeleteRoute"
          @row-clicked="showVendorDetails"
        />
      </div>
    </div>
  </section>
  <section></section>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useQuasar } from "quasar";
import { useRoutes } from "src/composables/useRoute";
import { useMembers } from "src/composables/useMembers";
import TabletSellers from "./components/TabletSellers.vue";
import SellerFormModal from "./components/SellerFormModal.vue";

import DialogConfirmation from "src/components/DialogConfirmation.vue";
import ToggleRouteDialog from "src/components/ToggleRouteDialog.vue";
import { useSellers } from "src/composables/useSellers";
import { useCities } from "src/composables/useCities";
import { useCountries } from "src/composables/useCountries";
import SellerDetailsView from "./components/SellerDetailsView.vue";

const selectedVendor = ref(null);

const $q = useQuasar();

const {
  search,
  showCreateModal,
  showDeleteModal,
  showToggleModal,
  paginationRoutes,
  dataRoutes,
  selectedRoute,
  isEditing,
  vendorForm,
  closeModal,
  confirmToggle,
  toggleRoute,
  editRoute,
  saveRoute,
  confirmDeleteRoute,
  deleteRoute,
  fetchRoutes,
  cancelToggle,
  clearForm,
  vendorClients,
  vendorClientsPagination,
  fetchVendorClients,
} = useSellers();

const { countries, showCitiesByCountry, getCountryAll, getCitiesByCountry } =
  useCities();

const { getMembersSelect, membersOptions } = useMembers();

onMounted(() => {
  fetchRoutes();
  getCountryAll(), getMembersSelect();
});

const showVendorDetails = async (vendor) => {
  selectedVendor.value = vendor;
  await fetchVendorClients(vendor.id);
};

const handlePaginationUpdate = (newPagination) => {
  vendorClientsPagination.page = newPagination.page;
  vendorClientsPagination.rowsPerPage = newPagination.rowsPerPage;
  fetchVendorClients(selectedVendor.value.id);
};

const handleCloseDetails = () => {
  selectedVendor.value = null;
  vendorClients.value = [];
};

const handleModalOpen = () => {
  if (isEditing.value && vendorForm.value.country_id) {
    getCitiesByCountry(vendorForm.value.country_id);
  }
};

const handleCountryChange = async (countryId) => {
  await getCitiesByCountry(countryId);
};
</script>

<style scoped></style>
