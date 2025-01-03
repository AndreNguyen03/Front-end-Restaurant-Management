import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./AddEmployee.css";

const AddEmployee = ({ onEmployeeAdded }) => {
  const url = "http://localhost:3056";
  const [data, setData] = useState({
    fullName: "",
    phoneNumber: "",
    address: "",
    employeeRole: "",
    socialId: "",
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value,
    });

    // Validate the input as the user types
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "phoneNumber":
        if (!/^\d{10}$/.test(value)) {
          error = "Số điện thoại phải có đúng 10 chữ số.";
        }
        break;
      case "socialId":
        if (!/^\d{12}$/.test(value)) {
          error = "Số định danh phải có đúng 12 chữ số.";
        }
        break;
      case "username":
        if (value.length > 0 && value.length < 8) {
          error = "Tên người dùng phải có ít nhất 8 ký tự.";
        }
        break;
      case "password":
        if (value.length > 0 && value.length < 8) {
          error = "Mật khẩu phải có ít nhất 8 ký tự.";
        }
        break;
      default:
        break;
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm(data);
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const payload = {
        fullName: data.fullName,
        phoneNumber: data.phoneNumber,
        address: data.address,
        employeeRole: data.employeeRole,
        socialId: data.socialId,
        username: data.username,
        password: data.password,
      };

      try {
        const response = await axios.post(`${url}/api/eAuth/register`, payload, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.data.success) {
          setData({
            fullName: "",
            phoneNumber: "",
            address: "",
            employeeRole: "",
            socialId: "",
            username: "",
            password: "",
          });
          toast.success("Thêm nhân viên mới thành công");
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        if (error.response) {
          console.error("Error response:", error.response.data);
          toast.error(error.response.data.message || "Đã xảy ra lỗi");
        } else if (error.request) {
          console.error("Error request:", error.request);
          toast.error("Không có phản hồi từ máy chủ");
        } else {
          console.error("Error message:", error.message);
          toast.error("Đã xảy ra lỗi");
        }
      }
    } else {
      console.log("Form submission failed due to validation errors.");
    }
  };

  const validateForm = (data) => {
    const errors = {};

    if (!data.fullName) {
      errors.fullName = "Họ và tên là bắt buộc.";
    }

    if (!data.address) {
      errors.address = "Địa chỉ là bắt buộc.";
    }

    if (!data.employeeRole) {
      errors.employeeRole = "Vai trò là bắt buộc.";
    }

    if (!/^\d{10}$/.test(data.phoneNumber)) {
      errors.phoneNumber = "Số điện thoại phải có đúng 10 chữ số.";
    }

    if (!/^\d{12}$/.test(data.socialId)) {
      errors.socialId = "Số định danh phải có đúng 12 chữ số.";
    }

    if (data.username && data.username.length < 8) {
      errors.username = "Tên người dùng phải có ít nhất 8 ký tự.";
    }

    if (data.password && data.password.length < 8) {
      errors.password = "Mật khẩu phải có ít nhất 8 ký tự.";
    }

    return errors;
  };

  return (
    <div className="add-employee-popup">
      <div className="add">
        <form className="flex-col" onSubmit={handleSubmit}>
          <p onClick={() => onEmployeeAdded()} className="emp-close-button">X</p>
          <div className="add-employee-name flex-col">
            <p>Họ và tên</p>
            <input
              onChange={handleChange}
              value={data.fullName}
              type="text"
              name="fullName"
              placeholder="Nhập tên nhân viên"
              required
            />
            {errors.fullName && <p className="error">{errors.fullName}</p>}
          </div>
          <div className="add-employee-phone flex-col">
            <p>Số điện thoại</p>
            <input
              onChange={handleChange}
              value={data.phoneNumber}
              type="text"
              name="phoneNumber"
              placeholder="Nhập số điện thoại"
              required
            />
            {errors.phoneNumber && <p className="error">{errors.phoneNumber}</p>}
          </div>
          <div className="add-employee-address flex-col">
            <p>Địa chỉ</p>
            <input
              onChange={handleChange}
              value={data.address}
              type="text"
              name="address"
              placeholder="Nhập địa chỉ"
              required
            />
            {errors.address && <p className="error">{errors.address}</p>}
          </div>
          <div className="add-employee-role flex-col">
            <p>Vai trò</p>
            <select
              name="employeeRole"
              onChange={handleChange}
              value={data.employeeRole}
              required
            >
              <option value="">Chọn vai trò</option>
              <option value="Đầu bếp">Đầu bếp</option>
              <option value="Lễ tân">Lễ tân</option>
              <option value="Phụ bếp">Phụ bếp</option>
            </select>
            {errors.employeeRole && <p className="error">{errors.employeeRole}</p>}
          </div>
          <div className="add-employee-socialId flex-col">
            <p>Số định danh</p>
            <input
              onChange={handleChange}
              value={data.socialId}
              type="text"
              name="socialId"
              placeholder="Nhập số định danh"
              required
            />
            {errors.socialId && <p className="error">{errors.socialId}</p>}
          </div>
          <div className="add-employee-username flex-col">
            <p>Tên người dùng</p>
            <input
              onChange={handleChange}
              value={data.username}
              type="text"
              name="username"
              placeholder="Nhập tên người dùng"
            />
            {errors.username && <p className="error">{errors.username}</p>}
          </div>
          <div className="add-employee-password flex-col">
            <p>Mật khẩu</p>
            <input
              onChange={handleChange}
              value={data.password}
              type="password"
              name="password"
              placeholder="Nhập mật khẩu"
            />
            {errors.password && <p className="error">{errors.password}</p>}
          </div>
          <button type="submit" className="add-btn">
            Thêm nhân viên
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddEmployee;