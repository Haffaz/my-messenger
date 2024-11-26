import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";

type UserContextType = {
  userId: string;
  setUserId: (userId: string) => void;
  token: string;
  setToken: (token: string) => void;
  logout: () => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [userId, setUserId] = useState("");
  const [token, setToken] = useState("");
  const navigate = useNavigate();

  const logout = () => {
    setToken("");
    setUserId("");
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUserId = localStorage.getItem("userId");
    if (savedToken && savedUserId) {
      setToken(savedToken);
      setUserId(savedUserId);
      navigate("/messages");
    }
  }, [navigate]);

  return (
    <UserContext.Provider
      value={{ userId, setUserId, token, setToken, logout }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const navigate = useNavigate();
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }

  useEffect(() => {
    if (!context.token || !context.userId) {
      navigate("/login", { replace: true });
    }
  }, [context.token, context.userId, navigate]);

  return context;
}
