import { QTableProps } from "quasar";

const columns: QTableProps["columns"] = [
  {
    name: "client_name",
    align: "left",
    label: "Cliente",
    field: (row) => row.client.name,
    sortable: true,
  },

  {
    name: "address",
    align: "left",
    label: "Dirección",
    field: "address",
    sortable: true,
  },
  {
    name: "sector_name",
    align: "left",
    label: "Sector",
    field: "sector_name",
    sortable: true,
  },

  {
    name: "total_credit_value",
    align: "left",
    label: "Valor total Crédito",
    field: "total_credit_value",
    sortable: true,
  },
  {
    name: "acciones",
    align: "right",
    label: "Acciones",
    field: () => null,
    sortable: false,
  },
];

export { columns };
