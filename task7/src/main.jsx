import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { AuthProvider } from "./context/AuthContext";
import App from "./App.jsx";
import { ConnectivityProvider } from "./context/ConnectivityContext";
import "./styles/global.css";
import "./styles/pwa.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ConnectivityProvider>
        <AuthProvider>
          <HashRouter>
            <App />
          </HashRouter>
        </AuthProvider>
      </ConnectivityProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
