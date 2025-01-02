import React from "react";
import './ConfirmationForm.css';
const ConfirmationForm = ({ onConfirm, onCancel }) => {
  return (
    <div className="confirmation-overlay">
      <div className="confirmation-form">
        <p>Bạn có chắc chắn muốn xóa không?</p>
        <button onClick={onConfirm}>Có</button>
        <button onClick={onCancel}>Không</button>
      </div>
    </div>
  );
};

export default ConfirmationForm;
