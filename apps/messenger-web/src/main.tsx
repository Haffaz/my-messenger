import { ApolloProvider } from "@apollo/client";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { UserProvider } from "./contexts/UserContext";
import "./index.css";
import { apolloClient } from "./lib/apollo";
import Login from "./pages/Login";
import Messages from "./pages/Messages";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Failed to find the root element");
}

const root = createRoot(rootElement);
root.render(
  <StrictMode>
    <ApolloProvider client={apolloClient}>
      <BrowserRouter>
        <UserProvider>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/messages" element={<Messages />} />
          </Routes>
        </UserProvider>
      </BrowserRouter>
    </ApolloProvider>
  </StrictMode>,
);
