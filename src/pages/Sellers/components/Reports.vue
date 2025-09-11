<template>
  <div class="reportes-container q-pa-md">
    <div class="header-section">
      <div class="text-h4 q-mb-sm text-grey-9 ">Centro de reportes</div>
      <p class="text-subtitle1 text-grey-7 q-mb-xl">
        Accede a tus informes detallados sobre cobros, ventas, utilidades y
        movimientos de caja.<br />
        Monitorea el estado financiero y gestiona proyecciones de cartera,
        gastos y nóminas.
      </p>
    </div>

    <div class="row q-col-gutter-xl q-pb-md">
      <div class="col-12 col-sm-6 col-md-4">
        <q-card class="report-card" flat>
          <q-card-section class="text-center">
            <div class="q-mb-md flex flex-center">
              <img
                src="/icons/AddressBook.png"
                alt="Ícono de gestión"
                style="width: 88px; height: 88px"
                class="q-mb-sm"
              />
            </div>

            <div class="text-h6 text-grey-9 q-mb-sm">
              Gestión de clientes y cobros
            </div>

            <div class="text-caption text-grey-7 q-px-md">
              Consulta y gestiona los cobros, ventas vencidas y cartera no
              recuperable para un mejor control financiero con los clientes.
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-4">
        <q-card class="report-card" flat>
          <q-card-section class="text-center">
            <div class="q-mb-md flex flex-center">
              <img
                src="/icons/Scales.png"
                alt="Ícono de gestión"
                style="width: 88px; height: 88px"
                class="q-mb-sm"
              />
            </div>

            <div class="text-h6 text-grey-9 q-mb-sm">
              Informes de ventas y utilidades
            </div>

            <div class="text-caption text-grey-7 q-px-md">
              Accede a los reportes de utilidades, ganancias y proyecciones, y
              obtén una visión estratégica del rendimiento financiero.
            </div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-sm-6 col-md-4">
        <q-card class="report-card" flat>
          <q-card-section class="text-center">
            <div class="q-mb-md flex flex-center">
              <img
                src="/icons/ArrowsLeftRight.png"
                alt="Ícono de gestión"
                style="width: 88px; height: 88px"
                class="q-mb-sm"
              />
            </div>

            <div class="text-h6 text-grey-9 q-mb-sm">
              Recaudos y movimientos financieros
            </div>

            <div class="text-caption text-grey-7 q-px-md">
              Lleva el control diario de recaudos, movimientos de caja y
              cierres, asegurando una gestión precisa del efectivo.
            </div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-sm-6 col-md-4">
        <q-card class="report-card" flat>
          <q-card-section class="text-center">
            <div class="q-mb-md flex flex-center">
              <img
                src="/icons/ChartPieSlice.png"
                alt="Ícono de gestión"
                style="width: 88px; height: 88px"
                class="q-mb-sm"
              />
            </div>

            <div class="text-h6 text-grey-9 q-mb-sm">
              Gastos y administración
            </div>

            <div class="text-caption text-grey-7 q-px-md">
              Visualiza los gastos operativos y administrativos, así como el
              estado de la nómina, para optimizar el uso de recursos.
            </div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-sm-6 col-md-4">
        <q-card class="report-card" flat>
          <q-card-section class="text-center">
            <div class="q-mb-md flex flex-center">
              <img
                src="/icons/CalendarBlank.png"
                alt="Ícono de gestión"
                style="width: 88px; height: 88px"
                class="q-mb-sm"
              />
            </div>

            <div class="text-h6 text-grey-9 q-mb-sm">
              Agendas y programación
            </div>

            <div class="text-caption text-grey-7 q-px-md">
              Organiza tus agendas y actividades para asegurar una planificación
              y ejecución eficaz de las tareas.
            </div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-sm-6 col-md-4">
        <q-card class="report-card" flat>
          <q-card-section class="text-center">
            <div class="q-mb-md flex flex-center">
              <img
                src="/icons/database.png"
                alt="Ícono de gestión"
                style="width: 88px; height: 88px"
                class="q-mb-sm"
              />
            </div>

            <div class="text-h6 text-grey-9 q-mb-sm">
              Resumen de datos generales
            </div>

            <div class="text-caption text-grey-7 q-px-md">
              Encuentra la información general y los pagos de facturas, con una
              vista integral de la operación de tu negocio.
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.reportes-container {
  max-width: 100%;
  margin: 0 auto;
}
.header-section {
  text-align: center;
  margin-bottom: 40px;
}

.report-card {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  transition: all 0.2s ease;
  height: 100%;
  min-height: 150px;
}

.report-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.report-card .q-icon {
  background-color: rgba(0, 0, 0, 0.05);
  padding: 8px;
  border-radius: 8px;
}
</style>
