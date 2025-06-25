<template>
  <div class="row q-col-gutter-md">
    <div class="col-12 col-md-6">
      <SectionItem title="Caja Inicial" value="0.00" icon="point_of_sale" custom-class="grey-card">
      </SectionItem>
    </div>

    <div class="col-12 col-md-6">
      <SectionItem title="Caja final" value="2200.00" custom-class="green-card" icon="inventory" color="secondary" />
    </div>



    <div class="col-12 col-md-3">
      <SectionItem title="Pagos" value="0.00" custom-class="green-card" color="secondary" height="100px" icon="payments"
        :clickable="true" @click="handleCardClick('pagos', $event)" />
    </div>
    <div class="col-12 col-md-3">
      <SectionItem title="Ingreso" value="0.00" custom-class="green-card" color="secondary" height="100px"
        icon="payments" :clickable="true" @click="handleCardClick('ingreso', $event)" />
    </div>

    <div class="col-12 col-md-3">
      <SectionItem title="Ventas" value="100.00" custom-class="card-white" height="100px" icon="point_of_sale"
        :clickable="true" @click="handleCardClick('ventas', $event)" />
    </div>
    <div class="col-12 col-md-3">
      <SectionItem title="Egresos" value="0.00" custom-class="card-white" height="100px" icon="trending_down"
        :clickable="true" @click="handleCardClick('egresos', $event)" />
    </div>

    <div class="col-12 col-md-6">
      <SectionItem custom-class="card-white" height="110px">
        <template #additional-content>
          <div class="row q-col-gutter-xs">
            <div v-for="(stat, index) in clientStatsFirst" :key="index"
              class="col-12 col-sm-12 col-md-12 flex justify-between items-center">
              <div class="text-caption text-blue-grey-7 flex items-center">
                <q-icon :name="stat.icon" size="20px" color="black" class="mr-2" />
                {{ stat.label }}:
              </div>
              <div class="text-subtitle2">{{ stat.value }}</div>
            </div>
          </div>
        </template>
      </SectionItem>
    </div>
    <div class="col-12 col-md-6">
      <SectionItem custom-class="card-white" height="110px">
        <template #additional-content>
          <div class="row q-col-gutter-xs">
            <div v-for="(stat, index) in clientStatsSecond" :key="index"
              class="col-12 col-sm-12 col-md-12 flex justify-between items-center">
              <div class="text-caption text-blue-grey-7 flex items-center">
                <q-icon :name="stat.icon" size="20px" color="black" class="mr-2" />
                {{ stat.label }}:
              </div>
              <div class="text-subtitle2">{{ stat.value }}</div>
            </div>
          </div>
        </template>
      </SectionItem>
    </div>
    <div class="col-12 col-md-4">
      <SectionItem title="Caja Microseguros" value="0.00" custom-class="blue-card" icon="point_of_sale"
        color="primary" />
    </div>
    <div class="col-12 col-md-4">
      <SectionItem title="Retiros de caja microseguros" value="0.00" custom-class="card-white" height="100px"
        icon="logout" :clickable="true" @click="handleCardClick('retiros', $event)" />
    </div>

    <div class="col-12 col-md-4">
      <SectionItem title="Ingreso de caja microseguros" value="0.00" custom-class="green-card" color="secondary"
        height="100px" icon="payments" :clickable="true" @click="handleCardClick('ingreso', $event)" />
    </div>

    <div class="col-12">
      <div class="text-h6 text-blue-grey-8">Observaciones</div>
      <q-card class="q-pa-sm shadow-none card-item">
        <q-card-section>
          <div class="text-body1 text-blue-grey-8">
            {{ observacionData }}
          </div>
        </q-card-section>
      </q-card>
    </div>
    <div class="col-12">
      <div class="q-mb-lg full-width container-app q-pa-md">
        <div class="row no-wrap q-col-gutter-xs">
          <div v-for="option in periodOptions" :key="option.value" class="col">
            <q-btn flat no-caps :label="option.label" color="dark" class="text-weight-medium full-width"
              @click="selectedTable = option.value">
              <div class="underline-indicator" :class="{ active: selectedTable === option.value }" />
            </q-btn>
          </div>
        </div>
      </div>
      <q-card flat>
        <q-card-section>
          <q-table v-if="selectedTable === 'pagos'" flat separator="none" table-header-class="control-table-header"
            :rows="pagos" :columns="columnsPagos" row-key="documento" rows-per-page-label="Filas por página"
            :pagination-label="(first, end, total) => `${first}-${end} de ${total}`
              " no-data-label="No hay datos disponibles" loading-label="Cargando..." />

          <q-table v-if="selectedTable === 'ventas'" flat separator="none" table-header-class="control-table-header"
            :rows="ventas" :columns="columnsVentas" row-key="documento" rows-per-page-label="Filas por página"
            :pagination-label="(first, end, total) => `${first}-${end} de ${total}`
              " no-data-label="No hay datos disponibles" loading-label="Cargando..." />

          <q-table v-if="selectedTable === 'ingreso'" flat separator="none" table-header-class="control-table-header"
            :rows="ingresosData" :columns="columns" row-key="id" rows-per-page-label="Filas por página"
            :pagination-label="(first, end, total) => `${first}-${end} de ${total}`
              " no-data-label="No hay datos disponibles" loading-label="Cargando..." />

          <q-table v-if="selectedTable === 'egresos'" flat separator="none" table-header-class="control-table-header"
            :rows="egresosData" :columns="columns" row-key="id" rows-per-page-label="Filas por página"
            :pagination-label="(first, end, total) => `${first}-${end} de ${total}`
              " no-data-label="No hay datos disponibles" loading-label="Cargando..." />

          <q-table v-if="selectedTable === 'retiros'" flat separator="none" table-header-class="control-table-header"
            :rows="retiros" :columns="columnsGenerico" row-key="id" rows-per-page-label="Filas por página"
            :pagination-label="(first, end, total) => `${first}-${end} de ${total}`
              " no-data-label="No hay datos disponibles" loading-label="Cargando..." />
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, reactive, ref, computed } from "vue";
import SectionItem from "./SectionItem.vue";

