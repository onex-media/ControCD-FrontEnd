import { QTableProps } from "quasar";

const columns: QTableProps["columns"] = [
  {
    name: "id",
    align: "left",
    label: "ID",
    field: "id",
    sortable: true,
  },

  {
    name: "name",
    align: "left",
    label: "Ciudad",
    field: "name",
    sortable: true,
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
