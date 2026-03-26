import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { OutletProvider } from "./context/OutletContext";

import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import MenuPage from "./pages/MenuPage";
import CheckoutPage from "./pages/CheckoutPage";
import AddressPage from "./pages/AddressPage";
import PaymentPage from "./pages/PaymentPage";
import OrderSuccessPage from "./pages/OrderSuccessPage";
import AdminPage from "./pages/AdminPage";

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/auth" replace />;
}

function AppRoutes() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/auth" element={user ? <Navigate to="/" replace /> : <AuthPage />} />
      <Route path="/" element={<ProtectedRoute><LandingPage /></ProtectedRoute>} />
      <Route path="/menu" element={<ProtectedRoute><MenuPage /></ProtectedRoute>} />
      <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
      <Route path="/address" element={<ProtectedRoute><AddressPage /></ProtectedRoute>} />
      <Route path="/payment" element={<ProtectedRoute><PaymentPage /></ProtectedRoute>} />
      <Route path="/order-success" element={<ProtectedRoute><OrderSuccessPage /></ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <OutletProvider>
          <CartProvider>
            <AppRoutes />
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  fontFamily: "'Outfit', sans-serif",
                  borderRadius: "12px",
                  background: "#1a1a2e",
                  color: "#fff",
                },
              }}
            />
          </CartProvider>
        </OutletProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
