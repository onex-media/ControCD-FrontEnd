<template>
  <div class="draggable-list  full-width">
    <table class="full-width">
      <thead>
        <tr>
          <th class="tex-center">#</th>
          <th class="text-left">Nombre</th>
          <th class="text-left">Dirección</th>
          <th class="text-left">Email</th>
          <th class="text-left">Compañía</th>
          <th class="text-right">Total Crédito</th>
          <th></th>
        </tr>
      </thead>

      <draggable
        :list="localClients"
        tag="tbody"
        item-key="id"
        v-bind="dragOptions"
        @end="onDragEnd"
      >
        <template #item="{ element, index }">
          <tr
            :key="element.id"
            class="cursor-grab custom-row"
            :class="{ 'cursor-grabbing': isDragging }"
          >
            <td class="text-center vertical-top text-left" width="5%">
              <div class="cell-content">
                {{ padNumber(index + 1) }}
              </div>
            </td>

            <td class="vertical-top text-left" width="10%">
              <div class="cell-content">
                <div class="text-weight-medium">{{ element.name }}</div>
                <div class="text-caption text-grey-7 q-mt-xs">
                  {{ element.idNumber }}
                </div>
              </div>
            </td>

            <td class="vertical-top" width="20%">
              <div class="cell-content">
                <div>{{ element.address }}</div>
                <div class="text-caption text-grey-7 q-mt-xs">
                  {{ element.city }}
                </div>
              </div>
            </td>

            <td class="vertical-top" width="20%">
              <div class="cell-content">
                <div>{{ element.email }}</div>
                <div class="text-caption text-grey-7 q-mt-xs">
                  {{ element.phone }}
                </div>
              </div>
            </td>

            <td class="vertical-top" width="20%">
              <div class="cell-content">
                <div>{{ element.company }}</div>
                <div class="text-caption text-grey-7 q-mt-xs">
                  {{ element.companyAddress }}
                </div>
              </div>
            </td>

            <td class="text-green-8 text-right vertical-top" width="10%">
              <div class="cell-content">
                <div class="text-weight-medium">
                  $ {{ formatCurrency(element.totalCredit) }}
                </div>
              </div>
            </td>

            <td class="vertical-top text-right" width="5%">
              <q-icon name="drag_indicator" class="drag-handle text-grey-6" />
            </td>
          </tr>
        </template>
      </draggable>
    </table>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import draggable from "vuedraggable";

const props = defineProps<{
  clients: any[];
}>();

const isDragging = ref(false);

const dragOptions = computed(() => ({
  animation: 200,
  disabled: false,
  ghostClass: "ghost-row",
  handle: ".drag-handle",
  onStart: () => {
    isDragging.value = true;
  },
  onEnd: () => {
    isDragging.value = false;
  },
}));

const emit = defineEmits(["update-order"]);

const localClients = ref([...props.clients]);

watch(localClients, (newVal) => {
  emit("update-order", newVal);
});

const padNumber = (num: number) => num.toString().padStart(2, "0");
const formatCurrency = (value: number) =>
  value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,");

watch(localClients, (newVal) => {
  emit("update-order", newVal);
});

const onDragEnd = () => {
  console.log("Posición actualizada");
};
</script>

<style scoped>
thead th {
  background-color: #f5f5f5 !important;
  border: none !important;
  padding: 12px 16px !important;
}

table {
  border-collapse: collapse;
}

.custom-row td {
  border: none !important;
  padding: 12px 16px !important;
}

/* Elimina el borde de las filas */
.custom-row {
  border: none !important;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  margin: 0;
}

/* Ajusta el espaciado entre filas */
.draggable-list {
  width: 100%;
  border-spacing: 0 8px;
}



/* Asegura que las celdas tengan el mismo alineamiento vertical */
th,
td {
  vertical-align: middle !important;
}
.custom-row {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  margin: 4px 0;
  background: white;
  height: 100%; /* Altura completa para la fila */
}

