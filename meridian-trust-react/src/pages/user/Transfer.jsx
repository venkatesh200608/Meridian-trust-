import { useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { transfer } from "../../lib/bank";
import { money } from "../../lib/storage";
import { Message, PageHeader, useMessage } from "../../components/ui.jsx";

const empty = { account: "", amount: "", note: "" };

export default function Transfer() {
  const { user, refresh } = useAuth();
  const [form, setForm] = useState(empty);
  const [message, show] = useMessage();

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = transfer(user.id, form.account, form.amount, form.note.trim());
    show(result);
    if (result.ok) {
      setForm(empty);
      refresh();
    }
  };

  return (
    <>
      <PageHeader
        title="Transfer money"
        subtitle={`Available balance: ${money(user.balance)}`}
      />

      <section className="card pad form-card">
        <Message message={message} />
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="account">Recipient account number</label>
            <input id="account" className="mono" placeholder="AC100001" value={form.account} onChange={set("account")} required />
          </div>
          <div className="field">
            <label htmlFor="amount">Amount (₹)</label>
            <input id="amount" type="number" min="1" step="0.01" value={form.amount} onChange={set("amount")} required />
          </div>
          <div className="field">
            <label htmlFor="note">Note (optional)</label>
            <input id="note" placeholder="e.g. Rent split" value={form.note} onChange={set("note")} />
          </div>
          <button type="submit" className="btn btn-primary btn-block">Send transfer</button>
        </form>
      </section>
    </>
  );
}
