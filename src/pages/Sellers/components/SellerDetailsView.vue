<template>
  <div class="vendor-details full-height bg-grey-2">
    <q-card class="full-height" flat>
      <q-card-section style="padding: 0">

        <q-tabs
          v-model="currentTab"
          active-color="grey-9"
          indicator-color="grey-9"
          align="left"
          class="q-mb-lg custom-tabs"
          dense
        >
          <q-tab name="clientes" class="text-grey-7 q-px-lg q-py-md">
            <template v-slot>
              <div class="tab-content">
                <q-icon name="group" size="16px" class="q-mr-sm" />
                <span>Clientes</span>
              </div>
            </template>
          </q-tab>
          <q-tab name="liquidaciones" class="text-grey-7 q-px-lg q-py-md">
            <template v-slot>
              <div class="tab-content">
                <q-icon name="receipt_long" size="16px" class="q-mr-sm" />
                <span>Liquidaciones</span>
              </div>
            </template>
          </q-tab>
          <q-tab name="pagos" class="text-grey-7 q-px-lg q-py-md">
            <template v-slot>
              <div class="tab-content">
                <q-icon name="payments" size="16px" class="q-mr-sm" />
                <span>Pagos</span>
              </div>
            </template>
          </q-tab>
          <q-tab name="ventas" class="text-grey-7 q-px-lg q-py-md">
            <template v-slot>
              <div class="tab-content">
                <q-icon name="shopping_cart" size="16px" class="q-mr-sm" />
                <span>Ventas</span>
              </div>
            </template>
          </q-tab>
          <q-tab name="egresos" class="text-grey-7 q-px-lg q-py-md">
            <template v-slot>
              <div class="tab-content">
                <q-icon name="account_balance" size="16px" class="q-mr-sm" />
                <span>Egresos/Ingresos</span>
              </div>
            </template>
          </q-tab>
          <q-tab name="enrutar" class="text-grey-7 q-px-lg q-py-md">
            <template v-slot>
              <div class="tab-content">
                <q-icon name="alt_route" size="16px" class="q-mr-sm" />
                <span>Enrutar</span>
              </div>
            </template>
          </q-tab>

          <q-tab name="gps" class="text-grey-7 q-px-lg q-py-md">
            <template v-slot>
              <div class="tab-content">
                <q-icon name="map" size="16px" class="q-mr-sm" />
                <span>GPS</span>
              </div>
            </template>
          </q-tab>
          <q-tab name="reportes" class="text-grey-7 q-px-lg q-py-md">
            <template v-slot>
              <div class="tab-content">
                <q-icon name="analytics" size="16px" class="q-mr-sm" />
                <span>Reportes</span>
              </div>
            </template>
          </q-tab>
        </q-tabs>
        <q-breadcrumbs
          class="custom-breadcrumb container-app"
          active-color="primary"
        >
          <q-breadcrumbs-el
            label="Vendedores"
            icon="people_alt"
            @click="$emit('close-details')"
            class="cursor-pointer"
          />
          <q-breadcrumbs-el
            :label="vendor.user.name"
            icon="person"
            class="text-primary"
          />
        </q-breadcrumbs>

        <q-tab-panels
          v-model="currentTab"
          animated
          class="full-height-panels bg-white container-app"
        >
          <q-tab-panel name="clientes" class="q-pa-none full-height">
            <TabletSellerClients
              v-if="vendorClients.length > 0"
              :dataClients="vendorClients"
              :pagination-clients="vendorClientsPagination"
              @update-pagination="handlePaginationUpdate"
            />
          </q-tab-panel>
          <q-tab-panel name="liquidaciones" class="q-pa-none full-height">
            <Liquidations :vendor="vendor" />
          </q-tab-panel>
          <q-tab-panel name="pagos" class="q-pa-none full-height">
            <TabletSellerPayments :data-payments="pagosData" />
          </q-tab-panel>
          <q-tab-panel name="ventas" class="q-pa-none full-height">
            <TabletSellerSales :data-sales="ventasData" />
          </q-tab-panel>
          <q-tab-panel name="egresos" class="q-pa-none full-height">
            <TabletSellerIncomeExpenses
              :incomes="ingresosData"
              :expenses="egresosData"
            />
          </q-tab-panel>
          <q-tab-panel name="enrutar" class="q-pa-none full-height">
            <DraggableClientsList
              :clients="clients"
              @update-order="handleOrderUpdate"
            />
          </q-tab-panel>
          <q-tab-panel name="reportes" class="q-pa-none full-height">
            <Reports />
          </q-tab-panel>
        </q-tab-panels>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import TabletSellerClients from "./TabletSellerClients.vue";
