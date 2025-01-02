import React, { useContext, useState, useEffect } from "react";
import "./FoodItem.css";
import { StoreContext } from "../../context/StoreContext";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";
import formatNumber from "../../utils/FormatNumber";

const FoodItem = ({ id, name, price, description, image }) => {
  const { isAuthenticated } = useContext(AuthContext);
  const [isInCart, setIsInCart] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const { fetchCartData, addToCart, removeFromCart } = useContext(StoreContext);

  useEffect(() => {
    const checkCartStatus = async () => {
      if (isAuthenticated) {
        const cartData = await fetchCartData();
        setIsInCart(cartData[id] > 0);
      }
    };

    checkCartStatus();
  }, [isAuthenticated, fetchCartData, id]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng.");
      return;
    }

    if (isInCart) {
      await removeFromCart(id);
      toast.info("Đã xóa khỏi giỏ hàng");
      setIsInCart(false);
    } else {
      await addToCart(id);
      toast.success("Đã thêm vào giỏ hàng!");
      setIsInCart(true);
    }
  };

  const handleViewDetails = () => {
    setIsPopupVisible(true);
  };

  const handleClosePopup = () => {
    setIsPopupVisible(false);
  };

  const imageUrl = `http://localhost:3056/images/${image}`;

  return (
    <div className="food-item">
      <div className="food-item-img-container">
        <img className="food-item-image" src={imageUrl} alt="" />
        <button
          className={`add-to-cart-btn ${isInCart ? "in-cart" : ""}`}
          onClick={handleAddToCart}
        >
          {isInCart ? "✓ Có trong giỏ hàng" : "Thêm vào giỏ hàng"}
        </button>
        <button className="view-details-btn" onClick={handleViewDetails}>
          Chi tiết
        </button>
      </div>
      <div className="food-item-info">
        <div className="food-item-name-rating">
          <p>{name}</p>
        </div>
        <p className="food-item-desc">{description}</p>
        <p className="food-item-price">{formatNumber(price)} VNĐ</p>
      </div>

      {isPopupVisible && (
        <div className="popup-overlay">
          <div className="popup-content">
            <button className="close-popup-btn" onClick={handleClosePopup}>
              X
            </button>
            <img src={imageUrl} alt={name} className="popup-image" />
            <h2 className="popup-name">{name}</h2>
            <hr className="line-under-name" />
            <p className="popup-description">{description}</p>
            <hr className="line-under-description" />
            <p className="popup-price">{formatNumber(price)} VNĐ</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FoodItem;
