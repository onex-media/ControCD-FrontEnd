<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Main Content -->
    <main class="py-6">
      <div class="mx-auto max-w-10xl px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-2xl font-semibold">Créditos</h1>
          <div class="flex items-center gap-4">
            <div class="relative">
              <q-input
                outlined
                dense
                v-model="search"
                placeholder="Buscar"
                class="w-[300px]"
                bg-color="white"
              >
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
            </div>
            <q-btn
              color="primary"
              label="Nuevo crédito"
              no-caps
              class="px-4 fixed sm:fixed md:fixed lg:relative bottom-5 sm:bottom-5 lg:bottom-0 w-11/12 sm:w-11/12 md:w-11/12 lg:w-auto"
              @click="showCreateModal = true"
            >
              <img src="/icons/Scales.svg" class="ml-4 svg-white" />
            </q-btn>
          </div>
        </div>

        <!-- Credits Table -->
        <div class="bg-white rounded-lg shadow overflow-hidden">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead>
                <tr class="bg-gray-50">
                  <th scope="col" class="w-16 px-6 py-3 text-left">
                    <span class="sr-only">Estado</span>
                  </th>
                  <th scope="col" class="px-6 py-3 text-left">
                    <div class="flex items-center">
                      <span class="text-sm font-medium text-gray-500"
                        >Cliente</span
                      >
                      <img
                        src="/icons/ArrowsDownUp.svg"
                        class="ml-4"
                        @click="sortBy('client_name')"
                      />
                    </div>
                  </th>
                  <th scope="col" class="px-6 py-3 text-left">
                    <div class="flex items-center">
                      <span class="text-sm font-medium text-gray-500"
                        >Ruta</span
                      >
                      <img
                        src="/icons/ArrowsDownUp.svg"
                        class="ml-4"
                        @click="sortBy('route_name')"
                      />
                    </div>
                  </th>
                  <th scope="col" class="px-6 py-3 text-left">
                    <span class="text-sm font-medium text-gray-500"
                      >Créditos</span
                    >
                  </th>
                  <th scope="col" class="px-6 py-3 text-left">
                    <div class="flex items-center">
                      <span class="text-sm font-medium text-gray-500"
                        >Valor total créditos</span
                      >
                      <img
                        src="/icons/ArrowsDownUp.svg"
                        class="ml-4"
                        @click="sortBy('total_value')"
                      />
                    </div>
                  </th>
                  <th scope="col" class="w-20 px-6 py-3 text-right">
                    <span class="sr-only">Acciones</span>
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr
                  v-for="credit in filteredCredits"
                  :key="credit.id"
                  class="hover:bg-gray-50"
                >
                  <td class="px-6 py-4">
                    <q-toggle
                      v-model="credit.active"
                      color="primary"
                      @update:model-value="toggleCredit(credit)"
                    />
                  </td>
                  <td class="px-6 py-4">
                    <div class="text-sm font-medium text-gray-900">
                      {{ credit.client.name }}
                    </div>
                    <div class="text-sm text-gray-500">
                      {{ credit.client.identification }}
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <div class="text-sm text-gray-900">
                      {{ credit.ruta.name }}
                    </div>
                    <div class="text-sm text-gray-500">
                      {{ credit.ruta.sector }}
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <div class="flex gap-2">
                      <span
                        v-if="credit.credit_counts?.green"
                        class="px-2.5 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-800"
                      >
                        +{{ credit.credit_counts.green }}
                      </span>
                      <span
                        v-if="credit.credit_counts?.blue"
                        class="px-2.5 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-800"
                      >
                        +{{ credit.credit_counts.blue }}
                      </span>
                      <span
                        v-if="credit.credit_counts?.red"
                        class="px-2.5 py-0.5 text-xs font-medium rounded-full bg-red-100 text-red-800"
                      >
                        +{{ credit.credit_counts.red }}
                      </span>
                      <span
                        class="px-2.5 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-800"
                      >
                        +{{ credit.total_value }}
                      </span>
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <div class="text-sm text-gray-900">
                      $ {{ formatPricing(credit.total_value) }}
                    </div>
                  </td>
                  <td class="px-1 py-4 text-right">
                    <div class="flex justify-end items-center">
                      <q-btn
                        flat
                        round
                        dense
                        color="primary"
                        @click="showCreditDetails(credit)"
                      >
                        <img src="/icons/Scales.svg" alt="" />
                      </q-btn>
                      <q-btn flat round dense color="dark" icon="more_horiz">
                        <q-menu>
                          <q-list style="min-width: 100px">
                            <q-item
                              clickable
                              v-close-popup
                              @click="editCredit(credit)"
                            >
                              <img src="/icons/edit.svg" class="mr-4" alt="" />
                              <q-item-section>Editar</q-item-section>
                            </q-item>
                            <q-item
                              clickable
                              v-close-popup
                              @click="confirmDeleteCredit(credit)"
                            >
                              <img
                                src="/icons/trash-2.svg"
                                class="mr-4"
                                alt=""
                              />
                              <q-item-section class="text-negative"
                                >Eliminar</q-item-section
                              >
                            </q-item>
                          </q-list>
                        </q-menu>
                      </q-btn>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div
            class="px-6 py-4 flex items-center justify-between border-t border-gray-200"
          >
            <div
              class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between"
            >
              <div>
                <p class="text-sm text-gray-700">
                  Mostrando
                  <span class="font-medium">{{ paginationStart }}</span> a
                  <span class="font-medium">{{ paginationEnd }}</span> de
                  <span class="font-medium">{{ totalCredits }}</span> resultados
                </p>
              </div>
              <div>
                <nav
                  class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                >
                  <q-pagination
                    v-model="currentPage"
                    :max="totalPages"
                    :max-pages="7"
                    :boundary-numbers="false"
                    :direction-links="true"
                    class="pagination-custom"
                  />
                </nav>
              </div>
            </div>
          </div>
        </div>

        <!-- Create/Edit Credit Modal -->
        <q-dialog v-model="showCreateModal" persistent>
          <q-card class="w-[600px]">
            <q-card-section class="flex justify-between items-center">
              <h3 class="text-lg font-medium">
                {{ isEditing ? "Editar crédito" : "Nuevo crédito" }}
              </h3>
              <q-btn flat round dense icon="close" @click="closeModal" />
            </q-card-section>

            <q-card-section class="q-pt-none">
              <p class="text-sm text-gray-500 mb-6">
                {{
                  isEditing
                    ? `Estás editando el crédito ${selectedCredit?.id}`
                    : "Estás creando un nuevo crédito. Para que este crédito se cree exitosamente, es necesario que rellenes todos los campos obligatorios."
                }}
              </p>

              <div class="space-y-6">
                <!-- Client Selection -->
                <div>
                  <label class="block text-sm font-medium text-gray-700">
                    Cliente <span class="text-red-500">*</span>
                  </label>
                  <q-select
                    v-model="creditForm.client_id"
                    :options="clientOptions"
                    option-value="value"
                    option-label="label"
                    outlined
                    dense
                    use-input
                    hide-selected
                    fill-input
                    input-debounce="0"
                    @filter="filterClients"
                    class="mt-1"
                    placeholder="Busca por nombre del cliente o Número de identificación"
                  >
                    <template v-slot:no-option>
                      <q-item>
                        <q-item-section class="text-grey">
                          No se encontraron resultados
                        </q-item-section>
                      </q-item>
                    </template>
                  </q-select>
                  <p class="mt-2 text-sm text-gray-500">
                    Selecciona y designa un cliente para este crédito.
                  </p>
                </div>

                <!-- Route Selection -->
                <div
                  class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4"
                >
                  <div>
                    <label class="block text-sm font-medium text-gray-700">
                      Ruta <span class="text-red-500">*</span>
                    </label>
                    <q-select
                      v-model="creditForm.route_id"
                      :options="routeOptions"
                      option-value="value"
                      option-label="label"
                      @update:model-value="handleRouteChange"
                      outlined
                      dense
                      class="mt-1"
                      placeholder="Selecciona una ruta"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700">
                      Rango de duración <span class="text-red-500">*</span>
                    </label>
                    <q-input
                      v-model="creditForm.date_range"
                      outlined
                      dense
                      mask="date"
                      class="mt-1"
                    >
                      <template v-slot:append>
                        <q-icon name="event" class="cursor-pointer">
                          <q-popup-proxy
                            cover
                            transition-show="scale"
                            transition-hide="scale"
                          >
                            <q-date
                              v-model="dateRange"
                              range
                              mask="YYYY-MM-DD"
                              @update:model-value="updateDateRange"
                            />
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                  </div>
                </div>

                <!-- Credit Values -->
                <div
                  class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4"
                >
                  <div>
                    <label class="block text-sm font-medium text-gray-700">
                      Valor del crédito <span class="text-red-500">*</span>
                    </label>
                    <q-input
                      v-model="creditForm.total_value"
                      type="number"
                      outlined
                      dense
                      class="mt-1"
                      prefix="$"
                      placeholder="Ingrese un valor"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700">
                      Valor cuota fija <span class="text-red-500">*</span>
                    </label>
                    <q-input
                      v-model="creditForm.quota_value"
                      type="number"
                      outlined
                      dense
                      class="mt-1"
                      prefix="$"
                      placeholder="Ingrese un valor"
                    />
                  </div>
                </div>

                <!-- Payment Details -->
                <div
                  class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4"
                >
                  <div>
                    <label class="block text-sm font-medium text-gray-700">
                      Cantidad de cuotas <span class="text-red-500">*</span>
                    </label>
                    <q-input
                      v-model="creditForm.total_quotas"
                      type="number"
                      outlined
                      dense
                      class="mt-1"
                      placeholder="Ingrese una cantidad"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700">
                      Fecha primera cuota <span class="text-red-500">*</span>
                    </label>
                    <q-input
                      v-model="creditForm.first_payment_date"
                      outlined
                      dense
                      mask="date"
                      class="mt-1"
                    >
                      <template v-slot:append>
                        <q-icon name="event" class="cursor-pointer">
                          <q-popup-proxy
                            cover
                            transition-show="scale"
                            transition-hide="scale"
                          >
                            <q-date
                              v-model="creditForm.first_payment_date"
                              mask="YYYY-MM-DD"
                            />
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                  </div>
                </div>

                <!-- Payment Frequency -->
                <div
                  class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4"
                >
                  <div>
                    <label class="block text-sm font-medium text-gray-700">
                      Frecuencia de pago <span class="text-red-500">*</span>
                    </label>
                    <q-select
                      v-model="creditForm.payment_frequency"
                      :options="[
                        { label: 'Diario', value: 'daily' },
                        { label: 'Semanal', value: 'weekly' },
                        { label: 'Quincenal', value: 'biweekly' },
                        { label: 'Mensual', value: 'monthly' },
                      ]"
                      option-value="value"
                      option-label="label"
                      outlined
                      dense
                      class="mt-1"
                      placeholder="Selecciona una opción"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700">
                      Día de cobro
                    </label>
                    <q-select
                      v-model="creditForm.payment_day"
                      :options="paymentDayOptions"
                      outlined
                      dense
                      class="mt-1"
                      placeholder="Selecciona una opción"
                    />
                  </div>
                </div>

                <!-- Simulation Button -->
                <div class="flex justify-end">
                  <q-btn
                    outline
                    no-caps
                    color="primary"
                    icon="calculate"
                    label="Simular crédito"
                    @click="simulateCredit"
                  />
                </div>
              </div>
            </q-card-section>

            <q-card-actions align="right" class="px-6 py-4 border-t">
              <q-btn
                flat
                no-caps
                label="Cancelar"
                color="gray"
                class="mr-3"
                @click="closeModal"
              />
              <q-btn
                no-caps
                :label="isEditing ? 'Guardar' : 'Crear'"
                color="primary"
                @click="saveCredit"
                :loading="saving"
              />
            </q-card-actions>
          </q-card>
        </q-dialog>

        <!-- Delete Confirmation Modal -->
        <q-dialog v-model="showDeleteModal" persistent>
          <q-card>
            <q-card-section class="flex justify-between items-center">
              <h3 class="text-lg font-medium">Confirmar eliminación</h3>
              <q-btn
                flat
                round
                dense
                icon="close"
                @click="showDeleteModal = false"
              />
            </q-card-section>
            <q-card-section>
              <p>
                ¿Estás seguro de que deseas eliminar el crédito
                {{ selectedCredit?.id }}?
              </p>
            </q-card-section>
            <q-card-actions align="right" class="px-6 py-4 border-t">
              <q-btn
                flat
                no-caps
                label="Cancelar"
                color="gray"
                class="mr-3"
                @click="showDeleteModal = false"
              />
              <q-btn
                no-caps
                label="Eliminar"
                color="negative"
                @click="deleteCredit"
                :loading="deleting"
              />
            </q-card-actions>
          </q-card>
        </q-dialog>

        <!-- Bulk Action Success Modal -->
        <q-dialog v-model="showSuccessModal" persistent>
          <q-card>
            <q-card-section class="flex justify-between items-center">
              <h3 class="text-lg font-medium">{{ successMessage.title }}</h3>
              <q-btn
                flat
                round
                dense
                icon="close"
                @click="showSuccessModal = false"
              />
            </q-card-section>
            <q-card-section>
              <p>{{ successMessage.description }}</p>
              <ul v-if="successMessage.details">
                <li
                  v-for="detail in successMessage.details"
                  :key="detail.label"
                >
                  {{ detail.label }}: {{ detail.value }} {{ detail.suffix }}
                </li>
              </ul>
            </q-card-section>
            <q-card-actions align="right" class="px-6 py-4 border-t">
              <q-btn
                flat
                no-caps
                label="Cerrar"
                color="primary"
                @click="showSuccessModal = false"
              />
            </q-card-actions>
          </q-card>
        </q-dialog>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useQuasar } from "quasar";