import TabletSellerPayments from "./TabletSellerPayments.vue";
import TabletSellerSales from "./TabletSellerSales.vue";
import TabletSellerIncomeExpenses from "./TabletSellerIncomeExpenses.vue";
import DraggableClientsList from "./DraggableClientsList.vue";
import Reports from "./Reports.vue";
import Liquidations from "./Liquidations.vue";

const props = defineProps<{
  vendor: any;
  vendorClients: any;
  vendorClientsPagination: any;
}>();

const emit = defineEmits(["close-details", "update-pagination"]);

const handlePaginationUpdate = (newPagination: any) => {
  emit("update-pagination", newPagination);
};

const currentTab = ref("clientes");

const handleOrderUpdate = (newOrder: any) => {
  clients.value = newOrder;
};

const clients = ref([
  {
    id: 1,
    name: "Cliente 1",
    idNumber: "123456789",
    address: "Dirección",
    city: "Barranquilla, Colombia",
    email: "correo@ejemplo.com",
    phone: "(+57) 300 123 4567",
    company: "Empresa S.A.S.",
    companyAddress: "Calle 123 #45-67",
    totalCredit: 1500000.0,
  },
  {
    id: 2,
    name: "Cliente 2",
    idNumber: "987654321",
    address: "Dirección",
    city: "Barranquilla, Colombia",
    email: "otro_correo@ejemplo.com",
    phone: "(+57) 300 987 6543",
    company: "Otra Empresa S.A.S.",
    companyAddress: "Otra Calle 789 #12-34",
    totalCredit: 2500000.0,
  },
  {
    id: 3,
    name: "Cliente 3",
    idNumber: "456789123",
    address: "Dirección",
    city: "Barranquilla, Colombia",
    email: "tercer_correo@ejemplo.com",
    phone: "(+57) 300 456 7891",
    company: "Tercera Empresa S.A.S.",
    companyAddress: "Tercera Calle 456 #78-90",
    totalCredit: 3500000.0,
  },
  {
    id: 4,
    name: "Cliente 4",
    idNumber: "321654987",
    address: "Dirección",
    city: "Barranquilla, Colombia",
    email: "cuarto_correo@ejemplo.com",
    phone: "(+57) 300 321 6549",
    company: "Cuarta Empresa S.A.S.",
    companyAddress: "Cuarta Calle 321 #98-76",
    totalCredit: 4500000.0,
  },
  {
    id: 5,
    name: "Cliente 5",
    idNumber: "159753486",
    address: "Dirección",
    city: "Barranquilla, Colombia",
    email: "  quinto_correo@ejemplo.com",
    phone: "(+57) 300 159 7534",
    company: "Quinta Empresa S.A.S.",
    companyAddress: "Quinta Calle 159 #35-24",
    totalCredit: 5500000.0,
  },
  {
    id: 6,
    name: "Cliente 6",
    idNumber: "753159486",
    address: "Dirección",
    city: "Barranquilla, Colombia",
    email: "sexto_correo@ejemplo.com",
    phone: "(+57) 300 753 1594",
    company: "Sexta Empresa S.A.S.",
    companyAddress: "Sexta Calle 753 #24-15",
    totalCredit: 6500000.0,
  },
]);

const pagosData = ref([
  {
    id: 1,
    cedula: "0954321876",
    nombre: "María Pérez",
    observaciones: "Parcialmente pagado",
    cuotaActual: 3,
    totalCuotas: 12,
    tipo: "Cuota",
    formaPago: "Efectivo",
    montoVenta: 1200,
    abonado: 300,
    fecha: "2024-03-15 08:30",
    saldo: 900,
    visitas: 2,
    frecuencia: "Semanal",
  },
  {
    id: 2,
    cedula: "0954321876",
    nombre: "María Pérez",
    observaciones: "Parcialmente pagado",
    cuotaActual: 3,
    totalCuotas: 12,
    tipo: "Cuota",
    formaPago: "Efectivo",
    montoVenta: 1200,
    abonado: 300,
    fecha: "2024-03-15 08:30",
    saldo: 900,
    visitas: 2,
    frecuencia: "Semanal",
  },
  {
    id: 3,
    cedula: "0954321876",
    nombre: "María Pérez",
    observaciones: "Parcialmente pagado",
    cuotaActual: 3,
    totalCuotas: 12,
    tipo: "Cuota",
    formaPago: "Efectivo",
    montoVenta: 1200,
    abonado: 300,
    fecha: "2024-03-15 08:30",
    saldo: 900,
    visitas: 2,
    frecuencia: "Semanal",
  },
  {
    id: 4,
    cedula: "0954321876",
    nombre: "María Pérez",
    observaciones: "Parcialmente pagado",
    cuotaActual: 3,
    totalCuotas: 12,
    tipo: "Cuota",
    formaPago: "Efectivo",
    montoVenta: 1200,
    abonado: 300,
    fecha: "2024-03-15 08:30",
    saldo: 900,
    visitas: 2,
    frecuencia: "Semanal",
  },
  {
    id: 5,
    cedula: "0954321876",
    nombre: "María Pérez",
    observaciones: "Parcialmente pagado",
    cuotaActual: 3,
    totalCuotas: 12,
    tipo: "Cuota",
    formaPago: "Efectivo",
    montoVenta: 1200,
    abonado: 300,
    fecha: "2024-03-15 08:30",
    saldo: 900,
    visitas: 2,
    frecuencia: "Semanal",
  },
]);

