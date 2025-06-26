<template>
  <q-dialog
    :model-value="modelValue"
    persistent
    @update:model-value="$emit('update:modelValue', $event)"
    side="right"
    :width="922"
    :breakpoint="0"
    class="credit-drawer"
  >
    <q-card style="width: 922px; max-width: 90vw">
      <div v-if="viewState === 'default'">
        <q-card-section class="q-pa-lg">
          <div class="q-mb-lg sticky-header">
            <div class="row justify-between w-full">
              <div class="flex items-center">
                <div class="text-h5 text-weight-bold q-mr-md">
                  Crédito {{ creditData.id }}
                </div>
                <div
                  class="q-px-sm q-py-xs rounded-borders text-left"
                  :style="getStatusStyle(creditData.status)"
                >
                  <span :style="{ color: getStatusColor(creditData.status) }">
                    {{ getStatusText(creditData.status) }}
                  </span>
                </div>
              </div>

              <q-btn flat round dense icon="close" @click="handleCloseModal" />
            </div>
          </div>

          <div class="row q-mb-lg bg-grey-2 rounded-borders q-pa-md border">
            <div class="col-12">
              <div class="row q-col-gutter-md">
                <div
                  class="col-6 text-subtitle1 q-mb-sm"
                  :class="$q.screen.lt.md && 'column'"
                >
                  <span class="text-weight-medium q-mr-sm">{{
                    client.name
                  }}</span>
                  <span class="text-grey-5">({{ client.dni }})</span>
                </div>
                <div
                  :class="!$q.screen.lt.md && 'text-subtitle1'"
                  class="col-6 q-mb-sm text-right"
                >
                  <span
                    :class="!$q.screen.lt.md && 'text-subtitle1'"
                    class="text-weight-medium text-primary q-mr-sm"
                    >$ Crédito + Utilidad</span
                  >
                </div>
              </div>
              <div class="row q-col-gutter-md q-mb-md">
                <div class="col-12 flex justify-between">
                  <div>Frecuencia de pago</div>
                  <div>
                    <q-chip dense outline color="grey-8" class="frequency-chip">
                      {{ creditData.frequency }}
                      <q-icon name="event" size="16px" class="q-ml-xs" />
                    </q-chip>
                  </div>
                </div>
              </div>

              <div class="row q-col-gutter-md">
                <div
                  class="col-12 col-md-4 flex"
                  :class="$q.screen.lt.md && 'justify-between'"
                >
                  <div class="q-mr-sm">Fecha de inicio</div>
                  <div class="text-caption text-grey-7">
                    {{ formatDate(creditData.startDate) }}
                  </div>
                </div>
                <div
                  class="col-12 col-md-4 flex"
                  :class="$q.screen.lt.md && 'justify-between'"
                >
                  <div class="q-mr-sm">Fecha limite</div>
                  <div class="text-caption text-grey-7">
                    {{ formatDate(creditData.dueDate) }}
                  </div>
                </div>
                <div
                  class="col-12 col-md-4 flex"
                  :class="$q.screen.lt.md && 'justify-between'"
                >
                  <div class="q-mr-sm">Crédito</div>
                  <div class="text-caption text-grey-7">
                    {{ formatCurrency(creditData.value) }}
                  </div>
                </div>

                <div
                  class="col-12 col-md-4 flex"
                  :class="$q.screen.lt.md && 'justify-between'"
                >
                  <div class="q-mr-sm">Utilidad</div>
                  <div class="text-caption text-grey-7">
                    {{ formatCurrency(creditData.utility) }}
                  </div>
                </div>
              </div>
            </div>
            <div class="section-divider q-mb-md q-mt-md"></div>
            <div class="col-12">
              <div class="row q-col-gutter-md">
                <!--    <div
                  class="col-12 col-md-6 flex text-subtitle1 items-center"
                  :class="$q.screen.lt.md && 'justify-between'"
                >
                  <div class="flex items-center">
                    <q-img
                      src="/icons/ClockClockwise.png"
                      width="18px"
                      height="18px"
                      class="q-mr-sm"
                    />
                    <div class="q-mr-sm">Plazo del préstamo</div>
                  </div>
                  <div class="text-grey-7">00 Dias</div>
                </div> -->
                <div
                  class="col-12 col-md-6 flex text-subtitle1 items-center"
                  :class="$q.screen.lt.md && 'justify-between'"
                >
                  <div class="flex items-center">
                    <q-img
                      src="/icons/percent.png"
                      width="18px"
                      height="18px"
                      class="q-mr-sm"
                    />
                    <div class="q-mr-sm">Tasa de interés</div>
                  </div>
                  <div class="text-grey-7">
                    {{ creditData.total_interest }} %
                  </div>
                </div>
              </div>
            </div>
            <div class="section-divider q-mb-md q-mt-md"></div>
            <div class="col-12">
              <div class="row q-col-gutter-md">
                <div
                  class="col-12 col-md-4 flex text-subtitle1 items-center"
                  :class="$q.screen.lt.md && 'justify-between'"
                >
                  <div class="flex items-center">
                    <q-img
                      src="/icons/ShieldCheck.png"
                      width="18px"
                      height="18px"
                      class="q-mr-sm"
                    />
                    <div class="q-mr-sm">Cuotas pagadas</div>
                  </div>
                  <div class="text-grey-7">
                    {{ creditData.paidInstallments }}
                  </div>
                </div>
                <div
                  class="col-12 col-md-4 flex text-subtitle1 items-center"
                  :class="$q.screen.lt.md && 'justify-between'"
                >
                  <div class="flex items-center">
                    <q-img
                      src="/icons/ShieldPlus.png"
                      width="18px"
                      height="18px"
                      class="q-mr-sm"
                    />
                    <div class="q-mr-sm">Cuotas adelantadas</div>
                  </div>
                  <div class="text-grey-7">
                    {{ creditData.advancedInstallments }}
                  </div>
                </div>
                <div
                  class="col-12 col-md-4 flex text-subtitle1 items-center"
                  :class="$q.screen.lt.md && 'justify-between'"
                >
                  <div class="flex items-center">
                    <q-img
                      src="/icons/ShieldSlash.png"
                      width="18px"
                      height="18px"
                      class="q-mr-sm"
                    />
                    <div class="q-mr-sm">Cuotas atrasadas</div>
                  </div>
                  <div class="text-grey-7">
                    {{ creditData.overdueInstallments }}
                  </div>
                </div>

                <div
                  class="col-12 col-md-4 flex text-subtitle1 items-center"
                  :class="$q.screen.lt.md && 'justify-between'"
                >
                  <div class="flex items-center">
                    <q-img
                      src="/icons/ShieldWarning.png"
                      width="18px"
                      height="18px"
                      class="q-mr-sm"
                    />
                    <div class="q-mr-sm">Cuotas pendientes</div>
                  </div>
                  <div class="text-grey-7">
                    {{ creditData.pendingInstallments }}
                  </div>
                </div>
                <div
                  class="col-12 col-md-4 flex text-subtitle1 items-center"
                  :class="$q.screen.lt.md && 'justify-between'"
                >
                  <div class="flex items-center">
                    <q-img
                      src="/icons/Coins.png"
                      width="18px"
                      height="18px"
                      class="q-mr-sm"
                    />
                    <div class="q-mr-sm">Abonos</div>
                  </div>
                  <div class="text-grey-7">{{ creditData.payments }}</div>
                </div>
              </div>
            </div>
          </div>

          <div class="q-mb-lg">
            <div class="text-subtitle1 text-weight-medium q-mb-sm">
              {{ currentMonthName }} {{ currentYear }}
            </div>
            <div class="calendar-container">
              <div class="row justify-between items-center q-mb-md">
                <q-btn
                  flat
                  dense
                  round
                  icon="chevron_left"
                  @click="changeMonth(-1)"
                />
                <div class="text-weight-medium">
                  {{ currentMonthName }} {{ currentYear }}
                </div>
                <q-btn
                  flat
                  dense
                  round
                  icon="chevron_right"
                  @click="changeMonth(1)"
                />
              </div>

              <div class="row week-header">
                <div class="col text-center">Lu</div>
                <div class="col text-center">Ma</div>
                <div class="col text-center">Mi</div>
                <div class="col text-center">Ju</div>
                <div class="col text-center">Vi</div>
                <div class="col text-center">Sá</div>
                <div class="col text-center">Do</div>
              </div>

              <div class="row" v-for="(week, index) in calendar" :key="index">
                <div
                  class="col text-center day"
                  v-for="(day, dayIndex) in week"
                  :key="dayIndex"
                  :class="{
                    'current-day': isCurrentDay(day),
                    'payment-day': isPaymentDay(day),
                    'different-month': !day.isCurrentMonth,
                    'excluded-day': isExcludedDay(day.date),
                  }"
                >
                  <div class="day-number">{{ day.day }}</div>
                  <div v-if="isPaymentDay(day)" class="payment-indicator"></div>
                  <q-tooltip v-if="isPaymentDay(day)">
                    Día de pago - Cuota {{ getInstallmentNumber(day.date) }}
                  </q-tooltip>
                  <q-tooltip v-if="isExcludedDay(day.date)">
                    Día excluido - No aplica para pagos
                  </q-tooltip>
                </div>
              </div>
            </div>
          </div>
        </q-card-section>

        <q-card-actions
          v-if="!$q.screen.lt.md"
          class="q-pa-lg flex justify-between sticky-footer"
        >
          <div
            class="text-primary cursor-pointer flex items-center hover-underline text-weight-medium"
            style="font-size: 1rem"
            @click="viewState = 'history'"
          >
            Ver historial de pagos
            <q-img
              src="/icons/ClockCounterClockwise.png"
              width="18px"
              height="18px"
              class="q-ml-sm"
            />
          </div>
          <div>
            <q-btn
              class="q-mr-md"
              unelevated
              label="Agregar pago"
              color="primary"
              no-caps
              @click="viewState = 'payment'"
            />
            <q-btn
              unelevated
              label="Bloquear"
              color="red-9"
              no-caps
              @click="viewPaymentHistory"
            />
          </div>
        </q-card-actions>
        <q-card-actions
          v-else
          class="q-pa-lg column q-gutter-y-sm sticky-footer"
        >
          <div
            class="text-primary cursor-pointer flex items-center hover-underline text-weight-medium"
            style="font-size: 1rem"
            @click="viewState = 'history'"
          >
            Ver historial de pagos
            <q-img
              src="/icons/ClockCounterClockwise.png"
              width="18px"
              height="18px"
              class="q-ml-sm"
            />
          </div>
          <q-btn
            class="full-width"
            unelevated
            label="Agregar pago"
            color="primary"
            no-caps
            @click="viewState = 'payment'"
          />
          <q-btn
            unelevated
            class="full-width"
            label="Bloquear"
            color="red-9"
            no-caps
            @click="viewPaymentHistory"
          />
        </q-card-actions>
      </div>
      <div v-else-if="viewState === 'payment'">
        <q-card-section class="q-px-lg">
          <div class="row justify-between items-center q-mb-lg sticky-header">
            <q-btn
              flat
              round
              icon="arrow_back"
              @click="viewState = 'default'" 
              class="q-mr-sm"
            />
            <div class="column">
              <div class="text-h5 text-weight-bold">Agregar abono</div>
            </div>
            <!-- <q-btn flat round dense icon="close"  @click="handleCloseModal"  /> -->
          </div>

          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <div
                class="row q-pa-md rounded-xl cursor-pointer shadow-1"
                :class="{ 'border-primary': selectedOption === 'cuota' }"
                @click="
                  selectOption(
                    'cuota',
                    formatCurrency(creditData.installmentValue),
                  )
                "
              >
                <div class="col-6">
                  <div class="text-subtitle1 text-weight-medium q-mb-sm">
                    Valor de la Cuota
                  </div>
                  <div class="text-primary">
                    {{ formatCurrency(creditData.installmentValue) }}
                  </div>
                </div>
                <div class="col-6 flex items-center justify-end">
                  <!--   <div class="flex items-center text-primary text-wrap">
                    Cantidad de cuotas
                  </div> -->
                  <div class="flex items-center">
                    <q-btn
                      round
                      dense
                      flat
                      icon="remove"
                      color="primary"
                      :disable="installmentCount <= 1"
                      @click.stop="removeInstallment"
                    />

                    <q-chip
                      class="font-size-8"
                      color="primary"
                      text-color="white"
                      :label="`${installmentCount} `"
                    />

                    <q-btn
                      round
                      dense
                      flat
                      icon="add"
                      color="primary"
                      @click.stop="addInstallment"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div class="col-12 col-md-6">
              <div
                class="row q-pa-md rounded-xl cursor-pointer shadow-1"
                :class="{ 'border-primary': selectedOption === 'abono' }"
                @click="selectOption('abono')"
              >
                <div class="col-10">
                  <div class="text-subtitle1 text-weight-medium q-mb-sm">
                    Abono
                  </div>
                  <div class="text-primary">
                    Puede ingresar el valor del abono
                  </div>
                </div>
                <div class="col-2 flex items-center justify-end">
                  <div>
                    <q-btn
                      round
                      dense
                      icon="savings"
                      color="primary"
                      class="q-ml-sm"
                      @click.stop="selectOption('abono')"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div class="col-12 col-md-6">
              <div
                class="row q-pa-md rounded-xl cursor-pointer shadow-1"
                :class="{ 'border-primary': selectedOption === 'deuda' }"
                @click="selectOption('deuda', formatCurrency(creditData.value))"
              >
                <div class="col-10">
                  <div class="text-subtitle1 text-weight-medium q-mb-sm">
                    Deuda Total
                  </div>
                  <div class="text-primary">
                    {{ formatCurrency(creditData.value) }}
                  </div>
                </div>
                <div class="col-2 flex items-center justify-end">
                  <q-btn
                    round
                    dense
                    icon="request_quote"
                    color="primary"
                    class="q-ml-sm"
                    @click.stop="
                      selectOption('deuda', formatCurrency(creditData.value))
                    "
                  />
                </div>
              </div>
            </div>

            <div class="col-12 col-md-6">
              <div
                class="row q-pa-md rounded-xl cursor-pointer shadow-1"
                :class="{ 'border-primary': selectedOption === 'no_pago' }"
                @click="selectOption('no_pago')"
              >
                <div class="col-6">
                  <div class="text-subtitle1 text-weight-medium q-mb-sm">
                    No pago
                  </div>
                  <div>$ 0.00</div>
                </div>
                <div class="col-6 flex items-center justify-end">
                  <q-btn
                    flat
                    label="No pago"
                    color="red-9"
                    icon="block"
                    @click.stop="selectOption('no_pago')"
                  />
                </div>
              </div>
            </div>

            <div v-if="selectedOption === 'abono'" class="row q-mb-sm">
              <div class="col-12">
                <div class="text-subtitle1 text-weight-medium">
                  Ingrese el valor del abono
                </div>
                <q-input
                  outlined
                  dense
                  v-model="paymentValue"
                  mask="#.##"
                  fill-mask="0"
                  reverse-fill-mask
                  prefix="$"
                  class="text-h6"
                  :rules="[
                    (val) => val > 0 || 'El abono debe ser mayor a 0',
                    (val) =>
                      val <= creditData.value ||
                      'El abono debe ser menor o igual a la deuda total',
                  ]"
                  placeholder="Escriba el valor aquí"
                />
              </div>
            </div>

            <!-- Valor seleccionado (información) -->
            <div
              v-if="
                selectedOption &&
                selectedOption !== 'abono' &&
                selectedOption !== 'no_pago'
              "
              class="row q-mb-sm"
            >
              <div class="row items-center q-gutter-md">
                <div class="col">
                  <div class="text-subtitle1 text-weight-medium">
                    Valor a pagar:
                  </div>
                  <!--  <q-icon name="payments" color="primary" size="md" /> -->

                  <div class="text-h5 text-primary">
                    {{
                      selectedOption === "cuota"
                        ? formatCurrency(
                            baseInstallmentValue * installmentCount,
                          )
                        : selectedOption === "deuda"
                          ? formatCurrency(creditData.value)
                          : formatCurrency(0)
                    }}
                  </div>

                  <q-slide-transition>
                    <div
                      v-if="selectedOption === 'cuota'"
                      class="q-mt-sm text-caption text-grey-8"
                    >
                      Cantidad de cuotas seleccionadas:
                      <span class="text-weight-bold text-primary">{{
                        installmentCount
                      }}</span>
                    </div>
                  </q-slide-transition>
                </div>
              </div>
              <!--   <div class="col-12">
                <div class="text-subtitle1 text-weight-medium">
                  Valor a pagar:
                </div>
                <div class="text-h6">
                  {{
                    selectedOption === "cuota"
                      ? formatCurrency(baseInstallmentValue * installmentCount)
                      : selectedOption === "deuda"
                        ? formatCurrency(creditData.value)
                        : formatCurrency(0)
                  }}
                </div>
              </div>
              <div v-if="selectedOption === 'cuota'" class="col-12">
                <div class="text-primary">
                  Cantidad de cuotas a pagar: {{ installmentCount }}
                </div>
              </div> -->
            </div>
          </div>

          <!--  <q-separator class="q-mb-md" />

          <div class="q-mb-sm">
            <div class="text-subtitle1 text-weight-medium q-mb-sm">
              Resumen del Pago
            </div>
            <div class="row q-col-gutter-md">
              <div class="col-12">
                <div class="flex justify-between q-mb-sm">
                  <span>Interés:</span>
                  <span class="text-weight-medium">{{
                    formatCurrency(0)
                  }}</span>
                </div>
                <div class="flex justify-between q-mb-sm">
                  <span>Capital:</span>
                  <span class="text-weight-medium">{{
                    formatCurrency(0)
                  }}</span>
                </div>
              </div>
            </div>
          </div> -->

          <q-separator class="q-mb-md" />

          <div class="q-mb-sm">
            <label> Nota </label>
            <q-input
              outlined
              v-model="paymentNote"
              type="textarea"
              placeholder="Agregue observaciones sobre este pago"
              rows="3"
              class="note-input"
            />
            <div class="text-caption text-grey-7 q-mt-xs">
              Esta nota se guardará en el historial de pagos
            </div>
          </div>

          <div>
            <label> Fecha del pago </label>
            <q-input
              outlined
              v-model="paymentDate"
              dense
              mask="##/##/####"
              placeholder="DD/MM/AAAA"
              :rules="['date']"
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date v-model="paymentDate" minimal mask="DD/MM/YYYY">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="OK" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
        </q-card-section>

        <q-card-actions align="center" class="q-px-lg q-mb-lg sticky-footer no-border">
          <q-btn
            unelevated
            label="Pagar"
            color="primary"
            no-caps
            class="full-width"
            @click="savePayment"
          />
        </q-card-actions>
      </div>
      <div v-else-if="viewState === 'history'">
        <q-card-section class="q-px-lg">
          <div class="row justify-start items-center q-mb-lg sticky-header">
            <q-btn
              flat
              round
              icon="arrow_back"
              @click="viewState = 'default'"
              class="q-mr-sm"
            />

            <div class="flex items-center">
              <div class="text-h5 text-weight-bold q-mr-md">
                Crédito {{ creditData.id }}
              </div>
              <div
                class="q-px-sm q-py-xs rounded-borders text-left"
                :style="getStatusStyle(creditData.status)"
              >
                <span :style="{ color: getStatusColor(creditData.status) }">
                  {{ getStatusText(creditData.status) }}
                </span>
              </div>
            </div>
            <!-- <q-btn flat round dense icon="close"  @click="handleCloseModal"  /> -->
          </div>

          <div class="row q-mb-lg bg-grey-2 rounded-borders q-pa-md border">
            <div class="col-12">
              <div class="row q-col-gutter-md">
                <div
                  class="col-6 text-subtitle1 q-mb-sm"
                  :class="$q.screen.lt.md && 'column'"
                >
                  <span class="text-weight-medium q-mr-sm">{{
                    client.name
                  }}</span>
                  <span class="text-grey-5">({{ client.dni }})</span>
                </div>
                <div
                  :class="!$q.screen.lt.md && 'text-subtitle1'"
                  class="col-6 q-mb-sm text-right"
                >
                  <span
                    :class="!$q.screen.lt.md && 'text-subtitle1'"
                    class="text-weight-medium text-primary q-mr-sm"
                    >$ Crédito + Utilidad</span
                  >
                </div>
              </div>
              <div class="row q-col-gutter-md q-mb-md">
                <div class="col-12 flex justify-between">
                  <div>Frecuencia de pago</div>
                  <div>
                    <q-chip dense outline color="grey-8" class="frequency-chip">
                      {{ creditData.frequency }}
                      <q-icon name="event" size="16px" class="q-ml-xs" />
                    </q-chip>
                  </div>
                </div>
              </div>

              <div class="row q-col-gutter-md">
                <div
                  class="col-12 col-md-4 flex"
                  :class="$q.screen.lt.md && 'justify-between'"
                >
                  <div class="q-mr-sm">Saldo Inicial</div>
                  <div class="text-caption text-grey-7">$ 12,345.00</div>
                </div>
                <div
                  class="col-12 col-md-4 flex"
                  :class="$q.screen.lt.md && 'justify-between'"
                >
                  <div class="q-mr-sm">saldo final</div>
                  <div class="text-caption text-grey-7">$ 12,000.00</div>
                </div>
                <div
                  class="col-12 col-md-4 flex"
                  :class="$q.screen.lt.md && 'justify-between'"
                >
                  <div class="q-mr-sm">Fecha de inicio</div>
                  <div class="text-caption text-grey-7">
                    {{ formatDate(creditData.startDate) }}
                  </div>
                </div>
                <div
                  class="col-12 col-md-4 flex"
                  :class="$q.screen.lt.md && 'justify-between'"
                >
                  <div class="q-mr-sm">Fecha limite</div>
                  <div class="text-caption text-grey-7">
                    {{ formatDate(creditData.dueDate) }}
                  </div>
                </div>
                <div
                  class="col-12 col-md-4 flex"
                  :class="$q.screen.lt.md && 'justify-between'"
                >
                  <div class="q-mr-sm">Cuotas pactadas</div>
                  <div class="text-caption text-grey-7">
                    {{ formatCurrency(creditData.value) }}
                  </div>
                </div>

                <div
                  class="col-12 col-md-4 flex"
                  :class="$q.screen.lt.md && 'justify-between'"
                >
                  <div class="q-mr-sm">Calificación del crédito</div>
                  <div class="text-caption text-grey-7">5/5</div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="$q.screen.lt.md" class="rounded-table-container">
            <q-table
              class="custom-credit-table"
              flat
              table-header-class="control-table-header"
              :rows="paymentHistory"
              :columns="columnsPayments"
              row-key="id"
              hide-pagination
              no-data-label="No hay pagos disponibles"
            >
              <template #body-cell-mobile="props">
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
                      >
                        <div class="col q-mr-md text-no-wrap">
                          <div
                            class="text-sm text-gray-900 text-ellipsis overflow-hidden"
                          >
                            {{ props.row.date }}
                          </div>
                          <div class="text-xs text-gray-500">Fecha</div>
                        </div>
                      </div>

                      <div
                        class="col text-no-wrap text-end q-mr-md"
                        @click.stop
                      >
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
                      </div>
                    </div>

                    <q-slide-transition>
                      <div
                        v-show="expandedRow === props.row.id"
                        class="q-pt-sm"
                      >
                        <div class="bg-grey-2 q-pa-md column">
                          <div class="row q-mb-sm">
                            <div class="text-gray-500 col-3">Cuota</div>
                            <div class="col-9 text-end">
                              <span class="text-gray-900">
                                {{ props.row.amount || "N/A" }}
                              </span>
                              <span class="text-gray-500">
                                {{ props.row.installment || "N/A" }}
                              </span>
                            </div>
                          </div>
                          <div class="row q-mb-sm">
                            <div class="text-gray-500 col-3 flex items-center">
                              Nº Pagos
                            </div>
                            <div class="col-9 text-end">
                              <div class="column">
                                <span class="text-gray-900">
                                  {{ props.row.payments || "0" }}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div class="row q-mb-md">
                            <div class="text-gray-500 col">
                              Valor (Pagado/Pendiente)
                            </div>
                            <div class="column">
                              <span class="text-gray-900">
                                $ 000.00
                              </span>
                              <span class="text-gray-500">
                                $ 000.00
                              </span>
                            </div>
                          </div>
                          <div class="row q-mb-md">
                            <div class="text-gray-500 col-3 flex items-center">
                              Saldo / Acum. Pico
                            </div>
                            <div class="col-9 text-end">
                              <div class="text-gray-900"> $ 000.00</div>
                              <div class="text-gray-500"> + $ 000.00</div>
                            </div>
                          </div>

                          <div class="row q-mb-md">
                            <div class="text-gray-500 col-3">Cuotas</div>
                            <div class="col-9 row items-center justify-end no-wrap">
                              <q-btn
                                dense
                                flat
                                icon="chevron_left"
                                size="sm"
                                @click="currentCreditIndex--"
                              />
                              <q-chip outline color="primary" class="q-mx-sm">
                                <template
                                  v-if="props.row.installments?.length"
                                >
                                  {{
                                    props.row.installments[
                                      currentCreditIndex
                                    ]?.value ||
                                    "Crédito " + (currentCreditIndex + 1)
                                  }}
                                </template>
                                <template v-else> 0 </template>
                              </q-chip>
                              <q-btn
                                dense
                                flat
                                icon="chevron_right"
                                size="sm"
                                :disable="
                                  currentCreditIndex >=
                                    props.row.installments?.length - 1 ||
                                  !props.row.installments?.length
                                "
                                @click="currentCreditIndex++"
                              />
                            </div>
                          </div>

                          <div class="row q-mb-md">
                            <div class="text-gray-500 col">
                              Usuario responsable
                            </div>
                            <div class="col-9 text-end">
                              <div class="text-gray-900">Juan Perez</div>
                              <div class="text-gray-500">Luis Lopez</div>
                            </div>
                          </div>

                          <div class="row q-mb-md">
                            <div class="text-gray-500 col">Calificacion</div>
                            <div class="col text-gray-500 text-bold text-end">
                              <q-icon name="star" size="16px" class="q-ml-xs" />
                              {{ props.row.installmentsPaid || "N/A" }}
                            </div>
                          </div>
                          <!--  <div class="row q-mb-md">
                            <div class="text-gray-500 col">
                              Frecuencia de pago
                            </div>
                            <div class="col text-gray-500 text-bold text-end">
                              {{ props.row.frequency || "N/A" }}
                            </div>
                          </div> -->
                        </div>
                      </div>
                    </q-slide-transition>
                  </div>
                </td>
              </template>
            </q-table>
          </div>
          <q-table
            v-else
            flat
            separator="none"
            table-header-class="control-table-header"
            :rows="formattedCredits"
            :columns="columnsDesktop"
            row-key="id"
            hide-pagination
            no-data-label="No hay créditos disponibles"
          >
            <template #body="props">
              <q-tr :props="props">
                <!--  <q-td key="installment" :props="props">
                  {{ props.row.installment }}
                </q-td>
                <q-td key="amount" :props="props">
                  {{ formatCurrency(props.row.amount) }}
                  <q-badge
                    :color="
                      props.row.status === 'paid' ? 'positive' : 'negative'
                    "
                    :label="
                      props.row.status === 'paid' ? 'Pagado' : 'Pendiente'
                    "
                    class="q-ml-sm"
                  />
                </q-td>
                <q-td key="cumulativeBalance" :props="props">
                  {{ formatCurrency(props.row.cumulativeBalance) }}
                </q-td>
                <q-td key="installmentsPaid" :props="props">
                  {{ props.row.installmentsPaid }} cuota(s)
                </q-td>
                <q-td key="responsibleUser" :props="props">
                  {{ props.row.responsibleUser }}
                </q-td>
                <q-td key="rating" :props="props">
                  <q-rating
                    v-model="props.row.rating"
                    size="1.5em"
                    color="orange"
                    readonly
                  />
                </q-td> -->
              </q-tr>
            </template>
          </q-table>
          <div class="flex justify-end items-center q-mt-md">
            <q-pagination
              v-model="pagePayments"
              color="grey-9"
              active-color="primary"
              :max="maxPagesPayments"
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
        </q-card-section>
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useQuasar } from "quasar";

