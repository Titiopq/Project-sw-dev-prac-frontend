import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { useAuth } from "../auth/AuthContext";

interface LoginForm {
  email: string;
  password: string;
}

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState<LoginForm>({ email: "", password: "" });
  const [error, setError] = useState("");

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", form);
      login(res.data.token, res.data.user);
      navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="app-container">
      <div className="card form-card">
        <h2 className="page-title">Login</h2>
        {error && <p className="form-help" style={{ color: "#ff6b6b" }}>{error}</p>}
        <form onSubmit={onSubmit}>
          <div className="form-row">
            <label htmlFor="email">Email</label>
            <input id="email" className="form-input" name="email" type="email" value={form.email} onChange={onChange} />
          </div>

          <div className="form-row">
            <label htmlFor="password">Password</label>
            <input id="password" className="form-input" name="password" type="password" value={form.password} onChange={onChange} />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">Login</button>
          </div>
        </form>
      </div>
    </div>
  );
}