const selectedTable = ref("pagos");
const handleCardClick = (tableType: string, event: MouseEvent) => {
  event.stopPropagation();
  selectedTable.value = tableType;
  console.log("Tabla seleccionada:", tableType);
};

const periodOptions: any = [
  { value: "pagos", label: "Pagos" },
  { value: "ventas", label: "Ventas" },
  { value: "ingreso", label: "Ingreso" },
  { value: "egresos", label: "Egresos" },
  { value: "retiros", label: "Retiros" },
];

const observacionData = ref(
  `lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptate.`,
);

const columnsPagos: any = [
  { name: "documento", label: "Documento", field: "documento" },
  { name: "cliente", label: "Nombre del cliente", field: "cliente" },
  { name: "observaciones", label: "Observaciones", field: "observaciones" },
  { name: "cuotas", label: "Cuotas", field: "cuotas" },
  { name: "tipoPago", label: "Tipo de pago", field: "tipoPago" },
  { name: "formaPago", label: "Forma de pago", field: "formaPago" },
  { name: "montoVenta", label: "Monto de la venta", field: "montoVenta" },
  { name: "abonado", label: "Abonado", field: "abonado" },
  { name: "saldo", label: "Saldo", field: "saldo" },
  { name: "visita", label: "Visita", field: "visita" },
  {
    name: "frecuenciaPago",
    label: "Frecuencia de pago",
    field: "frecuenciaPago",
  },
  { name: "acciones", label: "Acciones", field: "acciones" },
];

const columnsVentas: any = [
  { name: "documento", label: "Documento", field: "documento" },
  { name: "cliente", label: "Nombre del cliente", field: "cliente" },
  {
    name: "frecuenciaPago",
    label: "Frecuencia de pago",
    field: "frecuenciaPago",
  },
  { name: "valorAnterior", label: "Valor anterior", field: "valorAnterior" },
  { name: "montoVenta", label: "Monto de la venta", field: "montoVenta" },
  { name: "cuotas", label: "Cuotas", field: "cuotas" },
  { name: "interes", label: "Int.", field: "interes" },
  { name: "montoInteres", label: "Monto de interes", field: "montoInteres" },
  { name: "valorCuota", label: "Valor de la cuota", field: "valorCuota" },
  { name: "fechaVenta", label: "Fecha de la venta", field: "fechaVenta" },
  {
    name: "cuotasRestantes",
    label: "Cuotas restantes",
    field: "cuotasRestantes",
  },
  { name: "saldo", label: "Saldo", field: "saldo" },
  { name: "seguro", label: "Nro. de seguro", field: "seguro" },
  { name: "valorSeguro", label: "Valor de seguro", field: "valorSeguro" },
  {
    name: "porcentajeMicroseguro",
    label: "Porcentaje del MicroSeg.",
    field: "porcentajeMicroseguro",
  },
  { name: "acciones", label: "Acciones", field: "acciones" },
];

