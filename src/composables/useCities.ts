import { ref, Ref } from "vue";
import { getCitiesSelectReq } from "src/services/cities.services";
import { handleMessages } from "src/utils/notify";

export const useCities = () => {
  const cities: Ref<any[]> = ref([]);
  const countries = ref<any[]>([]);

  const getCitiesSelect = async () => {
    try {
      const res: any = await getCitiesSelectReq();

      if (res.code === "error") {
        return handleMessages({
          message: res.error.message,
          color: "red",
          icon: "close",
        });
      }

      cities.value = res.data.data;
    } catch (error) {
      console.error("Error fetching cities:", error);
      handleMessages({
        message: "Error al obtener las ciudades",
        color: "red",
        icon: "close",
      });
    }
  };

  const getCountrySelect = async () => {
    try {
      const res: any = await getCitiesSelectReq();

      if (res.code === "error") {
        return handleMessages({
          message: res.error.message,
          color: "red",
          icon: "close",
        });
      }

      countries.value = res.data.data;
    } catch (error) {
      console.error("Error fetching country:", error);
      handleMessages({
        message: "Error al obtener los paises",
        color: "red",
        icon: "close",
      });
    }
  };

  return {
    cities,
    countries,
    getCitiesSelect,
    getCountrySelect,
  };
};
