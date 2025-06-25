<template>
  <div class="mobile-nav-container">
    <div class="mobile-nav">
      <q-btn flat square no-caps class="nav-item" :to="{ name: 'dashboard' }" exact>
        <q-icon name="home" size="24px" :color="route.name === 'dashboard' ? 'primary' : 'grey-7'" />
      </q-btn>

      <q-btn flat square no-caps class="nav-item" to="/dashboard/clients">
        <q-icon name="people" size="24px" :color="isActive('/dashboard/clients') ? 'primary' : 'grey-7'" />
      </q-btn>

      <q-btn flat square no-caps class="nav-item" to="/dashboard/creditos">
        <q-icon name="credit_card" size="24px" :color="isActive('/dashboard/creditos') ? 'primary' : 'grey-7'" />
      </q-btn>

      <q-btn flat square no-caps class="nav-item" to="/liquidaciones">
        <q-icon name="payments" size="24px" :color="isActive('/liquidaciones') ? 'primary' : 'grey-7'" />
      </q-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";

const route = useRoute();

const isActive = (path: string) => {
  return route.path.startsWith(path);
};
</script>

<style lang="scss" scoped>
.mobile-nav-container {
  height: 56px;
}

.mobile-nav {
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 100%;
  padding: 0 8px;
  background: white;

  .nav-item {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    min-width: 0;
    padding: 0;
    transition: all 0.3s ease;

    .q-icon {
      transition: color 0.3s ease;
    }

    &:active {
      background-color: rgba(25, 118, 210, 0.1);
    }
  }
}
</style>
