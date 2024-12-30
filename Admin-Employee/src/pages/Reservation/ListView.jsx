import React, { useState, useEffect, useCallback } from "react";
import { ToastContainer, toast } from "react-toastify";
import Pagination from "./Pagination";
import "./ListView.css";

function ListView() {
  const [reservations, setReservations] = useState([]);
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingReservation, setEditingReservation] = useState(null);
  const [selectedTable, setSelectedTable] = useState("");
  const [duration, setDuration] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        data.metadata?.sort((a, b) => {
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
  }, [apiFetch]);

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

      await apiFetch("http://localhost:3056/api/reservations/assign-table", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      toast.success("Table assigned successfully!");
      await fetchReservations();

      setEditingReservation(null);
      setSelectedTable("");
    } catch (error) {
      toast.error(
        `Failed to assign table: ${error.message || "Unknown error"}`
      );
    } finally {
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

  const formatTime = (time) => {
    const date = new Date(time);
    return `${date.getHours().toString().padStart(2, "0")}:${date
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="list-view">
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Date</th>
              <th>Time</th>
              <th>Table</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Edit</th>
            </tr>
          </thead>
          <tbody>
            {reservations.length > 0 ? (
              reservations.map((reservation, index) => (
                <tr key={reservation._id}>
                  <td>{index + 1}</td>
                  <td>{new Date(reservation.date).toLocaleDateString()}</td>
                  <td>{formatTime(reservation.startTime) || "N/A"}</td>
                  <td>{reservation.tableAssigned?.name || "N/A"}</td>
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
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8">
                  No reservations found for the selected date.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {editingReservation && (
        <div className="edit-form">
          <div className="edit-form-header">
            <h3>Edit Reservation</h3>
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
              <option value="">Select a table</option>
              {tables.map((table) => (
                <option key={table._id} value={table._id}>
                  {table.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Duration (hours):
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
              {isSubmitting ? "Submitting..." : "Confirm"}
            </button>
            <button onClick={handleCancelEdit} disabled={isSubmitting}>
              {isSubmitting ? "Cancelling..." : "Cancel"}
            </button>
          </div>
        </div>
      )}

      <div className="pagination-container">
        <Pagination currentPage={1} totalPages={1} setCurrentPage={() => {}} />
      </div>
      <ToastContainer />
    </div>
  );
}

export default ListView;