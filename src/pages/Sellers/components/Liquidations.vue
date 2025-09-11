<template>
  <div class="q-pa-md">
    <div class="q-mb-lg full-width container-app q-pa-md">
      <div class="row no-wrap q-col-gutter-xs">
        <div v-for="option in periodOptions" :key="option.value" class="col">
          <q-btn flat no-caps :label="option.label" color="dark" class="text-weight-medium full-width"
            @click="currentPeriod = option.value">
            <div class="underline-indicator" :class="{ active: currentPeriod === option.value }" />
          </q-btn>
        </div>
      </div>
    </div>

    <!-- Carousel for Caja and Microseguro -->
    <div
      v-if="currentPeriod !== 'list'"
      class="left-panel q-mb-md"
      :class="!$q.screen.lt.md ? 'q-px-md' : ''"
    >
      <q-carousel
        v-model="currentSlide"
        animated
        arrows
        infinite
        swipeable
        navigation
        padding
        class="liquidation-carousel"
        height="auto"
      >
        <!-- Caja Slide -->
        <q-carousel-slide name="caja" class="carousel-slide">
          <div
            @click="selectSummary('caja')"
            class="cash-section full-height"
          >
            <SummaryCard
              title="Saldo actual de Caja"
              :amount="liquidationData.liquidation.real_to_deliver"
              title2="Saldo de la caja anterior"
              :amount2="liquidationData.liquidation.initial_cash"
              currency="$ "
              :startDate="
                liquidationData.liquidation.liquidation_start_date ||
                'Sin liquidación'
              "
              :currentCashBalance="
                liquidationData.liquidation.real_to_deliver
              "
              :lastClosure="
                liquidationData.liquidation.existing_liquidation
                  ? formatDate(
                      liquidationData.liquidation.existing_liquidation
                        .created_at,
                    )
                  : 'Sin liquidación'
              "
              customClass="blue"
              :headerColor="'linear-gradient(135deg, #9c27b0 0%, #6a1b9a 80%)'"
            />

            <div class="card">
              <div class="row container-row">
                <div class="col-12">
                  <div class="data-row">
                    <span class="data-label">
                      <q-icon name="payments" class="material-icons" />
                      Valor Base Entregado
                    </span>
                    <div
                      style="display: flex; align-items: center; gap: 8px"
                    >
                      <template
                        v-if="
                          liquidationData.liquidation.existing_liquidation
                        "
                      >
                        <template
                          v-if="
                            !editingBase &&
                            liquidationData.liquidation
                              .existing_liquidation.base_delivered > 0
                          "
                        >
                          <span class="data-value">
                            ${{
                              liquidationData.liquidation
                                .existing_liquidation.base_delivered ??
                              "0.00"
                            }}
                          </span>

                          <button
                            class="history-btn"
                            @click="annulBaseHandler"
                            :loading="loadingAnnulBase"
                          >
                            <q-tooltip>Anular base</q-tooltip>
                            <q-icon
                              name="delete"
                              class="material-icons"
                            />
                          </button>
                        </template>

                        <template v-else>
                          <q-input
                            type="number"
                            v-model.number="
                              liquidationForm.base_delivered
                            "
                            dense
                            outlined
                            min="0.00"
                            step="0.01"
                            style="width: 120px"
                            hide-bottom-space
                            :rules="[
                              (val) => !!val || 'Campo obligatorio',
                              (val) =>
                                val >= 0 ||
                                'Debe ser mayor o igual a $0.00',
                            ]"
                          />
                          <button
                            class="history-btn"
                            @click="cancelEditingBase"
                          >
                            <q-icon name="close" class="material-icons" />
                          </button>
                        </template>
                      </template>

                      <q-input
                        v-else
                        type="number"
                        v-model.number="liquidationForm.base_delivered"
                        dense
                        outlined
                        hide-bottom-space
                        min="0.00"
                        step="0.01"
                        style="width: 120px"
                        :rules="[
                          (val) => !!val || 'Campo obligatorio',
                          (val) =>
                            val >= 0 || 'Debe ser mayor o igual a $0.00',
                        ]"
                      />
                    </div>
                  </div>
                </div>
                <div
                  v-if="liquidationData.liquidation.last_liquidation"
                  class="col-12"
                >
                  <div class="data-row">
                    <span class="data-label">
                      <q-icon name="last_page" class="material-icons" />
                      Base Entregada de la anterior liquidación
                    </span>
                    <div
                      style="display: flex; align-items: center; gap: 8px"
                    >
                      <span class="data-value">
                        ${{
                          liquidationData.liquidation.last_liquidation
                            .base_delivered ?? 0
                        }}
                      </span>
                    </div>
                  </div>
                </div>
                <div class="col-12">
                  <div class="data-row">
                    <span class="data-label">
                      <q-icon
                        name="attach_money"
                        class="material-icons"
                      />
                      Total Cobrado
                    </span>
                    <span class="data-value"
                      >${{
                        liquidationData.liquidation.existing_liquidation
                          ? liquidationData.liquidation
                              .existing_liquidation.total_collected
                          : liquidationData.liquidation.total_collected ||
                            0
                      }}</span
                    >
                  </div>
                </div>
              </div>
              <div class="row container-row">
                <div class="col-12">
                  <div class="data-row">
                    <span class="data-label">
                      <q-icon
                        name="shopping_cart"
                        class="material-icons"
                      />
                      Total Gastos
                    </span>
                    <div
                      style="display: flex; align-items: center; gap: 8px"
                    >
                      <span class="data-value"
                        >${{
                          liquidationData.liquidation.existing_liquidation
                            ? liquidationData.liquidation
                                .existing_liquidation.total_expenses
                            : liquidationData.liquidation.total_expenses
                        }}</span
                      >
                      <button
                        class="history-btn"
                        @click="showHistory('expenses')"
                      >
                        <q-icon name="history" class="material-icons" />
                      </button>
                      <q-btn
                        unelevated
                        color="primary"
                        no-caps
                        size="sm"
                        @click="showCreate"
                      >
                        <q-tooltip>Ingresar gastos</q-tooltip>
                        <q-icon name="add" class="material-icons" />
                      </q-btn>
                    </div>
                  </div>
                </div>
                <div class="col-12">
                  <div class="data-row">
                    <span class="data-label">
                      <q-icon
                        name="shopping_cart"
                        class="material-icons"
                      />
                      Total Ingresos
                    </span>
                    <div
                      style="display: flex; align-items: center; gap: 8px"
                    >
                      <span class="data-value"
                        >${{
                          liquidationData.liquidation.existing_liquidation
                            ? (liquidationData.liquidation
                                .existing_liquidation.total_income ?? 0.0)
                            : (liquidationData.liquidation.total_income ??
                              0.0)
                        }}</span
                      >
                      <button
                        class="history-btn"
                        @click="showHistory('incomes')"
                      >
                        <q-icon name="history" class="material-icons" />
                      </button>
                      <q-btn
                        unelevated
                        color="primary"
                        no-caps
                        size="sm"
                        @click="showCreateIncome"
                      >
                        <q-tooltip>Ingresar ingresos</q-tooltip>
                        <q-icon name="add" class="material-icons" />
                      </q-btn>
                    </div>
                  </div>
                </div>
                <div class="col-12">
                  <div class="data-row">
                    <span class="data-label">
                      <q-icon name="credit_card" class="material-icons" />
                      Créditos Nuevos
                    </span>
                    <div
                      style="display: flex; align-items: center; gap: 8px"
                    >
                      <span class="data-value">{{
                        liquidationData.liquidation.existing_liquidation
                          ? liquidationData.liquidation
                              .existing_liquidation.new_credits
                          : liquidationData.liquidation.new_credits
                      }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="data-row highlight">
                <span class="data-label">
                  <q-icon name="point_of_sale" class="material-icons" />
                  Valor a Entregar
                </span>
                <span class="data-value"
                  >${{
                    liquidationData.liquidation.existing_liquidation
                      ? liquidationData.liquidation.existing_liquidation
                          .real_to_deliver
                      : liquidationData.liquidation.real_to_deliver
                  }}</span
                >
              </div>
              <div class="row container-row">
                <div class="col-12 col-md-6">
                  <div class="data-row">
                    <span class="data-label">
                      <q-icon
                        name="trending_down"
                        class="material-icons"
                      />
                      Faltante
                    </span>
                    <span class="data-value"
                      >${{
                        liquidationData.liquidation.existing_liquidation
                          ? (liquidationData.liquidation
                              .existing_liquidation?.shortage ?? "0.00")
                          : liquidationForm.cash_delivered < required &&
                              liquidationForm.cash_delivered > 0
                            ? required - liquidationForm.cash_delivered
                            : "0.00"
                      }}</span
                    >
                  </div>
                </div>
                <div class="col-12 col-md-6">
                  <div class="data-row">
                    <span class="data-label">
                      <q-icon name="trending_up" class="material-icons" />
                      Sobrante
                    </span>
                    <span class="data-value">
                      ${{
                        liquidationData.liquidation.existing_liquidation
                          ? (liquidationData.liquidation
                              .existing_liquidation?.surplus ?? "0.00")
                          : liquidationForm.cash_delivered > required &&
                              liquidationForm.cash_delivered > 0
                            ? liquidationForm.cash_delivered - required
                            : "0.00"
                      }}</span
                    >
                  </div>
                </div>
              </div>
              <div class="data-row">
                <span class="data-label">
                  <q-icon name="monetization_on" class="material-icons" />
                  Efectivo Entregado
                </span>
                <div class="flex" style="align-items: center; gap: 8px">
                  <template
                    v-if="
                      liquidationData.liquidation.existing_liquidation
                    "
                  >
                    <template v-if="!editingCash">
                      <span class="data-value">
                        ${{
                          liquidationData.liquidation.existing_liquidation
                            .cash_delivered
                        }}
                      </span>
                      <button
                        class="history-btn"
                        @click="startEditingCash"
                      >
                        <q-tooltip>Agregar efectivo</q-tooltip>
                        <q-icon name="add" class="material-icons" />
                      </button>
                    </template>
                    <template v-else>
                      <q-input
                        type="number"
                        v-model.number="liquidationForm.cash_delivered"
                        dense
                        outlined
                        hide-bottom-space
                        min="0.01"
                        step="0.01"
                        style="width: 120px"
                        :rules="[
                          (val) => !!val || 'Campo obligatorio',
                          (val) => val > 0 || 'Debe ser mayor a $0.00',
                        ]"
                      />
                      <button
                        class="history-btn"
                        @click="cancelEditingCash"
                      >
                        <q-icon name="close" class="material-icons" />
                      </button>
                    </template>
                  </template>
                  <q-input
                    v-else
                    type="number"
                    v-model.number="liquidationForm.cash_delivered"
                    dense
                    outlined
                    min="0.01"
                    step="0.01"
                    style="width: 120px"
                    hide-bottom-space
                    :rules="[
                      (val) => !!val || 'Campo obligatorio',
                      (val) => val > 0 || 'Debe ser mayor a $0.00',
                    ]"
                  />
                </div>
              </div>
            </div>
            <div v-if="!liquidationData.liquidation.existing_liquidation">
              <q-btn
                :disabled="
                  liquidationData.liquidation.existing_liquidation ===
                  null
                "
                class="q-mt-sm"
                unelevated
                color="primary"
                :label="loading ? 'Cargando...' : 'Totalizar'"
                no-caps
                style="min-width: 100%; height: 50px; font-size: 1rem"
                @click="saveLiquidation"
              >
                <q-icon
                  name="save"
                  class="btn-icon material-icons ml-2"
                  size="sm"
                />
              </q-btn>
              <p
                class="text-grey-6"
                v-if="
                  liquidationData.liquidation.existing_liquidation ===
                  null
                "
              >
                Para cerrar la liquidación primero debe haber totalizado
                el vendedor
              </p>
            </div>
            <div v-else>
              <div
                v-if="
                  liquidationData.liquidation.existing_liquidation
                    .status !== 'approved'
                "
              >
                <!-- Mostrar botón Totalizar si la base está anulada (base_delivered = 0) -->
                <div
                  v-if="
                    liquidationData.liquidation.existing_liquidation
                      .base_delivered === 0
                  "
                >
                  <q-btn
                    :disabled="
                      liquidationData.liquidation.existing_liquidation ===
                      null
                    "
                    class="q-mt-sm"
                    unelevated
                    color="primary"
                    :label="loading ? 'Cargando...' : 'Totalizar'"
                    no-caps
                    style="min-width: 100%; height: 50px; font-size: 1rem"
                    @click="saveLiquidation"
                  >
                    <q-icon
                      name="save"
                      class="btn-icon material-icons ml-2"
                      size="sm"
                    />
                  </q-btn>
                  <p
                    class="text-grey-6"
                    v-if="
                      liquidationData.liquidation.existing_liquidation ===
                      null
                    "
                  >
                    Para cerrar la liquidación primero debe haber
                    totalizado el vendedor
                  </p>
                </div>
                <!-- Mostrar botones de Anular Base y Cerrar Liquidación si la base no está anulada -->
                <div v-else class="row q-col-gutter-sm q-mt-sm">
                  <div class="col-12">
                    <q-btn
                      unelevated
                      color="primary"
                      label="Cerrar Liquidación"
                      no-caps
                      style="height: 50px; font-size: 1rem; width: 100%"
                      @click="approveLiquidationHandler"
                      :loading="loadingApprove"
                    />
                  </div>
                </div>
              </div>
              <div v-else>
                <q-banner class="bg-positive text-white">
                  Liquidación ya ha sido cerrada y aprobada.
                </q-banner>
              </div>
            </div>
          </div>
        </q-carousel-slide>

        <!-- Microseguro Slide -->
        <q-carousel-slide name="microseguro" class="carousel-slide">
          <div
            @click="selectSummary('microseguro')"
            class="microseguro-section full-height"
          >
            <SummaryCard
              title="Caja Microseguro"
              :amount="microTotalAmount"
              title2="Total de la caja hoy"
              :amount2="microTotalAmountToday"
              currency="$ "
              customClass="green"
              :headerColor="'linear-gradient(135deg, #9c27b0 20%, #6a1b9a 80%)'"
            />

            <div class="card">
              <div class="data-row">
                <span class="data-label">
                  <q-icon name="attach_money" class="material-icons" />
                  Recaudo Microseguro
                </span>
                <span class="data-value">{{ microTotalAmount }}</span>
              </div>
            </div>
            <q-separator
              v-if="liquidationData.liquidation.path"
              class="q-my-lg"
              color="grey-5"
            />
            <q-card
              v-if="liquidationData.liquidation.path"
              flat
              bordered
              class="q-my-md interactive-card"
            >
              <q-card-section
                @click="
                  openImageModal(liquidationData.liquidation.path || '')
                "
                class="cursor-pointer"
              >
                <div class="row items-center no-wrap">
                  <q-icon
                    name="collections"
                    color="primary"
                    size="28px"
                    class="q-mr-md"
                  />
                  <div class="col">
                    <div class="text-h6 text-primary">
                      Comprobante de Liquidación
                    </div>
                    <div class="text-caption text-grey-8">
                      Visualiza la captura de la liquidación realizada por
                      el vendedor.
                    </div>
                  </div>
                  <q-icon
                    name="chevron_right"
                    color="grey-7"
                    size="24px"
                  />
                </div>
              </q-card-section>

              <q-separator />
              <q-card-actions align="right">
                <q-btn
                  flat
                  dense
                  no-caps
                  icon="open_in_new"
                  label="Ver Imagen"
                  color="primary"
                  @click="
                    openImageModal(liquidationData.liquidation.path || '')
                  "
                />
              </q-card-actions>
            </q-card>
          </div>
        </q-carousel-slide>
      </q-carousel>
    </div>

    <div v-if="currentPeriod === 'daily'" class="q-mb-md row justify-end q-pa-md">
      <div class="col-12 col-sm-4 col-md-3">
        <q-input filled dense v-model="selectedDate" label="Seleccionar fecha" class="bg-white rounded-input shadow-2">
          <template v-slot:prepend>
            <q-icon name="date_range" color="primary" />
          </template>

          <template v-slot:append>
            <q-icon name="event" color="primary" class="cursor-pointer">
              <q-popup-proxy cover transition-show="fade" transition-hide="fade">
                <q-date v-model="selectedDate" minimal color="primary" />
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>
    </div>
    <div v-if="currentPeriod === 'weekly'" class="q-mb-md row justify-end q-pa-md q-col-gutter-md">
      <div class="col-12 col-sm-4 col-md-3">
        <q-input filled dense v-model="selectedDate" label="Seleccionar fecha de inicio"
          class="bg-white rounded-input shadow-2">
          <template v-slot:prepend>
            <q-icon name="date_range" color="primary" />
          </template>

          <template v-slot:append>
            <q-icon name="event" color="primary" class="cursor-pointer">
              <q-popup-proxy cover transition-show="fade" transition-hide="fade">
                <q-date v-model="selectedDate" minimal color="primary" />
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>
      <div class="col-12 col-sm-4 col-md-3">
        <q-input filled dense v-model="selectedDate" label="Seleccionar fecha de cierre"
          class="bg-white rounded-input shadow-2">
          <template v-slot:prepend>
            <q-icon name="date_range" color="primary" />
          </template>

          <template v-slot:append>
            <q-icon name="event" color="primary" class="cursor-pointer">
              <q-popup-proxy cover transition-show="fade" transition-hide="fade">
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
          <VendorInfoCard name="Fabiana Martinez" location="Medellín, Colombia" lastClosure="03/02/2024 14:30"
            customClass="blue" height="190px" />
        </div>

        <div class="col-12 col-md-4">
          <SectionItem title="Caja Inicial" value="0.00" custom-class="green-card" height="190px" icon="inventory"
            color="secondary" />
        </div>

        <div class="col-12 col-md-4">
          <SectionItem title="Caja Final" value="2200.00" custom-class="blue-card" height="190px" icon="point_of_sale"
            color="primary" />
        </div>

        <div class="col-12 col-md-4">
          <SectionItem title="Recaudo Por tipo de Pago" value="Efectivo: (234.60) Transferencia: (20.00)"
            custom-class="green-card" color="secondary" height="213px" icon="payments">
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
          <SectionItem title="Ventas" value="100.00 ( Interés 10.00 )" custom-class="card-white" height="213px"
            icon="point_of_sale" />
        </div>

        <div class="col-12 col-md-4">
          <div class="row q-col-gutter-md">
            <div class="col-12">
              <SectionItem title="Cartera Inicial" value="0.00" custom-class="card-white" icon="account_balance_wallet"
                height="50px" />
            </div>
            <div class="col-12">
              <SectionItem title="Cartera Final" value="600.45" custom-class="grey-card" icon="account_balance"
                height="50px" />
            </div>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <SectionItem title="Gastos" value="0.00" custom-class="card-white" icon="trending_down" />
        </div>

        <div class="col-12 col-md-4">
          <SectionItem title="Ingresos" value="0.00" custom-class="card-white" icon="trending_up" />
        </div>

        <div class="col-12 col-md-4">
          <SectionItem title="Retiros" value="100.00" custom-class="card-white" icon="logout" />
        </div>

        <div class="col-12 col-md-4">
          <SectionItem title="Base Entregada" value="0.00" custom-class="card-white" height="110px"
            icon="assignment_returned" />
        </div>

        <div class="col-12 col-md-4">
          <SectionItem custom-class="card-white" height="110px">
            <template #additional-content>
              <div class="row q-col-gutter-xs">
                <div v-for="(stat, index) in clientStatsFirst" :key="index"
                  class="col-12 col-sm-12 col-md-12 flex justify-between items-center">
                  <div class="text-caption text-blue-grey-7 flex items-center">
                    <q-icon :name="stat.icon" size="20px" color="black" class="mr-2" />
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
                <div v-for="(stat, index) in clientStatsSecond" :key="index"
                  class="col-12 col-sm-12 col-md-12 flex justify-between items-center">
                  <div class="text-caption text-blue-grey-7 flex items-center">
                    <q-icon :name="stat.icon" size="20px" color="black" class="mr-2" />
                    {{ stat.label }}:
                  </div>
                  <div class="text-subtitle2">{{ stat.value }}</div>
                </div>
              </div>
            </template>
          </SectionItem>
        </div>

        <div class="col-12 col-md-4">
          <SectionItem title="Caja de seguro" value="0.00" custom-class="green-card" color="secondary"
            icon="security" />
        </div>
        <div class="col-12 col-md-4">
          <SectionItem title="Ingreso de seguro" value="0.00" custom-class="green-card" color="secondary"
            icon="verified_user" />
        </div>
        <div class="col-12 col-md-4">
          <SectionItem title="Retiros de seguro" value="0.00" custom-class="green-card" color="secondary"
            icon="savings" />
        </div>
      </div>
    </q-card>
    <div v-else class="q-mt-lg">
      <SettlementList />
    </div>
    <div v-if="currentPeriod === 'weekly'" class="col-12 col-sm-auto flex justify-end q-pa-sm">
      <q-btn label="Generar liquidación" icon="description" color="primary" class="generate-btn q-py-md"
        @click="settlementModalVisible = true" />
    </div>

    <SettlementModal :vendor="vendor" :visible="settlementModalVisible"
      @update:visible="settlementModalVisible = $event" @close="handleModalClose" @generate="generateSettlement" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { useQuasar } from "quasar";
