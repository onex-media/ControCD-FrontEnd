<template>
  <div
    class="vendor-info-card"
    :class="customClass"
    :style="{ height: height || 'auto' }"
  >
    <div class="header">
      <div class="vendor-details q-mt-xs row items-center">
        <div class="initials-box">{{ initials }}</div>

        <div class="column q-ml-md">
          <div class="text-h6">{{ name }}</div>
          <strong class="vendor-name">Vendedor</strong>
          <div class="vendor-location text-caption text-grey-7">
            {{ location }}
          </div>
        </div>
      </div>
    </div>

    <div class="last-closure">
      <div class="row q-col-gutter-xs">
        <div class="col-12 flex justify-between items-center">
          <div class="text-caption text-blue-grey-7">
            Fecha inicio del cobro:
          </div>
          <div class="text-subtitle2">01/01/2024 - 10:00 AM</div>
        </div>
        <div class="col-12 flex justify-between items-center">
          <div class="text-caption text-blue-grey-7">Último cierre:</div>
          <div class="text-subtitle2">01/01/2024 - 15:30 PM</div>
        </div>
        <div class="col-12 flex justify-between items-center">
          <div class="text-caption text-blue-grey-7">
            Fecha de último Acceso móvil:
          </div>
          <div class="text-subtitle2">01/01/2024 - 19:45 PM</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps({
  name: {
    type: String,
    default: "Cobrador S",
  },
  location: {
    type: String,
    default: "Medellín, Colombia",
  },
  lastClosure: {
    type: String,
    default: "dd/mm/aaaa hh:mm",
  },
  customClass: String,
  height: {
    type: String,
    default: "150px",
  },
});

const initials = computed(() => {
  return props.name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
});
</script>

<style scoped>
.text-caption {
  font-size: 0.8rem;
  color: #1a237e;
}

.card {
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 10px;
  color: white;
}

.card.morning {
  background-color: #ffa500;
}
.card.afternoon {
  background-color: #ff4500;
}
.card.night {
  background-color: #483d8b;
}

.vendor-info-card {
  border-radius: 8px;
  padding: 16px;
  background-color: #ffffff;
  min-height: 180px;
  display: flex;
  flex-direction: column;
}

.header {
  flex-grow: 1;
}

.vendor-name {
  font-size: 1.1rem;
  display: block;
}

.vendor-location {
  margin-top: 4px;
}

.last-closure {
  margin-top: 10px;
}

.closure-date {
  font-size: 1rem;
  margin-top: 4px;
}

.initials-box {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  background-color: #2b69e8;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 2rem;
}

.vendor-info-card.blue {
  background-color: #ebeeff;
}

.vendor-info-card.green {
  background-color: #e8f5e9;
  border-left: 4px solid #4caf50;
}

.vendor-info-card.grey {
  background-color: #f5f5f5;
  border-left: 4px solid #9e9e9e;
}
</style>
