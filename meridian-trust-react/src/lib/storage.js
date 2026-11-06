// Local Storage data layer. No server, no database — everything lives in the browser.

const KEY = {
  users: "obs_users",
  tx: "obs_transactions",
  loans: "obs_loans",
  session: "obs_session",
};

function read(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return value ?? fallback;
  } catch {
    return fallback;
  }
}

function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export const uid = (prefix) =>
  `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

export const now = () => new Date().toISOString();

export const money = (n) =>
  "₹" +
  Number(n || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export const fmtDate = (iso) =>
  new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

export const getUsers = () => read(KEY.users, []);
export const saveUsers = (users) => write(KEY.users, users);

export const getTx = () => read(KEY.tx, []);
export const saveTx = (tx) => write(KEY.tx, tx);

export const getLoans = () => read(KEY.loans, []);
export const saveLoans = (loans) => write(KEY.loans, loans);

export const getSession = () => read(KEY.session, null);
export const setSession = (session) => write(KEY.session, session);
export const clearSession = () => localStorage.removeItem(KEY.session);

// Creates the two demo accounts the first time the app runs.
export function seedIfEmpty() {
  if (localStorage.getItem(KEY.users)) return;

  const admin = {
    id: uid("usr"),
    fullName: "Bank Administrator",
    email: "admin@meridian.local",
    username: "admin",
    password: "admin123",
    role: "admin",
    accountNumber: null,
    balance: 0,
    status: "active",
    createdAt: now(),
  };

  const demo = {
    id: uid("usr"),
    fullName: "Demo User",
    email: "demo@meridian.local",
    username: "demo",
    password: "demo123",
    role: "user",
    accountNumber: "AC100001",
    balance: 25000,
    status: "active",
    createdAt: now(),
  };

  saveUsers([admin, demo]);
  saveTx([
    { id: uid("tx"), userId: demo.id, type: "credit", description: "Salary credit", amount: 20000, category: "Income", date: now() },
    { id: uid("tx"), userId: demo.id, type: "debit", description: "Electricity bill", amount: 1450, category: "Bill", date: now() },
    { id: uid("tx"), userId: demo.id, type: "debit", description: "Grocery store", amount: 2100, category: "Shopping", date: now() },
  ]);
  saveLoans([]);
}
