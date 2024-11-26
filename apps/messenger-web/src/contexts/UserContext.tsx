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
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [userId, setUserId] = useState("");
  const [token, setToken] = useState("");

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUserId = localStorage.getItem("userId");
    if (savedToken && savedUserId) {
      setToken(savedToken);
      setUserId(savedUserId);
    }
  }, []);

  return (
    <UserContext.Provider value={{ userId, setUserId, token, setToken }}>
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

  if (!context.token || !context.userId) {
    navigate("/login");
  }

  return context;
}
