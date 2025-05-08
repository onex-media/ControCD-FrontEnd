<template>
  <section class="min-h-screen q-py-xl container-app">
    <div class="flex items-center justify-between q-mb-md">
      <q-breadcrumbs class="text-h6 text-grey-8" separator=">">
        <q-breadcrumbs-el
          class="text-grey-8"
          label="Miembros"
          to="/dashboard/members"
        />
        <q-breadcrumbs-el class="text-primary" :label="user?.name" />
      </q-breadcrumbs>
      <div class="flex q-gutter-x-sm">
        <q-btn
          unelevated
          no-caps
          label="Eliminar"
          color="red-7"
          @click="deleteUser"
        />
        <q-btn
          unelevated
          no-caps
          label="Editar"
          color="primary"
          @click="editUser"
        />
      </div>
    </div>
    <div class="box-name flex items-center q-gutter-x-md q-mb-md" v-if="user">
      <q-avatar square size="56px" color="blue">
        <span class="text-white">{{ userInitials }}</span>
      </q-avatar>
      <div class="flex column">
        <div class="flex items-center">
          <q-toggle
            :model-value="user?.active"
            color="primary"
            @update:model-value="toggleUserActive"
          />
          <div class="text-h6">{{ user?.name }}</div>
          <q-chip
            color="grey-4"
            text-color="grey-8"
            size="sm"
            v-if="user?.parent_id"
          >
            <span class="text-capitalize">
              {{ getRoleLabel(user?.parent_id) }}
            </span>
          </q-chip>
        </div>

        <div class="text-sm text-gray-500">
          <span class="text-caption">Ident:</span> {{ user?.dni }}
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
  </section>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useMembers } from "src/composables/useMembers";
import { useRoles } from "src/composables/useRoles";

const route = useRoute();
const router = useRouter();
const { getUser } = useMembers();
const { roles, getRolesData } = useRoles();
const user = ref<any | null>(null);

const editUser = () => {
  if (user.value) {
    router.push({ name: "EditUser", params: { id: user.value.id } });
  }
};

const deleteUser = async () => {
  // if (user.value) {
  //   await deleteUserById(user.value.id);
  //   router.push({ name: "Members" });
  // }
};

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

const getRoleLabel = (parent_id: number | null) => {
  console.log("parent_id: ", parent_id);
  console.log("roles.value: ", roles.value);
  const role = roles.value.find((role) => role.id === parent_id);
  return role ? role.name : "Desconocido";
};

onMounted(async () => {
  await getRolesData();
  const userId: any = route.params.id;
  if (userId) {
    const response: any = await getUser(userId);
    user.value = response.data;
    console.log("user.value: ", user.value);
  }
});
</script>