const props = defineProps({
  modelValue: Boolean,
  credit: {
    type: Object,
    default: () => ({}),
  },

  client: {
    type: Object,
    default: () => ({}),
  },
  closeModal: {
    type: Function,
    default: () => {},
  },
});

watch(
  () => props.credit,
  (newVal) => {
    console.log("Crédito recibido en el modal:", newVal);
  },
  { immediate: true },
);

const emit = defineEmits(["update:modelValue"]);
const expandedRow = ref(null);
const $q = useQuasar();
const showPaymentForm = ref(false);
const showHistory = ref(false);
const paymentValue = ref("0.00");
const paymentType = ref("both");
const selectedOption = ref(null);
const paymentNote = ref("");
const viewState = ref("default");

const installmentCount = ref(1);
const baseInstallmentValue = computed(() => props.credit.installmentValue || 0);
const paymentDate = ref(new Date().toLocaleDateString("es-CO"));
const currentMonth = ref(new Date().getMonth());
const currentYear = ref(new Date().getFullYear());
const excludedDays = computed(() => {
  if (!creditData.value.excluded_days) return [];

  try {
    const daysArray = JSON.parse(creditData.value.excluded_days);

    const dayMap = {
      Domingo: 0,
      Lunes: 1,
      Martes: 2,
      Miércoles: 3,
      Jueves: 4,
      Viernes: 5,
      Sábado: 6,
    };

    return daysArray
      .map((dayName) => dayMap[dayName] ?? -1)
      .filter((day) => day >= 0);
  } catch (e) {
    console.error("Error parsing excluded days:", e);
    return [];
  }
});
const currentCreditIndex = ref(0);

