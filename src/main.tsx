import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./index.css";
import "@ant-design/v5-patch-for-react-19";
import { BrowserRouter } from "react-router-dom";
import AppRouter from "./AppRouter.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "antd/dist/reset.css";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AppRouter />
        <ReactQueryDevtools />
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>
);
