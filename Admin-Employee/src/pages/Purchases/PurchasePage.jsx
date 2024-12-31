import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import AddPurchaseForm from "../../components/AddPurchaseForm/AddPurchaseForm";
import PurchaseDetails from "../../components/PurchaseDetails/PurchaseDetails";
import "./PurchasePage.css";

const PurchasePage = ({ url }) => {
  const [purchases, setPurchases] = useState([]);
  const [selectedPurchase, setSelectedPurchase] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  

  useEffect(() => {
    fetchPurchases();
  }, []);

  // Fetch purchases from the server
  const fetchPurchases = async () => {
    const response = await axios.get(`${url}/api/purchase/list`);
    console.log(response);
    if (!response.data.success) {
      toast.error("Purchases not found");
      return;
    }
    setPurchases(response.data.data);
  };

  
  const handleViewDetails = async(purchase) => {
    try {
      const response = await axios.post(`${url}/api/purchase/specificList`, {
        id: purchase._id,
      });
  
      if (response.data.success) {
        setSelectedPurchase(response.data.data);
        setShowDetails(true);
      } else {
        toast.error("Failed to fetch purchase details");
      }
    } catch (error) {
      toast.error("An error occurred while fetching purchase details");
      console.error(error);
    }
  };

 

  const handleAfterAdd = () => {
    setShowAddForm(false);
    fetchPurchases();
  };

  return (
    <div className="list whole-table-format flex-col">
      {/* Actions */}
      <div className="actions">
        <button className="add-purchase" onClick={() => setShowAddForm(true)}>
          Add New Purchase
        </button>
      </div>

      {/* Purchases List */}
      <div className="list-table">
        <div className="list-table-format title">
          <b>STT</b>
          <b>Date</b>
          <b>Total Amount</b>
          <b>Action</b>
        </div>
        {purchases.length > 0 ? (
          purchases.map((purchase, index) => (
            <div key={index} className="list-table-format">
              <p>{index + 1}</p>
              <p>
                {purchase.purchaseDate
                  ? new Date(purchase.purchaseDate).toLocaleString()
                  : "N/A"}
              </p>
              <p>
                $
                {Number.isFinite(purchase.totalAmount)
                  ? purchase.totalAmount.toFixed(2)
                  : "0.00"}
              </p>
              <div className="action">
                <FontAwesomeIcon
                  className="icon"
                  icon={faEye}
                  onClick={() => handleViewDetails(purchase)}
                />
              </div>
            </div>
          ))
        ) : (
          <p className="no-data-message">No purchases available.</p>
        )}
      </div>

      {/* Modals */}
      {showAddForm && (
        <AddPurchaseForm
          onClose={() => setShowAddForm(false)}
          onAddPurchase={handleAfterAdd}
        />
      )}

      {showDetails && selectedPurchase && (
        <PurchaseDetails
          purchase={selectedPurchase}
          onClose={() => setShowDetails(false)}
        />
      )}
    </div>
  );
};

export default PurchasePage;
