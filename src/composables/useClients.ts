import {
  getClientTotalReq,
  updateClientReq,
} from "./../services/client.services";
import {
  ClientGetResponse,
  CreateClientPayload,
} from "src/types/clients.types";
import { computed, reactive, Ref, ref } from "vue";
import {
  email,
  minLength,
  required,
  helpers,
  maxLength,
} from "@vuelidate/validators";
import { Notify } from "quasar";
import axios from "src/axios";
import { handleMessages } from "src/utils/notify";
import { createClientReq, getClientReq } from "src/services/client.services";
import { getData } from "src/services/api.services";
import { CreateCreditPayload } from "@/types/credits.types";

export function useClients() {
  const showCreateModal = ref(false);
  const showDeleteModal = ref(false);
  const showToggleModal = ref(false);
  const isEditing = ref(false);
  const selectedClient: Ref<any | null> = ref(null);
  const routeName = ref("");
  const additionalReferences = ref([]);
  const clients = ref<any>({});
  const client = ref<any>({});
  const totalClients = ref(0);
  const user = JSON.parse(localStorage.getItem("user") as string);
  const sellerId = user?.seller.id || null;
  const totalClientsBySeller = ref(0);

  const paginationClients = reactive<Pagination>({
    sortBy: "desc",
    descending: false,
    page: 1,
    countPage: 1,
    rowsNumber: 1,
    rowsPerPage: 50,
  });

  const clientFormData: Ref<CreateClientPayload> = ref<any>({
    name: "",
    dni: "",
    address: "",
    geolocation: {
      latitude: 0,
      longitude: 0,
    },
    phone: "",
    companyName: "",
    companyAdd: "",
    companyAddress: "",
    guarantorName: "",
    guarantorDni: "",
    guarantorAddress: "",
    guarantorPhone: "",
    guarantorEmail: "",
    guarantorAddressCompany: "",
    guarantorPhoneCompany: "",
    profilePhoto: [] as File[],
    galleryPhotos: [] as File[],
    email: "",
    guarantorId: null,
  });

  const creditFormData: Ref<CreateCreditPayload> = ref<any>({
    creditValue: null,
    interestRate: null,
    installmentCount: null,
    paymentFrequency: null,
    excludedDays: [],
    microInsurancePercentage: null,
    microInsuranceAmount: null,
    firstInstallmentDate: null,
    clientId: null,
    galleryPhotos: [] as File[],
  });

  const fiadorFormData: Ref<any> = ref({
    name: "",
    address: "",
    phone: "",
    email: "",
  });

  const fiadorRules = computed(() => ({
    name: { required, minLength: minLength(3) },
    address: { required, minLength: minLength(5) },
    phone: {
      required,
      minLength: minLength(10),
      numeric: helpers.withMessage("Debe ser un número válido", (value: any) =>
        /^[0-9]+$/.test(value),
      ),
    },
    email: { required, email },
  }));

  const rules = computed(() => ({
    form: {
      name: { required, minLength: minLength(3) },
      dni: { required, minLength: minLength(3) },
      address: { required, minLength: minLength(5) },
      geolocation: {
        latitude: { required: true },
        longitude: { required: true },
      },
      phone: {
        required,
        minLength: minLength(10),
        numeric: helpers.withMessage(
          "Debe ser un número válido",
          (value: any) => /^[0-9]+$/.test(value),
        ),
      },
      profilePhoto: { required: false },
      galleryPhotos: { required: false },
      email: { required: false, email },
      guarantorId: { required: true },
    },
    fiadorForm: fiadorRules.value,
  }));

  const guaranters = ref([
    {
      id: 1,
      name: "John Doe",
      address: "123 Main St",
      email: "john@example.com",
      phone: "1234567890",
    },
    {
      id: 2,
      name: "Jane Smith",
      address: "456 Elm St",
      email: "jane@example.com",
      phone: "0987654321",
    },
    {
      id: 3,
      name: "Alice Johnson",
      address: "789 Oak St",
      email: "alice@example.com",
      phone: "1122334455",
    },
  ]);

  const fetchGuaranters = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(guaranters.value);
      }, 1000);
    });
  };

  const saveNewGuarantor = async (guarantor: any) => {
    try {
      return new Promise((resolve) => {
        setTimeout(() => {
          const newGuarantor = {
            ...guarantor,
            id: guaranters.value.length + 1,
          };
          guaranters.value.push(newGuarantor);
          Notify.create({
            type: "positive",
            message: "Fiador creado con éxito",
          });
          resolve(newGuarantor);
        }, 1000);
      });
    } catch (error) {
      Notify.create({
        type: "negative",
        message: "Error al crear el fiador",
      });
      throw error;
    }
  };

  const closeModalWithoutValidation = () => {
    showCreateModal.value = false;
    isEditing.value = false;
  };

  const getClient = async (id: number) => {
    const payload = {
      path: `client/${id}`,
    };
    try {
      const response: any = await getData(payload);
      console.log("response: ", response);
      client.value = response.data;
    } catch (error) {
      console.error("Error fetching clients:", error);
      Notify.create({
        type: "negative",
        message: "Error al cargar los clientes",
      });
    }
  };
  const fetchClients = async () => {
    try {
      const response: any = await getClientReq();
      clients.value = response.data.data;
    } catch (error) {
      console.error("Error fetching clients:", error);
      Notify.create({
        type: "negative",
        message: "Error al cargar los clientes",
      });
    }
  };

  const totalClientsAll = async () => {
    try {
      const response: any = await getClientTotalReq();
      totalClientsBySeller.value = response.data.data;
    } catch (error) {
      console.error("Error fetching clients:", error);
      Notify.create({
        type: "negative",
        message: "Error al cargar los clientes",
      });
    }
  };

  const createClientFormData = () => {
    console.log("clientFormData.value: ", clientFormData.value);
    const clientData = new FormData();

    // Campos básicos del cliente
    clientData.append("name", clientFormData.value.name);
    clientData.append("dni", clientFormData.value.dni || "");
    clientData.append("address", clientFormData.value.address);
    clientData.append(
      "geolocation[latitude]",
      clientFormData.value.geolocation.latitude.toString(),
    );
    clientData.append(
      "geolocation[longitude]",
      clientFormData.value.geolocation.longitude.toString(),
    );
    clientData.append("phone", clientFormData.value.phone);
    clientData.append("company_name", clientFormData.value.companyName || "");

    // Campos opcionales
    if (clientFormData.value.email) {
      clientData.append("email", clientFormData.value.email);
    }

    // Campos del fiador
    if (clientFormData.value.guarantorName) {
      clientData.append("guarantor_name", clientFormData.value.guarantorName);
    }
    if (clientFormData.value.guarantorDni) {
      clientData.append("guarantor_dni", clientFormData.value.guarantorDni);
    }
    if (clientFormData.value.guarantorAddress) {
      clientData.append(
        "guarantor_address",
        clientFormData.value.guarantorAddress || "",
      );
    }
    if (clientFormData.value.guarantorPhone) {
      clientData.append("guarantor_phone", clientFormData.value.guarantorPhone);
    }

    // Campos del crédito
    if (clientFormData.value.creditValue) {
      clientData.append(
        "credit_value",
        clientFormData.value.creditValue.toString(),
      );
    }
    if (clientFormData.value.interestRate) {
      clientData.append(
        "interest_rate",
        clientFormData.value.interestRate.toString(),
      );
    }
    if (clientFormData.value.installmentCount) {
      clientData.append(
        "installment_count",
        clientFormData.value.installmentCount.toString(),
      );
    }
    if (clientFormData.value.paymentFrequency) {
      clientData.append(
        "payment_frequency",
        clientFormData.value.paymentFrequency,
      );
    }
    /*   if (clientFormData.value.excludedDays) {
      clientData.append(
        "excluded_days",
        JSON.stringify(clientFormData.value.excludedDays),
      );
    } */
    if (clientFormData.value.excludedDays) {
      clientFormData.value.excludedDays.forEach((day, index) => {
        clientData.append(`excluded_days[${index}]`, day);
      });
    }
    if (clientFormData.value.microInsurancePercentage) {
      clientData.append(
        "micro_insurance_percentage",
        clientFormData.value.microInsurancePercentage.toString(),
      );
    }
    if (clientFormData.value.microInsuranceAmount) {
      clientData.append(
        "micro_insurance_amount",
        clientFormData.value.microInsuranceAmount.toString(),
      );
    }
    if (clientFormData.value.firstInstallmentDate) {
      clientData.append(
        "first_installment_date",
        clientFormData.value.firstInstallmentDate,
      );
    }

    clientData.append("seller_id", sellerId);

    // Campos de imágenes
    clientFormData.value.profilePhoto.forEach((file: any, index: number) => {
      clientData.append(`images[${index}][file]`, file);
      clientData.append(`images[${index}][type]`, "profile");
    });

    clientFormData.value.galleryPhotos.forEach((file, index) => {
      if (file) {
        clientData.append(
          `images[${index + clientFormData.value.profilePhoto.length}][file]`,
          file,
        );
        clientData.append(
          `images[${index + clientFormData.value.profilePhoto.length}][type]`,
          "gallery",
        );
      }
    });

    return clientData;
  };

  const saveClient = async () => {
    try {
      const clientData = createClientFormData();

      if (isEditing.value) {
        await updateClientReq(selectedClient.value?.id, clientData);
      } else {
        const res = await createClientReq(clientData);
        /*   if (res.code === "error")
          return handleMessages({
            message: res.error.message,
            color: "red",
            icon: "close",
          });

        handleMessages({
          message: res.data.message,
          color: "primary",
          icon: "check",
        }); */
      }
      await fetchClients();
      /*    Notify.create({
        type: "positive",
        message: `Cliente ${isEditing.value ? "actualizado" : "creado"} exitosamente`,
      }); */
      closeModalWithoutValidation();
    } catch (error) {
      console.error("Error saving client:", error);
      Notify.create({
        type: "negative",
        message: "Error al guardar el cliente",
      });
    }
  };

  const editClient = (client: any) => {
    selectedClient.value = client;
    isEditing.value = true;
    clientFormData.value = { ...client };
    if (client.images) {
      clientFormData.value.profilePhoto = client.images
        .filter((img: any) => img.type === "profile")
        .map((img: any) => img.path);
      clientFormData.value.galleryPhotos = client.images
        .filter((img: any) => img.type === "gallery")
        .map((img: any) => img.path);
    }
    showCreateModal.value = true;
  };

  const deleteClient = async () => {
    try {
      await axios.delete(`/api/clients/${selectedClient.value.id}`);
      Notify.create({
        type: "positive",
        message: "Cliente eliminado exitosamente",
      });
      showDeleteModal.value = false;
    } catch (error) {
      console.error("Error deleting client:", error);
      Notify.create({
        type: "negative",
        message: "Error al eliminar el cliente",
      });
    }
  };

  const createCreditFormData = () => {
    console.log("clientFormData.value: ", clientFormData.value);
    const creditData = new FormData();

    if (creditFormData.value.creditValue) {
      creditData.append(
        "credit_value",
        creditFormData.value.creditValue.toString(),
      );
    }
    if (creditFormData.value.interestRate) {
      creditData.append(
        "interest_rate",
        creditFormData.value.interestRate.toString(),
      );
    }
    if (creditFormData.value.installmentCount) {
      creditData.append(
        "installment_count",
        creditFormData.value.installmentCount.toString(),
      );
    }
    if (creditFormData.value.paymentFrequency) {
      creditData.append(
        "payment_frequency",
        creditFormData.value.paymentFrequency,
      );
    }

    if (creditFormData.value.excludedDays) {
      creditFormData.value.excludedDays.forEach((day, index) => {
        creditData.append(`excluded_days[${index}]`, day);
      });
    }
    if (creditFormData.value.microInsurancePercentage) {
      creditData.append(
        "micro_insurance_percentage",
        creditFormData.value.microInsurancePercentage.toString(),
      );
    }
    if (creditFormData.value.microInsuranceAmount) {
      creditData.append(
        "micro_insurance_amount",
        creditFormData.value.microInsuranceAmount.toString(),
      );
    }
    if (creditFormData.value.firstInstallmentDate) {
      creditData.append(
        "first_installment_date",
        creditFormData.value.firstInstallmentDate,
      );
    }

    creditData.append("seller_id", sellerId);

    creditFormData.value.galleryPhotos.forEach((file, index) => {
      if (file) {
        creditData.append(
          `images[${index + creditFormData.value.galleryPhotos.length}][file]`,
          file,
        );
        creditData.append(
          `images[${index + creditFormData.value.galleryPhotos.length}][type]`,
          "gallery",
        );
      }
    });

    return creditData;
  };

  const saveCredit = async () => {
    try {
      const creditData = createCreditFormData();

      if (isEditing.value) {
        await updateClientReq(selectedClient.value?.id, creditData);
      } else {
        const res = await createClientReq(creditData);
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
      }
      await fetchClients();
      Notify.create({
        type: "positive",
        message: `Credito ${isEditing.value ? "actualizado" : "creado"} exitosamente`,
      });
      closeModalWithoutValidation();
    } catch (error) {
      console.error("Error saving client:", error);
      Notify.create({
        type: "negative",
        message: "Error al guardar el cliente",
      });
    }
  };

  return {
    showCreateModal,
    showDeleteModal,
    showToggleModal,
    isEditing,
    selectedClient,
    routeName,
    additionalReferences,
    clientFormData,
    rules,
    fiadorFormData,
    paginationClients,
    guaranters,
    fiadorRules,
    clients,
    client,
    totalClients,
    totalClientsBySeller,
    totalClientsAll,
    editClient,
    getClient,
    closeModalWithoutValidation,
    fetchGuaranters,
    saveNewGuarantor,
    saveClient,
    deleteClient,
    fetchClients,
  };
}
