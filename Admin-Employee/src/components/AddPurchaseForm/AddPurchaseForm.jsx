import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./AddPurchaseForm.css";

const AddPurchaseForm = ({ onClose, onAddPurchase }) => {
  const [ingredients, setIngredients] = useState([]);
  const [selectedDetails, setSelectedDetails] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  const url = "http://localhost:3056";

  // Fetch danh sách nguyên liệu từ API
  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const response = await axios.get(`${url}/api/ingredient/list`);
        if (!response.data || !Array.isArray(response.data.data)) {
          toast.error("Invalid API response");
          return;
        }
        setIngredients(response.data.data);
      } catch (error) {
        console.error("Failed to fetch ingredients:", error);
        toast.error("Failed to load ingredients: " + error.message);
      }
    };

    fetchIngredients();
  }, [url]);

  const handleAddIngredient = (ingredient) => {
    const existingIndex = selectedDetails.findIndex(
      (detail) => detail.ingredient === ingredient._id
    );

    if (existingIndex > -1) {
      toast.info("Ingredient already added. Update quantity on the right.");
    } else {
      setSelectedDetails([
        ...selectedDetails,
        {
          ingredient: ingredient._id,
          name: ingredient.name,
          unitPrice: ingredient.unitprice,
          quantity: 1,
          totalPrice: ingredient.unitprice,
          unit: ingredient.unit,
        },
      ]);
      calculateTotal([...selectedDetails, { ...ingredient, quantity: 1, totalPrice: ingredient.unitprice }]);
    }
  };

  const handleRemoveIngredient = (ingredientId) => {
    const updatedDetails = selectedDetails.filter(
      (detail) => detail.ingredient !== ingredientId
    );
    setSelectedDetails(updatedDetails);
    calculateTotal(updatedDetails);
  };

  const handleQuantityChange = (ingredientId, newQuantity) => {
    const updatedDetails = selectedDetails.map((detail) =>
      detail.ingredient === ingredientId
        ? {
            ...detail,
            quantity: newQuantity,
            totalPrice: newQuantity * detail.unitPrice,
          }
        : detail
    );
    setSelectedDetails(updatedDetails);
    calculateTotal(updatedDetails);
  };

  const calculateTotal = (details) => {
    const total = details.reduce((sum, detail) => sum + detail.totalPrice, 0);
    setTotalAmount(total);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    console.log("Selected Details:", selectedDetails); // Log để kiểm tra giá trị
  
    if (selectedDetails.length === 0) {
      toast.error("Please select at least one ingredient");
      return;
    }
  
    try {
      const purchaseData = {
        ingredients: selectedDetails.map((detail) => ({
          ingredientId: detail.ingredient,
          name: detail.name,
          quantity: detail.quantity,
          unitPrice: detail.unitPrice,
          totalPrice: detail.quantity * detail.unitPrice,
          unit: detail.unit, // Thay đổi nếu cần
        })),
      };
  
      console.log("Payload gửi tới API:", purchaseData);
  
      const response = await axios.post(`${url}/api/purchase/add`, purchaseData);
  
      toast.success("Purchase added successfully");
      onAddPurchase(response.data);
      onClose();
    } catch (error) {
      if (error.response) {
        console.error("API Error:", error.response.data);
        toast.error(`Error: ${error.response.data.message || "Failed to add purchase"}`);
      } else {
        console.error("Request Error:", error.message);
        toast.error("Request failed: " + error.message);
      }
    }
  };
  
  
  
  

  return (
    <div className="add-purchase-overlay">
      <div className="add-purchase-form">
        <button className="close-btn" onClick={onClose}>
          X
        </button>
        {/* Left Panel */}
        <div className="form-left">
          <h3>Danh sách nguyên liệu</h3>
          <table className="ingredients-table">
            <thead>
              <tr>
                <th><b>Tên</b></th>
                <th><b>Đơn giá</b></th>
                <th><b>Hành động</b></th>
              </tr>
            </thead>
            <tbody>
              {ingredients.map((ingredient) => (
                <tr key={ingredient._id}>
                  <td><p>{ingredient.name}</p></td>
                  <td><p>{ingredient.unitprice.toFixed(0)} vnđ/{ingredient.unit}</p></td>
                  <td>
                    <button onClick={() => handleAddIngredient(ingredient)}>
                      +
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
  
        {/* Right Panel */}
        <div className="form-right">
          <h3>Nguyên liệu đã chọn</h3>
          <table className="selected-table">
            <thead>
              <tr>
                <th><b>Tên</b></th>
                <th><b>Số lượng</b></th>
                <th><b>Tổng tiền</b></th>
                <th><b>Hành động</b></th>
              </tr>
            </thead>
            <tbody>
              {selectedDetails.map((detail) => (
                <tr key={detail.ingredient}>
                  <td><p>{detail.name}</p></td>
                  <td>
                    <input
                      type="number"
                      value={detail.quantity}
                      onChange={(e) =>
                        handleQuantityChange(
                          detail.ingredient,
                          parseInt(e.target.value)
                        )
                      }
                      min="0"
                    />
                  </td>
                  <td><p>{detail.totalPrice.toFixed(0)} vnđ</p></td>
                  <td>
                    <button onClick={() => handleRemoveIngredient(detail.ingredient)}>
                      X
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="total-amount">
            <h3>Tổng tiền đơn hàng: {totalAmount.toFixed(0)} vnđ</h3>
          </div>
          <div className="form-actions">
            <button onClick={handleSubmit} className="submit-btn">
              Thêm đơn hàng
            </button>
            <button onClick={onClose} className="cancel-btn">
              Hủy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};  

export default AddPurchaseForm;
