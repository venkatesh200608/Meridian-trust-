import { getLoans, getUsers, fmtDate, money } from "../../lib/storage";
import { PageHeader, StatCard, Table } from "../../components/ui.jsx";

export default function AdminDashboard() {
  const users = getUsers().filter((u) => u.role === "user");
  const loans = getLoans();

  const holdings = users.reduce((sum, u) => sum + u.balance, 0);
  const pending = loans.filter((l) => l.status === "Pending").length;
  const frozen = users.filter((u) => u.status === "frozen").length;

  const recent = [...users]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 6);

  return (
    <>
      <PageHeader title="Admin dashboard" subtitle="Bank-wide overview" />

      <div className="stat-grid">
        <StatCard label="Registered users" value={users.length} />
        <StatCard label="Total bank holdings" value={money(holdings)} />
        <StatCard label="Pending loan requests" value={pending} />
        <StatCard label="Frozen accounts" value={frozen} />
      </div>

      <section className="card pad">
        <h2>Recently opened accounts</h2>
        <Table
          columns={[
            { label: "Name" },
            { label: "Username" },
            { label: "Account no." },
            { label: "Opened" },
            { label: "Balance", num: true },
          ]}
          rows={recent}
          empty="No user accounts yet."
          renderRow={(u) => (
            <tr key={u.id}>
              <td>{u.fullName}</td>
              <td>{u.username}</td>
              <td className="mono">{u.accountNumber}</td>
              <td>{fmtDate(u.createdAt)}</td>
              <td className="num mono">{money(u.balance)}</td>
            </tr>
          )}
        />
      </section>
    </>
  );
}
