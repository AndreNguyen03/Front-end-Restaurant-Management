import React, { useState, useEffect, useCallback } from "react";
import { ToastContainer, toast } from "react-toastify";
import Pagination from "./Pagination";
import "./ListView.css";
import axios from "axios";

function ListView() {
  const [reservations, setReservations] = useState([]);
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingReservation, setEditingReservation] = useState(null);
  const [selectedTable, setSelectedTable] = useState("");
  const [duration, setDuration] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState(""); // Thêm state tìm kiếm
  const recordsPerPage = 8;

  const totalPages = Math.ceil(reservations.length / recordsPerPage);
  const currentReservations = reservations.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  const apiFetch = useCallback(async (url, options = {}) => {
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      return await response.json();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const fetchReservations = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiFetch("http://localhost:3056/api/reservations/all");
      const sortedReservations =
        data.metadata
          ?.filter((reservation) => {
            const queryLowerCase = searchQuery.toLowerCase();
            return (
              reservation.name.toLowerCase().includes(queryLowerCase) ||
              reservation.phone.includes(searchQuery)
            );
          })
          .sort((a, b) => {
            const dateA = new Date(a.startTime).getTime();
            const dateB = new Date(b.startTime).getTime();
            return dateB - dateA;
          }) || [];

      setReservations(sortedReservations);
    } catch (err) {
      setError("Failed to fetch reservations.");
    } finally {
      setLoading(false);
    }
  }, [apiFetch, searchQuery]);

  const fetchTables = useCallback(async () => {
    try {
      const data = await apiFetch(
        "http://localhost:3056/api/reservations/tables"
      );
      setTables(data.metadata || []);
    } catch (err) {
      setError("Failed to fetch tables.");
    }
  }, [apiFetch]);

  useEffect(() => {
    fetchReservations();
    fetchTables();
  }, [fetchReservations, fetchTables]);

  useEffect(() => {
    console.log("Selected Table: ", selectedTable);
  }, [selectedTable]);

  const handleEditClick = (reservation) => {
    setEditingReservation(reservation);
    console.log(reservation);
    setSelectedTable("");
    setDuration(1);
  };

  const handleConfirmEdit = async () => {
    if (selectedTable === "") {
      toast.error("Please select a table.");
      return;
    }

    setIsSubmitting(true);
    try {
      const requestBody = {
        reservationId: editingReservation._id,
        tableId: selectedTable,
        duration: duration,
      };

      const assignResponse = await apiFetch(
        "http://localhost:3056/api/reservations/assign-table",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      const mailOptions = {
        to: assignResponse.metadata.email,
        subject: "Xác nhận đặt bàn",
        text: `Xin chào,
Bạn đã đặt bàn thành công,
Thông tin đặt bàn của bạn: Vào lúc ${formatTime(
          assignResponse.metadata.startTime
        )} - ${formatTime(assignResponse.metadata.endTime)}. Ngày: ${formatDate(
          assignResponse.metadata.date
        )}. Tại bàn ${assignResponse.metadata.tableAssigned.name}. 
        
Khi đến nhà hàng, hãy đến quầy tiếp tân và đọc tên: ${assignResponse.metadata.name
          } và số điện thoại: ${assignResponse.metadata.phone
          } để được nhân viên sắp xếp bàn cho bạn.
Trân trọng,
Nhà hàng Tomato`,
      };

      toast.success("Table assigned successfully!");
      await fetchReservations();

      setEditingReservation(null);
      setSelectedTable("");
      setIsSubmitting(false);
      await axios.post("http://localhost:3056/api/send-mail", {
        to: mailOptions.to,
        subject: mailOptions.subject,
        text: mailOptions.text,
      });
    } finally {
      console.log("Setting isSubmitting to false");
      setIsSubmitting(false);
    }
  };

  const handleCancelEdit = async () => {
    if (!editingReservation) {
      toast.error("No reservation selected.");
      return;
    }

    setIsSubmitting(true);
    try {
      await apiFetch("http://localhost:3056/api/reservations/cancel", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reservationId: editingReservation._id,
        }),
      });

      toast.success("Reservation canceled successfully!");
      setReservations((prev) =>
        prev.map((res) =>
          res._id === editingReservation._id
            ? { ...res, status: "cancel" }
            : res
        )
      );
      setEditingReservation(null);
      setSelectedTable("Select a table");
    } catch (err) {
      toast.error("Failed to cancel reservation: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteReservation = async (reservationId) => {
    if (window.confirm("Bạn có chắc muốn xóa đặt bàn này?")) {
      try {
        setLoading(true);
        await apiFetch(`http://localhost:3056/api/reservations/${reservationId}`, {
          method: "DELETE",
        });
        toast.success("Xóa đặt bàn thành công!");
        setReservations((prev) =>
          prev.filter((reservation) => reservation._id !== reservationId)
        );
      } catch (err) {
        toast.error("Không thể xóa đặt bàn: " + err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const formatTime = (time) => {
    const date = new Date(time);
    return `${date.getHours().toString().padStart(2, "0")}:${date
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
  };
  const formatDate = (dateInput) => {
    const date = new Date(dateInput);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };

  return (
    <div className="list-view">
      <div className="custom-search-container">
        <input
          type="text"
          placeholder="Tìm kiếm bằng ID hoặc bàn..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="custom-search-input"
        />
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Ngày</th>
              <th>Thời gian</th>
              <th>Bàn</th>
              <th>Tên</th>
              <th>Số điện thoại</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {currentReservations.length > 0 ? (
              currentReservations.map((reservation, index) => (
                <tr key={reservation._id}>
                  <td>{index + 1 + (currentPage - 1) * recordsPerPage}</td>
                  <td>{new Date(reservation.date).toLocaleDateString()}</td>
                  <td>{formatTime(reservation.startTime) || "N/A"}</td>
                  <td>Bàn: {reservation.tableAssigned?.name || "N/A"}</td>
                  <td>{reservation.name}</td>
                  <td>{reservation.phone}</td>
                  <td>{reservation.status}</td>
                  <td>
                    <button
                      className="edit-btn"
                      onClick={() => handleEditClick(reservation)}
                    >
                      ✏️
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteReservation(reservation._id)}
                      style={{ marginLeft: "8px" }}
                    >
                      ❌
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8">Không có đặt bàn nào.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {editingReservation && (
        <div className="edit-form">
          <div className="edit-form-header">
            <h3>Chỉnh sửa đặt bàn</h3>
            <span
              className="close-icon"
              onClick={() => setEditingReservation(null)}
            >
              x
            </span>
          </div>
          <label>
            <select
              value={selectedTable}
              onChange={(e) => setSelectedTable(e.target.value)}
            >
              <option value="">Chọn bàn</option>
              {tables.map((table) => (
                <option key={table._id} value={table._id}>
                  Bàn: {table.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Thời gian (Giờ):
            <input
              type="number"
              value={duration}
              min="1"
              max="4"
              onChange={(e) => setDuration(Number(e.target.value))}
              className="tomato-input"
            />
          </label>
          <div className="edit-form-actions">
            <button
              onClick={handleConfirmEdit}
              disabled={selectedTable === "Select a table" || isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Xác nhận"}
            </button>
            <button onClick={handleCancelEdit} disabled={isSubmitting}>
              {isSubmitting ? "Cancelling..." : "Hủy"}
            </button>
          </div>
        </div>
      )}

      <div className="pagination-container">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />
      </div>
      <ToastContainer />
    </div>
  );
}

export default ListView;
