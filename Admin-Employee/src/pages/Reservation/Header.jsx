import React from "react";
import "./Header.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function Header({
  viewMode,
  setViewMode,
  searchQuery,
  setSearchQuery,
  selectedDate,
  setSelectedDate,
}) {
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  return (
    <div className="header">
      <div className="buttons">
        <button
          className={viewMode === "list" ? "btn active" : "btn"}
          onClick={() => setViewMode("list")}
        >
          Danh sách
        </button>
        <button
          className={viewMode === "table" ? "btn active" : "btn"}
          onClick={() => setViewMode("table")}
        >
          Bảng
        </button>
      </div>


      {viewMode === "table" && (
        <DatePicker
          selected={selectedDate}
          onChange={(date) => handleDateChange(date)}
          dateFormat="yyyy-MM-dd"
          className="date-picker"
          popperPlacement="bottom-start"
        />
      )}
    </div>
  );
}

export default Header;
