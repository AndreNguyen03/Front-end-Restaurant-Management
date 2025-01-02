import { useState } from "react";
import axios from "axios";
import "./AddTable.css";
import { toast } from "react-toastify";

const AddTable = ({ url = "http://localhost:3056", onTableAdded }) => {
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
      const response = await axios.post(`${url}/api/table/add`, data);
      if (response.data.success) {
        setData({
          name: "",
          capacity: "2",
        });
        toast.success("Table added successfully!");
        onTableAdded();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Failed to add table. Please try again.");
      console.error(error);
    }
  };

  return (
    <div className="add-table-modal">
      <div className="add-table-container">
        <button onClick={onTableAdded} className="close-button">
          X
        </button>
        <form className="add-table-form" onSubmit={onSubmitHandler}>
          <h2>Thêm bàn mới</h2>

          <div className="form-group">
            <label htmlFor="name">Tên bàn</label>
            <input
              id="name"
              name="name"
              type="text"
              value={data.name}
              onChange={onChangeHandler}
              placeholder="Nhập tên bàn"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="capacity">Số chỗ ngồi</label>
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
            Thêm bàn ăn
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTable;
