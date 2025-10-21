import { createBrowserRouter } from "react-router-dom";
import DefaultLayout from "../layouts/default";
import AdminLayout from "../layouts/admin";
import Home from "@/features/home/pages";
import Library from "@/features/library/pages";
import Auth from "@/features/auth/pages";
import ForgetPassword from "@/features/auth/pages/ForgetPassword";
import Learn from "@/features/learn/pages";
import Notes from "@/features/notes/pages";
import Profile from "@/features/profile/pages";
import { ROUTES } from "@/shared/constants/route-paths";

export const router = createBrowserRouter([
  {
    path: ROUTES.AUTH,
    element: <DefaultLayout />,
    children: [
      { index: true, element: <Auth /> },
      { path: "forget-password", element: <ForgetPassword /> },
    ],
  },
  {
    path: ROUTES.HOME,
    element: <AdminLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: ROUTES.LIBRARIES.replace("/", ""), element: <Library /> },
      { path: ROUTES.LEARN.replace("/", ""), element: <Learn /> },
      { path: ROUTES.NOTES.replace("/", ""), element: <Notes /> },
      { path: ROUTES.PROFILE.replace("/", ""), element: <Profile /> },
    ],
  },
]);
