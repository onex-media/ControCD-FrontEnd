<template>
  <section class="min-h-screen q-py-xl container-app">
    <CityFormModal
      v-model="showCreateModal"
      :isEditing="isEditing"
      :selectedCity="selectedCity"
      :cityForm="cityForm"
      :routeOptions="routeOptions"
      :countries="countries"
      @save-city="saveCity"
      @close-modal="close"
    />

    <div>
  
      <div class="flex justify-between items-center q-mb-md">
        <div class="flex items-center gap-2">
          <h1 class="text-2xl font-semibold">Ciudades</h1>
        </div>
        <div class="flex gap-4">
          <div>
            <q-input outlined dense v-model="search" placeholder="Buscar" bg-color="white" debounce="500">
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>
          <q-btn unelevated color="primary" label="Nueva ciudad" no-caps @click="showCreateModal = true">
            <img src="/images/city.png" class="ml-4 svg-white-invert" />
          </q-btn>
        </div>
      </div>
      <TableCities class="q-mt-lg q-pt-lg" :cities="cities" @edit="editCity" @confirm-delete-row="confirmDeleteCity" :pagination="pagination" />
    </div>

    <DialogConfirmation
      v-model="showDeleteModal"
      title="¡Atención! Eliminación de ciudad"
      icon="warning"
      :description="`¿Está seguro de que desea eliminar la ciudad ${selectedCity?.name}?.`"
      @confirm="deleteCity"
    />

  </section>
</template>

<script setup>
import { onMounted, ref } from "vue";
import TableCities from "./components/TableCities.vue";
import CityFormModal from "./components/CityFormModal.vue";
import { useCities } from "../../composables/useCities";
import { useCountries } from "../../composables/useCountries";
import DialogConfirmation from "src/components/DialogConfirmation.vue";

const {
  cities,
  cityForm,
  showCreateModal,
  isEditing,
  routeOptions,
  selectedCity,
  pagination,
  editCity,
  fetchCities,
  closeModal,
  deleteCity,
  deleting,
  showDeleteModal,
  confirmDeleteCity,
  saveCity,
} = useCities();


const { countries } = useCountries();

const close = () => {
  closeModal();
};


onMounted(async () => {
  await fetchCities();
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
