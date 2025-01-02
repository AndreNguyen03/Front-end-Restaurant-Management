import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Reservation.css";

const Reservation = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    date: "",
    time: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");

  const today = new Date().toISOString().split("T")[0];

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponseMessage("");

    const reservationData = {
      name: formData.fullName,
      email: formData.email,
      phone: formData.phoneNumber,
      date: formData.date,
      time: formData.time,
      message: formData.message,
    };

    console.log("Sending reservation data to server:", reservationData);

    try {
      const response = await axios.post(
        "http://localhost:3056/api/reservations/create",
        reservationData
      );

      console.log("Response from server:", response.data);

      toast.success("Reservation successful!");
    } catch (error) {
      console.error("Error during reservation:", error);

      toast.error("There was an error with your reservation.");
      setResponseMessage("There was an error with your reservation.");
    } finally {
      setLoading(false);
    }
  };

  const timeOptions = [
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
    "18:00",
    "18:30",
    "19:00",
    "19:30",
  ];

  return (
    <div className="reservation-container">
      <h1 className="reservation-title">Đặt bàn ăn</h1>
      <form className="reservation-form" onSubmit={handleSubmit}>
        <div className="form-section">
          <div className="form-group">
            <label htmlFor="fullName">Họ và tên</label>
            <input
              type="text"
              id="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Nhập họ và tên của bạn"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="phoneNumber">Số điện thoại</label>
            <input
              type="tel"
              id="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Nhập số điện thoại của bạn"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Nhập email của bạn"
              required
            />
          </div>
        </div>
        <div className="form-section">
          <div className="form-group">
            <label htmlFor="date">Ngày</label>
            <input
              type="date"
              id="date"
              value={formData.date}
              onChange={handleChange}
              min={today}
              required
            />
          </div>
          <div className="form-group-container">
            <label htmlFor="time">Thời gian</label>
            <select
              id="time"
              value={formData.time}
              onChange={handleChange}
              required
            >
              <option value="">Chọn thời gian</option>
              {timeOptions.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button type="submit" className="reservation-button" disabled={loading}>
          {loading ? "Processing..." : "Đặt bàn"}
        </button>
        {responseMessage && (
          <p className="reservation-message">{responseMessage}</p>
        )}
      </form>

      <ToastContainer />
    </div>
  );
};

export default Reservation;
