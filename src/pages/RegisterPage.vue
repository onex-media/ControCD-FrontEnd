<template>
  <div class="flex min-h-screen">
    <!-- Left Panel -->
    <div class="w-full h-screen lg:flex lg:w-1/3 bg-blue-600 p-12 flex-col justify-between relative">
      <div class="absolute z-10 top-[25%] translate-y-[-25%]">
        <h1 class="text-white text-4xl sm:text-7xl font-bold mb-5">Bienvenido a Control CD</h1>
        <p class="text-white/90 text-5xl">Toma el control de tus créditos y optimiza tu gestión financiera.</p>
        <button
          @click="scrollToRegister"
          class="mt-4 block sm:block md:hidden lg:hidden  bg-white text-blue-600 font-bold py-2 px-4 rounded"
        >
          Crea una cuenta
        </button>
      </div>
      <div class="absolute bottom-0 left-0 w-full">
        <img src="/images/login-image.png" alt="Decorative element" class="w-full h-screen" />
      </div>
    </div>

    <!-- Right Panel -->
    <div id="register" class="w-full lg:w-2/3 p-6 sm:p-12 flex items-center justify-center">
      <div class="w-full max-w-md">
        <h2 class="text-6xl font-bold text-gray-900 mb-4">Regístrate</h2>
        <p class="text-gray-400 text-xl mb-8">
          Únete a nuestra plataforma y comienza a gestionar tus créditos de manera eficiente.
        </p>

        <form @submit.prevent="handleRegister" class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
            <q-input v-model="form.name" outlined :error="v$.form.name.$error" :error-message="v$.form.name.$errors[0]?.$message" class="w-full" @blur="v$.form.name.$touch" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Correo Electrónico</label>
            <q-input v-model="form.email" type="email" outlined :error="v$.form.email.$error" :error-message="v$.form.email.$errors[0]?.$message" class="w-full" @blur="v$.form.email.$touch" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
            <q-input v-model="form.password" :type="showPassword ? 'text' : 'password'" outlined :error="v$.form.password.$error" :error-message="v$.form.password.$errors[0]?.$message" class="w-full" @blur="v$.form.password.$touch">
              <template v-slot:append>
                <q-icon :name="showPassword ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="togglePasswordVisibility" />
              </template>
            </q-input>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Confirmar Contraseña</label>
            <q-input v-model="form.password_confirmation" :type="showPassword ? 'text' : 'password'" outlined :error="v$.form.password_confirmation.$error" :error-message="v$.form.password_confirmation.$errors[0]?.$message" class="w-full" @blur="v$.form.password_confirmation.$touch">
              <template v-slot:append>
                <q-icon :name="showPassword ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="togglePasswordVisibility" />
              </template>
            </q-input>
          </div>

          <q-btn type="submit" :loading="loading" class="w-full bg-blue-600 text-white hover:bg-blue-700 py-3 rounded-lg transition-colors" :disable="v$.$invalid">
            Registrarse
          </q-btn>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required, email, minLength } from '@vuelidate/validators';
import { useQuasar } from 'quasar';
import axios from '../axios'; // Asegúrate de importar la configuración de axios correctamente
import { useRouter } from 'vue-router';
import Cookies from 'js-cookie';
const $q = useQuasar();
const router = useRouter();
const loading = ref(false);
const showPassword = ref(false);

const form = reactive({
  name: '',
  email: '',
  password: '',
  password_confirmation: ''
});

const rules = {
  form: {
    name: { required },
    email: { required, email },
    password: { required, minLength: minLength(8) },
    password_confirmation: { required }
  }
};

const v$ = useVuelidate(rules, { form });

const scrollToRegister = () => {
  document.getElementById('register').scrollIntoView({ behavior: 'smooth' });
};

const getCsrfToken = async () => { 
  await axios.get('/sanctum/csrf-cookie'); 
};
const handleRegister = async () => {
  await getCsrfToken();

  const isValid = await v$.value.$validate();
  if (!isValid) return;

  if (form.password !== form.password_confirmation) {
    $q.notify({
      type: 'negative',
      message: 'Las contraseñas no coinciden'
    });
    return;
  }

  loading.value = true;

  try {
    await axios.post('/register', {
      name: form.name,
      email: form.email,
      password: form.password,
      password_confirmation: form.password_confirmation
    });

    $q.notify({
      type: 'positive',
      message: 'Registro exitoso'
    });

    router.push('/login');
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: error.response?.data?.message || 'Error al registrarse'
    });
  } finally {
    loading.value = false;
  }
};

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};
</script>

<style scoped>
.flex {
  display: flex;
}
.min-h-screen {
  min-height: 100vh;
}
.bg-blue-600 {
  background-color: #2563eb;
}
.text-7xl {
  font-size: 4.5rem;
}
.text-5xl {
  font-size: 3rem;
}
.text-6xl {
  font-size: 3.75rem;
}
.max-w-md {
  max-width: 28rem;
}
:deep(.q-field) {
  background: white;
}
</style>
