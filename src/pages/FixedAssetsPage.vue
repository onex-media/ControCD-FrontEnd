<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Main Content -->
    <main class="py-6">
      <div class="mx-auto max-w-10xl px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-2xl font-semibold">Activos fijos</h1>
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
              label="Nueva etiqueta"
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
            <q-tab name="historial" label="Historial compras" />
          </q-tabs>
        </div>

        <!-- Assets Table -->
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
                    <span class="text-sm font-medium text-gray-500">Compras</span>
                  </th>
                  <th scope="col" class="w-20 px-6 py-3 text-right">
                    <span class="sr-only">Acciones</span>
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr v-for="asset in filteredAssets" :key="asset.id" class="hover:bg-gray-50">
                  <td class="px-6 py-4">
                    <q-toggle
                      v-model="asset.active"
                      color="primary"
                      @update:model-value="toggleAsset(asset)"
                    />
                  </td>
                  <td class="px-6 py-4">
                    <div class="text-sm font-medium text-gray-900">{{ asset.name }}</div>
                  </td>
                  <td class="px-6 py-4">
                    <q-chip
                      :label="asset.category"
                      :color="getCategoryColor(asset.category)"
                      text-color="white"
                      size="sm"
                    />
                  </td>
                  <td class="px-6 py-4">
                    <div class="flex gap-2">
                      <span class="px-2.5 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                        {{ asset.total_purchases }} compras
                      </span>
                    </div>
                  </td>
                  <td class="px-1 py-4 text-right">
                    <div class="flex justify-end items-center">
                      <q-btn flat round dense color="primary" @click="editAsset(asset)">
                        <img src="/icons/edit.svg" alt="Edit" />
                      </q-btn>
                      <q-btn flat round dense color="negative" @click="confirmDeleteAsset(asset)">
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
                  <span class="font-medium">{{ totalAssets }}</span> resultados
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

        <!-- Create/Edit Asset Modal -->
        <q-dialog v-model="showCreateModal" persistent>
          <q-card class="w-[500px]">
            <q-card-section class="flex justify-between items-center">
              <h3 class="text-lg font-medium">{{ isEditing ? 'Editar activo' : 'Nuevo activo' }}</h3>
              <q-btn flat round dense icon="close" @click="closeModal" />
            </q-card-section>

            <q-card-section>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700">
                    Nombre <span class="text-red-500">*</span>
                  </label>
                  <q-input
                    v-model="assetForm.name"
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
                    v-model="assetForm.category"
                    :options="categories"
                    outlined
                    dense
                    class="mt-1"
                    :rules="[val => !!val || 'La categoría es requerida']"
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
                @click="saveAsset"
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
                  ¡Atención! Eliminación de activo
                </h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    ¿Está seguro de que desea eliminar el activo
                    <span class="font-medium">{{ selectedAsset?.name }}</span>?
                  </p>
                  <p class="mt-2 text-sm text-gray-500">
                    Esta acción es irreversible y eliminará permanentemente toda la información
                    asociada a este activo.
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
                    @click="deleteAsset"
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
const totalAssets = ref(0)
const showCreateModal = ref(false)
const showDeleteModal = ref(false)
const isEditing = ref(false)
const selectedAsset = ref(null)

const assetForm = ref({
  name: '',
  category: null,
  active: true
})

const assets = ref([])

const categories = [
  'Mobiliario',
  'Equipos oficina',
  'Equipos informáticos',
  'Software',
  'Comunicación',
  'Otros'
]

// Computed
const filteredAssets = computed(() => {
  return assets.value.filter(asset =>
    asset.name.toLowerCase().includes(search.value.toLowerCase())
  )
})

const totalPages = computed(() => {
  return Math.ceil(totalAssets.value / itemsPerPage.value)
})

const paginationStart = computed(() => {
  return (currentPage.value - 1) * itemsPerPage.value + 1
})

const paginationEnd = computed(() => {
  return Math.min(currentPage.value * itemsPerPage.value, totalAssets.value)
})

// Methods
const getCategoryColor = (category) => {
  const colors = {
    'Mobiliario': 'brown',
    'Equipos oficina': 'blue',
    'Equipos informáticos': 'purple',
    'Software': 'green',
    'Comunicación': 'orange',
    'Otros': 'gray'
  }
  return colors[category] || 'gray'
}

const fetchAssets = async () => {
  try {
    const response = await axios.get('/api/assets')
    assets.value = response.data
    totalAssets.value = response.data.length
  } catch (error) {
    console.error('Error fetching assets:', error)
    $q.notify({
      type: 'negative',
      message: 'Error al cargar los activos'
    })
  }
}

const sortBy = (field) => {
  // Implement sorting logic here
}

const closeModal = () => {
  showCreateModal.value = false
  isEditing.value = false
  assetForm.value = {
    name: '',
    category: null,
    active: true
  }
}

const editAsset = (asset) => {
  selectedAsset.value = asset
  isEditing.value = true
  assetForm.value = { ...asset }
  showCreateModal.value = true
}

const saveAsset = async () => {
  try {
    if (isEditing.value) {
      await axios.put(`/api/assets/${selectedAsset.value.id}`, assetForm.value)
    } else {
      await axios.post('/api/assets', assetForm.value)
    }
    await fetchAssets()
    $q.notify({
      type: 'positive',
      message: `Activo ${isEditing.value ? 'actualizado' : 'creado'} exitosamente`
    })
    closeModal()
  } catch (error) {
    console.error('Error saving asset:', error)
    $q.notify({
      type: 'negative',
      message: 'Error al guardar el activo'
    })
  }
}

const confirmDeleteAsset = (asset) => {
  selectedAsset.value = asset
  showDeleteModal.value = true
}

const deleteAsset = async () => {
  try {
    await axios.delete(`/api/assets/${selectedAsset.value.id}`)
    await fetchAssets()
    $q.notify({
      type: 'positive',
      message: 'Activo eliminado exitosamente'
    })
    showDeleteModal.value = false
  } catch (error) {
    console.error('Error deleting asset:', error)
    $q.notify({
      type: 'negative',
      message: 'Error al eliminar el activo'
    })
  }
}

const toggleAsset = async (asset) => {
  try {
    await axios.put(`/api/assets/${asset.id}`, {
      active: asset.active
    })
    $q.notify({
      type: 'positive',
      message: `Activo ${asset.active ? 'activado' : 'desactivado'} exitosamente`
    })
  } catch (error) {
    console.error('Error toggling asset:', error)
    asset.active = !asset.active
    $q.notify({
      type: 'negative',
      message: 'Error al cambiar el estado del activo'
    })
  }
}

onMounted(() => {
  fetchAssets()
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

