<template>
  <section class="min-h-screen q-py-xl container-app">
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
        <q-btn unelevated no-caps label="Editar" color="primary" @click="editUser" />
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
      <div class="q-pa-md">
        <div class="row q-col-gutter-lg">
          <div class="col-12 col-sm-6 col-md-4">
            <div class="flex q-gutter-x-sm text-subtitle1">
              <q-avatar size="60px" square color="grey-4" icon="person" />
              <div>
                <p class="no-margin text-h6">{{ user?.name }}</p>
                <p class="text-caption text-grey-8">{{ user?.name }}</p>
              </div>
            </div>
          </div>
          <div class="col-12 col-sm-6 col-md-4">
            <div class="flex q-gutter-x-sm text-subtitle1">
              <q-avatar size="60px" square color="grey-4" icon="badge" />
              <div>
                <p class="no-margin text-h6">Cédula</p>
                <p class="text-caption text-grey-8">{{ user?.dni }}</p>
              </div>
            </div>
          </div>
          <div class="col-12 col-sm-6 col-md-4">
            <div class="flex q-gutter-x-sm text-subtitle1">
              <q-avatar size="60px" square color="grey-4" icon="location_city" />
              <div>
                <p class="no-margin text-h6">Ciudad</p>
                <p class="text-caption text-grey-8" v-if="user?.city_id">
                  {{ user?.city.name }}
                </p>
              </div>
            </div>
          </div>
          <div class="col-12 col-sm-6 col-md-4">
            <div class="flex q-gutter-x-sm text-subtitle1">
              <q-avatar size="60px" square color="grey-4" icon="home" />
              <div>
                <p class="no-margin text-h6">Dirección</p>
                <p class="text-caption text-grey-8">{{ user?.address }}</p>
              </div>
            </div>
          </div>
          <div class="col-12 col-sm-6 col-md-4">
            <div class="flex q-gutter-x-sm text-subtitle1">
              <q-avatar size="60px" square color="grey-4" icon="phone" />
              <div>
                <p class="no-margin text-h6">Teléfono</p>
                <p class="text-caption text-grey-8">{{ user?.phone }}</p>
              </div>
            </div>
          </div>
          <div class="col-12 col-sm-6 col-md-4">
            <div class="flex q-gutter-x-sm text-subtitle1">
              <q-avatar size="60px" square color="grey-4" icon="email" />
              <div>
                <p class="no-margin text-h6">Correo</p>
                <p class="text-caption text-grey-8">{{ user?.email }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <DialogConfirmation v-model="showDeleteModal" title="¡Atención! Eliminación de miembro" icon="warning"
      :description="`¿Está seguro de que desea eliminar al miembro ${user?.name}? Esta acción es irreversible y eliminará permanentemente toda la información asociada a este miembro.`"
      @confirm="deleteMemberHandler" type="danger" btnLabel="Eliminar" />
  </section>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useRoles } from "src/composables/useRoles";
import { useMembers } from "src/composables/useMembers";
import ToggleButtom from "src/components/ToggleButtom.vue";
import SocioIcon from "src/components/assets/SocioIcon.vue";
import GlassesIcon from "src/components/assets/GlassesIcon.vue";
import DialogConfirmation from "src/components/DialogConfirmation.vue";

const route = useRoute();
const router = useRouter();
const { roles } = useRoles();
const { getUser, confirmDeleteMember: confirmDeleteMemberFunc, showDeleteModal, deleteMember } = useMembers();
const user = ref<any | null>(null);

const editUser = () => {
  if (user.value) {
    router.push({ name: "EditUser", params: { id: user.value.id } });
  }
};

const confirmDeleteMember = () => {
  confirmDeleteMemberFunc(user.value);
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

onMounted(async () => {
  const userId: any = route.params.id;
  if (userId) {
    const response: any = await getUser(userId);
    user.value = response.data;
  }
});
</script>
