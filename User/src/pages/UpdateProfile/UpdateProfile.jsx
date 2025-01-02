import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./UpdateProfile.css";

const UpdateProfile = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
  });
  const [initialData, setInitialData] = useState({});
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isFormDirty, setIsFormDirty] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3056/api/cAuth/profile",
          {
            withCredentials: true,
          }
        );

        if (response.data.success) {
          const { data } = response.data;
          const userData = {
            fullName: data.fullName || "",
            phoneNumber: data.phoneNumber || "",
            email: data.email || "",
          };
          setFormData(userData);
          setInitialData(userData);
        }
      } catch (error) {
        toast.error("Failed to fetch profile");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "fullName":
        if (!value) error = "Name is required";
        else if (value.length > 134)
          error = "Name must be less than 134 characters";
        break;
      case "phoneNumber":
        if (!value) error = "Phone number is required";
        else if (!/^\d{10}$/.test(value))
          error = "Phone number must be exactly 10 digits";
        break;
      case "email":
        if (!value) error = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(value)) error = "Email is invalid";
        break;
      default:
        break;
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFormData = {
      ...formData,
      [name]: value,
    };
    setFormData(newFormData);

    // Validate field
    const error = validateField(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));

    // Check if form is dirty
    const isDirty = Object.keys(newFormData).some(
      (key) => newFormData[key] !== initialData[key]
    );
    setIsFormDirty(isDirty);
  };

  const isFormValid = () => {
    return (
      isFormDirty &&
      Object.keys(errors).length === 0 &&
      Object.values(formData).every((value) => value.trim() !== "")
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      axios.defaults.withCredentials = true;
      const response = await axios.post(
        "http://localhost:3056/api/cAuth/updateprofile",
        {
          fullName: formData.fullName,
          phoneNumber: formData.phoneNumber,
          email: formData.email,
        }
      );

      if (response.data.success) {
        toast.success("Profile updated successfully");
        setInitialData(formData);
        setIsFormDirty(false);
        setTimeout(() => {
          window.location.reload();
        }, 500);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="update-profile-container">
      <h2>Cập nhật hồ sơ</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-field">
          <label>Họ và tên:</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            maxLength={134}
            required
          />
          {errors.fullName && <p className="error">{errors.fullName}</p>}
        </div>

        <div className="input-field">
          <label>Số điện thoại:</label>
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            maxLength={10}
            required
          />
          {errors.phoneNumber && <p className="error">{errors.phoneNumber}</p>}
        </div>

        <div className="input-field">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          {errors.email && <p className="error">{errors.email}</p>}
        </div>

        <button
          type="submit"
          className={`update-button ${!isFormDirty ? "disabled" : ""}`}
        >
          Cập nhật
        </button>
      </form>
    </div>
  );
};

export default UpdateProfile;
