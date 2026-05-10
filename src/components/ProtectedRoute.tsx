import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../lib/auth";
import { Button } from "./ui";

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
  const { firebaseUser, profile, candidate, loading, isAdmin, logout } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center bg-ink text-muted">Loading portal...</div>;
  }

  if (!firebaseUser) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (profile?.disabled) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-ink p-6 text-center text-danger">
        <p>This account is disabled. Contact the official admin email.</p>
        <Button variant="secondary" onClick={logout}>Sign out</Button>
      </div>
    );
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
