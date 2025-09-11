<template>
  <section class="min-h-screen q-py-xl container-app">
    <div class="flex items-center justify-between q-mb-md">
      <q-breadcrumbs class="text-h6 text-grey-8" separator=">">
        <q-breadcrumbs-el
          class="text-grey-8"
          label="Clientes"
          to="/dashboard/clients"
        />
        <q-breadcrumbs-el class="text-primary" :label="client?.name" />
      </q-breadcrumbs>
    </div>
    <div class="box-name flex items-center q-gutter-x-md q-mb-md" v-if="client">
      <q-avatar square size="3.5rem" color="blue">
        <span class="text-white">{{ clientInitials }}</span>
      </q-avatar>
      <div class="flex column">
        <div class="flex items-center">
          <div class="text-h6">{{ client?.name }}</div>
        </div>
        <div class="text-sm text-gray-500">
          <span class="text-caption">Ident:</span> {{ client?.dni }}
        </div>
      </div>
    </div>
    <q-tabs
      v-model="activeTab"
      class="q-mb-md"
      no-caps
      align="justify"
      active-color="primary"
    >
      <q-tab name="debtor" label="Información del deudor" />
      <q-tab name="guarantor" label="Información del fiador" />
      <q-tab name="credits" label="Créditos" />
    </q-tabs>
    <q-tab-panels v-model="activeTab" animated>
      <q-tab-panel name="debtor">
        <div class="q-pa-md">
          <!-- Información del deudor -->
          <div class="row q-col-gutter-lg">
            <div class="col-12 col-sm-6 col-md-4">
              <div class="flex q-gutter-x-sm text-subtitle1">
                <q-avatar size="3.75rem" square color="grey-4" icon="person" />
                <div>
                  <p class="no-margin text-h6">Nombre</p>
                  <p class="text-caption text-grey-8">{{ client?.name }}</p>
                </div>
              </div>
            </div>
            <div class="col-12 col-sm-6 col-md-4">
              <div class="flex q-gutter-x-sm text-subtitle1">
                <q-avatar size="3.75rem" square color="grey-4" icon="badge" />
                <div>
                  <p class="no-margin text-h6">Cédula</p>
                  <p class="text-caption text-grey-8">{{ client?.dni }}</p>
                </div>
              </div>
            </div>
            <div class="col-12 col-sm-6 col-md-4">
              <div class="flex q-gutter-x-sm text-subtitle1">
                <q-avatar
                  size="3.75rem"
                  square
                  color="grey-4"
                  icon="location_city"
                />
                <div>
                  <p class="no-margin text-h6">Ciudad</p>
                  <p class="text-caption text-grey-8" v-if="client?.city_id">
                    {{ client?.city.name }}
                  </p>
                </div>
              </div>
            </div>
            <div class="col-12 col-sm-6 col-md-4">
              <div class="flex q-gutter-x-sm text-subtitle1">
                <q-avatar size="3.75rem" square color="grey-4" icon="home" />
                <div>
                  <p class="no-margin text-h6">Dirección</p>
                  <p class="text-caption text-grey-8">{{ client?.address }}</p>
                </div>
              </div>
            </div>
            <div class="col-12 col-sm-6 col-md-4">
              <div class="flex q-gutter-x-sm text-subtitle1">
                <q-avatar size="3.75rem" square color="grey-4" icon="phone" />
                <div>
                  <p class="no-margin text-h6">Teléfono</p>
                  <p class="text-caption text-grey-8">{{ client?.phone }}</p>
                </div>
              </div>
            </div>
            <div class="col-12 col-sm-6 col-md-4">
              <div class="flex q-gutter-x-sm text-subtitle1">
                <q-avatar size="3.75rem" square color="grey-4" icon="email" />
                <div>
                  <p class="no-margin text-h6">Correo</p>
                  <p class="text-caption text-grey-8">{{ client?.email }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </q-tab-panel>
      <q-tab-panel name="guarantor">
        <div class="q-pa-md">
          <!-- Información del fiador -->
          <div class="row q-col-gutter-lg">
            <div class="col-12 col-sm-6 col-md-4">
              <div class="flex q-gutter-x-sm text-subtitle1">
                <q-avatar size="3.75rem" square color="grey-4" icon="person" />
                <div>
                  <p class="no-margin text-h6">{{ guarantor?.name }}</p>
                  <p class="text-caption text-grey-8">{{ guarantor?.name }}</p>
                </div>
              </div>
            </div>
            <div class="col-12 col-sm-6 col-md-4">
              <div class="flex q-gutter-x-sm text-subtitle1">
                <q-avatar size="3.75rem" square color="grey-4" icon="badge" />
                <div>
                  <p class="no-margin text-h6">Cédula</p>
                  <p class="text-caption text-grey-8">{{ guarantor?.dni }}</p>
                </div>
              </div>
            </div>
            <div class="col-12 col-sm-6 col-md-4">
              <div class="flex q-gutter-x-sm text-subtitle1">
                <q-avatar
                  size="3.75rem"
                  square
                  color="grey-4"
                  icon="location_city"
                />
                <div>
                  <p class="no-margin text-h6">Ciudad</p>
                  <p class="text-caption text-grey-8" v-if="guarantor?.city_id">
                    {{ guarantor?.city.name }}
                  </p>
                </div>
              </div>
            </div>
            <div class="col-12 col-sm-6 col-md-4">
              <div class="flex q-gutter-x-sm text-subtitle1">
                <q-avatar size="3.75rem" square color="grey-4" icon="home" />
                <div>
                  <p class="no-margin text-h6">Dirección</p>
                  <p class="text-caption text-grey-8">
                    {{ guarantor?.address }}
                  </p>
                </div>
              </div>
            </div>
            <div class="col-12 col-sm-6 col-md-4">
              <div class="flex q-gutter-x-sm text-subtitle1">
                <q-avatar size="3.75rem" square color="grey-4" icon="phone" />
                <div>
                  <p class="no-margin text-h6">Teléfono</p>
                  <p class="text-caption text-grey-8">{{ guarantor?.phone }}</p>
                </div>
              </div>
            </div>
            <div class="col-12 col-sm-6 col-md-4">
              <div class="flex q-gutter-x-sm text-subtitle1">
                <q-avatar size="3.75rem" square color="grey-4" icon="email" />
                <div>
                  <p class="no-margin text-h6">Correo</p>
                  <p class="text-caption text-grey-8">{{ guarantor?.email }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </q-tab-panel>
      <q-tab-panel name="credits">
        <div class="q-pa-md">
          <!-- Créditos -->
          <q-table
            flat
            bordered
            table-header-class="bg-grey-1 text-grey-8"
            :rows="credits"
            :columns="creditColumns"
            row-key="id"
          >
            <template v-slot:body-cell-period="props">
              <q-td :props="props">
                {{ formatPeriod(props.row.installments) }}
              </q-td>
            </template>

            <template v-slot:body-cell-installments="props">
              <q-td :props="props">
                <td :props="props">
                  <div class="text-subtitle1">
                    {{ props.row.installments.length }} Cuotas
                  </div>
                  <div class="text-caption">
                    {{ props.row.installments[0]?.quota_amount }}
                  </div>
                </td>
              </q-td>
            </template>
            <template v-slot:body-cell-frequency="props">
              <q-td :props="props">
                <q-badge
                  size="md"
                  color="grey-4"
                  text-color="grey-8"
                  :label="props.row.payment_frequency"
                >
                  <q-icon
                    class="q-ml-sm"
                    name="calendar_today"
                    color="grey-8"
                  />
                </q-badge>
              </q-td>
            </template>
            <template v-slot:body-cell-actions="props">
              <q-td :props="props">
                <q-btn
                  flat
                  label="Ver cuotas"
                  @click="showInstallments(props.row.installments)"
                />
              </q-td>
            </template>
          </q-table>
        </div>
      </q-tab-panel>
    </q-tab-panels>
    <q-dialog v-model="installmentsModal">
      <q-card style="width: 100%; max-width: 600px">
        <q-card-section>
          <div class="text-h6">Cuotas</div>
        </q-card-section>
        <q-card-section style="max-height: 400px; overflow-y: auto">
          <q-table
            flat
            bordered
            table-header-class="bg-grey-1 text-grey-8"
            :rows="selectedInstallments"
            :columns="installmentColumns"
            row-key="id"
            hide-pagination
          >
            <template v-slot:body-cell-quota_number="props">
              <q-td :props="props">
                <q-avatar size="1.5rem" color="primary">
                  <span class="text-white"> {{ props.row.quota_number }}</span>
                </q-avatar>
              </q-td>
            </template>
            <template v-slot:body-cell-due_date="props">
              <q-td :props="props">
                {{ props.row.due_date }}
              </q-td>
            </template>
            <template v-slot:body-cell-quota_amount="props">
              <q-td :props="props">
                {{ props.row.quota_amount }}
              </q-td>
            </template>
            <template v-slot:body-cell-status="props">
              <q-td :props="props">
                {{ props.row.status }}
              </q-td>
            </template>
          </q-table>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cerrar" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </section>
</template>

<script lang="ts" setup>
import { QTableProps } from "quasar";
import { useClients } from "src/composables/useClients";
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const { getClient, client } = useClients();
const guarantor = ref<any | null>(null);
const credits = ref<any[]>([]);
const activeTab = ref("debtor");
const installmentsModal = ref(false);
const selectedInstallments = ref<any[]>([]);

const clientInitials = computed(() => {
  if (!client.value?.name) return "";
  return client.value.name
    .split(" ")
    .map((n: any) => n[0])
    .join("")
    .toUpperCase();
});

const showInstallments = (installments: any[]) => {
  selectedInstallments.value = installments;
  installmentsModal.value = true;
};

const creditColumns: QTableProps["columns"] = [
  { name: "id", label: "Número de crédito", align: "center", field: "id" },
  { name: "status", label: "Estado", align: "left", field: "status" },
  { name: "period", label: "Desde - Hasta", align: "left", field: "period" },
  {
    name: "total_amount",
    label: "Valor de crédito",
    align: "left",
    field: "total_amount",
  },
  {
    name: "installments",
    label: "Número de cuotas / Valor de cuota",
    align: "left",
    field: "installments",
  },
  {
    name: "frequency",
    label: "Frecuencia de pago",
    align: "left",
    field: "frequency",
  },
  { name: "actions", label: "Acciones", align: "center", field: "actions" },
];

const installmentColumns: QTableProps["columns"] = [
  {
    name: "quota_number",
    label: "N°",
    align: "center",
    field: "quota_number",
  },
  {
    name: "due_date",
    label: "Fecha de vencimiento",
    align: "left",
    field: "due_date",
  },
  {
    name: "quota_amount",
    label: "Valor de cuota",
    align: "left",
    field: "quota_amount",
  },
  { name: "status", label: "Estado", align: "left", field: "status" },
];

const formatPeriod = (installments: any[]) => {
  if (!installments.length) return "";
  const dates = installments
    .map((i) => new Date(i.due_date))
    .sort((a: any, b: any) => a - b);
  return `${dates[0].toLocaleDateString("es-CO")} - ${dates[
    dates.length - 1
  ].toLocaleDateString("es-CO")}`;
};

onMounted(async () => {
  const clientId: any = route.params.id;
  if (clientId) {
    await getClient(clientId);
    if (client.value) {
      guarantor.value = client.value.credits[0]?.guarantor || null;
      credits.value = client.value.credits || [];
    }
  }
});
</script>
