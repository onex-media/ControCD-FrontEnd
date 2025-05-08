import { ref } from "vue";
import { loginReq } from "src/services/auth.services";
import { loginPayload } from "@/types/auth.types";
import { useRouter } from "vue-router";
import { handleMessages } from "src/utils/notify";

export const useAuth = () => {
  const user = ref<boolean>(false);
  const router = useRouter();

  const handleLogin = async (payload: loginPayload) => {
    const res = await loginReq(payload);

    if (res.code === "error") return false;

    localStorage.setItem("access_token", res.data.access_token);
    handleMessages({
      message: "Inicio de sesión exitoso",
      color: "green",
      icon: "check",
    });
    router.push("/dashboard/members");
    return res.data;
  };
  return {
    handleLogin,
  };
};
