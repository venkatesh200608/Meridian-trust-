import { useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { fmtDate, getTx, money } from "../../lib/storage";
import { PageHeader, Table, Tag } from "../../components/ui.jsx";

export default function History() {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");

  const rows = getTx()
    .filter((t) => t.userId === user.id)
    .filter((t) => type === "all" || t.type === type)
    .filter((t) => t.description.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <>
      <PageHeader title="Transaction history" subtitle={`${rows.length} transaction${rows.length === 1 ? "" : "s"}`} />

      <div className="filter-bar">
        <input placeholder="Search description…" value={search} onChange={(e) => setSearch(e.target.value)} />
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="all">All types</option>
          <option value="credit">Credits</option>
          <option value="debit">Debits</option>
        </select>
      </div>

      <section className="card">
        <Table
          columns={[
            { label: "Date" },
            { label: "Description" },
            { label: "Category" },
            { label: "Amount", num: true },
          ]}
          rows={rows}
          empty="No transactions match."
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
    </>
  );
}
