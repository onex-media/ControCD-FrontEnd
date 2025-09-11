<template>
  <div class="min-h-screen bg-gray-50">
    <main class="py-6">
      <div class="mx-auto max-w-10xl px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-2xl font-semibold">Ahorros</h1>
          <div class="flex items-center gap-4">
            <q-btn flat round dense color="primary" icon="event" />
            <q-btn flat round dense color="primary" icon="filter_alt" />
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
            <q-btn
              color="primary"
              label="Nuevo ahorro"
              no-caps
              class="px-4"
              @click="showNewSavingModal = true"
            >
              <template v-slot:append>
                <q-icon name="add" class="ml-2" />
              </template>
            </q-btn>
          </div>
        </div>

        <!-- Savings Table -->
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
              <tr v-for="saving in savings" :key="saving.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ formatDate(saving.date) }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ saving.description }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  $ {{ formatNumber(saving.amount) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <q-chip
                    :color="getTypeColor(saving.type)"
                    :text-color="getTypeTextColor(saving.type)"
                    :label="saving.type"
                    size="sm"
                    class="text-xs"
                  />
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div class="flex justify-end space-x-2">
                    <q-btn flat round dense color="primary" icon="edit" @click="editSaving(saving)" />
                    <q-btn flat round dense color="negative" icon="delete" @click="deleteSaving(saving.id)" />
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
                Mostrando <span class="font-medium">{{ (currentPage - 1) * perPage + 1 }}</span> a <span class="font-medium">{{ Math.min(currentPage * perPage, totalSavings) }}</span> de{' '}
                <span class="font-medium">{{ totalSavings }}</span> resultados
              </p>
            </div>
            <div>
              <q-pagination
                v-model="currentPage"
                :max="totalPages"
                :max-pages="7"
                boundary-numbers
                direction-links
                @update:model-value="fetchSavings"
              />
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- New/Edit Saving Modal -->
    <q-dialog v-model="showNewSavingModal" persistent>
      <q-card class="w-[600px]">
        <q-card-section class="flex justify-between items-center">
          <h3 class="text-lg font-medium">{{ editingSaving ? 'Editar ahorro' : 'Nuevo ahorro' }}</h3>
          <q-btn flat round dense icon="close" @click="closeModal" />
        </q-card-section>

        <q-card-section>
          <form @submit.prevent="saveSaving">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">
                  Fecha <span class="text-red-500">*</span>
                </label>
                <q-input
                  v-model="savingForm.date"
                  outlined
                  dense
                  type="date"
                  class="mt-1"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">
                  Descripción <span class="text-red-500">*</span>
                </label>
                <q-input
                  v-model="savingForm.description"
                  outlined
                  dense
                  class="mt-1"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">
                  Monto <span class="text-red-500">*</span>
                </label>
                <q-input
                  v-model.number="savingForm.amount"
                  outlined
                  dense
                  type="number"
                  class="mt-1"
                  prefix="$"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">
                  Tipo <span class="text-red-500">*</span>
                </label>
                <q-select
                  v-model="savingForm.type"
                  :options="typeOptions"
                  outlined
                  dense
                  class="mt-1"
                  emit-value
                  map-options
                />
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
const savings = ref([])
const search = ref('')
const currentPage = ref(1)
const perPage = ref(10)
const totalSavings = ref(0)
const showNewSavingModal = ref(false)
const editingSaving = ref(null)
const savingForm = ref({
  date: '',
  description: '',
  amount: null,
  type: ''
})

// Options for dropdowns
const typeOptions = [
  { label: 'Depósito', value: 'Depósito' },
  { label: 'Retiro', value: 'Retiro' },
  { label: 'Interés', value: 'Interés' }
]

// Table headers
const tableHeaders = [
  { text: 'Fecha', value: 'date', sortable: true },
  { text: 'Descripción', value: 'description', sortable: true },
  { text: 'Monto', value: 'amount', sortable: true },
  { text: 'Tipo', value: 'type', sortable: true }
]

// Computed
const totalPages = computed(() => Math.ceil(totalSavings.value / perPage.value))

// Methods
const fetchSavings = async () => {
  try {
    const response = await axios.get('/api/savings', {
      params: {
        page: currentPage.value,
        per_page: perPage.value,
        search: search.value,
        sort_by: sortBy.value,
        sort_desc: sortDesc.value
      }
    })
    savings.value = response.data.data
    totalSavings.value = response.data.total
  } catch (error) {
    console.error('Error fetching savings:', error)
    $q.notify({
      color: 'negative',
      message: 'Error al cargar los ahorros. Por favor, intente de nuevo.'
    })
  }
}

const debouncedSearch = debounce(() => {
  currentPage.value = 1
  fetchSavings()
}, 300)

const sortBy = (column) => {
  if (sortBy.value === column) {
    sortDesc.value = !sortDesc.value
  } else {
    sortBy.value = column
    sortDesc.value = false
  }
  fetchSavings()
}

const editSaving = (saving) => {
  editingSaving.value = saving
  savingForm.value = { ...saving }
  showNewSavingModal.value = true
}

const closeModal = () => {
  showNewSavingModal.value = false
  editingSaving.value = null
  savingForm.value = {
    date: '',
    description: '',
    amount: null,
    type: ''
  }
}

const saveSaving = async () => {
  try {
    if (editingSaving.value) {
      await axios.put(`/api/savings/${editingSaving.value.id}`, savingForm.value)
    } else {
      await axios.post('/api/savings', savingForm.value)
    }
    await fetchSavings()
    closeModal()
    $q.notify({
      color: 'positive',
      message: `Ahorro ${editingSaving.value ? 'actualizado' : 'creado'} exitosamente.`
    })
  } catch (error) {
    console.error('Error saving saving:', error)
    $q.notify({
      color: 'negative',
      message: 'Error al guardar el ahorro. Por favor, intente de nuevo.'
    })
  }
}

const deleteSaving = async (id) => {
  try {
    await $q.dialog({
      title: 'Confirmar eliminación',
      message: '¿Está seguro de que desea eliminar este ahorro?',
      cancel: true,
      persistent: true
    })
    await axios.delete(`/api/savings/${id}`)
    await fetchSavings()
    $q.notify({
      color: 'positive',
      message: 'Ahorro eliminado exitosamente.'
    })
  } catch (error) {
    if (error) {
      console.error('Error deleting saving:', error)
      $q.notify({
        color: 'negative',
        message: 'Error al eliminar el ahorro. Por favor, intente de nuevo.'
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

const getTypeColor = (type) => {
  const colors = {
    'Depósito': 'green',
    'Retiro': 'red',
    'Interés': 'blue'
  }
  return colors[type] || 'gray'
}

const getTypeTextColor = (type) => {
  return 'white'
}

// Lifecycle hooks
onMounted(() => {
  fetchSavings()
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

