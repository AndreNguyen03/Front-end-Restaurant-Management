import React, { useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./LoginPopup.css";
import { assets } from "../../assets/frontend_assets/assets";
import { AuthContext } from "../../context/AuthContext";

const LoginPopup = ({ setShowLogin }) => {
  const [currState, setCurrState] = useState("Đăng nhập");
  const reg_url = "http://localhost:3056/api/cAuth/register";
  const otp_url = "http://localhost:3056/api/cAuth/getOTP";
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    username: "",
    password: "",
    otp: "",
    otpId: "",
  });

  const { login } = useContext(AuthContext);
  const [errors, setErrors] = useState({});
  const [termsChecked, setTermsChecked] = useState(false);

  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "email":
        if (!value) {
          error = "Email is required.";
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          error = "Email is invalid.";
        }
        break;
      case "phoneNumber":
        if (!value) {
          error = "Phone number is required.";
        } else if (!/^\d+$/.test(value)) {
          error = "Phone number must contain only digits.";
        } else if (value.length !== 10) {
          error = "Phone number must be exactly 10 digits.";
        }
        break;
      case "username":
        if (!value) {
          error = "Username is required.";
        } else if (value.length < 8) {
          error = "Username must be at least 8 characters long.";
        }
        break;
      case "password":
        if (!value) {
          error = "Password is required.";
        } else if (value.length < 8) {
          error = "Password must be at least 8 characters long.";
        }
        break;
      case "name":
        if (!value) {
          error = "Name is required.";
        }
        break;
      default:
        break;
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));

    return error;
  };

  // Update handleChange to validate immediately
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (currState === "Đăng ký") {
      validateField(name, value);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (currState === "Đăng ký") {
      if (!formData.name) newErrors.name = "Name is required.";
      if (!formData.email) {
        newErrors.email = "Email is required.";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Email is invalid.";
      }
      if (!formData.phoneNumber) {
        newErrors.phoneNumber = "Phone number is required.";
      } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
        newErrors.phoneNumber = "Phone number must be exactly 10 digits.";
      }
      if (!formData.username) {
        newErrors.username = "Username is required.";
      } else if (formData.username.length < 8) {
        newErrors.username = "Username must be at least 8 characters long.";
      }
      if (!formData.password) {
        newErrors.password = "Password is required.";
      } else if (formData.password.length < 8) {
        newErrors.password = "Password must be at least 8 characters long.";
      }
      if (!termsChecked) {
        newErrors.terms = "You must agree to the terms and conditions.";
      }
    }
    return newErrors;
  };

  const handleSendOtp = async () => {
    if (!formData.email) {
      toast.error("Please enter your email");
      return;
    }

    try {
      const response = await axios.post(otp_url, {
        email: formData.email,
      });
      
      if (response.data.success) {
        toast.success(response.data.message); // Will show "Đã gửi OTP qua email"
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      // Handle specific error responses from server
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to send OTP");
      }
    }
};

  const handleRegister = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {

      const response = await axios.post(reg_url, {
        fullName: formData.name,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        username: formData.username,
        password: formData.password,
        otp: formData.otp,
      });
      if (response.data.success) {
        toast.success(response.data.message);
        setShowLogin(false);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message || "An error occurred");
      } else if (error.request) {
        toast.error("No response from server");
      } else {
        toast.error("An error occurred");
      }
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const response = await login(formData.username, formData.password);
    if (response.success) {
      setShowLogin(false);
    } else {
      toast.error(response.message);
    }
  };

  return (
    <div className="login-popup">
      <form
        className="login-popup-container"
        onSubmit={currState === "Đăng ký" ? handleRegister : handleLogin}
      >
        <div className="login-popup-title">
          <h2>{currState}</h2>
          <img
            src={assets.cross_icon}
            onClick={() => setShowLogin(false)}
            alt=""
          />
        </div>
        <div className="login-popup-inputs">
          {currState === "Đăng ký" ? (
            <>
              <input
                type="text"
                name="name"
                placeholder="Họ và tên"
                value={formData.name}
                onChange={handleChange}
                required
              />
              {errors.name && <p className="error">{errors.name}</p>}
              <div className="input-with-button">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="otp-button"
                  onClick={handleSendOtp}
                >
                  Gửi OTP
                </button>
              </div>
              {errors.email && <p className="error">{errors.email}</p>}
              <input
                type="text"
                name="otp"
                placeholder="Nhập mã OTP"
                value={formData.otp}
                onChange={handleChange}
                required
              />
              {errors.otp && <p className="error">{errors.otp}</p>}
              <input
                type="tel"
                name="phoneNumber"
                placeholder="Số điện thoại"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
              />
              {errors.phoneNumber && (
                <p className="error">{errors.phoneNumber}</p>
              )}
            </>
          ) : null}

          <input
            type="text"
            name="username"
            placeholder="Tên người dùng"
            value={formData.username}
            onChange={handleChange}
            required
          />
          {errors.username && <p className="error">{errors.username}</p>}
          <input
            type="password"
            name="password"
            placeholder="Mật khẩu"
            value={formData.password}
            onChange={handleChange}
            required
          />
          {errors.password && <p className="error">{errors.password}</p>}
        </div>
        <button type="submit">
          {currState === "Đăng ký" ? "Tạo tài khoản" : "Đăng nhập"}
        </button>
        {currState === "Đăng ký" && (
          <div className="login-popup-condition">
            <input
              type="checkbox"
              checked={termsChecked}
              onChange={() => setTermsChecked(!termsChecked)}
              required
            />
            <p>Tôi đồng ý với các điều khoản sử dụng và chính sách quyền riêng tư</p>
            {errors.terms && <p className="error">{errors.terms}</p>}
          </div>
        )}
        {currState === "Đăng nhập" ? (
          <p>
            Tạo tài khoản mới?{" "}
            <span onClick={() => setCurrState("Đăng ký")}>Đăng ký</span>
          </p>
        ) : (
          <p>
            Đã có tài khoản?{" "}
            <span onClick={() => setCurrState("Đăng nhập")}>Đăng nhập</span>
          </p>
        )}
      </form>
    </div>
  );
};

export default LoginPopup;
