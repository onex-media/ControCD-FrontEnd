<template>
    <div class="min-h-screen bg-gray-50">
      
  
      <!-- Main Content -->
      <main class="py-6">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center mb-6">
            <h1 class="text-2xl font-semibold">Rutas</h1>
            <div class="flex items-center gap-4">
              <div class="relative flex items-center">
                <q-btn flat round color="primary" class="absolute right-12">
                  <q-icon name="filter_list" />
                </q-btn>
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
              </div>
              <q-btn
                color="primary"
                icon-right="add"
                label="Nueva ruta"
                no-caps
                class="px-4"
              />
            </div>
          </div>
  
          <!-- Routes Table -->
          <div class="bg-white rounded-lg shadow">
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th scope="col" class="w-12 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <q-icon name="unfold_more" size="xs" class="cursor-pointer" />
                    </th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ruta
                      <q-icon name="unfold_more" size="xs" class="cursor-pointer" />
                    </th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Saldo actual
                      <q-icon name="unfold_more" size="xs" class="cursor-pointer" />
                    </th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Miembros
                      <q-icon name="unfold_more" size="xs" class="cursor-pointer" />
                    </th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Créditos
                    </th>
                    <th scope="col" class="relative px-6 py-3">
                      <span class="sr-only">Acciones</span>
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="route in routes" :key="route.id" :class="{ 'bg-blue-50': route.id % 2 === 0 }">
                    <td class="px-6 py-4">
                      <q-toggle v-model="route.active" color="primary" />
                    </td>
                    <td class="px-6 py-4">
                      <div class="text-sm font-medium text-gray-900">{{ route.name }}</div>
                      <div class="text-sm text-gray-500">{{ route.sector }}</div>
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-900">
                      {{ route.balance }}
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-900">
                      {{ route.members }}
                    </td>
                    <td class="px-6 py-4">
                      <div class="flex space-x-2">
                        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {{ route.credits.blue }}
                        </span>
                        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                          {{ route.credits.gray }}
                        </span>
                        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                          {{ route.credits.red }}
                        </span>
                        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {{ route.credits.green }}
                        </span>
                      </div>
                    </td>
                    <td class="px-6 py-4 text-right text-sm font-medium">
                      <div class="flex justify-end items-center space-x-2">
                        <q-btn flat round size="sm" color="primary" icon="sync" />
                        <q-btn flat round size="sm" icon="more_vert" />
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
        </div>
      </main>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  const search = ref('')
  
  const routes = ref([
    {
      id: 1,
      active: true,
      name: 'Nombre completo de la ruta',
      sector: 'Nombre del sector',
      balance: '$ 000.000,00',
      members: '123456',
      credits: {
        blue: '000,000',
        gray: '000,000',
        red: '000,000',
        green: '000,000'
      }
    },
    // Repeat similar objects for other rows...
  ])
  </script>
  
  <style scoped>
  .q-table th {
    font-weight: 600;
  }
  </style>