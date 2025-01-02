import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Ensure cookies are sent with the request
      axios.defaults.withCredentials = true;

      const response = await axios.post('http://localhost:3056/api/eAuth/login', { 
        username, 
        password 
      });

      // Assuming the backend returns the role in the response
      const { role } = response.data.data;

      // Call login from AuthContext
      login(role);

      // Navigate based on role
      if (role === 'admin') {
        navigate('/list');
      } else {
        navigate('/orders');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Đăng nhập</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Tên đăng nhập"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mật khẩu"
            required
          />
          <button type="submit">Đăng nhập</button>
          {error && <p className="error">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default Login;