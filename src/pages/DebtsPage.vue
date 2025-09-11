<template>
  <div class="min-h-screen bg-gray-50">
    <main class="py-6">
      <div class="mx-auto max-w-10xl px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-2xl font-semibold">Deudas</h1>
          <div class="flex items-center gap-4">
            <q-btn flat round dense color="primary" icon="event" />
            <q-btn flat round dense color="primary" icon="filter_alt" />
            <q-btn flat round dense color="primary" icon="tune" />
            <q-input
              outlined
              dense
              v-model="search"
              placeholder="Buscar"
              class="w-[300px]"
              bg-color="white"
            >
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
            <q-btn
              color="primary"
              label="Nueva deuda"
              no-caps
              class="px-4"
              @click="showNewDebtModal = true"
            >
              <template v-slot:append>
                <q-icon name="add" class="ml-2" />
              </template>
            </q-btn>
          </div>
        </div>

        <!-- Tabs -->
        <div class="mb-6">
          <q-tabs
            v-model="currentTab"
            class="text-primary"
            active-color="primary"
            indicator-color="primary"
            align="left"
            narrow-indicator
          >
            <q-tab name="pending" label="Pendientes" />
            <q-tab name="history" label="Historial" />
          </q-tabs>
        </div>

        <!-- Debts Table -->
        <div class="bg-white rounded-lg shadow overflow-hidden">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha (Desde / Hasta)
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado de pago
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ruta
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valor deuda
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valor cuotas
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Medio de pago
                </th>
                <th scope="col" class="relative px-6 py-3">
                  <span class="sr-only">Acciones</span>
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="debt in filteredDebts" :key="debt.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ debt.startDate }}</div>
                  <div class="text-sm text-gray-500">{{ debt.endDate }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ debt.name }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <q-chip
                    :color="getStatusColor(debt.status)"
                    text-color="white"
                    size="sm"
                    class="text-xs"
                  >
                    {{ debt.status }}
                  </q-chip>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ debt.route }}</div>
                  <div class="text-sm text-gray-500">{{ debt.sector }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">$ {{ formatNumber(debt.debtValue) }}</div>
                  <div class="text-sm text-gray-500">{{ debt.interestRate }}% Tasa de interés (Valor)</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  $ {{ formatNumber(debt.installmentValue) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <q-chip
                    :color="getPaymentMethodColor(debt.paymentMethod)"
                    :label="debt.paymentMethod"
                    size="sm"
                    class="text-xs"
                  />
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div class="flex justify-end space-x-2">
                    <q-btn flat round dense color="primary" icon="payments" v-if="debt.status === 'Pendiente'" />
                    <q-btn flat round dense color="primary" icon="refresh" v-if="['Anulado', 'Rechazado'].includes(debt.status)" />
                    <q-btn flat round dense color="primary" icon="edit" @click="editDebt(debt)" />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700">
                Mostrando <span class="font-medium">1</span> a <span class="font-medium">10</span> de{' '}
                <span class="font-medium">97</span> resultados
              </p>
            </div>
            <div>
              <q-pagination
                v-model="currentPage"
                :max="10"
                :max-pages="7"
                boundary-numbers
                direction-links
              />
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- New Debt Modal -->
    <q-dialog v-model="showNewDebtModal" persistent>
      <q-card class="w-[600px]">
        <q-card-section class="flex justify-between items-center">
          <h3 class="text-lg font-medium">Nueva deuda</h3>
          <q-btn flat round dense icon="close" @click="showNewDebtModal = false" />
        </q-card-section>

        <q-card-section>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">
                Nombre o título de la deuda <span class="text-red-500">*</span>
              </label>
              <q-input
                v-model="newDebt.name"
                outlined
                dense
                class="mt-1"
                placeholder="Ingrese el nombre de la deuda"
              />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">
                  Fecha de inicio <span class="text-red-500">*</span>
                </label>
                <q-input
                  v-model="newDebt.startDate"
                  outlined
                  dense
                  type="date"
                  class="mt-1"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">
                  Fecha de fin <span class="text-red-500">*</span>
                </label>
                <q-input
                  v-model="newDebt.endDate"
                  outlined
                  dense
                  type="date"
                  class="mt-1"
                />
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">
                  Valor de la deuda <span class="text-red-500">*</span>
                </label>
                <q-input
                  v-model="newDebt.debtValue"
                  outlined
                  dense
                  type="number"
                  class="mt-1"
                  prefix="$"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">
                  Tasa de interés <span class="text-red-500">*</span>
                </label>
                <q-input
                  v-model="newDebt.interestRate"
                  outlined
                  dense
                  type="number"
                  class="mt-1"
                  suffix="%"
                />
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">
                Ruta <span class="text-red-500">*</span>
              </label>
              <q-select
                v-model="newDebt.route"
                :options="routeOptions"
                outlined
                dense
                class="mt-1"
                emit-value
                map-options
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">
                Medio de pago <span class="text-red-500">*</span>
              </label>
              <q-select
                v-model="newDebt.paymentMethod"
                :options="paymentMethodOptions"
                outlined
                dense
                class="mt-1"
                emit-value
                map-options
              />
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right" class="px-6 py-4 border-t">
          <q-btn
            flat
            no-caps
            label="Cancelar"
            color="gray"
            @click="showNewDebtModal = false"
          />
          <q-btn
            no-caps
            label="Crear"
            color="primary"
            @click="createDebt"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// State
const search = ref('')
const currentTab = ref('pending')
const currentPage = ref(1)
const showNewDebtModal = ref(false)

const debts = ref([
  {
    id: 1,
    startDate: '01/01/2023',
    endDate: '31/12/2023',
    name: 'Nombre o título de la deuda',
    status: 'Pendiente',
    route: 'Nombre completo de la ruta',
    sector: 'Nombre del sector',
    debtValue: 1000000,
    interestRate: 5,
    installmentValue: 100000,
    paymentMethod: 'Sin etiqueta'
  },
  {
    id: 2,
    startDate: '01/02/2023',
    endDate: '28/02/2023',
    name: 'Nombre o título de la deuda',
    status: 'En proceso',
    route: 'Nombre completo de la ruta',
    sector: 'Nombre del sector',
    debtValue: 500000,
    interestRate: 3,
    installmentValue: 50000,
    paymentMethod: 'Efectivo caja'
  },
  // Add more mock data as needed
])

const newDebt = ref({
  name: '',
  startDate: '',
  endDate: '',
  debtValue: null,
  interestRate: null,
  route: null,
  paymentMethod: null
})

// Options for dropdowns
const routeOptions = [
  { label: 'Ruta 1', value: 'ruta1' },
  { label: 'Ruta 2', value: 'ruta2' },
  // Add more routes as needed
]

const paymentMethodOptions = [
  { label: 'Sin etiqueta', value: 'sin_etiqueta' },
  { label: 'Efectivo caja', value: 'efectivo_caja' },
  { label: 'Cuenta bancaria', value: 'cuenta_bancaria' },
  // Add more payment methods as needed
]

// Computed
const filteredDebts = computed(() => {
  return debts.value.filter(debt =>
    debt.name.toLowerCase().includes(search.value.toLowerCase()) ||
    debt.route.toLowerCase().includes(search.value.toLowerCase())
  )
})

// Methods
const formatNumber = (value) => {
  return new Intl.NumberFormat('es-CO', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value)
}

const getStatusColor = (status) => {
  switch (status) {
    case 'Pendiente':
      return 'blue'
    case 'En proceso':
      return 'orange'
    case 'Anulado':
      return 'red'
    case 'Rechazado':
      return 'red'
    default:
      return 'gray'
  }
}

const getPaymentMethodColor = (method) => {
  switch (method) {
    case 'Efectivo caja':
      return 'green'
    case 'Cuenta bancaria':
      return 'blue'
    default:
      return 'gray'
  }
}

const editDebt = (debt) => {
  // Implement edit functionality
  console.log('Editing debt:', debt)
}

const createDebt = () => {
  // Implement create functionality
  console.log('Creating new debt:', newDebt.value)
  showNewDebtModal.value = false
  // Reset form
  newDebt.value = {
    name: '',
    startDate: '',
    endDate: '',
    debtValue: null,
    interestRate: null,
    route: null,
    paymentMethod: null
  }
}
</script>

<style scoped>
:deep(.q-field) {
  margin-bottom: 0;
}

:deep(.q-field--outlined .q-field__control) {
  border-radius: 0.375rem;
}

:deep(.q-btn) {
  border-radius: 0.375rem;
}

:deep(.q-table__container) {
  border-radius: 0.5rem;
  overflow: hidden;
}

:deep(.q-chip) {
  font-size: 0.75rem;
}
</style>