<template>
  <q-dialog
    :model-value="visible"
    persistent
    @update:model-value="$emit('update:visible', $event)"
  >
    <q-card
      class="q-pa-md settlement-card"
      style="min-width: 600px; max-width: 700px"
    >
      <q-card-section>
        <div class="flex justify-between items-center">
          <h3
            class="text-h6 text-weight-bold"
            style="
              font-size: 24px;
              line-height: 125%;
              color: #000;
              font-weight: 500;
            "
          >
            Nueva liquidación
          </h3>
          <q-btn flat round dense icon="close" @click="close" />
        </div>
        <div
          class="text-body1"
          style="
            font-size: 16px;
            font-weight: 400;
            line-height: 150%;
            color: #424242;
            margin-top: 8px;
          "
        >
          Estás a punto de iniciar una nueva liquidación. Al hacerlo, se
          calcularán los abonos realizados por los clientes dentro de la ruta
          seleccionada y se generará un reporte con los resultados.
        </div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <div class="q-mt-lg">
          <div class="row q-col-gutter-md">
            <div class="col-8">
              <div class="text-weight-medium">Fecha de inicio</div>
              <q-input
                v-model="settlementDate"
                outlined
                dense
                readonly
                disable
                placeholder="Fecha fija inicial"
              >
                <template v-slot:prepend>
                  <q-icon name="event" color="grey" />
                </template>
              </q-input>
            </div>
            <div class="col-8">
              <div class="text-weight-medium">Fecha de cierre</div>
              <q-input
                v-model="settlementDate"
                outlined
                dense
                mask="date"
                :rules="['date']"
                placeholder="Seleccionar fecha"
              >
                <template v-slot:prepend>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy
                      cover
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-date v-model="settlementDate" minimal>
                        <div class="row items-center justify-end">
                          <q-btn
                            v-close-popup
                            label="Cerrar"
                            color="primary"
                            flat
                          />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>

            <div class="col-4">
              <div class="text-weight-medium">Hora</div>
              <q-input
                v-model="settlementTime"
                outlined
                dense
                mask="time"
                :rules="['time']"
                placeholder="Seleccionar hora"
              >
                <template v-slot:prepend>
                  <q-icon name="access_time" class="cursor-pointer">
                    <q-popup-proxy
                      cover
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-time v-model="settlementTime" minimal format24h>
                        <div class="row items-center justify-end">
                          <q-btn
                            v-close-popup
                            label="Cerrar"
                            color="primary"
                            flat
                          />
                        </div>
                      </q-time>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
          </div>
        </div>

        <q-separator class="q-my-sm" />

        <div class="q-mt-lg bg-grey-3 q-pa-md rounded-borders">
          <div class="flex justify-between align-center">
            <div>
              <div class="text-weight-medium">
                <span>Vendedor: </span>{{ vendor.user.name }}
              </div>
              <div class="text-grey-7 q-mb-md">
                <span>Documento: </span>{{ vendor.user.dni }}
              </div>
            </div>
            <div></div>
          </div>
          <q-separator class="q-mb-md" />
          <div class="row q-col-gutter-md q-mb-md">
            <div class="col-6 flex flex-between q-col-gutter-md">
              <q-icon name="account_balance" color="tertiary" size="sm" />
              <div class="text-caption">Caja inicial</div>
              <div>$ 000.000</div>
            </div>
            <div class="col-6 flex flex-between q-col-gutter-md">
              <q-icon name="payments" color="tertiary" size="sm" />
              <div class="text-caption">Caja final</div>
              <div>$ 000.000</div>
            </div>
          </div>
          <div class="row q-col-gutter-md q-mb-md">
            <div class="col-6 flex flex-between q-col-gutter-md">
              <q-icon name="account_balance" color="tertiary" size="sm" />
              <div class="text-caption">Egresos</div>
              <div>$ 000.000</div>
            </div>
            <div class="col-6 flex flex-between q-col-gutter-md">
              <q-icon name="payments" color="tertiary" size="sm" />
              <div class="text-caption">Pagos</div>
              <div>$ 000.000</div>
            </div>
          </div>
          <div class="row q-col-gutter-md q-mb-md">
            <div class="col-6 flex flex-between q-col-gutter-md">
              <q-icon name="credit_card" color="tertiary" size="sm" />
              <div class="text-caption">Ventas</div>
              <div>$ 000.000</div>
            </div>
            <div class="col-6 flex flex-between q-col-gutter-md">
              <q-icon name="autorenew" color="tertiary" size="sm" />
              <div class="text-caption">Ingresos</div>
              <div>$ 000.000</div>
            </div>
          </div>

          <div class="row q-col-gutter-md q-mb-md">
            <div class="col-6 flex flex-between q-col-gutter-md">
              <q-icon name="credit_card" color="tertiary" size="sm" />
              <div class="text-caption">Cartera inicial</div>
              <div>$ 000.000</div>
            </div>
            <div class="col-6 flex flex-between q-col-gutter-md">
              <q-icon name="trending_down" color="tertiary" size="sm" />
              <div class="text-caption">Cartera final</div>
              <div>$ 000.000</div>
            </div>
          </div>
          <div class="q-mt-lg flex justify-end align-center">
            <div class="text-bold text-primary q-mr-sm">
              Valor real a entregar
            </div>
            <div class="text-primary">$ 000.000.000,00</div>
          </div>
        </div>
      </q-card-section>

      <q-card-actions align="around" class="q-px-md q-pb-md">
        <div class="col-12 col-md-2 offset-md-8">
          <q-btn
            unelevated
            type="submit"
            label="Liquidar ruta"
            color="primary"
            no-caps
            class="full-width"
            @click="showSuccessAlert"
          />
        </div>
        <div class="col-12 col-md-2">
          <q-btn
            flat
            label="Cancelar"
            color="grey-7"
            class="full-width"
            no-caps
            @click="close"
          />
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
  <q-dialog v-model="successAlert" persistent>
    <q-card
      style="
        min-width: 580px;
        padding: 20px;
        border-radius: 0;
        position: relative;
      "
    >
      <div class="flex justify-end">
        <q-btn flat round dense icon="close" @click="close" class="close-btn" />
      </div>

      <q-card-section class="row items-start">
        <div class="col-auto">
          <img src="/icons/check-circle.png" class="check-circle-img" />
        </div>

        <div class="col">
          <h3 class="text-h6 text-weight-bold q-ml-md">
            ¡Felicidades! Liquidación exitosa
          </h3>
          <p class="q-ml-md q-mt-sm">
            La nueva liquidación para la ruta <strong>Ruta Principal</strong> se
            ha ejecutado correctamente. Se han cargado los datos de
            <strong>25 clientes</strong> sin ningún inconveniente.
          </p>
        </div>
      </q-card-section>

      <q-card-actions align="right" class="q-pb-md">
        <q-btn
          class="bg-[#3FBC4C] q-py-md text-white border-none border-radius-none"
          label="Continuar"
          no-caps
          style="min-width: 150px"
          @click="closeSuccessAlert"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue";

