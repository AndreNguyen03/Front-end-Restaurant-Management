import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import './UpdateAddress.css';
import { AuthContext } from '../../context/AuthContext';

const UpdateAddress = () => {
  const { user } = useContext(AuthContext);
  const [addresses, setAddresses] = useState([]);
  const [newAddress, setNewAddress] = useState({
    district: '',
    districtName: '',
    ward: '',
    wardName: '',
    exactAddress: '',
    isDefault: false,
  });
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  useEffect(() => {
    if (user) {
      fetchAddresses(user.customerId);
    }
    fetchDistricts();
  }, [user]);

  const fetchAddresses = async (customerId) => {
    try {
      const response = await axios.post('http://localhost:3056/api/address/fetchList', { customerId });
      setAddresses(response.data.data);
    } catch (error) {
      console.error('Error fetching addresses:', error);
    }
  };

  const fetchDistricts = async () => {
    try {
      const response = await axios.get("https://provinces.open-api.vn/api/p/79?depth=2", {
        withCredentials: false,
      });
      setDistricts(response.data.districts);
    } catch (error) {
      console.error('Error fetching districts:', error);
    }
  };

  const fetchWards = async (districtCode) => {
    try {
      const response = await axios.get(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`, {
        withCredentials: false,
      });
      setWards(response.data.wards);
    } catch (error) {
      console.error('Error fetching wards:', error);
    }
  };

  const handleDistrictChange = (e) => {
    const districtCode = e.target.value;
    const districtName = e.target.options[e.target.selectedIndex].text;
    if (districtCode === "") {
      setWards([]);
      setNewAddress((prevAddress) => ({
        ...prevAddress,
        district: "",
        districtName: "",
        ward: "",
        wardName: "",
      }));
    } else {
      setNewAddress((prevAddress) => ({
        ...prevAddress,
        district: districtCode,
        districtName: districtName,
        ward: '',
        wardName: '',
      }));
      fetchWards(districtCode);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const text = e.target.options ? e.target.options[e.target.selectedIndex].text : value;
    setNewAddress((prevAddress) => ({
      ...prevAddress,
      [name]: value,
      [`${name}Name`]: text,
    }));
  };

  const handleAddAddress = async () => {
    try {
      await axios.post('http://localhost:3056/api/address/add', { 
        ...newAddress, 
        customerId: user.customerId,
        district: Number(newAddress.district),
        ward: Number(newAddress.ward)
      });
      fetchAddresses(user.customerId);
      setNewAddress({
        district: '',
        districtName: '',
        ward: '',
        wardName: '',
        exactAddress: '',
        isDefault: false,
      });
    } catch (error) {
      console.error('Error adding address:', error);
    }
  };

  const handleSetDefault = async (addressId) => {
    try {
      await axios.post('http://localhost:3056/api/address/setDefault', { addressId, customerId: user.customerId });
      fetchAddresses(user.customerId);
    } catch (error) {
      console.error('Error setting default address:', error);
    }
  };

  const handleEditAddress = async (addressId) => {
    // Implement edit address functionality
  };

  const handleDeleteAddress = async (addressId) => {
    try {
      await axios.post('http://localhost:3056/api/address/delete', { addressId });
      fetchAddresses(user.customerId);
    } catch (error) {
      console.error('Error deleting address:', error);
    }
  };

  return (
    <div className="update-address">
      <h2>Quản lý địa chỉ</h2>
      <div className="add-address">
        <h3>Thêm địa chỉ mới</h3>
        <select name="district" value={newAddress.district} onChange={handleDistrictChange} required>
          <option value="">Chọn Quận/Huyện</option>
          {districts.map((district) => (
            <option key={district.code} value={district.code}>
              {district.name}
            </option>
          ))}
        </select>
        <select name="ward" value={newAddress.ward} onChange={handleChange} required>
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
          value={newAddress.exactAddress}
          onChange={handleChange}
        />
        <button onClick={handleAddAddress}>Thêm địa chỉ</button>
      </div>
      <div className="address-list">
        <h3>Danh sách địa chỉ</h3>
        {addresses && addresses.length > 0 ? (
          addresses.map((address) => (
            <div key={address._id} className="address-item">
              <p>Quận/Huyện: {address.district}</p>
              <p>Phường/Xã: {address.ward}</p>
              <p>Địa chỉ cụ thể: {address.exactAddress}</p>
              <p>Mặc định: {address.isDefault ? 'Có' : 'Không'}</p>
              <button onClick={() => handleSetDefault(address._id)}>Đặt làm mặc định</button>
              <button onClick={() => handleDeleteAddress(address._id)}>Xóa</button>
            </div>
          ))
        ) : (
          <p>Không có địa chỉ nào</p>
        )}
      </div>
    </div>
  );
};

export default UpdateAddress;