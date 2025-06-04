import { handleMessages } from "src/utils/notify";
import { computed, onMounted, reactive, ref, watch } from "vue";
import { getData } from "../services/api.services";

interface Country {
  id: number;
  name: string;
}

interface Pagination {
  sortBy: string;
  descending: boolean;
  page: number;
  lastPage: number;
  countPage: number;
  total?: number;
  rowsNumber: number;
  rowsPerPage: number;
}

interface CountriesResponse {
  data: Country[];
  pagination: {
    total: number;
    current_page: number;
    per_page: number;
    last_page: number;
  };
}

export function useCountries() {
  const search = ref<string>("");
  const loading = ref(false);
  const countries = ref<Country[]>([]);
  const showCreateModal = ref(false);
  const countryForm = ref({ name: null });
  
  const pagination = reactive<Pagination>({
    sortBy: "name",
    descending: false,
    page: 1,
    countPage: 1,
    rowsNumber: 0,
    rowsPerPage: 10,
  });

  const getAllCountries = async () => {
    try {
      loading.value = true;
      const payload = {
        page: pagination.page,
        perPage: pagination.rowsPerPage,
        search: search.value,
        sortBy: pagination.sortBy,
        last_page: pagination.countPage,
        descending: pagination.descending ? "desc" : "asc",
      };

      const response = await getData<CountriesResponse>({
        path: "/countries/all",
        payload,
      });

      if (response.data) {
        countries.value = response.data;
        updatePagination(response.pagination);
      }
    } catch (error) {
      showError("Error al cargar países");
    } finally {
      loading.value = false;
    }
  };

  const updatePagination = (meta: CountriesResponse["pagination"]) => {
    pagination.rowsNumber = meta.total;
    pagination.page = meta.current_page;
    pagination.rowsPerPage = meta.per_page;
    pagination.countPage = meta.last_page;
  };

  const showError = (message: string) => {
    handleMessages({ message, color: "red", icon: "close" });
  };

  const handleSearch = () => {
    pagination.page = 1;
    getAllCountries();
  };

  const handlePagination = (newPagination: Pagination) => {
    pagination.page = newPagination.page;
    pagination.rowsPerPage = newPagination.rowsPerPage;
    pagination.sortBy = newPagination.sortBy;
    pagination.descending = newPagination.descending;
    getAllCountries();
  };

  const closeModal = () => {
    showCreateModal.value = false;
    countryForm.value.name = null;
  };

  watch(search, handleSearch);
  watch(
    () => pagination,
    () => getAllCountries(),
    { deep: true }
  );

  onMounted(getAllCountries);

  return {
    countryForm,
    countries,
    search,
    pagination,
    loading,
    showCreateModal,
    closeModal,
    handlePagination,
    getAllCountries
  };
}