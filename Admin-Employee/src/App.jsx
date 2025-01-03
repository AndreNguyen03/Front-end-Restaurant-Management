import React from "react";
import Navbar from "./components/Navbar/Navbar";
import Sidebar from "./components/Sidebar/Sidebar";
import { Route, Routes } from "react-router-dom";
import DishList from "./pages/DishList/DishList";
import Orders from "./pages/Orders/Orders";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtecedRoute/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./pages/Login/Login";
import Employees from "./pages/Employees/Employees";
import TableList from "./pages/TableList/Table";
import Ingredients from './pages/Ingredients/Ingredients'
import TableLayout from './pages/Table/TableLayout'
import { TableProvider } from './context/TableContext'
import Invoice from './pages/Invoice/Invoice'
import Reservation from './pages/Reservation/Reservation'
import PurchasePage from "./pages/Purchases/PurchasePage";
import Revenue from "./pages/Revenue/Revenue";

const App = () => {
  const backend_url = "http://localhost:3056";
  return (
    <AuthProvider>
      <div>
        <ToastContainer />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <div>
                  <Navbar />
                  <hr />
                  <div className="app-content">
                    <Sidebar />
                    <Routes>
                      <Route
                        path="/list"
                        element={
                          <ProtectedRoute allowedRoles={["admin"]}>
                            <DishList url={backend_url} />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/table"
                        element={
                          <ProtectedRoute allowedRoles={["admin"]}>
                            <TableList url={backend_url} />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/orders"
                        element={
                          <ProtectedRoute allowedRoles={["employee"]}>
                            <Orders url={backend_url} />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/tableservice"
                        element={
                          <ProtectedRoute allowedRoles={['employee']}>
                            <TableProvider>
                              <TableLayout />
                            </TableProvider>
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/invoice"
                        element={
                          <ProtectedRoute allowedRoles={['employee']}>
                            <Invoice />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/reservation"
                        element={
                          <ProtectedRoute allowedRoles={['employee']}>
                            <Reservation />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/purchases"
                        element={
                          <ProtectedRoute allowedRoles={["admin"]}>
                            <PurchasePage url={backend_url} />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/employees"
                        element={
                          <ProtectedRoute allowedRoles={["admin"]}>
                            <Employees url={backend_url} />
                          </ProtectedRoute>
                        }
                      />
                      <Route path="/ingredients" 
                    element={
                      <ProtectedRoute allowedRoles={["admin"]}>
                    <Ingredients url={backend_url} />
                      </ProtectedRoute>
                    }
                  />
                    <Route path= "/revenue" 
                    element={
                      <ProtectedRoute allowedRoles={["admin"]}>
                        <Revenue url={backend_url} />
                      </ProtectedRoute>
                    }
                    />
                    </Routes>                  
                  </div>
                </div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </AuthProvider>
  );
};

export default App;
