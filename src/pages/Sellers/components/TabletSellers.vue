<template>
  <section>
    <q-table
      flat
      separator="none"
      table-header-class="control-table-header"
      :rows="props.data.data || []"
      :columns="columns"
      v-model:pagination="props.pagination"
      row-key="id"
      rowsPerPageLabel="Registros por página"
      no-data-label="No se ha encontrado datos"
      hide-pagination
      :row-class="'cursor-pointer'"
      @row-click="(evt, row) => $emit('row-clicked', row)"
    >
      <template #body-cell-seller="props">
        <q-td :props="props">
          <div class="row items-center gap-sm">
            <q-avatar size="40px" text-color="white" class="q-mr-sm">
              <template v-if="props.row.user?.profilePhoto?.path">
                <img
                  :src="`${props.row.user.profilePhoto.path}`"
                  alt="Avatar del vendedor"
                />
              </template>
              <template v-else>
                <img
                  src="/icons/profile-2.png"
                  alt="Avatar predeterminado"
                  style="width: 100%; height: 100%; object-fit: cover"
                />
              </template>
            </q-avatar>

            <span>
              {{ props.row.user?.name || "Sin asignar" }}
            </span>
          </div>
        </q-td>
      </template>
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

      <template v-slot:body-cell-user_routes="props">
        <q-td :props="props" class="text-center">
          <div
            class="row flex-center items-center q-gutter-xs"
            style="justify-content: center"
          >
            <div
              class="row items-center flex flex-center"
              style="margin-left: -8px"
            >
              <template
                v-for="(member, index) in props.row.user_routes"
                :key="index"
              >
                <div
                  v-if="index < 6"
                  class="relative-position"
                  :style="`z-index: ${6 - index}; margin-left: ${index > 0 ? '-8px' : '0'}`"
                >
                  <q-tooltip anchor="top middle" self="bottom middle">
                    {{ member.user?.name || "Nombre no disponible" }}
                  </q-tooltip>

                  <q-avatar
                    size="25px"
                    :color="['primary', 'secondary', 'accent'][index % 3]"
                    text-color="white"
                    class="cursor-help"
                  >
                    {{ (member.user?.name?.[0] || "?").toUpperCase() }}
                  </q-avatar>
                </div>
              </template>
            </div>

            <q-badge
              v-if="props.row.user_routes.length > 6"
              color="grey-6"
              :label="'+' + (props.row.user_routes.length - 6)"
              class="q-ml-sm"
            />

            <p
              v-if="props.row.user_routes.length === 0"
              class="q-ma-none text-grey-7"
            >
              Sin miembros
            </p>
          </div>
        </q-td>
      </template>

      <template #body-cell-opt="props">
        <td :props="props" style="width: 130px">
          <div class="flex justify-end items-center q-gutter-x-xs">
            <q-btn
              flat
              dense
              color="primary"
              @click.stop="$emit('edit-row', props.row)"
            >
              <img src="/icons/edit.svg" alt="" />
            </q-btn>
            <q-btn
              flat
              dense
              color="negative"
              @click.stop="$emit('confirm-delete-row', props.row)"
            >
              <img src="/icons/trash-2.svg" alt="" />
            </q-btn>
          </div>
        </td>
      </template>
    </q-table>
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
        icon-first="keyboard_double_arrow_left"
        icon-last="keyboard_double_arrow_right"
        icon-prev="chevron_left"
        icon-next="chevron_right"
        @update:model-value="handlePageChange"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { columns } from "./ColumnsSellers";
import { useMembers } from "src/composables/useMembers";
import { dataRoutes, Route } from "src/types/routes.type";

const { search } = useMembers();

const currentPage = computed({
  get: () => props.pagination.page,
  set: (value) => handlePageChange(value),
});
const emits = defineEmits<{
  (e: "edit-row", route: Route): void;
  (e: "confirm-delete-row", route: Route): void;
  (e: "toggle-route", route: Route): void;
  (e: "update:pagination", pagination: any): void;
  (e: "show-create-modal"): void;
  (e: "row-clicked", route: Route): void;
}>();

const maxPages = computed(() => Math.max(props.pagination.last_page || 1, 1));

const props = defineProps<{
  data: dataRoutes;
  pagination: any;
}>();

const handlePageChange = (newPage: number) => {
  const updatedPagination = { ...props.pagination, page: newPage };
  emits("update:pagination", updatedPagination);
};
</script>

<style scoped></style>
