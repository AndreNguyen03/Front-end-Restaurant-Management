// ProfileDropdown.jsx
import React from "react";
import "./ProfileDropdown.css";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ProfileDropdown = ({ setShowLogin }) => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleChangePasswordClick = () => {
    navigate('/change-password');
  }
  const handleLogout = () => {
    logout();
    setShowLogin(false);
  };
  const handleUpdateUserInfoClick = () => {
    navigate('/update-profile');
  }

  return (
    <div className="profile-dropdown">
      <ul>
        <li onClick={handleLogout}>Logout</li>
        <li onClick={handleChangePasswordClick}>Change Password</li>
        <li onClick={handleUpdateUserInfoClick}>Update User Information</li>
      </ul>
    </div>
  );
};

export default ProfileDropdown;