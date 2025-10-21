import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@/shared/assets/css/index.css";
import { RouterProvider } from "react-router-dom";
import { router } from "@/shared/routers/index.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
