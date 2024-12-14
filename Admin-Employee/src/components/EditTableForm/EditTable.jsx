import { useState, useEffect } from "react";
import axios from "axios";
import "./EditTable.css";
import { toast } from "react-toastify";

const EditTable = ({ url, onTableEdited, tableId }) => {
  const [data, setData] = useState({
    name: "",
    capacity: "2",
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(`${url}/api/table/edit`, {
        id: tableId,
        name: data.name,
        capacity: data.capacity,
      });
      if (response.data.success) {
        toast.success("Table edited successfully!");
        onTableEdited(); // Callback to refresh table list
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Failed to edit table. Please try again.");
      console.error(error);
    }
  };

  const fetchTableInfo = async () => {
    const response = await axios.post(`${url}/api/table/listSpecific`, {
      id: tableId,
    });
    if (response.data.success) {
      setData({
        name: response.data.data.name,
        capacity: response.data.data.capacity,
      });
    }
  };

  useEffect(() => {
    fetchTableInfo();
  }, [tableId]);

  return (
    <div className="edit-table-modal">
      <div className="edit-table-container">
        <button onClick={onTableEdited} className="close-button">
          X
        </button>
        <form className="edit-table-form" onSubmit={onSubmitHandler}>
          <h2>Edit Table</h2>

          <div className="form-group">
            <label htmlFor="name">Table Name</label>
            <input
              id="name"
              name="name"
              type="text"
              value={data.name}
              onChange={onChangeHandler}
              placeholder="Enter table name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="capacity">Table Capacity</label>
            <select
              id="capacity"
              name="capacity"
              value={data.capacity}
              onChange={onChangeHandler}
              required
            >
              <option value="2">2</option>
              <option value="4">4</option>
              <option value="6">6</option>
              <option value="8">8</option>
            </select>
          </div>

          <button type="submit" className="submit-button">
            Edit Table
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditTable;
