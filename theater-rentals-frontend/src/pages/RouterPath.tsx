import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import Layout from "./Layout";
import Production from "./Production";
import Rentals from "./Rentals";

const RouterPath = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <Navigate to="/production" />,
        },
        {
          path: "/rentals",
          element: <Rentals />,
        },
        {
          path: "/production",
          element: <Production />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};
export default RouterPath;
