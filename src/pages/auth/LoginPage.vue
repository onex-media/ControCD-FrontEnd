<template>
  <div class="main-container window-height">
    <!-- Left Panel -->
    <div class="left-panel relative-position window-height">
      <div class="text-container">
        <h1 class="text-weight-bold">Bienvenido a Control CD</h1>
        <p class="text-2xl sm:text-5xl">
          Toma el control de tus créditos y optimiza tu gestión financiera.
        </p>
      </div>
      <q-btn label="Acceder a mi cuenta" @click="scrollToLogin" class="scroll-button" unelevated no-caps
        v-if="$q.screen.lt.md" />
      <div class="background-image">
        <img src="/images/login-image.png" alt="Decorative element" />
      </div>
    </div>

    <!-- Right Panel -->
    <div id="login">
      <div class="login-main-container">
        <h2 class="text-weight-bold">Comienza ahora</h2>
        <p>
          Plataforma integral para administrar créditos de forma eficiente y
          segura. Con una interfaz intuitiva y muy completa.
        </p>

        <form @submit.prevent="login">
          <div>
            <label class="label">Usuario</label>
            <q-input v-model="form.email" outlined :rules="nameRules(form.email)">
              <template v-slot:error>
                <span class="text-negative">
                  <q-icon class="q-mr-xs" size="xs" color="negative" name="cancel" />
                  Ingresa tu usuario
                </span>
              </template>
            </q-input>
          </div>

          <div>
            <label class="label">Contraseña</label>
            <q-input v-model="form.password" outlined :rules="passwordRules(form.password)"
              :type="showPassword ? 'text' : 'password'">
              <template v-slot:error>
                <span>
                  <q-icon class="q-mr-xs" size="xs" color="negative" name="cancel" />
                  La contraseña debe tener al menos 6 caracteres.
                </span>
              </template>
              <template v-slot:append>
                <q-icon :name="showPassword ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                  @click="showPassword = !showPassword" />
              </template>
            </q-input>
          </div>

          <div class="actions-box">
            <q-checkbox v-model="form.remember" label="Recordar inicio de sesión" class="checkbox" />
            <router-link to="#"> ¿Olvidaste tu contraseña? </router-link>
          </div>

          <q-btn type="submit" :loading="loading" unelevated
            class="w-full bg-blue-600 text-white hover:bg-blue-700 py-3 rounded-lg transition-colors"
            :disable="v$.$invalid || loading">
            Iniciar sesión
          </q-btn>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { email, minLength, required } from "@vuelidate/validators";
import { useQuasar } from "quasar";
import { nameRules, passwordRules } from "src/helpers/rules";
import { useAuth } from "src/composables/useAuth";
import { handleMessages } from "src/utils/notify";
import { useRouter } from "vue-router";

const { handleLogin } = useAuth();

const $q = useQuasar();
const loading = ref(false);
const showPassword = ref(false);
const router = useRouter();

const form = reactive({
  email: "super@gmail.com",
  password: "12345678",
  remember: false,
});

const rules = {
  form: {
    email: { required, minLength: minLength(3) },
    password: { required, minLength: minLength(6) },
  },
};

const v$ = useVuelidate(rules, { form });

const scrollToLogin = () => {
  document.getElementById("login")?.scrollIntoView({ behavior: "smooth" });
};

const login = async () => {
  loading.value = true;
  await handleLogin(form);
  loading.value = false;
};
</script>

<style scoped lang="scss">
.main-container {
  @media (width >=$desktop) {
    display: flex;
    flex-wrap: nowrap;
  }
}

.left-panel {
  padding-inline: 24px;
  padding-block: 120px 24px;
  background-color: $navyBlue;
  width: 100%;
  @include flex(unset, space-between, column);

  @media (width >=$tablet) {
    padding: 48px;
  }

  @media (width >=$desktop) {
    padding-block: 120px 24px;
    width: 33.3%;
  }

  .background-image {
    @include absoluteBackdrop();

    img {
      @include fullSize();
    }
  }

  .text-container {
    z-index: 10;
    color: $white;

    h1 {
      font-size: $extrahuge;
      line-height: normal;

      @media (width >=$widescreen) {
        font-size: $extraextrahuge;
      }
    }

    p {
      margin-top: 20px;
      font-size: $hometitletablet;

      @media (width >=$widescreen) {
        font-size: $extrahugeplus;
      }
    }
  }

  .scroll-button {
    z-index: 10;
    background-color: $white;
    color: $navyBlue;
    height: 37px;
    @include flexCenter();
  }
}

#login {
  width: 100%;
  height: 100dvh;
  padding: 24px;
  @include flexCenter();

  @media (width >=$tablet) {
    padding: 48px;
  }

  @media (width >=$desktop) {
    width: 66.6%;
  }

  .login-main-container {
    width: 100%;
    max-width: 571px;

    h2 {
      font-size: $extrahuge;
      color: $black;

      @media (width >=$widescreen) {
        font-size: $hometitlesize;
      }
    }

    p {
      margin-block: 16px 20px;
      color: $lightGrey;
      font-size: $largeplus;

      @media (width >=$widescreen) {
        font-size: $extralarge;
      }
    }
  }

  form {
    display: grid;
    gap: 0px;

    @media (width >=$desktop) {
      gap: 24px;
    }

    .label {
      font-size: $regular;
      color: $darkGrey;
      margin-bottom: px;
      display: block;

      @media (width >=$widescreen) {
        font-size: $extralarge;
      }
    }

    input {
      font-size: $regular;

      @media (width >=$desktop) {
        font-size: $large;
      }
    }

    .actions-box {
      @include flex(center, space-between);

      .checkbox {
        color: $darkGrey;
      }

      *:not(.q-checkbox__inner) {
        font-size: $regular;

        @media (width >=$desktop) {
          font-size: $medium;
        }
      }

      a {
        text-align: right;
        color: $darkBlue;
      }
    }
  }
}
</style>
