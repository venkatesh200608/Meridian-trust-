import { useAuth } from "../../context/AuthContext.jsx";
import { deleteUser, toggleFreeze } from "../../lib/bank";
import { getUsers, money } from "../../lib/storage";
import { Message, PageHeader, Table, Tag, statusTone, useMessage } from "../../components/ui.jsx";

export default function ManageUsers() {
  const { refresh } = useAuth();
  const [message, show] = useMessage();
  const users = getUsers().filter((u) => u.role === "user");

  const run = (result) => {
    show(result);
    refresh();
  };

  const handleDelete = (u) => {
    if (window.confirm(`Delete ${u.fullName}'s account permanently? This cannot be undone.`)) {
      run(deleteUser(u.id));
    }
  };

  return (
    <>
      <PageHeader title="Manage users" subtitle="Freeze, unfreeze or remove a customer account" />
      <Message message={message} />

      <section className="card">
        <Table
          columns={[
            { label: "Name" },
            { label: "Username" },
            { label: "Account no." },
            { label: "Balance", num: true },
            { label: "Status" },
            { label: "Actions" },
          ]}
          rows={users}
          empty="No user accounts yet."
          renderRow={(u) => (
            <tr key={u.id}>
              <td>{u.fullName}</td>
              <td>{u.username}</td>
              <td className="mono">{u.accountNumber}</td>
              <td className="num mono">{money(u.balance)}</td>
              <td><Tag tone={statusTone(u.status)}>{u.status}</Tag></td>
              <td className="actions">
                <button className="btn btn-ghost btn-sm" onClick={() => run(toggleFreeze(u.id))}>
                  {u.status === "active" ? "Freeze" : "Unfreeze"}
                </button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(u)}>
                  Delete
                </button>
              </td>
            </tr>
          )}
        />
      </section>
    </>
  );
}
