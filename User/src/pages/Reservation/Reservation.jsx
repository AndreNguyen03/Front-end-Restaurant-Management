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

  return (
    <div className="reservation-container">
      <h1 className="reservation-title">Table Reservation</h1>
      <form className="reservation-form" onSubmit={handleSubmit}>
        <div className="form-section">
          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input
              type="text"
              id="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="phoneNumber">Phone Number</label>
            <input
              type="tel"
              id="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Enter your phone number"
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
              placeholder="Enter your email"
              required
            />
          </div>
        </div>
        <div className="form-section">
          <div className="form-group">
            <label htmlFor="date">Date</label>
            <input
              type="date"
              id="date"
              value={formData.date}
              onChange={handleChange}
              min={today}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="time">Time</label>
            <input
              type="time"
              id="time"
              value={formData.time}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <button type="submit" className="reservation-button" disabled={loading}>
          {loading ? "Processing..." : "Make Your Reservation"}
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
