<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Main Content -->
    <main class="py-6">
      <div class="mx-auto max-w-10xl px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-2xl font-semibold">Ingresos</h1>
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
              label="Nuevo ingreso"
              no-caps
              class="px-4 fixed sm:fixed md:fixed lg:relative bottom-5 sm:bottom-5 lg:bottom-0 w-11/12 sm:w-11/12 md:w-11/12 lg:w-auto"
              @click="showCreateModal = true"
            >
              <q-icon name="add" class="ml-2" />
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
            <q-tab name="etiquetas" label="Etiquetas" />
            <q-tab name="historial" label="Historial ingresos" />
          </q-tabs>
        </div>

        <!-- Incomes Table -->
        <div class="bg-white rounded-lg shadow overflow-hidden">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead>
                <tr class="bg-gray-50">
                  <th scope="col" class="w-16 px-6 py-3 text-left">
                    <span class="sr-only">Estado</span>
                  </th>
                  <th scope="col" class="px-6 py-3 text-left">
                    <div class="flex items-center">
                      <span class="text-sm font-medium text-gray-500">Nombre</span>
                      <q-btn flat round dense icon="arrow_upward" size="sm" @click="sortBy('name')" />
                    </div>
                  </th>
                  <th scope="col" class="px-6 py-3 text-left">
                    <div class="flex items-center">
                      <span class="text-sm font-medium text-gray-500">Categoría</span>
                      <q-btn flat round dense icon="arrow_upward" size="sm" @click="sortBy('category')" />
                    </div>
                  </th>
                  <th scope="col" class="px-6 py-3 text-left">
                    <span class="text-sm font-medium text-gray-500">Rutas</span>
                  </th>
                  <th scope="col" class="px-6 py-3 text-left">
                    <span class="text-sm font-medium text-gray-500">Ingresos</span>
                  </th>
                  <th scope="col" class="w-20 px-6 py-3 text-right">
                    <span class="sr-only">Acciones</span>
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr v-for="income in filteredIncomes" :key="income.id" class="hover:bg-gray-50">
                  <td class="px-6 py-4">
                    <q-toggle
                      v-model="income.active"
                      color="primary"
                      @update:model-value="toggleIncome(income)"
                    />
                  </td>
                  <td class="px-6 py-4">
                    <div class="text-sm font-medium text-gray-900">{{ income.name }}</div>
                  </td>
                  <td class="px-6 py-4">
                    <q-chip
                      :label="income.category"
                      :color="getCategoryColor(income.category)"
                      text-color="white"
                      size="sm"
                    />
                  </td>
                  <td class="px-6 py-4">
                    <div class="text-sm text-gray-900">{{ income.route_number }}</div>
                  </td>
                  <td class="px-6 py-4">
                    <span class="px-2.5 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-800">
                      $ {{ formatNumber(income.total_amount) }}
                    </span>
                  </td>
                  <td class="px-1 py-4 text-right">
                    <div class="flex justify-end items-center">
                      <q-btn flat round dense color="primary" @click="editIncome(income)">
                        <img src="/icons/edit.svg" alt="Edit" />
                      </q-btn>
                      <q-btn flat round dense color="negative" @click="confirmDeleteIncome(income)">
                        <img src="/icons/trash-2.svg" alt="Delete" />
                      </q-btn>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div class="px-6 py-4 flex items-center justify-between border-t border-gray-200">
            <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p class="text-sm text-gray-700">
                  Mostrando <span class="font-medium">{{ paginationStart }}</span> a
                  <span class="font-medium">{{ paginationEnd }}</span> de
                  <span class="font-medium">{{ totalIncomes }}</span> resultados
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
                    class="pagination-custom"
                  />
                </nav>
              </div>
            </div>
          </div>
        </div>

        <!-- Create/Edit Income Modal -->
        <q-dialog v-model="showCreateModal" persistent>
          <q-card class="w-[500px]">
            <q-card-section class="flex justify-between items-center">
              <h3 class="text-lg font-medium">{{ isEditing ? 'Editar ingreso' : 'Nuevo ingreso' }}</h3>
              <q-btn flat round dense icon="close" @click="closeModal" />
            </q-card-section>

            <q-card-section>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700">
                    Nombre <span class="text-red-500">*</span>
                  </label>
                  <q-input
                    v-model="incomeForm.name"
                    outlined
                    dense
                    class="mt-1"
                    :rules="[val => !!val || 'El nombre es requerido']"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700">
                    Categoría <span class="text-red-500">*</span>
                  </label>
                  <q-select
                    v-model="incomeForm.category"
                    :options="categories"
                    outlined
                    dense
                    class="mt-1"
                    :rules="[val => !!val || 'La categoría es requerida']"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700">
                    Rutas asociadas
                  </label>
                  <q-select
                    v-model="incomeForm.routes"
                    :options="routeOptions"
                    outlined
                    dense
                    multiple
                    use-chips
                    class="mt-1"
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
                class="mr-3"
                @click="closeModal"
              />
              <q-btn
                no-caps
                :label="isEditing ? 'Guardar' : 'Crear'"
                color="primary"
                @click="saveIncome"
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
                  ¡Atención! Eliminación de ingreso
                </h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    ¿Está seguro de que desea eliminar el ingreso
                    <span class="font-medium">{{ selectedIncome?.name }}</span>?
                  </p>
                  <p class="mt-2 text-sm text-gray-500">
                    Esta acción es irreversible y eliminará permanentemente toda la información
                    asociada a este ingreso.
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
                    @click="deleteIncome"
                  />
                </div>
              </div>
            </div>
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
const activeTab = ref('etiquetas')
const currentPage = ref(1)
const itemsPerPage = ref(10)
const totalIncomes = ref(0)
const showCreateModal = ref(false)
const showDeleteModal = ref(false)
const isEditing = ref(false)
const selectedIncome = ref(null)

