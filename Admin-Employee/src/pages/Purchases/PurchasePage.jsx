import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import AddPurchaseForm from "../../components/AddPurchaseForm/AddPurchaseForm";
import PurchaseDetails from "../../components/PurchaseDetailsForm/PurchaseDetails";
import "./PurchasePage.css";

const PurchasePage = () => {
  const [purchases, setPurchases] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [selectedPurchase, setSelectedPurchase] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    fetchPurchases();
    fetchIngredients();
  }, []);

  const fetchPurchases = async () => {
    try {
      const response = await axios.get("/api/purchases/list");
      if (response.data.success) {
        setPurchases(response.data.data);
      } else {
        toast.error("Error fetching purchases.");
      }
    } catch (error) {
      toast.error("Error fetching purchases.");
      console.error(error);
    }
  };

  const fetchIngredients = async () => {
    try {
      const response = await axios.get("/api/ingredient/list");
      if (response.data.success) {
        setIngredients(response.data.data);
      } else {
        toast.error("Error fetching ingredients.");
      }
    } catch (error) {
      toast.error("Error fetching ingredients.");
      console.error(error);
    }
  };

  const handleViewDetails = (purchase) => {
    setSelectedPurchase(purchase);
    setShowDetails(true);
  };

  const handleAddPurchase = (newPurchase) => {
    setPurchases([...purchases, newPurchase]);
    setShowAddForm(false);
  };

  return (
    <div className="list whole-table-format flex-col">
      <div className="actions">
        <button
          className="add-purchase"
          onClick={() => setShowAddForm(true)}
        >
          Add New Purchase
        </button>
      </div>

      <div className="list-table">
        <div className="list-table-format title">
          <b>Date</b>
          <b>Total Amount</b>
          <b>Action</b>
        </div>
        {purchases.map((purchase, index) => (
          <div key={index} className="list-table-format">
            <p>{new Date(purchase.createdAt).toLocaleString()}</p>
            <p>${purchase.totalAmount.toFixed(2)}</p>
            <div className="action">
              <FontAwesomeIcon
                className="icon"
                icon={faEye}
                onClick={() => handleViewDetails(purchase)}
              />
            </div>
          </div>
        ))}
      </div>

      {showAddForm && <AddPurchaseForm onAddPurchase={handleAddPurchase} />}
      {showDetails && (
        <PurchaseDetails
          purchase={selectedPurchase}
          onClose={() => setShowDetails(false)}
        />
      )}
    </div>
  );
};

export default PurchasePage;
