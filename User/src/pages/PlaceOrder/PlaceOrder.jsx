import React, { useContext, useState, useEffect } from "react";
import "./PlaceOrder.css";
import { AuthContext } from "../../context/AuthContext";
import { StoreContext } from "../../context/StoreContext";
import formatNumber from "../../utils/FormatNumber";
import axios from "axios";

const PlaceOrder = () => {
  const { isAuthenticated, user } = useContext(AuthContext);
  const { fetchCartData, foodList } = useContext(StoreContext);
  const [deliveryInfo, setDeliveryInfo] = useState({
    fullName: "",
    email: "",
    city: "Thành phố Hồ Chí Minh",
    district: "",
    ward: "",
    exactAddress: "",
    phoneNumber: "",
  });
  const [cartItems, setCartItems] = useState({});
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [addresses, setAddresses] = useState([]);

  useEffect(() => {
    if (isAuthenticated && user) {
      setDeliveryInfo({
        fullName: user.fullName || "",
        email: user.email || "",
        city: "Thành phố Hồ Chí Minh",
        district: "",
        ward: "",
        exactAddress: "",
        phoneNumber: user.phoneNumber || "",
      });
      fetchAddresses(user.customerId);
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    const fetchCartItems = async () => {
      const cartData = await fetchCartData();
      setCartItems(cartData);
    };

    fetchCartItems();
  }, [fetchCartData]);

  useEffect(() => {
    const fetchDistricts = async () => {
      const response = await axios.get(
        "https://provinces.open-api.vn/api/p/79?depth=2",
        {
          withCredentials: false,
        }
      );
      setDistricts(response.data.districts);
    };

    fetchDistricts();
  }, []);

  const fetchAddresses = async (customerId) => {
    try {
      const response = await axios.post(
        `http://localhost:3056/api/address/fetchList`,
        { customerId }
      );
      if (response.data.success && response.data.data.length > 0) {
        setAddresses(response.data.data);
        const defaultAddress =
          response.data.data.find((address) => address.isDefault) ||
          response.data.data[0];
        setDeliveryInfo((prevInfo) => ({
          ...prevInfo,
          district: defaultAddress.district,
          ward: defaultAddress.ward,
          exactAddress: defaultAddress.exactAddress,
        }));
      } else {
        fetchDefaultAddress(customerId);
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách địa chỉ:", error);
    }
  };

  const fetchDefaultAddress = async (customerId) => {
    try {
      const response = await axios.post(
        `http://localhost:3056/api/address/getDefault`,
        { customerId }
      );
      if (response.data.success && response.data.data) {
        setDeliveryInfo((prevInfo) => ({
          ...prevInfo,
          district: response.data.data.district,
          ward: response.data.data.ward,
          exactAddress: response.data.data.exactAddress,
        }));
        axios.defaults.withCredentials = false;
        const districtResponse = await axios.get(
          `https://provinces.open-api.vn/api/d/${response.data.data.district}?depth=2`,
          {
            withCredentials: false,
          }
        );
        setWards(districtResponse.data.wards);
      }
    } catch (error) {
      console.error("Lỗi khi lấy địa chỉ mặc định:", error);
    }
  };

  const handleAddressChange = (e) => {
    const selectedAddress = addresses.find(
      (address) => address._id === e.target.value
    );
    if (selectedAddress) {
      setDeliveryInfo({
        ...deliveryInfo,
        district: selectedAddress.district,
        ward: selectedAddress.ward,
        exactAddress: selectedAddress.exactAddress,
      });
    }
  };

  const handleDistrictChange = async (e) => {
    const districtCode = e.target.value;
    setDeliveryInfo((prevInfo) => ({
      ...prevInfo,
      district: districtCode,
      ward: "",
    }));
    const response = await axios.get(
      `https://provinces.open-api.vn/api/d/${districtCode}?depth=2`,
      {
        withCredentials: false,
      }
    );
    setWards(response.data.wards);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDeliveryInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  const getDistrictName = async (districtCode) => {
    axios.defaults.withCredentials = false;
    const response = await axios.get(
      `https://provinces.open-api.vn/api/d/${districtCode}`
    );
    return response.data.name;
  };

  const getWardName = async (wardCode) => {
    axios.defaults.withCredentials = false;
    const response = await axios.get(
      `https://provinces.open-api.vn/api/w/${wardCode}`
    );
    return response.data.name;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const items = Object.keys(cartItems).map((itemId) => {
      return {
        _id: itemId,
        quantity: cartItems[itemId],
      };
    });
    const amount = getTotalPrice();

    let districtName = deliveryInfo.district;
    let wardName = deliveryInfo.ward;

    if (districts.length > 0 && !isNaN(districtName)) {
      districtName = await getDistrictName(deliveryInfo.district);
    }

    if (wards.length > 0 && !isNaN(wardName)) {
      wardName = await getWardName(deliveryInfo.ward);
    }

    try {
      const response = await axios.post(
        "http://localhost:3056/api/payment/create-order",
        {
          customerId: user.customerId,
          fullName: deliveryInfo.fullName,
          email: deliveryInfo.email,
          phoneNumber: deliveryInfo.phoneNumber,
          city: deliveryInfo.city,
          district: districtName,
          ward: wardName,
          exactAddress: deliveryInfo.exactAddress,
          items,
          amount,
        }
      );
      // Handle the order creation response
      console.log("Order created:", response.data);
      // Redirect to a confirmation page or show a success message
      window.location.href = response.data.data.order_url;
    } catch (error) {
      console.error("Lỗi khi tạo đơn hàng:", error);
    }
  };

  const getTotalPrice = () => {
    return Object.keys(cartItems).reduce((total, itemId) => {
      const item = foodList.find((food) => food._id === itemId);
      return total + (item ? item.price * cartItems[itemId] : 0);
    }, 0);
  };

  return (
    <div className="place-order">
      <form className="place-order-left" onSubmit={handleSubmit}>
        <p className="title">Thông tin giao hàng</p>
        <input
          type="text"
          name="fullName"
          placeholder="Họ và tên"
          value={deliveryInfo.fullName}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Địa chỉ email"
          value={deliveryInfo.email}
          onChange={handleChange}
          required
        />
        <select name="city" value={deliveryInfo.city} disabled>
          <option value="Thành phố Hồ Chí Minh">Thành phố Hồ Chí Minh</option>
        </select>
        {addresses.length > 0 ? (
          <select name="address" onChange={handleAddressChange} required>
            {addresses.map((address) => (
              <option key={address._id} value={address._id}>
                {`${address.exactAddress}, ${address.ward}, ${address.district}`}
              </option>
            ))}
          </select>
        ) : (
          <>
            <select
              name="district"
              value={deliveryInfo.district}
              onChange={handleDistrictChange}
              required
            >
              <option value="">Chọn Quận/Huyện</option>
              {districts.map((district) => (
                <option key={district.code} value={district.code}>
                  {district.name}
                </option>
              ))}
            </select>
            <select
              name="ward"
              value={deliveryInfo.ward}
              onChange={handleChange}
              required
            >
              <option value="">Chọn Phường/Xã</option>
              {wards.map((ward) => (
                <option key={ward.code} value={ward.code}>
                  {ward.name}
                </option>
              ))}
            </select>
            <input
              type="text"
              name="exactAddress"
              placeholder="Địa chỉ cụ thể"
              value={deliveryInfo.exactAddress}
              onChange={handleChange}
              required
            />
          </>
        )}
        <input
          type="text"
          name="phoneNumber"
          placeholder="Số điện thoại"
          value={deliveryInfo.phoneNumber}
          onChange={handleChange}
          required
        />
        <button type="submit" className="submit-btn">
          Đặt hàng
        </button>
      </form>
      <div className="place-order-right">
        <p className="title">Tóm tắt đơn hàng</p>
        <div className="order-summary">
          {Object.keys(cartItems).map((itemId) => {
            const item = foodList.find((food) => food._id === itemId);
            return (
              <div key={itemId} className="order-item">
                <p>{item.name}</p>
                <p>Số lượng: {cartItems[itemId]}</p>
                <p>Giá: {formatNumber(item.price)} VND</p>
              </div>
            );
          })}
        </div>
        <div className="order-total">
          <p>Tổng giá: {formatNumber(getTotalPrice())} VND</p>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;
