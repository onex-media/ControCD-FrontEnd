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
        name: "name",
        align: "left",
        label: "Ruta",
        field: "name",
        sortable: false,
    },
    {
        name: "total_credits",
        align: "center",
        label: "Saldo actual",
        field: "total_credits",
        format: (val) => "$" + val,
        sortable: false,
    },
    {
        name: "user_routes",
        align: "center",
        classes: "text-bold",
        label: "Miembros",
        field: (row) => row.user_routes.length,
        sortable: false,
    },
    {
        name: "credits",
        align: "left",
        label: "Créditos",
        field: "credits",
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