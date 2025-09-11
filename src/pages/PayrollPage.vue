<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Main Content -->
    <main class="py-6">
      <div class="mx-auto max-w-10xl px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-2xl font-semibold">Nóminas</h1>
          <div class="flex items-center gap-4">
            <div class="relative">
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
            </div>
            <q-btn
              color="primary"
              label="Liquidar"
              no-caps
              class="px-4 fixed sm:fixed md:fixed lg:relative bottom-5 sm:bottom-5 lg:bottom-0 w-11/12 sm:w-11/12 md:w-11/12 lg:w-auto"
              @click="showLiquidateModal = true"
            >
              <q-icon name="attach_money" class="ml-2" />
            </q-btn>
          </div>
        </div>

        <!-- Tabs -->
        <div class="mb-4">
          <q-tabs
            v-model="activeTab"
            class="text-primary"
            active-color="primary"
            indicator-color="primary"
            align="left"
            narrow-indicator
          >
            <q-tab name="pendientes" label="Pendientes" />
            <q-tab name="historial" label="Historial" />
          </q-tabs>
        </div>

        <!-- Payroll Table -->
        <div class="bg-white rounded-lg shadow overflow-hidden">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead>
                <tr class="bg-gray-50">
                  <th scope="col" class="px-6 py-3 text-left">
                    <div class="flex items-center">
                      <span class="text-sm font-medium text-gray-500">Fecha límite de pago</span>
                      <q-btn flat round dense icon="arrow_upward" size="sm" @click="sortBy('paymentDate')" />
                    </div>
                  </th>
                  <th scope="col" class="px-6 py-3 text-left">
                    <span class="text-sm font-medium text-gray-500">Estado de pago</span>
                  </th>
                  <th scope="col" class="px-6 py-3 text-left">
                    <div class="flex items-center">
                      <span class="text-sm font-medium text-gray-500">Miembro</span>
                      <q-btn flat round dense icon="arrow_upward" size="sm" @click="sortBy('memberName')" />
                    </div>
                  </th>
                  <th scope="col" class="px-6 py-3 text-left">
                    <span class="text-sm font-medium text-gray-500">Rol</span>
                  </th>
                  <th scope="col" class="px-6 py-3 text-left">
                    <div class="flex items-center">
                      <span class="text-sm font-medium text-gray-500">Ruta asignada</span>
                      <q-btn flat round dense icon="arrow_upward" size="sm" @click="sortBy('routeName')" />
                    </div>
                  </th>
                  <th scope="col" class="px-6 py-3 text-left">
                    <div class="flex items-center">
                      <span class="text-sm font-medium text-gray-500">Total a pagar / Frecuencia pago</span>
                      <q-btn flat round dense icon="arrow_upward" size="sm" @click="sortBy('totalPayment')" />
                    </div>
                  </th>
                  <th scope="col" class="w-20 px-6 py-3 text-right">
                    <span class="sr-only">Acciones</span>
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr v-for="payroll in filteredPayrolls" :key="payroll.id" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">{{ formatDate(payroll.paymentDate) }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span :class="getStatusClass(payroll.status)">
                      {{ payroll.status }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">{{ payroll.memberName }}</div>
                    <div class="text-sm text-gray-500">{{ payroll.memberIdentification }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <q-chip
                      :label="payroll.role"
                      :color="getRoleColor(payroll.role)"
                      text-color="white"
                      size="sm"
                    />
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">{{ payroll.routeName }}</div>
                    <div class="text-sm text-gray-500">{{ payroll.routeSector }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">$ {{ formatNumber(payroll.totalPayment) }}</div>
                    <div class="text-sm text-gray-500">{{ payroll.paymentFrequency }}</div>
                  </td>
                  <td class="px-1 py-4 text-right">
                    <q-btn flat round dense color="primary" icon="more_vert">
                      <q-menu>
                        <q-list style="min-width: 100px">
                          <q-item clickable v-close-popup @click="editPayroll(payroll)">
                            <q-item-section>
                              <div class="flex items-center">
                                <img src="/icons/edit.svg" class="mr-2 w-4 h-4" alt="Edit" />
                                Editar
                              </div>
                            </q-item-section>
                          </q-item>
                          <q-item clickable v-close-popup @click="confirmDeletePayroll(payroll)">
                            <q-item-section>
                              <div class="flex items-center text-negative">
                                <img src="/icons/trash-2.svg" class="mr-2 w-4 h-4" alt="Delete" />
                                Eliminar
                              </div>
                            </q-item-section>
                          </q-item>
                        </q-list>
                      </q-menu>
                    </q-btn>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div class="px-6 py-4 flex items-center justify-between border-t border-gray-200">
            <div class="flex-1 flex justify-between sm:hidden">
              <q-btn flat no-caps color="primary" :disable="currentPage === 1" @click="currentPage--">
                Anterior
              </q-btn>
              <q-btn flat no-caps color="primary" :disable="currentPage === totalPages" @click="currentPage++">
                Siguiente
              </q-btn>
            </div>
            <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p class="text-sm text-gray-700">
                  Mostrando <span class="font-medium">{{ paginationStart }}</span> a
                  <span class="font-medium">{{ paginationEnd }}</span> de
                  <span class="font-medium">{{ totalPayrolls }}</span> resultados
                </p>
              </div>
              <div>
                <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <q-pagination
                    v-model="currentPage"
                    :max="totalPages"
                    :max-pages="7"
                    :boundary-numbers="false"
                    :direction-links="true"
                    active-color="primary"
                  />
                </nav>
              </div>
            </div>
          </div>
        </div>

        <!-- Create/Edit Payroll Modal -->
        <q-dialog v-model="showPayrollModal" persistent>
          <q-card class="w-[600px]">
            <q-card-section class="flex justify-between items-center">
              <h3 class="text-lg font-medium">{{ isEditing ? 'Editar nómina' : 'Nueva nómina' }}</h3>
              <q-btn flat round dense icon="close" @click="closePayrollModal" />
            </q-card-section>

            <q-card-section>
              <!-- Payroll form fields go here -->
              <!-- Example: -->
              <q-input v-model="payrollForm.memberName" label="Nombre del miembro" outlined dense class="q-mb-md" />
              <q-input v-model="payrollForm.totalPayment" label="Total a pagar" outlined dense type="number" class="q-mb-md" />
              <!-- Add more form fields as needed -->
            </q-card-section>

            <q-card-actions align="right" class="px-6 py-4 border-t">
              <q-btn
                flat
                no-caps
                label="Cancelar"
                color="gray"
                class="mr-3"
                @click="closePayrollModal"
              />
              <q-btn
                no-caps
                :label="isEditing ? 'Guardar' : 'Crear'"
                color="primary"
                @click="savePayroll"
              />
            </q-card-actions>
          </q-card>
        </q-dialog>

        <!-- Delete Confirmation Modal -->
        <q-dialog v-model="showDeleteModal" persistent>
          <q-card class="w-[500px] p-6">
            <div class="flex items-start">
              <div class="flex-shrink-0">
                <div class="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                  <q-icon name="warning" class="text-red-600 text-xl" />
                </div>
              </div>
              <div class="ml-4 flex-1">
                <h3 class="text-lg font-medium text-gray-900">
                  ¡Atención! Eliminación de nómina
                </h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    ¿Está seguro de que desea eliminar esta nómina?
                  </p>
                  <p class="mt-2 text-sm text-gray-500">
                    Esta acción es irreversible y eliminará permanentemente toda la información
                    asociada a esta nómina.
                  </p>
                </div>
                <div class="mt-4 flex justify-end space-x-3">
                  <q-btn
                    flat
                    no-caps
                    label="Cancelar"
                    color="gray"
                    @click="showDeleteModal = false"
                  />
                  <q-btn
                    no-caps
                    label="Eliminar"
                    color="negative"
                    @click="deletePayroll"
                  />
                </div>
              </div>
            </div>
          </q-card>
        </q-dialog>

        <!-- Liquidate Modal -->
        <q-dialog v-model="showLiquidateModal" persistent>
          <q-card class="w-[500px]">
            <q-card-section class="flex justify-between items-center">
              <h3 class="text-lg font-medium">Liquidar nóminas</h3>
              <q-btn flat round dense icon="close" @click="showLiquidateModal = false" />
            </q-card-section>

            <q-card-section>
              <p class="text-sm text-gray-500 mb-4">
                Seleccione las nóminas que desea liquidar:
              </p>
              <q-option-group
                v-model="selectedPayrolls"
                :options="payrollOptions"
                type="checkbox"
              />
            </q-card-section>

            <q-card-actions align="right" class="px-6 py-4 border-t">
              <q-btn
                flat
                no-caps
                label="Cancelar"
                color="gray"
                class="mr-3"
                @click="showLiquidateModal = false"
              />
              <q-btn
                no-caps
                label="Liquidar"
                color="primary"
                @click="liquidatePayrolls"
              />
            </q-card-actions>
          </q-card>
        </q-dialog>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import axios from '../axios'

const $q = useQuasar()

// State
const search = ref('')
const activeTab = ref('pendientes')
const currentPage = ref(1)
const itemsPerPage = ref(10)
const totalPayrolls = ref(0)
const showPayrollModal = ref(false)
const showDeleteModal = ref(false)
const showLiquidateModal = ref(false)
const isEditing = ref(false)
const selectedPayroll = ref(null)
const selectedPayrolls = ref([])

const payrollForm = ref({
  memberName: '',
  totalPayment: 0,
  // Add more form fields as needed
})

const payrolls = ref([])

// Computed
const filteredPayrolls = computed(() => {
  return payrolls.value.filter(payroll =>
    payroll.memberName.toLowerCase().includes(search.value.toLowerCase()) ||
    payroll.memberIdentification.includes(search.value)
  )
})

const totalPages = computed(() => {
  return Math.ceil(totalPayrolls.value / itemsPerPage.value)
})

const paginationStart = computed(() => {
  return (currentPage.value - 1) * itemsPerPage.value + 1
})

const paginationEnd = computed(() => {
  return Math.min(currentPage.value * itemsPerPage.value, totalPayrolls.value)
})

const payrollOptions = computed(() => {
  return payrolls.value.map(payroll => ({
    label: `${payroll.memberName} - $${payroll.totalPayment}`,
    value: payroll.id
  }))
})

// Methods
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

const formatNumber = (value) => {
  return new Intl.NumberFormat('es-CO', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value)
}

const getStatusClass = (status) => {
  const classes = {
    'Pendiente': 'bg-yellow-100 text-yellow-800',
    'Pagado': 'bg-green-100 text-green-800',
    'Vencido': 'bg-red-100 text-red-800'
  }
  return `px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${classes[status]}`
}

const getRoleColor = (role) => {
  const colors = {
    'Asistente': 'blue',
    'Cobrador': 'purple',
    'Socio': 'green'
  }
  return colors[role] || 'gray'
}

const fetchPayrolls = async () => {
  try {
    const response = await axios.get('/api/payrolls')
    payrolls.value = response.data
    totalPayrolls.value = response.data.length
  } catch (error) {
    console.error('Error fetching payrolls:', error)
    $q.notify({
      type: 'negative',
      message: 'Error al cargar las nóminas'
    })
  }
}

const sortBy = (field) => {
  // Implement sorting logic here
}

const closePayrollModal = () => {
  showPayrollModal.value = false
  isEditing.value = false
  payrollForm.value = {
    memberName: '',
    totalPayment: 0,
    // Reset other form fields
  }
}

const editPayroll = (payroll) => {
  selectedPayroll.value = payroll
  isEditing.value = true
  payrollForm.value = { ...payroll }
  showPayrollModal.value = true
}

const savePayroll = async () => {
  try {
    if (isEditing.value) {
      await axios.put(`/api/payrolls/${selectedPayroll.value.id}`, payrollForm.value)
    } else {
      await axios.post('/api/payrolls', payrollForm.value)
    }
    await fetchPayrolls()
    $q.notify({
      type: 'positive',
      message: `Nómina ${isEditing.value ? 'actualizada' : 'creada'} exitosamente`
    })
    closePayrollModal()
  } catch (error) {
    console.error('Error saving payroll:', error)
    $q.notify({
      type: 'negative',
      message: 'Error al guardar la nómina'
    })
  }
}

const confirmDeletePayroll = (payroll) => {
  selectedPayroll.value = payroll
  showDeleteModal.value = true
}

const deletePayroll = async () => {
  try {
    await axios.delete(`/api/payrolls/${selectedPayroll.value.id}`)
    await fetchPayrolls()
    $q.notify({
      type: 'positive',
      message: 'Nómina eliminada exitosamente'
    })
    showDeleteModal.value = false
  } catch (error) {
    console.error('Error deleting payroll:', error)
    $q.notify({
      type: 'negative',
      message: 'Error al eliminar la nómina'
    })
  }
}

const liquidatePayrolls = async () => {
  try {
    await axios.post('/api/payrolls/liquidate', { payrollIds: selectedPayrolls.value })
    await fetchPayrolls()
    $q.notify({
      type: 'positive',
      message: 'Nóminas liquidadas exitosamente'
    })
    showLiquidateModal.value = false
    selectedPayrolls.value = []
  } catch (error) {
    console.error('Error liquidating payrolls:', error)
    $q.notify({
      type: 'negative',
      message: 'Error al liquidar las nóminas'
    })
  }
}

onMounted(() => {
  fetchPayrolls()
})
</script>

<style scoped>
.pagination-custom {
  .q-btn {
    padding: 8px 12px;
    font-size: 14px;
    min-height: unset;
    height: unset;
  }
}

:deep(.q-field) {
  margin-bottom: 0;
}

:deep(.q-field--outlined .q-field__control) {
  border-radius: 0.375rem;
}

:deep(.q-field--outlined .q-field__control:hover) {
  border-color: #d1d5db;
}

:deep(.q-field--focused .q-field__control) {
  border-color: #3b82f6;
}

:deep(.q-btn) {
  border-radius: 0.375rem;
}

:deep(.q-dialog__inner--minimized > div) {
  max-width: 600px;
}
</style>

