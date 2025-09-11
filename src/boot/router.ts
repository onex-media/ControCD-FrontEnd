import { computed } from "vue";
import { Notify } from "quasar";
import { boot } from "quasar/wrappers";
import { useAuth } from "src/composables/useAuth";

// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(async ({ router }) => {
  router.beforeEach((to, from, next) => {
    const { isAuth } = useAuth();
    if (
      (to && to.fullPath === "/login" && isAuth.value) ||
      (to && to.fullPath === "/" && isAuth.value)
    ) {
      next("/dashboard");
      return true;
    }
    if (to.matched.some((record) => record.meta.auth) && !isAuth.value) {
      Notify.create({
        message: "Debes estar logueado para acceder a esta app",
        color: "warning",
      });
      next("/");
      return true;
    } else {
      if (to.path === "/" && isAuth.value) {
        next("/dashboard");
        return true;
      }
      next();
    }
  });
});
