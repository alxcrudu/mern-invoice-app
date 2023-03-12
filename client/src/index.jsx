import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import AuthProvider from "./context/AuthProvider";
import ThemeProvider from "./context/ThemeProvider";
import ModalProvider from "./context/ModalProvider";
import InvoiceProvider from "./context/InvoiceProvider";
import ProfileProvider from "./context/ProfileProvider";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ProfileProvider>
          <ThemeProvider>
            <ModalProvider>
              <InvoiceProvider>
                <App />
              </InvoiceProvider>
            </ModalProvider>
          </ThemeProvider>
        </ProfileProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);

