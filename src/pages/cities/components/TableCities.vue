<template>
  <div>
    <div class="q-mt-sm column gap-4">
      <q-card
        v-for="country in countries"
        :key="country.id"
        class="full-width q-pa-md bg-grey-1"
      >
        <div class="flex justify-between items-start">
          <div class="col">
            <div
              class="flex items-center gap-2 cursor-pointer"
              @click="toggleCountry(country.id)"
            >
              <q-icon
                size="md"
                :name="isExpanded(country.id) ? 'expand_less' : 'expand_more'"
              />
              <div>
                <h3 class="text-h6 q-ma-none text-primary">
                  {{ country.name }}
                </h3>
                <div class="text-caption text-grey q-mt-xs">
                  {{ citiesCount(country.id) }} Ciudades • Moneda:
                  {{ country.currency }}
                </div>
              </div>
            </div>
          </div>
          <q-btn
            icon="add"
            color="primary"
            label="Agregar ciudad"
            round
            no-caps
            dense
            flat
            @click.stop="emit('show-create-modal', country)"
          />
        </div>

        <q-slide-transition>
          <div v-show="isExpanded(country.id)">
            <q-separator class="q-my-md" />

            <template v-if="hasCities(country.id)">
              <q-table
                flat
                :loading="loadingCities"
                separator="none"
                table-header-class="bg-grey-2 text-grey-8"
                :rows="currentCities(country.id)"
                :columns="columns"
                row-key="id"
                hide-pagination
              >
                <template v-slot:body-cell-opt="props">
                  <q-td :props="props" style="width: 130px">
                    <div class="flex justify-end items-center q-gutter-x-xs">
                      <q-btn
                        flat
                        dense
                        color="primary"
                        @click="emit('edit', props.row)"
                      >
                        <img src="/icons/edit.svg" alt="Editar" />
                      </q-btn>
                      <q-btn
                        flat
                        dense
                        color="negative"
                        @click="emit('confirm-delete-row', props.row)"
                      >
                        <img src="/icons/trash-2.svg" alt="Eliminar" />
                      </q-btn>
                    </div>
                  </q-td>
                </template>
              </q-table>
            </template>

            <div v-else class="text-grey-6 q-pa-md text-center">
              <p>No hay ciudades registradas</p>
              <q-btn
                color="primary"
                icon="add"
                label="Agregar ciudad"
                no-caps
                @click.stop="emit('show-create-modal', country)"
                class="q-px-lg text-center"
              />
            </div>
          </div>
        </q-slide-transition>
      </q-card>
    </div>

    <div class="flex justify-end items-center q-mt-md">
      <q-pagination
        v-model="currentPage"
        color="grey-9"
        active-color="primary"
        :max="maxPages"
        :max-pages="8"
        size="md"
        gutter="10px"
        direction-links
        @update:model-value="handlePageChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { columns } from "./ColumnsCities";
import { City, Country, Pagination } from "../../../types/cities.types";

interface Props {
  cities: City[];
  countries: Country[];
  pagination: Pagination;
  showCities: any;
  loadingCities: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: "update:pagination", value: Pagination): void;
  (e: "show-create-modal", country: Country): void;
  (e: "edit", city: City): void;
  (e: "confirm-delete-row", city: City): void;
  (e: "fetch-cities", countryId: number): void;
}>();

const selectedCountryId = ref<number | null>(null);

const currentPage = computed({
  get: () => props.pagination.page,
  set: (value) => handlePageChange(value),
});

const maxPages = computed(() => Math.max(props.pagination.last_page || 1, 1));

const citiesCount = (countryId: number) => props.showCities[countryId]?.length;

const hasCities = (countryId: number) => citiesCount(countryId) > 0;

const currentCities = (countryId: number) => props.showCities[countryId] || [];

const toggleCountry = (id: number) => {
  selectedCountryId.value = selectedCountryId.value === id ? null : id;
  emit("fetch-cities", id);
};

const isExpanded = (id: number) => selectedCountryId.value === id;

const handlePageChange = (newPage: number) => {
  const updatedPagination = { ...props.pagination, page: newPage };
  emit("update:pagination", updatedPagination);
};
</script>

<style scoped>
.q-card {
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
  }
}

.expand-icon {
  transition: transform 0.3s ease;

  &--rotated {
    transform: rotate(180deg);
  }
}
</style>
