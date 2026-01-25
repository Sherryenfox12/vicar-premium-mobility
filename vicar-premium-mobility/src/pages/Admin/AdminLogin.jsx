import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdminLogin.css';
import { loginAccount } from '../../api/api.jsx';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const login = async (username, password) => {
    try {
      
      // Encode username and password to base64 before sending
      const encodedUsername = btoa(username);
      const encodedPassword = btoa(password);
      
      const response = await axios.post(loginAccount,
        {
          username: encodedUsername,
          password: encodedPassword
        });

      const { token, user } = response.data;

      // Combine token and user data into a single object
      const authData = {
        token,
        user,
      };

      // Store the combined object in localStorage
      localStorage.setItem('authTokenData', JSON.stringify(authData));

      navigate('/admin/dashboard', { state: {} });

    } catch (error) {
      console.error('Error fetching formData:', error.message);
      alert("Failed login, please check the username and password and try again.")
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    login(username.trim(), password.trim());
  };

  return (
    <div className="admin-login">
      <div className="login-container">
        <h1>Admin Login</h1>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              required
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="login-btn">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
