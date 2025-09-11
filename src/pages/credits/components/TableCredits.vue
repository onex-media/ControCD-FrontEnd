<template>
  <div>
    <q-table
      flat
      bordered
      table-header-class="bg-grey-1 text-grey-8"
      :rows="credits.data || []"
      :columns="columns"
      row-key="client_id"
      v-model:pagination="props.pagination"
      rowsPerPageLabel="Registros por página"
      no-data-label="No se ha encontrado datos"
      hide-pagination
    >
      <template v-slot:body-cell-client_name="props">
        <td :props="props">
          <div class="cursor-pointer" @click="goToDetails(props.row.client_id)">
            <div class="text-sm font-medium text-blue-7">
              {{ props.row.client.name }}
            </div>
            <div class="text-sm text-gray-500">
              <span class="text-caption">Ident:</span>
              {{ props.row.client.dni }}
            </div>
          </div>
        </td>
      </template>

      <template v-slot:body-cell-address="props">
        <q-td :props="props">
          <div class="text-sm text-gray-900">
            {{ props.row.client.address }}
          </div>
        </q-td>
      </template>

      <template v-slot:body-cell-total_credits="props">
        <q-td :props="props">
          <div class="text-primary">
            {{ props.row.total_credits }}
          </div>
        </q-td>
      </template>

      <template v-slot:body-cell-credit_value="props">
        <q-td :props="props">
          <div class="text-sm text-gray-900">
            $ ({{ props.row.credit_value }})
          </div>
        </q-td>
      </template>

      <!-- <template v-slot:body-cell-acciones="props">
      <q-td :props="props">
        <div class="flex justify-end items-center">
          <q-btn
            flat
            round
            dense
            color="primary"
            @click="showCreditDetails(props.row)"
          >
            <img src="/icons/Scales.svg" alt="" />
          </q-btn>
          <q-btn flat round dense color="dark" icon="more_horiz">
            <q-menu>
              <q-list style="min-width: 100px">
                <q-item clickable v-close-popup @click="editCredit(props.row)">
                  <img src="/icons/edit.svg" class="mr-4" alt="" />
                  <q-item-section>Editar</q-item-section>
                </q-item>
                <q-item
                  clickable
                  v-close-popup
                  @click="confirmDeleteCredit(props.row)"
                >
                  <img src="/icons/trash-2.svg" class="mr-4" alt="" />
                  <q-item-section class="text-negative"
                    >Eliminar</q-item-section
                  >
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>
      </q-td>
    </template> -->
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
import { columns } from "./ColumnsCredits";

import { useRouter } from "vue-router";

const router = useRouter();

const props = defineProps<{
  credits: any;
  pagination: any;
}>();

const emits = defineEmits([
  "toggle-credit",
  "show-credit-details",
  "edit-credit",
  "confirm-delete-credit",
  "update:pagination",
  "update-pagination",
]);

const sendEmitPagination = () => {
  emits("update-pagination", props.pagination);
};

const maxPages = computed(() => {
  const calculatedPages = Math.ceil(
    props.credits.total / props.pagination.rowsPerPage
  );
  return calculatedPages;
});

const goToDetails = (id: number) => {
  console.log("id: ", id);
  router.push({ name: "ClientDetails", params: { id: id } });
};
</script>
