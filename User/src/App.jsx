import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/Home/Home";
import Cart from "./pages/Cart/Cart";
import PlaceOrder from "./pages/PlaceOrder/PlaceOrder";
import Footer from "./components/Footer/Footer";
import { useState,useEffect } from "react";
import LoginPopup from "./components/LoginPopup/LoginPopup";
const App = () => {

const [showLogin, setShowLogin] = useState(false);

useEffect(() => {
  if (showLogin) {
    // Khi popup hiển thị, ẩn cuộn
    document.body.style.overflow = "hidden";
  } else {
    // Khôi phục cuộn khi popup đóng
    document.body.style.overflow = "auto";
  }
  return () => {
    // Đảm bảo khôi phục trạng thái ban đầu khi component unmount
    document.body.style.overflow = "auto";
  };
}, [showLogin]);


  return (
    <>
      {showLogin&& <LoginPopup setShowLogin={setShowLogin} />}
      <div className="app">
        <Navbar setShowLogin={setShowLogin} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/order" element={<PlaceOrder />} />
        </Routes>
      </div>
      <Footer />
    </>
  );
};

export default App;
