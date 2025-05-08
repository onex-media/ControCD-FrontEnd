import { ref } from "vue";
import { counterEntities } from "src/services/dashboard.service";

export const useDashboard = () => {
  // references
  const counterData = ref({});

  // methods
  const loadCounterEntities = async () => {
    const response = await counterEntities();
    if (response) {
      counterData.value = response.data;
    }
  };

  return {
    counterData,
    loadCounterEntities,
  };
};
