import React from "react";
import "./PurchaseDetails.css";

const PurchaseDetails = ({ purchase, onClose }) => {
  return (
    <div className="purchase-details">
      <div className="details-container">
        <h3>Purchase Details</h3>
        <button className="close-button" onClick={onClose}>
          Close
        </button>
        <table>
          <thead>
            <tr>
              <th>Ingredient</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {purchase.details.map((detail, index) => (
              <tr key={index}>
                <td>{detail.ingredient.name}</td>
                <td>{detail.quantity}</td>
                <td>${detail.ingredient.unitprice.toFixed(2)}</td>
                <td>${detail.totalPrice.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="total-amount">
          <strong>Total Amount:</strong> ${purchase.totalAmount.toFixed(2)}
        </div>
      </div>
    </div>
  );
};

export default PurchaseDetails;