.custom-row td {
  padding: 12px 16px !important;
  border: none !important;
  vertical-align: top;
  height: 100%; /* Altura heredada */
}

.cell-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

/* Asegurar que la tabla ocupe todo el espacio */
table {
  table-layout: fixed;
  border-collapse: collapse;
  width: 100%;
}

/* Mantener los otros estilos necesarios */
.draggable-list {
  width: 100%;
}

.text-caption {
  font-size: 0.8rem;
}
.draggable-list {
  width: 100%;
}

table {
  table-layout: fixed;
  border-collapse: collapse;
}

.custom-row td {
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
}

.full-width {
  width: 100%;
}

.custom-row {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  margin: 4px 0;
  background: white;
  display: table-row;
}
.custom-table {
  border-collapse: separate;
  border-spacing: 0 8px;
}

.custom-table thead th {
  border: none !important;
  font-size: 14px;
  color: #666;
  background: #f8f9fa;
}

.custom-row {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  margin: 4px 0;
  background: white;
}

.custom-row td {
  padding: 12px 16px !important;
  border: none !important;
  vertical-align: top;
}

.vertical-top {
  vertical-align: top;
}

.text-caption {
  font-size: 0.8rem;
}

.drag-handle {
  font-size: 24px;
  cursor: grab;
  opacity: 0.6;
  transition: opacity 0.3s;
}

.drag-handle:hover {
  opacity: 1;
}

.ghost-row {
  opacity: 0.5;
  background: #c8ebfb;
}

.flip-list-move {
  transition: transform 0.5s;
}

.drag-handle {
  font-size: 24px;
  cursor: grab;
}

.cursor-grab {
  cursor: grab;
}

.cursor-grabbing {
  cursor: grabbing;
}

.q-table tbody tr {
  transition:
    transform 0.2s,
    box-shadow 0.2s;
  background: white;
}

.q-table tbody tr:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>
<!-- <template>
  <div class="q-pa-md">
    <q-table
      class="custom-table full-width"
      :rows="localClients"
      :columns="columns"
      flat
      bordered
      hide-pagination
      hide-bottom
      row-key="id"
    >
    <template #body="props">
      <draggable
          :list="localClients"
          tag="tbody"
          item-key="id"
          v-bind="dragOptions"
          handle=".drag-handle"
          @end="onDragEnd"
        >
          <template #item="{ element, index }">
            <tr
              :key="element.id"
              class="cursor-grab custom-row"
              :class="{ 'cursor-grabbing': isDragging }"
            >
              <td class="text-center vertical-top">{{ padNumber(index + 1) }}</td>
              <td class="vertical-top">
                <div class="text-weight-medium">{{ element.name }}</div>
                <div class="text-caption text-grey-7 q-mt-xs">
                  {{ element.idNumber }}
                </div>
              </td>
              <td class="vertical-top">
                <div>{{ element.address }}</div>
                <div class="text-caption text-grey-7 q-mt-xs">
                  {{ element.city }}
                </div>
              </td>
              <td class="vertical-top">
                <div>{{ element.email }}</div>
                <div class="text-caption text-grey-7 q-mt-xs">
                  {{ element.phone }}
                </div>
              </td>
              <td class="vertical-top">
                <div>{{ element.company }}</div>
                <div class="text-caption text-grey-7 q-mt-xs">
                  {{ element.companyAddress }}
                </div>
              </td>
              <td class="text-green-8 vertical-top">
                <div class="text-weight-medium">
                  $ {{ formatCurrency(element.totalCredit) }}
                </div>
              </td>
              
              <td class="vertical-top">
                <q-icon
                  name="drag_indicator"
                  class="drag-handle text-grey-6"
                  @mousedown.prevent
                />
              </td>
            </tr>
          </template>
        </draggable>
      </template>
    </q-table>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import draggable from "vuedraggable";

