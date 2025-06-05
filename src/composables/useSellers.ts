import {
  createRouteReq,
  updateRouteReq,
  deleteRouteReq,
  getRoutesReq,
  toggleRouteStatusReq,
} from "src/services/routes.services";
import { Route, updateRoutePayload } from "src/types/routes.type";
import { handleMessages } from "src/utils/notify";
import { ref, reactive, watch } from "vue";
import { useQuasar } from "quasar";
import { getData } from "src/services/api.services";

export const useSellers = () => {
  const dataRoutes = ref<any>();
  const search = ref("");
  const currentTab = ref("details");
  const showCreateModal = ref<boolean>(false);
  const showDeleteModal = ref<boolean>(false);
  const showToggleModal = ref<boolean>(false);
  const selectedRoute = ref<any>(null);
  const isEditing = ref<boolean>(false);
  const $q = useQuasar();
  const vendorClients = ref<any[]>([]);

  const showAssignMembersModal = ref<boolean>(false);

  const routeForm = ref<{
    name: string;
    sector: string;
    members?: any[];
  }>({
    name: "",
    sector: "",
    members: [],
  });

  const vendorForm = ref<{
    name: string;
    dni: string;
    email: string;
    country_id: number | null;
    city_id: number | null;
    profilePhoto: any;
    members: { id: number; name: string }[];
    password?: string;
  }>({
    name: "",
    dni: "",
    email: "",
    country_id: null,
    city_id: null,
    profilePhoto: null,
    members: [],
    password: "",
  });

  const paginationRoutes = reactive<Pagination>({
    sortBy: "desc",
    descending: false,
    page: 1,
    countPage: 1,
    rowsNumber: 1,
    rowsPerPage: 10,
  });

  const vendorClientsPagination = reactive({
    page: 1,
    rowsPerPage: 10,
    rowsNumber: 0,
  });

  const fetchRoutes = async () => {
    try {
      const resp = await getRoutesReq({
        ...paginationRoutes,
        search: search.value,
      });

      if (resp.code === "error") {
        handleMessages({
          message: resp.error.message,
          color: "red",
          icon: "close",
        });
        return;
      }

      dataRoutes.value = resp.data.data;
    } catch (error) {
      console.error("Error fetching routes:", error);
      handleMessages({
        message: "Error al obtener las rutas",
        color: "red",
        icon: "close",
      });
    }
  };

  const getRoutes = async () => {
    const res = await getRoutesReq(paginationRoutes);

    if (res.code === "error")
      return handleMessages({
        message: res.error.message,
        color: "red",
        icon: "close",
      });

    return res.data.data;
  };

  const editRoute = (route: any) => {
    selectedRoute.value = route;
    isEditing.value = true;
    vendorForm.value = {
      name: route.user.name,
      dni: route.user.dni,
      email: route.user.email,
      country_id: route.city.country.id,
      city_id: route.city.id,

      members: route.user_routes.map((member: any) => member.user.id),
      profilePhoto: route.profilePhoto ? [route.profilePhoto] : null,
    };
    showCreateModal.value = true;
  };

  const updateRoute = async (
    payload: updateRoutePayload,
    id: string | number
  ) => {
    try {
      const res: any = await updateRouteReq(payload, id);
      closeModal();
      await fetchRoutes();
      return res.data;
    } catch (error) {
      handleMessages({
        message: "Error al crear el vendedor",
        color: "red",
        icon: "close",
      });
      return null;
    }
  };

  const deleteRoute = async () => {
    const res = await deleteRouteReq(selectedRoute.value.id);

    try {
      await deleteRouteReq(selectedRoute.value.id);
      await fetchRoutes();
      $q.notify({
        type: "positive",
        message: "Ruta eliminada exitosamente",
      });
      showDeleteModal.value = false;
    } catch (error) {
      console.error("Error deleting route:", error);
      $q.notify({
        type: "negative",
        message: "Error al eliminar la ruta",
      });
    }
  };

  const toggleRoute = (member: any) => {
    selectedRoute.value = member;
    showToggleModal.value = true;
  };

  const fetchVendorClients = async (vendorId: number) => {
    try {
      const response = (await getData({ path: "/clients" })) as any;

      vendorClients.value = response.data.data;
      vendorClientsPagination.rowsNumber = response.data.total;
    } catch (error) {
      console.error("Error fetching vendor clients:", error);
      handleMessages({
        message: "Error al obtener clientes del vendedor",
        color: "red",
        icon: "close",
      });
    }
  };

  const confirmToggle = async () => {
    const status =
      selectedRoute.value.status == "ACTIVE" ? "ACTIVE" : "INACTIVE";
    try {
      await toggleRouteStatusReq(selectedRoute.value.id, status);
      await fetchRoutes();
      $q.notify({
        type: "positive",
        message: `Ruta ${
          status === "ACTIVE" ? "activado" : "desactivado"
        } exitosamente`,
      });
    } catch (error) {
      console.error("Error confirming member toggle:", error);
      $q.notify({
        type: "negative",
        message: "Error al cambiar el estado de la ruta",
      });
    }
    showToggleModal.value = false;
  };

  const cancelToggle = () => {
    if (selectedRoute.value) {
      selectedRoute.value.status =
        selectedRoute.value.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    }
    showToggleModal.value = false;
  };

  const closeModal = () => {
    showCreateModal.value = false;
    isEditing.value = false;
    vendorForm.value = {
      email: "",
      name: "",
      dni: "",
      country_id: null,
      city_id: null,
      profilePhoto: null,
      members: [],
    };
  };

  const confirmDeleteRoute = (route: Route) => {
    selectedRoute.value = route;
    showDeleteModal.value = true;
  };

  const createVendorFormData = () => {
    const vendorData = new FormData();
    vendorData.append("name", vendorForm.value.name);
    vendorData.append("dni", vendorForm.value.dni || "");

    if (vendorForm.value.city_id) {
      vendorData.append("city_id", vendorForm.value.city_id.toString());
    }

    if (vendorForm.value.email) {
      vendorData.append("email", vendorForm.value.email);
    }

    if (vendorForm.value.password) {
      vendorData.append("password", vendorForm.value.password);
    }

    if (vendorForm.value.members) {
      const memberIds = vendorForm.value.members
        .map((member) => {
          return typeof member === "object" ? member.id : member;
        })
        .filter((id) => id !== null && id !== undefined);

      vendorData.append("members", JSON.stringify(memberIds));
    }

    if (vendorForm.value.profilePhoto) {
      if (Array.isArray(vendorForm.value.profilePhoto)) {
        vendorForm.value.profilePhoto.forEach((file: any, index: number) => {
          vendorData.append(`images[${index}][file]`, file);
          vendorData.append(`images[${index}][type]`, "profile");
        });
      } else if (typeof vendorForm.value.profilePhoto === "string") {
        vendorData.append("profilePhoto", vendorForm.value.profilePhoto);
      }
    }

    return vendorData;
  };

  const saveRoute = async () => {
    try {
      const vendorData = createVendorFormData();

      if (isEditing.value) {
        await updateRouteReq(vendorData, selectedRoute.value.id);
      } else {
        await createRouteReq(vendorData);
      }

      $q.notify({
        type: "positive",
        message: `Vendedor ${
          isEditing.value ? "actualizado" : "creado"
        } exitosamente`,
      });
      await fetchRoutes();
      closeModal();
    } catch (error: any) {
      console.error("Error en saveRoute:", error);
    }
  };

  const clearForm = (): void => {
    vendorForm.value = {
      name: "",
      dni: "",
      email: "",
      country_id: null,
      city_id: null,
      profilePhoto: null,
      members: [],
    };
  };

  watch(search, () => {
    fetchRoutes();
  });

  watch(
    () => dataRoutes.value,
    (newVal: any) => {
      paginationRoutes.page = newVal.current_page;
      paginationRoutes.countPage = newVal.last_page;
      paginationRoutes.rowsNumber = newVal.total;
      paginationRoutes.rowsPerPage = newVal.per_page;
    },
    { deep: true }
  );

  return {
    search,
    selectedRoute,
    currentTab,
    isEditing,
    paginationRoutes,
    dataRoutes,
    showCreateModal,
    showDeleteModal,
    showToggleModal,
    showAssignMembersModal,
    routeForm,
    vendorForm,
    editRoute,
    toggleRoute,
    confirmToggle,
    cancelToggle,
    closeModal,
    getRoutes,
    fetchRoutes,
    updateRoute,
    deleteRoute,
    confirmDeleteRoute,
    saveRoute,
    clearForm,
    vendorClients,
    vendorClientsPagination,
    fetchVendorClients,
  };
};
