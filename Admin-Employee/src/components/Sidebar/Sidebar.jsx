import "./Sidebar.css";
import "../../assets/admin_assets/assets";
import { assets } from "../../assets/admin_assets/assets";
import {NavLink} from 'react-router-dom'
const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-options">
       
        <NavLink to='/list' className="sidebar-option">
          <img src={assets.order_icon} alt="" />
          <p>Dishes</p>
        </NavLink>
        <NavLink to='/orders' className="sidebar-option">
          <img src={assets.order_icon} alt="" />
          <p>Orders </p>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
