import { updateClientReq } from './../services/client.services';
import { ClientGetResponse, CreateClientPayload } from "src/types/clients.types";
import { computed, reactive, Ref, ref } from "vue";
import {
    email,
    minLength,
    required,
    helpers,
    maxLength,
} from "@vuelidate/validators";
import { Notify } from 'quasar';
import axios from "src/axios";
import { handleMessages } from "src/utils/notify";
import { createClientReq, getClientReq } from "src/services/client.services";
import { getData } from 'src/services/api.services';

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


    const paginationClients = reactive<Pagination>({
        sortBy: "desc",
        descending: false,
        page: 1,
        countPage: 1,
        rowsNumber: 1,
        rowsPerPage: 50,
    });

    const clientFormData: Ref<CreateClientPayload> = ref({
        name: "",
        dni: "",
        address: "",
        geolocation: {
            latitude: 0,
            longitude: 0,
        },
        phone: "",
        profilePhoto: [] as File[],
        galleryPhotos: [] as File[],
        email: "",
        guarantorId: null,
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
                /^[0-9]+$/.test(value)
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
                numeric: helpers.withMessage("Debe ser un número válido", (value: any) =>
                    /^[0-9]+$/.test(value)
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
        { id: 1, name: "John Doe", address: "123 Main St", email: "john@example.com", phone: "1234567890" },
        { id: 2, name: "Jane Smith", address: "456 Elm St", email: "jane@example.com", phone: "0987654321" },
        { id: 3, name: "Alice Johnson", address: "789 Oak St", email: "alice@example.com", phone: "1122334455" },
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
                    const newGuarantor = { ...guarantor, id: guaranters.value.length + 1 };
                    guaranters.value.push(newGuarantor);
                    Notify.create({
                        type: 'positive',
                        message: 'Fiador creado con éxito',
                    });
                    resolve(newGuarantor);
                }, 1000);
            });
        } catch (error) {
            Notify.create({
                type: 'negative',
                message: 'Error al crear el fiador',
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
        }
        try {
            const response: any = await getData(payload);
            console.log('response: ', response);
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

    const createClientFormData = () => {
        const clientData = new FormData();
        clientData.append('name', clientFormData.value.name);
        clientData.append('dni', clientFormData.value.dni || '');
        clientData.append('address', clientFormData.value.address);
        clientData.append('geolocation[latitude]', clientFormData.value.geolocation.latitude.toString());
        clientData.append('geolocation[longitude]', clientFormData.value.geolocation.longitude.toString());
        clientData.append('phone', clientFormData.value.phone);
        if (clientFormData.value.email) {
            clientData.append('email', clientFormData.value.email);
        }

        clientFormData.value.profilePhoto.forEach((file: any, index: number) => {
            clientData.append(`images[${index}][file]`, file);
            clientData.append(`images[${index}][type]`, 'profile');
        });

        clientFormData.value.galleryPhotos.forEach((file, index) => {
            clientData.append(`images[${index + clientFormData.value.profilePhoto.length}][file]`, file);
            clientData.append(`images[${index + clientFormData.value.profilePhoto.length}][type]`, 'gallery');
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
                message: `Cliente ${isEditing.value ? "actualizado" : "creado"} exitosamente`,
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

    const editClient = (client: any) => {
        selectedClient.value = client;
        isEditing.value = true;
        clientFormData.value = { ...client };
        if (client.images) {
            clientFormData.value.profilePhoto = client.images
                .filter((img: any) => img.type === 'profile')
                .map((img: any) => img.path);
            clientFormData.value.galleryPhotos = client.images
                .filter((img: any) => img.type === 'gallery')
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
