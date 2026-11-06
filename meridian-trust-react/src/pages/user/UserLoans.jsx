import { useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { requestLoan } from "../../lib/bank";
import { fmtDate, getLoans, money } from "../../lib/storage";
import { Message, PageHeader, Tag, statusTone, useMessage } from "../../components/ui.jsx";

const empty = { amount: "", term: "24", purpose: "Home improvement" };

export default function UserLoans() {
  const { user, refresh } = useAuth();
  const [form, setForm] = useState(empty);
  const [message, show] = useMessage();

  const loans = getLoans()
    .filter((l) => l.userId === user.id)
    .sort((a, b) => new Date(b.requestedDate) - new Date(a.requestedDate));

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = requestLoan(user, form.amount, form.term, form.purpose);
    show(result);
    if (result.ok) {
      setForm(empty);
      refresh();
    }
  };

  return (
    <>
      <PageHeader title="Loans" subtitle="Requests are reviewed by the bank's admin" />

      <div className="two-col">
        <section className="card pad">
          <h2>Request a loan</h2>
          <Message message={message} />
          <form onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="amount">Loan amount (₹)</label>
              <input id="amount" type="number" min="500" step="100" value={form.amount} onChange={set("amount")} required />
            </div>
            <div className="field-row">
              <div className="field">
                <label htmlFor="term">Term (months)</label>
                <select id="term" value={form.term} onChange={set("term")}>
                  {[12, 24, 36, 60].map((m) => <option key={m}>{m}</option>)}
                </select>
              </div>
              <div className="field">
                <label htmlFor="purpose">Purpose</label>
                <select id="purpose" value={form.purpose} onChange={set("purpose")}>
                  {["Home improvement", "Education", "Vehicle", "Other"].map((p) => <option key={p}>{p}</option>)}
                </select>
              </div>
            </div>
            <button type="submit" className="btn btn-primary btn-block">Submit request</button>
          </form>
        </section>

        <section className="card pad">
          <h2>Your loan requests</h2>
          {loans.length === 0 ? (
            <p className="muted">No loan requests yet.</p>
          ) : (
            loans.map((l) => (
              <div key={l.id} className="list-row">
                <div>
                  <div className="mono strong">{money(l.amount)}</div>
                  <div className="muted small">{l.purpose} · {l.term} mo · {fmtDate(l.requestedDate)}</div>
                </div>
                <Tag tone={statusTone(l.status)}>{l.status}</Tag>
              </div>
            ))
          )}
        </section>
      </div>
    </>
  );
}
