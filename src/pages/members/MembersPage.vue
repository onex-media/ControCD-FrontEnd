<template>
  <section class="min-h-screen q-mt-xl container-app">
    <MemberFormModal v-if="showCreateModal" v-model:modelValue="showCreateModal" :isEditing="isEditing"
      :memberForm="memberForm" :departments="departments" :routesOptions="dataRoutes" :roles="roles" :cities="cities"
      @save-member="saveMember" @close-modal="closeModal" @load-data="loadData" />

    <DialogConfirmation v-model="showDeleteModal" title="¡Atención! Eliminación de miembro" icon="warning"
      :description="`¿Está seguro de que desea eliminar al miembro ${selectedMember?.name}? Esta acción es irreversible y eliminará permanentemente toda la información asociada a este miembro.`"
      @confirm="deleteMember" />

    <ToggleMemberDialog v-model="showToggleModal" :selectedMember="selectedMember" @cancel-toggle="cancelToggle"
      @confirm-toggle="confirmToggle" />

    <div>
      <div class="flex justify-between items-center q-mb-md">
        <div class="flex items-center gap-2">
          <h1 class="text-2xl font-semibold">Miembros</h1>
        </div>
        <div class="flex gap-4">
          <div>
            <q-input outlined dense v-model="search" placeholder="Buscar" bg-color="white" debounce="500">
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>
          <q-btn unelevated color="primary" label="Nuevo miembro" no-caps @click="showCreateModal = true">
            <img src="/icons/FolderSimpleStar.svg" class="ml-4 svg-white" alt="" />
          </q-btn>
        </div>
      </div>

      <TabletMembers class="q-mt-lg q-pt-lg" v-if="dataMembers" :dataMembers="dataMembers" :roles="roles"
        @edit-member="editMember" @confirm-delete-member="confirmDeleteMember" @toggle-member="toggleMember"
        @update-pagination="onRequest" :paginationMembers="paginationMembers" @search-members="fetchMembers" />
    </div>
  </section>
</template>

<script lang="ts" setup>
import { onMounted } from "vue";
import { useMembers } from "src/composables/useMembers";
import TabletMembers from "./components/TabletMembers.vue";
import MemberFormModal from "./components/MemberFormModal.vue";
import DialogConfirmation from "src/components/DialogConfirmation.vue";
import ToggleMemberDialog from "src/components/ToggleMemberDialog.vue";
import { departments } from "src/mocks/deparments";
import { useRoutes } from "src/composables/useRoute";
import { useCities } from "src/composables/useCities";
import { useRoles } from "src/composables/useRoles";

const {
  deleteMember: deleteMemberFunc,
  closeModal,
  memberForm,
  dataMembers,
  isEditing,
  showCreateModal,
  showDeleteModal,
  showToggleModal,
  selectedMember,
  paginationMembers,
  search,
  confirmToggle: confirmToggleFunc,
  saveMember: saveMemberFunc,
  fetchMembers: fetchMembersFunc,
  editMember: editMemberFunc,
  toggleMember: toggleMemberFunc,
  cancelToggle: cancelToggleFunc,
  confirmDeleteMember: confirmDeleteMemberFunc,
} = useMembers();

const { fetchRoutes, dataRoutes } = useRoutes();
const { getCitiesSelect, cities } = useCities();
const { getRolesData, roles } = useRoles();

const fetchMembers = async () => {
  await fetchMembersFunc();
};

const editMember = (member: any) => {
  editMemberFunc(member);
};

const confirmToggle = async () => {
  await confirmToggleFunc();
  showToggleModal.value = false;
};

const saveMember = async () => {
  await saveMemberFunc();
};

const confirmDeleteMember = (member: any) => {
  confirmDeleteMemberFunc(member);
};

const deleteMember = async () => {
  await deleteMemberFunc();
  await fetchMembers();
};

const toggleMember = async (member: any) => {
  console.log(member);
  toggleMemberFunc(member);
};

const cancelToggle = () => {
  cancelToggleFunc();
};

const onRequest = async () => {
  fetchMembers();
};

const loadData = async () => {
  Promise.all([getRolesData(), fetchRoutes(), getCitiesSelect()]);
}

onMounted(async () => {
  await fetchMembers();
});
</script>

<style lang="scss" scoped></style>
