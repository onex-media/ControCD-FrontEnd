// usePayments.ts
import { computed, onMounted, reactive, Ref, ref } from "vue";
import { handleMessages } from "src/utils/notify";
import { getData, postData } from "src/services/api.services";
import { Notify } from "quasar";

interface PaymentForm {
  credit_id: number | null;
  payment_date: string;
  amount: number | null;
  payment_method: string;
  payment_reference: string;
}

interface Payment {
  id: number;
  credit_id: number;
  payment_date: string;
  amount: number;
  status: string;
  payment_method: string;
  payment_reference: string;
  created_at: string;
  credit: {
    id: number;
    client: {
      id: number;
      name: string;
      dni: string;
    };
  };
}

const pagination = reactive({
  sortBy: "desc",
  descending: false,
  page: 1,
  countPage: 1,
  rowsNumber: 1,
  rowsPerPage: 50,
});

export function usePayments() {
  const paymentForm = ref<PaymentForm>({
    credit_id: null,
    payment_date: new Date().toISOString().split('T')[0], // Fecha actual por defecto
    amount: null,
    payment_method: "",
    payment_reference: "",
  });

  const search = ref<string>("");
  const isSaving = ref<boolean>(false);
  const payments = ref<Payment[]>([]);
  const credits = ref<any[]>([]);
  const showCreateModal = ref(false);

  const fetchPayments = async () => {
    try {
      const response = await getData({ path: "/payments" });
      payments.value = response.data;
    } catch (error) {
      console.error("Error fetching payments:", error);
      handleMessages({
        message: "Error al cargar los pagos",
        color: "red",
        icon: "close",
      });
    }
  };

  const fetchCredits = async () => {
    try {
      const response = await getData({ path: "/credits" });
      credits.value = response.data;
    } catch (error) {
      console.error("Error fetching credits:", error);
      handleMessages({
        message: "Error al cargar los créditos",
        color: "red",
        icon: "close",
      });
    }
  };

  const filteredPayments = computed(() => {
    return payments.value.filter((payment) => {
      return (
        payment.credit.client.name
          .toLowerCase()
          .includes(search.value.toLowerCase()) ||
        payment.credit.client.dni.includes(search.value) ||
        payment.id.toString().includes(search.value)
      );
    });
  });

  const createPayment = async () => {
    try {
      isSaving.value = true;
      
      // Validación básica
      if (!paymentForm.value.credit_id || !paymentForm.value.amount) {
        Notify.create({
          type: "negative",
          message: "Debe seleccionar un crédito y especificar un monto",
        });
        return;
      }

      const payload = {
        credit_id: paymentForm.value.credit_id,
        payment_date: paymentForm.value.payment_date,
        amount: paymentForm.value.amount,
        payment_method: paymentForm.value.payment_method,
        payment_reference: paymentForm.value.payment_reference,
      };

      const response = await postData({
        path: "/payment/create",
        payload,
      });

      if (response.success) {
        Notify.create({
          type: "positive",
          message: "Pago registrado exitosamente",
        });
        closeModal();
        await fetchPayments();
      } else {
        Notify.create({
          type: "negative",
          message: response.message || "Error al registrar el pago",
        });
      }
    } catch (error: any) {
      console.error("Error creating payment:", error);
      let errorMessage = "Error al registrar el pago";
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      Notify.create({
        type: "negative",
        message: errorMessage,
      });
    } finally {
      isSaving.value = false;
    }
  };

  const creditOptions = computed(() => {
    return credits.value.map((credit) => ({
      label: `Crédito #${credit.id} - ${credit.client.name} (${credit.client.dni})`,
      value: credit.id,
      client: credit.client,
    }));
  });

  const closeModal = () => {
    showCreateModal.value = false;
    paymentForm.value = {
      credit_id: null,
      payment_date: new Date().toISOString().split('T')[0],
      amount: null,
      payment_method: "",
      payment_reference: "",
    };
  };

  const openCreateModal = () => {
    showCreateModal.value = true;
  };

  onMounted(async () => {
    await fetchPayments();
    await fetchCredits();
  });

  return {
    paymentForm,
    payments,
    credits,
    filteredPayments,
    showCreateModal,
    creditOptions,
    search,
    pagination,
    isSaving,
    createPayment,
    closeModal,
    openCreateModal,
  };
}