const toggleExpand = (id) => {
  expandedRow.value = expandedRow.value === id ? null : id;
};
const handleCloseModal = () => {
  if (props.closeModal) {
    props.closeModal();
  } else {
    emit("update:modelValue", false);
  }
};

const paymentDates = computed(() => {
  if (
    !creditData.value.startDate ||
    !creditData.value.installments ||
    !creditData.value.frequency
  ) {
    return [];
  }

  const dates = [];
  const startDate = new Date(creditData.value.startDate);
  let currentDate = new Date(startDate);
  const installments = creditData.value.installments;

  let increment = 0;
  switch (creditData.value.frequency) {
    case "Diaria":
      increment = 1;
      break;
    case "Semanal":
      increment = 7;
      break;
    case "Quincenal":
      increment = 15;
      break;
    case "Mensual":
      increment = 30;
      break;
    default:
      increment = 1;
  }

  for (let i = 0; i < installments; i++) {
    const excluded = excludedDays.value;
    while (excluded.includes(currentDate.getDay())) {
      currentDate.setDate(currentDate.getDate() + 1);
    }

    dates.push(new Date(currentDate));

    currentDate.setDate(currentDate.getDate() + increment);
  }

  return dates;
});

const columnsPayments = computed(() => {
  if ($q.screen.lt.md) {
    return [
      {
        name: "mobile",
        label: "Historial de Pagos",
        align: "left",
        field: (row) => row.id,
      },
    ];
  }

  return [
    {
      name: "installment",
      label: "Cuota",
      align: "left",
      field: "installment",
      sortable: true,
    },
    {
      name: "amount",
      label: "Valor Pagado/Pendiente",
      align: "center",
      field: "amount",
      sortable: true,
    },
    {
      name: "cumulativeBalance",
      label: "Saldo Acumulado",
      align: "center",
      field: "cumulativeBalance",
      sortable: true,
    },
    {
      name: "installmentsPaid",
      label: "Cuotas Pagadas",
      align: "center",
      field: "installmentsPaid",
      sortable: true,
    },
    {
      name: "responsibleUser",
      label: "Usuario Responsable",
      align: "center",
      field: "responsibleUser",
      sortable: true,
    },
    {
      name: "rating",
      label: "Calificación",
      align: "center",
      field: "rating",
      sortable: true,
    },
  ];
});

