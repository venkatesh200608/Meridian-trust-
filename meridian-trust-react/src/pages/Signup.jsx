import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import Logo from "../components/Logo.jsx";
import { Message, useMessage } from "../components/ui.jsx";

const empty = { fullName: "", email: "", username: "", password: "", confirm: "", deposit: "" };

export default function Signup() {
  const { user, signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(empty);
  const [message, show] = useMessage();

  if (user) return <Navigate to={user.role === "admin" ? "/admin" : "/user"} replace />;

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      return show({ ok: false, message: "Passwords do not match." });
    }
    const result = signup({
      fullName: form.fullName.trim(),
      email: form.email.trim(),
      username: form.username.trim(),
      password: form.password,
      deposit: form.deposit,
    });
    if (!result.ok) return show(result);
    navigate("/user", { replace: true });
  };

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <Logo />
        <h1>Create your account</h1>
        <p className="muted">Open a Meridian Trust account in a few seconds.</p>

        <Message message={message} />

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="fullName">Full name</label>
            <input id="fullName" value={form.fullName} onChange={set("fullName")} required />
          </div>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" value={form.email} onChange={set("email")} required />
          </div>
          <div className="field">
            <label htmlFor="username">Username</label>
            <input id="username" autoComplete="username" value={form.username} onChange={set("username")} required />
          </div>
          <div className="field-row">
            <div className="field">
              <label htmlFor="password">Password</label>
              <input id="password" type="password" minLength={6} value={form.password} onChange={set("password")} required />
            </div>
            <div className="field">
              <label htmlFor="confirm">Confirm password</label>
              <input id="confirm" type="password" minLength={6} value={form.confirm} onChange={set("confirm")} required />
            </div>
          </div>
          <div className="field">
            <label htmlFor="deposit">Opening deposit (optional)</label>
            <input id="deposit" type="number" min="0" step="1" placeholder="0" value={form.deposit} onChange={set("deposit")} />
          </div>
          <button type="submit" className="btn btn-primary btn-block">
            Create account
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}