import axios from "../axios";
import { formatPricing } from '../utils/pricing.ts'

const $q = useQuasar();

// State
const search = ref("");
const currentPage = ref(1);
const itemsPerPage = ref(10);
const totalCredits = ref(0);
const showCreateModal = ref(false);
const showDeleteModal = ref(false);
const showSuccessModal = ref(false);
const isEditing = ref(false);
const selectedCredit = ref(null);
const saving = ref(false);
const deleting = ref(false);
const successMessage = ref({
  title: "",
  description: "",
  details: null,
});

const filters = ref({
  active: true,
  inactive: false,
});

const creditForm = ref({
  client_id: null,
  route_id: null,
  date_range: "",
  total_value: null,
  quota_value: null,
  total_quotas: null,
  first_payment_date: "",
  payment_frequency: null,
  payment_day: null,
  credit_counts: {
    green: 0,
    blue: 0,
    red: 0,
  },
});

const credits = ref([]);
const clients = ref([]);
const routes = ref([]);
const dateRange = ref({ from: "", to: "" });

// Computed
const filteredCredits = computed(() => {
  return credits.value.filter((credit) => {
    const matchesSearch =
      credit.client.name.toLowerCase().includes(search.value.toLowerCase()) ||
      credit.client.identification.includes(search.value);
    const matchesFilter =
      (filters.value.active && credit.active) ||
      (filters.value.inactive && !credit.active);
    return matchesSearch && matchesFilter;
  });
});