const paymentHistory = ref([
  {
    id: 1,
    installment: 1,
    amount: 150000,
    status: "Pago",
    installments: [1, 2, 3],
    cumulativeBalance: 1850000,
    installmentsPaid: 1,
    responsibleUser: "Ana López",
    rating: 5,
    date: "2023-05-15",
  },
  {
    id: 2,
    installment: 2,
    amount: 150000,
    status: "No pago",
    installmentsPaid: [4],

    cumulativeBalance: 1700000,
    installmentsPaid: 1,
    responsibleUser: "Carlos Ruiz",
    rating: 4,
    date: "2023-06-10",
  },
  {
    id: 3,
    installment: 3,
    amount: 0,
    status: "Pago",
    installmentsPaid: [4, 5],

    cumulativeBalance: 1700000,
    installmentsPaid: 0,
    responsibleUser: "",
    rating: 0,
    date: "2023-07-05",
  },
  {
    id: 4,
    installment: 4,
    amount: 0,
    status: "Pago",
    installmentsPaid: [4, 5],

    cumulativeBalance: 1700000,
    installmentsPaid: 0,
    responsibleUser: "",
    rating: 0,
    date: "2023-08-01",
  },
  {
    id: 5,
    installment: 5,
    amount: 0,
    status: "Pago",
    installmentsPaid: [7, 8],
    cumulativeBalance: 1700000,
    installmentsPaid: 0,
    responsibleUser: "",
    rating: 0,
    date: "2023-09-15",
  },
  {
    id: 6,
    installment: 6,
    amount: 0,
    status: "No pago",
    installmentsPaid: [7, 8],
    cumulativeBalance: 1700000,
    installmentsPaid: 0,
    responsibleUser: "",
    rating: 0,
    date: "2023-10-20",
  },
  {
    id: 7,
    installment: 7,
    amount: 0,
    status: "Pago",
    installmentsPaid: [7, 8],
    cumulativeBalance: 1700000,
    installmentsPaid: 0,
    responsibleUser: "",
    rating: 0,
    date: "2023-11-25",
  },
  {
    id: 8,
    installment: 8,
    amount: 0,
    status: "Pago",
    installmentsPaid: [7, 8],
    cumulativeBalance: 1700000,
    installmentsPaid: 0,
    responsibleUser: "",
    rating: 0,
    date: "2023-12-30",
  },
  {
    id: 9,
    installment: 9,
    amount: 0,
    status: "Pago",
    installmentsPaid: [7, 8],
    cumulativeBalance: 1700000,
    installmentsPaid: 0,
    responsibleUser: "",
    rating: 0,
    date: "2024-01-05",
  },
  {
    id: 10,
    installment: 10,
    amount: 0,
    status: "No pago",
    installmentsPaid: [7, 8],
    cumulativeBalance: 1700000,
    installmentsPaid: 0,
    responsibleUser: "",
    rating: 0,
    date: "2024-02-10",
  },
]);

