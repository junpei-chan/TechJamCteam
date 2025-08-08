import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export type AuthState = {
  isAuthenticated: boolean | null;
  userType: string | null;
  token: string | null;
  isLoading: boolean;
};

export function useAuth(requireAuth: boolean = true): AuthState {
  const router = useRouter();
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: null,
    userType: null,
    token: null,
    isLoading: true,
  });

  useEffect(() => {
    const checkAuth = () => {
      const token = Cookies.get("authToken");
      const userType = Cookies.get("userType");

      if (requireAuth && !token) {
        // 認証が必要で、トークンがない場合はログインページにリダイレクト
        router.push("/login");
        return;
      }

      setAuthState({
        isAuthenticated: !!token,
        userType: userType || null,
        token: token || null,
        isLoading: false,
      });
    };

    checkAuth();
  }, [router, requireAuth]);

  return authState;
}

export function useLogout() {
  const router = useRouter();

  const logout = () => {
    Cookies.remove("authToken");
    Cookies.remove("userType");
    router.push("/login");
  };

  return logout;
}
