import React, { useState, useContext } from "react";
import "./Navbar.css";
import { assets } from "../../assets/frontend_assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";
import ProfileDropdown from "../ProfileDropdown/ProfileDropdown";

const Navbar = ({ setShowLogin }) => {
  const [menu, setMenu] = useState("contact-us");
  const { getTotalCartAmount } = useContext(StoreContext);
  const { isAuthenticated } = useContext(AuthContext);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    if (isAuthenticated) {
      navigate(path);
    } else {
      toast.error("You must be logged in to access this page.");
      setShowLogin(true);
    }
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <div className="navbar">
      <Link to="/">
        <img src={assets.logo} alt="" className="logo" />
      </Link>
      <ul className="navbar-menu">
        <Link
          to="/"
          onClick={() => setMenu("home")}
          className={menu === "home" ? "active" : ""}
        >
          home
        </Link>
        <a
          href="#"
          onClick={() => handleNavigation("/comment")}
          className={menu === "comment" ? "active" : ""}
        >
          comment
        </a>
        <a
          href="#"
          onClick={() => handleNavigation("/reservation")}
          className={menu === "reservation" ? "active" : ""}
        >
          reservation
        </a>
      </ul>

      <div className="navbar-right">
        <img src={assets.search_icon} alt="" />
        <div className="navbar-search-icon">
          <Link to="/cart">
            <img src={assets.basket_icon} alt="" />
          </Link>
          <div className={getTotalCartAmount() === 0 ? '' : 'dot'}></div>
        </div>
        {isAuthenticated ? (
          <div className="profile-container">
            <img
              src={assets.profile_icon}
              alt="User"
              className="user-icon"
              onClick={toggleDropdown}
            />
            {showDropdown && <ProfileDropdown setShowLogin={setShowLogin} />}
          </div>
        ) : (
          <button onClick={() => setShowLogin(true)}>sign in</button>
        )}
      </div>
    </div>
  );
};

export default Navbar;