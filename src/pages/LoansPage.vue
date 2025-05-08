<template>
  <div class="min-h-screen bg-gray-50">
    <main class="py-6">
      <div class="mx-auto max-w-10xl px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-2xl font-semibold">Préstamos</h1>
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
              label="Nuevo préstamo"
              no-caps
              class="px-4"
              @click="showNewLoanModal = true"
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
            @update:model-value="changeTab"
          >
            <q-tab name="pending" label="Pendientes" />
            <q-tab name="history" label="Historial" />
          </q-tabs>
        </div>

        <!-- Loans Table -->
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
              <tr v-for="loan in loans" :key="loan.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ formatDate(loan.date) }}</div>
                  <div class="text-sm text-gray-500">{{ formatTime(loan.date) }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <q-chip
                    :color="getStatusColor(loan.status)"
                    :text-color="getStatusTextColor(loan.status)"
                    :label="loan.status"
                    size="sm"
                    class="text-xs"
                    :class="getStatusClass(loan.status)"
                  />
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ loan.member.name }}</div>
                  <div class="text-sm text-gray-500">{{ loan.member.identification }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <q-chip
                    :color="getRoleColor(loan.member.role)"
                    :text-color="getRoleTextColor(loan.member.role)"
                    :label="loan.member.role"
                    size="sm"
                    class="text-xs"
                    :class="getRoleClass(loan.member.role)"
                  >
                    <template v-slot:avatar v-if="getRoleIcon(loan.member.role)">
                      <q-icon :name="getRoleIcon(loan.member.role)" />
                    </template>
                  </q-chip>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  $ {{ formatNumber(loan.loan_amount) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  $ {{ formatNumber(loan.installment_amount) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  $ {{ formatNumber(loan.balance) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ loan.current_installment }}</div>
                  <div class="text-sm text-gray-500">{{ loan.total_installments }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div class="flex justify-end space-x-2">
                    <q-btn flat round dense color="primary" icon="bolt" v-if="loan.status === 'Activo'" @click="makePayment(loan)" />
                    <q-btn flat round dense color="primary" icon="edit" @click="editLoan(loan)" />
                    <q-btn flat round dense color="negative" icon="delete" @click="deleteLoan(loan.id)" />
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
                Mostrando <span class="font-medium">{{ (currentPage - 1) * perPage + 1 }}</span> a <span class="font-medium">{{ Math.min(currentPage * perPage, totalLoans) }}</span> de{' '}
                <span class="font-medium">{{ totalLoans }}</span> resultados
              </p>
            </div>
            <div>
              <q-pagination
                v-model="currentPage"
                :max="totalPages"
                :max-pages="7"
                boundary-numbers
                direction-links
                @update:model-value="fetchLoans"
              />
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- New/Edit Loan Modal -->
    <q-dialog v-model="showNewLoanModal" persistent>
      <q-card class="w-[600px]">
        <q-card-section class="flex justify-between items-center">
          <h3 class="text-lg font-medium">{{ editingLoan ? 'Editar préstamo' : 'Nuevo préstamo' }}</h3>
          <q-btn flat round dense icon="close" @click="closeModal" />
        </q-card-section>

        <q-card-section>
          <form @submit.prevent="saveLoan">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">
                  Miembro <span class="text-red-500">*</span>
                </label>
                <q-select
                  v-model="loanForm.member_id"
                  :options="memberOptions"
                  outlined
                  dense
                  class="mt-1"
                  emit-value
                  map-options
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">
                  Rol <span class="text-red-500">*</span>
                </label>
                <q-select
                  v-model="loanForm.role"
                  :options="roleOptions"
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
                    Valor del préstamo <span class="text-red-500">*</span>
                  </label>
                  <q-input
                    v-model.number="loanForm.loan_amount"
                    outlined
                    dense
                    type="number"
                    class="mt-1"
                    prefix="$"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">
                    Número de cuotas <span class="text-red-500">*</span>
                  </label>
                  <q-input
                    v-model.number="loanForm.total_installments"
                    outlined
                    dense
                    type="number"
                    class="mt-1"
                  />
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">
                  Fecha de inicio <span class="text-red-500">*</span>
                </label>
                <q-input
                  v-model="loanForm.start_date"
                  outlined
                  dense
                  type="date"
                  class="mt-1"
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

    <!-- Make Payment Modal -->
    <q-dialog v-model="showPaymentModal" persistent>
      <q-card class="w-[400px]">
        <q-card-section class="flex justify-between items-center">
          <h3 class="text-lg font-medium">Realizar pago</h3>
          <q-btn flat round dense icon="close" @click="showPaymentModal = false" />
        </q-card-section>

        <q-card-section>
          <form @submit.prevent="submitPayment">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">
                  Monto del pago <span class="text-red-500">*</span>
                </label>
                <q-input
                  v-model.number="paymentForm.amount"
                  outlined
                  dense
                  type="number"
                  class="mt-1"
                  prefix="$"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">
                  Fecha del pago <span class="text-red-500">*</span>
                </label>
                <q-input
                  v-model="paymentForm.payment_date"
                  outlined
                  dense
                  type="date"
                  class="mt-1"
                />
              </div>
            </div>
            <div class="mt-4 flex justify-end">
              <q-btn flat label="Cancelar" color="gray" @click="showPaymentModal = false" class="mr-2" />
              <q-btn unelevated type="submit" label="Realizar pago" color="primary" />
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
const loans = ref([])
const search = ref('')
const currentTab = ref('pending')
const currentPage = ref(1)
const perPage = ref(10)
const totalLoans = ref(0)
const showNewLoanModal = ref(false)
const showPaymentModal = ref(false)
const editingLoan = ref(null)
const loanForm = ref({
  member_id: null,
  role: '',
  loan_amount: null,
  total_installments: null,
  start_date: ''
})
const paymentForm = ref({
  amount: null,
  payment_date: ''
})

// Options for dropdowns
const roleOptions = [
  { label: 'Asistente', value: 'asistente' },
  { label: 'Cobrador', value: 'cobrador' },
  { label: 'Socio', value: 'socio' }
]

const memberOptions = ref([])

// Table headers
const tableHeaders = [
  { text: 'Fecha / Hora', value: 'date', sortable: true },
  { text: 'Estado', value: 'status', sortable: false },
  { text: 'Miembro', value: 'member.name', sortable: true },
  { text: 'Rol', value: 'member.role', sortable: false },
  { text: 'Valor del préstamo', value: 'loan_amount', sortable: true },
  { text: 'Valor cuotas', value: 'installment_amount', sortable: true },
  { text: 'Saldo', value: 'balance', sortable: true },
  { text: 'N° Cuota', value: 'current_installment', sortable: true }
]

// Computed
const totalPages = computed(() => Math.ceil(totalLoans.value / perPage.value))

// Methods
const fetchLoans = async () => {
  try {
    const response = await axios.get('/api/loans', {
      params: {
        page: currentPage.value,
        per_page: perPage.value,
        search: search.value,
        tab: currentTab.value,
        sort_by: sortBy.value,
        sort_desc: sortDesc.value
      }
    })
    loans.value = response.data.data
    totalLoans.value = response.data.total
  } catch (error) {
    console.error('Error fetching loans:', error)
    $q.notify({
      color: 'negative',
      message: 'Error al cargar los préstamos. Por favor, intente de nuevo.'
    })
  }
}

const fetchMembers = async () => {
  try {
    const response = await axios.get('/api/members')
    memberOptions.value = response.data.map(member => ({
      label: `${member.name} (${member.identification})`,
      value: member.id
    }))
  } catch (error) {
    console.error('Error fetching members:', error)
    $q.notify({
      color: 'negative',
      message: 'Error al cargar los miembros. Por favor, intente de nuevo.'
    })
  }
}

const debouncedSearch = debounce(() => {
  currentPage.value = 1
  fetchLoans()
}, 300)

const sortBy = (column) => {
  if (sortBy.value === column) {
    sortDesc.value = !sortDesc.value
  } else {
    sortBy.value = column
    sortDesc.value = false
  }
  fetchLoans()
}

const changeTab = () => {
  currentPage.value = 1
  fetchLoans()
}

const editLoan = (loan) => {
  editingLoan.value = loan
  loanForm.value = { ...loan }
  showNewLoanModal.value = true
}

const closeModal = () => {
  showNewLoanModal.value = false
  editingLoan.value = null
  loanForm.value = {
    member_id: null,
    role: '',
    loan_amount: null,
    total_installments: null,
    start_date: ''
  }
}

const saveLoan = async () => {
  try {
    if (editingLoan.value) {
      await axios.put(`/api/loans/${editingLoan.value.id}`, loanForm.value)
    } else {
      await axios.post('/api/loans', loanForm.value)
    }
    await fetchLoans()
    closeModal()
    $q.notify({
      color: 'positive',
      message: `Préstamo ${editingLoan.value ? 'actualizado' : 'creado'} exitosamente.`
    })
  } catch (error) {
    console.error('Error saving loan:', error)
    $q.notify({
      color: 'negative',
      message: 'Error al guardar el préstamo. Por favor, intente de nuevo.'
    })
  }
}

const deleteLoan = async (id) => {
  try {
    await $q.dialog({
      title: 'Confirmar eliminación',
      message: '¿Está seguro de que desea eliminar este préstamo?',
      cancel: true,
      persistent: true
    })
    await axios.delete(`/api/loans/${id}`)
    await fetchLoans()
    $q.notify({
      color: 'positive',
      message: 'Préstamo eliminado exitosamente.'
    })
  } catch (error) {
    if (error) {
      console.error('Error deleting loan:', error)
      $q.notify({
        color: 'negative',
        message: 'Error al eliminar el préstamo. Por favor, intente de nuevo.'
      })
    }
  }
}

const makePayment = (loan) => {
  editingLoan.value = loan
  paymentForm.value = {
    amount: loan.installment_amount,
    payment_date: new Date().toISOString().substr(0, 10)
  }
  showPaymentModal.value = true
}

const submitPayment = async () => {
  try {
    await axios.post(`/api/loans/${editingLoan.value.id}/payments`, paymentForm.value)
    await fetchLoans()
    showPaymentModal.value = false
    $q.notify({
      color: 'positive',
      message: 'Pago realizado exitosamente.'
    })
  } catch (error) {
    console.error('Error submitting payment:', error)
    $q.notify({
      color: 'negative',
      message: 'Error al realizar el pago. Por favor, intente de nuevo.'
    })
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

const formatTime = (date) => {
  return new Date(date).toLocaleTimeString('es-CO')
}

const getStatusColor = (status) => {
  const colors = {
    'Activo': 'blue',
    'Vencido': 'red'
  }
  return colors[status] || 'gray'
}

const getStatusTextColor = (status) => {
  return 'white'
}

const getStatusClass = (status) => {
  return ''
}

const getRoleColor = (role) => {
  const colors = {
    'Asistente': 'purple',
    'Cobrador': 'green',
    'Socio': 'blue'
  }
  return colors[role] || 'gray'
}

const getRoleTextColor = (role) => {
  return 'white'
}

const getRoleClass = (role) => {
  return ''
}

const getRoleIcon = (role) => {
  const icons = {
    'Asistente': 'support_agent',
    'Cobrador': 'payments',
    'Socio': 'person'
  }
  return icons[role]
}

// Lifecycle hooks
onMounted(() => {
  fetchLoans()
  fetchMembers()
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

