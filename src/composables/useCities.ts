import { onMounted, reactive, ref, Ref } from "vue";
import { getCitiesSelectReq } from "src/services/cities.services";
import { handleMessages } from "src/utils/notify";
import {
  deleteData,
  getData,
  postData,
  putData,
} from "../services/api.services";
import { CreateCityPayload } from "@/types/cities.types";

interface CitiesForm {
  name: string;
  country_id: number | null;
}
export const useCities = () => {
  const cityForm = ref<CitiesForm>({
    name: "",
    country_id: 0,
  });
  const countries = ref<any[]>([]);
  const cities: Ref<any[]> = ref([]);
  const totalCities = ref(0);
  const isSaving = ref<boolean>(false);
  const isEditing = ref<boolean>(false);
  const selectedCity = ref<any | null>(null);
  const deleting = ref(false);
  const saving = ref(false);
  const showCreateModal = ref(false);
  const showDeleteModal = ref(false);

  const pagination = reactive<Pagination>({
    sortBy: "desc",
    descending: false,
    page: 1,
    countPage: 1,
    rowsNumber: 1,
    rowsPerPage: 50,
  });

  const cityFormData: Ref<CreateCityPayload> = ref({
    name: "",
    country_id: 0,
  });
  const fetchCities = async () => {
    try {
      const response = (await getData({ path: "/cities" })) as any;
      cities.value = response.data;
    } catch (error) {
      handleMessages({
        message: "Error al cargar las creditos",
        color: "red",
        icon: "close",
      });
    }
  };
  const getCitiesSelect = async () => {
    try {
      const res: any = await getCitiesSelectReq();
      cities.value = res.data.dat;
      if (res.code === "error") {
        return handleMessages({
          message: res.error.message,
          color: "red",
          icon: "close",
        });
      }

      cities.value = res.data.data;
    } catch (error) {
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

  const saveCity = async () => {
    try {
      const errors = validateCityForm();
      if (errors.length > 0) {
        handleMessages({
          message: "Rellena todos los campos requeridos",
          color: "red",
          icon: "close",
          
        });
        return;
      }

      isSaving.value = true;

      // 2. Preparar payload
      const cityData = {
        name: cityForm.value.name,
        country_id: cityForm.value.country_id,
      };

      let response;
      let data;

      if (isEditing.value && selectedCity.value?.id) {
        data = {
          path: `/cities/${selectedCity.value.id}`,
          payload: cityData,
        };
        try {
          response = await putData(data);
        } catch (error) {
          throw new Error(`Error actualizando ciudad: ${error}`);
        }
      } else {
        data = {
          path: `cities/create`,
          payload: cityData,
        };
        try {
          response = await postData(data);
          handleMessages({
            message: "Ciudad creada exitosamente",
            color: "green",
            icon: "check",
          });
        } catch (error) {
          throw new Error(`Error creando ciudad: ${error}`);
        }
      }

      await fetchCities();
      closeModalWithoutValidation();
      closeModal();
    } catch (error) {
      throw error; //
    } finally {
      isSaving.value = false;
    }
  };

  const confirmDeleteCity = (city: any) => {
    selectedCity.value = city;
    showDeleteModal.value = true;
  };

  const handleErrorResponse = (error: any) => {
    let errorMessage = "Error al guardar el crédito";
    if (error?.response?.data?.errors) {
      const errorDetails = Object.values(error?.response.data.errors)
        .flat()
        .join(", ");
      errorMessage += ": " + errorDetails;
    }
    handleMessages({
      message: errorMessage,
      color: "red",
      icon: "close",
    });
  };

  const editCity = (city: any) => {
    isEditing.value = true;
    selectedCity.value = { ...city };
    cityForm.value = { ...city };
    showCreateModal.value = true;
  };

  const deleteCity = async () => {
    try {
      deleting.value = true;

      if (!selectedCity.value) return;
      await deleteData(`/cities/delete/${selectedCity.value.id}`);
      await fetchCities();
      showDeleteModal.value = false;
    } catch (error) {
      console.error("Error deleting city:", error);
      handleMessages({
        color: "green",
        icon: "close",
        message: "Error al eliminar el crédito",
      });
    } finally {
      deleting.value = false;
    }
  };

  const validateCityForm = () => {
    const errors = [];

    if (!cityForm.value.name?.trim()) {
      errors.push("El nombre de la ciudad es requerido");
    }

    if (!cityForm.value.country_id) {
      errors.push("Debes seleccionar un país");
    }

    return errors;
  };

  const closeModalWithoutValidation = () => {
    showCreateModal.value = false;
    isEditing.value = false;
  };

  const closeModal = () => {
    showCreateModal.value = false;
    isEditing.value = false;
    selectedCity.value = null;
    cityForm.value = {
      name: "",
      country_id: null,
    };
  };

  return {
    cityForm,
    isSaving,
    isEditing,
    confirmDeleteCity,
    selectedCity,
    cityFormData,
    showCreateModal,
    showDeleteModal,
    saveCity,
    fetchCities,
    editCity,
    deleteCity,
    closeModal,
    pagination,
    cities,
    closeModalWithoutValidation,
    getCitiesSelect,
    countries,
    getCountrySelect,
  };
};