const incomeForm = ref({
  name: '',
  category: null,
  routes: [],
  active: true
})

const incomes = ref([])
const routes = ref([])

const categories = [
  'Ventas',
  'Servicios',
  'Comisiones',
  'Intereses',
  'Otros'
]

// Computed
const filteredIncomes = computed(() => {
  return incomes.value.filter(income =>
    income.name.toLowerCase().includes(search.value.toLowerCase())
  )
})

const totalPages = computed(() => {
  return Math.ceil(totalIncomes.value / itemsPerPage.value)
})

const paginationStart = computed(() => {
  return (currentPage.value - 1) * itemsPerPage.value + 1
})

const paginationEnd = computed(() => {
  return Math.min(currentPage.value * itemsPerPage.value, totalIncomes.value)
})

const routeOptions = computed(() => {
  return routes.value.map(route => ({
    label: route.name,
    value: route.id
  }))
})

// Methods
const getCategoryColor = (category) => {
  const colors = {
    'Ventas': 'green',
    'Servicios': 'blue',
    'Comisiones': 'purple',
    'Intereses': 'orange',
    'Otros': 'gray'
  }
  return colors[category] || 'gray'
}

const formatNumber = (value) => {
  return new Intl.NumberFormat('es-CO', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value)
}

const fetchIncomes = async () => {
  try {
    const response = await axios.get('/api/incomes')
    incomes.value = response.data
    totalIncomes.value = response.data.length
  } catch (error) {
    console.error('Error fetching incomes:', error)
    $q.notify({
      type: 'negative',
      message: 'Error al cargar los ingresos'
    })
  }
}

const fetchRoutes = async () => {
  try {
    const response = await axios.get('/api/routes')
    routes.value = response.data
  } catch (error) {
    console.error('Error fetching routes:', error)
    $q.notify({
      type: 'negative',
      message: 'Error al cargar las rutas'
    })
  }
}

const sortBy = (field) => {
  // Implement sorting logic here
}

const closeModal = () => {
  showCreateModal.value = false
  isEditing.value = false
  incomeForm.value = {
    name: '',
    category: null,
    routes: [],
    active: true
  }
}

const editIncome = (income) => {
  selectedIncome.value = income
  isEditing.value = true
  incomeForm.value = { ...income }
  showCreateModal.value = true
}

const saveIncome = async () => {
  try {
    if (isEditing.value) {
      await axios.put(`/api/incomes/${selectedIncome.value.id}`, incomeForm.value)
    } else {
      await axios.post('/api/incomes', incomeForm.value)
    }
    await fetchIncomes()
    $q.notify({
      type: 'positive',
      message: `Ingreso ${isEditing.value ? 'actualizado' : 'creado'} exitosamente`
    })
    closeModal()
  } catch (error) {
    console.error('Error saving income:', error)
    $q.notify({
      type: 'negative',
      message: 'Error al guardar el ingreso'
    })
  }
}

const confirmDeleteIncome = (income) => {
  selectedIncome.value = income
  showDeleteModal.value = true
}

const deleteIncome = async () => {
  try {
    await axios.delete(`/api/incomes/${selectedIncome.value.id}`)
    await fetchIncomes()
    $q.notify({
      type: 'positive',
      message: 'Ingreso eliminado exitosamente'
    })
    showDeleteModal.value = false
  } catch (error) {
    console.error('Error deleting income:', error)
    $q.notify({
      type: 'negative',
      message: 'Error al eliminar el ingreso'
    })
  }
}

const toggleIncome = async (income) => {
  try {
    await axios.put(`/api/incomes/${income.id}`, {
      active: income.active
    })
    $q.notify({
      type: 'positive',
      message: `Ingreso ${income.active ? 'activado' : 'desactivado'} exitosamente`
    })
  } catch (error) {
    console.error('Error toggling income:', error)
    income.active = !income.active
    $q.notify({
      type: 'negative',
      message: 'Error al cambiar el estado del ingreso'
    })
  }
}

onMounted(() => {
  fetchIncomes()
  fetchRoutes()
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

