import { handleMessages } from "src/utils/notify";
import { computed, onMounted, reactive, ref, watch } from "vue";
import { createClientReq, getClientReq } from "src/services/client.services";
import {
  deleteData,
  getData,
  postData,
  putData,
} from "../services/api.services";
import axios from "@/boot/axios";

interface CountryForm {
  name: string | null;

}

const pagination = reactive<Pagination>({
  sortBy: "desc",
  descending: false,
  page: 1,
  countPage: 1,
  rowsNumber: 1,
  rowsPerPage: 50,
});

export function useCountries() {
  const countryForm = ref<CountryForm>({
    name: null,

  });

  const search = ref<string>("");
  const countries = ref<{ id: number; name: string }[]>([]);
  const showCreateModal = ref(false);

  const fetchCountries = async () => {
    try {
      const response = (await getData({ path: "/countries" })) as any;
      console.log("response: ", response);
      countries.value = response;
      console.log("countries.value: ", countries.value);
    } catch (error) {
      console.error("Error fetching routes:", error);
      handleMessages({
        message: "Error al cargar las creditos",
        color: "red",
        icon: "close",
      });
    }
  };

  const filteredCredits = computed(() => {
    return countries.value.filter((country: any) => {
      return country.name.toLowerCase().includes(search.value.toLowerCase());
    });
  });







  const closeModal = () => {
    showCreateModal.value = false;
    countryForm.value.name = null;
   
  };



  /*  const filterClients = (val: any, update: any) => {
    if (val === "") {
      update(() => {
        clientOptions.value = clients.value.map((client: any) => ({
          label: `${client.name} (${client.identification})`,
          value: client.id,
        }));
      });
      return;
    }

    update(() => {
      const needle = val.toLowerCase();
      clientOptions.value = clients.value
        .filter(
          (client: any) =>
            client.name.toLowerCase().includes(needle) ||
            client.identification.includes(needle)
        )
        .map((client: any) => ({
          label: `${client.name} (${client.identification})`,
          value: client.id,
        }));
    });
  };
 */

  const toggleCredit = async (credit: any) => {
    try {
      const data = {
        path: `/api/countries/${credit.id}`,
        payload: {
          active: credit.active,
        },
      };
      await putData(data);
      handleMessages({
        color: "green",
        icon: "close",
        message: `Crédito ${credit.active ? "activado" : "desactivado"
          } exitosamente`,
      });
    } catch (error) {
      console.error("Error toggling credit:", error);
      credit.active = !credit.active;
      handleMessages({
        color: "red",
        icon: "close",
        message: "Error al cambiar el estado del crédito",
      });
    }
  };

  



  


  watch(
    () => countries.value,
    (newVal: any) => {
/*       pagination.page = newVal.current_page;
      pagination.countPage = newVal.last_page;
      pagination.rowsNumber = newVal.total;
      pagination.rowsPerPage = newVal.per_page; */
    },
    { deep: true }
  );


  onMounted(() => {
    fetchCountries();
  });

  return {
    countryForm,
    countries,
    filteredCredits,
    showCreateModal,
    search,
    pagination,
    toggleCredit,
    closeModal,
  };
}
