import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const submit = async () => {
    try {
      await API.post("/api/auth/register", form);
      setMessage("Registered! Redirecting to login...");
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      setMessage(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="container mt-5 d-flex justify-content-center">
      <div className="card shadow-lg p-4" style={{ width: "100%", maxWidth: "400px" }}>
        <h3 className="text-center mb-3">Register</h3>

        {message && (
          <div className="alert alert-info text-center py-2">
            {message}
          </div>
        )}

        <input
          className="form-control mb-2"
          placeholder="Name"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
        />

        <input
          className="form-control mb-2"
          placeholder="Email"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          className="form-control mb-3"
          placeholder="Password"
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
        />

        <button className="btn btn-success w-100 mb-2" onClick={submit}>
          Register
        </button>

        <p className="text-center mt-2 mb-0">
          Already have an account?
          <Link to="/" className="fw-semibold">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
