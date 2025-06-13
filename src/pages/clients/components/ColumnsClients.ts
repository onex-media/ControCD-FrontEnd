import { QTableProps } from "quasar";

const columns: QTableProps["columns"] = [
    {
        name: "avatar",
        align: "left",
        label: "Avatar",
        field: "avatar",
        sortable: false,
    },
    {
        name: "name",
        align: "left",
        label: "Nombre",
        field: "name",
        sortable: false,
    },
    {
        name: "dni",
        align: "left",
        label: "DNI",
        field: "dni",
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
        name: "phone",
        align: "left",
        label: "Teléfono",
        field: "phone",
        sortable: false,
    },
    {
        name: "email",
        align: "left",
        label: "Email",
        field: "email",
        sortable: false,
    },
    {
        name: "created_at",
        align: "left",
        label: "Fecha de Creación",
        field: "created_at",
        sortable: false,
    },
    {
        name: "images",
        align: "left",
        label: "Imágenes",
        field: "images",
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