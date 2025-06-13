import { QTableProps } from "quasar";

const columns: QTableProps["columns"] = [
  {
    name: "active",
    align: "left",
    label: "Estado",
    field: "active",
    sortable: false,
  },
  {
    name: "seller",
    align: "left",
    label: "Vendedor",
    field: (row) => row.user?.name || "Sin asignar",
    sortable: false,
  },
   {
    name: "username",
    align: "left",
    label: "Usuario",
    field: (row) => row.user?.email?.split('@')[0] || 'Sin email',
    sortable: false,
  },
  {
    name: "city",
    align: "left",
    label: "Ciudad",
    field: (row) =>
      row.city
        ? `${row.city.name}, ${row.city.country?.name}`
        : "Sin ubicación",
    sortable: false,
  },
  {
    name: "total_credits",
    align: "center",
    label: "Saldo actual",
    field: "total_credits",
    format: (val) => "$" + 0 || "$0",
    sortable: false,
  },
  {
    name: "user_routes",
    align: "center",
    classes: "text-bold",
    label: "Miembros",
    field: "user_routes",
    format: (val) => val.length, 
    sortable: false,
  },
  {
    name: "credits",
    align: "left",
    label: "Créditos",
    field: (row) => row.credits || "Sin asignar",
    sortable: false,
  },
  {
    name: "opt",
    align: "right",
    label: "Acciones",
    field: "opt",
    sortable: false,
  },
];

export { columns };
