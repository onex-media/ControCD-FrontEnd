import { ref } from "vue";
import { useRouter } from "vue-router";
import { handleMessages } from "src/utils/notify";
import { loginReq } from "src/services/auth.services";
import { loginPayload, UserInterface } from "@/types/auth.types";

export const useAuth = () => {
  const user = ref(JSON.parse(localStorage.getItem("user") as string));
  const router = useRouter();
  const isAuth = ref<boolean>(
    localStorage.getItem("access_token") ? true : false
  );

  const handleLogin = async (payload: loginPayload) => {
    const res = await loginReq(payload);

    if (res.code === "error") return false;

    localStorage.setItem("access_token", res.data.access_token);
    localStorage.setItem("user", JSON.stringify(res.data.user));
    handleMessages({
      message: "Inicio de sesión exitoso",
      color: "green",
      icon: "check",
    });
    isAuth.value = true;
    user.value = res.data.user;
    router.push("/dashboard");
    return res.data;
  };

    const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    
    isAuth.value = false;
    user.value = null;
    
    router.push("/login");
    
    handleMessages({
      message: "Sesión cerrada correctamente",
      color: "green",
      icon: "exit_to_app",
    });
  };

  return {
    user,
    isAuth,
    handleLogin,
    logout,
  };
};
