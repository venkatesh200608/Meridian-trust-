import { useAuth } from "../../context/AuthContext.jsx";
import { decideLoan } from "../../lib/bank";
import { fmtDate, getLoans, money } from "../../lib/storage";
import { Message, PageHeader, Table, Tag, statusTone, useMessage } from "../../components/ui.jsx";

export default function AdminLoans() {
  const { refresh } = useAuth();
  const [message, show] = useMessage();
  const loans = [...getLoans()].sort((a, b) => new Date(b.requestedDate) - new Date(a.requestedDate));

  const decide = (id, decision) => {
    show(decideLoan(id, decision));
    refresh();
  };

  return (
    <>
      <PageHeader title="Loan requests" subtitle="Approve or reject requests from customers" />
      <Message message={message} />

      <section className="card">
        <Table
          columns={[
            { label: "Applicant" },
            { label: "Purpose" },
            { label: "Term" },
            { label: "Requested" },
            { label: "Amount", num: true },
            { label: "Status" },
            { label: "Actions" },
          ]}
          rows={loans}
          empty="No loan requests yet."
          renderRow={(l) => (
            <tr key={l.id}>
              <td>{l.userName}</td>
              <td>{l.purpose}</td>
              <td>{l.term} mo</td>
              <td>{fmtDate(l.requestedDate)}</td>
              <td className="num mono">{money(l.amount)}</td>
              <td><Tag tone={statusTone(l.status)}>{l.status}</Tag></td>
              <td className="actions">
                {l.status === "Pending" ? (
                  <>
                    <button className="btn btn-ghost btn-sm" onClick={() => decide(l.id, "Approved")}>Approve</button>
                    <button className="btn btn-danger btn-sm" onClick={() => decide(l.id, "Rejected")}>Reject</button>
                  </>
                ) : (
                  <span className="muted">Decided</span>
                )}
              </td>
            </tr>
          )}
        />
      </section>
    </>
  );
}
