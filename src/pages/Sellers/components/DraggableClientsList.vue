<template>
  <div class="draggable-list full-width">
    <table class="full-width">
      <thead>
        <tr>
          <th class="text-center" width="5%">#</th>
          <th class="text-left" width="10%">Nombre</th>
          <th class="text-left" width="20%">Dirección</th>
          <th class="text-left" width="20%">Email</th>
          <th class="text-left" width="20%">Compañía</th>
          <th class="text-right" width="10%">Total Crédito</th>
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
            <td class="vertical-top" width="5%">
              <div
                class="cell-content-draggable"
                style="display: flex; align-items: center; gap: 8px"
              >
                <q-icon
                  name="drag_indicator"
                  class="drag-handle text-grey-6"
                  style="cursor: grab; flex-shrink: 0"
                   size="30px"
                />
                <div>{{ padNumber(index + 1) }}</div>
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
.drag-handle {
  font-size: 20px;
  opacity: 0.6;
  transition: opacity 0.3s;
}

.drag-handle:hover {
  opacity: 1;
}

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

.custom-row {
  border: none !important;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  margin: 0;
}

.draggable-list {
  width: 100%;
  border-spacing: 0 8px;
}

th,
td {
  vertical-align: middle !important;
}

.custom-row {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  margin: 4px 0;
  background: white;
  height: 100%;
}

.custom-row td {
  vertical-align: top;
  height: 100%;
}

.cell-content-draggable {
  height: 100%;
  display: flex;
  justify-content: center;
}

.cell-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

table {
  table-layout: fixed;
  border-collapse: collapse;
  width: 100%;
}

.draggable-list {
  width: 100%;
}

.text-caption {
  font-size: 0.8rem;
}

.ghost-row {
  opacity: 0.5;
  background: #c8ebfb;
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