const totalPages = computed(() => {
  return Math.ceil(totalCredits.value / itemsPerPage.value);
});

const paginationStart = computed(() => {
  return (currentPage.value - 1) * itemsPerPage.value + 1;
});

const paginationEnd = computed(() => {
  return Math.min(currentPage.value * itemsPerPage.value, totalCredits.value);
});

const clientOptions = computed(() => {
  return clients.value.map((client) => ({
    label: `${client.name} (${client.identification})`,
    value: client.id,
  }));
});

const routeOptions = computed(() => {
  return routes.value.map((route) => ({
    label: `${route.name} - ${route.sector}`,
    value: route.id,
  }));
});

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

// Methods
/* const formatNumber = (value) => {
  return new Intl.NumberFormat("es-CO", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};
 */
const fetchCredits = async () => {
  try {
    const response = await axios.get("/api/credits");
    credits.value = response.data;
    totalCredits.value = response.data.length;
  } catch (error) {
    console.error("Error fetching credits:", error);
    $q.notify({
      type: "negative",
      message: "Error al cargar los créditos",
    });
  }
};

const fetchClients = async () => {
  try {
    const response = await axios.get("/api/clients");
    clients.value = response.data;
  } catch (error) {
    console.error("Error fetching clients:", error);
    $q.notify({
      type: "negative",
      message: "Error al cargar los clientes",
    });
  }
};

