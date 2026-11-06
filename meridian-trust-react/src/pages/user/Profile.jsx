import { useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { changePassword } from "../../lib/bank";
import { fmtDate } from "../../lib/storage";
import { Message, PageHeader, useMessage } from "../../components/ui.jsx";

const empty = { current: "", next: "" };

export default function Profile() {
  const { user, refresh } = useAuth();
  const [form, setForm] = useState(empty);
  const [message, show] = useMessage();

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = changePassword(user.id, form.current, form.next);
    show(result);
    if (result.ok) {
      setForm(empty);
      refresh();
    }
  };

  const details = [
    ["Full name", user.fullName],
    ["Username", user.username],
    ["Email", user.email],
    ["Account number", user.accountNumber],
    ["Member since", fmtDate(user.createdAt)],
  ];

  return (
    <>
      <PageHeader title="Profile" subtitle="Your account details and security" />

      <div className="two-col">
        <section className="card pad">
          <h2>Account details</h2>
          {details.map(([label, value]) => (
            <div key={label} className="list-row">
              <span className="muted">{label}</span>
              <span className="strong">{value}</span>
            </div>
          ))}
        </section>

        <section className="card pad">
          <h2>Change password</h2>
          <Message message={message} />
          <form onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="current">Current password</label>
              <input id="current" type="password" value={form.current} onChange={(e) => setForm({ ...form, current: e.target.value })} required />
            </div>
            <div className="field">
              <label htmlFor="next">New password</label>
              <input id="next" type="password" minLength={6} value={form.next} onChange={(e) => setForm({ ...form, next: e.target.value })} required />
            </div>
            <button type="submit" className="btn btn-ghost btn-block">Update password</button>
          </form>
        </section>
      </div>
    </>
  );
}
