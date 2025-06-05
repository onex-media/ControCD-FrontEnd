<template>
  <section>
    <div class="q-mb-md full-width container-app">
      <div class="flex justify-between full-width">
        <q-btn
          v-for="option in typeOptions"
          :key="option.value"
          flat
          no-caps
          :label="option.label"
          :color="'dark'"
          class="text-weight-medium full-width"
          @click="currentType = option.value"
          style="flex: 1"
        >
          <div
            class="underline-indicator"
            :class="{ active: currentType === option.value }"
          />
        </q-btn>
      </div>
    </div>

    <div
      v-if="currentType === 'income'"
      class="flex justify-end items-center q-mb-md"
    >
      <div class="flex gap-4">
        <div>
          <q-input
            outlined
            dense
            v-model="search"
            placeholder="Buscar"
            bg-color="white"
            debounce="500"
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>
      </div>
    </div>

    <q-table
      flat
      separator="none"
      table-header-class="control-table-header"
      :rows="currentData"
      :columns="columns"
      row-key="id"
      hide-pagination
    >
      <template v-if="currentType === 'income'" #body-cell-date="props">
        <q-td :props="props" class="q-py-sm">
          <div class="text-caption">{{ formatDate(props.row.date) }}</div>
          <div class="text-caption text-grey-7">{{ props.row.time }}</div>
        </q-td>
      </template>

      <template v-if="currentType === 'income'" #body-cell-description="props">
        <q-td :props="props" class="ellipsis-cell">
          {{ truncateText(props.row.description, 40) }}
        </q-td>
      </template>

      <template v-if="currentType === 'expense'" #body-cell-name="props">
        <q-td :props="props" class="text-weight-medium">
          {{ props.row.name }}
        </q-td>
      </template>

      <template #body-cell-amount="props">
        <q-td :props="props" align="right">
          <span :class="currentType === 'income' ? 'text-green' : 'text-red'">
            $ {{ formatNumber(props.row.amount) }}
          </span>
        </q-td>
      </template>

      <template #bottom-row>
        <q-tr class="bg-grey-3">
          <q-td :colspan="columns.length" class="text-center">
            <div class="row justify-center items-center">
              <span class="text-weight-bold text-grey-8 q-mr-sm">
                Total
                {{ currentType === "income" ? "ingresos" : "gastos" }}:</span
              >
              <span
                :class="currentType === 'income' ? 'text-green' : 'text-red'"
              >
                $ {{ formatNumber(totalAmount) }}
              </span>
            </div>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

const props = defineProps<{
  incomes: any[];
  expenses: any[];
}>();

const emit = defineEmits(["edit", "delete"]);
const search = ref("");

const currentType = ref<"income" | "expense">("income");
const typeOptions = [
  { label: "Ingresos", value: "income" },
  { label: "Egresos", value: "expense" },
];
const columns = computed(() => {
  return currentType.value === "income"
    ? [
        { name: "date", label: "Fecha / Hora", field: "date", align: "left" },
        { name: "route", label: "Ruta", field: "route", align: "left" },

        {
          name: "description",
          label: "Descripción",
          field: "description",
          align: "left",
        },
        { name: "amount", label: "Valor", field: "amount", align: "center" },
      ]
    : [
        { name: "name", label: "Nombre", field: "name", align: "left" },
        { name: "category", label: "Categoria", field: "category" },
        { name: "routes", label: "Rutas", field: "routes" },
        { name: "amount", label: "Gastos", field: "amount", align: "right" },
      ];
});

const currentData = computed(() => {
  return currentType.value === "income" ? props.incomes : props.expenses;
});

const formatNumber = (num: number) => {
  return num.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("es-ES");
};

const truncateText = (text: string, maxLength: number) => {
  return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
};

const totalAmount = computed(() => {
  return currentData.value.reduce((sum, item) => sum + item.amount, 0);
});
const editItem = (item: any) => {
  emit("edit", item);
};

const deleteItem = (item: any) => {
  emit("delete", item);
};
</script>

<style lang="scss" scoped>
.q-pa-md.q-mb-md {
  width: 100%;
  padding-left: 0;
  padding-right: 0;

  .flex.justify-between {
    width: 100%;
    gap: 1px;
  }
}

.q-btn {
  flex: 1;
  position: relative;
  padding: 16px 0;
  font-size: 1rem;
  border-radius: 0;
  overflow: visible;

  &:hover:not(.active) {
    background: rgba(0, 0, 0, 0.05);
  }
}

.underline-indicator {
  position: absolute;
  bottom: -2px;
  left: 0;
  right: 0;
  height: 3px;
  background: transparent;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: center;

  &.active {
    background: var(--q-primary);
    height: 4px;
    bottom: -3px;
  }
}

.active {
  transform: scaleX(1);
  animation: underline-grow 0.3s ease;
}

@keyframes underline-grow {
  from {
    transform: scaleX(0.9);
  }
  to {
    transform: scaleX(1);
  }
}
.q-table {
  thead tr th {
    font-size: 0.9rem;
    color: #424242;
    background-color: #f5f5f5;
    text-transform: uppercase;
  }

  tbody td {
    vertical-align: middle;
    padding: 12px 16px;
  }

  .text-green {
    color: #4caf50;
  }

  .text-red {
    color: #f44336;
  }
}

.q-tr--bottom {
  border-top: 2px solid rgba(0, 0, 0, 0.12);
}

.ellipsis-cell {
  max-width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.q-py-sm {
  padding-top: 4px;
  padding-bottom: 4px;
}

.text-green {
  color: #4caf50;
}

.text-red {
  color: #f44336;
}
</style>
