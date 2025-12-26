import { Navigate, Route, Routes } from "react-router"
import { useAuth } from "@clerk/clerk-react";
import LoginPage from "./pages/auth/LoginPage"
import DashboardPage from "./pages/dashboard/DashboardPage";
import ProductPage from "./pages/product/ProductPage";
import OrdersPage from "./pages/product/OrdersPage";
import CustomersPage from "./pages/product/CustomersPage";
import DashboardLayout from "./layouts/Dashboard/DashboardLayout";
import LoaderPage from "./components/Loader/LoaderPage";

const App =() => {

  const {isSignedIn, isLoaded} = useAuth();

  if(!isLoaded) {
    return LoaderPage();
  };

  return (
    <Routes>
      <Route path="/login" element={isSignedIn ? <Navigate to="/dashboard" /> : <LoginPage />} />

      <Route path="/" element={isSignedIn ? <DashboardLayout /> : <Navigate to="/login" />}>
        <Route index element={<Navigate to={"dashboard"} />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="products" element={<ProductPage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="customers" element={<CustomersPage />} />
      </Route>
    </Routes>
  )
}

export default App
