import { Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import PrivateRoute from "../components/PrivateRoute";
import Login from "../components/login";
import Register from "../components/Register";
import CredentialList from "../components/CredentialList";
import CredentialForm from "../components/CredentialForm";
import CredentialDetail from "../components/CredentialDetail";

function AppRoutes() {
  return (
    <AnimatePresence mode="wait">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <CredentialList />
            </PrivateRoute>
          }
        />
        <Route
          path="/crear"
          element={
            <PrivateRoute>
              <CredentialForm />
            </PrivateRoute>
          }
        />
        <Route
          path="/editar/:id"
          element={
            <PrivateRoute>
              <CredentialForm />
            </PrivateRoute>
          }
        />
        <Route
          path="/detalle/:id"
          element={
            <PrivateRoute>
              <CredentialDetail />
            </PrivateRoute>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

export default AppRoutes;
