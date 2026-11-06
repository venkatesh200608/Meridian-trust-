# Meridian Trust — Online Banking System

A React + Vite banking simulation with an **Admin module** and a **User module**.
All data (accounts, transactions, loans, login session) is stored in the browser's **Local Storage** — there is no backend.

## Demo accounts

| Role  | Username | Password   |
|-------|----------|------------|
| Admin | `admin`  | `admin123` |
| User  | `demo`   | `demo123`  |

New customers can also use **Create an account** on the login page.

## Run locally

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build into dist/
```

Requires Node 18 or newer.

## Modules

**Admin** (`/admin`): dashboard stats · manage users (freeze / unfreeze / delete) · approve or reject loan requests (approval credits the customer) · all-transactions ledger.

**User** (`/user`): dashboard · transfer money by account number · pay a bill · request a loan and track it · transaction history with search and filter · profile and change password.

Routing is role-based: after login, an admin lands on `/admin` and a customer on `/user`. A customer cannot open `/admin` (and vice versa) — `ProtectedRoute` redirects them to their own module.

## Project structure

```
src/
  main.jsx                 app entry (router + auth provider)
  App.jsx                  all routes
  index.css                single stylesheet (Grid + Flexbox, system fonts)
  lib/
    storage.js             Local Storage read/write + demo seed data
    bank.js                signup, login, transfer, bill pay, loans, admin actions
  context/AuthContext.jsx  current user, login / signup / logout
  components/              Layout (sidebar shell), ProtectedRoute, Logo, ui helpers
  pages/
    Login.jsx  Signup.jsx
    admin/                 AdminDashboard, ManageUsers, AdminLoans, AdminTransactions
    user/                  UserDashboard, Transfer, BillPay, UserLoans, History, Profile
```

All banking rules live in `lib/bank.js`; pages only collect input and display the result.

## Push to GitHub

Create an empty repository on GitHub (no README), then from this folder:

```bash
git init
git add .
git commit -m "Meridian Trust: React + Vite banking app"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

## Deploy on Vercel

1. Go to vercel.com → **Add New… → Project** → import your GitHub repository.
2. Vercel detects **Vite** automatically (Build: `npm run build`, Output: `dist`). Leave the defaults.
3. Click **Deploy**. You get a link like `https://<your-repo>.vercel.app`.

`vercel.json` is already included so that refreshing a page such as `/user/transfer` works instead of showing a 404.

Every `git push` to `main` redeploys automatically.

## Notes for the review

- Passwords are stored as plain text in Local Storage. That is acceptable for a client-only simulation, but a real bank would hash passwords on a server — mention this if asked about security.
- Local Storage is per browser: data does not sync between devices, and clearing site data resets the app to the two demo accounts.
- The deployed site and a local run keep separate data, because they are different origins.
