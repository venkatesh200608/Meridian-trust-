import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Layout from "./components/Layout.jsx";

import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";

import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import ManageUsers from "./pages/admin/ManageUsers.jsx";
import AdminLoans from "./pages/admin/AdminLoans.jsx";
import AdminTransactions from "./pages/admin/AdminTransactions.jsx";

import UserDashboard from "./pages/user/UserDashboard.jsx";
import Transfer from "./pages/user/Transfer.jsx";
import BillPay from "./pages/user/BillPay.jsx";
import UserLoans from "./pages/user/UserLoans.jsx";
import History from "./pages/user/History.jsx";
import Profile from "./pages/user/Profile.jsx";

const adminNav = [
  { to: "/admin", label: "Dashboard", end: true },
  { to: "/admin/users", label: "Manage users" },
  { to: "/admin/loans", label: "Loan requests" },
  { to: "/admin/transactions", label: "All transactions" },
];

const userNav = [
  { to: "/user", label: "Dashboard", end: true },
  { to: "/user/transfer", label: "Transfer money" },
  { to: "/user/bills", label: "Pay a bill" },
  { to: "/user/loans", label: "Loans" },
  { to: "/user/history", label: "Transactions" },
  { to: "/user/profile", label: "Profile" },
];

// Sends a signed-in visitor straight to their own module.
function Home() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={user.role === "admin" ? "/admin" : "/user"} replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route
        path="/admin"
        element={
          <ProtectedRoute role="admin">
            <Layout title="Admin Module" nav={adminNav} />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<ManageUsers />} />
        <Route path="loans" element={<AdminLoans />} />
        <Route path="transactions" element={<AdminTransactions />} />
      </Route>

      <Route
        path="/user"
        element={
          <ProtectedRoute role="user">
            <Layout title="User Module" nav={userNav} />
          </ProtectedRoute>
        }
      >
        <Route index element={<UserDashboard />} />
        <Route path="transfer" element={<Transfer />} />
        <Route path="bills" element={<BillPay />} />
        <Route path="loans" element={<UserLoans />} />
        <Route path="history" element={<History />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
