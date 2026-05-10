import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AdminLayout, CandidateLayout } from "./components/layouts";
import { useAuth } from "./lib/auth";

function Loading() {
  return <div className="flex min-h-screen items-center justify-center bg-ink text-muted">Loading...</div>;
}

const LoginPage = lazy(() => import("./pages/LoginPage"));

const CandidateIntakePage = lazy(() => import("./pages/candidate").then((m) => ({ default: m.CandidateIntakePage })));
const WelcomePage = lazy(() => import("./pages/candidate").then((m) => ({ default: m.WelcomePage })));
const TermsPage = lazy(() => import("./pages/candidate").then((m) => ({ default: m.TermsPage })));
const TrainingPage = lazy(() => import("./pages/candidate").then((m) => ({ default: m.TrainingPage })));
const ChooseTrackPage = lazy(() => import("./pages/candidate").then((m) => ({ default: m.ChooseTrackPage })));
const ProspectingPage = lazy(() => import("./pages/candidate").then((m) => ({ default: m.ProspectingPage })));
const ScriptsPage = lazy(() => import("./pages/candidate").then((m) => ({ default: m.ScriptsPage })));
const AiHelperPage = lazy(() => import("./pages/candidate").then((m) => ({ default: m.AiHelperPage })));
const TrackerPage = lazy(() => import("./pages/candidate").then((m) => ({ default: m.TrackerPage })));
const TestDashboardPage = lazy(() => import("./pages/candidate").then((m) => ({ default: m.TestDashboardPage })));
const DailyReportPage = lazy(() => import("./pages/candidate").then((m) => ({ default: m.DailyReportPage })));
const ConversionsPage = lazy(() => import("./pages/candidate").then((m) => ({ default: m.ConversionsPage })));
const ResourcesPage = lazy(() => import("./pages/candidate").then((m) => ({ default: m.ResourcesPage })));
const FinalSubmitPage = lazy(() => import("./pages/candidate").then((m) => ({ default: m.FinalSubmitPage })));

const AdminHomePage = lazy(() => import("./pages/admin").then((m) => ({ default: m.AdminHomePage })));
const AdminCandidatesPage = lazy(() => import("./pages/admin").then((m) => ({ default: m.AdminCandidatesPage })));
const AdminCandidateDetailPage = lazy(() => import("./pages/admin").then((m) => ({ default: m.AdminCandidateDetailPage })));
const AdminConversionsPage = lazy(() => import("./pages/admin").then((m) => ({ default: m.AdminConversionsPage })));
const AdminCommissionsPage = lazy(() => import("./pages/admin").then((m) => ({ default: m.AdminCommissionsPage })));
const AdminContentPage = lazy(() => import("./pages/admin").then((m) => ({ default: m.AdminContentPage })));
const AdminSettingsPage = lazy(() => import("./pages/admin").then((m) => ({ default: m.AdminSettingsPage })));

function HomeRedirect() {
  const { isAdmin, candidate } = useAuth();
  if (isAdmin) return <Navigate to="/admin" replace />;
  if (!candidate) return <Navigate to="/candidate/intake" replace />;
  return <Navigate to="/candidate/welcome" replace />;
}

function RequireTerms({ children }: { children: React.ReactNode }) {
  return <ProtectedRoute requireCandidate requireTerms>{children}</ProtectedRoute>;
}

export default function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<ProtectedRoute><HomeRedirect /></ProtectedRoute>} />
        <Route path="/candidate/intake" element={<ProtectedRoute><CandidateIntakePage /></ProtectedRoute>} />
        <Route path="/candidate" element={<ProtectedRoute requireCandidate><CandidateLayout /></ProtectedRoute>}>
          <Route index element={<Navigate to="/candidate/welcome" replace />} />
          <Route path="welcome" element={<WelcomePage />} />
          <Route path="terms" element={<TermsPage />} />
          <Route path="training" element={<RequireTerms><TrainingPage /></RequireTerms>} />
          <Route path="choose-track" element={<RequireTerms><ChooseTrackPage /></RequireTerms>} />
          <Route path="prospecting" element={<RequireTerms><ProspectingPage /></RequireTerms>} />
          <Route path="scripts" element={<RequireTerms><ScriptsPage /></RequireTerms>} />
          <Route path="ai-helper" element={<RequireTerms><AiHelperPage /></RequireTerms>} />
          <Route path="tracker" element={<RequireTerms><TrackerPage /></RequireTerms>} />
          <Route path="test" element={<RequireTerms><TestDashboardPage /></RequireTerms>} />
          <Route path="daily-report" element={<RequireTerms><DailyReportPage /></RequireTerms>} />
          <Route path="conversions" element={<RequireTerms><ConversionsPage /></RequireTerms>} />
          <Route path="resources" element={<RequireTerms><ResourcesPage /></RequireTerms>} />
          <Route path="final-submit" element={<RequireTerms><FinalSubmitPage /></RequireTerms>} />
        </Route>
        <Route path="/admin" element={<ProtectedRoute requireAdmin><AdminLayout /></ProtectedRoute>}>
          <Route index element={<AdminHomePage />} />
          <Route path="candidates" element={<AdminCandidatesPage />} />
          <Route path="candidates/:id" element={<AdminCandidateDetailPage />} />
          <Route path="conversions" element={<AdminConversionsPage />} />
          <Route path="commissions" element={<AdminCommissionsPage />} />
          <Route path="content" element={<AdminContentPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
