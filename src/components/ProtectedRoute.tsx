import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../lib/auth";

export function ProtectedRoute({
  requireAdmin = false,
  requireCandidate = false,
  requireTerms = false,
  children
}: {
  requireAdmin?: boolean;
  requireCandidate?: boolean;
  requireTerms?: boolean;
  children?: React.ReactNode;
}) {
  const { firebaseUser, profile, candidate, loading, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center bg-ink text-muted">Loading portal...</div>;
  }

  if (!firebaseUser) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (profile?.disabled) {
    return <div className="flex min-h-screen items-center justify-center bg-ink p-6 text-center text-danger">This account is disabled. Contact the official admin email.</div>;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/candidate/welcome" replace />;
  }

  if (requireCandidate && !candidate) {
    return <Navigate to="/candidate/intake" replace />;
  }

  if (requireTerms && !candidate?.termsAcceptedAt) {
    return <Navigate to="/candidate/terms" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
}