// Paginación para la tabla de pagos
const pagePayments = ref(1);
const maxPagesPayments = computed(() =>
  Math.ceil(paymentHistory.value.length / 5),
);

const calendar = computed(() => {
  const year = currentYear.value;
  const month = currentMonth.value;

  // Primer día del mes
  const firstDay = new Date(year, month, 1);
  // Último día del mes
  const lastDay = new Date(year, month + 1, 0);
  // Día de la semana del primer día (0 = Domingo, 1 = Lunes, ...)
  const firstDayOfWeek = firstDay.getDay();

  // Ajustar para que la semana comience en lunes (1)
  const startOffset = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

  // Total de días en el mes
  const daysInMonth = lastDay.getDate();

  // Calcular días del mes anterior a mostrar
  const prevMonthDays = [];
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  for (let i = startOffset - 1; i >= 0; i--) {
    const day = prevMonthLastDay - i;
    prevMonthDays.push({
      day,
      date: new Date(year, month - 1, day),
      isCurrentMonth: false,
    });
  }

  // Días del mes actual
  const currentMonthDays = [];
  for (let day = 1; day <= daysInMonth; day++) {
    currentMonthDays.push({
      day,
      date: new Date(year, month, day),
      isCurrentMonth: true,
    });
  }

  // Días del próximo mes a mostrar
  const nextMonthDays = [];
  const totalCells = 42; // 6 semanas * 7 días
  const remainingCells =
    totalCells - (prevMonthDays.length + currentMonthDays.length);
  for (let day = 1; day <= remainingCells; day++) {
    nextMonthDays.push({
      day,
      date: new Date(year, month + 1, day),
      isCurrentMonth: false,
    });
  }

  // Combinar todos los días
  const allDays = [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];

  // Dividir en semanas
  const weeks = [];
  for (let i = 0; i < allDays.length; i += 7) {
    weeks.push(allDays.slice(i, i + 7));
  }

  return weeks;
});

