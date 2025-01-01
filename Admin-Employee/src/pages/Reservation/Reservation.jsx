import React, { useState } from "react";
import "./Reservation.css";
import Header from "./Header";
import TableView from "./TableView";
import ListView from "./ListView";
import moment from "moment"; // Để xử lý ngày

function Reservation() {
  const [viewMode, setViewMode] = useState("list");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const tablesPerPage = 10;


  return (
    <div className="container">
      <Header
        viewMode={viewMode}
        setViewMode={(mode) => {
          setViewMode(mode);
          setCurrentPage(1); // Reset về trang đầu
        }}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />
      {viewMode === "table" ? (
        <TableView
          setCurrentPage={setCurrentPage}
          selectedDate={selectedDate}
        />
      ) : (
        <ListView
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      )}
    </div>
  );
}

export default Reservation;
