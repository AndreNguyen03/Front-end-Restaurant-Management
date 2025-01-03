import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./Ingredients.css";
import AddIngredient from "../../components/AddIngredientForm/AddIngredient";
import EditIngredient from "../../components/EditIngredientForm/EditIngredient";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import ConfirmationForm from "../../components/ConfirmationForm/ConfirmationForm";
import formatNumber from "../../utils/FormatNumber";

const IngredientList = ({ url }) => {
  const [list, setList] = useState([]);
  const [showAddIngredient, setShowAddIngredient] = useState(false);
  const [showEditIngredient, setShowEditIngredient] = useState(false);
  const [showConfirmationForm, setShowConfirmationForm] = useState(false);
  const [selectedIngredientId, setSelectedIngredientId] = useState(null);

  const fetchList = async () => {
    const response = await axios.get(`${url}/api/ingredient/list`);
    console.log(response);
    if (!response.data.success) {
      toast.error("Ingredients list not found");
      return;
    }
    setList(response.data.data);
  };

  const removeIngredient = async (ingredientId) => {
    try {
      const response = await axios.post(`${url}/api/ingredient/delete`, {
        id: ingredientId,
      });
      console.log(response);
      if (response.data.success) {
        toast.success("Xóa nguyên liệu thành công");
        await fetchList();
      } else {
        toast.error("Failed to remove Ingredient");
      }
    } catch (error) {
      toast.error("Error removing Ingredient");
      console.error(error);
    }
  };
  useEffect(() => {
    fetchList();
  }, []);
  const handleAfterAdd = () => {
    setShowAddIngredient(false);
    fetchList();
  };

  const handleAfterEdit = () => {
    setShowEditIngredient(false);
    fetchList();
  };

  return (
    <div className="ingredient-list-container flex-col">
      <div className="ingredient-actions">
        <button
          className="add-ingredient-button"
          onClick={() => setShowAddIngredient(true)}
        >
          Thêm nguyên liệu
        </button>
      </div>

      <div className="ingredient-list">
        <div className="ingredient-list-header">
          <b>Tên</b>
          <b>Đơn giá</b>
          <b>Số lượng</b>
          <b>Đơn vị</b>
          <b>Hành động</b>
        </div>
        {list.map((item, index) => (
          <div key={index} className="ingredient-list-row">
            <p>{item.name}</p>
            <p>{formatNumber(item.unitprice)} vnđ</p>
            <p>{item.quantity}</p>
            <p>{item.unit}</p>
            <div className="ingredient-actions-icons">
              <FontAwesomeIcon
                className="action-icon"
                icon={faTrash}
                onClick={() => {
                  setShowConfirmationForm(true);
                  setSelectedIngredientId(item._id);
                }}
              />
              <FontAwesomeIcon
                onClick={() => {
                  console.log("Editing Ingredient:", item); // Log item ra để kiểm tra
                  setSelectedIngredientId(item._id);
                  setShowEditIngredient(true);
                }}
                className="action-icon"
                icon={faEdit}
              />
            </div>
          </div>
        ))}
      </div>
      {showConfirmationForm && (
        <ConfirmationForm
          onConfirm={() => {
            removeIngredient(selectedIngredientId);
            setShowConfirmationForm(false);
          }}
          onCancel={() => setShowConfirmationForm(false)}
        />
      )}
      {showAddIngredient && (
        <AddIngredient onIngredientAdded={handleAfterAdd} />
      )}
      {showEditIngredient && (
        <EditIngredient
          onIngredientEdited={handleAfterEdit}
          ingredientId={selectedIngredientId}
        />
      )}
    </div>
  );
};

export default IngredientList;
