import { useState, useEffect } from "react";
import "./Table.css";
import axios from "axios";
import { toast } from "react-toastify";
import AddTable from "../../components/AddTableForm/AddTable";
import EditTable from "../../components/EditTableForm/EditTable";
import ConfirmationForm from "../../components/ConfirmationForm/ConfirmationForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";

const TableList = ({ url }) => {
  const [tables, setTables] = useState([]);
  const [showAddTable, setShowAddTable] = useState(false);
  const [showEditTable, setShowEditTable] = useState(false);
  const [selectedTableId, setSelectedTableId] = useState(null);
  const [showConfirmationForm, setShowConfirmationForm] = useState(false);

  const fetchTables = async () => {
    const response = await axios.get(`${url}/api/table/list`);
    if (!response.data.success) {
      toast.error("Table list not found");
      return;
    }
    setTables(response.data.data);
  };

  const removeTable = async (tableId) => {
    try {
      const response = await axios.post(`${url}/api/table/delete`, {
        id: tableId,
      });
      if (response.data.success) {
        toast.success("Table removed successfully");
        await fetchTables();
      } else {
        toast.error("Failed to remove table");
      }
    } catch (error) {
      toast.error("Error removing table");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchTables();
  }, []);

  const handleTableAdded = () => {
    setShowAddTable(false);
    fetchTables();
  };

  const handleTableEdited = () => {
    setShowEditTable(false);
    fetchTables();
  };

  return (
    <div className="tables-container">
      <div className="tables-actions">
        <button className="btn-add-table" onClick={() => setShowAddTable(true)}>
          Add New Table
        </button>
      </div>
      <div className="cards-wrapper">
        {tables.map((table) => (
          <div key={table._id} className="card-item">
            <div className="card-header">
              <h3>{table.name}</h3>
            </div>
            <p>{table.capacity} seats</p>
            <div className="card-divider"></div>
            <div className="card-actions">
              <FontAwesomeIcon
                onClick={() => {
                  setShowEditTable(true);
                  setSelectedTableId(table._id);
                }}
                className="icon-action edit-action"
                icon={faEdit}
              />
              <FontAwesomeIcon
                onClick={() => {
                  setShowConfirmationForm(true);
                  setSelectedTableId(table._id);
                }}
                className="icon-action delete-action"
                icon={faTrash}
              />
            </div>
          </div>
        ))}
      </div>

      {showConfirmationForm && (
        <ConfirmationForm
          onConfirm={() => {
            removeTable(selectedTableId);
            setShowConfirmationForm(false);
          }}
          onCancel={() => setShowConfirmationForm(false)}
        />
      )}

      {showAddTable && <AddTable onTableAdded={handleTableAdded} />}
      {showEditTable && (
        <EditTable
          url={url}
          onTableEdited={handleTableEdited}
          tableId={selectedTableId}
        />
      )}
    </div>
  );
};

export default TableList;
