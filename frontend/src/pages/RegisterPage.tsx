import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

interface RegisterForm {
  name: string;
  email: string;
  tel: string;
  role: "admin" | "member";
  password: string;
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<RegisterForm>({
    name: "",
    email: "",
    tel: "",
    role: "member",
    password: "",
  });
  const [error, setError] = useState("");

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setError("Please enter a valid email format (example@domain.com)");
      return;
    }
    
    try {
      await api.post("/auth/register", form);
      alert("Register success");
      navigate("/login");
    } catch (err: any) {
      setError(err.response?.data?.error || "Register failed");
    }
  };

  return (
    <div className="app-container">
      <div className="card form-card">
        <h2 className="page-title">Register</h2>
        {error && <p className="form-help" style={{ color: "#ff6b6b" }}>{error}</p>}
        <form onSubmit={onSubmit}>
          <div className="form-row">
            <label htmlFor="name">Full name</label>
            <input id="name" className="form-input" name="name" placeholder="Your full name" value={form.name} onChange={onChange} />
          </div>

          <div className="form-row">
            <label htmlFor="email">Email</label>
            <input id="email" className="form-input" name="email" placeholder="you@example.com" value={form.email} onChange={onChange} />
          </div>

          <div className="form-row">
            <label htmlFor="tel">Telephone</label>
            <input id="tel" className="form-input" name="tel" placeholder="Phone number" value={form.tel} onChange={onChange} />
          </div>

          <div className="form-row">
            <label htmlFor="role">Role</label>
            <select id="role" className="form-input" name="role" value={form.role} onChange={onChange}>
              <option value="member">Member</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="form-row">
            <label htmlFor="password">Password</label>
            <input id="password" className="form-input" name="password" placeholder="Choose a password" type="password" value={form.password} onChange={onChange} />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">Register</button>
          </div>
        </form>
      </div>
    </div>
  );
}
