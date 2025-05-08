<template>
  <q-layout class="" view="lHh Lpr lFf">
    <q-header class="bg-white" reveal>
      <HeaderNav :drawer="drawer" @changeDrawer="drawer = !drawer" />
      <SecondNavbar />
    </q-header>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from "vue";
import SecondNavbar from "src/components/SecondNavbar.vue";
import HeaderNav from "src/components/HeaderNav.vue";

const drawer = ref(false);
</script>
