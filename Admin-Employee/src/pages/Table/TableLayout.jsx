import React, { useEffect, useState } from "react";
import DishModal from "./DishModal";
import "./Table.css";
import axios from "axios";

function TableLayout() {
  const url = "http://localhost:3056";
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [selectedTableName, setSelectedTableName] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function fetchTables() {
      try {
        const response = await axios.get(`${url}/api/table/list`);
        setTables(response.data.data);
      } catch (error) {
        throw new Error(error);
      }
    }

    fetchTables();
  }, []);

  const handleTableClick = (tableId, tableName) => {
    setSelectedTable(tableId);
    setSelectedTableName(tableName);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="table-container">
      {tables.map((table) => (
        <div key={table._id}>
          <button
            className="table-btn"
            onClick={() => handleTableClick(table._id, table.name)}
          >
            Bàn: {table.name}
            <br />
            {table.capacity} chỗ
          </button>
        </div>
      ))}

      {isModalOpen && (
        <DishModal
          tableId={selectedTable}
          tableName={selectedTableName}
          onClose={closeModal}
        />
      )}
    </div>
  );
}

export default TableLayout;
