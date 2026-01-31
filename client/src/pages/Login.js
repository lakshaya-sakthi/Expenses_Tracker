import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const submit = async () => {
    try {
      const res = await API.post("/api/auth/login", form);
      localStorage.setItem("token", res.data.token);
      login(res.data.token);
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-4">
          <div className="card shadow-lg border-">
            <div className="card-body">
              <h3 className="text-center mb-4">Login</h3>

              <input
                className="form-control mb-3"
                placeholder="Email"
                value={form.email}
                onChange={e =>
                  setForm({ ...form, email: e.target.value })
                }
              />

              <input
                type="password"
                className="form-control mb-4"
                placeholder="Password"
                value={form.password}
                onChange={e =>
                  setForm({ ...form, password: e.target.value })
                }
              />

              <button
                className="btn btn-primary w-100"
                onClick={submit}
              >
                Login
              </button>

              <p className="text-center mt-3 mb-0">
                New user? <Link to="/register">Register</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
