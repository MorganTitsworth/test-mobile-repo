import { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { collection, setDoc } from "firebase/firestore";
import { db, auth } from "../firebaseConfig";
import { ReactNode } from "react";
interface AuthState {
  user: User | null;
}
interface AuthContextData {
  authState: AuthState;
  setAuthState: React.Dispatch<React.SetStateAction<AuthState>>;
  signIn: () => void;
  signOut: () => void;
  createAccountWithEmail: (email: string, password: string) => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
}
const AuthContext = createContext<AuthContextData | undefined>(undefined);

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthState({ user });
      } else {
        setAuthState({ user: null });
      }
    });
    return () => unsubscribe();
  }, []);

  const signIn = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((res) => {
        setAuthState({ user: res.user });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const signOut = () => {
    firebaseSignOut(auth)
      .then(() => {
        setAuthState({ user: null });
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const createAccountWithEmail = async (email: string, password: string) => {
    try {
      const credential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = credential.user;

      if (user) {
        setAuthState({ user });
      } else {
        console.error("No user found");
      }
    } catch (error) {
      return Promise.reject(error);
    }
  };
  const signInWithEmail = async (email: string, password: string) => {
    try {
      const credential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = credential.user;

      if (user) {
        setAuthState({ user });
      } else {
        console.error("No user found");
      }
    } catch (error) {
      return Promise.reject(error);
    }
  };
  return (
    <AuthContext.Provider
      value={{
        authState,
        setAuthState,
        signIn,
        signOut,
        createAccountWithEmail,
        signInWithEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};
export { AuthProvider, AuthContext, useAuthContext };
