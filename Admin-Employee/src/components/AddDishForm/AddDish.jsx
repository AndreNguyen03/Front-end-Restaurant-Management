import { useState } from "react";
import { assets } from "../../assets/admin_assets/assets";
import axios from "axios";
import './AddDish.css'
import { toast } from "react-toastify";
const AddDish = ({onDishAdded}) => {
  const url = "http://localhost:3056";
  const [image, setImage] = useState(false);
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
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("category", data.category);
    formData.append("price", Number(data.price));
    formData.append("image", image);

    const response = await axios.post(`${url}/api/dish/add`, formData);
    if (response.data.success) {
      setData({
        name: "",
        description: "",
        price: "",
        category: "Salad",
      });
      setImage(false);
      toast.success("Thêm món ăn mới thành công");
    } else {
      toast.error("Có lỗi xảy ra khi thêm món ăn mới");
    }
  };

  return (
    <div className="add-dish-popup">
      <div className="add ">
      <form className="flex-col " onSubmit={onSubmitHandler}>
        <p onClick={onDishAdded} className='dish-close-button' >X</p>
        <div className="add-img-upload flex-col">
          <p>Tải hình ảnh lên</p>
          <label htmlFor="image">
            <img 
              src={image ? URL.createObjectURL(image) : assets.upload_area}
              alt=""
            />
          </label>
          <input
            onChange={(e) => setImage(e.target.files[0])}
            type="file"
            id="image"
            hidden
            required
          />
        </div>
        <div className="add-product-name flex-col">
          <p>Tên sản phẩm</p>
          <input
            onChange={onChangeHandler}
            value={data.name}
            type="text"
            name="name"
            placeholder="Nhập tên sản phẩm"
          />
        </div>
        <div className="add-product-description flex-col">
          <p>Mô tả sản phẩm</p>
          <textarea
            onChange={onChangeHandler}
            value={data.description}
            name="description"
            rows="6"
            placeholder="Nhap mô tả sản phẩm"
            required
          ></textarea>
        </div>
        <div className="add-category-price">
          <div className="add-category flex-col">
            <p>Loại sản phẩm</p>
            <select name="category" onChange={onChangeHandler}>
            <option value="Salad">Salad</option>
                <option value="Cuộn">Cuộn</option>
                <option value="Tráng miệng">Tráng miệng</option>
                <option value="Sandwich">Sandwich</option>
                <option value="Bánh ngọt">Bánh ngọt</option>
                <option value="Rau">Rau</option>
                <option value="Pasta">Pasta</option>
                <option value="Mì">Mì</option>
            </select>
          </div>
          <div className="add-price flex-col">
            <p>Giá sản phẩm</p>
            <input
              onChange={onChangeHandler}
              value={data.price}
              type="Number"
              name="price"
              placeholder="50000 vnđ"
            />
          </div>
        </div>
        <button type="submit" className="add-btn">
          Thêm món ăn
        </button>
      </form>
    </div>
    </div>
  );
};

export default AddDish;
