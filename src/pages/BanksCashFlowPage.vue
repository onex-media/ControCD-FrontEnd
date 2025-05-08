<template>
  <div class="min-h-screen bg-gray-50">
    <main class="py-6">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <!-- Balance Cards Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <!-- Total Balance Card -->
          <div class="bg-blue-50 rounded-lg p-6">
            <h2 class="text-lg font-medium mb-4">Balance total</h2>
            <div class="text-4xl font-bold text-blue-600 mb-4">
              $ {{ formatNumber(totalBalance) }}
            </div>
            <div class="grid grid-cols-2 gap-4">
              <q-btn
                color="primary"
                class="w-full"
                label="Ingreso"
                no-caps
              />
              <q-btn
                outline
                color="primary"
                class="w-full"
                label="Retiro"
                no-caps
              />
            </div>
          </div>

          <!-- Cash Flow Card -->
          <div class="bg-blue-700 rounded-lg p-6 text-white">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-lg font-medium">Efectivo caja</h2>
              <q-btn flat round dense color="white" icon="photo_camera" />
            </div>
            <div class="text-4xl font-bold mb-6">
              $ {{ formatNumber(cashBalance) }}
            </div>
            <div class="grid grid-cols-3 gap-4">
              <div>
                <div class="text-sm opacity-80">Inversión</div>
                <div class="font-medium">{{ formatNumber(investment) }}</div>
              </div>
              <div>
                <div class="text-sm opacity-80">Capital</div>
                <div class="font-medium">{{ formatNumber(capital) }}</div>
              </div>
              <div>
                <div class="text-sm opacity-80">Utilidad</div>
                <div class="font-medium">{{ formatNumber(profit) }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Administrative Movements Section -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Management Section -->
          <div class="bg-white rounded-lg p-6 shadow-sm">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-lg font-medium">Movimientos administrativos</h2>
              <div class="flex items-center gap-2">
                <span class="text-sm text-gray-500">Semana actual</span>
                <q-btn flat round dense icon="more_horiz" />
              </div>
            </div>
            <div class="text-3xl font-bold mb-6">
              $ {{ formatNumber(administrativeMovements) }}
            </div>
            <div class="space-y-6">
              <div v-for="(section, index) in sections" :key="index" class="p-4 bg-gray-50 rounded-lg">
                <div class="flex items-center gap-3 mb-2">
                  <q-icon :name="section.icon" size="sm" :color="section.iconColor" />
                  <span class="font-medium">{{ section.title }}</span>
                </div>
                <div class="text-lg font-bold text-gray-900">
                  + $ {{ formatNumber(section.amount) }}
                </div>
                <div class="text-sm text-gray-500">Valor total</div>
              </div>
            </div>
          </div>

          <!-- Recent Activity -->
          <div class="lg:col-span-2">
            <div class="bg-white rounded-lg p-6 shadow-sm">
              <h2 class="text-lg font-medium mb-6">Actividad reciente</h2>
              <div class="space-y-4">
                <div v-for="(activity, index) in recentActivity" :key="index" 
                     class="flex items-center justify-between py-3 border-b border-gray-100">
                  <div class="flex items-center gap-4">
                    <div class="flex flex-col">
                      <span class="text-sm font-medium">{{ activity.date }}</span>
                      <span class="text-xs text-gray-500">{{ activity.time }}</span>
                    </div>
                    <q-chip
                      :color="activity.type === 'Ingreso' ? 'green' : 'red'"
                      text-color="white"
                      dense
                    >
                      {{ activity.type }}
                    </q-chip>
                  </div>
                  <div class="flex items-center gap-4">
                    <div class="text-right">
                      <div class="font-medium">$ {{ formatNumber(activity.amount) }}</div>
                      <div class="text-sm text-gray-500">Valor</div>
                    </div>
                    <q-chip outline :label="activity.method" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Mock data
const totalBalance = ref(1000000)
const cashBalance = ref(22317)
const investment = ref(0)
const capital = ref(8524)
const profit = ref(13793)
const administrativeMovements = ref(850000)

const sections = ref([
  {
    title: 'Gestión de cobro',
    amount: 350000,
    icon: 'manage_accounts',
    iconColor: 'primary'
  },
  {
    title: 'Prestamos',
    amount: 250000,
    icon: 'account_balance',
    iconColor: 'deep-purple'
  },
  {
    title: 'Ahorros',
    amount: 250000,
    icon: 'savings',
    iconColor: 'green'
  }
])

const recentActivity = ref([
  {
    date: '26/12/2023',
    time: '10:30',
    type: 'Ingreso',
    amount: 150000,
    method: 'Cuenta bancaria'
  },
  {
    date: '26/12/2023',
    time: '11:45',
    type: 'Retiro',
    amount: 50000,
    method: 'Efectivo caja'
  },
  {
    date: '26/12/2023',
    time: '14:20',
    type: 'Ingreso',
    amount: 200000,
    method: 'Cuenta bancaria'
  }
])

// Utility function to format numbers
const formatNumber = (value) => {
  return new Intl.NumberFormat('es-CO', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value)
}
</script>

<style scoped>
:deep(.q-btn) {
  border-radius: 8px;
}

:deep(.q-chip) {
  font-size: 0.75rem;
}
</style>