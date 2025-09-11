<template>
    <div class="min-h-screen">
      <!-- Main Content -->
      <main class="py-6">
        <div class="mx-auto max-w-10xl px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center mb-6">
            <h1 class="text-2xl font-semibold">Liquidaciones</h1>
            <div class="flex items-center gap-4">
              <q-input
                outlined
                dense
                v-model="search"
                placeholder="Buscar"
                class="w-80"
              >
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
              <q-btn
                color="primary"
                icon-right="add"
                label="Nueva liquidación"
                no-caps
                class="px-4"
                @click="showCreateModal = true"
              />
            </div>
          </div>
  
          <!-- Liquidations Table -->
          <div class="bg-white">
            <div class="overflow-x-auto">
              <table class="min-w-full">
                <thead class="bg-gray-200">
                  <tr>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Último cierre
                      <q-icon name="unfold_more" size="xs" class="cursor-pointer" />
                    </th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ruta
                      <q-icon name="unfold_more" size="xs" class="cursor-pointer" />
                    </th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cobrador
                      <q-icon name="unfold_more" size="xs" class="cursor-pointer" />
                    </th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Créditos
                    </th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total efectivo entregado
                    </th>
                    <th scope="col" class="relative px-6 py-3">
                      <span class="sr-only">Acciones</span>
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y">
                  <tr v-for="liquidation in filteredLiquidations" :key="liquidation.id" :class="{ 'bg-gray-50': liquidation.id % 2 === 0 }">
                    <td class="px-6 py-4">
                      <div class="text-sm text-gray-900">{{ formatDate(liquidation.lastClosing) }}</div>
                      <div class="text-sm text-gray-500">{{ formatTime(liquidation.lastClosing) }}</div>
                    </td>
                    <td class="px-6 py-4">
                      <div class="text-sm text-gray-900">{{ liquidation.routeName || 'Sin ruta asignada' }}</div>
                      <div class="text-sm text-gray-500">{{ liquidation.sector || 'Ningún sector' }}</div>
                    </td>
                    <td class="px-6 py-4">
                      <div class="text-sm text-gray-900">{{ liquidation.collectorName }}</div>
                      <div class="text-sm text-gray-500">{{ liquidation.collectorId }}</div>
                    </td>
                    <td class="px-6 py-4">
                      <div class="flex gap-1">
                        <q-chip
                          label="# (Total créditos)"
                          color="gray"
                          text-color="white"
                          size="sm"
                        />
                        <q-chip
                          v-if="liquidation.totalPayments"
                          label="# (Total abonos)"
                          color="blue"
                          text-color="white"
                          size="sm"
                        />
                      </div>
                    </td>
                    <td class="px-6 py-4">
                      <div class="text-sm text-gray-900">$ {{ formatCurrency(liquidation.totalAmount) }}</div>
                    </td>
                    <td class="px-6 py-4 text-right text-sm font-medium">
                      <div class="flex justify-end items-center space-x-2">
                        <q-btn 
                          flat 
                          round 
                          size="sm" 
                          color="primary" 
                          icon="visibility"
                          @click="viewLiquidationDetail(liquidation.id)"
                        >
                          <q-tooltip>Ver detalle con carousel</q-tooltip>
                        </q-btn>
                        <q-btn flat round size="sm" color="primary" icon="edit" />
                        <q-btn flat round size="sm" color="primary" icon="print" />
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <!-- Pagination -->
            <div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div class="flex-1 flex justify-between items-center">
                <q-btn flat icon="chevron_left" label="Anterior" no-caps />
                <div class="flex space-x-2">
                  <q-btn unelevated color="primary" label="1" no-caps />
                  <q-btn flat label="2" no-caps />
                  <q-btn flat label="3" no-caps />
                  <span class="px-2 py-2">...</span>
                  <q-btn flat label="67" no-caps />
                  <q-btn flat label="68" no-caps />
                </div>
                <q-btn flat icon-right="chevron_right" label="Siguiente" no-caps />
              </div>
            </div>
          </div>
  
          <!-- Create Liquidation Modal -->
          <q-dialog v-model="showCreateModal">
            <q-card class="w-full">
              <q-card-section>
                <div class="text-h6">Nueva Liquidación</div>
              </q-card-section>
              <q-card-section>
                <q-input outlined dense v-model="newLiquidation.routeName" label="Ruta" />
                <q-input outlined dense v-model="newLiquidation.sector" label="Sector" />
                <q-input outlined dense v-model="newLiquidation.collectorName" label="Nombre del Cobrador" />
                <q-input outlined dense v-model="newLiquidation.collectorId" label="Número de Identificación" />
                <q-input outlined dense v-model="newLiquidation.totalAmount" label="Total Efectivo" type="number" />
              </q-card-section>
              <q-card-actions align="right">
                <q-btn flat label="Cancelar" color="negative" @click="showCreateModal = false" />
                <q-btn flat label="Crear" color="primary" @click="createLiquidation" />
              </q-card-actions>
            </q-card>
          </q-dialog>
        </div>
      </main>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue'
  import { useRouter } from 'vue-router'
  import axios from '../axios'
  
  const router = useRouter()
  
  const search = ref('')
  const liquidations = ref([
    {
      id: 1,
      lastClosing: new Date('2025-01-15T10:30:00Z'),
      routeName: 'Ruta Centro',
      sector: 'Centro',
      collectorName: 'Juan Pérez',
      collectorId: '12345678',
      totalCredits: 25,
      totalPayments: 18,
      totalAmount: 15000.50
    },
    {
      id: 2,
      lastClosing: new Date('2025-01-14T14:20:00Z'),
      routeName: 'Ruta Norte',
      sector: 'Norte',
      collectorName: 'María García',
      collectorId: '87654321',
      totalCredits: 30,
      totalPayments: 22,
      totalAmount: 18500.75
    }
  ])
  const showCreateModal = ref(false)
  
  const newLiquidation = ref({
    lastClosing: new Date(),
    routeName: '',
    sector: '',
    collectorName: '',
    collectorId: '',
    totalCredits: 0,
    totalPayments: 0,
    totalAmount: 0
  })
  
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('es-CO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }
  
  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('es-CO', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }
  
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CO', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value)
  }
  
  const fetchLiquidations = async () => {
    try {
      const response = await axios.get('/api/liquidations')
      liquidations.value = response.data
    } catch (error) {
      console.error('Error fetching liquidations:', error)
    }
  }
  
  const filteredLiquidations = computed(() => {
    return liquidations.value.filter(liquidation => 
      liquidation.collectorName.toLowerCase().includes(search.value.toLowerCase()) ||
      liquidation.routeName.toLowerCase().includes(search.value.toLowerCase())
    )
  })
  
  const createLiquidation = async () => {
    try {
      const response = await axios.post('/api/liquidations', newLiquidation.value)
      liquidations.value.push(response.data)
      showCreateModal.value = false
      newLiquidation.value = {
        lastClosing: new Date(),
        routeName: '',
        sector: '',
        collectorName: '',
        collectorId: '',
        totalCredits: 0,
        totalPayments: 0,
        totalAmount: 0
      }
    } catch (error) {
      console.error('Error creating liquidation:', error)
    }
  }

  const viewLiquidationDetail = (liquidationId) => {
    router.push(`/dashboard/liquidacion-detalle/${liquidationId}`)
  }
  </script>
  
  <style>
  .q-field__inner {
    margin: 1rem;
  }
  .q-btn--active {
    background-color: rgb(37 99 235);
    color: #fff;
  }
  </style>