const selectOption = (option) => {
  selectedOption.value = option;

  if (option === "cuota") {
    paymentValue.value = (
      baseInstallmentValue.value * installmentCount.value
    ).toFixed(2);
  } else if (option === "deuda") {
    installmentCount.value = 1;
    paymentValue.value = creditData.totalDebt.toFixed(2);
  } else if (option === "no_pago") {
    installmentCount.value = 1;
    paymentValue.value = "0.00";
  } else {
    installmentCount.value = 1;
    paymentValue.value = "";
  }
};

const addInstallment = () => {
  const maxInstallments = props.credit.number_installments || 1;

  if (installmentCount.value < maxInstallments) {
    installmentCount.value++;
    selectOption("cuota");
  }
};

const removeInstallment = () => {
  if (installmentCount.value > 1) {
    installmentCount.value--;
    selectOption("cuota");
  }
};

const savePayment = () => {
  console.log("Guardar pago:", {
    value: paymentValue.value,
    type: paymentType.value,
  });
  // Aquí iría la lógica para guardar el pago
  // Luego podrías cerrar el modal o mostrar un mensaje de éxito
};

const paymentOptions = [
  { label: "Interés y Capital", value: "both" },
  { label: "Solo Interés", value: "interest" },
  { label: "Solo Capital", value: "capital" },
];

