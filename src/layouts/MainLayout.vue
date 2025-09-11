<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="bg-white" reveal>
      <HeaderNav :drawer="drawer" @changeDrawer="drawer = !drawer" />
      <!-- Desktop navigation -->
      <SecondNavbar class="gt-sm" />
    </q-header>
    
    <q-page-container>
      <router-view />
    </q-page-container>
    
    <!-- Mobile Bottom Navigation -->
    <q-footer class="lt-md bg-white shadow-up-3" bordered>
      <MobileBottomNav />
    </q-footer>
  </q-layout>
</template>

<script setup>
import { ref } from "vue";
import SecondNavbar from "src/components/SecondNavbar.vue";
import HeaderNav from "src/components/HeaderNav.vue";
import MobileBottomNav from "src/components/MobileBottomNav.vue";

const drawer = ref(false);
</script>