columns: [
  { name: 'index', label: '#', align: 'center' },
  { name: 'nameId', label: 'Name/ID' },
  { name: 'addressCity', label: 'Address/City' },
  { name: 'emailPhone', label: 'Contact' },
  { name: 'companyInfo', label: 'Company' },
  { name: 'credit', label: 'Credit', align: 'right' },
  { name: 'actions', label: '' } // For drag handle
]

/* const columns = [
  {
    name: "index",
    label: "N°",
    align: "left" as const,
    field: (row: any) => row.id,
    style: "width: 50px",
  },
  {
    name: "client",
    label: "Cliente",
    align: "left" as const,
    field: (row: any) => row.name,
    style: "width: 200px",
  },
  {
    name: "address",
    label: "Dirección",
    align: "left" as const,
    field: "address",
    style: "width: 250px",
  },
  {
    name: "contact",
    label: "Contacto",
    align: "left" as const,
    field: "email",
    style: "width: 200px",
  },
  {
    name: "company",
    label: "Empresa",
    align: "left" as const,
    field: "company",
    style: "width: 200px",
  },
  {
    name: "value",
    label: "Valor total crédito",
    align: "right" as const,
    field: "totalCredit",
    style: "width: 150px",
  },
  {
  name: "handle",
  label: "",
  field: "dragHandle",
  style: "width: 50px; cursor: grab",
}
]; */

const props = defineProps<{
  clients: Array<{
    id: string | number;
    name: string;
    idNumber: string;
    address: string;
    city: string;
    email: string;
    phone: string;
    company: string;
    companyAddress: string;
    totalCredit: number;
  }>;
}>();
const emit = defineEmits(["update-order"]);
const isDragging = ref(false);

const localClients = ref([...props.clients]);

const dragOptions = computed(() => ({
  animation: 200,
  ghostClass: "ghost-row",
  chosenClass: "chosen-row",
  dragClass: "drag-row",
  group: "clients",
  forceFallback: true,
  onStart: () => (isDragging.value = true),
  onEnd: () => (isDragging.value = false)
}));

const padNumber = (num: number) => num.toString().padStart(2, "0");
const formatCurrency = (value: number) =>
  value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,");

watch(localClients, (newVal) => {
  emit("update-order", newVal);
});

const onDragEnd = () => {
  console.log("Posición actualizada");
};
</script>

<style scoped>
.chosen-row {
  background: #f0f0f0;
  opacity: 0.8;
}

.drag-row {
  cursor: grabbing;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.flip-list-move {
  transition: transform 0.5s;
}

.flip-list-enter-active,
.flip-list-leave-active {
  transition: all 0.5s;
}

.flip-list-enter-from,
.flip-list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
.custom-table {
  border-collapse: separate;
  border-spacing: 0 8px;
}

.custom-table thead th {
  border: none !important;
  font-size: 14px;
  color: #666;
  background: #f8f9fa;
}

.custom-row {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  margin: 4px 0;
  background: white;
}

.custom-row td {
  padding: 12px 16px !important;
  border: none !important;
  vertical-align: top;
}

.vertical-top {
  vertical-align: top;
}

.text-caption {
  font-size: 0.8rem;
}

.drag-handle {
  font-size: 24px;
  cursor: grab;
  opacity: 0.6;
  transition: opacity 0.3s;
}

.drag-handle:hover {
  opacity: 1;
}

.ghost-row {
  opacity: 0.5;
  background: #c8ebfb;
}

.flip-list-move {
  transition: transform 0.5s;
}

.drag-handle {
  font-size: 24px;
  cursor: grab;
}

.cursor-grab {
  cursor: grab;
}

.cursor-grabbing {
  cursor: grabbing;
}

.q-table tbody tr {
  transition:
    transform 0.2s,
    box-shadow 0.2s;
  background: white;
}

.q-table tbody tr:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>
 -->
