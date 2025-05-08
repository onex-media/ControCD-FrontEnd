import { postData, putData, getData } from "./../services/api.services";
import { onMounted, ref } from "vue";
import axios from "axios";

interface GuarantorFormData {
  id?: string;
  name: string;
  address: string;
  dni: string;
  phone: string;
  email: string;
  clients_ids?: string[];
}

export function useGuarantors() {
  const showGuarantorModal = ref(false);
  const isEditingGuarantor = ref(false);
  const guarantersOptions = ref([]);

  const guarantorFormData = ref<GuarantorFormData>({
    name: "Juan",
    address: "venezuela",
    dni: "123123",
    phone: "1231231231",
    email: "juan@fiador.com",
    clients_ids: [],
  });

  const fetchGuarantors = async () => {
    try {
      const response: any = await getData({ path: "/guarantors" });
      return response.data;
    } catch (error) {
      console.error("Error fetching guarantors:", error);
    }
  };
  const fetchGuarantorsSelect = async () => {
    try {
      const response: any = await getData({ path: "/guarantors/select" });
      guarantersOptions.value = response.data;
    } catch (error) {
      console.error("Error fetching guarantors:", error);
    }
  };

  const saveGuarantor = async () => {
    console.log("guarantorFormData.value: ", guarantorFormData.value);

    try {
      if (isEditingGuarantor.value) {
        const payload = {
          path: `/guarantor/update/${guarantorFormData.value?.id}`,
          payload: guarantorFormData.value,
        };
        await putData(payload);
      } else {
        const payload = {
          path: `/guarantor/create`,
          payload: guarantorFormData.value,
        };
        await postData(payload);
      }
      fetchGuarantors();
      fetchGuarantorsSelect();
      showGuarantorModal.value = false;
    } catch (error) {
      console.error("Error saving guarantor:", error);
    }
  };

  const closeGuarantorModalWithoutValidation = () => {
    showGuarantorModal.value = false;
  };

  onMounted(() => {
    fetchGuarantors();
    fetchGuarantorsSelect();
  });

  return {
    guarantersOptions,
    showGuarantorModal,
    isEditingGuarantor,
    guarantorFormData,
    fetchGuarantorsSelect,
    saveGuarantor,
    closeGuarantorModalWithoutValidation,
  };
}
