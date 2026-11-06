import { createContext, useCallback, useContext, useState } from "react";
import * as bank from "../lib/bank";
import { clearSession, getSession, getUsers } from "../lib/storage";

const AuthContext = createContext(null);

// Rebuilds the signed-in user from Local Storage so balance/status are always fresh.
function loadUser() {
  const session = getSession();
  if (!session) return null;
  const user = getUsers().find((u) => u.id === session.userId);
  if (!user || user.status === "frozen") return null;
  return user;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(loadUser);
  const [, setVersion] = useState(0);

  // Call after any change to storage so every page re-reads fresh data.
  const refresh = useCallback(() => {
    setUser(loadUser());
    setVersion((v) => v + 1);
  }, []);

  const login = (username, password) => {
    const result = bank.login(username.trim(), password);
    if (result.ok) setUser(result.user);
    return result;
  };

  const signup = (data) => {
    const result = bank.signup(data);
    if (result.ok) {
      bank.login(data.username, data.password);
      setUser(result.user);
    }
    return result;
  };

  const logout = () => {
    clearSession();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
