import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const StoreContext = createContext(null);

const StoreContextProvider = ({ children }) => {
  const [foodList, setFoodList] = useState([]);

  useEffect(() => {
    const fetchFoodList = async () => {
      try {
        const response = await axios.get("http://localhost:3056/api/dish/list");
        if (response.data.success) {
          setFoodList(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching food list:", error);
      }
    };

    fetchFoodList();
  }, []);

  const fetchCartData = async () => {
    axios.defaults.withCredentials = true;
    try {
      const response = await axios.get(
        "http://localhost:3056/api/cart/getCart"
      );
      if (response.data.success) {
        return response.data.cartData;
      }
    } catch (error) {
      console.error("Error fetching cart data:", error);
    }
    return {};
  };

  const addToCart = async (itemId) => {
    axios.defaults.withCredentials = true;
    try {
      await axios.post(
        "http://localhost:3056/api/cart/update",
        { cartData: { [itemId]: 1 } }
      );
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const removeFromCart = async (itemId) => {
    axios.defaults.withCredentials = true;
    try {
      await axios.post(
        "http://localhost:3056/api/cart/update",
        { cartData: { [itemId]: 0 } }
      );
    } catch (error) {
      console.error("Error removing from cart:", error);
    }
  };

  

  const contextValue = {
    foodList,
    fetchCartData,
    addToCart,
    removeFromCart,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;