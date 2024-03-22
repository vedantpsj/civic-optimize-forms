import { NavLink, Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="theaterData py-4">
      <div className="container">
        <ul className="nav nav-tabs bg-white">
          <li className="nav-item">
            <NavLink
              className={({ isActive }) =>
                [isActive ? "active nav-link" : "nav-link"].join(" ")
              }
              to="production"
            >
              Theater Production
            </NavLink>
          </li>

          <li className="nav-item">
            <NavLink
              className={({ isActive }) =>
                [isActive ? "active nav-link" : "nav-link"].join(" ")
              }
              to="/rentals"
            >
              Theater Rental
            </NavLink>
          </li>
        </ul>
        <Outlet />
      </div>
    </div>
  );
};
export default Layout;
