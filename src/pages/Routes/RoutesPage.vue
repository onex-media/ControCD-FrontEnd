<template>
  <section class="min-h-screen q-py-xl container-app">
    <div class="q-mx-auto">
      <RouteFormModal v-model:modelValue="showCreateModal" :isEditing="isEditing" :routeForm="routeForm"
        :membersOptions="membersOptions" @save-route="saveRoute" @close-modal="closeModal" />

      <DialogConfirmation v-model="showDeleteModal" title="¡Atención! Eliminación de ruta" icon="warning" :description="`¿Está seguro de que desea eliminar la ruta ${selectedRoute?.name}? Esta acción es irreversible y eliminará permanentemente toda
                    la información asociada a esta ruta, incluyendo, Clientes,
                    Miembros y toda la información asociada.`" @confirm="deleteRoute" />

      <ToggleRouteDialog v-model="showToggleModal" :selectedRoute="selectedRoute" @cancel-toggle="cancelToggle"
        @confirm-toggle="confirmToggle" />

      <div>
        <div class="flex justify-between items-center q-mb-md">
          <div class="flex items-center gap-2">
            <h1 class="text-2xl font-semibold">Rutas</h1>
          </div>
          <div class="flex gap-4">
            <div>
              <q-input outlined dense v-model="search" placeholder="Buscar" bg-color="white" debounce="500">
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
            </div>
            <q-btn unelevated color="primary" label="Nueva Ruta" no-caps @click="showCreateModal = true">
              <img src="/icons/plus-square.svg" class="ml-4 svg-white" alt="" />
            </q-btn>
          </div>
        </div>
        <TabletRoutes v-if="dataRoutes" :data="dataRoutes" :paginationRoutes="paginationRoutes"
          @show-create-modal="showCreateModal = true" @edit-row="editRoute" @toggle-route="toggleRoute"
          @confirm-delete-row="confirmDeleteRoute" />
      </div>
    </div>
  </section>
  <section></section>
</template>

<script setup>
import { onMounted } from "vue";
import { useQuasar } from "quasar";
import { useRoutes } from "src/composables/useRoute";
import { useMembers } from "src/composables/useMembers";
import TabletRoutes from "./components/TabletRoutes.vue";
import RouteFormModal from "./components/RouteFormModal.vue";

import DialogConfirmation from "src/components/DialogConfirmation.vue";
import ToggleRouteDialog from "src/components/ToggleRouteDialog.vue";

const $q = useQuasar();

const {
  search,
  showCreateModal,
  showDeleteModal,
  showToggleModal,
  paginationRoutes,
  dataRoutes,
  selectedRoute,
  isEditing,
  routeForm,
  closeModal,
  confirmToggle,
  toggleRoute,
  editRoute,
  saveRoute,
  confirmDeleteRoute,
  deleteRoute,
  fetchRoutes,
  cancelToggle,
  clearForm,
} = useRoutes();

const { getMembersSelect, membersOptions } = useMembers();

onMounted(() => {
  fetchRoutes();
  getMembersSelect();
});
</script>

<style scoped></style>
