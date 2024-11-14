import { getUserByEmail } from "@/libs/supabase";
import { User } from "@/types/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
  setIsLoading: (value: boolean) => void;
  isLoading: boolean;
  logout: () => Promise<void>;
}

const UserContext = createContext<UserContextType>({} as UserContextType);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const logout = async () => {
    await AsyncStorage.removeItem("userEmail");
    await AsyncStorage.removeItem("user");
    setUser(null);
    setIsLoggedIn(false);
  };

  useEffect(() => {
    const loadUser = async () => {
      try {
        setIsLoading(true);
        const email = await AsyncStorage.getItem("userEmail");
        const userString = await AsyncStorage.getItem("user");
        if (userString) {
          setUser(JSON.parse(userString));
          setIsLoggedIn(true);
        } else if (email) {
          const user = await getUserByEmail(email);
          setUser(user);
          setIsLoggedIn(true);
        } else {
          setUser(null);
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("Error loading user email:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadUser();
  }, []);
  return (
    <UserContext.Provider
      value={{
        user: user || null,
        setUser,
        isLoading,
        isLoggedIn,
        setIsLoggedIn,
        setIsLoading,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUserContext() {
  return useContext<UserContextType>(UserContext);
}