const columns: any = computed(() => {
  return selectedTable.value === "ingreso"
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

const columnsGenerico: any = [
  { name: "concepto", label: "Concepto", field: "concepto", align: "left" },
  { name: "monto", label: "Monto", field: "monto" },
  { name: "fecha", label: "Fecha", field: "fecha" },
];

const pagos = [
  {
    documento: "DOC-001",
    cliente: "Juan Pérez",
    observaciones: "Pago realizado en efectivo",
    cuotas: "$3 / 6",
    tipoPago: "Mensual",
    formaPago: "Efectivo",
    montoVenta: "$150.00 ($140.00 + $10.00 interés)",
    abonado: "$50.00",
    saldo: "$100.00",
    visita: "Sí",
    frecuenciaPago: "Mensual",
    acciones: "Ver detalles",
  },
  {
    documento: "DOC-002",
    cliente: "Ana Gómez",
    observaciones: "Pago vía transferencia",
    cuotas: "$5 / 12",
    tipoPago: "Quincenal",
    formaPago: "Transferencia",
    montoVenta: "$240.00 ($220.00 + $20.00 interés)",
    abonado: "$80.00",
    saldo: "$160.00",
    visita: "No",
    frecuenciaPago: "Quincenal",
    acciones: "Ver detalles",
  },
];

const ventas = [
  {
    documento: "DOC-101",
    cliente: "Carlos Mendoza",
    frecuenciaPago: "Semanal",
    valorAnterior: "$200.00",
    montoVenta: "$300.00",
    cuotas: "$2 / 10",
    interes: "$30.00",
    montoInteres: "$30.00",
    valorCuota: "$33.00",
    fechaVenta: "25/05/2025",
    cuotasRestantes: "8",
    saldo: "$240.00",
    seguro: "SGR-001",
    valorSeguro: "$15.00",
    porcentajeMicroseguro: "5%",
    acciones: "Ver detalles",
  },
  {
    documento: "DOC-102",
    cliente: "María Rodríguez",
    frecuenciaPago: "Mensual",
    valorAnterior: "$500.00",
    montoVenta: "$700.00",
    cuotas: "$3 / 12",
    interes: "$70.00",
    montoInteres: "$70.00",
    valorCuota: "$64.00",
    fechaVenta: "20/05/2025",
    cuotasRestantes: "9",
    saldo: "$600.00",
    seguro: "SGR-002",
    valorSeguro: "$20.00",
    porcentajeMicroseguro: "7%",
    acciones: "Ver detalles",
  },
];

const ingresos = [
  { concepto: "Depósito de cliente", monto: "$500.00", fecha: "26/05/2025" },
  { concepto: "Intereses acumulados", monto: "$75.00", fecha: "26/05/2025" },
];

const egresos = [
  { concepto: "Pago a proveedores", monto: "$300.00", fecha: "27/05/2025" },
  { concepto: "Gastos operativos", monto: "$150.00", fecha: "27/05/2025" },
];

const retiros = [
  { concepto: "Retiro de caja", monto: "$200.00", fecha: "28/05/2025" },
  { concepto: "Transferencia bancaria", monto: "$500.00", fecha: "28/05/2025" },
];

const ingresosData = ref([
  {
    id: 1,
    date: "2024-03-15",
    time: "09:30",
    route: "Colombia, Medellín",
    amount: 1500000,
    description: "Reparación de motor completa con cambio de piezas...",
  },
  {
    id: 2,
    date: "2024-03-15",
    time: "09:30",
    route: "Colombia, Medellín",
    amount: 1500000,
    description: "Reparación de motor completa con cambio de piezas...",
  },
  {
    id: 3,
    date: "2024-03-15",
    time: "09:30",
    route: "Colombia, Medellín",
    amount: 1500000,
    description: "Reparación de motor completa con cambio de piezas...",
  },
  {
    id: 4,
    date: "2024-03-15",
    time: "09:30",
    route: "Colombia, Medellín",
    amount: 1500000,
    description: "Reparación de motor completa con cambio de piezas...",
  },
]);

const egresosData = ref([
  {
    id: 1,
    name: "Estacionamiento Centro",
    category: "Transporte",
    routes: "Colombia, Medellín",
    amount: 35000,
  },
  {
    id: 2,
    name: "Estacionamiento Centro",
    category: "Transporte",
    routes: "Colombia, Medellín",
    amount: 35000,
  },
  {
    id: 3,
    name: "Estacionamiento Centro",
    category: "Transporte",
    routes: "Colombia, Medellín",
    amount: 35000,
  },
  {
    id: 4,
    name: "Estacionamiento Centro",
    category: "Transporte",
    routes: "Colombia, Medellín",
    amount: 35000,
  },
]);

const clientStatsFirst = reactive([
  { label: "Clientes iniciales", value: "18", icon: "group" },
  {
    label: "Clientes Nuevos/Renovados",
    value: "18 (9 nvo / 9 reno)",
    icon: "person_add",
  },
  { label: "Clientes no Renovados", value: "0", icon: "person_remove" },
]);

const clientStatsSecond = reactive([
  { label: "Pagos aplazados siguiente día", value: "18", icon: "payments" },
  { label: "Clientes Cancelados", value: "13", icon: "cancel" },
  { label: "Total de clientes", value: "0", icon: "group" },
]);
</script>

<style scoped>
.card-item {
  border-radius: 8px;
  padding: 20px;
  min-height: 100px;
  transition: transform 0.2s;
  border: 1px solid #e0e0e0;
}

.container-app {
  max-width: 100%;
}

.rounded-input {
  border-radius: 8px;
}

.shadow-2 {
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
}

.underline-indicator {
  position: absolute;
  bottom: -2px;
  left: 0;
  right: 0;
  height: 3px;
  background: transparent;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.underline-indicator.active {
  background: #2b69e8;
  height: 4px;
}

.grey-card {
  background: #f5f5f5;
}

.blue-card {
  background: #ebeeff;
  color: white;
}

.blue-card .text-blue-grey-7,
.blue-card .text-blue-grey-8 {
  color: rgba(255, 255, 255, 0.8) !important;
}

.green-card {
  background: #d8ffdc;
}

.card-white {
  border: 1px solid #e0e0e0;
}
</style>
