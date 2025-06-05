<template>
  <section class="q-pa-md">
    <q-table
      flat
      separator="none"
      table-header-class="control-table-header"
      :rows="settlements"
      :columns="columns"
      row-key="id"
      @row-click="onRowClick"
      rows-per-page-label="Filas por página"
      :pagination-label="(first, end, total) => `${first}-${end} de ${total}`"
      no-data-label="No hay datos disponibles"
      loading-label="Cargando..."
    >
      <template #body-cell-actions="props">
        <q-td :props="props" class="q-gutter-xs">
          <q-btn
            dense
            round
            color="primary"
            icon="visibility"
            @click="viewDetails(props.row)"
          />
        </q-td>
      </template>
      <template #body-cell-status="props">
        <q-td :props="props" align="center">
          <StatusChip :status="props.row.status" />
        </q-td>
      </template>
    </q-table>
    <q-dialog v-model="showDetailDialog">
      <q-card style="min-width: 80vw">
        <q-card-section class="row items-center q-mb-sm q-mt-md">
          <div class="text-h6">Detalles de Liquidación</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pt-none">
          <SettlementCard />
        </q-card-section>
      </q-card>
    </q-dialog>
  </section>
</template>

<script setup lang="ts">
import { ref } from "vue";
import SettlementCard from "./SettlementCard.vue";
import StatusChip from "./StatusChip.vue";

const formatCurrency = (val: number) => `$${val.toLocaleString()}`;

const showDetailDialog = ref(false);

const columns = [
  { name: "id", label: "Nro. de liquidación", field: "id", align: "left" },
  {
    name: "period",
    label: "Fecha Cierre / Fecha Inicio",
    field: "period",
    align: "left",
    format: (val: string) => val.replace("Periodo:", ""),
  },
  {
    name: "initial",
    label: "Caja inicial",
    field: "initial",

    format: formatCurrency,
  },
  {
    name: "final",
    label: "Caja Final",
    field: "final",
    format: formatCurrency,
  },
  {
    name: "payments",
    label: "Pagos",
    field: "payments",
    format: formatCurrency,
  },
  {
    name: "sales",
    label: "Ventas",
    field: "sales",
    format: formatCurrency,
  },
  {
    name: "income",
    label: "Ingreso",
    field: "income",
    format: formatCurrency,
  },
  {
    name: "expense",
    label: "Egreso",
    field: "expense",
    format: formatCurrency,
  },
  {
    name: "finalWallet",
    label: "Cartera final",
    field: "finalWallet",
    format: formatCurrency,
  },
  {
    name: "microinsurance",
    label: "Microseguro",
    field: "microinsurance",
    format: formatCurrency,
  },
  {
    name: "withdrawal",
    label: "Retiro",
    field: "withdrawal",
    format: formatCurrency,
  },
  {
    name: "status",
    label: "Estado",
    field: "status",
    align: "center",
    classes: (row: any) =>
      row.status === "Pagada"
        ? "text-positive"
        : row.status === "Pendiente"
          ? "text-warning"
          : "text-info",
  },
];

const settlements = ref([
  {
    id: "LQD-001",
    period: "31/03/2024 17:30:45 / 16/03/2024 08:00:00",
    initial: 1500000,
    final: 3250000,
    payments: 750000,
    sales: 1750000,
    income: 2200000,
    expense: 450000,
    finalWallet: 950000,
    microinsurance: 150000,
    withdrawal: 500000,
    status: "Pagada",
  },
  {
    id: "LQD-002",
    period: "31/03/2024 17:30:45 / 16/03/2024 08:00:00",
    initial: 2000000,
    final: 3850000,
    payments: 900000,
    sales: 1850000,
    income: 2450000,
    expense: 500000,
    finalWallet: 1100000,
    microinsurance: 180000,
    withdrawal: 600000,
    status: "Generada",
  },
  {
    id: "LQD-003",
    period: "31/03/2024 17:30:45 / 16/03/2024 08:00:00",
    initial: 2200000,
    final: 4100000,
    payments: 950000,
    sales: 1900000,
    income: 2600000,
    expense: 550000,
    finalWallet: 1200000,
    microinsurance: 200000,
    withdrawal: 650000,
    status: "Pendiente",
  },
  {
    id: "LQD-004",
    period: "31/03/2024 17:30:45 / 16/03/2024 08:00:00",
    initial: 2200000,
    final: 4100000,
    payments: 950000,
    sales: 1900000,
    income: 2600000,
    expense: 550000,
    finalWallet: 1200000,
    microinsurance: 200000,
    withdrawal: 650000,
    status: "Pendiente",
  },
  {
    id: "LQD-005",
    period: "31/03/2024 17:30:45 / 16/03/2024 08:00:00",
    initial: 2200000,
    final: 4100000,
    payments: 950000,
    sales: 1900000,
    income: 2600000,
    expense: 550000,
    finalWallet: 1200000,
    microinsurance: 200000,
    withdrawal: 650000,
    status: "Pendiente",
  },
  {
    id: "LQD-006",
    period: "31/03/2024 17:30:45 / 16/03/2024 08:00:00",
    initial: 2200000,
    final: 4100000,
    payments: 950000,
    sales: 1900000,
    income: 2600000,
    expense: 550000,
    finalWallet: 1200000,
    microinsurance: 200000,
    withdrawal: 650000,
    status: "Pendiente",
  },
]);

const onRowClick = (evt: Event, row: any) => {
  viewDetails(row);
};

const viewDetails = (row: any) => {
  showDetailDialog.value = true;
};
</script>
