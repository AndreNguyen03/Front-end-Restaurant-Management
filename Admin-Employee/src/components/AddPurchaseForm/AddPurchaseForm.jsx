import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./AddPurchaseForm.css";

const AddPurchaseForm = ({ ingredients,  onAddPurchase }) => {
  const [selectedDetails, setSelectedDetails] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  const handleAddIngredient = () => {
    setSelectedDetails([
      ...selectedDetails,
      { ingredient: "", quantity: 1, totalPrice: 0 },
    ]);
  };

  const handleRemoveIngredient = (index) => {
    const updatedDetails = [...selectedDetails];
    updatedDetails.splice(index, 1);
    setSelectedDetails(updatedDetails);
    calculateTotal(updatedDetails);
  };

  const handleIngredientChange = (index, field, value) => {
    const updatedDetails = [...selectedDetails];
    updatedDetails[index][field] = value;

    if (field === "ingredient" || field === "quantity") {
      const ingredient = ingredients.find((ing) => ing._id === value);
      const quantity = updatedDetails[index].quantity || 1;
      if (ingredient) {
        updatedDetails[index].totalPrice = ingredient.unitprice * quantity;
      }
    }

    setSelectedDetails(updatedDetails);
    calculateTotal(updatedDetails);
  };

  const calculateTotal = (details) => {
    const total = details.reduce((sum, item) => sum + item.totalPrice, 0);
    setTotalAmount(total);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const purchase = {
      details: selectedDetails.map((detail) => ({
        ingredient: detail.ingredient,
        quantity: Number(detail.quantity),
        totalPrice: detail.totalPrice,
      })),
    };

    try {
      const response = await axios.post("/api/purchases/add", purchase);
      if (response.data.success) {
        toast.success(response.data.message);
        onAddPurchase(response.data.data);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Error adding purchase.");
      console.error(error);
    }
  };

  return (
    <div className="add-purchase-form">
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <p onClick={onAddPurchase} className="close-button">X</p>
          <h3>Add Purchase</h3>
          {selectedDetails.map((detail, index) => (
            <div key={index} className="ingredient-row">
              <select
                value={detail.ingredient}
                onChange={(e) =>
                  handleIngredientChange(index, "ingredient", e.target.value)
                }
                required
              >
                <option value="">Select Ingredient</option>
                {ingredients.map((ingredient) => (
                  <option key={ingredient._id} value={ingredient._id}>
                    {ingredient.name} (${ingredient.unitprice} per {ingredient.unit})
                  </option>
                ))}
              </select>
              <input
                type="number"
                value={detail.quantity}
                onChange={(e) =>
                  handleIngredientChange(index, "quantity", e.target.value)
                }
                min="1"
                required
              />
              <button
                type="button"
                className="remove-button"
                onClick={() => handleRemoveIngredient(index)}
              >
                Remove
              </button>
            </div>
          ))}
          <button type="button" className="add-ingredient-button" onClick={handleAddIngredient}>
            Add Ingredient
          </button>
          <div className="total">Total: ${totalAmount.toFixed(2)}</div>
          <button type="submit" className="submit-button">
            Submit
          </button>
          
        </form>
      </div>
    </div>
  );
};

export default AddPurchaseForm;
