<template>
  <div>
    <q-table
      flat separator="none"
      table-header-class="control-table-header"
      :rows="cities.data || []"
      :columns="columns"
      row-key="client_id"
      v-model:pagination="props.pagination"
      rowsPerPageLabel="Registros por página"
      no-data-label="No se ha encontrado datos"
      hide-pagination
    >
      <template v-slot:body-cell-country="props">
        <q-td :props="props">
          {{ props.row.country?.name || "N/A" }}
        </q-td>
      </template>
      <template v-slot:body-cell-client_name="props">
        <td :props="props">
          <div class="cursor-pointer">
            <div class="text-sm font-medium text-blue-7">
              {{ props.row.name }}
            </div>
          </div>
        </td>
      </template>
      <template #body-cell-opt="props">
        <td :props="props" style="width: 130px">
          <div class="flex justify-end items-center q-gutter-x-xs">
            <q-btn
              flat
              dense
              color="primary"
              @click="$emit('edit', props.row)"
            >
              <img src="/icons/edit.svg" alt="" />
            </q-btn>
            <q-btn
              flat
              dense
              color="negative"
              @click="$emit('confirm-delete-row', props.row)"
            >
              <img src="/icons/trash-2.svg" alt="" />
            </q-btn>
          </div>
        </td>
      </template>
    </q-table>
    <div class="flex justify-end items-center q-mt-md">
      <q-pagination
        v-model="props.pagination.page"
        color="grey-9"
        active-color="primary"
        :max="maxPages"
        :max-pages="8"
        size="md"
        gutter="10px"
        direction-links
        icon-first="keyboard_double_arrow_left"
        icon-last="keyboard_double_arrow_right"
        icon-prev="chevron_left"
        icon-next="chevron_right"
        @update:model-value="sendEmitPagination"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { columns } from "./ColumnsCities";

import { useRouter } from "vue-router";

const router = useRouter();

const props = defineProps<{
  cities: any;
  pagination: any;
}>();


const emits = defineEmits([
  "toggle-city",
  "show-city-details",
  "edit",
  "confirm-delete-row",
  "update:pagination",
  "update-pagination",
]);

const sendEmitPagination = () => {
  emits("update-pagination", props.pagination);
};

const maxPages = computed(() => {
  const calculatedPages = Math.ceil(
    props.cities.total / props.pagination.rowsPerPage,
  );
  return calculatedPages;
});

const goToDetails = (id: number) => {
  console.log("id: ", id);
  router.push({ name: "ClientDetails", params: { id: id } });
};
</script>
