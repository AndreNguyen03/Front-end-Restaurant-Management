import React, { useState, useEffect } from "react";
import "./Orders.css";
import axios from "axios";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import formatNumber from "../../utils/formatNumber";

const Orders = ({ url }) => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${url}/api/order/fetch`);
      if (!response.data.success) {
        toast.error("Không tìm thấy danh sách đơn hàng");
        return;
      }
      setOrders(response.data.data);
    } catch (error) {
      toast.error("Không thể lấy danh sách đơn hàng");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
  };

  const closeOrderDetails = () => {
    setSelectedOrder(null);
  };

  return (
    <div className="orders-list table-layout">
      <div>
        <div className="menu-table-header">
          <b>Thời gian đặt hàng</b>
          <b>Tên khách hàng</b>
          <b>Số điện thoại</b>
          <b>Trạng thái</b>
          <b>Hành động</b>
        </div>
        {orders.map((order, index) => (
          <div key={index} className="menu-table-row">
            <p>{new Date(order.createdAt).toLocaleString()}</p>
            <p>{order.customer.name}</p>
            <p>{order.customer.phone}</p>
            <p>{order.status}</p>
            <div className="menu-item-actions">
              <FontAwesomeIcon
                className="menu-action-icon"
                icon={faEye}
                onClick={() => viewOrderDetails(order)}
              />
            </div>
          </div>
        ))}
      </div>
      {selectedOrder && (
        <div className="modal">
          <div className="order-details-content">
            <h2>Chi tiết đơn hàng</h2>
            <p>
              <strong>Thời gian đặt hàng:</strong>{" "}
              {new Date(selectedOrder.createdAt).toLocaleString()}
            </p>
            <p>
              <strong>Tên khách hàng:</strong> {selectedOrder.customer.name}
            </p>
            <p>
              <strong>Số điện thoại:</strong> {selectedOrder.customer.phone}
            </p>
            <p>
              <strong>Địa chỉ:</strong>{" "}
              {`${selectedOrder.exactAddress}, ${selectedOrder.ward}, ${selectedOrder.district}`}
            </p>
            <p>
              <strong>Tổng tiền:</strong> {formatNumber(selectedOrder.amount)}{" "}
              VND
            </p>
            <p>
              <strong>Trạng thái:</strong> {selectedOrder.status}
            </p>
            <h3>Món ăn</h3>
            <ul>
              {selectedOrder.items.map((item, index) => (
                <li key={index}>
                  {item.name} - Số lượng: {item.quantity} - Giá:{" "}
                  {formatNumber(item.price)} VND
                </li>
              ))}
            </ul>
            <div className="button-container">
              <button onClick={closeOrderDetails}>Đóng</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
