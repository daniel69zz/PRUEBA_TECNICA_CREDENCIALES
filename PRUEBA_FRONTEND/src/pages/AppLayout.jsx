import { Toaster } from "react-hot-toast";
import Navbar from "../components/Navbar";
import AppRoutes from "../routes/routes";

function AppLayout() {
  return (
    <div className="app">
      <Navbar />
      <main className="main-content">
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#363636",
              color: "#fff",
              borderRadius: "10px",
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: "#10b981",
                secondary: "#fff",
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: "#ef4444",
                secondary: "#fff",
              },
            },
          }}
        />
        <AppRoutes />
      </main>
    </div>
  );
}

export default AppLayout;
