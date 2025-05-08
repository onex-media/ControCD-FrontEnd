<template>
  <section>
    <q-table
      flat
      bordered
      table-header-class="bg-grey-1 text-grey-8"
      :rows="data.data || []"
      :columns="columns"
      v-model:pagination="props.paginationRoutes"
      row-key="id"
      rowsPerPageLabel="Registros por página"
      no-data-label="No se ha encontrado datos"
      hide-pagination
    >
      <template #body-cell-active="props">
        <td :props="props">
          <q-toggle
            true-value="ACTIVE"
            false-value="INACTIVE"
            v-model="props.row.status"
            color="primary"
            @update:model-value="$emit('toggle-route', props.row)"
          />
        </td>
      </template>

      <template #body-cell-name="props">
        <td :props="props">
          <div class="">
            <div class="text-sm font-medium text-gray-900">
              {{ props.row.name }}
            </div>
            <div class="text-sm text-gray-500">
              {{ props.row.sector }}
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
              @click="$emit('edit-row', props.row)"
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
        v-model="paginationRoutes.page"
        color="grey-9"
        active-color="primary"
        :max="maxPages || 1"
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
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { columns } from "./ColumnsRoutes";
import { useMembers } from "src/composables/useMembers";
import { dataRoutes, Route } from "src/types/routes.type";

const { search } = useMembers();
const emits = defineEmits<{
  (e: "edit-row", route: Route): void;
  (e: "confirm-delete-row", route: Route): void;
  (e: "toggle-route", route: Route): void;
  (e: "update-pagination", pagination: any): void;
  (e: "show-create-modal"): void;
}>();

const sendEmitPagination = () => {
  emits("update-pagination", props.paginationRoutes);
};

const maxPages = computed(() => {
  if (!props.data.total) return;
  const calculatedPages = Math.ceil(
    props.data.total / props.paginationRoutes.rowsPerPage
  );
  return calculatedPages;
});

const props = defineProps<{
  data: dataRoutes;
  paginationRoutes: any;
}>();
</script>

<style scoped></style>
