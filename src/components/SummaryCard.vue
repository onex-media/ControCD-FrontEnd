<template>
  <div class="summary-card" :class="[customClass]">
    <div 
      class="card-header"
      :style="{ background: headerColor }"
    >
      <div class="header-content">
        <div class="title-section">
          <h3 class="card-title">{{ title }}</h3>
          <div class="amount-display">
            <span class="currency">{{ currency }}</span>
            <span class="amount">{{ formatAmount(amount) }}</span>
          </div>
        </div>
        
        <div v-if="title2 && amount2 !== undefined" class="subtitle-section">
          <p class="card-subtitle">{{ title2 }}</p>
          <div class="amount-display secondary">
            <span class="currency">{{ currency }}</span>
            <span class="amount">{{ formatAmount(amount2) }}</span>
          </div>
        </div>
      </div>
    </div>
    
    <div v-if="startDate || lastClosure" class="card-info">
      <div v-if="startDate" class="info-item">
        <q-icon name="calendar_today" class="info-icon" />
        <span class="info-text">Inicio: {{ startDate }}</span>
      </div>
      <div v-if="lastClosure" class="info-item">
        <q-icon name="schedule" class="info-icon" />
        <span class="info-text">Último cierre: {{ lastClosure }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  title: string
  amount: number | string
  title2?: string
  amount2?: number | string
  currency?: string
  customClass?: string
  headerColor?: string
  startDate?: string
  currentCashBalance?: number | string
  lastClosure?: string
}

const props = withDefaults(defineProps<Props>(), {
  currency: '$',
  customClass: '',
  headerColor: 'linear-gradient(135deg, #1976d2 0%, #1565c0 80%)'
})

const formatAmount = (value: number | string | undefined) => {
  if (value === undefined || value === null) return '0.00'
  
  const numValue = typeof value === 'string' ? parseFloat(value) : value
  if (isNaN(numValue)) return '0.00'
  
  return new Intl.NumberFormat('es-CO', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(numValue)
}
</script>

<style scoped>
.summary-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.summary-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.card-header {
  padding: 20px;
  color: white;
  position: relative;
}

.header-content {
  position: relative;
  z-index: 2;
}

.title-section {
  margin-bottom: 16px;
}

.card-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 8px 0;
  opacity: 0.95;
}

.subtitle-section .card-title {
  font-size: 0.9rem;
  margin-bottom: 4px;
}

.amount-display {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.amount-display.secondary {
  font-size: 0.9rem;
  opacity: 0.9;
}

.currency {
  font-size: 1.2rem;
  font-weight: 500;
}

.amount {
  font-size: 2rem;
  font-weight: 700;
  letter-spacing: -0.025em;
}

.amount-display.secondary .amount {
  font-size: 1.4rem;
  font-weight: 600;
}

.card-subtitle {
  font-size: 0.9rem;
  margin: 0 0 4px 0;
  opacity: 0.85;
  font-weight: 400;
}

.card-info {
  padding: 16px 20px;
  background: #f8fafb;
  border-top: 1px solid #e2e8f0;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.info-item:last-child {
  margin-bottom: 0;
}

.info-icon {
  font-size: 16px;
  color: #64748b;
}

.info-text {
  font-size: 0.85rem;
  color: #475569;
  font-weight: 500;
}

/* Custom color variants */
.summary-card.blue .card-header {
  background: linear-gradient(135deg, #9c27b0 0%, #6a1b9a 80%);
}

.summary-card.green .card-header {
  background: linear-gradient(135deg, #4caf50 0%, #388e3c 80%);
}

.summary-card.orange .card-header {
  background: linear-gradient(135deg, #ff9800 0%, #f57c00 80%);
}

.summary-card.red .card-header {
  background: linear-gradient(135deg, #f44336 0%, #d32f2f 80%);
}

/* Responsive design */
@media (max-width: 768px) {
  .card-header {
    padding: 16px;
  }
  
  .card-title {
    font-size: 1rem;
  }
  
  .amount {
    font-size: 1.6rem;
  }
  
  .amount-display.secondary .amount {
    font-size: 1.2rem;
  }
  
  .card-info {
    padding: 12px 16px;
  }
}
</style>