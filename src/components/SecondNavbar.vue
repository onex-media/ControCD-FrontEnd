<template>
  <nav class="bg-white text-black border-nav">
    <div class="mx-auto max-w-full">
      <div class="flex justify-between h-16">
        <div class="w-full flex justify-between">
          <q-btn-dropdown
            flat
            square
            no-caps
            label="Generales"
            dropdown-icon="keyboard_arrow_down"
            class="h-full bg-blue-600 text-white"
          >
            <q-list>
              <q-item clickable v-close-popup to="/dashboard/routes">
                <q-item-section>Rutas</q-item-section>
              </q-item>
              <q-item clickable v-close-popup to="/dashboard/members">
                <q-item-section>Miembros</q-item-section>
              </q-item>
              <q-item clickable v-close-popup to="/dashboard/clients">
                <q-item-section>Clientes</q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
          <q-btn
            flat
            square
            no-caps
            label="Créditos"
            class="h-full"
            to="/dashboard/creditos"
          />
          <q-btn
            flat
            square
            no-caps
            label="Liquidaciones"
            class="h-full"
            to="/liquidaciones"
          />
          <q-btn-dropdown
            flat
            square
            no-caps
            dropdown-icon="keyboard_arrow_down"
            label="Administración"
            class="h-full"
          >
            <q-list>
              <q-item clickable v-close-popup to="/banks-cash-flow">
                <q-item-section>Bancos y flujo de caja</q-item-section>
              </q-item>
              <q-item clickable v-close-popup to="/expenses">
                <q-item-section>Gastos</q-item-section>
              </q-item>
              <q-item clickable v-close-popup to="/payroll">
                <q-item-section>Nóminas</q-item-section>
              </q-item>
              <q-item clickable v-close-popup to="/schedule">
                <q-item-section>Agenda</q-item-section>
              </q-item>
              <q-item clickable v-close-popup to="/collection-management">
                <q-item-section>Gestión de cobro</q-item-section>
              </q-item>
              <q-item clickable v-close-popup to="/loans">
                <q-item-section>Préstamos</q-item-section>
              </q-item>
              <q-item clickable v-close-popup to="/savings">
                <q-item-section>Ahorros</q-item-section>
              </q-item>
              <q-item clickable v-close-popup to="/fixed-assets">
                <q-item-section>Activos fijos</q-item-section>
              </q-item>
              <q-item clickable v-close-popup to="/debts">
                <q-item-section>Deudas</q-item-section>
              </q-item>
              <q-item clickable v-close-popup to="/income">
                <q-item-section>Ingresos</q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
          <q-btn-dropdown
            flat
            square
            no-caps
            dropdown-icon="keyboard_arrow_down"
            label="Información"
            class="h-full"
          >
            <q-list>
              <q-item clickable v-close-popup to="/closings">
                <q-item-section>Cierres</q-item-section>
              </q-item>
              <q-item clickable v-close-popup to="/route-record">
                <q-item-section>Registro recorrido</q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
          <q-btn-dropdown
            flat
            square
            no-caps
            dropdown-icon="keyboard_arrow_down"
            label="Reportes"
            class="h-full"
          >
            <q-list>
              <q-item clickable v-close-popup to="/report-center">
                <q-item-section>Centro de reportes</q-item-section>
              </q-item>
              <q-item
                clickable
                v-close-popup
                to="/client-collection-management"
              >
                <q-item-section>Gestión clientes cobros</q-item-section>
              </q-item>
              <q-item clickable v-close-popup to="/sales-and-profits-report">
                <q-item-section>Informes ventas y utilidades</q-item-section>
              </q-item>
              <q-item clickable v-close-popup to="/collections-and-movements">
                <q-item-section>Recaudos y movimientos</q-item-section>
              </q-item>
              <q-item clickable v-close-popup to="/expenses-and-administration">
                <q-item-section>Gastos y administración</q-item-section>
              </q-item>
              <q-item clickable v-close-popup to="/schedules-and-programming">
                <q-item-section>Agendas y programación</q-item-section>
              </q-item>
              <q-item clickable v-close-popup to="/general-data">
                <q-item-section>Datos Generales</q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
          <q-btn-dropdown
            flat
            square
            no-caps
            dropdown-icon="keyboard_arrow_down"
            label="Parámetros"
            class="h-full"
          >
            <q-list>
              <q-item clickable v-close-popup to="/parameters">
                <q-item-section>Parámetros generales</q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
.border-nav {
  border-top: 2px solid #e0e0e0;
  border-bottom: 2px solid #e0e0e0;
}
</style>
