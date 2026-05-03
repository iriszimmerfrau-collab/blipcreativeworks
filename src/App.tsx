import { Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AdminLayout, CandidateLayout } from "./components/layouts";
import { useAuth } from "./lib/auth";
import LoginPage from "./pages/LoginPage";
import {
  AiHelperPage,
  CandidateIntakePage,
  ChooseTrackPage,
  ConversionsPage,
  DailyReportPage,
  FinalSubmitPage,
  ProspectingPage,
  ResourcesPage,
  ScriptsPage,
  TermsPage,
  TestDashboardPage,
  TrackerPage,
  TrainingPage,
  WelcomePage
} from "./pages/candidate";
import {
  AdminCandidateDetailPage,
  AdminCandidatesPage,
  AdminCommissionsPage,
  AdminContentPage,
  AdminConversionsPage,
  AdminHomePage,
  AdminSettingsPage
} from "./pages/admin";

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
  );
}