// Datos de ejemplo
const client = computed(() => ({
  name: "María Rodríguez",
  dni: "23.456.789",
  ...props.client,
}));

const creditData = computed(() => ({
  id: props.credit.id || "CR-2023-00125",
  value: props.credit.value || 0,
  startDate: props.credit.startDate,
  dueDate: props.credit.dueDate || null,
  frequency: props.credit.frequency,
  status: props.credit.status || "Vigente",
  installments: props.credit.installments || 4,
  installmentValue: props.credit.installmentValue || 25,
  excluded_days: props.credit.excluded_days || "[]",
  total_interest: props.credit.total_interest || 0,
  utility: 15,
  paidInstallments: 4,
  advancedInstallments: 3,
  overdueInstallments: 1,
  pendingInstallments: 0,
  payments: 2,
  fieldVisits: 3,
  interestRate: "12.00%",
  loanTerm: "180 Dias",
}));

const currentMonthName = computed(() => {
  const date = new Date(currentYear.value, currentMonth.value, 1);
  return date.toLocaleString("es-ES", { month: "long" });
});

const changeMonth = (delta) => {
  let newMonth = currentMonth.value + delta;
  let newYear = currentYear.value;

  if (newMonth < 0) {
    newMonth = 11;
    newYear--;
  } else if (newMonth > 11) {
    newMonth = 0;
    newYear++;
  }

  currentMonth.value = newMonth;
  currentYear.value = newYear;
};

