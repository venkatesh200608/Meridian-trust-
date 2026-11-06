// Small shared building blocks so pages stay short and consistent.
import { useState } from "react";

export function PageHeader({ title, subtitle }) {
  return (
    <header className="page-header">
      <h1>{title}</h1>
      {subtitle && <p>{subtitle}</p>}
    </header>
  );
}

export function StatCard({ label, value }) {
  return (
    <div className="card stat-card">
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
    </div>
  );
}

export function Tag({ tone = "neutral", children }) {
  return <span className={`tag tag-${tone}`}>{children}</span>;
}

// Inline success / error message shown under a form.
export function Message({ message }) {
  if (!message) return null;
  return <div className={`banner banner-${message.ok ? "ok" : "error"}`}>{message.text}</div>;
}

// Hook: keeps the latest form result so <Message /> can display it.
export function useMessage() {
  const [message, setMessage] = useState(null);
  const show = (result) => setMessage({ ok: result.ok, text: result.message });
  const clear = () => setMessage(null);
  return [message, show, clear];
}

export function Table({ columns, rows, empty = "Nothing to show yet.", renderRow }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c.label} className={c.num ? "num" : ""}>
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="empty">
                {empty}
              </td>
            </tr>
          ) : (
            rows.map(renderRow)
          )}
        </tbody>
      </table>
    </div>
  );
}

export const statusTone = (status) =>
  ({ active: "ok", frozen: "danger", Approved: "ok", Rejected: "danger", Pending: "warn" }[status] || "neutral");
