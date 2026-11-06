import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import Logo from "../components/Logo.jsx";
import { Message, useMessage } from "../components/ui.jsx";

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [message, show] = useMessage();

  // Already signed in → go straight to the right module.
  if (user) return <Navigate to={user.role === "admin" ? "/admin" : "/user"} replace />;

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = login(form.username, form.password);
    if (!result.ok) return show(result);
    navigate(result.user.role === "admin" ? "/admin" : "/user", { replace: true });
  };

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <Logo />
        <h1>Welcome back</h1>
        <p className="muted">Log in to your Meridian Trust account.</p>

        <div className="demo-note">
          <b>Demo accounts</b> — Admin: <b>admin / admin123</b> · User: <b>demo / demo123</b>
        </div>

        <Message message={message} />

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              autoComplete="username"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary btn-block">
            Log in
          </button>
        </form>

        <p className="auth-switch">
          New here? <Link to="/signup">Create an account</Link>
        </p>
      </div>
    </div>
  );
}
