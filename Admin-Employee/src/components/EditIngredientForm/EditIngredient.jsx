import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./EditIngredient.css";

const EditIngredient = ({ onIngredientEdited, ingredientId }) => {
  const url = "http://localhost:3056";
  // Đường dẫn API
  const [data, setData] = useState({
    name: "",
    unitprice: 0,
    quantity: 0,
    unit: "",
  });

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    // Xây dựng đối tượng dữ liệu để gửi
    const dataUpdated = {
      id: ingredientId,
      name: data.name,
      unitprice: Number(data.unitprice),
      quantity: Number(data.quantity),
      unit: data.unit,
    };

    console.log(dataUpdated);

    try {
      const response = await axios.post(
        `${url}/api/ingredient/edit`,
        dataUpdated,
        {
          headers: {
            "Content-Type": "application/json", // Đặt Content-Type là application/json
          },
        }
      );

      if (response.data.success) {
        setData({
          name: "",
          unitprice: 0,
          quantity: 0,
          unit: "",
        });
        toast.success(response.data.message);
        onIngredientEdited(); // Gọi callback khi cập nhật thành công
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("There was an error updating the ingredient");
      console.error(error);
    }
  };

  const fetchIngredientInfo = async () => {
    const response = await axios.post(`${url}/api/ingredient/listSpecific`, {
      id: ingredientId,
    });
    console.log(ingredientId);
    console.log(response.data);
    if (response.data.success) {
      setData({
        name: response.data.data.name,
        unitprice: response.data.data.unitprice,
        quantity: response.data.data.quantity,
        unit: response.data.data.unit,
      });
    }
  };
  useEffect(() => {
    fetchIngredientInfo();
  }, []);

  return (
    <div className="ingredient-edit-popup">
      <div className="ingredient-edit-container">
        <form className="form-layout" onSubmit={onSubmitHandler}>
          <p onClick={onIngredientEdited} className="close-icon">
            X
          </p>
          <h3 className="ingredient-edit-title">Cập nhật nguyên liệu</h3>

          <div className="ingredient-name-input-group">
            <p>Tên nguyên liệu</p>
            <input
              onChange={onChangeHandler}
              value={data.name}
              type="text"
              name="name"
              placeholder="Nhập tên nguyên liệu"
              required
            />
          </div>
          <div className="ingredient-unitprice-input-group">
            <p>Đơn giá</p>
            <input
              onChange={onChangeHandler}
              value={data.unitprice}
              type="number"
              name="unitprice"
              placeholder="Nhập đơn giá"
              required
            />
          </div>
          <div className="ingredient-quantity-input-group">
            <p>Số lượng</p>
            <input
              onChange={onChangeHandler}
              value={data.quantity}
              type="number"
              name="quantity"
              placeholder="Nhập số lượng"
              required
            />
          </div>
          <div className="ingredient-unit-selector">
            <p>Đơn vị</p>
            <select value={data.unit} name="unit" onChange={onChangeHandler}>
              <option value="kg">kg</option>
              <option value="g">g</option>
              <option value="ml">ml</option>
              <option value="l">l</option>
            </select>
          </div>
          <button type="submit" className="save-button">
            Lưu thay đổi
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditIngredient;
