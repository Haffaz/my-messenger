import { ApolloProvider } from "@apollo/client";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
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
      <UserProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/messages" element={<Messages />} />
          </Routes>
        </BrowserRouter>
      </UserProvider>
    </ApolloProvider>
  </StrictMode>,
);
