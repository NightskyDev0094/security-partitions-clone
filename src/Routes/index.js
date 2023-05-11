import { useRoutes } from "react-router-dom";

// Components
import Setting from "Pages/Setting";

const RoutesComponents = () => {
  const routes = useRoutes([
    {
      path: "/",
      element: <Setting />,
    }
    // {
    //   path: "/contact",
    //   element: <Contact />,
    // },
    // {
    //   path: "/about",
    //   element: <About />,
    // },
    // {
    //   path: "/*",
    //   element: <NotFoundPage />,
    // },
  ]);

  return <>{routes}</>;
};

export default RoutesComponents;
