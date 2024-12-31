import React, { useEffect, useState } from "react";
import Pagination from "./Pagination";
import "./TableView.css";
import axios from 'axios';

function formatTime(time) {
  const hour = Math.floor(time);
  const minutes = time % 1 === 0.5 ? "30" : "00";
  return `${hour}:${minutes}`;
}

function convertUTCToGMT7InHours(utcDate) {
  const utcHours = utcDate.getUTCHours();
  const utcMinutes = utcDate.getUTCMinutes();
  const utcTimeInHours = utcHours + utcMinutes / 60;
  const gmt7TimeInHours = utcTimeInHours + 7;
  return gmt7TimeInHours >= 24 ? gmt7TimeInHours - 24 : gmt7TimeInHours;
}

function TableView({ currentPage, totalPages, setCurrentPage, selectedDate }) {
  const url = 'http://localhost:3056';
  const [reservations, setReservations] = useState([])
  const [tables, setTables] = useState([]);

  useEffect(() => {
    async function fetchReservations(date) {
      try {

        const response = await axios.get(`${url}/api/reservations/by-date`, {
          params: { date: date }
        })
        console.log(response.data.metadata);
        setReservations(response.data.metadata);

      } catch (error) {
        console.log(error);
      }
    }

    async function fetchTable() {
      try {

        const response = await axios.get(`${url}/api/table/list`)
        console.log(response.data.data);
        setTables(response.data.data);

      } catch (error) {
        console.log(error);
      }
    }

    fetchReservations(selectedDate)
    fetchTable();
  }, [selectedDate])

  

  return (
    <div className="table-view">
      <table>
        <thead>
          <tr>
            <th>Time</th>
            {tables.map((table, index) => (
              <th key={`${index}-${table.name}`}>{table.name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 24 }).map((_, rowIndex) => {
            const time = 9 + rowIndex * 0.5;
            return (
              <tr key={rowIndex}>
                <td>{formatTime(time)}</td>
                {tables.map((table, tableIndex) => {
                  const reservation = reservations.find((res) => {
                    const startDate = new Date(res.startTime);
                    const startInHoursFormatted = convertUTCToGMT7InHours(startDate);
                    return startInHoursFormatted === time && res.status === "confirm" && table.name === res.tableAssigned.name;
                  }
                  );

                  if (reservation) {
                    return (
                      <td
                        key={`${tableIndex}`}
                        rowSpan={(() => {
                          const startDate = new Date(reservation.startTime);
                          const endDate = new Date(reservation.endTime);
                          const startInHoursFormatted = convertUTCToGMT7InHours(startDate);
                          const endInHoursFormatted = convertUTCToGMT7InHours(endDate);
                          console.log(`start, end`, startInHoursFormatted, endInHoursFormatted)
                          const diffHours = (endInHoursFormatted - startInHoursFormatted) + 0.5;
                          console.log(diffHours)
                          return diffHours * 2;
                        })()}
                        style={{
                          backgroundColor: "#FFFACD",
                          textAlign: "center",
                          verticalAlign: "middle",
                        }}
                      >
                        {reservation.phone} - {reservation.name}
                      </td>
                    );
                  }

                  const isPartOfSpan = reservations.some(
                    (res) => {
                      const startDate = new Date(res.startTime);
                      const endDate = new Date(res.endTime);
                      const startInHoursFormatted = convertUTCToGMT7InHours(startDate);
                      const endInHoursFormatted = convertUTCToGMT7InHours(endDate);
                      return time >= startInHoursFormatted && time <= endInHoursFormatted &&
                        table.name === res.tableAssigned.name
                    }
                  );

                  if (!isPartOfSpan) {
                    return <td key={`${tableIndex}`}></td>;
                  }

                  return null;
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
}

export default TableView;
