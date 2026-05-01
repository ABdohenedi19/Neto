import { createBrowserRouter } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { DashboardPage } from "../pages/DashboardPage";
import { InvoiceGeneratorPage } from "../pages/InvoiceGeneratorPage";
import { LoginPage } from "../pages/LoginPage";
import { RegisterPage } from "../pages/RegisterPage";
import { ProtectedLayout } from "../layouts/ProtectedLayout";
import { IncomePage } from "../pages/IncomePage";
import { ExpensesPage } from "../pages/ExpensesPage";
import { PricingPage } from "../pages/PricingPage";
import LandingPage from "../pages/LandingPage";
import { ReportsPage } from "../pages/ReportsPage";

export const router = createBrowserRouter([
  { path: "/", element: <LandingPage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
  {
    element: <ProtectedLayout />,
    children: [
      { path: "/dashboard", element: <DashboardPage /> },
      { path: "/income", element: <IncomePage /> },
      { path: "/invoice-generator", element: <InvoiceGeneratorPage /> },
      { path: "/expenses", element: <ExpensesPage /> },
      { path: "/pricing", element: <PricingPage /> },
      {
        path: "/reports",
        element: <ReportsPage />,
      },
      { path: "/app", element: <Navigate to="/dashboard" replace /> },
    ],
  },
]);
