import { QTableProps } from "quasar";

const columns: QTableProps["columns"] = [
  {
    name: "id",
    align: "left",
    label: "",
    field: "id",
    sortable: false,
  },
  {
    name: "client",
    align: "left",
    label: "Cliente",
    field: "name",
    sortable: false,
  },
  {
    name: "address",
    align: "left",
    label: "Dirección",
    field: "address",
    sortable: false,
  },
  {
    name: "contact",
    align: "left",
    label: "Contacto",
    field: "email",
    sortable: false,
  },
  {
    name: "company",
    align: "left",
    label: "Empresa",
    field: "company",
    sortable: false,
  },
  {
    name: "total_credit",
    align: "right",
    label: "Valor total créditos",
    field: "total_credit",
    sortable: false,
  },
];

const columnsMobile: QTableProps["columns"] = [
  {
    name: "client",
    align: "left",
    label: "Clientes",
    field: "client",
    sortable: false,
  },
];

export { columns, columnsMobile };
