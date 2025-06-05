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

interface CreditForm {
  client_id: string | null;
  guarantor_id: string | null;
  seller_id: string | null;
  credit_value: number | null;
  number_installments: number | null;
  first_quota_date: string;
  payment_frequency: string | null;
  payment_day: number | null;
  credit_counts: {
    green: number;
    blue: number;
    red: number;
  };
}

const pagination = reactive<Pagination>({
  sortBy: "desc",
  descending: false,
  page: 1,
  countPage: 1,
  rowsNumber: 1,
  rowsPerPage: 50,
});

export function useCredits() {
  const creditForm = ref<CreditForm>({
    client_id: null,
    guarantor_id: null,
    seller_id: null,
    credit_value: null,
    number_installments: null,
    first_quota_date: "",
    payment_frequency: null,
    payment_day: null,
    credit_counts: {
      green: 0,
      blue: 0,
      red: 0,
    },
  });

  const search = ref<string>("");
  const isSaving = ref<boolean>(false);
  const isEditing = ref<boolean>(false);
  const saving = ref(false);
  const deleting = ref(false);
  const selectedCredit = ref<any | null>(null);
  const credits = ref([]);
  const clients = ref<any[]>([]);
  const routes = ref([]);
  const showCreateModal = ref(false);
  const showDeleteModal = ref(false);
  const showSuccessModal = ref(false);
  const filters = ref({
    active: true,
    inactive: false,
  });
  const successMessage = ref({
    title: "",
    description: "",
    details: {},
  });
  const dateRange = ref<{
    from: string;
    to: string;
  }>({ from: "", to: "" });

  const fetchCredits = async () => {
    try {
      const response = (await getData({ path: "/credits/clients" })) as any;
      credits.value = response.data;
    } catch (error) {
      console.error("Error fetching routes:", error);
      handleMessages({
        message: "Error al cargar las creditos",
        color: "red",
        icon: "close",
      });
    }
  };

  const getClientsFn = async () => {
    try {
      const response = await getData<{ data: { data: any[] } }>({
        path: "/clients",
      });
      if (response) {
        clients.value = response.data?.data;
      }
    } catch (error: any) {
      console.error("Error fetching credits:", error);
      handleMessages({
        message: "Error al cargar los créditos",
        color: "red",
        icon: "close",
      });
    }
  };

  const fetchRoutes = async () => {
    try {
      const response = (await getData({ path: "/routes" })) as any;
      routes.value = response.data.data;
    } catch (error) {
      console.error("Error fetching routes:", error);
      handleMessages({
        message: "Error al cargar las rutas",
        color: "red",
        icon: "close",
      });
    }
  };

  const filteredCredits = computed(() => {
    return credits.value.filter((credit: any) => {
      const matchesSearch =
        credit.client.name.toLowerCase().includes(search.value.toLowerCase()) ||
        credit.client.identification.includes(search.value);
      const matchesFilter =
        (filters.value.active && credit.active) ||
        (filters.value.inactive && !credit.active);
      return matchesSearch && matchesFilter;
    });
  });

  const saveCredit = async () => {
    try {
      const errors = validateCreditForm();
      if (errors.length > 0) {
        handleMessages({
          message: "Por favor, corrija los siguientes errores:",
          color: "red",
          icon: "close",
        });
        return;
      }

      isSaving.value = true;

      const creditData = {
        client_id: creditForm.value.client_id,
        guarantor_id: creditForm.value.guarantor_id,
        seller_id: creditForm.value.seller_id,
        credit_value:
          creditForm.value.credit_value !== null
            ? creditForm.value.credit_value
            : 0,
        number_installments:
          creditForm.value.number_installments !== null
            ? creditForm.value.number_installments
            : 0,
        first_quota_date: creditForm.value.first_quota_date
          .split("/")
          .reverse()
          .join("-"),
        payment_frequency: creditForm.value.payment_frequency,
        payment_day: creditForm.value.payment_day,
        credit_counts: creditForm.value.credit_counts,
      };

      let response;
      let data;

      if (isEditing.value) {
        data = {
          path: `/credits/${selectedCredit.value.id}`,
          payload: creditData,
        };
        try {
          response = await putData(data);
          handleMessages({
            color: "green",
            icon: "check",
            message: "Crédito actualizado exitosamente",
          });
          fetchCredits();
          closeModal();
        } catch (error: any) {
          console.error("Error al actualizar el crédito:", error);
          handleErrorResponse(error);
        }
      } else {
        // Creación
        data = {
          path: `credit/create`,
          payload: creditData,
        };
        try {
          response = await postData(data);
          handleMessages({
            color: "green",
            icon: "check",
            message: "Crédito creado exitosamente",
          });
          fetchCredits();
          closeModal();
        } catch (error: any) {
          console.error("Error al crear el crédito:", error);
          handleErrorResponse(error);
        }
      }
    } catch (error: any) {
      console.error("Error general al guardar el crédito:", error);
      handleErrorResponse(error);
    } finally {
      isSaving.value = false;
    }
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

  const validateCreditForm = () => {
    const errors = [];
    if (!creditForm.value.client_id || !creditForm.value.client_id)
      errors.push("El cliente es requerido");
    if (!creditForm.value.seller_id || !creditForm.value.seller_id)
      errors.push("La ruta es requerida");
    if (!creditForm.value.credit_value || creditForm.value.credit_value <= 0)
      errors.push("El valor total debe ser mayor que 0");
    if (
      !creditForm.value.number_installments ||
      creditForm.value.number_installments < 1
    )
      errors.push("El número de cuotas debe ser al menos 1");
    if (!creditForm.value.first_quota_date)
      errors.push("La fecha del primer pago es requerida");
    if (
      !creditForm.value.payment_frequency ||
      !creditForm.value.payment_frequency
    )
      errors.push("La frecuencia de pago es requerida");

    console.log("errors", errors);
    return errors;
  };

  const closeModal = () => {
    showCreateModal.value = false;
    isEditing.value = false;
    selectedCredit.value = null;
    creditForm.value.client_id = null;
    creditForm.value.seller_id = null;
    creditForm.value.credit_value = null;
    creditForm.value.number_installments = null;
    creditForm.value.first_quota_date = "";
    creditForm.value.payment_frequency = null;
    creditForm.value.payment_day = null;
    creditForm.value.credit_counts.green = 0;
    creditForm.value.credit_counts.blue = 0;
    creditForm.value.credit_counts.red = 0;
    dateRange.value = { from: "", to: "" };
  };

  const paymentDayOptions = computed(() => {
    if (creditForm.value.payment_frequency === "daily") return [];
    if (creditForm.value.payment_frequency === "weekly") {
      return [
        { label: "Lunes", value: 1 },
        { label: "Martes", value: 2 },
        { label: "Miércoles", value: 3 },
        { label: "Jueves", value: 4 },
        { label: "Viernes", value: 5 },
        { label: "Sábado", value: 6 },
        { label: "Domingo", value: 7 },
      ];
    }
    if (
      creditForm.value.payment_frequency === "monthly" ||
      creditForm.value.payment_frequency === "biweekly"
    ) {
      return Array.from({ length: 31 }, (_, i) => ({
        label: `Día ${i + 1}`,
        value: i + 1,
      }));
    }
    return [];
  });

  const editCredit = (credit: any) => {
    selectedCredit.value = credit;
    isEditing.value = true;
    creditForm.value = {
      guarantor_id: credit.guarantor_id,
      client_id: credit.client.id,
      seller_id: credit.ruta.id,
      credit_value: credit.credit_value,
      number_installments: credit.number_installments,
      first_quota_date: credit.first_quota_date,
      payment_frequency: credit.payment_frequency,
      payment_day: credit.payment_day,
      credit_counts: credit.credit_counts,
    };
    dateRange.value = {
      from: credit.start_date,
      to: credit.end_date,
    };
    showCreateModal.value = true;
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
  const clientOptions = computed(() => {
    return clients.value.map((client: any) => ({
      label: `${client.name} (${client.dni})`,
      value: client.id,
    }));
  });

  const routeOptions = computed(() => {
    return routes.value.map((route: any) => ({
      label: `${route.name} - ${route.sector}`,
      value: route.id,
    }));
  });



  const confirmDeleteCredit = (credit: any) => {
    selectedCredit.value = credit;
    showDeleteModal.value = true;
  };

  const deleteCredit = async () => {
    try {
      deleting.value = true;

      if (!selectedCredit.value) return;
      await deleteData(`/api/credits/${selectedCredit.value.id}`);
      await fetchCredits();
      handleMessages({
        color: "green",
        icon: "close",
        message: "Crédito eliminado exitosamente",
      });
      showDeleteModal.value = false;
    } catch (error) {
      console.error("Error deleting credit:", error);
      handleMessages({
        color: "green",
        icon: "close",
        message: "Error al eliminar el crédito",
      });
    } finally {
      deleting.value = false;
    }
  };

  const toggleCredit = async (credit: any) => {
    try {
      const data = {
        path: `/api/credits/${credit.id}`,
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

  const cancelNewCredits = async () => {
    try {
      const data = {
        path: `/api/credits/cancel-new`,
        payload: {},
      };
      const response = await postData(data);
      await fetchCredits();
      successMessage.value = {
        title: "Desactivación completa",
        description:
          "Se han anulado los créditos nuevos sin abonos exitosamente.",
        details: [
          {
            label: "Créditos anulados",
            value: response.data.count,
            suffix: "créditos",
          },
        ],
      };
      showSuccessModal.value = true;
    } catch (error) {
      console.error("Error canceling new credits:", error);
      handleMessages({
        color: "red",
        icon: "close",
        message: "Error al anular créditos",
      });
    }
  };

  const deactivateClientsWithoutPayments = async () => {
    try {
      const data = {
        path: `/credits/deactivate-without-payments`,
        payload: {},
      };
      const response = await postData(data);
      await fetchCredits();
      successMessage.value = {
        title: "Desactivación completa",
        description: "Se han desactivado los clientes sin abonos exitosamente.",
        details: [
          {
            label: "Clientes desactivados",
            value: response.data.count,
            suffix: "clientes",
          },
        ],
      };
      showSuccessModal.value = true;
    } catch (error) {
      console.error("Error deactivating clients:", error);
      handleMessages({
        color: "red",
        icon: "close",
        message: "Error al desactivar clientes",
      });
    }
  };

  const reactivateInactiveClients = async () => {
    try {
      const data = {
        path: `credits/reactivate-inactive`,
        payload: {},
      };
      const response = await postData(data);
      await fetchCredits();
      successMessage.value = {
        title: "Reactivación completa",
        description: "Se han reactivado los clientes inactivos exitosamente.",
        details: [
          {
            label: "Clientes reactivados",
            value: response.data.count,
            suffix: "clientes",
          },
        ],
      };
      showSuccessModal.value = true;
    } catch (error) {
      console.error("Error reactivating clients:", error);
      handleMessages({
        color: "red",
        icon: "close",
        message: "Error al reactivar clientes",
      });
    }
  };

  const deleteInactiveClients = async () => {
    try {
      const data = {
        path: `/credits/delete-inactive`,
        payload: {},
      };
      const response = await postData(data);
      await fetchCredits();
      successMessage.value = {
        title: "Eliminación completa",
        description: "Se han eliminado los clientes inactivos exitosamente.",
        details: [
          {
            label: "Clientes eliminados",
            value: response.data.count,
            suffix: "clientes",
          },
        ],
      };
      showSuccessModal.value = true;
    } catch (error) {
      console.error("Error deleting inactive clients:", error);
      handleMessages({
        color: "red",
        icon: "close",
        message: "Error al eliminar clientes",
      });
    }
  };

  watch(
    () => credits.value,
    (newVal: any) => {
      console.log('newVal: ', newVal);
      pagination.page = newVal.current_page;
      pagination.countPage = newVal.last_page;
      pagination.rowsNumber = newVal.total;
      pagination.rowsPerPage = newVal.per_page;
    },
    { deep: true }
  );


  onMounted(() => {
    fetchCredits();
    getClientsFn();
    fetchRoutes();
  });

  return {
    creditForm,
    credits,
    clients,
    filteredCredits,
    showCreateModal,
    clientOptions,
    routeOptions,
    paymentDayOptions,
    saving,
    deleting,
    isSaving,
    isEditing,
    search,
    pagination,
    /* filterClients, */
    editCredit,
    confirmDeleteCredit,
    deleteCredit,
    toggleCredit,
    cancelNewCredits,
    deactivateClientsWithoutPayments,
    reactivateInactiveClients,
    deleteInactiveClients,
    saveCredit,
    closeModal,
  };
}
