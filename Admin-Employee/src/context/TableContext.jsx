import React, { createContext, useContext, useState } from 'react';

// Tạo context
const TableContext = createContext();

// Tạo provider
export const TableProvider = ({ children }) => {
  const [cartData, setCartData] = useState({}); // Lưu trữ giỏ hàng của từng bàn

  // Thêm món vào giỏ hàng của bàn
  const addToCart = (tableId, dish) => {
    setCartData((prevData) => {
      const updatedCart = { ...prevData };
      if (!updatedCart[tableId]) {
        updatedCart[tableId] = [];
      }

      // Kiểm tra xem món đã có trong giỏ hàng chưa
      const existingItem = updatedCart[tableId].find(item => item._id === dish._id);
      if (existingItem) {
        existingItem.quantity += 1; // Tăng số lượng nếu món đã có
      } else {
        updatedCart[tableId].push({ ...dish, quantity: 1 }); // Thêm món mới vào giỏ
      }

      return updatedCart;
    });
  };

  // Cập nhật số lượng món trong giỏ hàng
  const updateQuantity = (tableId, dishId, newQuantity) => {
    setCartData((prevData) => {
      const updatedCart = { ...prevData };
      if (updatedCart[tableId]) {
        const dish = updatedCart[tableId].find(item => item._id === dishId);
        if (dish && newQuantity > 0) {
          dish.quantity = newQuantity; // Cập nhật số lượng
        }
      }
      return updatedCart;
    });
  };

  // Xóa món khỏi giỏ hàng
  const removeFromCart = (tableId, dishId) => {
    setCartData((prevData) => {
      const updatedCart = { ...prevData };
      if (updatedCart[tableId]) {
        updatedCart[tableId] = updatedCart[tableId].filter(item => item._id !== dishId); // Xóa món khỏi giỏ
      }
      return updatedCart;
    });
  };

  // Reset giỏ hàng của một bàn
  const resetCart = (tableId) => {
    setCartData((prevData) => {
      const updatedCart = { ...prevData };
      delete updatedCart[tableId]; // Xóa giỏ hàng của bàn
      return updatedCart;
    });
  };

  return (
    <TableContext.Provider value={{ cartData, addToCart, updateQuantity, removeFromCart, resetCart }}>
      {children}
    </TableContext.Provider>
  );
};

// Hook để sử dụng context
export const useTableCart = () => useContext(TableContext);
