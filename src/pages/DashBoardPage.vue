<template>
  <div class="bg-white min-h-screen">
    <div class="container mx-auto px-4 py-6">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <!-- User Profile Section -->
        <div class="lg:col-span-4 card-user bg-f5f5f5 rounded-xl">
          <div class="flex items-center">
            <q-avatar size="64px">
              <img src="https://i.pravatar.cc/150" alt="Profile" />
            </q-avatar>
            <div class="ml-4">
              <h2 class="text-xl font-medium">
                Hola, <span class="text-blue-600">Jhon Doe</span>
              </h2>
              <p class="text-gray-500 text-sm">Medellín, Colombia</p>
            </div>
          </div>
          <div class="flex gap-40 mt-6">
            <div class="text-center">
              <div class="text-xl font-semibold text-blue-600">
                {{ routesCount }}
              </div>
              <div class="text-sm text-gray-500">Rutas</div>
            </div>
            <div class="text-center">
              <div class="text-xl font-semibold text-blue-600">
                {{ membersCount }}
              </div>
              <div class="text-sm text-gray-500">Miembros</div>
            </div>
            <div class="text-center">
              <div class="text-xl font-semibold text-blue-600">
                {{ creditsCount }}
              </div>
              <div class="text-sm text-gray-500">Créditos</div>
            </div>
          </div>
        </div>

        <!-- Cash Box Card -->
        <div class="lg:col-span-4 bg-blue-600 rounded-xl p-6 text-white">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-xl font-medium">Efectivo caja</h3>
            <img src="/icons/Vault.svg" class="svg-white" alt="" />
            <!-- <q-btn flat round color="white" icon="photo_camera" /> -->
          </div>
          <div class="mb-6">
            <div class="text-sm opacity-80">Saldo actual</div>
            <div class="text-3xl font-bold">$ 22.317,00</div>
          </div>
          <div class="grid grid-cols-3 gap-4">
            <div>
              <div class="text-sm opacity-80">Inversión</div>
              <div>00.000,00</div>
            </div>
            <div>
              <div class="text-sm opacity-80">Capital</div>
              <div>8,524,00</div>
            </div>
            <div>
              <div class="text-sm opacity-80">Utilidad</div>
              <div>13.793,00</div>
            </div>
          </div>
        </div>

        <!-- Movements Section -->
        <div class="lg:col-span-4 bg-white rounded-xl p-6 shadow-sm">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-medium">Movimientos</h3>
            <div class="flex items-center text-sm text-gray-500">
              <span>Semana actual</span>
              <q-btn flat round dense icon="info" size="sm" color="grey" />
            </div>
          </div>
          <div class="flex items-center mb-6 text-sm">
            <div class="flex items-center mr-4">
              <div class="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
              <span>Ingresos</span>
            </div>
            <div class="flex items-center">
              <div class="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
              <span>Gastos</span>
            </div>
          </div>
          <div class="space-y-6">
            <div>
              <div class="flex justify-between items-center mb-2">
                <span class="text-sm">Ingresos</span>
                <span class="text-sm text-green-500">$ 000.000.000,00</span>
              </div>
              <q-linear-progress rounded size="10px" :value="0.7" color="green" />
            </div>
            <div>
              <div class="flex justify-between items-center mb-2">
                <span class="text-sm">Gastos</span>
                <span class="text-sm text-red-500">$ 000.000.000,00</span>
              </div>
              <q-linear-progress rounded size="10px" :value="0.4" color="red" />
            </div>
          </div>
        </div>

        <!-- Pending Portfolios -->
        <div class="lg:col-span-8 bg-white rounded-xl shadow-sm overflow-hidden">
          <div class="p-6 border-b">
            <h3 class="text-lg font-medium">Últimas carteras pendientes</h3>
          </div>
          <!-- Desktop Table -->
          <div class="hidden lg:block">
            <q-table :rows="pendingPortfolios" :columns="columns" row-key="route" flat :pagination="{ rowsPerPage: 5 }"
              class="pending-portfolios-table" />
          </div>
          <!-- Mobile List -->
          <div class="lg:hidden">
            <div v-for="portfolio in pendingPortfolios" :key="portfolio.route" class="p-4 border-b">
              <div class="flex justify-between items-center mb-2">
                <div>
                  <div class="font-medium">{{ portfolio.route }}</div>
                  <div class="text-sm text-gray-500">Ruta</div>
                </div>
                <q-btn flat round dense icon="chevron_right" color="grey" />
              </div>
              <div class="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <div class="text-sm text-green-500">
                    {{ portfolio.capital }}
                  </div>
                  <div class="text-xs text-gray-500">Capital por cobrar</div>
                </div>
                <div>
                  <div class="text-sm text-blue-500">
                    {{ portfolio.utility }}
                  </div>
                  <div class="text-xs text-gray-500">Utilidad por cobrar</div>
                </div>
              </div>
              <div class="mt-2">
                <div class="text-sm font-medium">{{ portfolio.total }}</div>
                <div class="text-xs text-gray-500">Total cartera</div>
              </div>
            </div>
          </div>
        </div>

        <!-- General Consolidated -->
        <div class="lg:col-span-4 bg-white rounded-xl p-6 shadow-sm">
          <h3 class="text-lg font-medium mb-6">Consolidado general</h3>
          <div class="text-sm text-gray-600 mb-4">
            Lorem ipsum (<span class="font-medium">{{ routesCount }} rutas</span>) dolor sit (<span
              class="font-medium">{{ creditsCount }} créditos</span>) amet consectetur. Ac pellentesque amet amet
            tincidunt volutpat
            cursus pellentesque sapien. Especificar que es por cobrar.
          </div>
          <div class="grid grid-cols-3 gap-4 mb-6">
            <div class="relative">
              <q-circular-progress show-value :value="75" size="90px" :thickness="0.2" color="green"
                track-color="green-2" class="q-ma-md">
                <div class="text-xs">$ 00K</div>
              </q-circular-progress>
              <div class="text-xs text-center mt-2">Capital</div>
            </div>
            <div class="relative">
              <q-circular-progress show-value :value="65" size="90px" :thickness="0.2" color="blue" track-color="blue-2"
                class="q-ma-md">
                <div class="text-xs">$ 00K</div>
              </q-circular-progress>
              <div class="text-xs text-center mt-2">Utilidad</div>
            </div>
            <div class="relative">
              <q-circular-progress show-value :value="45" size="90px" :thickness="0.2" color="yellow"
                track-color="yellow-2" class="q-ma-md">
                <div class="text-xs">$ 00K</div>
              </q-circular-progress>
              <div class="text-xs text-center mt-2">Carteras</div>
            </div>
          </div>
          <div class="bg-blue-50 rounded-xl p-4">
            <div class="text-2xl font-bold text-blue-600">$ 348.570,00</div>
            <div class="text-sm text-blue-600">Total invertido + Ganancias</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "../axios";