const ventasData = ref([
  {
    id: 1,
    nombre: "Carlos Sánchez",
    frecuencia: "Quincenal",
    valorAnterior: 1500,
    documento: "0954321654",
    telefono: "0987654321",
    montoCredito: 2000,
    cuotas: 10,
    interes: 5,
    valorCuota: 210,
    cuotaRestante: 10,
    saldo: 2000,
    seguro: { numero: "S-1234", valor: 50 },
  },

  {
    id: 2,
    nombre: "Carlos Sánchez",
    frecuencia: "Quincenal",
    valorAnterior: 1500,
    documento: "0954321654",
    telefono: "0987654321",
    montoCredito: 2000,
    cuotas: 10,
    interes: 5,
    valorCuota: 210,
    cuotaRestante: 10,
    saldo: 2000,
    seguro: { numero: "S-1234", valor: 50 },
  },
  {
    id: 3,
    nombre: "Carlos Sánchez",
    frecuencia: "Quincenal",
    valorAnterior: 1500,
    documento: "0954321654",
    telefono: "0987654321",
    montoCredito: 2000,
    cuotas: 10,
    interes: 5,
    valorCuota: 210,
    cuotaRestante: 10,
    saldo: 2000,
    seguro: { numero: "S-1234", valor: 50 },
  },
  {
    id: 4,
    nombre: "Carlos Sánchez",
    frecuencia: "Quincenal",
    valorAnterior: 1500,
    documento: "0954321654",
    telefono: "0987654321",
    montoCredito: 2000,
    cuotas: 10,
    interes: 5,
    valorCuota: 210,
    cuotaRestante: 10,
    saldo: 2000,
    seguro: { numero: "S-1234", valor: 50 },
  },
  {
    id: 5,
    nombre: "Carlos Sánchez",
    frecuencia: "Quincenal",
    valorAnterior: 1500,
    documento: "0954321654",
    telefono: "0987654321",
    montoCredito: 2000,
    cuotas: 10,
    interes: 5,
    valorCuota: 210,
    cuotaRestante: 10,
    saldo: 2000,
    seguro: { numero: "S-1234", valor: 50 },
  },
  {
    id: 6,
    nombre: "Carlos Sánchez",
    frecuencia: "Quincenal",
    valorAnterior: 1500,
    documento: "0954321654",
    telefono: "0987654321",
    montoCredito: 2000,
    cuotas: 10,
    interes: 5,
    valorCuota: 210,
    cuotaRestante: 10,
    saldo: 2000,
    seguro: { numero: "S-1234", valor: 50 },
  },
]);
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
</script>

<style scoped>
.custom-breadcrumb {
  font-size: 18px;
  padding: 12px 0;
}

.custom-breadcrumb :deep(.q-breadcrumbs__el) {
  font-weight: 500;
}

.custom-breadcrumb :deep(.q-icon) {
  font-size: 24px;
  margin-right: 8px;
}

.custom-breadcrumb :deep(.q-breadcrumbs__separator) {
  font-size: 16px;
  margin: 0 12px;
  color: #94a3b8;
}
.vendor-details {
  height: calc(100vh - 100px);
  background-color: #f5f7fa;
}

.q-card {
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.custom-tabs {
  background: #f8fafc;
}

.custom-tabs :deep(.q-tab) {
  margin: 0 4px;
  transition: all 0.3s ease;
}

.custom-tabs :deep(.q-tab--active) {
  background: #9e9e9e;
  color: white !important;
}

.custom-tabs :deep(.q-tab--active .q-icon) {
  color: white !important;
}

.custom-tabs :deep(.q-tab__indicator) {
  height: 3px;
}
.custom-tabs :deep(.q-tab) {
  text-transform: none !important;
}

.full-height-panels {
  flex: 1;
  min-height: 0;
  padding: 0;
}

.full-height {
  height: 100%;
}

.q-tab-panel {
  display: flex;
  flex-direction: column;
  padding: 0;
}
</style>