import SectionItem from "./SectionItem.vue";
import VendorInfoCard from "./VendorInfoCard.vue";
import SettlementModal from "./SettlementModal.vue";
import SettlementList from "./SettlementList.vue";
import SummaryCard from "src/components/SummaryCard.vue";

const $q = useQuasar();

const props = defineProps<{
  vendor: any;
}>();

const selectedDate = ref(new Date().toISOString().substr(0, 10));
const currentPeriod = ref<"daily" | "weekly" | "list" | any>("daily");
const settlementModalVisible = ref(false);

// Carousel state
const currentSlide = ref("caja");

// Mock liquidation data - replace with actual data from props or API
const liquidationData = reactive({
  liquidation: {
    real_to_deliver: 150000,
    initial_cash: 50000,
    liquidation_start_date: "2024-01-15",
    existing_liquidation: {
      created_at: "2024-01-15T09:30:00",
      base_delivered: 25000,
      total_collected: 175000,
      total_expenses: 5000,
      total_income: 2000,
      new_credits: 15,
      real_to_deliver: 150000,
      shortage: 0,
      surplus: 0,
      cash_delivered: 150000,
      status: "pending"
    },
    last_liquidation: {
      base_delivered: 20000
    },
    total_collected: 175000,
    total_expenses: 5000,
    total_income: 2000,
    new_credits: 15,
    path: "/path/to/liquidation/image.jpg"
  }
});

