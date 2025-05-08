<template>
  <div id="map" style="height: 500px"></div>
</template>

<script lang="ts" setup>
import { onMounted, watch } from "vue";
import { useMap } from "src/composables/useMap";

const { map, runMap, setMarker, locationSelected, getSelectedLocation } =
  useMap();

const props = defineProps({
  geolocation: {
    type: Object,
    required: false,
    default: () => ({ latitude: null, longitude: null }),
  },
  isEditing: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const emit = defineEmits(["location-selected"]);

onMounted(() => {
  if (props.geolocation.latitude && props.geolocation.longitude) {
    runMap(
      "map",
      Number(props.geolocation.latitude),
      Number(props.geolocation.longitude),
      12
    );
    console.log("here");
    setMarker(
      Number(props.geolocation.latitude),
      Number(props.geolocation.longitude)
    );
  } else {
    runMap("map", 4.69, -74.08, 12);
  }
});

watch(locationSelected, (newLocation) => {
  if (newLocation) {
    console.log("New location selected:", newLocation);
    emit("location-selected", getSelectedLocation());
  }
});
</script>
