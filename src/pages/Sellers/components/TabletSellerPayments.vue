<template>
  <section>
    <q-table
      flat
      separator="none"
      table-header-class="control-table-header"
      :rows="dataPayments"
      :columns="columns"
      row-key="id"
      hide-pagination
    >
      <template #body-cell-acciones="props">
        <q-td :props="props">
          <q-btn
            flat
            dense
            color="primary"
            label="Ver Historial"
            @click="$emit('view-history', props.row)"
          />
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
  dataPayments: any;
}>();

const columns = ref([
  { name: "cedula", label: "Cedula", field: "cedula", align: "left" },
  { name: "nombre", label: "Nombre", field: "nombre" },
  { name: "observaciones", label: "Observaciones", field: "observaciones" },
  {
    name: "cuotas",
    label: "Cuotas",
    field: (row) => `${row.cuotaActual}/${row.totalCuotas}`,
  },
  { name: "tipo", label: "Tipo", field: "tipo" },
  { name: "formaPago", label: "Forma de Pago", field: "formaPago" },
  { name: "montoVenta", label: "Monto de Venta", field: "montoVenta" },
  { name: "abonado", label: "Abonado", field: "abonado" },
  { name: "fecha", label: "Fecha/Hora", field: "fecha" },
  { name: "saldo", label: "Saldo", field: "saldo" },
  { name: "visitas", label: "Visitas", field: "visitas" },
  { name: "frecuencia", label: "Frecuencia", field: "frecuencia" },
  { name: "acciones", label: "Acciones", align: "right" },
]);

const formatNumber = (num: number) => {
  return num.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};
const totalAmount = computed(() => {
  return props.dataPayments.reduce(
    (sum: number, item: any) => sum + item.abonado,
    0,
  );
});
</script>