import vault from "/icons/Vault.svg";
const columns = [
  {
    name: "route",
    label: "Ruta",
    field: "route",
    align: "left",
  },
  {
    name: "capital",
    label: "Capital por cobrar",
    field: "capital",
    align: "right",
  },
  {
    name: "utility",
    label: "Utilidad por cobrar",
    field: "utility",
    align: "right",
  },
  {
    name: "credits",
    label: "Total de créditos",
    field: "credits",
    align: "right",
  },
  {
    name: "total",
    label: "Total cartera",
    field: "total",
    align: "right",
  },
];

const pendingPortfolios = ref([
  {
    route: "Tamarindo",
    capital: "$ 134.075,00",
    utility: "$ 18.643,00",
    credits: "146",
    total: "$ 152.718,00",
  },
  {
    route: "Pueblo nuevo",
    capital: "$ 30.355,00",
    utility: "$ 5.580,00",
    credits: "112",
    total: "$ 35.935,00",
  },
  {
    route: "Nombre de la ruta",
    capital: "$ 00.000,00",
    utility: "$ 00.000,00",
    credits: "000",
    total: "$ 000.000,00",
  },
]);

const routesCount = ref(0);
const membersCount = ref(0);
const creditsCount = ref(0);

const fetchData = async () => {
  try {
    const [routesResponse, membersResponse, creditsResponse] =
      await Promise.all([
        axios.get("/api/rutas"),
        axios.get("/api/members"),
        axios.get("/api/credits"),
      ]);
    routesCount.value = routesResponse.data.length;
    membersCount.value = membersResponse.data.length;
    creditsCount.value = creditsResponse.data.length;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

onMounted(() => {
  fetchData();
});
</script>

<style>
.bg-f5f5f5 {
  background-color: #F5F5F5;
}

.pending-portfolios-table .q-table thead tr th {
  font-weight: 500;
  color: #6b7280;
  background: white;
  font-size: 0.875rem;
  border-bottom: 1px solid #e5e7eb;
}

.pending-portfolios-table .q-table tbody td {
  font-size: 0.875rem;
  border-bottom: 1px solid #e5e7eb;
}

.pending-portfolios-table .q-table__bottom {
  display: none;
}

@media (max-width: 1023px) {
  .bg-gray-50 {
    background-color: white;
  }

  .lg\:col-span-5,
  .lg\:col-span-7,
  .lg\:col-span-6,
  .lg\:col-span-12 {
    margin-bottom: 1rem;
  }
}
</style>
