const routes = [
  {
    path: "/",
    component: () => import("src/pages/auth/LoginPage.vue"),
  },
  {
    path: "/demo",
    component: () => import("src/pages/CarouselDemoPage.vue"),
  },
  {
    path: "/login",
    component: () => import("src/pages/auth/LoginPage.vue"),
  },
  {
    path: "/register",
    component: () => import("pages/RegisterPage.vue"),
  },
  {
    path: "/dashboard",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/DashBoardPage.vue"),
        meta: {
          auth: true,
        },
      },
      {
        path: "sellers",
        component: () => import("pages/Sellers/SellersPage.vue"),
        meta: {
          auth: true,
        },
      },
      {
        path: "routes",
        component: () => import("pages/Routes/RoutesPage.vue"),
        meta: {
          auth: true,
        },
      },
      {
        path: "members",
        name: "members",
        component: () => import("pages/members/MembersPage.vue"),
        meta: {
          auth: true,
        },
      },
      {
        path: "clients",
        component: () => import("pages/clients/ClientsPage.vue"),
        meta: {
          auth: true,
        },
      },
      {
        path: "/dashboard/clients/:id",
        name: "clientDetail",
        component: () => import("pages/clients/ClientDetailView.vue"),
      },
      {
        path: "/dashboard/members/:id",
        component: () => import("pages/members/UserDetails.vue"),
        name: "UserDetails",
      },
      {
        path: "/dashboard/credit/:id",
        component: () => import("pages/clients/ClientDetails.vue"),
        name: "ClientDetails",
      },
      {
        path: "creditos",
        component: () => import("pages/credits/CreditPage.vue"),
      },
      {
        path: "liquidaciones",
        component: () => import("pages/LiquidacionesPage.vue"),
      },
      {
        path: "parametros-generales",
        children: [
          {
            path: "",
            component: () => import("pages/parameters/ParametersPage.vue"),
            meta: {
              auth: true,
            },
          },
          {
            path: "ciudades",
            component: () => import("pages/cities/CitiesPage.vue"),
          },
        ],
      },

      {
        path: "banks-cash-flow",
        component: () => import("pages/BanksCashFlowPage.vue"),
      },
      { path: "expenses", component: () => import("pages/ExpensesPage.vue") },
      { path: "payroll", component: () => import("pages/PayrollPage.vue") },
      { path: "schedule", component: () => import("pages/SchedulePage.vue") },
      {
        path: "collection-management",
        component: () => import("pages/CollectionManagementPage.vue"),
      },
      { path: "loans", component: () => import("pages/LoansPage.vue") },
      { path: "savings", component: () => import("pages/SavingsPage.vue") },
      {
        path: "fixed-assets",
        component: () => import("pages/FixedAssetsPage.vue"),
      },
      { path: "debts", component: () => import("pages/DebtsPage.vue") },
      { path: "income", component: () => import("pages/IncomePage.vue") },
      { path: "closings", component: () => import("pages/ClosingsPage.vue") },
      {
        path: "route-record",
        component: () => import("pages/RouteRecordPage.vue"),
      },
      {
        path: "report-center",
        component: () => import("pages/ReportCenterPage.vue"),
      },
      {
        path: "client-collection-management",
        component: () => import("pages/ClientCollectionManagementPage.vue"),
      },
      {
        path: "sales-and-profits-report",
        component: () => import("pages/SalesAndProfitsReportPage.vue"),
      },
      {
        path: "collections-and-movements",
        component: () => import("pages/CollectionsAndMovementsPage.vue"),
      },
      {
        path: "expenses-and-administration",
        component: () => import("pages/ExpensesAndAdministrationPage.vue"),
      },
      {
        path: "schedules-and-programming",
        component: () => import("pages/SchedulesAndProgrammingPage.vue"),
      },
      {
        path: "general-data",
        component: () => import("pages/GeneralDataPage.vue"),
      },
    ],
  },
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
