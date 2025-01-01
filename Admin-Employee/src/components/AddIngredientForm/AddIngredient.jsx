import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./AddIngredient.css";

const AddIngredient = ({ onIngredientAdded }) => {
  const url = "http://localhost:3056";
  const [data, setData] = useState({
    name: "",
    unitprice: "",
    quantity: "",
    unit: "kg",
  });

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    const response = await axios.post(`${url}/api/ingredient/add`, data);

    if (response.data.success) {
      setData({
        name: "",
        unitprice: "",
        quantity: "",
        unit: "kg",
      });
      toast.success(response.data.message);
    } else {
      toast.error(response.data.message);
    }
  };

  return (
    <div className="add-ingredient-popup">
      <div className="add">
        <form className="flex-col" onSubmit={onSubmitHandler}>
          <p onClick={onIngredientAdded} className="close-button">X</p>
          <div className="add-ingredient-name flex-col">
            <p>Ingredient Name</p>
            <input
              onChange={onChangeHandler}
              value={data.name}
              type="text"
              name="name"
              placeholder="Enter ingredient name"
              required
            />
          </div>
          <div className="add-ingredient-unitprice flex-col">
            <p>Unit Price</p>
            <input
              onChange={onChangeHandler}
              value={data.unitprice}
              type="number"
              name="unitprice"
              placeholder="Enter unit price"
              required
            />
          </div>
          <div className="add-ingredient-quantity flex-col">
            <p>Quantity</p>
            <input
              onChange={onChangeHandler}
              value={data.quantity}
              type="number"
              name="quantity"
              placeholder="Enter quantity"
              required
            />
          </div>
          <div className="add-ingredient-unit flex-col">
            <p>Unit</p>
            <select
              value={data.unit}
              name="unit"
              onChange={onChangeHandler}
            >
              <option value="kg">kg</option>
              <option value="g">g</option>
              <option value="ml">ml</option>
              <option value="l">l</option>
            </select>
          </div>
          <button type="submit" className="add-btn">Add</button>
        </form>
      </div>
    </div>
  );
};

export default AddIngredient;
