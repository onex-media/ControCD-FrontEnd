<template>
  <div class="px-4 mx-auto max-w-full">
    <div class="flex justify-between h-16">
      <div class="flex">
        <div class="flex items-center flex-shrink-0">
          <img src="/images/logo.svg" alt="Controll CD" class="h-8 w-auto" />
        </div>
      </div>

      <div class="flex items-center">
        <q-btn flat round class="menubar">
          <img src="/icons/Settings Icon.svg" alt="" />
        </q-btn>

        <q-btn flat round class="menubar">
          <img src="/icons/User Icon.svg" alt="" />
          <q-menu class="w-40 q-mt-md">
            <q-list>
         <!--      <q-item clickable v-close-popup to="/dashboard">
                <q-item-section>Perfil</q-item-section>
              </q-item> -->
              <q-separator />
              <q-item clickable v-close-popup @click="logout">
                <q-item-section>Cerrar sesión</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>

        <q-btn
          v-if="$q.screen.width < 600"
          flat
          color="primary"
          @click="$emit('changeDrawer')"
        >
          <q-icon name="menu" />
        </q-btn>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from "src/composables/useAuth";
import { useQuasar } from "quasar";

const { logout } = useAuth();
const $q = useQuasar();
defineProps(["drawer"]);
defineEmits(["changeDrawer"]);
</script>

<style scoped></style>
