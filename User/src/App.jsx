// App.jsx
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/Home/Home";
import Cart from "./pages/Cart/Cart";
import Comment from "./pages/Comment/Comment";
import PlaceOrder from "./pages/PlaceOrder/PlaceOrder";
import Footer from "./components/Footer/Footer";
import { useState, useEffect } from "react";
import LoginPopup from "./components/LoginPopup/LoginPopup";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthContextProvider from "./context/AuthContext";
import StoreContextProvider from "./context/StoreContext";
import ChangePassword from "./pages/ChangePassword/ChangePassword";
import UpdateProfile from "./pages/UpdateProfile/UpdateProfile";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import UpdateAddress from "./pages/UpdateAddress/UpdateAddress";
const App = () => {
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    if (showLogin) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showLogin]);

  return (
    <AuthContextProvider>
      <StoreContextProvider>
        {showLogin && <LoginPopup setShowLogin={setShowLogin} />}
        <div className="app">
          <Navbar setShowLogin={setShowLogin} />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/order" element={<PlaceOrder />} />
            <Route path="/comment" element={<Comment />} />
            <Route
              path="/change-password"
              element={
                <ProtectedRoute>
                  <ChangePassword />
                </ProtectedRoute>
              }
            />
            <Route
              path="/update-profile"
              element={
                <ProtectedRoute>
                  <UpdateProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/update-address"
              element={
                <ProtectedRoute>
                  <UpdateAddress />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
        <Footer />
        <ToastContainer />
      </StoreContextProvider>
    </AuthContextProvider>
  );
};

export default App;
