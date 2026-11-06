import { fmtDate, getTx, getUsers, money } from "../../lib/storage";
import { PageHeader, Table, Tag } from "../../components/ui.jsx";

export default function AdminTransactions() {
  const users = getUsers();
  const rows = [...getTx()].sort((a, b) => new Date(b.date) - new Date(a.date));
  const nameOf = (id) => users.find((u) => u.id === id)?.fullName ?? "Unknown";

  return (
    <>
      <PageHeader title="All transactions" subtitle="Every transaction across all customer accounts" />

      <section className="card">
        <Table
          columns={[
            { label: "Date" },
            { label: "Customer" },
            { label: "Description" },
            { label: "Category" },
            { label: "Amount", num: true },
          ]}
          rows={rows}
          empty="No transactions recorded yet."
          renderRow={(t) => (
            <tr key={t.id}>
              <td className="muted">{fmtDate(t.date)}</td>
              <td>{nameOf(t.userId)}</td>
              <td>{t.description}</td>
              <td><Tag>{t.category}</Tag></td>
              <td className={`num mono ${t.type}`}>
                {t.type === "credit" ? "+" : "−"}{money(t.amount)}
              </td>
            </tr>
          )}
        />
      </section>
    </>
  );
}
