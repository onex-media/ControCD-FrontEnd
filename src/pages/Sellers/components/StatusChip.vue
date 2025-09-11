<template>
  <q-chip
    dense
    class="status-chip q-px-sm q-py-xs flex justify-center items-center"
    :class="statusClass"
  >
 {{ statusText }}
    <q-icon :name="statusIcon" class="q-ml-sm" />
   
  </q-chip>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  status: string;
}>();

const statusConfig = computed(() => {
  switch (props.status) {
    case "Pagada":
      return {
        text: "Pagada",
        class: "paid-chip",
        icon: "check_circle",
      };
    case "Generada":
      return {
        text: "Generada",
        class: "credit-chip",
        icon: "credit_card",
      };
    case "Pendiente":
      return {
        text: "Pendiente",
        class: "reminder-chip",
        icon: "schedule",
      };
    default:
      return {
        text: props.status,
        class: "default-chip",
        icon: "help",
      };
  }
});

const statusText = computed(() => statusConfig.value.text);
const statusIcon = computed(() => statusConfig.value.icon);
const statusClass = computed(() => statusConfig.value.class);
</script>

<style scoped>
.status-chip {
  border-radius: 50px;
  font-weight: 500;
  height: 25px;
  width: 110px;
  background-color: transparent !important;
  border: 2px solid;
}

.paid-chip {
  color: #3fbc4c;
  border-color: #3fbc4c;
  background-color: #d8ffdc !important;
}

.credit-chip {
  color: #2b69e8;
  border-color: #a7beec;
  background-color: #efefef !important;
}

.reminder-chip {
  color: #bbac25;
  border-color: #e0ce2c;
  background-color: #fefadc !important;
}

.default-chip {
  color: #424242;
  border-color: #e0e0e0;
  background-color: #f5f5f5 !important;
}

.q-icon {
  color: inherit !important;
}
</style>
