<template>
  <div
    class="section-item"
    :class="customClass"
    :style="{
      height: height || 'auto',
      cursor: clickable ? 'pointer' : 'default',
    }"
    @click="handleClick"
  >
    <div class="row q-pa-sm items-center">
      <div class="col-12">
        <div class="row q-gutter-md">
          <div v-if="icon" class="col-2 icon-container">
            <q-icon :name="icon" size="24px" :color="color" />
          </div>
          <div v-if="title || value" class="col-auto">
            <div
              v-if="title"
              class="text-caption"
              :style="{ color: textColor }"
            >
              {{ title }}
            </div>
            <div
              v-if="value"
              class="text-h6 text-weight-medium q-mt-xs text-caption"
              :style="{ color: textColor }"
            >
              {{ value }}
            </div>
          </div>
        </div>

        <div
          v-if="subtext"
          class="text-caption q-mt-xs"
          :style="{ color: textColor }"
        >
          {{ subtext }}
        </div>
        <div
          v-if="$slots['additional-content']"
          class="text-caption"
          :style="{
            color: textColor,
            marginTop: title || value || subtext ? '8px' : '8px',
            paddingTop: title || value || subtext ? '8px' : '8px',
          }"
        >
          <slot name="additional-content"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from "vue";

const props = defineProps({
  title: String,
  value: String,
  subtext: String,
  customClass: String,
  height: {
    type: String,
    default: "100px",
  },
  icon: {
    type: String,
  },
  color: {
    type: String,
    default: "black",
  },
  textColor: {
    type: String,
    default: "#37474f",
  },
  clickable: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(["click"]);

const handleClick = (event: MouseEvent) => {
  if (props.clickable) {
    emit("click", event);
  }
};
</script>

<style scoped>
.text-caption {
  font-size: 0.9rem;
}
.section-item {
  border-radius: 8px;
  padding: 12px;
  min-height: 100px;
  transition: transform 0.2s;
}

.section-item:hover {
  transform: translateY(-2px);
}

.text-h6 {
  font-size: 1.1rem;
  color: #37474f;
}

.icon-container {
  display: flex;
  align-items: start;
  justify-content: center;
  padding: 8px;
  color: black;
}
green-card.clickable,
.card-white.clickable {
  border: 2px solid transparent;
  transition: border-color 0.3s;
}

.green-card.clickable:hover,
.card-white.clickable:hover {
  border-color: #2b69e8;
}
</style>
