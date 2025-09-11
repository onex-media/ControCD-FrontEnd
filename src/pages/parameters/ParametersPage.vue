<template>
  <q-page class="q-pa-md">
    <div class="row q-col-gutter-md">
      <div class="col-12">
        <div class="text-h6 q-mb-md">Parámetros Generales</div>
        
        <div class="row q-col-gutter-md">
          <div class="col-12 col-sm-6 col-md-4">
            <q-card class="full-height " style="border-radius: 0" bordered>
              <q-card-section class="bg-primary text-white">
                <div class="text-h6">Parametrización de países</div>
                <div class="text-subtitle2">Configuración de países</div>
              </q-card-section>

              <q-card-section class="column items-center q-gutter-y-sm">
                <q-icon name="location_city" size="lg" color="primary"/>
                <q-btn 
                  label="Administrar" 
                  color="primary"
                  to="/dashboard/parametros-generales/ciudades"
                  flat
                />
              </q-card-section>
            </q-card>
          </div>

          <div class="col-12 col-sm-6 col-md-4">
            <q-card class="full-height" style="border-radius: 0" bordered disabled>
              <q-card-section class="bg-primary text-white">
                <div class="text-h6">Parámetrización</div>
                <div class="text-subtitle2">Configuración adicional</div>
              </q-card-section>

              <q-card-section class="column items-center q-gutter-y-sm">
                <q-icon name="settings" size="lg" color="primary"/>
                <q-btn
                  label="Configurar"
                  color="primary"
                  to=""
                  flat
                />
              </q-card-section>
            </q-card>
          </div>

          <div class="col-12 col-sm-6 col-md-4">
            <q-card class="full-height" style="border-radius: 0" bordered disabled>
              <q-card-section class="bg-primary text-white">
                <div class="text-h6">Parametrización</div>
                <div class="text-subtitle2">Configuración adicional</div>
              </q-card-section>

              <q-card-section class="column items-center q-gutter-y-sm">
                <q-icon name="public" size="lg" color="primary"/>
                <q-btn
                  label="Gestionar"
                  color="primary"
                  to=""
                  flat
                />
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>

      <div class="col-12 q-mt-lg">
        <router-view />
      </div>
    </div>
  </q-page>
</template>

<style scoped>
.q-card {
  transition: transform 0.3s;
  border-radius: 8px;
}
.q-card:hover {
  transform: translateY(-5px);
}
.full-height {
  height: 100%;
}
</style>