<template>
  <div class="min-h-screen bg-gray-50">
    <main class="py-6">
      <div class="mx-auto max-w-10xl px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-2xl font-semibold">Agenda</h1>
          <div class="flex items-center gap-4">
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
              label="Nueva tarea"
              no-caps
              class="px-4"
              @click="showNewTaskModal = true"
            >
              <template v-slot:append>
                <q-icon name="add" class="ml-2" />
              </template>
            </q-btn>
          </div>
        </div>

        <!-- Calendar Section -->
        <div class="grid grid-cols-12 gap-6">
          <!-- Mini Calendar -->
          <div class="col-span-12 md:col-span-3 bg-white rounded-lg shadow p-4">
            <div class="flex justify-between items-center mb-4">
              <div class="flex items-center gap-2">
                <q-btn flat round dense icon="chevron_left" @click="previousMonth" />
                <h2 class="text-lg font-medium">{{ currentMonthYear }}</h2>
                <q-btn flat round dense icon="chevron_right" @click="nextMonth" />
              </div>
            </div>

            <!-- Mini Calendar Grid -->
            <div class="grid grid-cols-7 gap-1 text-center mb-2">
              <div v-for="day in weekDays" :key="day" class="text-xs text-gray-500 font-medium py-1">
                {{ day }}
              </div>
            </div>
            <div class="grid grid-cols-7 gap-1">
              <div
                v-for="date in calendarDates"
                :key="date.date"
                class="aspect-square flex items-center justify-center text-sm rounded-full cursor-pointer"
                :class="[
                  date.isCurrentMonth ? 'hover:bg-gray-100' : 'text-gray-400',
                  date.isToday ? 'bg-primary text-white' : '',
                  date.hasEvents ? 'font-bold' : ''
                ]"
                @click="selectDate(date)"
              >
                {{ date.dayNumber }}
              </div>
            </div>

            <!-- Tasks List -->
            <div class="mt-6">
              <h3 class="text-sm font-medium text-gray-900 mb-3">Todas mis tareas</h3>
              <div class="space-y-3">
                <div
                  v-for="task in tasks"
                  :key="task.id"
                  class="flex justify-between items-center text-sm"
                >
                  <div class="flex items-center gap-2">
                    <div class="w-2 h-2 rounded-full bg-primary"></div>
                    <span class="text-gray-900">{{ task.name }}</span>
                  </div>
                  <span class="text-gray-500">{{ task.time }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Calendar Grid -->
          <div class="col-span-12 md:col-span-9 bg-white rounded-lg shadow">
            <div class="p-6">
              <div class="grid grid-cols-7 gap-4">
                <div
                  v-for="(day, index) in weekDays"
                  :key="index"
                  class="text-center font-medium text-gray-500"
                >
                  {{ day }}
                </div>
              </div>
              <div class="grid grid-cols-7 gap-4 mt-4">
                <div
                  v-for="date in monthDates"
                  :key="date.date"
                  class="min-h-[120px] border rounded-lg p-2"
                  :class="[
                    date.isCurrentMonth ? 'bg-white' : 'bg-gray-50',
                    date.isToday ? 'border-primary' : 'border-gray-200'
                  ]"
                >
                  <div class="text-right text-sm mb-2" :class="date.isCurrentMonth ? 'text-gray-900' : 'text-gray-400'">
                    {{ date.dayNumber }}
                  </div>
                  <div class="space-y-1">
                    <div
                      v-for="task in date.tasks"
                      :key="task.id"
                      class="text-xs p-1 rounded bg-blue-50 text-blue-700"
                    >
                      {{ task.name }}
                      <div class="text-gray-500">{{ task.time }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- New Task Modal -->
    <q-dialog v-model="showNewTaskModal" persistent>
      <q-card class="w-[500px]">
        <q-card-section class="flex justify-between items-center">
          <h3 class="text-lg font-medium">Nueva tarea</h3>
          <q-btn flat round dense icon="close" @click="showNewTaskModal = false" />
        </q-card-section>

        <q-card-section>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">
                Nombre de la tarea <span class="text-red-500">*</span>
              </label>
              <q-input
                v-model="newTask.name"
                outlined
                dense
                class="mt-1"
                placeholder="Ingrese el nombre de la tarea"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">
                Descripción
              </label>
              <q-input
                v-model="newTask.description"
                outlined
                dense
                type="textarea"
                class="mt-1"
                placeholder="Ingrese una descripción"
              />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">
                  Fecha <span class="text-red-500">*</span>
                </label>
                <q-input
                  v-model="newTask.date"
                  outlined
                  dense
                  type="date"
                  class="mt-1"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">
                  Hora <span class="text-red-500">*</span>
                </label>
                <q-input
                  v-model="newTask.time"
                  outlined
                  dense
                  type="time"
                  class="mt-1"
                />
              </div>
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right" class="px-6 py-4 border-t">
          <q-btn
            flat
            no-caps
            label="Cancelar"
            color="gray"
            @click="showNewTaskModal = false"
          />
          <q-btn
            no-caps
            label="Crear"
            color="primary"
            @click="createTask"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { date } from 'quasar'

// State
const search = ref('')
const showNewTaskModal = ref(false)
const currentDate = ref(new Date())
const tasks = ref([
  { id: 1, name: 'Nombre tarea', time: '08:00' },
  { id: 2, name: 'Nombre tarea', time: '08:00' },
  { id: 3, name: 'Nombre tarea', time: '08:00' },
  { id: 4, name: 'Nombre tarea', time: '08:00' }
])

const newTask = ref({
  name: '',
  description: '',
  date: '',
  time: ''
})

// Calendar data
const weekDays = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom']

const currentMonthYear = computed(() => {
  return date.formatDate(currentDate.value, 'MMMM YYYY')
})

const calendarDates = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const dates = []

  // Previous month dates
  const firstDayOfWeek = firstDay.getDay() || 7
  for (let i = firstDayOfWeek - 1; i > 0; i--) {
    const prevDate = new Date(year, month, -i + 1)
    dates.push({
      date: prevDate,
      dayNumber: prevDate.getDate(),
      isCurrentMonth: false,
      isToday: false,
      hasEvents: false
    })
  }

  // Current month dates
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const currentDate = new Date(year, month, i)
    dates.push({
      date: currentDate,
      dayNumber: i,
      isCurrentMonth: true,
      isToday: date.isSameDate(currentDate, new Date(), 'day'),
      hasEvents: Math.random() > 0.8 // Random events for demo
    })
  }

  // Next month dates
  const remainingDays = 42 - dates.length
  for (let i = 1; i <= remainingDays; i++) {
    const nextDate = new Date(year, month + 1, i)
    dates.push({
      date: nextDate,
      dayNumber: i,
      isCurrentMonth: false,
      isToday: false,
      hasEvents: false
    })
  }

  return dates
})

const monthDates = computed(() => {
  return calendarDates.value.map(date => ({
    ...date,
    tasks: date.hasEvents ? [
      { id: Math.random(), name: 'Nombre tarea', time: '08:00', description: 'Descripción' }
    ] : []
  }))
})

// Methods
const previousMonth = () => {
  currentDate.value = date.subtractFromDate(currentDate.value, { months: 1 })
}

const nextMonth = () => {
  currentDate.value = date.addToDate(currentDate.value, { months: 1 })
}

const selectDate = (selectedDate) => {
  // Handle date selection
  console.log('Selected date:', selectedDate)
}

const createTask = () => {
  // Handle task creation
  console.log('New task:', newTask.value)
  showNewTaskModal.value = false
  newTask.value = {
    name: '',
    description: '',
    date: '',
    time: ''
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
</style>