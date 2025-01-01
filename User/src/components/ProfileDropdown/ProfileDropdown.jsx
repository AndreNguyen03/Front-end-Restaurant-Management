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

  const handleUpdateAddress = () => {
    navigate('/update-address');
  }

  
  return (
    <div className="profile-dropdown">
      <ul>
        <li onClick={handleLogout}>Đăng Xuất</li>
        <li onClick={handleChangePasswordClick}>Đối Mật Khẩu</li>
        <li onClick={handleUpdateUserInfoClick}>Cập nhật thông tin</li>
        <li onClick={handleUpdateAddress}>Cập nhật địa chỉ</li>
      </ul>
    </div>
  );
};

export default ProfileDropdown;