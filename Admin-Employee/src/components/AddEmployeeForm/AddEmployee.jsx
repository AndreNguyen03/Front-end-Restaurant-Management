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
          error = "Phone number must be exactly 10 digits.";
        }
        break;
      case "socialId":
        if (!/^\d{12}$/.test(value)) {
          error = "Social ID must be exactly 12 digits.";
        }
        break;
      case "username":
        if (value.length > 0 && value.length < 8) {
          error = "Username must be at least 8 characters long.";
        }
        break;
      case "password":
        if (value.length > 0 && value.length < 8) {
          error = "Password must be at least 8 characters long.";
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
          toast.success(response.data.message);
        } else {
          toast.error(response.data.message);
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

    if (data.username && data.username.length < 8) {
      errors.username = "Username must be at least 8 characters long.";
    }

    if (data.password && data.password.length < 8) {
      errors.password = "Password must be at least 8 characters long.";
    }

    return errors;
  };

  return (
    <div className="add-employee-popup">
      <div className="add">
        <form className="flex-col" onSubmit={handleSubmit}>
          <p onClick={() => onEmployeeAdded()} className="emp-close-button">X</p>
          <div className="add-employee-name flex-col">
            <p>Full Name</p>
            <input
              onChange={handleChange}
              value={data.fullName}
              type="text"
              name="fullName"
              placeholder="Type here"
              required
            />
            {errors.fullName && <p className="error">{errors.fullName}</p>}
          </div>
          <div className="add-employee-phone flex-col">
            <p>Phone Number</p>
            <input
              onChange={handleChange}
              value={data.phoneNumber}
              type="text"
              name="phoneNumber"
              placeholder="Type here"
              required
            />
            {errors.phoneNumber && <p className="error">{errors.phoneNumber}</p>}
          </div>
          <div className="add-employee-address flex-col">
            <p>Address</p>
            <input
              onChange={handleChange}
              value={data.address}
              type="text"
              name="address"
              placeholder="Type here"
              required
            />
            {errors.address && <p className="error">{errors.address}</p>}
          </div>
          <div className="add-employee-role flex-col">
            <p>Employee Role</p>
            <select
              name="employeeRole"
              onChange={handleChange}
              value={data.employeeRole}
              required
            >
              <option value="">Select Role</option>
              <option value="Chef">Chef</option>
              <option value="Receptionist">Receptionist</option>
              <option value="Chef Assistant">Chef Assistant</option>
            </select>
            {errors.employeeRole && <p className="error">{errors.employeeRole}</p>}
          </div>
          <div className="add-employee-socialId flex-col">
            <p>Social ID</p>
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
          <div className="add-employee-username flex-col">
            <p>Username</p>
            <input
              onChange={handleChange}
              value={data.username}
              type="text"
              name="username"
              placeholder="Type here"
            />
            {errors.username && <p className="error">{errors.username}</p>}
          </div>
          <div className="add-employee-password flex-col">
            <p>Password</p>
            <input
              onChange={handleChange}
              value={data.password}
              type="password"
              name="password"
              placeholder="Type here"
            />
            {errors.password && <p className="error">{errors.password}</p>}
          </div>
          <button type="submit" className="add-btn">
            Add
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddEmployee;