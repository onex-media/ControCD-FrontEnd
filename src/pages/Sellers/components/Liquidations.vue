<template>
  <div class="q-pa-md">
    <div class="q-mb-lg full-width container-app q-pa-md">
      <div class="row no-wrap q-col-gutter-xs">
        <div v-for="option in periodOptions" :key="option.value" class="col">
          <q-btn
            flat
            no-caps
            :label="option.label"
            color="dark"
            class="text-weight-medium full-width"
            @click="currentPeriod = option.value"
          >
            <div
              class="underline-indicator"
              :class="{ active: currentPeriod === option.value }"
            />
          </q-btn>
        </div>
      </div>
    </div>

    <div
      v-if="currentPeriod === 'daily'"
      class="q-mb-md row justify-end q-pa-md"
    >
      <div class="col-12 col-sm-4 col-md-3">
        <q-input
          filled
          dense
          v-model="selectedDate"
          label="Seleccionar fecha"
          class="bg-white rounded-input shadow-2"
        >
          <template v-slot:prepend>
            <q-icon name="date_range" color="primary" />
          </template>

          <template v-slot:append>
            <q-icon name="event" color="primary" class="cursor-pointer">
              <q-popup-proxy
                cover
                transition-show="fade"
                transition-hide="fade"
              >
                <q-date v-model="selectedDate" minimal color="primary" />
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>
    </div>
    <div
      v-if="currentPeriod === 'weekly'"
      class="q-mb-md row justify-end q-pa-md q-col-gutter-md"
    >
      <div class="col-12 col-sm-4 col-md-3">
        <q-input
          filled
          dense
          v-model="selectedDate"
          label="Seleccionar fecha de inicio"
          class="bg-white rounded-input shadow-2"
        >
          <template v-slot:prepend>
            <q-icon name="date_range" color="primary" />
          </template>

          <template v-slot:append>
            <q-icon name="event" color="primary" class="cursor-pointer">
              <q-popup-proxy
                cover
                transition-show="fade"
                transition-hide="fade"
              >
                <q-date v-model="selectedDate" minimal color="primary" />
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>
      <div class="col-12 col-sm-4 col-md-3">
        <q-input
          filled
          dense
          v-model="selectedDate"
          label="Seleccionar fecha de cierre"
          class="bg-white rounded-input shadow-2"
        >
          <template v-slot:prepend>
            <q-icon name="date_range" color="primary" />
          </template>

          <template v-slot:append>
            <q-icon name="event" color="primary" class="cursor-pointer">
              <q-popup-proxy
                cover
                transition-show="fade"
                transition-hide="fade"
              >
                <q-date v-model="selectedDate" minimal color="primary" />
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>
    </div>

    <q-card v-if="currentPeriod !== 'list'" flat class="bg-white">
      <div class="row q-col-gutter-md q-pa-md">
        <div class="col-12 col-md-4">
          <VendorInfoCard
            name="Fabiana Martinez"
            location="Medellín, Colombia"
            lastClosure="03/02/2024 14:30"
            customClass="blue"
            height="190px"
          />
        </div>

        <div class="col-12 col-md-4">
          <SectionItem
            title="Caja Inicial"
            value="0.00"
            custom-class="green-card"
            height="190px"
            icon="inventory"
            color="secondary"
          />
        </div>

        <div class="col-12 col-md-4">
          <SectionItem
            title="Caja Final"
            value="2200.00"
            custom-class="blue-card"
            height="190px"
            icon="point_of_sale"
            color="primary"
          />
        </div>

        <div class="col-12 col-md-4">
          <SectionItem
            title="Recaudo Por tipo de Pago"
            value="Efectivo: (234.60) Transferencia: (20.00)"
            custom-class="green-card"
            color="secondary"
            height="213px"
            icon="payments"
          >
            <template #additional-content>
              <div class="row q-col-gutter-xs">
                <div class="col-12 col-sm-6">
                  <div class="text-caption">Recaudo Pretendido del Dia:</div>
                  <div class="text-subtitle2">300.00</div>
                </div>
                <div class="col-12 col-sm-6">
                  <div class="text-caption">Recaudo Actual del Dia:</div>
                  <div class="text-subtitle2">300.00</div>
                </div>
              </div>
            </template>
          </SectionItem>
        </div>

        <div class="col-12 col-md-4">
          <SectionItem
            title="Ventas"
            value="100.00 ( Interés 10.00 )"
            custom-class="card-white"
            height="213px"
            icon="point_of_sale"
          />
        </div>

        <div class="col-12 col-md-4">
          <div class="row q-col-gutter-md">
            <div class="col-12">
              <SectionItem
                title="Cartera Inicial"
                value="0.00"
                custom-class="card-white"
                icon="account_balance_wallet"
                height="50px"
              />
            </div>
            <div class="col-12">
              <SectionItem
                title="Cartera Final"
                value="600.45"
                custom-class="grey-card"
                icon="account_balance"
                height="50px"
              />
            </div>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <SectionItem
            title="Gastos"
            value="0.00"
            custom-class="card-white"
            icon="trending_down"
          />
        </div>

        <div class="col-12 col-md-4">
          <SectionItem
            title="Ingresos"
            value="0.00"
            custom-class="card-white"
            icon="trending_up"
          />
        </div>

        <div class="col-12 col-md-4">
          <SectionItem
            title="Retiros"
            value="100.00"
            custom-class="card-white"
            icon="logout"
          />
        </div>

        <div class="col-12 col-md-4">
          <SectionItem
            title="Base Entregada"
            value="0.00"
            custom-class="card-white"
            height="110px"
            icon="assignment_returned"
          />
        </div>

        <div class="col-12 col-md-4">
          <SectionItem custom-class="card-white" height="110px">
            <template #additional-content>
              <div class="row q-col-gutter-xs">
                <div
                  v-for="(stat, index) in clientStatsFirst"
                  :key="index"
                  class="col-12 col-sm-12 col-md-12 flex justify-between items-center"
                >
                  <div class="text-caption text-blue-grey-7 flex items-center">
                    <q-icon
                      :name="stat.icon"
                      size="20px"
                      color="black"
                      class="mr-2"
                    />
                    {{ stat.label }}:
                  </div>
                  <div class="text-subtitle2">{{ stat.value }}</div>
                </div>
              </div>
            </template>
          </SectionItem>
        </div>
        <div class="col-12 col-md-4">
          <SectionItem custom-class="card-white" height="110px">
            <template #additional-content>
              <div class="row q-col-gutter-xs">
                <div
                  v-for="(stat, index) in clientStatsSecond"
                  :key="index"
                  class="col-12 col-sm-12 col-md-12 flex justify-between items-center"
                >
                  <div class="text-caption text-blue-grey-7 flex items-center">
                    <q-icon
                      :name="stat.icon"
                      size="20px"
                      color="black"
                      class="mr-2"
                    />
                    {{ stat.label }}:
                  </div>
                  <div class="text-subtitle2">{{ stat.value }}</div>
                </div>
              </div>
            </template>
          </SectionItem>
        </div>

        <div class="col-12 col-md-4">
          <SectionItem
            title="Caja de seguro"
            value="0.00"
            custom-class="green-card"
            color="secondary"
            icon="security"
          />
        </div>
        <div class="col-12 col-md-4">
          <SectionItem
            title="Ingreso de seguro"
            value="0.00"
            custom-class="green-card"
            color="secondary"
            icon="verified_user"
          />
        </div>
        <div class="col-12 col-md-4">
          <SectionItem
            title="Retiros de seguro"
            value="0.00"
            custom-class="green-card"
            color="secondary"
            icon="savings"
          />
        </div>
      </div>
    </q-card>
    <div v-else class="q-mt-lg">
      <SettlementList />
    </div>
    <div
      v-if="currentPeriod === 'weekly'"
      class="col-12 col-sm-auto flex justify-end q-pa-sm"
    >
      <q-btn
        label="Generar liquidación"
        icon="description"
        color="primary"
        class="generate-btn q-py-md"
        @click="settlementModalVisible = true"
      />
    </div>

    <SettlementModal
      :vendor="vendor"
      :visible="settlementModalVisible"
      @update:visible="settlementModalVisible = $event"
      @close="handleModalClose"
      @generate="generateSettlement"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import SectionItem from "./SectionItem.vue";
import VendorInfoCard from "./VendorInfoCard.vue";
import SettlementModal from "./SettlementModal.vue";
import SettlementList from "./SettlementList.vue";

const props = defineProps<{
  vendor: any;
}>();

const selectedDate = ref(new Date().toISOString().substr(0, 10));
const currentPeriod = ref<"daily" | "weekly" | "list">("daily");
const settlementModalVisible = ref(false);

const periodOptions = [
  { label: "Diarias", value: "daily" },
  { label: "Por Período ", value: "weekly" },
  { label: "Liquidaciones", value: "list" },
];

const clientStatsFirst = reactive([
  { label: "Clientes iniciales", value: "18", icon: "group" },
  {
    label: "Clientes Nuevos/Renovados",
    value: "18 (9 nvo / 9 reno)",
    icon: "person_add",
  },
  { label: "Clientes no Renovados", value: "0", icon: "person_remove" },
]);

const clientStatsSecond = reactive([
  { label: "Pagos aplazados siguiente día", value: "18", icon: "payments" },
  { label: "Clientes Cancelados", value: "13", icon: "cancel" },
  { label: "Total de clientes", value: "0", icon: "group" },
]);
const generateSettlement = () => {
  settlementModalVisible.value = false;
};
const handleModalClose = () => {
  console.log("Modal cerrado");
  settlementModalVisible.value = false;
};
</script>

<style scoped>
.container-app {
  max-width: 100%;
}

.rounded-input {
  border-radius: 8px;
}

.shadow-2 {
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
}

.underline-indicator {
  position: absolute;
  bottom: -2px;
  left: 0;
  right: 0;
  height: 3px;
  background: transparent;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.underline-indicator.active {
  background: #2b69e8;
  height: 4px;
}

/* Card Styles */
.grey-card {
  background: #f5f5f5;
}

.blue-card {
  background: #ebeeff;
  color: white;
}

.blue-card .text-blue-grey-7,
.blue-card .text-blue-grey-8 {
  color: rgba(255, 255, 255, 0.8) !important;
}

.green-card {
  background: #d8ffdc;
}

.card-white {
  border: 1px solid #e0e0e0;
}

.text-subtitle2 {
  word-break: break-word;
}

@media (max-width: 600px) {
  .q-pa-md {
    padding: 8px;
  }

  .q-col-gutter-md {
    margin-left: -4px;
    margin-right: -4px;
  }

  .q-col-gutter-md > div {
    padding-left: 4px;
    padding-right: 4px;
  }
}
</style>