const fetchRoutes = async () => {
  try {
    const response = await axios.get("/api/rutas");
    routes.value = response.data;
  } catch (error) {
    console.error("Error fetching routes:", error);
    $q.notify({
      type: "negative",
      message: "Error al cargar las rutas",
    });
  }
};

const filterClients = (val, update) => {
  if (val === "") {
    update(() => {
      clientOptions.value = clients.value.map((client) => ({
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
        (client) =>
          client.name.toLowerCase().includes(needle) ||
          client.identification.includes(needle)
      )
      .map((client) => ({
        label: `${client.name} (${client.identification})`,
        value: client.id,
      }));
  });
};

const closeModal = () => {
  showCreateModal.value = false;
  isEditing.value = false;
  selectedCredit.value = null;
  creditForm.value = {
    client_id: null,
    route_id: null,
    date_range: "",
    total_value: null,
    quota_value: null,
    total_quotas: null,
    first_payment_date: "",
    payment_frequency: null,
    payment_day: null,
    credit_counts: {
      green: 0,
      blue: 0,
      red: 0,
    },
  };
  dateRange.value = { from: "", to: "" };
};

const editCredit = (credit) => {
  selectedCredit.value = credit;
  isEditing.value = true;
  creditForm.value = {
    client_id: {
      label: `${credit.client.name} (${credit.client.identification})`,
      value: credit.client.id,
    },
    route_id: {
      label: `${credit.ruta.name} - ${credit.ruta.sector}`,
      value: credit.ruta.id,
    },
    date_range: credit.date_range,
    total_value: credit.total_value,
    quota_value: credit.quota_value,
    total_quotas: credit.total_quotas,
    first_payment_date: credit.first_payment_date,
    payment_frequency: {
      label: credit.payment_frequency,
      value: credit.payment_frequency,
    },
    payment_day: credit.payment_day,
    credit_counts: credit.credit_counts,
    date_range: `${credit.start_date} to ${credit.end_date}`,
  };
  dateRange.value = {
    from: credit.start_date,
    to: credit.end_date,
  };
  showCreateModal.value = true;
};

const saveCredit = async () => {
  try {
    const errors = validateCreditForm();
    if (errors.length > 0) {
      $q.notify({
        type: "negative",
        message: "Por favor, corrija los siguientes errores:",
        caption: errors.join(", "),
      });
      return;
    }

    saving.value = true;
    const creditData = {
      client_id: creditForm.value.client_id.value,
      route_id: creditForm.value.route_id.value,
      total_value: parseFloat(creditForm.value.total_value),
      quota_value: parseFloat(creditForm.value.quota_value),
      total_quotas: parseInt(creditForm.value.total_quotas),
      first_payment_date: creditForm.value.first_payment_date
        .split("/")
        .reverse()
        .join("-"),
      payment_frequency: creditForm.value.payment_frequency.value,
      payment_day: creditForm.value.payment_day,
      credit_counts: creditForm.value.credit_counts,
      start_date: dateRange.value.from,
      end_date: dateRange.value.to,
    };

    console.log("Datos del crédito a enviar:", creditData);

    let response;
    if (isEditing.value) {
      response = await axios.put(
        `/api/credits/${selectedCredit.value.id}`,
        creditData
      );
    } else {
      response = await axios.post("/api/credits", creditData);
    }

    console.log("Respuesta del servidor:", response.data);

    await fetchCredits();
    $q.notify({
      type: "positive",
      message: `Crédito ${
        isEditing.value ? "actualizado" : "creado"
      } exitosamente`,
    });
    closeModal();
  } catch (error) {
    console.error("Error al guardar el crédito:", error.response?.data);
    let errorMessage = "Error al guardar el crédito";
    if (error.response?.data?.errors) {
      const errorDetails = Object.values(error.response.data.errors)
        .flat()
        .join(", ");
      errorMessage += ": " + errorDetails;
    }
    $q.notify({
      type: "negative",
      message: errorMessage,
    });
  } finally {
    saving.value = false;
  }
};

const validateCreditForm = () => {
  const errors = [];
  if (!creditForm.value.client_id || !creditForm.value.client_id.value)
    errors.push("El cliente es requerido");
  if (!creditForm.value.route_id || !creditForm.value.route_id.value)
    errors.push("La ruta es requerida");
  if (
    !creditForm.value.total_value ||
    parseFloat(creditForm.value.total_value) <= 0
  )
    errors.push("El valor total debe ser mayor que 0");
  if (
    !creditForm.value.quota_value ||
    parseFloat(creditForm.value.quota_value) <= 0
  )
    errors.push("El valor de la cuota debe ser mayor que 0");
  if (
    !creditForm.value.total_quotas ||
    parseInt(creditForm.value.total_quotas) < 1
  )
    errors.push("El número de cuotas debe ser al menos 1");
  if (!dateRange.value.from) errors.push("La fecha de inicio es requerida");
  if (!dateRange.value.to) errors.push("La fecha de fin es requerida");
  if (!creditForm.value.first_payment_date)
    errors.push("La fecha del primer pago es requerida");
  if (
    !creditForm.value.payment_frequency ||
    !creditForm.value.payment_frequency.value
  )
    errors.push("La frecuencia de pago es requerida");
  return errors;
};

const confirmDeleteCredit = (credit) => {
  selectedCredit.value = credit;
  showDeleteModal.value = true;
};

const deleteCredit = async () => {
  try {
    deleting.value = true;
    await axios.delete(`/api/credits/${selectedCredit.value.id}`);
    await fetchCredits();
    $q.notify({
      type: "positive",
      message: "Crédito eliminado exitosamente",
    });
    showDeleteModal.value = false;
  } catch (error) {
    console.error("Error deleting credit:", error);
    $q.notify({
      type: "negative",
      message: "Error al eliminar el crédito",
    });
  } finally {
    deleting.value = false;
  }
};

const toggleCredit = async (credit) => {
  try {
    await axios.put(`/api/credits/${credit.id}`, {
      active: credit.active,
    });
    $q.notify({
      type: "positive",
      message: `Crédito ${
        credit.active ? "activado" : "desactivado"
      } exitosamente`,
    });
  } catch (error) {
    console.error("Error toggling credit:", error);
    credit.active = !credit.active;
    $q.notify({
      type: "negative",
      message: "Error al cambiar el estado del crédito",
    });
  }
};

const simulateCredit = () => {
  // Implement credit simulation logic
  $q.notify({
    type: "info",
    message: "Simulación de crédito en desarrollo",
  });
};

const showCreditDetails = (credit) => {
  // Implement credit details view
  $q.notify({
    type: "info",
    message: "Vista detallada en desarrollo",
  });
};

const cancelNewCredits = async () => {
  try {
    const response = await axios.post("/api/credits/cancel-new");
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
    $q.notify({
      type: "negative",
      message: "Error al anular créditos",
    });
  }
};

const deactivateClientsWithoutPayments = async () => {
  try {
    const response = await axios.post(
      "/api/credits/deactivate-without-payments"
    );
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
    $q.notify({
      type: "negative",
      message: "Error al desactivar clientes",
    });
  }
};

const reactivateInactiveClients = async () => {
  try {
    const response = await axios.post("/api/credits/reactivate-inactive");
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
    $q.notify({
      type: "negative",
      message: "Error al reactivar clientes",
    });
  }
};

const deleteInactiveClients = async () => {
  try {
    const response = await axios.post("/api/credits/delete-inactive");
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
    $q.notify({
      type: "negative",
      message: "Error al eliminar clientes",
    });
  }
};

const updateDateRange = (val) => {
  dateRange.value = val;
  creditForm.value.date_range = `${val.from} to ${val.to}`;
};

const handleRouteChange = () => {
  // Add your route change handling logic here
};

onMounted(() => {
  fetchCredits();
  fetchClients();
  fetchRoutes();
});
</script>

<style scoped>
.pagination-custom {
  .q-btn {
    padding: 8px 12px;
    font-size: 14px;
    min-height: unset;
    height: unset;
  }
}

:deep(.q-field) {
  margin-bottom: 0;
}

:deep(.q-field--outlined .q-field__control) {
  border-radius: 0.375rem;
}

:deep(.q-field--outlined .q-field__control:hover) {
  border-color: #d1d5db;
}

:deep(.q-field--focused .q-field__control) {
  border-color: #3b82f6;
}

:deep(.q-btn) {
  border-radius: 0.375rem;
}

:deep(.q-dialog__inner--minimized > div) {
  max-width: 600px;
}
</style>
