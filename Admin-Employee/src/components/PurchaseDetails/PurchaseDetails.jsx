import React from "react";
import "./PurchaseDetails.css";
import formatNumber from "../../utils/FormatNumber";

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
          <strong>ID Đơn hàng:</strong> {purchase._id}
        </p>
        <p className="purchase-date">
          <strong>Ngày:</strong> {new Date(purchase.purchaseDate).toLocaleString()}
        </p>

        <table className="details-table">
          <thead>
            <tr>
              <th>Nguyên liệu</th>
              <th>Số lượng</th>
              <th>Đơn vị</th>
              <th>Đơn giá</th>
              <th>Tổng tiền</th>
            </tr>
          </thead>
          <tbody>
            {purchase.ingredient.map((item, index) => (
              <tr key={index}>
                <td>{item.name}</td>
                <td>{item.quantity}</td>
                <td>{item.unit}</td>
                <td>{formatNumber(item.unitPrice.toFixed(0))} vnđ/{item.unit}</td>
                <td>{formatNumber(item.totalPrice.toFixed(0))} vnđ</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="total-amount">
          <h3>Tổng tiền đơn hàng: {formatNumber(purchase.totalAmount.toFixed(0))} vnđ</h3>
        </div>
      </div>
    </div>
  );
};

export default PurchaseDetails;
