<template>
  <section class="q-py-xl container-app users-details">
    <div class="flex items-center justify-between q-mb-md">
      <q-breadcrumbs class="breadcrumb">
        <template v-slot:separator>
          <q-icon size="1.5em" name="chevron_right" class="separator-icon" />
        </template>
        <q-breadcrumbs-el class="no-active" label="Miembros" to="/dashboard/members" />
        <q-breadcrumbs-el class="text-primary" :label="user?.name" />
      </q-breadcrumbs>
      <div class="flex q-gutter-x-sm">
        <q-btn unelevated no-caps label="Eliminar" class="delete-button" @click="confirmDeleteMember" />
        <q-btn unelevated no-caps label="Editar" class="edit-button" color="primary" @click="editUser" />
      </div>
    </div>
    <div class="flex member-information">
      <div class="box-name flex items-center q-gutter-x-md q-mb-md user-presentation" v-if="user">
        <q-avatar class="name-avatar" size="56px" color="blue">
          <span class="text-white">{{ userInitials }}</span>
        </q-avatar>
        <div class="flex column">
          <div class="flex items-center member-information__column">
            <ToggleButtom v-model="user.status" @update:model-value="toggleUserActive" />
            <h1 class="name">{{ user?.name }}</h1>
            <span class="table-chip">
              {{
                user.role_name
              }}
              <figure>
                <GlassesIcon v-if="user.role_name === 'Asistente'" />
                <SocioIcon v-else />
              </figure>
            </span>
          </div>

          <div class="identification">
            {{ user?.dni }}
          </div>
        </div>
      </div>
      <div class="full-width">
        <!--Tab panel header-->
        <q-tabs v-if="user" no-caps v-model="tab" dense class="text-grey" indicator-color="primary" align="justify"
          narrow-indicator>
          <q-tab name="user" label="Información General" />
          <q-tab name="routes" label=" Rutas Asignadas" />
        </q-tabs>
        <!--End tab panel header-->

        <!--tab body-->
        <q-tab-panels v-model="tab" animated class="q-mt-md">
          <q-tab-panel name="user">
            <UserData v-if="user" :user="user" />
          </q-tab-panel>

          <q-tab-panel name="routes">
            <RoutesList v-if="user" />
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </div>

    <DialogConfirmation v-model="showDeleteModal" title="¡Atención! Eliminación de miembro" icon="warning"
      :description="`¿Está seguro de que desea eliminar al miembro ${user?.name}? Esta acción es irreversible y eliminará permanentemente toda la información asociada a este miembro.`"
      @confirm="deleteMemberHandler" type="danger" btnLabel="Eliminar" />

    <MemberFormModal v-if="showCreateModal" v-model:modelValue="showCreateModal" :isEditing="isEditing"
      :memberForm="memberForm" :departments="departments" :routesOptions="dataRoutes" :roles="rolesOptions"
      :cities="cities" @save-member="saveMember" @close-modal="closeModal" @load-data="loadDataAll"
      :saving-member="loading" />
  </section>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import UserData from "./components/UserData.vue";
import { departments } from "src/mocks/deparments";
import { useRoles } from "src/composables/useRoles";
import RoutesList from "./components/RoutesList.vue";
import { useRoutes } from "src/composables/useRoute";
import { useCities } from "src/composables/useCities";
import { useMembers } from "src/composables/useMembers";
import ToggleButtom from "src/components/ToggleButtom.vue";
import SocioIcon from "src/components/assets/SocioIcon.vue";
import MemberFormModal from "./components/MemberFormModal.vue";
import GlassesIcon from "src/components/assets/GlassesIcon.vue";
import DialogConfirmation from "src/components/DialogConfirmation.vue";

const tab = ref('user');
const route = useRoute();
const router = useRouter();
const loading = ref(false);
const { roles, getRolesData } = useRoles();
const isEditing = ref(false);
const { cities } = useCities();
const user = ref<any | null>(null);
const { dataRoutes, fetchRoutes } = useRoutes();
const {
  getUser,
  closeModal,
  showCreateModal,
  saveMember: saveMemberFunc,
  confirmDeleteMember: confirmDeleteMemberFunc,
  showDeleteModal,
  deleteMember,
  memberForm,
  editMember: editMemberFunc,
} = useMembers();

const rolesOptions = computed(() => roles.value.filter((el) => el.name === 'Asistente' || el.name === 'Socio' || el.name === 'Revisador'));


const editUser = () => {
  isEditing.value = !isEditing.value;
  showCreateModal.value = !showCreateModal.value;
  user.value.identification = user.value.dni;
  editMemberFunc(user.value);
};

const confirmDeleteMember = () => {
  confirmDeleteMemberFunc(user.value);
};

const loadData = async (userId: string) => {
  const response: any = await getUser(userId);
  user.value = response.data;
}

const saveMember = async () => {
  loading.value = true;
  try {
    await saveMemberFunc();
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const deleteMemberHandler = async () => {
  try {
    await deleteMember();
    router.go(-1);
  } catch (error) {
    console.error(error);
  }
}

const userInitials = computed(() => {
  if (!user.value?.name) return "";
  return user.value.name
    .split(" ")
    .map((n: any) => n[0])
    .join("")
    .toUpperCase();
});

const toggleUserActive = (value: boolean) => {
  if (user.value) {
    user.value.active = value;
    // Logic to handle user activation toggle
  }
};

const loadDataAll = async () => {
  Promise.all([getRolesData(), fetchRoutes()]);
}

onMounted(async () => {
  const userId: any = route.params.id;
  if (userId) {
    await loadData(userId);
  }
});
</script>
