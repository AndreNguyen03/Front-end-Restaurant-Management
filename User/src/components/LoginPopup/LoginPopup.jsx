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
          error = "Email là bắt buộc.";
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          error = "Email không hợp lệ.";
        }
        break;
      case "phoneNumber":
        if (!value) {
          error = "Số điện thoại là bắt buộc.";
        } else if (!/^\d+$/.test(value)) {
          error = "Số điện thoại chỉ được chứa chữ số.";
        } else if (value.length !== 10) {
          error = "Số điện thoại phải có đúng 10 chữ số.";
        }
        break;
      case "username":
        if (!value) {
          error = "Tên người dùng là bắt buộc.";
        } else if (value.length < 8) {
          error = "Tên người dùng phải có ít nhất 8 ký tự.";
        }
        break;
      case "password":
        if (!value) {
          error = "Mật khẩu là bắt buộc.";
        } else if (value.length < 8) {
          error = "Mật khẩu phải có ít nhất 8 ký tự.";
        }
        break;
      case "name":
        if (!value) {
          error = "Họ và tên là bắt buộc.";
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
      if (!formData.name) newErrors.name = "Họ và tên là bắt buộc.";
      if (!formData.email) {
        newErrors.email = "Email là bắt buộc.";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Email không hợp lệ.";
      }
      if (!formData.phoneNumber) {
        newErrors.phoneNumber = "Số điện thoại là bắt buộc.";
      } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
        newErrors.phoneNumber = "Số điện thoại phải có đúng 10 chữ số.";
      }
      if (!formData.username) {
        newErrors.username = "Tên người dùng là bắt buộc.";
      } else if (formData.username.length < 8) {
        newErrors.username = "Tên người dùng phải có ít nhất 8 ký tự.";
      }
      if (!formData.password) {
        newErrors.password = "Mật khẩu là bắt buộc.";
      } else if (formData.password.length < 8) {
        newErrors.password = "Mật khẩu phải có ít nhất 8 ký tự.";
      }
      if (!termsChecked) {
        newErrors.terms = "Bạn phải đồng ý với các điều khoản và điều kiện.";
      }
    }
    return newErrors;
  };

  const handleSendOtp = async () => {
    if (!formData.email) {
      toast.error("Vui lòng nhập email của bạn");
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
        toast.error("Gửi OTP thất bại");
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
        toast.error(error.response.data.message || "Đã xảy ra lỗi");
      } else if (error.request) {
        toast.error("Không có phản hồi từ máy chủ");
      } else {
        toast.error("Đã xảy ra lỗi");
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