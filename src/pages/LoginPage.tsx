import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Chrome, LockKeyhole } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { z } from "zod";
import { Button, Card, Field, Input } from "../components/ui";
import { useAuth } from "../lib/auth";

const loginSchema = z.object({
  displayName: z.string().optional(),
  email: z.string().email("Enter a valid email."),
  password: z.string().min(6, "Use at least 6 characters.")
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "create">("login");
  const [error, setError] = useState("");
  const { firebaseUser, profile, candidate, loading, isAdmin, signInEmail, createEmailAccount, signInGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const inviteToken = new URLSearchParams(location.search).get("invite");
  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", displayName: "" }
  });

  useEffect(() => {
    if (loading || !firebaseUser || !profile) return;
    if (isAdmin) navigate("/admin", { replace: true });
    else navigate(candidate ? "/candidate/welcome" : "/candidate/intake", { replace: true });
  }, [candidate, firebaseUser, isAdmin, loading, navigate, profile]);

  async function onSubmit(values: LoginForm) {
    setError("");
    try {
      if (mode === "create") {
        await createEmailAccount(values.email, values.password, values.displayName);
      } else {
        await signInEmail(values.email, values.password);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-in failed. Check your details and try again.");
    }
  }

  async function handleGoogle() {
    setError("");
    try {
      await signInGoogle();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Google sign-in failed.");
    }
  }

  return (
    <main className="grid min-h-screen bg-ink px-4 py-8 text-white lg:grid-cols-[1fr_520px]">
      <section className="flex items-center justify-center p-4">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue">Accepted candidate portal</p>
          <h1 className="mt-5 text-4xl font-semibold md:text-6xl">Prove yourself in 7 days.</h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-muted">
            Learn the offers, choose your track, build a qualified prospect list, report your activity, and show clear proof of serious business development work.
          </p>
          <div className="mt-8 grid gap-3 text-sm text-muted sm:grid-cols-3">
            <div className="rounded-lg border border-borderline bg-panel p-4">No joining fee</div>
            <div className="rounded-lg border border-borderline bg-panel p-4">No purchase required</div>
            <div className="rounded-lg border border-borderline bg-panel p-4">Verified performance only</div>
          </div>
        </div>
      </section>
      <section className="flex items-center justify-center">
        <Card className="w-full max-w-md">
          <div className="mb-6 flex items-start gap-3">
            <div className="rounded-md bg-blue p-3 text-ink">
              <LockKeyhole className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold">{mode === "login" ? "Log in" : "Create account"}</h2>
              <p className="mt-1 text-sm leading-6 text-muted">Candidate and admin access use Firebase Authentication.</p>
            </div>
          </div>

          {inviteToken && <div className="mb-4 rounded-md border border-blue/30 bg-blue/10 p-3 text-sm text-blue">Invite detected. Sign in or create an account to continue onboarding.</div>}

          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            {mode === "create" && (
              <Field label="Full name" error={form.formState.errors.displayName?.message}>
                <Input placeholder="Your name" {...form.register("displayName")} />
              </Field>
            )}
            <Field label="Email" error={form.formState.errors.email?.message}>
              <Input type="email" autoComplete="email" placeholder="you@example.com" {...form.register("email")} />
            </Field>
            <Field label="Password" error={form.formState.errors.password?.message}>
              <Input type="password" autoComplete={mode === "login" ? "current-password" : "new-password"} placeholder="Minimum 6 characters" {...form.register("password")} />
            </Field>
            {error && <div className="rounded-md border border-danger/40 bg-danger/10 p-3 text-sm text-danger">{error}</div>}
            <Button className="w-full" loading={form.formState.isSubmitting}>
              {mode === "login" ? "Log in" : "Create account"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          <Button className="mt-3 w-full" variant="secondary" onClick={handleGoogle} type="button">
            <Chrome className="h-4 w-4" />
            Continue with Google
          </Button>

          <button className="mt-5 w-full text-center text-sm text-muted hover:text-white" onClick={() => setMode(mode === "login" ? "create" : "login")}>
            {mode === "login" ? "Need to create your accepted-candidate account?" : "Already have an account?"}
          </button>
        </Card>
      </section>
    </main>
  );
}
