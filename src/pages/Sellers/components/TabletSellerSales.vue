<template>
  <section>
    <q-table
      flat
      separator="none"
      table-header-class="control-table-header"
      :rows="dataSales"
      :columns="columns"
      row-key="id"
      hide-pagination
    >
      <template #body-cell-seguro="props">
        <q-td :props="props">
          <div class="text-sm">{{ props.row.seguro.numero }}</div>
          <div class="text-xs">${{ props.row.seguro.valor }}</div>
        </q-td>
      </template>
      <template #bottom-row>
        <q-tr class="bg-grey-3">
          <q-td :colspan="columns.length" class="text-center">
            <div class="row justify-center items-center">
              <span class="text-weight-bold text-grey-8 q-mr-sm"
                >Total abonado:</span
              >
              <span class="text-green text-weight-bold"
                >$ {{ formatNumber(totalAmount) }}</span
              >
            </div>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";

const props = defineProps<{
  dataSales: any;
}>();

const columns = ref([
  { name: "nombre", label: "Nombre", field: "nombre" },
  { name: "frecuencia", label: "Frecuencia", field: "frecuencia" },
  { name: "valorAnterior", label: "Valor Anterior", field: "valorAnterior" },
  { name: "documento", label: "Documento", field: "documento" },
  { name: "telefono", label: "Telefono", field: "telefono" },
  { name: "montoCredito", label: "Monto Credito", field: "montoCredito" },
  { name: "cuotas", label: "Cuotas", field: "cuotas" },
  { name: "interes", label: "% INT.", field: "interes" },
  { name: "valorCuota", label: "Valor Cuota", field: "valorCuota" },
  { name: "cuotaRestante", label: "Cuota Rest.", field: "cuotaRestante" },
  { name: "saldo", label: "Saldo", field: "saldo" },
  { name: "seguro", label: "Seguro", field: "seguro" },
]);

const formatNumber = (num: number) => {
  return num.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};
const totalAmount = computed(() => {
  return props.dataSales.reduce(
    (sum: number, item: any) => sum + item.valorCuota,
    0,
  );
});
</script>
