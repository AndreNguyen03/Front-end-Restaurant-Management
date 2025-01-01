import "./Sidebar.css";
import "../../assets/admin_assets/assets";
import { assets } from "../../assets/admin_assets/assets";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Sidebar = () => {
  const { role } = useAuth();

  const links = {
    admin: [
      { to: "/revenue", label: "Revenue", icon: assets.revenue_icon },
      { to: "/list", label: "Dishes", icon: assets.dish_icon },
      { to: "/table", label: "Tables", icon: assets.table_icon },
      {
        to: "/ingredients",
        label: "Ingredients",
        icon: assets.ingredient_icon,
      },
      { to: "/employees", label: "employee", icon: assets.employee_icon },
      { to: "/purchases", label: "Purchases", icon: assets.purchase_icon },
    ],
    employee: [
      { to: "/orders", label: "Orders", icon: assets.order_icon },
      { to: "/tableservice", label: "Table", icon: assets.table_icon },
      { to: "/invoice", label: "Invoice", icon: assets.payment_icon },
      { to: "/reservation", label: "Reservation", icon: assets.reser_icon },
    ],
  };

  return (
    <div className="sidebar">
      <div className="sidebar-options">
        {links[role]?.map((link, index) => (
          <NavLink key={index} to={link.to} className="sidebar-option">
            <img src={link.icon} alt="" />
            <p>{link.label}</p>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
