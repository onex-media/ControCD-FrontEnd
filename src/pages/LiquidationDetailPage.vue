<template>
  <div class="liquidation-detail-page q-pa-md">
    <div class="header-section q-mb-lg">
      <h2 class="text-h4 q-mb-md">Detalle de Liquidación</h2>
      <q-breadcrumbs>
        <q-breadcrumbs-el label="Liquidaciones" icon="home" />
        <q-breadcrumbs-el label="Detalle" />
      </q-breadcrumbs>
    </div>

    <!-- Carousel Section -->
    <div class="carousel-section">
      <q-carousel
        v-model="currentSlide"
        transition-prev="slide-right"
        transition-next="slide-left"
        swipeable
        animated
        control-color="primary"
        navigation
        padding
        arrows
        height="auto"
        class="liquidation-carousel"
      >
        <!-- Caja Slide -->
        <q-carousel-slide name="caja" class="column no-wrap">
          <div
            @click="selectSummary('caja')"
            class="cash-section cursor-pointer"
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

            <div class="card q-mt-md">
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

            <!-- Action Buttons for Caja -->
            <div v-if="!liquidationData.liquidation.existing_liquidation" class="q-mt-md">
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
                class="text-grey-6 q-mt-sm"
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
                  class="q-mt-md"
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
                    class="text-grey-6 q-mt-sm"
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
                <div v-else class="row q-col-gutter-sm q-mt-md">
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
                <q-banner class="bg-positive text-white q-mt-md">
                  Liquidación ya ha sido cerrada y aprobada.
                </q-banner>
              </div>
            </div>
          </div>
        </q-carousel-slide>

        <!-- Microseguro Slide -->
        <q-carousel-slide name="microseguro" class="column no-wrap">
          <div
            @click="selectSummary('microseguro')"
            class="microseguro-section cursor-pointer"
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

            <div class="card q-mt-md">
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

      <!-- Navigation Indicators -->
      <div class="carousel-nav q-mt-md text-center">
        <q-btn
          v-for="slide in slides"
          :key="slide.name"
          :color="currentSlide === slide.name ? 'primary' : 'grey'"
          :outline="currentSlide !== slide.name"
          :label="slide.label"
          no-caps
          class="q-mx-sm"
          @click="currentSlide = slide.name"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import SummaryCard from '../components/SummaryCard.vue'

// Carousel state
const currentSlide = ref('caja')
const slides = [
  { name: 'caja', label: 'Caja' },
  { name: 'microseguro', label: 'Microseguro' }
]

// Form state
const editingBase = ref(false)
const editingCash = ref(false)
const loading = ref(false)
const loadingAnnulBase = ref(false)
const loadingApprove = ref(false)

// Mock data (would typically come from API)
const liquidationData = reactive({
  liquidation: {
    real_to_deliver: 15000.50,
    initial_cash: 5000.00,
    liquidation_start_date: '2025-01-15',
    existing_liquidation: {
      created_at: '2025-01-15T10:30:00Z',
      base_delivered: 2000.00,
      total_collected: 12000.00,
      total_expenses: 500.00,
      total_income: 300.00,
      new_credits: 5,
      real_to_deliver: 15000.50,
      shortage: 0.00,
      surplus: 100.00,
      cash_delivered: 15000.50,
      status: 'pending'
    },
    last_liquidation: {
      base_delivered: 1500.00
    },
    total_collected: 12000.00,
    total_expenses: 500.00,
    total_income: 300.00,
    new_credits: 5,
    path: '/path/to/liquidation/image.jpg'
  }
})

const liquidationForm = reactive({
  base_delivered: 2000.00,
  cash_delivered: 15000.50
})

const microTotalAmount = ref('850.00')
const microTotalAmountToday = ref('420.00')

const required = computed(() => {
  return liquidationData.liquidation.real_to_deliver || 0
})

// Methods
const selectSummary = (type) => {
  console.log('Selected summary:', type)
  currentSlide.value = type
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('es-CO', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const annulBaseHandler = () => {
  loadingAnnulBase.value = true
  // Simulate API call
  setTimeout(() => {
    liquidationData.liquidation.existing_liquidation.base_delivered = 0
    loadingAnnulBase.value = false
  }, 1000)
}

const startEditingBase = () => {
  editingBase.value = true
}

const cancelEditingBase = () => {
  editingBase.value = false
}

const startEditingCash = () => {
  editingCash.value = true
}

const cancelEditingCash = () => {
  editingCash.value = false
}

const showHistory = (type) => {
  console.log('Show history for:', type)
}

const showCreate = () => {
  console.log('Show create expense form')
}

const showCreateIncome = () => {
  console.log('Show create income form')
}

const saveLiquidation = () => {
  loading.value = true
  // Simulate API call
  setTimeout(() => {
    loading.value = false
    console.log('Liquidation saved')
  }, 2000)
}

const approveLiquidationHandler = () => {
  loadingApprove.value = true
  // Simulate API call
  setTimeout(() => {
    liquidationData.liquidation.existing_liquidation.status = 'approved'
    loadingApprove.value = false
  }, 1500)
}

const openImageModal = (imagePath) => {
  console.log('Open image:', imagePath)
}
</script>

<style scoped>
.liquidation-detail-page {
  max-width: 1200px;
  margin: 0 auto;
}

.carousel-section {
  background: white;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.liquidation-carousel {
  border-radius: 8px;
}

.carousel-nav {
  margin-top: 1rem;
}

.card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border: 1px solid #e0e0e0;
}

.container-row {
  margin-bottom: 1rem;
}

.data-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f5f5f5;
}

.data-row:last-child {
  border-bottom: none;
}

.data-row.highlight {
  background-color: #f8f9fa;
  padding: 1rem;
  border-radius: 6px;
  font-weight: 600;
  margin: 1rem 0;
}

.data-label {
  display: flex;
  align-items: center;
  font-weight: 500;
  color: #555;
  gap: 0.5rem;
}

.data-value {
  font-weight: 600;
  color: #333;
}

.history-btn {
  background: transparent;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 0.25rem 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
}

.history-btn:hover {
  background-color: #f5f5f5;
  border-color: #bbb;
}

.cash-section,
.microseguro-section {
  transition: transform 0.2s ease;
}

.cash-section:hover,
.microseguro-section:hover {
  transform: translateY(-2px);
}

.interactive-card {
  transition: box-shadow 0.2s ease;
}

.interactive-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .liquidation-detail-page {
    padding: 0.5rem;
  }
  
  .carousel-section {
    padding: 0.5rem;
  }
  
  .card {
    padding: 1rem;
  }
  
  .data-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}
</style>