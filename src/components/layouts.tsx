import {
  BarChart3,
  BookOpen,
  Bot,
  CheckSquare,
  ClipboardList,
  FileText,
  Gauge,
  Home,
  LineChart,
  LogOut,
  MessageSquare,
  Settings,
  Send,
  ShieldCheck,
  Target,
  Users
} from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";
import { Button, Badge } from "./ui";
import { useAuth } from "../lib/auth";
import { trackLabel } from "../lib/format";

function ShellNav({ items }: { items: Array<{ to: string; label: string; icon: React.ComponentType<{ className?: string }> }> }) {
  return (
    <nav className="flex gap-2 overflow-x-auto pb-2 lg:block lg:space-y-1 lg:overflow-visible lg:pb-0">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex min-w-max items-center gap-3 rounded-md px-3 py-2 text-sm transition ${
                isActive ? "bg-blue text-ink" : "text-muted hover:bg-white/5 hover:text-white"
              }`
            }
          >
            <Icon className="h-4 w-4" />
            {item.label}
          </NavLink>
        );
      })}
    </nav>
  );
}

const candidateItems = [
  { to: "/candidate/welcome", label: "Welcome", icon: Home },
  { to: "/candidate/terms", label: "Terms", icon: ShieldCheck },
  { to: "/candidate/training", label: "Training", icon: BookOpen },
  { to: "/candidate/choose-track", label: "Track", icon: Target },
  { to: "/candidate/prospecting", label: "Prospecting", icon: LineChart },
  { to: "/candidate/scripts", label: "Scripts", icon: MessageSquare },
  { to: "/candidate/ai-helper", label: "AI helper", icon: Bot },
  { to: "/candidate/tracker", label: "Tracker", icon: ClipboardList },
  { to: "/candidate/test", label: "7-day test", icon: Gauge },
  { to: "/candidate/daily-report", label: "Daily report", icon: CheckSquare },
  { to: "/candidate/conversions", label: "Conversions", icon: BarChart3 },
  { to: "/candidate/resources", label: "Resources", icon: FileText },
  { to: "/candidate/final-submit", label: "Final submit", icon: Send }
];

const adminItems = [
  { to: "/admin", label: "Dashboard", icon: Gauge },
  { to: "/admin/candidates", label: "Candidates", icon: Users },
  { to: "/admin/conversions", label: "Conversions", icon: BarChart3 },
  { to: "/admin/commissions", label: "Commissions", icon: LineChart },
  { to: "/admin/content", label: "Content", icon: FileText },
  { to: "/admin/settings", label: "Settings", icon: Settings }
];

function BrandHeader() {
  return (
    <div>
      <div className="text-lg font-semibold text-white">Blip Creative Works</div>
      <div className="text-sm text-blue">Chromonno partner portal</div>
    </div>
  );
}

export function CandidateLayout() {
  const { candidate, logout } = useAuth();
  return (
    <div className="min-h-screen bg-ink text-white">
      <header className="sticky top-0 z-20 border-b border-borderline bg-ink/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4">
          <BrandHeader />
          <div className="flex items-center gap-3">
            <div className="hidden md:flex md:items-center md:gap-3">
              <Badge tone={candidate?.termsAcceptedAt ? "good" : "warn"}>{candidate?.termsAcceptedAt ? "Terms accepted" : "Terms pending"}</Badge>
              <Badge tone="info">{trackLabel(candidate?.selectedTracks)}</Badge>
            </div>
            <Button variant="ghost" onClick={logout}>
              <LogOut className="h-4 w-4" />
              <span className="hidden md:inline">Sign out</span>
            </Button>
          </div>
        </div>
      </header>
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[260px_1fr]">
        <aside className="lg:sticky lg:top-24 lg:h-[calc(100vh-7rem)] lg:overflow-y-auto">
          <ShellNav items={candidateItems} />
        </aside>
        <main className="min-w-0 pb-12">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export function AdminLayout() {
  const { logout, profile } = useAuth();
  return (
    <div className="min-h-screen bg-ink text-white">
      <header className="sticky top-0 z-20 border-b border-borderline bg-ink/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4">
          <BrandHeader />
          <div className="flex items-center gap-3">
            <Badge tone="good">{profile?.role || "admin"}</Badge>
            <Button variant="ghost" onClick={logout}>
              <LogOut className="h-4 w-4" />
              Sign out
            </Button>
          </div>
        </div>
      </header>
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[240px_1fr]">
        <aside className="lg:sticky lg:top-24 lg:h-[calc(100vh-7rem)] lg:overflow-y-auto">
          <ShellNav items={adminItems} />
        </aside>
        <main className="min-w-0 pb-12">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
