<template>
  <div class="min-h-screen bg-gray-50">
    <main class="py-6">
      <div class="mx-auto max-w-10xl px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-2xl font-semibold">Gestión de cobro</h1>
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
              @input="debouncedSearch"
            >
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
            <q-btn color="primary" label="Nuevo crédito" @click="showCreateModal = true" />
          </div>
        </div>

        <!-- Collection Management Table -->
        <div class="bg-white rounded-lg shadow overflow-hidden">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th v-for="header in tableHeaders" :key="header.value" scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {{ header.text }}
                  <q-btn v-if="header.sortable" flat round dense size="sm" icon="arrow_upward" @click="sortBy(header.value)" />
                </th>
                <th scope="col" class="relative px-6 py-3">
                  <span class="sr-only">Acciones</span>
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="credit in credits" :key="credit.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ credit.credit_number }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ credit.client.name }}</div>
                  <div class="text-sm text-gray-500">{{ credit.client.identification }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <q-chip
                    :color="getStatusColor(credit.status)"
                    :text-color="getStatusTextColor(credit.status)"
                    :label="credit.status"
                    size="sm"
                    class="text-xs"
                    :class="getStatusClass(credit.status)"
                  />
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ formatDate(credit.start_date) }}</div>
                  <div class="text-sm text-gray-500">{{ formatDate(credit.end_date) }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  $ {{ formatNumber(credit.credit_amount) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ credit.installments }}</div>
                  <div class="text-sm text-gray-500">$ {{ formatNumber(credit.installment_amount) }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">$ {{ formatNumber(credit.paid_amount) }} (Pagado)</div>
                  <div class="text-sm text-gray-500">$ {{ formatNumber(credit.pending_amount) }} (Pendiente)</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div class="flex justify-end space-x-2">
                    <q-btn flat round dense color="primary" icon="notifications" v-if="credit.status !== 'Pendiente'" />
                    <q-btn flat round dense color="primary" icon="edit" @click="editCredit(credit)" />
                    <q-btn flat round dense color="negative" icon="delete" @click="deleteCredit(credit.id)" />
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
                Mostrando <span class="font-medium">{{ (currentPage - 1) * perPage + 1 }}</span> a <span class="font-medium">{{ Math.min(currentPage * perPage, totalCredits) }}</span> de{' '}
                <span class="font-medium">{{ totalCredits }}</span> resultados
              </p>
            </div>
            <div>
              <q-pagination
                v-model="currentPage"
                :max="totalPages"
                :max-pages="7"
                boundary-numbers
                direction-links
                @update:model-value="fetchCredits"
              />
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Create/Edit Credit Modal -->
    <q-dialog v-model="showCreateModal">
      <q-card class="w-[600px]">
        <q-card-section class="flex justify-between items-center">
          <h3 class="text-lg font-medium">{{ editingCredit ? 'Editar crédito' : 'Nuevo crédito' }}</h3>
          <q-btn flat round dense icon="close" @click="closeModal" />
        </q-card-section>

        <q-card-section>
          <form @submit.prevent="saveCredit">
            <div class="space-y-4">
              <div v-if="!editingCredit">
                <label class="block text-sm font-medium text-gray-700">
                  Número de crédito <span class="text-red-500">*</span>
                </label>
                <q-input v-model="creditForm.credit_number" outlined dense class="mt-1" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">
                  Cliente <span class="text-red-500">*</span>
                </label>
                <q-select
                  v-model="creditForm.client_id"
                  :options="clientOptions"
                  outlined
                  dense
                  class="mt-1"
                  emit-value
                  map-options
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">
                  Estado <span class="text-red-500">*</span>
                </label>
                <q-select
                  v-model="creditForm.status"
                  :options="statusOptions"
                  outlined
                  dense
                  class="mt-1"
                  emit-value
                  map-options
                />
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700">
                    Fecha de inicio <span class="text-red-500">*</span>
                  </label>
                  <q-input v-model="creditForm.start_date" outlined dense type="date" class="mt-1" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">
                    Fecha de fin <span class="text-red-500">*</span>
                  </label>
                  <q-input v-model="creditForm.end_date" outlined dense type="date" class="mt-1" />
                </div>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700">
                    Valor del crédito <span class="text-red-500">*</span>
                  </label>
                  <q-input v-model.number="creditForm.credit_amount" outlined dense type="number" class="mt-1" prefix="$" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">
                    Número de cuotas <span class="text-red-500">*</span>
                  </label>
                  <q-input v-model.number="creditForm.installments" outlined dense type="number" class="mt-1" />
                </div>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700">
                    Valor de cuota <span class="text-red-500">*</span>
                  </label>
                  <q-input v-model.number="creditForm.installment_amount" outlined dense type="number" class="mt-1" prefix="$" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">
                    Monto pagado
                  </label>
                  <q-input v-model.number="creditForm.paid_amount" outlined dense type="number" class="mt-1" prefix="$" />
                </div>
              </div>
            </div>
            <div class="mt-4 flex justify-end">
              <q-btn flat label="Cancelar" color="gray" @click="closeModal" class="mr-2" />
              <q-btn unelevated type="submit" label="Guardar" color="primary" />
            </div>
          </form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import axios from 'axios'
import { debounce } from 'lodash'

const $q = useQuasar()

// State
const credits = ref([])
const search = ref('')
const currentPage = ref(1)
const perPage = ref(10)
const totalCredits = ref(0)
const showCreateModal = ref(false)
const editingCredit = ref(null)
const creditForm = ref({
  credit_number: '',
  client_id: null,
  status: '',
  start_date: '',
  end_date: '',
  credit_amount: null,
  installments: null,
  installment_amount: null,
  paid_amount: 0,
  pending_amount: 0
})

// Options for dropdowns
const statusOptions = [
  { label: 'Pago parcial', value: 'Pago parcial' },
  { label: 'Vencido', value: 'Vencido' },
  { label: 'Pendiente', value: 'Pendiente' }
]

const clientOptions = ref([])

// Table headers
const tableHeaders = [
  { text: 'N° Crédito', value: 'credit_number', sortable: true },
  { text: 'Cliente', value: 'client.name', sortable: true },
  { text: 'Estado de pago', value: 'status', sortable: false },
  { text: 'Fecha (Desde / Hasta)', value: 'start_date', sortable: true },
  { text: 'Valor del crédito', value: 'credit_amount', sortable: true },
  { text: 'Cuotas', value: 'installments', sortable: false },
  { text: 'Valor (Pagado / Pendiente)', value: 'paid_amount', sortable: true }
]

// Computed
const totalPages = computed(() => Math.ceil(totalCredits.value / perPage.value))

// Methods
const fetchCredits = async () => {
  try {
    const response = await axios.get('/api/credits', {
      params: {
        page: currentPage.value,
        per_page: perPage.value,
        search: search.value,
        sort_by: sortBy.value,
        sort_desc: sortDesc.value
      }
    })
    credits.value = response.data.data
    totalCredits.value = response.data.total
  } catch (error) {
    console.error('Error fetching credits:', error)
    $q.notify({
      color: 'negative',
      message: 'Error al cargar los créditos. Por favor, intente de nuevo.'
    })
  }
}

const fetchClients = async () => {
  try {
    const response = await axios.get('/api/clients')
    clientOptions.value = response.data.map(client => ({
      label: `${client.name} (${client.identification})`,
      value: client.id
    }))
  } catch (error) {
    console.error('Error fetching clients:', error)
    $q.notify({
      color: 'negative',
      message: 'Error al cargar los clientes. Por favor, intente de nuevo.'
    })
  }
}

const debouncedSearch = debounce(() => {
  currentPage.value = 1
  fetchCredits()
}, 300)

const sortBy = (column) => {
  if (sortBy.value === column) {
    sortDesc.value = !sortDesc.value
  } else {
    sortBy.value = column
    sortDesc.value = false
  }
  fetchCredits()
}

const editCredit = (credit) => {
  editingCredit.value = credit
  creditForm.value = { ...credit }
  showCreateModal.value = true
}

const closeModal = () => {
  showCreateModal.value = false
  editingCredit.value = null
  creditForm.value = {
    credit_number: '',credit_number: '',
    client_id: null,
    status: '',
    start_date: '',
    end_date: '',
    credit_amount: null,
    installments: null,
    installment_amount: null,
    paid_amount: 0,
    pending_amount: 0
  }
}

const saveCredit = async () => {
  try {
    if (editingCredit.value) {
      await axios.put(`/api/credits/${editingCredit.value.id}`, creditForm.value)
    } else {
      await axios.post('/api/credits', creditForm.value)
    }
    await fetchCredits()
    closeModal()
    $q.notify({
      color: 'positive',
      message: `Crédito ${editingCredit.value ? 'actualizado' : 'creado'} exitosamente.`
    })
  } catch (error) {
    console.error('Error saving credit:', error)
    $q.notify({
      color: 'negative',
      message: 'Error al guardar el crédito. Por favor, intente de nuevo.'
    })
  }
}

const deleteCredit = async (id) => {
  try {
    await $q.dialog({
      title: 'Confirmar eliminación',
      message: '¿Está seguro de que desea eliminar este crédito?',
      cancel: true,
      persistent: true
    })
    await axios.delete(`/api/credits/${id}`)
    await fetchCredits()
    $q.notify({
      color: 'positive',
      message: 'Crédito eliminado exitosamente.'
    })
  } catch (error) {
    if (error) {
      console.error('Error deleting credit:', error)
      $q.notify({
        color: 'negative',
        message: 'Error al eliminar el crédito. Por favor, intente de nuevo.'
      })
    }
  }
}

const formatNumber = (value) => {
  return new Intl.NumberFormat('es-CO', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value)
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('es-CO')
}

const getStatusColor = (status) => {
  const colors = {
    'Pago parcial': 'blue',
    'Vencido': 'red',
    'Pendiente': 'gray'
  }
  return colors[status] || 'gray'
}

const getStatusTextColor = (status) => {
  return status === 'Pendiente' ? 'black' : 'white'
}

const getStatusClass = (status) => {
  return status === 'Pendiente' ? 'bg-opacity-20' : ''
}

// Lifecycle hooks
onMounted(() => {
  fetchCredits()
  fetchClients()
})
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

