import { Notify } from "quasar";
import { boot } from "quasar/wrappers";
import { useAuth } from "src/composables/useAuth";

const { isAuth } = useAuth();

// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(async ({ router, app }) => {
  router.beforeEach((to, from, next) => {
    if (
      (to && to.fullPath === "/login" && isAuth) ||
      (to && to.fullPath === "/" && isAuth)
    ) {
      next("/dashboard");
      return true;
    }
    if (to.matched.some((record) => record.meta.auth) && !isAuth) {
      Notify.create({
        message: "Debes estar logueado para acceder a esta app",
        color: "warning",
      });
      next("/");
      return true;
    } else {
      if (to.path === "/" && isAuth) {
        next("/dashboard");
        return true;
      }
      next();
    }
  });
});
