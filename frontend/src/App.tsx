import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import './App.css';
import Navbar from "./components/Navbar";
import { useAuth, AuthProvider } from "./auth/AuthContext";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ExhibitionListPage from "./pages/ExhibitionListPage";
import ExhibitionFormPage from "./pages/ExhibitionFormPage";
import BookingListPage from "./pages/BookingListPage";
import BookingFormPage from "./pages/BookingFormPage";
import type { ReactNode } from "react";

// Private Route
function PrivateRoute({
  children,
  roles,
}: {
  children: ReactNode;
  roles?: string[];
}) {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <div>Unauthorized</div>;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <div style={{ padding: 20 }}>
          <Routes>
            <Route path="/" element={<ExhibitionListPage />} />

            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            <Route
              path="/exhibitions/new"
              element={
                <PrivateRoute roles={["admin"]}>
                  <ExhibitionFormPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/exhibitions/:id/edit"
              element={
                <PrivateRoute roles={["admin"]}>
                  <ExhibitionFormPage />
                </PrivateRoute>
              }
            />

            <Route
              path="/bookings"
              element={
                <PrivateRoute roles={["admin", "member"]}>
                  <BookingListPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/bookings/new"
              element={
                <PrivateRoute roles={["member"]}>
                  <BookingFormPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/bookings/:id/edit"
              element={
                <PrivateRoute roles={["admin", "member"]}>
                  <BookingFormPage />
                </PrivateRoute>
              }
            />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
