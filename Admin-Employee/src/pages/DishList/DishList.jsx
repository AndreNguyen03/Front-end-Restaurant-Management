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
  }

  return (
    <div className="list whole-table-format flex-col">
      <div className="actions">
        <button className="add-dish" onClick={() => setShowAddDish(true)}>
          Add New Dish
        </button>
      </div>

      <div className="list-table">
        <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Action</b>
        </div>
        {list.map((item, index) => {
          return (
            <div key={index} className="list-table-format">
              <img src={`${url}/images/` + item.image} alt="" />
              <p>{item.name}</p>
              <p>{item.category}</p>
              <p>{item.price}</p>
              <div className="action">
                <FontAwesomeIcon onClick={() => {setShowConfirmationForm(true); setSelectedDishId(item._id)} } className="icon" icon={faTrash} />
                <FontAwesomeIcon onClick={() => {setShowEditDish(true); setSelectedDishId(item._id);  }}  className="icon" icon={faEdit} />
              </div>
            </div>
          );
        })}
      </div>
      {showConfirmationForm && <ConfirmationForm onConfirm={() => {removeFood(selectedDishId); setShowConfirmationForm(false);}} onCancel={() => setShowConfirmationForm(false)  }/>}
      {showAddDish && <AddDish onDishAdded={handleDishAdded} />}
      {showEditDish && <EditDish url={url} onDishEdited = {handleDishEdited} dishId = {selectedDishId}/>}
    </div>
  );
};

export default DishList;
