<template>
  <div class="min-h-screen">
    <main class="py-6">
      <div class="mx-auto max-w-10xl px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-2xl font-semibold">Informes ventas y utilidades</h1>
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
              icon-right="file_download"
              label="Generar informe"
              no-caps
              class="px-4"
            />
          </div>
        </div>
        <!-- Content placeholder -->
        <div class="bg-white p-6 rounded-lg shadow">
          <p class="text-gray-500">Contenido de la página de Informes ventas y utilidades</p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const search = ref('')
</script>

