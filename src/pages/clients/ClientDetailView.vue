<template>
  <q-page padding>
    <CreditsFormModal
      v-if="showCreateModal"
      v-model:modelValue="showCreateModal"
      :isEditing="isEditing"
      @save-credit="saveCreditHandler"
      :creditFormData="creditFormData"
    />
    <div class="q-pa-md">
      <div class="row items-center q-mb-lg q-gutter-sm">
        <q-breadcrumbs separator=">" class="text-h6">
          <q-breadcrumbs-el
            active-color="primary"
            label="Clientes"
            @click="goBack"
          />
          <q-breadcrumbs-el :label="client?.name" />
        </q-breadcrumbs>
      </div>

      <div class="vendor-info-card q-mb-lg">
        <div class="vendor-details row items-center">
          <div class="initials-box">
            <img
              v-if="client?.images"
              :src="`${pathImage}${client.images[0].path}`"
              :alt="client.name"
              class="client-photo"
            />
            <span v-else>{{ clientInitials }}</span>
          </div>

          <div class="column q-ml-md">
            <div class="row q-gutter-xs items-center">
              <div>
                <q-toggle
                  size="lg"
                  dense
                  true-value="ACTIVE"
                  false-value="INACTIVE"
                  :model-value="'ACTIVE'"
                  icon="circle"
                  color="primary"
                />
              </div>
              <div class="text-h6">{{ client.name }}</div>
            </div>

            <div class="vendor-location text-caption text-grey-7">
              {{ client.seller?.city?.name || "N/A" }}
            </div>
          </div>
        </div>
      </div>

      <q-tabs
        v-model="activeTab"
        dense
        class="no-border"
        indicator-color="primary"
        align="justify"
        narrow-indicator
      >
        <q-tab name="debtor" label="Info. Deudor" class="text-capitalize" />
        <q-tab name="guarantor" label="Info. Fiador" class="text-capitalize" />
        <q-tab name="credit" label="Créditos" class="text-capitalize" />
      </q-tabs>

      <q-tab-panels v-model="activeTab" animated class="no-border">
        <q-tab-panel name="debtor">
          <div class="row q-col-gutter-y-lg">
            <div class="col-12 col-sm-6">
              <div class="row rounded-borders">
                <div class="col-2 flex justify-center items-start q-mr-md">
                  <div
                    class="bg-grey-2 q-pa-sm flex justify-center items-center"
                    style="width: 48px; height: 48px"
                  >
                    <q-img src="/icons/TextT.png" width="32px" height="32px" />
                  </div>
                </div>
                <div class="col">
                  <div class="text-bold text-grey-9">Nombre</div>
                  <div class="text-grey-7">{{ client.name || "N/A" }}</div>
                </div>
              </div>
            </div>
            <div class="col-12 col-sm-6">
              <div class="row rounded-borders">
                <div class="col-2 flex justify-center items-start q-mr-md">
                  <div
                    class="bg-grey-2 q-pa-sm flex justify-center items-center"
                    style="width: 48px; height: 48px"
                  >
                    <q-img
                      src="/icons/IdentificationBadge.png"
                      width="32px"
                      height="32px"
                    />
                  </div>
                </div>
                <div class="col">
                  <div class="text-bold text-grey-9">Documento</div>
                  <div class="text-grey-7">{{ client.dni || "N/A" }}</div>
                </div>
              </div>
            </div>
            <div class="col-12 col-sm-6">
              <div class="row rounded-borders">
                <div class="col-2 flex justify-center items-start q-mr-md">
                  <div
                    class="bg-grey-2 q-pa-sm flex justify-center items-center"
                    style="width: 48px; height: 48px"
                  >
                    <q-img src="/icons/map.png" width="32px" height="32px" />
                  </div>
                </div>
                <div class="col">
                  <div class="text-bold text-grey-9">Ciudad</div>
                  <div class="text-grey-7">
                    {{ client.seller?.city?.name || "N/A" }}
                  </div>
                </div>
              </div>
            </div>
            <div class="col-12 col-sm-6">
              <div class="row rounded-borders">
                <div class="col-2 flex justify-center items-start q-mr-md">
                  <div
                    class="bg-grey-2 q-pa-sm flex justify-center items-center"
                    style="width: 48px; height: 48px"
                  >
                    <q-img
                      src="/icons/Signpost.png"
                      width="32px"
                      height="32px"
                    />
                  </div>
                </div>
                <div class="col">
                  <div class="text-bold text-grey-9">Dirección</div>
                  <div
                    class="text-grey-7"
                    style="overflow: hidden; text-overflow: ellipsis"
                  >
                    {{ client.address || "N/A" }}
                  </div>
                </div>
              </div>
            </div>

            <div class="col-12 col-sm-6">
              <div class="row rounded-borders">
                <div class="col-2 flex justify-center items-start q-mr-md">
                  <div
                    class="bg-grey-2 q-pa-sm flex justify-center items-center"
                    style="width: 48px; height: 48px"
                  >
                    <q-img
                      src="/icons/DeviceMobileCamera.png"
                      width="32px"
                      height="32px"
                    />
                  </div>
                </div>
                <div class="col">
                  <div class="text-bold text-grey-9">Teléfono</div>
                  <div class="text-grey-7">{{ client.phone || "N/A" }}</div>
                </div>
              </div>
            </div>
            <div class="col-12 col-sm-6">
              <div class="row rounded-borders">
                <div class="col-2 flex justify-center items-start q-mr-md">
                  <div
                    class="bg-grey-2 q-pa-sm flex justify-center items-center"
                    style="width: 48px; height: 48px"
                  >
                    <q-img src="/icons/mail.png" width="32px" height="32px" />
                  </div>
                </div>
                <div class="col">
                  <div class="text-bold text-grey-9">Correo</div>
                  <div class="text-grey-7">{{ client.email || "N/A" }}</div>
                </div>
              </div>
            </div>
            <div class="col-12 col-sm-6">
              <div class="row rounded-borders">
                <div class="col-2 flex justify-center items-start q-mr-md">
                  <div
                    class="bg-grey-2 q-pa-sm flex justify-center items-center"
                    style="width: 48px; height: 48px"
                  >
                    <q-img
                      src="/icons/SuitcaseSimple.png"
                      width="32px"
                      height="32px"
                    />
                  </div>
                </div>
                <div class="col">
                  <div class="text-bold text-grey-9">Empresa</div>
                  <div class="text-grey-7">
                    {{ client.company_name || "N/A" }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </q-tab-panel>

        <q-tab-panel name="guarantor">
          <div class="row q-col-gutter-y-lg">
            <div class="col-12 col-sm-6">
              <div class="row rounded-borders">
                <div class="col-2 flex justify-center items-start q-mr-md">
                  <div
                    class="bg-grey-2 q-pa-sm flex justify-center items-center"
                    style="width: 48px; height: 48px"
                  >
                    <q-img src="/icons/TextT.png" width="32px" height="32px" />
                  </div>
                </div>
                <div class="col">
                  <div class="text-bold text-grey-9">Nombre</div>
                  <div class="text-grey-7">
                    {{ guarantorInfo.name || "N/A" }}
                  </div>
                </div>
              </div>
            </div>
            <div class="col-12 col-sm-6">
              <div class="row rounded-borders">
                <div class="col-2 flex justify-center items-start q-mr-md">
                  <div
                    class="bg-grey-2 q-pa-sm flex justify-center items-center"
                    style="width: 48px; height: 48px"
                  >
                    <q-img
                      src="/icons/IdentificationBadge.png"
                      width="32px"
                      height="32px"
                    />
                  </div>
                </div>
                <div class="col">
                  <div class="text-bold text-grey-9">Documento</div>
                  <div class="text-grey-7">
                    {{ guarantorInfo.dni || "N/A" }}
                  </div>
                </div>
              </div>
            </div>
            <div class="col-12 col-sm-6">
              <div class="row rounded-borders">
                <div class="col-2 flex justify-center items-start q-mr-md">
                  <div
                    class="bg-grey-2 q-pa-sm flex justify-center items-center"
                    style="width: 48px; height: 48px"
                  >
                    <q-img src="/icons/map.png" width="32px" height="32px" />
                  </div>
                </div>
                <div class="col">
                  <div class="text-bold text-grey-9">Ciudad</div>
                  <div class="text-grey-7">
                    {{ guarantorInfo.city || "N/A" }}
                  </div>
                </div>
              </div>
            </div>
            <div class="col-12 col-sm-6">
              <div class="row rounded-borders">
                <div class="col-2 flex justify-center items-start q-mr-md">
                  <div
                    class="bg-grey-2 q-pa-sm flex justify-center items-center"
                    style="width: 48px; height: 48px"
                  >
                    <q-img
                      src="/icons/Signpost.png"
                      width="32px"
                      height="32px"
                    />
                  </div>
                </div>
                <div class="col">
                  <div class="text-bold text-grey-9">Dirección</div>
                  <div class="text-grey-7">
                    {{ guarantorInfo.address || "N/A" }}
                  </div>
                </div>
              </div>
            </div>
            <div class="col-12 col-sm-6">
              <div class="row rounded-borders">
                <div class="col-2 flex justify-center items-start q-mr-md">
                  <div
                    class="bg-grey-2 q-pa-sm flex justify-center items-center"
                    style="width: 48px; height: 48px"
                  >
                    <q-img
                      src="/icons/DeviceMobileCamera.png"
                      width="32px"
                      height="32px"
                    />
                  </div>
                </div>
                <div class="col">
                  <div class="text-bold text-grey-9">Teléfono</div>
                  <div class="text-grey-7">
                    {{ guarantorInfo.phone || "N/A" }}
                  </div>
                </div>
              </div>
            </div>
            <div class="col-12 col-sm-6">
              <div class="row rounded-borders">
                <div class="col-2 flex justify-center items-start q-mr-md">
                  <div
                    class="bg-grey-2 q-pa-sm flex justify-center items-center"
                    style="width: 48px; height: 48px"
                  >
                    <q-img src="/icons/mail.png" width="32px" height="32px" />
                  </div>
                </div>
                <div class="col">
                  <div class="text-bold text-grey-9">Correo</div>
                  <div class="text-grey-7">
                    {{ guarantorInfo.email || "N/A" }}
                  </div>
                </div>
              </div>
            </div>
            <div class="col-12 col-sm-6">
              <div class="row rounded-borders">
                <div class="col-2 flex justify-center items-start q-mr-md">
                  <div
                    class="bg-grey-2 q-pa-sm flex justify-center items-center"
                    style="width: 48px; height: 48px"
                  >
                    <q-img
                      src="/icons/SuitcaseSimple.png"
                      width="32px"
                      height="32px"
                    />
                  </div>
                </div>
                <div class="col">
                  <div class="text-bold text-grey-9">Empresa</div>
                  <div class="text-grey-7">
                    {{ guarantorInfo.company || "N/A" }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </q-tab-panel>
        <q-tab-panel name="credit">
          <div class="rounded-table-container">
            <q-table
              class="custom-credit-table"
              flat
              table-header-class="control-table-header"
              :rows="formattedCredits"
              :columns="columnsMobile"
              row-key="id"
              hide-pagination
              no-data-label="No hay créditos disponibles"
            >
              <template #body-cell-client="props">
                <td
                  style="padding-left: 0 important; padding-right: 0 important"
                  :props="props"
                >
                  <div class="column">
                    <div class="row items-center no-wrap">
                      <q-btn
                        flat
                        dense
                        round
                        :icon="
                          expandedRow === props.row.id
                            ? 'keyboard_arrow_down'
                            : 'keyboard_arrow_right'
                        "
                        :color="
                          expandedRow === props.row.id ? 'primary' : undefined
                        "
                        @click="toggleExpand(props.row.id)"
                        :class="{ 'rotate-60': expandedRow === props.row.id }"
                        class="self-start q-mr-md"
                      />

                      <div
                        class="row items-center no-wrap flex-grow cursor-pointer"
                        @click="viewCreditDetail(props.row)"
                      >
                        <div class="col q-mr-md text-no-wrap">
                          <div
                            class="text-sm text-gray-900 text-ellipsis overflow-hidden"
                          >
                            {{ formatCurrency(props.row.value) }}
                          </div>
                          <div class="text-xs text-gray-500">
                            Valor del crédito
                          </div>
                        </div>
                      </div>

                      <div class="col text-no-wrap text-end" @click.stop>
                        <div
                          class="q-px-sm q-py-xs rounded-borders"
                          :style="getStatusStyle(props.row.status)"
                        >
                          <span
                            :style="{ color: getStatusColor(props.row.status) }"
                          >
                            {{ getStatusText(props.row.status) }}
                          </span>
                        </div>

                        <q-btn
                          flat
                          dense
                          round
                          icon="more_vert"
                          class="q-ml-sm"
                          @click.stop="openMenu(props.row.id)"
                        >
                          <q-menu
                            v-model="menuStates[props.row.id]"
                            anchor="bottom right"
                            self="top right"
                            auto-close
                          >
                            <q-list dense style="min-width: 150px">
                              <q-item
                                clickable
                                v-close-popup
                                @click="editCredit(props.row)"
                              >
                                <q-item-section>Editar</q-item-section>
                              </q-item>
                              <q-item
                                clickable
                                v-close-popup
                                @click="deleteCredit(props.row)"
                              >
                                <q-item-section>Eliminar</q-item-section>
                              </q-item>
                            </q-list>
                          </q-menu>
                        </q-btn>
                      </div>
                    </div>

                    <q-slide-transition>
                      <div
                        v-show="expandedRow === props.row.id"
                        class="q-pt-sm"
                      >
                        <div class="bg-grey-2 q-pa-md column">
                          <div class="row q-mb-sm">
                            <div class="text-gray-500 col-3">No. Crédito</div>
                            <div class="col-9 text-end text-wrap">
                              {{ props.row.id }}
                            </div>
                          </div>
                          <div class="row q-mb-sm">
                            <div class="text-gray-500 col-3 flex items-center">
                              Fecha (Desde / Hasta)
                            </div>
                            <div class="col-9 text-end">
                              <div class="column">
                                <span class="text-gray-900">
                                  {{ props.row.dueDate || "N/A" }}
                                </span>
                                <span class="text-gray-500">
                                  {{ props.row.startDate || "N/A" }}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div class="row q-mb-md">
                            <div class="text-gray-500 col">
                              Valor del crédito
                            </div>
                            <div class="col text-gray-900 text-bold text-end">
                              {{ formatCurrency(props.row.value) }}
                            </div>
                          </div>
                          <div class="row q-mb-md">
                            <div class="text-gray-500 col">Cuotas</div>
                            <div class="col text-gray-500 text-bold text-end">
                              {{ props.row.installments || "N/A" }}
                            </div>
                          </div>
                          <div class="row q-mb-md">
                            <div class="text-gray-500 col">
                              Frecuencia de pago
                            </div>
                            <div class="col text-gray-500 text-bold text-end">
                              {{ props.row.frequency || "N/A" }}
                            </div>
                          </div>
                        </div>
                      </div>
                    </q-slide-transition>
                  </div>
                </td>
              </template>
            </q-table>
          </div>
          <div class="flex justify-end items-center q-mt-md">
            <q-pagination
              v-model="page"
              color="grey-9"
              active-color="primary"
              :max="maxPages"
              :max-pages="8"
              size="md"
              gutter="10px"
              direction-links
              icon-first="keyboard_double_arrow_left"
              icon-last="keyboard_double_arrow_right"
              icon-prev="chevron_left"
              icon-next="chevron_right"
            />
          </div>
        </q-tab-panel>
      </q-tab-panels>
      <q-page-sticky
        v-if="activeTab === 'credit'"
        position="bottom-right"
        :offset="[18, 18]"
      >
        <q-btn
          unelevated
          color="primary"
          label="Nuevo crédito"
          no-caps
          @click="showCreateModal = true"
        >
          <img src="/icons/Wallet.svg" class="ml-4 svg-white" alt="" />
        </q-btn>
      </q-page-sticky>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import CreditsFormModal from "src/pages/clients/components/CreditsFormModal.vue";
import { useClients } from "src/composables/useClients";
import { useCredits } from "src/composables/useCredit";
import { pathImage } from "src/boot/axios";

const route = useRoute();
const router = useRouter();
const { getClient, client } = useClients();
const activeTab = ref("credit");
const page = ref(1);
const maxPages = 1;

const expandedRow = ref(null);
const menuStates = reactive({});

const {
  showDeleteModal,
  isEditing,
  selectedClient,
  clientFormData,
  fiadorFormData,
  paginationClients,
  totalClients,
  clients,
  closeModalWithoutValidation,
  saveClient,
  editClient,
  deleteClient: deleteClientFunc,
  fetchClients,
} = useClients();

const { saveC, creditFormData, showCreateModal } = useCredits();

const saveCreditHandler = async () => {
  console.log("saveCreditHandler");
  await saveC(
    client.value.id,
    client.value.seller_id,
    client.value.guarantor_id,
  );
};

const guarantorInfo = computed(() => {
  if (client.value?.guarantors?.length > 0) {
    return client.value.guarantors[0];
  }
  return {};
});

const formattedCredits = computed(() => {
  if (!client.value?.credits) return [];

  return client.value.credits.map((credit) => ({
    id: credit.id,
    value: parseFloat(credit.credit_value),
    pendingValue: parseFloat(credit.remaining_amount),
    startDate: credit.first_quota_date,
    dueDate: credit.end_date,
    status: credit.status,
    installments: credit.number_installments,
    frequency: credit.payment_frequency,
    number: `${credit.id}`,
  }));
});

const getStatusColor = (status) => {
  switch (status) {
    case "Vigente":
      return "#21BA45";
    case "Inactivo":
      return "#C10015";
    case "Pendiente":
      return "#F2C037";
    case "Aprobado":
      return "#1976D2";
    case "Rechazado":
      return "#9E9E9E";
    case "Vencido":
      return "#C10015";
    default:
      return "#31CCEC";
  }
};

const getStatusStyle = (status) => {
  const color = getStatusColor(status);
  return {
    backgroundColor: `${color}10`,
    border: `1px solid ${color}`,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    height: "24px",
    borderRadius: "50px",
    fontSize: "0.75rem",
    padding: "0 10px",
  };
};

const getStatusText = (status) => {
  switch (status) {
    case "Vigente":
      return "Activo";
    case "Inactivo":
      return "Inactivo";
    case "Pendiente":
      return "Pendiente";
    case "Aprobado":
      return "Aprobado";
    case "Rechazado":
      return "Rechazado";
    case "Vencido":
      return "Vencido";
    default:
      return status;
  }
};

const toggleExpand = (id) => {
  expandedRow.value = expandedRow.value === id ? null : id;
};

const openMenu = (id) => {
  menuStates[id] = !menuStates[id];
};

const viewCreditDetail = (credit) => {
  console.log("Ver detalle del crédito:", credit);
};

const editCredit = (credit) => {
  console.log("Editar crédito:", credit);
};

const deleteCredit = (credit) => {
  console.log("Eliminar crédito:", credit);
};

const formatCurrency = (value) => {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(value);
};

const goBack = () => {
  router.go(-1);
};

const clientInitials = computed(() => {
  if (!client.value?.name) return "";
  return client.value.name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
});

const columnsMobile = [
  { name: "client", label: "Créditos", field: "id", align: "left" },
];

onMounted(async () => {
  const clientId = route.params.id;
  if (clientId) {
    await getClient(clientId);
  }
});
</script>

<style scoped>
.q-tab-panel {
  padding: 24px 16px;
}

@media (max-width: 600px) {
  .col-sm-6 {
    flex: 0 0 100%;
    max-width: 100%;
  }
}
.no-border {
  border: none;
  box-shadow: none;
}
.vendor-info-card {
  display: flex;
  flex-direction: column;
}

.vendor-details {
  display: flex;
  align-items: center;
}

.initials-box {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  background-color: #2b69e8;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 2rem;
  overflow: hidden;
}

.client-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.vendor-name {
  font-size: 1.1rem;
  display: block;
  color: #666;
}

.vendor-location {
  margin-top: 4px;
  color: #888;
}
.custom-credit-table th,
.custom-credit-table td {
  padding-left: 0 !important;
  padding-right: 0 !important;
  padding-bottom: 0 !important;
}

.custom-credit-table .q-td,
.custom-credit-table .q-th {
  padding-left: 0 !important;
  padding-right: 0 !important;
  padding-bottom: 0 !important;
}
.rounded-table-container {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
}
.q-btn__wrapper {
  padding: 0 16px 0 8px;
}
</style>
