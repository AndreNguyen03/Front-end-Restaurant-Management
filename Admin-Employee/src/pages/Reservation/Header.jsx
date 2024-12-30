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
          List
        </button>
        <button
          className={viewMode === "table" ? "btn active" : "btn"}
          onClick={() => setViewMode("table")}
        >
          Table
        </button>
      </div>

      <input
        type="text"
        placeholder="Search by ID or Table..."
        className="search-input"
        value={searchQuery}
        onChange={(e) => handleSearchChange(e)}
      />
      <DatePicker
        selected={selectedDate}
        onChange={(date) => handleDateChange(date)}
        dateFormat="yyyy-MM-dd"
        className="date-picker"
        popperPlacement="bottom-start"
      />
    </div>
  );
}

export default Header;
