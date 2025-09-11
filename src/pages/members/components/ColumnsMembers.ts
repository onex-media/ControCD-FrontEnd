import { QTableProps } from "quasar";

const columns: QTableProps["columns"] = [
  {
    name: "active",
    align: "left",
    label: "",
    field: "active",
    sortable: false,
  },
  {
    name: "name",
    align: "left",
    label: "Miembro",
    field: "name",
    sortable: false,
  },
  {
    name: "role",
    align: "left",
    label: "Rol",
    field: "parent_id",
    sortable: false,
  },

  // {
  //   name: "address",
  //   align: "left",
  //   label: "Dirección",
  //   field: "address",
  //   sortable: false,
  // },

  {
    name: "email",
    align: "left",
    label: "Contacto",
    field: "email",
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