const props = defineProps({
  visible: {
    type: Boolean,
    required: true,
  },
  vendor: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["close", "generate", "update:visible"]);
const settlementDate = ref(new Date().toISOString().slice(0, 10));
const settlementTime = ref(
  new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }),
);

const successAlert = ref(false);

const showSuccessAlert = () => {
  emit("update:visible", false);

  setTimeout(() => {
    successAlert.value = true;
  }, 300);
};

const closeSuccessAlert = () => {
  successAlert.value = false;
  emit("close");
};

const close = () => {
  successAlert.value = false;
  emit("close");
};
</script>

<style scoped>
.text-caption {
  font-size: 0.8rem;
  color: #666;
  margin-bottom: 4px;
}

.settlement-card {
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}

.q-separator {
  border-color: rgba(0, 0, 0, 0.1);
}

@media (max-width: 600px) {
  .settlement-card {
    min-width: 90vw !important;
    max-width: 95vw !important;
  }
}
.q-dialog__inner--minimized > div {
  max-width: 580px;
}

.q-card {
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  border-radius: 12px;
}

.text-h6 {
  font-size: 1.5rem;
  font-weight: 700;
}

p {
  font-size: 1rem;
  line-height: 1.5;
  color: #424242;
}
.check-circle-img {
  max-width: 45px;
  height: auto;
  object-fit: contain;
}
</style>