// Microseguro amounts
const microTotalAmount = ref("25000.00");
const microTotalAmountToday = ref("5000.00");

// Form states
const editingBase = ref(false);
const editingCash = ref(false);
const loading = ref(false);
const loadingAnnulBase = ref(false);
const loadingApprove = ref(false);

const liquidationForm = reactive({
  base_delivered: 0,
  cash_delivered: 0
});

const required = ref(150000);

// Methods
const selectSummary = (type: string) => {
  console.log(`Selected summary: ${type}`);
  currentSlide.value = type;
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('es-CO');
};

const annulBaseHandler = () => {
  console.log("Anular base");
  loadingAnnulBase.value = true;
  setTimeout(() => {
    loadingAnnulBase.value = false;
  }, 1000);
};

const startEditingBase = () => {
  editingBase.value = true;
};

const cancelEditingBase = () => {
  editingBase.value = false;
};

const startEditingCash = () => {
  editingCash.value = true;
};

const cancelEditingCash = () => {
  editingCash.value = false;
};

const saveLiquidation = () => {
  console.log("Saving liquidation");
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
  }, 2000);
};

const approveLiquidationHandler = () => {
  console.log("Approving liquidation");
  loadingApprove.value = true;
  setTimeout(() => {
    loadingApprove.value = false;
  }, 1500);
};

