<template>
  <div class="q-pa-lg">
    <h2 class="text-h4 q-mb-lg">Liquidation Carousel Demo</h2>
    
    <!-- Carousel for Caja and Microseguro -->
    <div class="left-panel q-mb-md">
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
              :amount="150000"
              title2="Saldo de la caja anterior"
              :amount2="50000"
              currency="$ "
              :startDate="'2024-01-15'"
              :lastClosure="'15/01/2024 09:30'"
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
                    <span class="data-value">$25,000.00</span>
                  </div>
                </div>
                <div class="col-12">
                  <div class="data-row">
                    <span class="data-label">
                      <q-icon name="attach_money" class="material-icons" />
                      Total Cobrado
                    </span>
                    <span class="data-value">$175,000.00</span>
                  </div>
                </div>
                <div class="col-12">
                  <div class="data-row">
                    <span class="data-label">
                      <q-icon name="shopping_cart" class="material-icons" />
                      Total Gastos
                    </span>
                    <span class="data-value">$5,000.00</span>
                  </div>
                </div>
              </div>

              <div class="data-row highlight">
                <span class="data-label">
                  <q-icon name="point_of_sale" class="material-icons" />
                  Valor a Entregar
                </span>
                <span class="data-value">$150,000.00</span>
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
              :amount="25000"
              title2="Total de la caja hoy"
              :amount2="5000"
              currency="$ "
              customClass="green"
              :headerColor="'linear-gradient(135deg, #4caf50 0%, #388e3c 80%)'"
            />

            <div class="card">
              <div class="data-row">
                <span class="data-label">
                  <q-icon name="attach_money" class="material-icons" />
                  Recaudo Microseguro
                </span>
                <span class="data-value">$25,000.00</span>
              </div>
              <div class="data-row">
                <span class="data-label">
                  <q-icon name="security" class="material-icons" />
                  Comisiones
                </span>
                <span class="data-value">$2,500.00</span>
              </div>
            </div>
          </div>
        </q-carousel-slide>
      </q-carousel>
    </div>

    <div class="q-mt-lg">
      <h5>Current Slide: {{ currentSlide }}</h5>
      <p>Use the navigation dots below the carousel or arrow buttons to switch between Caja and Microseguro sections.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import SummaryCard from "src/components/SummaryCard.vue";

// Carousel state
const currentSlide = ref("caja");

// Methods
const selectSummary = (type: string) => {
  console.log(`Selected summary: ${type}`);
  currentSlide.value = type;
};
</script>

<style scoped>
/* Carousel Styles */
.liquidation-carousel {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  max-width: 800px;
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