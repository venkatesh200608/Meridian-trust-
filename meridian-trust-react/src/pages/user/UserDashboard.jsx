import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { fmtDate, getTx, money } from "../../lib/storage";
import { PageHeader, StatCard, Table, Tag } from "../../components/ui.jsx";

export default function UserDashboard() {
  const { user } = useAuth();
  const tx = getTx()
    .filter((t) => t.userId === user.id)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const credited = tx.filter((t) => t.type === "credit").reduce((s, t) => s + t.amount, 0);
  const debited = tx.filter((t) => t.type === "debit").reduce((s, t) => s + t.amount, 0);

  return (
    <>
      <PageHeader
        title={`Hello, ${user.fullName.split(" ")[0]}`}
        subtitle={`Account ${user.accountNumber}`}
      />

      <div className="stat-grid">
        <StatCard label="Current balance" value={money(user.balance)} />
        <StatCard label="Total credited" value={money(credited)} />
        <StatCard label="Total debited" value={money(debited)} />
      </div>

      <div className="two-col">
        <section className="card pad">
          <h2>Recent activity</h2>
          <Table
            columns={[
              { label: "Date" },
              { label: "Description" },
              { label: "Category" },
              { label: "Amount", num: true },
            ]}
            rows={tx.slice(0, 6)}
            empty="No transactions yet."
            renderRow={(t) => (
              <tr key={t.id}>
                <td className="muted">{fmtDate(t.date)}</td>
                <td>{t.description}</td>
                <td><Tag>{t.category}</Tag></td>
                <td className={`num mono ${t.type}`}>
                  {t.type === "credit" ? "+" : "−"}{money(t.amount)}
                </td>
              </tr>
            )}
          />
        </section>

        <section className="card pad">
          <h2>Quick actions</h2>
          <div className="stack">
            <Link className="btn btn-primary btn-block" to="/user/transfer">Transfer money</Link>
            <Link className="btn btn-ghost btn-block" to="/user/bills">Pay a bill</Link>
            <Link className="btn btn-ghost btn-block" to="/user/loans">Request a loan</Link>
          </div>
        </section>
      </div>
    </>
  );
}
