import { useState, useEffect } from "react";
import { assets } from "../../assets/admin_assets/assets";
import axios from "axios";
import "./EditDish.css";
import { toast } from "react-toastify";
const EditDish = ({ url, onDishEdited, dishId}) => {
  const [image, setImage] = useState(null);
  const [data, setData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Salad",
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    console.log(data); // 
    formData.append("name", data.name);
    formData.append('id', dishId);
    formData.append("description", data.description);
    formData.append("category", data.category);
    formData.append("price", Number(data.price));
    image instanceof File ? formData.append("image", image) : formData.append("image", "");

    const response = await axios.post(`${url}/api/dish/edit`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    if (response.data.success) {
      setData({
        name: "",
        description: "",
        price: "",
        category: "Salad",
      });
      setImage(false);
      toast.success(response.data.message);
    } else {
      toast.error(response.data.message);
    }
  };

  const fetchDishInfo = async () => {
    const response = await axios.post(`${url}/api/dish/specificDish`, {
      id: dishId
    })
    console.log(response.data);
    if(response.data.success){
      setData({
        name: response.data.data.name,
        description: response.data.data.description,
        price: response.data.data.price,
        category: response.data.data.category
      })
      setImage(response.data.data.image);
      
    }
  }

  useEffect(() => {
    fetchDishInfo();
    
  }, [])

  return (
    <div className="add-dish-popup">
      <div className="add ">
        <form className="flex-col" onSubmit={onSubmitHandler}>
          <p onClick={() => onDishEdited()} className="dish-close-button">X</p>
          <div className="add-img-upload flex-col">
            <p>Tải hình ảnh lên</p>
            <label htmlFor="image">
              <img
                src={image instanceof File ? URL.createObjectURL(image) : `${url}/images/${image}`}
                alt=""
              />
            </label>
            <input
              onChange={(e) => setImage(e.target.files[0])}
              type="file"
              id="image"
              hidden
            />
          </div>
          <div className="add-product-name flex-col">
            <p>Tên sản phẩm</p>
            <input
              onChange={onChangeHandler}
              value={data.name}
              type="text"
              name="name"
              placeholder="Type here"
            />
          </div>
          <div className="add-product-description flex-col">
            <p>Mô tả sản phẩm</p>
            <textarea
              onChange={onChangeHandler}
              value={data.description}
              name="description"
              rows="6"
              placeholder="Write content here"
              required
            ></textarea>
          </div>
          <div className="add-category-price">
            <div className="add-category flex-col">
              <p>Loại sản phẩm</p>
              <select value={data.category} name="category" onChange={onChangeHandler}>
                <option value="Salad">Salad</option>
                <option value="Rolls">Rolls</option>
                <option value="Deserts">Deserts</option>
                <option value="Sandwich">Sandwich</option>
                <option value="Cake">Cake</option>
                <option value="Pure Veg">Pure Veg</option>
                <option value="Pasta">Pasta</option>
                <option value="Noodle">Noodle</option>
              </select>
            </div>
            <div className="add-price flex-col">
              <p>Giá sản phẩm</p>
              <input
                onChange={onChangeHandler}
                value={data.price }
                type="Number"
                name="price"
                placeholder="50000 vnđ"
              />
            </div>
          </div>
          <button type="submit" className="add-btn">
            Edit
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditDish;
