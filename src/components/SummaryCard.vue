<template>
  <q-card class="summary-card" :class="customClass" flat>
    <q-card-section 
      class="card-header q-pa-md"
      :style="{ background: headerColor }"
    >
      <div class="text-h6 text-white">{{ title }}</div>
      <div class="text-h4 text-white q-mt-sm">{{ currency }}{{ amount }}</div>
      <div v-if="title2" class="text-subtitle2 text-white q-mt-sm">{{ title2 }}</div>
      <div v-if="amount2" class="text-body1 text-white">{{ currency }}{{ amount2 }}</div>
    </q-card-section>
    
    <q-card-section v-if="startDate || lastClosure" class="q-pa-md">
      <div v-if="startDate" class="text-caption text-grey-7">
        <q-icon name="calendar_today" size="xs" class="q-mr-xs" />
        Fecha inicio: {{ startDate }}
      </div>
      <div v-if="lastClosure" class="text-caption text-grey-7 q-mt-xs">
        <q-icon name="history" size="xs" class="q-mr-xs" />
        Último cierre: {{ lastClosure }}
      </div>
      <div v-if="currentCashBalance" class="text-caption text-grey-7 q-mt-xs">
        <q-icon name="account_balance_wallet" size="xs" class="q-mr-xs" />
        Saldo actual: {{ currency }}{{ currentCashBalance }}
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  amount: {
    type: [String, Number],
    required: true
  },
  title2: {
    type: String,
    default: ''
  },
  amount2: {
    type: [String, Number],
    default: ''
  },
  currency: {
    type: String,
    default: '$ '
  },
  customClass: {
    type: String,
    default: ''
  },
  headerColor: {
    type: String,
    default: 'linear-gradient(135deg, #1976d2 0%, #1565c0 80%)'
  },
  startDate: {
    type: String,
    default: ''
  },
  currentCashBalance: {
    type: [String, Number],
    default: ''
  },
  lastClosure: {
    type: String,
    default: ''
  }
})
</script>

<style scoped>
.summary-card {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

.summary-card:hover {
  transform: translateY(-2px);
}

.card-header {
  position: relative;
}

.blue {
  border-left: 4px solid #1976d2;
}

.green {
  border-left: 4px solid #4caf50;
}
</style>