import {
  createContext,
  useContext,
  ReactNode,
  useState,
  Dispatch,
  SetStateAction,
  useEffect,
} from "react";

type AuthType = {
  user: any;
  token: string;
};

type authContextType = {
  user: any;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
  setUser: Dispatch<SetStateAction<any | undefined>>;
  login: () => void;
  logout: () => void;
};

const authContextDefaultValues: authContextType = {
  user: undefined,
  loading: false,
  setLoading: () => {},
  setUser: () => {},
  login: () => {},
  logout: () => {},
};

const AuthContext = createContext<authContextType>(authContextDefaultValues);

type Props = {
  children: ReactNode;
};

export function AuthProvider({ children }: Props) {
  const [user, setUser] = useState<any>();
  const [isAdmin, setAdmin] = useState(true);
  const [loading, setLoading] = useState<boolean>(false);

  const login = () => {
    setUser(true);
  };

  const logout = () => {
    setUser(false);
  };

  const value = {
    user,
    setUser,
    loading,
    setLoading,
    login,
    logout,
  };

  return (
    <>
      <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    </>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
