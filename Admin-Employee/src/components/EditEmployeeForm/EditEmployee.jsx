import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./EditEmployee.css";

const EditEmployee = ({ onEmployeeEdited, employeeId }) => {
  const url = "http://localhost:3056";
  const [data, setData] = useState({
    fullName: "",
    phoneNumber: "",
    address: "",
    employeeRole: "",
    socialId: "",
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
          error = "Phone number must be exactly 10 digits.";
        }
        break;
      case "socialId":
        if (!/^\d{12}$/.test(value)) {
          error = "Social ID must be exactly 12 digits.";
        }
        break;
      case "fullName":
        if (value.length < 1) {
          error = "Full name is required.";
        }
        break;
      case "address":
        if (value.length < 1) {
          error = "Address is required.";
        }
        break;
      case "employeeRole":
        if (value.length < 1) {
          error = "Employee role is required.";
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
        id: employeeId,
        fullName: data.fullName,
        phoneNumber: data.phoneNumber,
        address: data.address,
        employeeRole: data.employeeRole,
        socialId: data.socialId,
      };

      try {
        const response = await axios.post(`${url}/api/employee/edit`, payload, {
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
          });
          toast.success("Cập nhật thông tin nhân viên thành công");
          onEmployeeEdited();
        } else {
          toast.error("Lỗi khi cập nhật thông tin nhân viên");
        }
      } catch (error) {
        if (error.response) {
          console.error("Error response:", error.response.data);
          toast.error(error.response.data.message || "An error occurred");
        } else if (error.request) {
          console.error("Error request:", error.request);
          toast.error("No response from server");
        } else {
          console.error("Error message:", error.message);
          toast.error("An error occurred");
        }
      }
    } else {
      console.log("Form submission failed due to validation errors.");
    }
  };

  const validateForm = (data) => {
    const errors = {};

    if (!data.fullName) {
      errors.fullName = "Full name is required.";
    }

    if (!data.address) {
      errors.address = "Address is required.";
    }

    if (!data.employeeRole) {
      errors.employeeRole = "Employee role is required.";
    }

    if (!/^\d{10}$/.test(data.phoneNumber)) {
      errors.phoneNumber = "Phone number must be exactly 10 digits.";
    }

    if (!/^\d{12}$/.test(data.socialId)) {
      errors.socialId = "Social ID must be exactly 12 digits.";
    }

    return errors;
  };

  const isFormValid = () => {
    return (
      data.fullName &&
      data.phoneNumber &&
      data.address &&
      data.employeeRole &&
      data.socialId &&
      !errors.phoneNumber &&
      !errors.socialId
    );
  };

  useEffect(() => {
    const fetchEmployee = async (id) => {
      const response = await axios.post(`${url}/api/employee/listSpecific`, { id });
      setData({
        fullName: response.data.data.full_name,
        phoneNumber: response.data.data.phone_number,
        address: response.data.data.address,
        employeeRole: response.data.data.employee_role,
        socialId: response.data.data.socialId,
      });
    };
    fetchEmployee(employeeId);
  }, [employeeId]);

  return (
    <div className="add-employee-popup">
      <div className="add">
        <form className="flex-col" onSubmit={handleSubmit}>
          <p onClick={() => onEmployeeEdited()} className="emp-close-button">X</p>
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
              placeholder="Type here"
              required
            />
            {errors.socialId && <p className="error">{errors.socialId}</p>}
          </div>
          <button type="submit" className="add-btn" disabled={!isFormValid()}>
            Cập nhật thông tin nhân viên
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditEmployee;