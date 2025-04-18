import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/api";

const LoginPage = ({ setUser }) => {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser(credentials);
      localStorage.setItem("token", response.token);
      setUser(response.token);
      navigate("/");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="container mt-5">
      <form onSubmit={handleSubmit} className="w-50 mx-auto">
        <h2 className="mb-4">Login</h2>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Username"
            onChange={(e) => setCredentials({...credentials, username: e.target.value})}
          />
        </div>
        <div className="mb-3">
          <input
            type="password"
            className="form-control"
            placeholder="Password"
            onChange={(e) => setCredentials({...credentials, password: e.target.value})}
          />
        </div>
        <button type="submit" className="btn btn-primary">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;