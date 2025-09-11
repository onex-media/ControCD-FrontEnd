import { ref, Ref } from "vue";
import { getRoles } from "src/services/roles.services";
import { handleMessages } from "src/utils/notify";
import { Role } from "src/types/roles.types";

export const useRoles = () => {
  const roles = ref<Role[]>([]);

  const translateRoleName = (roleName: string): string => {
    const translations: { [key: string]: string } = {
      assistant: "Asistente",
      cobrador: "Cobrador",
      partner: "Socio",
    };
    return translations[roleName] || roleName;
  };

  const getRolesData = async () => {
    try {
      const res: any = await getRoles();

      if (res.code === "error") {
        return handleMessages({
          message: res.error.message,
          color: "red",
          icon: "close",
        });
      }

      roles.value = res.data.data.data.map((role: Role) => ({
        ...role,
        name: translateRoleName(role.name),
      }));
    } catch (error) {
      console.error("Error fetching cities:", error);
      handleMessages({
        message: "Error al obtener las ciudades",
        color: "red",
        icon: "close",
      });
    }
  };

  return {
    roles,
    getRolesData,
  };
};
