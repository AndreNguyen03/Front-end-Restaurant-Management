import React from "react";
import "./PurchaseDetails.css";

const PurchaseDetails = ({ purchase, onClose }) => {
  if (!purchase) return null;

  return (
    <div className="purchase-details-overlay">
      <div className="purchase-details-container">
        <button className="close-btn" onClick={onClose}>
          X
        </button>
        <h2 className="title">Tomato</h2>
        <p className="purchase-id">
          <strong>Purchase ID:</strong> {purchase._id}
        </p>
        <p className="purchase-date">
          <strong>Date:</strong> {new Date(purchase.purchaseDate).toLocaleString()}
        </p>

        <table className="details-table">
          <thead>
            <tr>
              <th>Ingredient</th>
              <th>Quantity</th>
              <th>Unit</th>
              <th>Price</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {purchase.ingredient.map((item, index) => (
              <tr key={index}>
                <td>{item.name}</td>
                <td>{item.quantity}</td>
                <td>{item.unit}</td>
                <td>{item.unitPrice.toFixed(0)} vnđ</td>
                <td>{item.totalPrice.toFixed(0)} vnđ</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="total-amount">
          <h3>Total Amount: {purchase.totalAmount.toFixed(0)} vnđ</h3>
        </div>
      </div>
    </div>
  );
};

export default PurchaseDetails;
