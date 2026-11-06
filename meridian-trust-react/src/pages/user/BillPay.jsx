import { useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { payBill } from "../../lib/bank";
import { money } from "../../lib/storage";
import { Message, PageHeader, useMessage } from "../../components/ui.jsx";

const empty = { payee: "", amount: "" };

export default function BillPay() {
  const { user, refresh } = useAuth();
  const [form, setForm] = useState(empty);
  const [message, show] = useMessage();

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = payBill(user.id, form.payee, form.amount);
    show(result);
    if (result.ok) {
      setForm(empty);
      refresh();
    }
  };

  return (
    <>
      <PageHeader title="Pay a bill" subtitle={`Available balance: ${money(user.balance)}`} />

      <section className="card pad form-card">
        <Message message={message} />
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="payee">Payee name</label>
            <input id="payee" placeholder="e.g. City Electricity Board" value={form.payee} onChange={set("payee")} required />
          </div>
          <div className="field">
            <label htmlFor="amount">Amount (₹)</label>
            <input id="amount" type="number" min="1" step="0.01" value={form.amount} onChange={set("amount")} required />
          </div>
          <button type="submit" className="btn btn-primary btn-block">Pay bill</button>
        </form>
      </section>
    </>
  );
}
