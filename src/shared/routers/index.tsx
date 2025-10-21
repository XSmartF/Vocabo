import { createBrowserRouter } from "react-router-dom";
import DefaultLayout from "../layouts/default";
import AdminLayout from "../layouts/admin";
import Home from "@/features/home/pages";
import Library from "@/features/library/pages";
import Auth from "@/features/auth/pages";
import ForgetPassword from "@/features/auth/pages/ForgetPassword";
import Learn from "@/features/learn/pages";
import Notes from "@/features/notes/pages";

export const router = createBrowserRouter([
  {
    path: "/auth",
    element: <DefaultLayout />,
    children: [
      { index: true, element: <Auth /> },
      { path: "forget-password", element: <ForgetPassword /> },
    ],
  },
  {
    path: "/",
    element: <AdminLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "libraries", element: <Library /> },
      { path: "learn", element: <Learn /> },
      { path: "notes", element: <Notes /> },
    ],
  },
]);
