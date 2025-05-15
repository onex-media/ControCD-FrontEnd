import { reactive, ref, Ref, watch, computed } from "vue";
import { useVuelidate } from "@vuelidate/core";
import {
  email,
  minLength,
  required,
  helpers,
  maxLength,
} from "@vuelidate/validators";
import {
  createMemberReq,
  deleteMemberReq,
  getMembersReq,
  updateMemberReq,
  getMembersSelectReq,
  getUserReq,
  toggleMemberStatusReq,
} from "src/services/members.services";
import {
  createMemberPayload,
  DataMembers,
  MemberForm,
  updateMemberPayload,
} from "src/types/members.types";
import { handleMessages } from "src/utils/notify";
import { useQuasar } from "quasar";
import { getData } from "src/services/api.services";

export const defaultDataMembers: any = {
  data: [],
  current_page: 1,
  first_page_url: "",
  from: 0,
  last_page: 1,
  last_page_url: "",
  links: [],
  next_page_url: null,
  path: "",
  per_page: 10,
  prev_page_url: null,
  to: 0,
  total: 0,
};

export const useMembers = () => {
  const isEditing = ref<boolean>(false);
  const currentTab = ref<string>("personal");
  const search = ref("");
  const showCreateModal = ref<boolean>(false);
  const showDeleteModal = ref<boolean>(false);
  const showToggleModal = ref<boolean>(false);
  const selectedMember = ref<any>(null);
  const members = ref<any>([]);
  const dataMembers = ref<DataMembers>(defaultDataMembers);
  const membersOptions = ref<any>([]);
  const routes = ref<any>([]);
  const $q = useQuasar();

  const paginationMembers = reactive<Pagination>({
    sortBy: "desc",
    descending: false,
    page: 1,
    countPage: 1,
    rowsNumber: 1,
    rowsPerPage: 10,
  });

  const memberForm: Ref<MemberForm> = ref({
    name: "",
    email: "",
    identification: null,
    department: "",
    city_id: null,
    address: "",
    password: "",
    role_id: null,
    phone: null,
    routes: [],
  });

  // const memberForm: Ref<MemberForm> = ref({
  //   name: '',
  //   email: '',
  //   identification: null,
  //   department: 'Departamento',
  //   city: '',
  //   address: '',
  //   password: '',
  //   role: 'Cobrador',
  //   phone: null,
  //   routes: []
  // });

  const rules = computed(() => ({
    form: {
      status: {},
      name: { required, minLength: minLength(3) },
      identification: {
        required,
        minLength: minLength(6),
        numeric: helpers.withMessage(
          "Debe ser un número válido",
          (value: any) => /^[0-9]+$/.test(value)
        ),
      },
      role_id: { required },
      department: {},
      address: { required, minLength: minLength(5) },
      email: { required, email },
      phone: {
        required,
        minLength: minLength(10),
        numeric: helpers.withMessage(
          "Debe ser un número válido",
          (value: any) => /^[0-9]+$/.test(value)
        ),
      },
      password: {
        required: computed(() => !isEditing.value),
        maxLength: maxLength(30),
        minLength: minLength(3),
      },
    },
  }));

  const translateValidationMessages = (errors: any) => {
    const requiredFields: any = [];
    const otherErrors: any = [];

    errors.forEach((error: any) => {
      switch (error.$validator) {
        case "required":
          requiredFields.push(error.$propertyPath.split(".").pop());
          break;
        case "minLength":
          otherErrors.push(
            `El campo ${error.$propertyPath
              .split(".")
              .pop()} debe tener al menos ${error.$params.min} caracteres`
          );
          break;
        case "maxLength":
          otherErrors.push(
            `El campo ${error.$propertyPath
              .split(".")
              .pop()} debe tener como máximo ${error.$params.max} caracteres`
          );
          break;
        case "email":
          otherErrors.push("El correo electrónico no es válido");
          break;
        case "numeric":
          otherErrors.push(
            `El campo ${error.$propertyPath
              .split(".")
              .pop()} debe ser un número válido`
          );
          break;
        default:
          otherErrors.push(
            `Error en el campo ${error.$propertyPath.split(".").pop()}`
          );
      }
    });

    const messages = [];
    if (requiredFields.length) {
      messages.push(`Campos requeridos: ${requiredFields.join(", ")}`);
    }
    messages.push(...otherErrors);

    return messages;
  };

  const getErrorMessage = (errors: any, field: string) => {
    const error = errors.find((e: any) => e.$propertyPath.endsWith(field));
    if (!error) return "";

    switch (error.$validator) {
      case "required":
        return "Este campo es requerido";
      case "minLength":
        return `Debe tener al menos ${error.$params.min} caracteres`;
      case "maxLength":
        return `Debe tener como máximo ${error.$params.max} caracteres`;
      case "email":
        return "Introduce un correo válido";
      case "numeric":
        return "Debe ser un número válido";
      default:
        return "Error en el campo";
    }
  };

  const fetchMembers = async () => {
    try {
      const resp = await getMembersReq({
        ...paginationMembers,
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

      dataMembers.value = resp.data.data || defaultDataMembers;

      members.value = dataMembers.value.data.map((member: any) => ({
        identification: member.dni,
        active: false,
        ...member,
      }));
      dataMembers.value.data = members.value;
    } catch (error) {
      console.error("Error in fetchMembers:", error);
      handleMessages({
        message: "An error has occurred!",
        color: "red",
        icon: "close",
      });
    }
  };

  const closeModal = () => {
    const v$ = useVuelidate(rules, { form: memberForm.value });
    v$.value.$reset();
    showCreateModal.value = false;
    isEditing.value = false;
    currentTab.value = "personal";
    memberForm.value = {
      active: true,
      name: "",
      identification: null,
      role_id: null,
      department: "",
      city_id: null,
      address: "",
      email: "",
      phone: null,
      routes: [],
      password: "",
    };
  };

  const closeModalWithoutValidation = () => {
    isEditing.value = false;
    showCreateModal.value = false;
    currentTab.value = "personal";
    memberForm.value = {
      active: true,
      name: "",
      identification: null,
      role_id: null,
      department: "",
      city_id: null,
      address: "",
      email: "",
      phone: null,
      routes: [],
      password: "",
    };
  };

  const createMember = async (payload: createMemberPayload) => {
    const res = await createMemberReq(payload);

    if (res.code === "error") {
      console.log(res);
      return;
    }

    handleMessages({
      message: res.data.message,
      color: "primary",
      icon: "check",
    });
    await fetchMembers();
    closeModal();
    return res.data;
  };

  const getMembers = async () => {
    const resp = await getMembersReq(paginationMembers);
    if (resp.code === "error")
      return handleMessages({
        message: resp.error.message,
        color: "red",
        icon: "close",
      });
  };

  const getMembersSelect = async () => {
    const res = await getMembersSelectReq();

    if (res.code === "error")
      return handleMessages({
        message: res.error.message,
        color: "red",
        icon: "close",
      });
    membersOptions.value = res.data.data;
    return res.data;
  };

  const updateMember = async (
    payload: updateMemberPayload,
    id: string | number
  ) => {
    const res = await updateMemberReq(payload, id);

    if (res.code === "error")
      return handleMessages({
        message: res.error.message,
        color: "red",
        icon: "close",
      });

    handleMessages({
      message: res.data.message,
      color: "primary",
      icon: "check",
    });
    closeModal();
    return res.data.data;
  };

  const deleteMember = async () => {
    try {
      await deleteMemberReq(selectedMember.value.id);
      await fetchMembers();
      handleMessages({
        message: "Usuario borrado con éxito",
        color: "green",
        icon: "check",
      });
      showDeleteModal.value = false;
    } catch (error) {
      console.error("Error deleting member:", error);
      $q.notify({
        type: "negative",
        message: "Error al borrar el miembro",
      });
    }
  };

  const createMemberData = () => {
    return {
      name: memberForm.value.name,
      email: memberForm.value.email,
      dni: Number(memberForm.value.identification),
      city_id: memberForm.value.city_id,
      address: memberForm.value.address,
      password: memberForm.value.password,
      routes: memberForm.value.routes || [],
      role_id: memberForm.value.role_id,
      phone: Number(memberForm.value.phone),
    };
  };

  const confirmToggle = async () => {
    try {
      const status =
        selectedMember.value.status == "active" ? "active" : "inactive";
      await toggleMemberStatusReq(selectedMember.value.id, status);
      await fetchMembers();
      showToggleModal.value = false;
      $q.notify({
        type: "positive",
        message: `Miembro ${
          status === "active" ? "activado" : "desactivado"
        } exitosamente`,
      });
    } catch (error) {
      console.error("Error confirming member toggle:", error);
      $q.notify({
        type: "negative",
        message: "Error al cambiar el estado del miembro",
      });
      selectedMember.value.active = !selectedMember.value.active;
    }
    showToggleModal.value = false;
  };

  const toggleMember = (member: any) => {
    selectedMember.value = member;
    showToggleModal.value = true;
  };

  const cancelToggle = () => {
    if (selectedMember.value) {
      selectedMember.value.active = !selectedMember.value.active;
    }
    showToggleModal.value = false;
  };

  const confirmDeleteMember = (member: any) => {
    selectedMember.value = member;
    showDeleteModal.value = true;
  };

  const saveMember = async () => {
    try {
      const v$ = useVuelidate(rules, { form: memberForm.value });
      const memberData = createMemberData();
      const isValid = await v$.value.$validate();

      if (!isValid) {
        const translatedErrors = translateValidationMessages(v$.value.$errors);
        return handleMessages({
          message: `Parece haber errores en el formulario: ${translatedErrors.join(
            ", "
          )}`,
          color: "red",
          icon: "close",
        });
      }

      if (isEditing.value) {
        if (!memberData.password) delete memberData.password;
        else {
          if (
            memberData.password.length < 3 ||
            memberData.password.length > 30
          ) {
            return handleMessages({
              message: "La contraseña debe tener entre 3 y 30 caracteres.",
              icon: "close",
              color: "red",
            });
          }
        }
        if (memberData?.routes && memberData?.routes.length > 0) {
          memberData.routes = memberData?.routes.map((el: any) => {
            return el?.id || el;
          });
        }
        await updateMember(memberData, selectedMember.value.id);
      } else {
        await createMember(memberData);
      }
    } catch (error) {
      console.error("Error saving member:", error);
      $q.notify({
        type: "negative",
        message: "Error al guardar el miembro",
      });
    }
  };

  const editMember = (member: any) => {
    selectedMember.value = member;
    isEditing.value = true;
    memberForm.value = {
      ...member,
    };
    showCreateModal.value = true;
  };

  const getUser = async (userId: string | number) => {
    try {
      const response = await getUserReq(userId);
      if (response.code === "error") {
        handleMessages({
          message: response.error.message,
          color: "red",
          icon: "close",
        });
        return null;
      }
      return response.data;
    } catch (error) {
      console.error("Error fetching user:", error);
      handleMessages({
        message: "Error fetching user data",
        color: "red",
        icon: "close",
      });
      return null;
    }
  };

  watch(search, () => {
    fetchMembers();
  });

  watch(
    () => dataMembers.value,
    (newVal: any) => {
      paginationMembers.page = newVal.current_page;
      paginationMembers.countPage = newVal.last_page;
      paginationMembers.rowsNumber = newVal.total;
      paginationMembers.rowsPerPage = newVal.per_page;
    },
    { deep: true }
  );

  return {
    search,
    showCreateModal,
    showDeleteModal,
    showToggleModal,
    selectedMember,
    members,
    routes,
    rules,
    memberForm,
    isEditing,
    currentTab,
    dataMembers,
    paginationMembers,
    membersOptions,
    createMember,
    getMembers,
    updateMember,
    deleteMember,
    getMembersSelect,
    closeModal,
    createMemberData,
    closeModalWithoutValidation,
    confirmToggle,
    toggleMember,
    cancelToggle,
    confirmDeleteMember,
    saveMember,
    fetchMembers,
    editMember,
    getErrorMessage,
    getUser,
  };
};
