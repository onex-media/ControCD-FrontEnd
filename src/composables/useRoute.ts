import { MemberForm } from "@/types/members.types";
import {
  createRouteReq,
  updateRouteReq,
  deleteRouteReq,
  getRoutesReq,
  toggleRouteStatusReq,
} from "src/services/routes.services";
import {
  createRoutePayload,
  dataRoutes,
  Route,
  updateRoutePayload,
} from "src/types/routes.type";
import { handleMessages } from "src/utils/notify";
import { ref, computed, reactive, watch } from "vue";
import { useQuasar } from "quasar";

export const useRoutes = () => {
  const dataRoutes = ref<any>();
  const search = ref("");
  const currentTab = ref("details");
  const showCreateModal = ref<boolean>(false);
  const showDeleteModal = ref<boolean>(false);
  const showToggleModal = ref<boolean>(false);
  const selectedRoute = ref<any>(null);
  const isEditing = ref<boolean>(false);
  const $q = useQuasar();

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

  const paginationRoutes = reactive<Pagination>({
    sortBy: "desc",
    descending: false,
    page: 1,
    countPage: 1,
    rowsNumber: 1,
    rowsPerPage: 10,
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
  const createRoute = async () => {
    try {
      const res = await createRouteReq(routeForm.value);

      if (res.code === "error") {
        handleMessages({
          message: res.error.message,
          color: "red",
          icon: "close",
        });
        return null;
      }

      closeModal();
      await fetchRoutes();
      return res.data;
    } catch (error) {
      handleMessages({
        message: "Error al crear la ruta",
        color: "red",
        icon: "close",
      });
      return null;
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

  const editRoute = (route: Route) => {
    selectedRoute.value = route;
    isEditing.value = true;
    routeForm.value = {
      name: route.name,
      sector: route.sector,
      members: route.user_routes.map((member) => ({
        id: member.user.id,
        name: member.user.name,
      })),
    };
    showCreateModal.value = true;
  };

  const updateRoute = async (
    payload: updateRoutePayload,
    id: string | number
  ) => {
    const res = await updateRouteReq(payload, id);

    if (res.code === "error")
      return handleMessages({
        message: res.error.message,
        color: "red",
        icon: "close",
      });

    return res.data.data;
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
    routeForm.value = {
      name: "",
      sector: "",
      members: [],
    };
  };

  const confirmDeleteRoute = (route: Route) => {
    selectedRoute.value = route;
    showDeleteModal.value = true;
  };

  const saveRoute = async () => {
    try {
      const routeData = {
        name: routeForm.value.name,
        sector: routeForm.value.sector,
        members: (routeForm.value.members ?? []).map((member) => member.id),
      };

      if (isEditing.value) {
        await updateRoute(routeData, selectedRoute.value.id);
      } else {
        await createRoute();
      }

      await fetchRoutes();
      $q.notify({
        type: "positive",
        message: `Ruta ${
          isEditing.value ? "actualizada" : "creada"
        } exitosamente`,
      });
      closeModal();
    } catch (error: any) {
      console.error("Error saving route:", error);
      $q.notify({
        type: "negative",
        message:
          "Error al guardar la ruta: " +
          (error.response?.data?.error || error.message),
      });
    }
  };

  const clearForm = (): void => {
    routeForm.value = {
      name: "",
      sector: "",
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
    editRoute,
    toggleRoute,
    confirmToggle,
    cancelToggle,
    closeModal,
    createRoute,
    getRoutes,
    fetchRoutes,
    updateRoute,
    deleteRoute,
    confirmDeleteRoute,
    saveRoute,
    clearForm,
  };
};
