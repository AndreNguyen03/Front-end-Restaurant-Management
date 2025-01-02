import React, { useState, useEffect, useContext } from "react";
import "./Cart.css";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";
import formatNumber from "../../utils/FormatNumber";
import axios from "axios";

const Cart = () => {
  const [cartItems, setCartItems] = useState({});
  const { foodList, removeFromCart } = useContext(StoreContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCartData = async () => {
      axios.defaults.withCredentials = true;
      try {
        const response = await axios.get(
          "http://localhost:3056/api/cart/getCart"
        );
        if (response.data.success) {
          setCartItems(response.data.cartData);
        }
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    };

    fetchCartData();
  }, []);

  const handleQuantityChange = (itemId, quantity) => {
    const newCartItems = {
      ...cartItems,
      [itemId]: quantity,
    };
    setCartItems(newCartItems);
  };

  const handleQuantityBlur = async (itemId, quantity) => {
    if (quantity < 1) {
      quantity = 1;
    }
    const newCartItems = {
      ...cartItems,
      [itemId]: quantity,
    };
    setCartItems(newCartItems);
    await updateCartInBackend(newCartItems);
  };

  const updateCartInBackend = async (cartData) => {
    axios.defaults.withCredentials = true;
    try {
      await axios.post("http://localhost:3056/api/cart/update", {
        cartData,
      });
    } catch (error) {
      console.error("Error updating cart:", error);
    }
  };

  const handleRemoveFromCart = async (itemId) => {
    const newCartItems = { ...cartItems };
    delete newCartItems[itemId];
    setCartItems(newCartItems);
    await removeFromCart(itemId);
  };

  const getTotalCartAmount = () => {
    let total = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        const itemInfo = foodList.find((product) => product._id === item);
        if (itemInfo) {
          total += itemInfo.price * cartItems[item];
        }
      }
    }
    return total;
  };

  let deliveryFee = 0;
  if (getTotalCartAmount() !== 0 && getTotalCartAmount() < 30) deliveryFee = 5;

  const url = "http://localhost:3056/images/";

  return (
    <div className="cart">
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Hình ảnh</p>
          <p>Tên</p>
          <p>Giá</p>
          <p>Số lượng</p>
          <p>Tổng tiền</p>
          <p>Xóa</p>
        </div>
        <br />
        <hr />
        {foodList.map((item, index) => {
          if (cartItems[item._id] > 0) {
            return (
              <div key={index}>
                <div className="cart-items-title cart-items-item">
                  <img src={url + item.image} alt="" />
                  <p>{item.name}</p>
                  <p>{formatNumber(item.price)} VND</p>
                  <input
                    type="number"
                    min="1"
                    value={cartItems[item._id]}
                    onChange={(e) =>
                      handleQuantityChange(
                        item._id,
                        parseInt(e.target.value) || 1
                      )
                    }
                    onBlur={(e) =>
                      handleQuantityBlur(
                        item._id,
                        parseInt(e.target.value) || 1
                      )
                    }
                    className="quantity-input"
                  />
                  <p>{formatNumber(item.price * cartItems[item._id])} VND</p>
                  <p
                    onClick={() => handleRemoveFromCart(item._id)}
                    className="cross"
                  >
                    x
                  </p>
                </div>
                <hr></hr>
              </div>
            );
          }
        })}
      </div>
      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Tổng tiền giỏ hàng: </h2>
          <div>
            <div className="cart-total-details">
              <p>Tổng tiền</p>
              <p>{formatNumber(getTotalCartAmount())} VND</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Phí vận chuẩn</p>
              <p>
                {formatNumber(getTotalCartAmount() === 0 ? 0 : deliveryFee)} VND
              </p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Tổng chi phí</p>
              <p>{formatNumber(getTotalCartAmount() + deliveryFee)} VND</p>
            </div>
          </div>
          <button onClick={() => navigate("/order")}>
            Tiến hành thanh toán
          </button>
        </div>
        
      </div>
    </div>
  );
};

export default Cart;
