<template>
  <div class="min-h-screen bg-gray-50">
    <main class="py-6">
      <div class="mx-auto max-w-10xl px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-2xl font-semibold">Gastos</h1>
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
              label="Nuevo gasto"
              no-caps
              class="px-4"
              @click="showNewExpenseModal = true"
            >
              <template v-slot:append>
                <q-icon name="add" class="ml-2" />
              </template>
            </q-btn>
          </div>
        </div>

        <!-- Expenses Table -->
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
              <tr v-for="expense in expenses" :key="expense.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ formatDate(expense.date) }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ expense.description }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ expense.category }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  $ {{ formatNumber(expense.amount) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div class="flex justify-end space-x-2">
                    <q-btn flat round dense color="primary" icon="edit" @click="editExpense(expense)" />
                    <q-btn flat round dense color="negative" icon="delete" @click="deleteExpense(expense.id)" />
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
                Mostrando <span class="font-medium">{{ (currentPage - 1) * perPage + 1 }}</span> a <span class="font-medium">{{ Math.min(currentPage * perPage, totalExpenses) }}</span> de{' '}
                <span class="font-medium">{{ totalExpenses }}</span> resultados
              </p>
            </div>
            <div>
              <q-pagination
                v-model="currentPage"
                :max="totalPages"
                :max-pages="7"
                boundary-numbers
                direction-links
                @update:model-value="fetchExpenses"
              />
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- New/Edit Expense Modal -->
    <q-dialog v-model="showNewExpenseModal" persistent>
      <q-card class="w-[600px]">
        <q-card-section class="flex justify-between items-center">
          <h3 class="text-lg font-medium">{{ editingExpense ? 'Editar gasto' : 'Nuevo gasto' }}</h3>
          <q-btn flat round dense icon="close" @click="closeModal" />
        </q-card-section>

        <q-card-section>
          <form @submit.prevent="saveExpense">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">
                  Fecha <span class="text-red-500">*</span>
                </label>
                <q-input
                  v-model="expenseForm.date"
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
                  v-model="expenseForm.description"
                  outlined
                  dense
                  class="mt-1"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">
                  Categoría <span class="text-red-500">*</span>
                </label>
                <q-select
                  v-model="expenseForm.category"
                  :options="categoryOptions"
                  outlined
                  dense
                  class="mt-1"
                  emit-value
                  map-options
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">
                  Monto <span class="text-red-500">*</span>
                </label>
                <q-input
                  v-model.number="expenseForm.amount"
                  outlined
                  dense
                  type="number"
                  class="mt-1"
                  prefix="$"
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
const expenses = ref([])
const search = ref('')
const currentPage = ref(1)
const perPage = ref(10)
const totalExpenses = ref(0)
const showNewExpenseModal = ref(false)
const editingExpense = ref(null)
const expenseForm = ref({
  date: '',
  description: '',
  category: '',
  amount: null
})

// Options for dropdowns
const categoryOptions = [
  { label: 'Alquiler', value: 'Alquiler' },
  { label: 'Servicios', value: 'Servicios' },
  { label: 'Salarios', value: 'Salarios' },
  { label: 'Suministros', value: 'Suministros' },
  { label: 'Marketing', value: 'Marketing' },
  { label: 'Otros', value: 'Otros' }
]

// Table headers
const tableHeaders = [
  { text: 'Fecha', value: 'date', sortable: true },
  { text: 'Descripción', value: 'description', sortable: true },
  { text: 'Categoría', value: 'category', sortable: true },
  { text: 'Monto', value: 'amount', sortable: true }
]

// Computed
const totalPages = computed(() => Math.ceil(totalExpenses.value / perPage.value))

// Methods
const fetchExpenses = async () => {
  try {
    const response = await axios.get('/api/expenses', {
      params: {
        page: currentPage.value,
        per_page: perPage.value,
        search: search.value,
        sort_by: sortBy.value,
        sort_desc: sortDesc.value
      }
    })
    expenses.value = response.data.data
    totalExpenses.value = response.data.total
  } catch (error) {
    console.error('Error fetching expenses:', error)
    $q.notify({
      color: 'negative',
      message: 'Error al cargar los gastos. Por favor, intente de nuevo.'
    })
  }
}

const debouncedSearch = debounce(() => {
  currentPage.value = 1
  fetchExpenses()
}, 300)

const sortBy = (column) => {
  if (sortBy.value === column) {
    sortDesc.value = !sortDesc.value
  } else {
    sortBy.value = column
    sortDesc.value = false
  }
  fetchExpenses()
}

const editExpense = (expense) => {
  editingExpense.value = expense
  expenseForm.value = { ...expense }
  showNewExpenseModal.value = true
}

const closeModal = () => {
  showNewExpenseModal.value = false
  editingExpense.value = null
  expenseForm.value = {
    date: '',
    description: '',
    category: '',
    amount: null
  }
}

const saveExpense = async () => {
  try {
    if (editingExpense.value) {
      await axios.put(`/api/expenses/${editingExpense.value.id}`, expenseForm.value)
    } else {
      await axios.post('/api/expenses', expenseForm.value)
    }
    await fetchExpenses()
    closeModal()
    $q.notify({
      color: 'positive',
      message: `Gasto ${editingExpense.value ? 'actualizado' : 'creado'} exitosamente.`
    })
  } catch (error) {
    console.error('Error saving expense:', error)
    $q.notify({
      color: 'negative',
      message: 'Error al guardar el gasto. Por favor, intente de nuevo.'
    })
  }
}

const deleteExpense = async (id) => {
  try {
    await $q.dialog({
      title: 'Confirmar eliminación',
      message: '¿Está seguro de que desea eliminar este gasto?',
      cancel: true,
      persistent: true
    })
    await axios.delete(`/api/expenses/${id}`)
    await fetchExpenses()
    $q.notify({
      color: 'positive',
      message: 'Gasto eliminado exitosamente.'
    })
  } catch (error) {
    if (error) {
      console.error('Error deleting expense:', error)
      $q.notify({
        color: 'negative',
        message: 'Error al eliminar el gasto. Por favor, intente de nuevo.'
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

// Lifecycle hooks
onMounted(() => {
  fetchExpenses()
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
</style>
