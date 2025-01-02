import { useState, useEffect } from "react";
import "./DishList.css";
import axios from "axios";
import { toast } from "react-toastify";
import AddDish from "../../components/AddDishForm/AddDish";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import EditDish from "../../components/EditDishForm/EditDish";
import ConfirmationForm from "../../components/ConfirmationForm/ConfirmationForm";
const DishList = ({ url }) => {
  const [list, setList] = useState([]);
  const [showAddDish, setShowAddDish] = useState(false);
  const [showEditDish, setShowEditDish] = useState(false);
  const [selectedDishId, setSelectedDishId] = useState(null);
  const [showConfirmationForm, setShowConfirmationForm] = useState(false);
  const fetchList = async () => {
    const response = await axios.get(`${url}/api/dish/list`);
    console.log(response);
    if (!response.data.success) {
      toast.error("Dish list not found");
      return;
    }
    setList(response.data.data);
  };

  const removeFood = async (dishId) => {
    try {
      const response = await axios.post(`${url}/api/dish/delete`, {
        id: dishId,
      });
      console.log(response);
      if (response.data.success) {
        toast.success("Dish removed successfully");
        await fetchList();
      } else {
        toast.error("Failed to remove dish");
      }
    } catch (error) {
      toast.error("Error removing dish");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const handleDishAdded = () => {
    setShowAddDish(false);
    fetchList();
  };

  const handleDishEdited = () => {
    setShowEditDish(false);
    fetchList();
  };

  return (
    <div className="menu-container table-layout flex-col">
      <div className="menu-actions">
        <button
          className="menu-add-button"
          onClick={() => setShowAddDish(true)}
        >
          Thêm món ăn
        </button>
      </div>

      <div className="menu-table">
        <div className="menu-table-header">
          <b>Hình ảnh</b>
          <b>Tên</b>
          <b>Loại</b>
          <b>Giá</b>
          <b>Hành động</b>
        </div>
        {list.map((item, index) => {
          return (
            <div key={index} className="menu-table-row">
              <img src={`${url}/images/${item.image}`} alt="" />
              <p>{item.name}</p>
              <p>{item.category}</p>
              <p>{item.price} vnđ</p>
              <div className="menu-item-actions">
                <FontAwesomeIcon
                  onClick={() => {
                    setShowConfirmationForm(true);
                    setSelectedDishId(item._id);
                  }}
                  className="menu-action-icon"
                  icon={faTrash}
                />
                <FontAwesomeIcon
                  onClick={() => {
                    setShowEditDish(true);
                    setSelectedDishId(item._id);
                  }}
                  className="menu-action-icon"
                  icon={faEdit}
                />
              </div>
            </div>
          );
        })}
      </div>
      {showConfirmationForm && (
        <ConfirmationForm
          onConfirm={() => {
            removeFood(selectedDishId);
            setShowConfirmationForm(false);
          }}
          onCancel={() => setShowConfirmationForm(false)}
        />
      )}
      {showAddDish && <AddDish onDishAdded={handleDishAdded} />}
      {showEditDish && (
        <EditDish
          url={url}
          onDishEdited={handleDishEdited}
          dishId={selectedDishId}
        />
      )}
    </div>
  );
};

export default DishList;