const isPaymentDay = (day) => {
  if (!day.date || !paymentDates.value.length) return false;

  return paymentDates.value.some((paymentDate) => {
    return (
      paymentDate.getDate() === day.date.getDate() &&
      paymentDate.getMonth() === day.date.getMonth() &&
      paymentDate.getFullYear() === day.date.getFullYear()
    );
  });
};

const formatDate = (dateString) => {
  if (!dateString) return "Fecha no disponible";

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Formato inválido";

  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

const isExcludedDay = (date) => {
  if (!date) return false;
  return excludedDays.value.includes(date.getDay());
};

const isCurrentDay = (day) => {
  if (!day.date) return false;

  const today = new Date();
  return (
    day.date.getDate() === today.getDate() &&
    day.date.getMonth() === today.getMonth() &&
    day.date.getFullYear() === today.getFullYear()
  );
};

// Obtener número de cuota para una fecha
const getInstallmentNumber = (date) => {
  const index = paymentDates.value.findIndex(
    (paymentDate) => paymentDate.getTime() === date.getTime(),
  );

  return index >= 0 ? index + 1 : "N/A";
};

const viewPaymentHistory = () => {
  /*  emit("viewHistory", credit.value.id);
  emit("update:modelValue", false); */
};

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
    case "Pago":
      return "#21BA45";
    case "No pago":
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
    case "Pago":
      return "Pago";
    case "No pago":
      return "No pago";
    default:
      return status;
  }
};

const formatCurrency = (value) => {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};
</script>

<style scoped>
.sticky-header {
  position: sticky;
  top: 0;
  background: white;
  z-index: 100;
  padding-top: 16px;
  padding-bottom: 8px;
}

.sticky-footer {
  position: sticky;
  bottom: 0;
  background: white;
  z-index: 100;
}

.section-divider {
  height: 1px;
  background-color: #e0e0e0;
  width: 100%;
}

.calendar-container {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
}

.week-header {
  font-weight: bold;
  margin-bottom: 12px;
  color: #616161;
}

.day {
  position: relative;
  padding: 8px 0;
  min-height: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 1px solid #f5f5f5;
}

.day-number {
  font-size: 14px;
  margin-bottom: 4px;
}

.payment-indicator {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: #4caf50;
}

.current-day {
  background-color: #e3f2fd;
  color: #1976d2;
  font-weight: bold;
}

.payment-day {
  background-color: #e0e0e0;
  color: #424242;
  position: relative;
}

.different-month {
  color: #bdbdbd;
}
.frequency-chip {
  font-weight: 600;
  border-width: 1px;
  border-radius: 50px;
  padding: 4px 8px;
  background-color: #f9f9f9;
  border: 1px solid #9e9e9e;
}
.border {
  border: 1px solid rgba(0, 0, 0, 0.12);
}

.border-primary {
  border: 2px solid #1976d2 !important;
  background-color: aliceblue !important;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
}

.day {
  position: relative;
  padding: 8px 0;
  min-height: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 1px solid #f5f5f5;
  cursor: pointer;
}

.day-number {
  font-size: 14px;
  margin-bottom: 4px;
}

.payment-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: transparent;
}

.current-day {
  background-color: #e3f2fd;
  color: #1976d2;
  font-weight: bold;
}

/* .payment-day::after {
  content: "";
  position: absolute;
  top: 2px;
  right: 2px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: #424242;
} */

.different-month {
  color: #bdbdbd;
  background-color: #f9f9f9;
}

.excluded-day {
  background-color: #ffebee;
  color: #b71c1c;
  text-decoration: line-through;
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
</style>