const showHistory = (type: string) => {
  console.log(`Show history for: ${type}`);
};

const showCreate = () => {
  console.log("Show create");
};

const showCreateIncome = () => {
  console.log("Show create income");
};

const openImageModal = (path: string) => {
  console.log(`Open image modal for: ${path}`);
};

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

  .q-col-gutter-md>div {
    padding-left: 4px;
    padding-right: 4px;
  }
}

/* Carousel Styles */
.liquidation-carousel {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.liquidation-carousel :deep(.q-carousel__control) {
  color: #1976d2;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(4px);
}

.liquidation-carousel :deep(.q-carousel__navigation) {
  padding: 8px;
}

.liquidation-carousel :deep(.q-carousel__navigation-icon) {
  background: rgba(25, 118, 210, 0.1);
  color: #1976d2;
  transition: all 0.3s ease;
}

.liquidation-carousel :deep(.q-carousel__navigation-icon--active) {
  background: #1976d2;
  color: white;
}

.carousel-slide {
  padding: 16px;
}

.full-height {
  height: 100%;
}

/* Liquidation Card Styles */
.cash-section,
.microseguro-section {
  cursor: pointer;
  transition: transform 0.2s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.cash-section:hover,
.microseguro-section:hover {
  transform: translateY(-2px);
}

.card {
  background: white;
  border-radius: 8px;
  padding: 16px;
  margin-top: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  flex: 1;
}

.container-row {
  margin-bottom: 16px;
}

.data-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.data-row:last-child {
  border-bottom: none;
}

.data-row.highlight {
  background: #f8fafc;
  border-radius: 8px;
  padding: 16px;
  margin: 16px 0;
  border: 2px solid #e2e8f0;
  font-weight: 600;
}

.data-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  color: #374151;
  font-size: 0.9rem;
}

.data-value {
  font-weight: 600;
  color: #1f2937;
  font-size: 1rem;
}

.history-btn {
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  color: #6b7280;
  transition: color 0.2s ease;
  border-radius: 4px;
}

.history-btn:hover {
  color: #1976d2;
  background: rgba(25, 118, 210, 0.1);
}

.interactive-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.interactive-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Mobile responsiveness for carousel */
@media (max-width: 768px) {
  .carousel-slide {
    padding: 8px;
  }
  
  .card {
    margin-top: 12px;
    padding: 12px;
  }
  
  .data-row {
    padding: 8px 0;
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
  
  .data-row.highlight {
    padding: 12px;
  }
  
  .liquidation-carousel :deep(.q-carousel__control) {
    font-size: 14px;
  }
}
</style>
