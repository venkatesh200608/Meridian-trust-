// Banking business logic. Every function returns { ok, message?, ... }
// so the UI only has to show the message — no logic lives in components.

import {
  getUsers, saveUsers, getTx, saveTx, getLoans, saveLoans,
  setSession, uid, now,
} from "./storage";

const round2 = (n) => Math.round(Number(n) * 100) / 100;

function genAccountNumber(users) {
  let num;
  do {
    num = "AC" + Math.floor(100000 + Math.random() * 900000);
  } while (users.some((u) => u.accountNumber === num));
  return num;
}

export function signup({ fullName, email, username, password, deposit }) {
  const users = getUsers();
  if (!fullName || !email || !username || !password) {
    return { ok: false, message: "Please fill in every field." };
  }
  if (password.length < 6) {
    return { ok: false, message: "Password must be at least 6 characters." };
  }
  if (users.some((u) => u.username.toLowerCase() === username.toLowerCase())) {
    return { ok: false, message: "That username is already taken." };
  }

  const opening = round2(deposit) || 0;
  if (opening < 0) return { ok: false, message: "Opening deposit cannot be negative." };

  const user = {
    id: uid("usr"),
    fullName,
    email,
    username,
    password,
    role: "user",
    accountNumber: genAccountNumber(users),
    balance: opening,
    status: "active",
    createdAt: now(),
  };
  saveUsers([...users, user]);

  if (opening > 0) {
    saveTx([
      ...getTx(),
      { id: uid("tx"), userId: user.id, type: "credit", description: "Opening deposit", amount: opening, category: "Deposit", date: now() },
    ]);
  }
  return { ok: true, user };
}

export function login(username, password) {
  const user = getUsers().find(
    (u) => u.username.toLowerCase() === username.toLowerCase() && u.password === password
  );
  if (!user) return { ok: false, message: "Incorrect username or password." };
  if (user.status === "frozen") {
    return { ok: false, message: "This account has been frozen by the bank." };
  }
  setSession({ userId: user.id, role: user.role });
  return { ok: true, user };
}

export function transfer(fromId, toAccount, amount, note) {
  const value = round2(amount);
  if (!(value > 0)) return { ok: false, message: "Enter a valid amount." };

  const users = getUsers();
  const sender = users.find((u) => u.id === fromId);
  const recipient = users.find(
    (u) => u.accountNumber === toAccount.trim().toUpperCase() && u.role === "user"
  );

  if (!recipient) return { ok: false, message: "No account found with that account number." };
  if (recipient.id === sender.id) return { ok: false, message: "You can't transfer to your own account." };
  if (recipient.status === "frozen") return { ok: false, message: "The recipient account is frozen." };
  if (value > sender.balance) return { ok: false, message: "Insufficient balance." };

  sender.balance = round2(sender.balance - value);
  recipient.balance = round2(recipient.balance + value);
  saveUsers(users);

  const suffix = note ? ` — ${note}` : "";
  saveTx([
    ...getTx(),
    { id: uid("tx"), userId: sender.id, type: "debit", description: `Transfer to ${recipient.accountNumber}${suffix}`, amount: value, category: "Transfer", date: now() },
    { id: uid("tx"), userId: recipient.id, type: "credit", description: `Transfer from ${sender.accountNumber}${suffix}`, amount: value, category: "Transfer", date: now() },
  ]);
  return { ok: true, message: `₹${value} sent to ${recipient.fullName}.` };
}

export function payBill(userId, payee, amount) {
  const value = round2(amount);
  if (!payee.trim()) return { ok: false, message: "Enter a payee name." };
  if (!(value > 0)) return { ok: false, message: "Enter a valid amount." };

  const users = getUsers();
  const user = users.find((u) => u.id === userId);
  if (value > user.balance) return { ok: false, message: "Insufficient balance." };

  user.balance = round2(user.balance - value);
  saveUsers(users);
  saveTx([
    ...getTx(),
    { id: uid("tx"), userId, type: "debit", description: `Bill payment — ${payee.trim()}`, amount: value, category: "Bill", date: now() },
  ]);
  return { ok: true, message: `Paid ₹${value} to ${payee.trim()}.` };
}

export function requestLoan(user, amount, term, purpose) {
  const value = round2(amount);
  if (!(value >= 500)) return { ok: false, message: "Loan amount must be at least ₹500." };

  saveLoans([
    ...getLoans(),
    { id: uid("loan"), userId: user.id, userName: user.fullName, amount: value, term: Number(term), purpose, status: "Pending", requestedDate: now() },
  ]);
  return { ok: true, message: "Loan request sent to the bank for review." };
}

// Admin: approve credits the user's balance; reject just closes the request.
export function decideLoan(loanId, decision) {
  const loans = getLoans();
  const loan = loans.find((l) => l.id === loanId);
  if (!loan || loan.status !== "Pending") return { ok: false, message: "Loan already decided." };

  loan.status = decision;
  saveLoans(loans);

  if (decision === "Approved") {
    const users = getUsers();
    const user = users.find((u) => u.id === loan.userId);
    if (user) {
      user.balance = round2(user.balance + loan.amount);
      saveUsers(users);
      saveTx([
        ...getTx(),
        { id: uid("tx"), userId: user.id, type: "credit", description: `Loan disbursement — ${loan.purpose}`, amount: loan.amount, category: "Loan", date: now() },
      ]);
    }
  }
  return { ok: true, message: `Loan ${decision.toLowerCase()}.` };
}

export function toggleFreeze(userId) {
  const users = getUsers();
  const user = users.find((u) => u.id === userId);
  if (!user) return { ok: false, message: "User not found." };
  user.status = user.status === "active" ? "frozen" : "active";
  saveUsers(users);
  return { ok: true, message: `${user.fullName} is now ${user.status}.` };
}

export function deleteUser(userId) {
  saveUsers(getUsers().filter((u) => u.id !== userId));
  saveTx(getTx().filter((t) => t.userId !== userId));
  saveLoans(getLoans().filter((l) => l.userId !== userId));
  return { ok: true, message: "Account deleted." };
}

export function changePassword(userId, current, next) {
  const users = getUsers();
  const user = users.find((u) => u.id === userId);
  if (current !== user.password) return { ok: false, message: "Current password is incorrect." };
  if (next.length < 6) return { ok: false, message: "New password must be at least 6 characters." };
  user.password = next;
  saveUsers(users);
  return { ok: true, message: "Password updated." };
}
