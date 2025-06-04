<template>
  <section class="min-h-screen q-py-xl container-app cities-page">
    <CityFormModal
      v-model="showCreateModal"
      :isEditing="isEditing"
      :selectedCity="selectedCity"
      :selectedCountry="selectedCountry"
      :cityForm="cityForm"
      :routeOptions="routeOptions"
      :loadingCities="loadingCities"
      :countries="countries"
      @save-city="saveCity"
      @close-modal="close"
      :selectedCountryId="selectedCountryId"
    />

    <div>
      <div class="flex justify-between items-center q-mb-md q-ml-xl q-mr-xl">
        <div class="flex items-center gap-2">
          <h1 class="text-2xl font-semibold">Parametrización de países</h1>
        </div>
        <div class="flex gap-4">
          <div>
            <q-input
              outlined
              dense
              v-model="search"
              placeholder="Buscar país"
              bg-color="white"
              debounce="500"
              @update:model-value="handleSearch"
            >
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>
        </div>
      </div>
      <TableCities
        class="q-mt-lg q-pt-lg q-ml-xl q-mr-xl"
        :loadingCities="loadingCities"
        :showCities="showCities"
        :cities="cities"
        @fetch-cities="handleFetchCities"
        @show-create-modal="handleShowCreateModal"
        :countries="countries"
        @edit="editCity"
        @save-city="saveCity"
        @confirm-delete-row="confirmDeleteCity"
        :pagination="{
          page: pagination.page,
          rowsPerPage: pagination.rowsPerPage,
          rowsNumber: pagination.rowsNumber,
          last_page: pagination.countPage,
          sortBy: pagination.sortBy,
          descending: pagination.descending,
        }"
        @update:pagination="handlePagination"
      />
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
  editCity,
  fetchCities,
  closeModal,
  deleteCity,
  showDeleteModal,
  confirmDeleteCity,
  saveCity,
  loadingCities,
  getCitiesByCountry,
  showCities,
} = useCities();

const handleFetchCities = (countryId) => {
  getCitiesByCountry(countryId);
};

const selectedCountryId = ref(null);
const {
  countries,
  pagination,
  getAllCountries,
  handlePagination,
  handleSearch,
  search,
} = useCountries();

const close = () => {
  closeModal();
};

const handleShowCreateModal = (country) => {
  showCreateModal.value = true;
  selectedCountryId.value = country;
  cityForm.value.country_id = country.id;
};

onMounted(async () => {
  await getAllCountries();
  await fetchCities();
});
// Computed
</script>
