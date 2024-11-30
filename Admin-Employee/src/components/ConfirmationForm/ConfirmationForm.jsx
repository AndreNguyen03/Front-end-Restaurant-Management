import React from "react";
import './ConfirmationForm.css';
const ConfirmationForm = ({ onConfirm, onCancel }) => {
  return (
    <div className="confirmation-overlay">
      <div className="confirmation-form">
        <p>Do you want to delete this item?</p>
        <button onClick={onConfirm}>Yes</button>
        <button onClick={onCancel}>No</button>
      </div>
    </div>
  );
};

export default ConfirmationForm;
