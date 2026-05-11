import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { ReactNode } from "react";

import {
  selectAccessToken,
  selectUser,
} from "@/store/slices/authSlice";

import { isTokenValid } from "@/lib/tokenHelper";

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({
  children,
}: ProtectedRouteProps) {
  const token = useSelector(selectAccessToken);
  const user = useSelector(selectUser);

  const location = useLocation();

  const isAuthenticated =
    !!token &&
    !!user &&
    isTokenValid(token);


  if (!isAuthenticated) {
    return (
      <Navigate
        to="/"
        replace
        state={{ ...location.state, from: location.pathname, isLoginError: true }}
      />
    );
  }

  return <>{children}</>;
}