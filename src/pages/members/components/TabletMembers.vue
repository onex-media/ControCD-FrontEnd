<template>
  <section>
    <q-table flat separator="none" table-header-class="control-table-header" :rows="dataMembers.data || []"
      :columns="columns" row-key="id" v-model:pagination="props.paginationMembers"
      rowsPerPageLabel="Registros por página" no-data-label="No se ha encontrado datos" hide-pagination>
      <template #body-cell-name="props">
        <td :props="props">
          <div class="cursor-pointer" @click="goToDetails(props.row.id)">
            <div class="table-title">
              {{ props.row.name }}
            </div>
            <div class="table-subtitle">
              {{ props.row.identification }}
            </div>
          </div>
        </td>
      </template>
      <template #body-cell-active="props">
        <td :props="props" style="width: 80px">
          <ToggleButtom v-model="props.row.status" @update:model-value="$emit('toggle-member', props.row)" />
        </td>
      </template>
      <template #body-cell-role="props">
        <td :props="props">
          <span class="table-chip">
            {{
              getRoleLabel(props.row.role_id)
            }}
            <figure>
              <GlassesIcon />
            </figure>
          </span>
        </td>
      </template>
      <template #body-cell-address="props">
        <td :props="props">
          <div class="table-title">
            {{ props.row.address }}
          </div>
          <div class="table-subtitle">{{ props.row.city?.name || 'No posee' }}</div>
        </td>
      </template>
      <template #body-cell-routes="props">
        <td :props="props">
          <div v-if="props.row.routes.length">
            <div v-for="route in props.row.routes" :key="route.id">
              <div class="table-title">{{ route.name }}</div>
              <div class="table-subtitle">{{ route.sector }}</div>
            </div>
          </div>
          <div v-else class="text-sm text-gray-500"></div>
        </td>
      </template>
      <template #body-cell-email="props">
        <td :props="props">
          <div class="table-title">{{ props.row.email }}</div>
          <div class="table-subtitle">{{ props.row.phone }}</div>
        </td>
      </template>

      <template #body-cell-opt="props">
        <td :props="props" style="width: 130px">
          <div class="flex justify-end items-center q-gutter-x-xs">
            <q-btn flat dense color="primary" @click="$emit('edit-member', props.row)">
              <img src="/icons/edit.svg" alt="" />
            </q-btn>
            <q-btn flat dense color="negative" @click="$emit('confirm-delete-member', props.row)">
              <img src="/icons/trash-2.svg" alt="" />
            </q-btn>
          </div>
        </td>
      </template>
    </q-table>
    <div class="flex justify-end items-center q-mt-md">
      <q-pagination v-model="paginationMembers.page" color="grey-9" active-color="primary" :max="maxPages"
        :max-pages="8" size="md" gutter="10px" direction-links icon-first="keyboard_double_arrow_left"
        icon-last="keyboard_double_arrow_right" icon-prev="chevron_left" icon-next="chevron_right"
        @update:model-value="sendEmitPagination" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, watch } from "vue";
import { columns } from "./ColumnsMembers";
import { Role } from "@/types/roles.types";
import { useRouter } from "vue-router";
import ToggleButtom from "src/components/ToggleButtom.vue";
import GlassesIcon from "src/components/assets/GlassesIcon.vue";
import { DataMembers, MemberForm } from "@/types/members.types";

const emits = defineEmits<{
  (e: "edit-member", member: MemberForm): void;
  (e: "confirm-delete-member", member: MemberForm): void;
  (e: "toggle-member", member: MemberForm): void;
  (e: "update-pagination", paginationMembers: any): void;
  (e: "show-create-modal"): void;
}>();

const router = useRouter();

const sendEmitPagination = () => {
  emits("update-pagination", props.paginationMembers);
};

const maxPages = computed(() => {
  const calculatedPages = Math.ceil(
    props.dataMembers.total / props.paginationMembers.rowsPerPage
  );
  return calculatedPages;
});

const props = defineProps<{
  dataMembers: DataMembers;
  paginationMembers: any;
  roles: Role[];
}>();

const getRoleLabel = (role_id: number) => {
  const role = props.roles.find((role) => role.id === role_id);
  return role ? role.name : "Desconocido";
};

const goToDetails = (id: number) => {
  router.push({ name: "UserDetails", params: { id: id } });
};
</script>

<style scoped></style>
