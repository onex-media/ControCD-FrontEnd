<template>
  <q-page padding>
    <div class="q-pa-md">
      <div class="row items-center q-mb-md">
        <q-btn flat round icon="arrow_back" @click="goBack" />
        <div class="text-h6">Clientes</div>
      </div>
      <div class="text-subtitle1 q-ml-lg">{{ client.name }}</div>
      <div class="text-caption text-grey-7 q-ml-lg">{{ client.dni }}</div>

      <q-separator class="q-my-md" />

      <q-tabs
        v-model="activeTab"
        dense
        class="text-primary no-border"
        active-color="primary"
        indicator-color="primary"
        align="justify"
        narrow-indicator
      >
        <q-tab name="debtor" label="Info. Deudor" class="text-capitalize" />
        <q-tab name="guarantor" label="Info. Fiador" class="text-capitalize" />
         <q-tab name="credit" label="Créditos" class="text-capitalize" />
      </q-tabs>


      <q-tab-panels v-model="activeTab" animated class="no-border">
        <q-tab-panel name="debtor">
          <div class="row q-col-gutter-y-md">
            <div class="col-12 col-sm-6">
              <div class="text-bold text-grey-8">Nombre</div>
              <div>{{ client.name }}</div>
            </div>

            <div class="col-12 col-sm-6">
              <div class="text-bold text-grey-8">Cédula</div>
              <div>{{ client.dni }}</div>
            </div>

            <div class="col-12 col-sm-6">
              <div class="text-bold text-grey-8">Ciudad</div>
              <div>{{ client.seller?.city?.name || "N/A" }}</div>
            </div>

            <div class="col-12 col-sm-6">
              <div class="text-bold text-grey-8">Dirección de cobro</div>
              <div>{{ client.address }}</div>
            </div>

            <div class="col-12 col-sm-6">
              <div class="text-bold text-grey-8">Barrio</div>
              <div>{{ client.neighborhood || "N/A" }}</div>
            </div>

            <div class="col-12 col-sm-6">
              <div class="text-bold text-grey-8">Teléfono</div>
              <div>{{ client.phone }}</div>
            </div>

            <div class="col-12 col-sm-6">
              <div class="text-bold text-grey-8">Correo</div>
              <div>{{ client.email }}</div>
            </div>

            <div class="col-12 col-sm-6">
              <div class="text-bold text-grey-8">Empresa</div>
              <div>{{ client.company_name }}</div>
            </div>

            <div class="col-12">
              <div class="text-bold text-grey-8">Dirección de la empresa</div>
              <div>{{ client.company_address || "N/A" }}</div>
            </div>
          </div>
        </q-tab-panel>

        <q-tab-panel name="guarantor">
          <div class="row q-col-gutter-y-md">
            <div class="col-12 col-sm-6">
              <div class="text-bold text-grey-8">Nombre</div>
              <div>{{ guarantorInfo.name || "N/A" }}</div>
            </div>

            <div class="col-12 col-sm-6">
              <div class="text-bold text-grey-8">Cédula</div>
              <div>{{ guarantorInfo.dni || "N/A" }}</div>
            </div>

            <div class="col-12 col-sm-6">
              <div class="text-bold text-grey-8">Ciudad</div>
              <div>{{ guarantorInfo.city || "N/A" }}</div>
            </div>

            <div class="col-12 col-sm-6">
              <div class="text-bold text-grey-8">Dirección de cobro</div>
              <div>{{ guarantorInfo.address || "N/A" }}</div>
            </div>

            <div class="col-12 col-sm-6">
              <div class="text-bold text-grey-8">Barrio</div>
              <div>{{ guarantorInfo.neighborhood || "N/A" }}</div>
            </div>

            <div class="col-12 col-sm-6">
              <div class="text-bold text-grey-8">Teléfono</div>
              <div>{{ guarantorInfo.phone || "N/A" }}</div>
            </div>

            <div class="col-12 col-sm-6">
              <div class="text-bold text-grey-8">Correo</div>
              <div>{{ guarantorInfo.email || "N/A" }}</div>
            </div>

            <div class="col-12 col-sm-6">
              <div class="text-bold text-grey-8">Empresa</div>
              <div>{{ guarantorInfo.company || "N/A" }}</div>
            </div>

            <div class="col-12">
              <div class="text-bold text-grey-8">Dirección de la empresa</div>
              <div>{{ guarantorInfo.company_address || "N/A" }}</div>
            </div>
          </div>
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const activeTab = ref("debtor"); 

const client = ref({
  id: "cl-001",
  name: "Cliente Ejemplo",
  dni: "1234567890",
  address: "Calle Falsa 123",
  neighborhood: "Barrio Simulado",
  phone: "300-1234567",
  email: "cliente@ejemplo.com",
  company_name: "Empresa Demo S.A.",
  company_address: "Av. Ficticia #45-67",
  seller: {
    city: {
      name: "Ciudad Inventada",
    },
  },
  guarantor_name: "Fiador Ejemplo",
  guarantor_dni: "0987654321",
  guarantor_city: "Ciudad Alterna",
  guarantor_address: "Calle Secundaria 456",
  guarantor_neighborhood: "Barrio Garantía",
  guarantor_phone: "310-9876543",
  guarantor_email: "fiador@ejemplo.com",
  guarantor_company: "Garantías Ltda.",
  guarantor_company_address: "Kr. Imaginaria #22-33",
});

const guarantorInfo = {
  name: client.value.guarantor_name,
  dni: client.value.guarantor_dni,
  city: client.value.guarantor_city,
  address: client.value.guarantor_address,
  neighborhood: client.value.guarantor_neighborhood,
  phone: client.value.guarantor_phone,
  email: client.value.guarantor_email,
  company: client.value.guarantor_company,
  company_address: client.value.guarantor_company_address,
};

const goBack = () => {
  router.go(-1);
};
</script>

<style scoped>
.text-bold {
  font-weight: 600;
}

.row > div {
  padding-bottom: 8px;
  border-bottom: 1px solid #e0e0e0;
  margin-bottom: 8px;
}

.q-tab-panel {
  padding: 24px 16px;
}

@media (max-width: 600px) {
  .col-sm-6 {
    flex: 0 0 100%;
    max-width: 100%;
  }
}
.no-border {
  border: none;
  box-shadow: none;
}

</style>
