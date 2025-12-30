import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const ALLOWED_USERS = [
  { email: "admin@gmail.com", password: "admin123" }
];

function Login({ onLogin, loading }) {
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });

  const showNotification = (message, type = "error") => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: "", type: "" }), 2800);
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginForm({ ...loginForm, [name]: value });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const { email, password } = loginForm;

    if (!email || !password) {
      showNotification("Email and password required", "error");
      return;
    }

    const user = ALLOWED_USERS.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) {
      showNotification("Invalid email or password", "error");
      return;
    }

    onLogin(); // Call App.jsx to set isLoggedIn
    setLoginForm({ email: "", password: "" });
  };

  return (
    <div className="login-screen">
      {notification.show && (
        <div className={`toast-notification ${notification.type}`}>
          <i
            className={`bi ${
              notification.type === "success" ? "bi-check-circle-fill" : "bi-exclamation-triangle-fill"
            } me-2`}
          ></i>
          {notification.message}
        </div>
      )}
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h1>
              <i className="bi bi-building me-2"></i>Employee Management System
            </h1>
            <p className="login-subtitle">Sign in to continue</p>
          </div>

          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                name="email"
                className="form-control"
                placeholder="Enter your email"
                value={loginForm.email}
                onChange={handleLoginChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Password *</label>
              <input
                type="password"
                name="password"
                className="form-control"
                placeholder="Enter your password"
                value={loginForm.password}
                onChange={handleLoginChange}
                required
              />
            </div>

            <button type="submit" className="btn btn-submit w-100" disabled={loading}>
              {loading ? "Checking..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
