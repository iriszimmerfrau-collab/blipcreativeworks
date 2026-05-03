import { zodResolver } from "@hookform/resolvers/zod";
import { addDoc, collection, doc, orderBy, serverTimestamp, setDoc, updateDoc, where, writeBatch } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  Download,
  ExternalLink,
  FileUp,
  Play,
  Plus,
  Save,
  ShieldCheck,
  Upload
} from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { Badge, Button, Card, EmptyState, Field, Input, PageHeader, ProgressBar, Select, StatCard, Textarea } from "../components/ui";
import { blipIdeaCategories, chromonnoProductGuide, dailyPlan, defaultSettings, faqPlaybook, legalCopy, localOutreachGuidance, messageQualityChecklist, prospectingResources, roleLabels, scriptTemplates, sourceMaterials, termsChecklist, trackCards, trainingModules } from "../data/defaults";
import { useCollectionData } from "../hooks/useFirestore";
import { useAuth, type CandidateIntakeInput } from "../lib/auth";
import { db, functions } from "../lib/firebase";
import { percent, toDateInputValue, trackLabel, statusLabel, currency } from "../lib/format";
import { uploadCandidateFiles } from "../lib/storage";
import { downloadBlob, parseTrackerFile, prospectsExportBlob, trackerTemplateBlob, type ImportPreview } from "../lib/tracker";
import type { Commission, Conversion, DailyReport, GenerateMessageInput, GenerateMessageOutput, Prospect, ScriptTemplate, Track, TrainingProgress } from "../types";

async function addAudit(candidateId: string, event: string, details?: Record<string, unknown>) {
  await addDoc(collection(db, "auditLogs"), {
    candidateId,
    event,
    details: details || {},
    createdAt: serverTimestamp()
  });
}

function cleanRecord(input: Record<string, unknown>) {
  return Object.fromEntries(Object.entries(input).filter(([, value]) => value !== undefined));
}

function candidateQuery(candidateId?: string) {
  return candidateId ? [where("candidateId", "==", candidateId), orderBy("createdAt", "desc")] : [];
}

const intakeSchema = z.object({
  fullName: z.string().min(2, "Enter your full name."),
  phone: z.string().optional(),
  location: z.string().optional(),
  ageRange: z.enum(["under_18", "18_plus", "prefer_not_to_say"]),
  roleLabel: z.enum(["Business Development Associate", "Startup Partnership Associate", "Growth Partner", "Account Executive", "Sales / referral partner"]),
  selectedTracks: z.array(z.enum(["blip", "chromonno"])).min(1, "Choose at least one track.")
});

export function CandidateIntakePage() {
  const { candidate, saveCandidateIntake } = useAuth();
  const navigate = useNavigate();
  const form = useForm<CandidateIntakeInput>({
    resolver: zodResolver(intakeSchema),
    defaultValues: {
      fullName: candidate?.fullName || "",
      phone: candidate?.phone || "",
      location: candidate?.location || "",
      ageRange: candidate?.ageRange || "18_plus",
      roleLabel: candidate?.roleLabel || "Business Development Associate",
      selectedTracks: candidate?.selectedTracks?.length ? candidate.selectedTracks : ["blip"]
    }
  });
  const selected = form.watch("selectedTracks");

  async function submit(values: CandidateIntakeInput) {
    await saveCandidateIntake(values);
    navigate("/candidate/welcome");
  }

  function toggleTrack(track: Track) {
    const next = selected.includes(track) ? selected.filter((item) => item !== track) : [...selected, track];
    form.setValue("selectedTracks", next, { shouldValidate: true });
  }

  return (
    <main className="min-h-screen bg-ink px-4 py-8 text-white">
      <div className="mx-auto max-w-3xl">
        <PageHeader
          eyebrow="Accepted candidate intake"
          title="Set up your onboarding profile"
          description="This short intake connects your account to the training, reporting, and 7-day test workflow."
        />
        <Card>
          <form className="space-y-5" onSubmit={form.handleSubmit(submit)}>
            <Field label="Full name" error={form.formState.errors.fullName?.message}>
              <Input {...form.register("fullName")} />
            </Field>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Phone or WhatsApp">
                <Input {...form.register("phone")} />
              </Field>
              <Field label="Location">
                <Input {...form.register("location")} placeholder="City, country" />
              </Field>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Age range">
                <Select {...form.register("ageRange")}>
                  <option value="18_plus">18 plus</option>
                  <option value="under_18">Under 18</option>
                  <option value="prefer_not_to_say">Prefer not to say</option>
                </Select>
              </Field>
              <Field label="Preferred role label">
                <Select {...form.register("roleLabel")}>
                  {roleLabels.map((role) => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </Select>
              </Field>
            </div>
            <Field label="Preferred track" error={form.formState.errors.selectedTracks?.message}>
              <div className="grid gap-3 md:grid-cols-2">
                {trackCards.map((track) => (
                  <button
                    type="button"
                    key={track.id}
                    className={`rounded-lg border p-4 text-left transition ${selected.includes(track.id) ? "border-blue bg-blue/10" : "border-borderline bg-ink hover:border-blue"}`}
                    onClick={() => toggleTrack(track.id)}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-semibold">{track.title}</span>
                      {selected.includes(track.id) && <CheckCircle2 className="h-5 w-5 text-blue" />}
                    </div>
                    <p className="mt-2 text-sm text-muted">{track.offer}</p>
                  </button>
                ))}
              </div>
            </Field>
            <Button loading={form.formState.isSubmitting}>
              Continue to welcome
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>
        </Card>
      </div>
    </main>
  );
}

export function WelcomePage() {
  return (
    <>
      <PageHeader
        eyebrow="Prove yourself in 7 days"
        title="Welcome to the growth partner onboarding portal"
        description="This portal teaches you what to sell, who to contact, how to avoid spam, how to qualify real needs, how to report your work, and how admin verification works."
      />
      <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
        <Card>
          <h2 className="text-2xl font-semibold">Your path</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {["Learn", "Choose Blip or Chromonno", "Find prospects", "Qualify", "Message", "Follow up", "Close", "Report conversion"].map((item, index) => (
              <div key={item} className="flex gap-3 rounded-lg border border-borderline bg-ink p-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-blue text-sm font-bold text-ink">{index + 1}</span>
                <span className="font-medium">{item}</span>
              </div>
            ))}
          </div>
          <p className="mt-6 rounded-md border border-gold/30 bg-gold/10 p-4 text-sm leading-6 text-gold">
            High activity is not permission to spam. Every message must be personalized, honest, respectful, and relevant.
          </p>
          <div className="mt-6">
            <Link to="/candidate/terms">
              <Button>
                Continue to Terms
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </Card>
        <Card>
          <h3 className="text-lg font-semibold">Daily targets</h3>
          <div className="mt-4 space-y-3">
            <StatCard label="Prospects sourced" value="500/day" />
            <StatCard label="People contacted" value="350/day" />
            <StatCard label="Real conversations" value="15/day" />
            <StatCard label="Conversion goal" value="1/day" />
          </div>
        </Card>
      </div>
    </>
  );
}

export function TermsPage() {
  const { candidate } = useAuth();
  const [checked, setChecked] = useState<Record<number, boolean>>({});
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const allChecked = termsChecklist.every((_, index) => checked[index]);

  async function accept() {
    if (!candidate || !allChecked) return;
    setSaving(true);
    await updateDoc(doc(db, "candidates", candidate.uid), {
      termsAcceptedAt: serverTimestamp(),
      privacyAcceptedAt: serverTimestamp(),
      status: candidate.status === "invited" || candidate.status === "terms_pending" ? "training" : candidate.status,
      updatedAt: serverTimestamp()
    });
    await addAudit(candidate.uid, "terms_accepted", { checklistCount: termsChecklist.length });
    setSaving(false);
    navigate("/candidate/training");
  }

  return (
    <>
      <PageHeader
        eyebrow="Required before the test"
        title="Terms, privacy notice, and code of conduct"
        description="You must accept these rules before training tools and the 7-day test unlock."
      />
      <div className="grid gap-5 lg:grid-cols-[1fr_380px]">
        <Card>
          <div className="space-y-3">
            {termsChecklist.map((item, index) => (
              <label key={item} className="flex gap-3 rounded-md border border-borderline bg-ink p-4">
                <input
                  type="checkbox"
                  className="mt-1 h-5 w-5 accent-blue"
                  checked={Boolean(checked[index])}
                  onChange={(event) => setChecked((current) => ({ ...current, [index]: event.target.checked }))}
                />
                <span className="text-sm leading-6 text-white">{item}</span>
              </label>
            ))}
          </div>
          <Button className="mt-6" disabled={!allChecked || Boolean(candidate?.termsAcceptedAt)} loading={saving} onClick={accept}>
            {candidate?.termsAcceptedAt ? "Already accepted" : "Accept and continue"}
            <ShieldCheck className="h-4 w-4" />
          </Button>
        </Card>
        <div className="space-y-4">
          {Object.entries(legalCopy).map(([title, body]) => (
            <Card key={title} className="shadow-none">
              <h3 className="text-lg font-semibold capitalize">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">{body}</p>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}

export function TrainingPage() {
  const { candidate } = useAuth();
  const { data: progress } = useCollectionData<TrainingProgress>(
    "trainingProgress",
    candidate ? [where("candidateId", "==", candidate.uid)] : [],
    Boolean(candidate)
  );
  const completed = new Set(progress.filter((item) => item.completed).map((item) => item.moduleId));
  const completion = percent(completed.size, trainingModules.length);

  async function completeModule(moduleId: string) {
    if (!candidate) return;
    await setDoc(doc(db, "trainingProgress", `${candidate.uid}_${moduleId}`), {
      candidateId: candidate.uid,
      moduleId,
      completed: true,
      completedAt: serverTimestamp(),
      quizScore: 100
    });
    await addAudit(candidate.uid, "training_module_completed", { moduleId });
  }

  return (
    <>
      <PageHeader
        eyebrow="Training"
        title="Build competence before outreach"
        description="Move through each module. The copy is direct so new candidates and international candidates can learn quickly."
        action={<Badge tone="info">{completion}% complete</Badge>}
      />
      <Card className="mb-5 shadow-none">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="font-semibold">Training progress</p>
            <p className="mt-1 text-sm text-muted">{completed.size} of {trainingModules.length} modules completed.</p>
          </div>
          <div className="w-40">
            <ProgressBar value={completion} />
          </div>
        </div>
      </Card>
      <div className="grid gap-4">
        {trainingModules.map((module, index) => (
          <Card key={module.id} className="shadow-none">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-3xl">
                <div className="flex flex-wrap items-center gap-3">
                  <Badge tone={completed.has(module.id) ? "good" : "neutral"}>{completed.has(module.id) ? "Complete" : `Module ${index + 1}`}</Badge>
                  <span className="text-sm text-muted">{module.minutes} min</span>
                </div>
                <h2 className="mt-3 text-xl font-semibold">{module.title}</h2>
                <div className="mt-3 space-y-2 text-sm leading-6 text-muted">
                  {module.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                </div>
                {(module.sourceMaterials?.length || module.keyActions?.length || module.practice?.length || module.redFlags?.length || module.passStandard) && (
                  <div className="mt-5 grid gap-3 md:grid-cols-2">
                    {module.sourceMaterials?.length ? (
                      <div className="rounded-md border border-borderline bg-ink p-4">
                        <p className="font-semibold text-white">Source materials</p>
                        <ul className="mt-2 space-y-1 text-sm leading-6 text-muted">
                          {module.sourceMaterials.map((item) => <li key={item}>- {item}</li>)}
                        </ul>
                      </div>
                    ) : null}
                    {module.keyActions?.length ? (
                      <div className="rounded-md border border-borderline bg-ink p-4">
                        <p className="font-semibold text-white">What to do</p>
                        <ul className="mt-2 space-y-1 text-sm leading-6 text-muted">
                          {module.keyActions.map((item) => <li key={item}>- {item}</li>)}
                        </ul>
                      </div>
                    ) : null}
                    {module.practice?.length ? (
                      <div className="rounded-md border border-borderline bg-ink p-4">
                        <p className="font-semibold text-white">Practice drill</p>
                        <ul className="mt-2 space-y-1 text-sm leading-6 text-muted">
                          {module.practice.map((item) => <li key={item}>- {item}</li>)}
                        </ul>
                      </div>
                    ) : null}
                    {module.redFlags?.length ? (
                      <div className="rounded-md border border-danger/40 bg-danger/10 p-4">
                        <p className="font-semibold text-danger">Red flags</p>
                        <ul className="mt-2 space-y-1 text-sm leading-6 text-danger/90">
                          {module.redFlags.map((item) => <li key={item}>- {item}</li>)}
                        </ul>
                      </div>
                    ) : null}
                    {module.passStandard ? (
                      <div className="rounded-md border border-green/30 bg-green/10 p-4 md:col-span-2">
                        <p className="font-semibold text-green">Pass standard</p>
                        <p className="mt-2 text-sm leading-6 text-green/90">{module.passStandard}</p>
                      </div>
                    ) : null}
                  </div>
                )}
                <ul className="mt-4 grid gap-2 text-sm text-white md:grid-cols-3">
                  {module.checklist.map((item) => (
                    <li key={item} className="rounded-md border border-borderline bg-ink p-3">{item}</li>
                  ))}
                </ul>
              </div>
              <Button variant={completed.has(module.id) ? "secondary" : "primary"} onClick={() => completeModule(module.id)} disabled={completed.has(module.id)}>
                {completed.has(module.id) ? "Completed" : "Mark complete"}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}

export function ChooseTrackPage() {
  const { candidate } = useAuth();
  const [selected, setSelected] = useState<Track[]>(candidate?.selectedTracks || []);
  const [saving, setSaving] = useState(false);

  async function save() {
    if (!candidate || selected.length === 0) return;
    setSaving(true);
    await updateDoc(doc(db, "candidates", candidate.uid), {
      selectedTracks: selected,
      updatedAt: serverTimestamp()
    });
    await addAudit(candidate.uid, "track_changed", { from: candidate.selectedTracks, to: selected });
    setSaving(false);
  }

  return (
    <>
      <PageHeader
        eyebrow="Choose your lane"
        title="Pick Blip, Chromonno, or both"
        description="Choose the track that fits your network. You can change it later, and the portal will keep an audit log."
        action={<Button onClick={save} disabled={!selected.length} loading={saving}><Save className="h-4 w-4" />Save track</Button>}
      />
      <div className="grid gap-5 lg:grid-cols-2">
        {trackCards.map((track) => (
          <button
            key={track.id}
            className={`rounded-lg border bg-panel p-5 text-left transition ${selected.includes(track.id) ? "border-blue shadow-glow" : "border-borderline hover:border-blue"}`}
            onClick={() => setSelected((current) => current.includes(track.id) ? current.filter((item) => item !== track.id) : [...current, track.id])}
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-blue">{track.offer}</p>
                <h2 className="mt-2 text-2xl font-semibold">{track.title}</h2>
              </div>
              {selected.includes(track.id) && <CheckCircle2 className="h-6 w-6 text-blue" />}
            </div>
            <p className="mt-4 text-sm leading-6 text-muted">{track.summary}</p>
            {"note" in track && <p className="mt-4 rounded-md border border-gold/30 bg-gold/10 p-3 text-sm leading-6 text-gold">{track.note}</p>}
            <div className="mt-4 flex flex-wrap gap-2">
              {track.prospects.map((prospect) => <Badge key={prospect}>{prospect}</Badge>)}
            </div>
          </button>
        ))}
      </div>
    </>
  );
}

export function ProspectingPage() {
  return (
    <>
      <PageHeader
        eyebrow="Prospecting"
        title="Find relevant people, then qualify"
        description="Your value is not sending links. Your value is finding real needs, positioning the right offer, and guiding the conversation toward action."
      />
      <div className="grid gap-5 lg:grid-cols-[1fr_380px]">
        <Card>
          <h2 className="text-xl font-semibold">Channels to test</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {["LinkedIn", "Email", "WhatsApp", "Instagram", "Product Hunt", "Indie Hackers", "Startup directories", "Local businesses", "Door-to-door public business outreach"].map((channel) => (
              <div key={channel} className="rounded-md border border-borderline bg-ink p-4">
                <p className="font-medium">{channel}</p>
                <p className="mt-2 text-sm leading-6 text-muted">Use one real detail. Ask a clear question. Log the result.</p>
              </div>
            ))}
          </div>
          <h2 className="mt-8 text-xl font-semibold">Local outreach safety</h2>
          <ul className="mt-4 space-y-2 text-sm leading-6 text-muted">
            {localOutreachGuidance.map((item) => <li key={item} className="rounded-md border border-borderline bg-ink p-3">{item}</li>)}
          </ul>
          <h2 className="mt-8 text-xl font-semibold">Blip idea-bank categories</h2>
          <p className="mt-2 text-sm leading-6 text-muted">Use these categories to find founder problems and write smarter discovery questions.</p>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {blipIdeaCategories.map((category) => (
              <div key={category} className="rounded-md border border-borderline bg-ink p-4 text-sm leading-6 text-muted">{category}</div>
            ))}
          </div>
        </Card>
        <Card>
          <h3 className="text-lg font-semibold">Message quality checklist</h3>
          <div className="mt-4 space-y-2">
            {messageQualityChecklist.map((item) => (
              <div key={item} className="flex gap-2 text-sm text-muted">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-green" />
                {item}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}

export function ScriptsPage() {
  const [track, setTrack] = useState<ScriptTemplate["track"] | "all">("all");
  const [channel, setChannel] = useState<ScriptTemplate["channel"] | "all">("all");
  const [stage, setStage] = useState<ScriptTemplate["stage"] | "all">("all");
  const filtered = scriptTemplates.filter((script) => (track === "all" || script.track === track) && (channel === "all" || script.channel === channel) && (stage === "all" || script.stage === stage));
  const replaceLinks = (template: string) => template.replace("[Blip link]", defaultSettings.blipUrl).replace("[Chromonno link]", defaultSettings.chromonnoUrl);

  return (
    <>
      <PageHeader
        eyebrow="Scripts"
        title="Use scripts as a starting point"
        description="Edit every script before sending. Do not send the same message to everyone."
      />
      <Card className="mb-5 shadow-none">
        <div className="grid gap-4 md:grid-cols-3">
          <Field label="Track">
            <Select value={track} onChange={(event) => setTrack(event.target.value as typeof track)}>
              <option value="all">All tracks</option>
              <option value="blip">Blip</option>
              <option value="chromonno">Chromonno</option>
              <option value="both">Both</option>
            </Select>
          </Field>
          <Field label="Channel">
            <Select value={channel} onChange={(event) => setChannel(event.target.value as typeof channel)}>
              <option value="all">All channels</option>
              {Array.from(new Set(scriptTemplates.map((script) => script.channel))).map((item) => (
                <option key={item} value={item}>{item.replace(/_/g, " ")}</option>
              ))}
            </Select>
          </Field>
          <Field label="Stage">
            <Select value={stage} onChange={(event) => setStage(event.target.value as typeof stage)}>
              <option value="all">All stages</option>
              {Array.from(new Set(scriptTemplates.map((script) => script.stage))).map((item) => (
                <option key={item} value={item}>{item.replace(/_/g, " ")}</option>
              ))}
            </Select>
          </Field>
        </div>
      </Card>
      <div className="grid gap-4">
        {filtered.map((script) => (
          <Card key={script.id} className="shadow-none">
            <div className="flex flex-wrap gap-2">
              <Badge tone="info">{trackLabel(script.track === "both" ? "both" : script.track)}</Badge>
              <Badge>{script.channel.replace(/_/g, " ")}</Badge>
              <Badge>{script.stage.replace(/_/g, " ")}</Badge>
            </div>
            <h2 className="mt-3 text-xl font-semibold">{script.title}</h2>
            <pre className="mt-4 whitespace-pre-wrap rounded-md border border-borderline bg-ink p-4 text-sm leading-6 text-white">{replaceLinks(script.template)}</pre>
            <p className="mt-3 text-sm leading-6 text-muted">{script.explanation}</p>
          </Card>
        ))}
      </div>
    </>
  );
}

const aiSchema = z.object({
  track: z.enum(["blip", "chromonno", "both"]),
  channel: z.string().min(2),
  stage: z.enum(["cold", "follow_up", "objection", "closing", "referral"]),
  prospectName: z.string().optional(),
  company: z.string().optional(),
  website: z.string().optional(),
  knownDetail: z.string().optional(),
  need: z.string().optional(),
  tone: z.enum(["professional", "friendly", "short", "direct"]),
  language: z.string().default("English")
});

export function AiHelperPage() {
  const [result, setResult] = useState<GenerateMessageOutput | null>(null);
  const [error, setError] = useState("");
  const form = useForm<GenerateMessageInput>({
    resolver: zodResolver(aiSchema),
    defaultValues: { track: "blip", channel: "LinkedIn", stage: "cold", tone: "professional", language: "English" }
  });

  async function submit(values: GenerateMessageInput) {
    setError("");
    setResult(null);
    try {
      const callable = httpsCallable<GenerateMessageInput, GenerateMessageOutput>(functions, "generateOutreachMessage");
      const response = await callable(values);
      setResult(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "The AI helper could not generate a message.");
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="AI helper"
        title="Generate a short personalized outreach draft"
        description="The helper is a draft tool. Edit before sending. It should never create spam, false claims, or guaranteed results."
      />
      <div className="grid gap-5 lg:grid-cols-[1fr_420px]">
        <Card>
          <form className="grid gap-4 md:grid-cols-2" onSubmit={form.handleSubmit(submit)}>
            <Field label="Track"><Select {...form.register("track")}><option value="blip">Blip</option><option value="chromonno">Chromonno</option><option value="both">Both</option></Select></Field>
            <Field label="Stage"><Select {...form.register("stage")}><option value="cold">Cold outreach</option><option value="follow_up">Follow-up</option><option value="objection">Objection</option><option value="closing">Closing</option><option value="referral">Referral</option></Select></Field>
            <Field label="Channel"><Input {...form.register("channel")} placeholder="LinkedIn, email, WhatsApp" /></Field>
            <Field label="Tone"><Select {...form.register("tone")}><option value="professional">Professional</option><option value="friendly">Friendly</option><option value="short">Short</option><option value="direct">Direct</option></Select></Field>
            <Field label="Prospect name"><Input {...form.register("prospectName")} /></Field>
            <Field label="Company"><Input {...form.register("company")} /></Field>
            <Field label="Website"><Input {...form.register("website")} /></Field>
            <Field label="Language"><Input {...form.register("language")} /></Field>
            <div className="md:col-span-2">
              <Field label="Specific detail to personalize"><Textarea {...form.register("knownDetail")} placeholder="Example: they launched a budgeting app on Product Hunt this week." /></Field>
            </div>
            <div className="md:col-span-2">
              <Field label="Prospect need"><Textarea {...form.register("need")} placeholder="Example: they need clearer positioning for early customers." /></Field>
            </div>
            {error && <div className="md:col-span-2 rounded-md border border-danger/40 bg-danger/10 p-3 text-sm text-danger">{error}</div>}
            <Button className="md:col-span-2" loading={form.formState.isSubmitting}>
              <Bot className="h-4 w-4" />
              Generate outreach message
            </Button>
          </form>
        </Card>
        <Card>
          <h2 className="text-xl font-semibold">Output</h2>
          {!result ? (
            <p className="mt-4 text-sm leading-6 text-muted">Add one real detail and a clear need for the best result.</p>
          ) : (
            <div className="mt-4 space-y-4">
              {result.subjectLine && <div><p className="text-sm text-muted">Subject</p><p className="mt-1 font-medium">{result.subjectLine}</p></div>}
              <pre className="whitespace-pre-wrap rounded-md border border-borderline bg-ink p-4 text-sm leading-6">{result.message}</pre>
              <div>
                <p className="font-semibold">Why it works</p>
                <p className="mt-1 text-sm leading-6 text-muted">{result.whyItWorks}</p>
              </div>
              <div>
                <p className="font-semibold">Warnings</p>
                <ul className="mt-2 space-y-2 text-sm text-gold">
                  {result.safetyWarnings.map((warning) => <li key={warning}>- {warning}</li>)}
                </ul>
              </div>
              <p className="rounded-md border border-blue/30 bg-blue/10 p-3 text-sm text-blue">{result.nextStepSuggestion}</p>
            </div>
          )}
        </Card>
      </div>
    </>
  );
}

const prospectSchema = z.object({
  name: z.string().min(1),
  company: z.string().min(1),
  website: z.string().optional(),
  contact: z.string().min(1),
  channel: z.string().min(1),
  need: z.string().min(1),
  offerFit: z.enum(["blip", "chromonno", "both", "unclear"]),
  messageSent: z.string().optional(),
  reply: z.string().optional(),
  status: z.enum(["sourced", "contacted", "replied", "qualified", "follow_up", "closed", "not_fit", "lost"]),
  nextFollowUp: z.string().optional(),
  notes: z.string().optional()
});

export function TrackerPage() {
  const { candidate } = useAuth();
  const constraints = useMemo(() => candidate ? [where("candidateId", "==", candidate.uid), orderBy("updatedAt", "desc")] : [], [candidate]);
  const { data: prospects } = useCollectionData<Prospect>("prospects", constraints, Boolean(candidate));
  const [preview, setPreview] = useState<ImportPreview | null>(null);
  const [importing, setImporting] = useState(false);
  const form = useForm<z.infer<typeof prospectSchema>>({
    resolver: zodResolver(prospectSchema),
    defaultValues: { offerFit: "unclear", status: "sourced" }
  });

  async function addProspect(values: z.infer<typeof prospectSchema>) {
    if (!candidate) return;
    await addDoc(collection(db, "prospects"), cleanRecord({
      ...values,
      candidateId: candidate.uid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }));
    form.reset({ offerFit: "unclear", status: "sourced" });
  }

  async function handleFile(file?: File) {
    if (!file) return;
    setPreview(await parseTrackerFile(file));
  }

  async function importRows() {
    if (!candidate || !preview) return;
    setImporting(true);
    const existing = new Set(prospects.map((prospect) => `${prospect.contact.toLowerCase()}|${prospect.company.toLowerCase()}`));
    const batch = writeBatch(db);
    preview.validRows
      .filter((row) => !existing.has(`${row.contact.toLowerCase()}|${row.company.toLowerCase()}`))
      .forEach((row) => {
        const ref = doc(collection(db, "prospects"));
        batch.set(ref, cleanRecord({
          ...row,
          candidateId: candidate.uid,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        }));
      });
    await batch.commit();
    await addAudit(candidate.uid, "tracker_imported", { validRows: preview.validRows.length, errors: preview.errors.length });
    setPreview(null);
    setImporting(false);
  }

  async function updateProspect(id: string, patch: Partial<Prospect>) {
    await updateDoc(doc(db, "prospects", id), { ...patch, updatedAt: serverTimestamp() });
  }

  async function importStarterList() {
    if (!candidate) return;
    const samples = [
      { name: "Founder contact", company: "New SaaS launch", website: "https://www.producthunt.com/", contact: "research needed", channel: "Product Hunt", need: "Go-to-market clarity", offerFit: "blip", status: "sourced" },
      { name: "Local shop manager", company: "Creative retail shop", website: "", contact: "public business visit", channel: "Local business", need: "Fresh clothing collection", offerFit: "chromonno", status: "sourced" },
      { name: "Student founder", company: "Campus startup club", website: "", contact: "club organizer", channel: "School club", need: "Startup support", offerFit: "blip", status: "sourced" }
    ];
    const batch = writeBatch(db);
    samples.forEach((sample) => {
      const ref = doc(collection(db, "prospects"));
      batch.set(ref, { ...sample, candidateId: candidate.uid, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
    });
    await batch.commit();
  }

  return (
    <>
      <PageHeader
        eyebrow="Prospect tracker"
        title="Build, import, edit, and export your list"
        description="Required fields are validated. Imports deduplicate by contact and company."
      />
      <Card className="mb-5 shadow-none">
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" onClick={() => downloadBlob(trackerTemplateBlob("csv"), "blip-chromonno-tracker-template.csv")}><Download className="h-4 w-4" />CSV template</Button>
          <Button variant="secondary" onClick={() => downloadBlob(trackerTemplateBlob("xlsx"), "blip-chromonno-tracker-template.xlsx")}><Download className="h-4 w-4" />XLSX template</Button>
          <Button variant="secondary" onClick={() => downloadBlob(prospectsExportBlob(prospects, "csv"), "my-prospect-tracker.csv")}>Export CSV</Button>
          <Button variant="secondary" onClick={() => downloadBlob(prospectsExportBlob(prospects, "xlsx"), "my-prospect-tracker.xlsx")}>Export XLSX</Button>
          <Button variant="secondary" onClick={importStarterList}><Plus className="h-4 w-4" />Import starter list</Button>
          <label className="focus-ring inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-md border border-borderline bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:border-blue hover:text-blue">
            <FileUp className="h-4 w-4" />
            Upload tracker
            <input type="file" className="hidden" accept=".csv,.xlsx" onChange={(event) => handleFile(event.target.files?.[0])} />
          </label>
        </div>
      </Card>

      {preview && (
        <Card className="mb-5 border-blue/40 shadow-none">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-xl font-semibold">Import preview</h2>
              <p className="mt-1 text-sm text-muted">{preview.validRows.length} valid rows, {preview.errors.length} row errors, {preview.missingHeaders.length} missing headers.</p>
            </div>
            <Button onClick={importRows} disabled={!preview.validRows.length || Boolean(preview.missingHeaders.length)} loading={importing}>Import valid rows</Button>
          </div>
          {(preview.missingHeaders.length > 0 || preview.errors.length > 0) && (
            <div className="mt-4 rounded-md border border-danger/40 bg-danger/10 p-3 text-sm text-danger">
              {preview.missingHeaders.length > 0 && <p>Missing headers: {preview.missingHeaders.join(", ")}</p>}
              {preview.errors.slice(0, 6).map((error) => <p key={`${error.row}-${error.field}`}>Row {error.row}: {error.message}</p>)}
            </div>
          )}
        </Card>
      )}

      <div className="grid gap-5 lg:grid-cols-[380px_1fr]">
        <Card>
          <h2 className="text-xl font-semibold">Add prospect manually</h2>
          <form className="mt-4 space-y-4" onSubmit={form.handleSubmit(addProspect)}>
            <Field label="Name"><Input {...form.register("name")} /></Field>
            <Field label="Company"><Input {...form.register("company")} /></Field>
            <Field label="Website"><Input {...form.register("website")} /></Field>
            <Field label="Contact"><Input {...form.register("contact")} /></Field>
            <Field label="Channel"><Input {...form.register("channel")} /></Field>
            <Field label="Need"><Textarea {...form.register("need")} /></Field>
            <Field label="Offer fit"><Select {...form.register("offerFit")}><option value="blip">Blip</option><option value="chromonno">Chromonno</option><option value="both">Both</option><option value="unclear">Unclear</option></Select></Field>
            <Field label="Status"><Select {...form.register("status")}><option value="sourced">Sourced</option><option value="contacted">Contacted</option><option value="replied">Replied</option><option value="qualified">Qualified</option><option value="follow_up">Follow up</option><option value="closed">Closed</option><option value="not_fit">Not fit</option><option value="lost">Lost</option></Select></Field>
            <Button loading={form.formState.isSubmitting}><Plus className="h-4 w-4" />Add prospect</Button>
          </form>
        </Card>
        <Card>
          <h2 className="text-xl font-semibold">Current tracker</h2>
          <div className="mt-4 overflow-x-auto">
            {prospects.length === 0 ? <EmptyState title="No prospects yet" body="Download the template, upload a tracker, import the starter list, or add your first prospect manually." /> : (
              <table className="w-full min-w-[860px] text-left text-sm">
                <thead className="text-muted">
                  <tr>
                    <th className="border-b border-borderline p-3">Name</th>
                    <th className="border-b border-borderline p-3">Company</th>
                    <th className="border-b border-borderline p-3">Channel</th>
                    <th className="border-b border-borderline p-3">Fit</th>
                    <th className="border-b border-borderline p-3">Status</th>
                    <th className="border-b border-borderline p-3">Next follow-up</th>
                  </tr>
                </thead>
                <tbody>
                  {prospects.map((prospect) => (
                    <tr key={prospect.id} className="border-b border-borderline/70">
                      <td className="p-3">{prospect.name}</td>
                      <td className="p-3">{prospect.company}</td>
                      <td className="p-3">{prospect.channel}</td>
                      <td className="p-3">{trackLabel(prospect.offerFit)}</td>
                      <td className="p-3">
                        <Select value={prospect.status} onChange={(event) => prospect.id && updateProspect(prospect.id, { status: event.target.value as Prospect["status"] })}>
                          {["sourced", "contacted", "replied", "qualified", "follow_up", "closed", "not_fit", "lost"].map((status) => <option key={status} value={status}>{statusLabel(status)}</option>)}
                        </Select>
                      </td>
                      <td className="p-3">
                        <Input defaultValue={prospect.nextFollowUp || ""} onBlur={(event) => prospect.id && updateProspect(prospect.id, { nextFollowUp: event.target.value })} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </Card>
      </div>
    </>
  );
}

function DailyTarget({ label, value, target }: { label: string; value: number; target: number }) {
  return (
    <Card className="shadow-none">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-muted">{label}</p>
          <p className="mt-1 text-2xl font-semibold">{value} / {target}</p>
        </div>
        <Badge tone={value >= target ? "good" : "warn"}>{percent(value, target)}%</Badge>
      </div>
      <div className="mt-4"><ProgressBar value={percent(value, target)} /></div>
    </Card>
  );
}

export function TestDashboardPage() {
  const { candidate } = useAuth();
  const { data: reports } = useCollectionData<DailyReport>("dailyReports", candidate ? [where("candidateId", "==", candidate.uid)] : [], Boolean(candidate));
  const { data: prospects } = useCollectionData<Prospect>("prospects", candidate ? [where("candidateId", "==", candidate.uid)] : [], Boolean(candidate));
  const { data: conversions } = useCollectionData<Conversion>("conversions", candidate ? [where("candidateId", "==", candidate.uid)] : [], Boolean(candidate));
  const { data: notes } = useCollectionData<{ candidateId: string; body: string; createdAt: unknown }>("managerNotes", candidate ? [where("candidateId", "==", candidate.uid), orderBy("createdAt", "desc")] : [], Boolean(candidate));
  const currentDay = candidate?.currentTestDay || 1;
  const today = reports.find((report) => report.testDay === currentDay);

  async function startTest() {
    if (!candidate) return;
    await updateDoc(doc(db, "candidates", candidate.uid), {
      status: "active_test",
      testStartDate: serverTimestamp(),
      currentTestDay: 1,
      updatedAt: serverTimestamp()
    });
    await addAudit(candidate.uid, "test_started", {});
  }

  return (
    <>
      <PageHeader
        eyebrow="7-day test"
        title="Run the practical assessment"
        description="Your final candidate success action is to start the 7-day test, then report activity every day with clean proof."
        action={candidate?.status !== "active_test" ? <Button onClick={startTest}><Play className="h-4 w-4" />Start the 7-day test</Button> : <Badge tone="good">Active test</Badge>}
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <DailyTarget label="Prospects sourced today" value={today?.prospectsSourced || 0} target={defaultSettings.dailyTargets.prospectsSourced} />
        <DailyTarget label="People contacted today" value={today?.peopleContacted || 0} target={defaultSettings.dailyTargets.peopleContacted} />
        <DailyTarget label="Conversations today" value={today?.conversations || 0} target={defaultSettings.dailyTargets.conversations} />
        <DailyTarget label="Conversions today" value={today?.conversions || 0} target={defaultSettings.dailyTargets.conversions} />
      </div>
      <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_380px]">
        <Card>
          <div className="grid gap-4 md:grid-cols-4">
            <StatCard label="Current day" value={`Day ${currentDay}`} hint="7 days total" />
            <StatCard label="Selected track" value={trackLabel(candidate?.selectedTracks)} />
            <StatCard label="Total prospects" value={prospects.length} />
            <StatCard label="Submitted conversions" value={conversions.length} />
          </div>
          <h2 className="mt-8 text-xl font-semibold">7-day plan</h2>
          <div className="mt-4 grid gap-3">
            {dailyPlan.map((day) => (
              <div key={day.day} className={`rounded-lg border p-4 ${day.day === currentDay ? "border-blue bg-blue/10" : "border-borderline bg-ink"}`}>
                <div className="flex flex-wrap items-center gap-3">
                  <Badge tone={day.day === currentDay ? "info" : "neutral"}>Day {day.day}</Badge>
                  <h3 className="font-semibold">{day.title}</h3>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {day.tasks.map((task) => <Badge key={task}>{task}</Badge>)}
                </div>
              </div>
            ))}
          </div>
        </Card>
        <div className="space-y-5">
          <Card>
            <h2 className="text-xl font-semibold">Next required action</h2>
            <p className="mt-3 text-sm leading-6 text-muted">Add 50 more qualified prospects, personalize your first outreach batch, and submit your daily report before the day ends.</p>
            <Link to="/candidate/daily-report" className="mt-4 inline-flex"><Button>Submit daily report</Button></Link>
          </Card>
          <Card>
            <h2 className="text-xl font-semibold">Manager comments</h2>
            {notes.length === 0 ? <p className="mt-3 text-sm text-muted">No manager comments yet.</p> : notes.slice(0, 3).map((note) => <p key={note.id} className="mt-3 rounded-md border border-borderline bg-ink p-3 text-sm text-muted">{note.body}</p>)}
          </Card>
        </div>
      </div>
    </>
  );
}

const reportSchema = z.object({
  date: z.string().min(1),
  testDay: z.coerce.number().min(1).max(7),
  prospectsSourced: z.coerce.number().min(0),
  peopleContacted: z.coerce.number().min(0),
  conversations: z.coerce.number().min(0),
  conversions: z.coerce.number().min(0),
  bestChannel: z.string().optional(),
  biggestObjection: z.string().optional(),
  whatWorked: z.string().optional(),
  needsHelp: z.string().optional(),
  trackerFile: z.string().optional()
});

export function DailyReportPage() {
  const { candidate } = useAuth();
  const [proofFiles, setProofFiles] = useState<FileList | null>(null);
  const [trackerFile, setTrackerFile] = useState<FileList | null>(null);
  const form = useForm<z.infer<typeof reportSchema>>({
    resolver: zodResolver(reportSchema),
    defaultValues: { date: toDateInputValue(), testDay: candidate?.currentTestDay || 1, prospectsSourced: 0, peopleContacted: 0, conversations: 0, conversions: 0 }
  });

  async function submit(values: z.infer<typeof reportSchema>) {
    if (!candidate) return;
    const uploadedProof = proofFiles?.length ? await uploadCandidateFiles(candidate.uid, proofFiles, "daily-proof") : [];
    const uploadedTracker = trackerFile?.length ? await uploadCandidateFiles(candidate.uid, trackerFile, "tracker-updates") : [];
    await addDoc(collection(db, "dailyReports"), cleanRecord({
      ...values,
      candidateId: candidate.uid,
      proofFiles: uploadedProof,
      trackerFile: uploadedTracker[0] || values.trackerFile || "",
      status: "submitted",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }));
    await updateDoc(doc(db, "candidates", candidate.uid), {
      status: "active_test",
      currentTestDay: Math.min(7, Math.max(candidate.currentTestDay || 1, values.testDay)),
      updatedAt: serverTimestamp()
    });
    await addAudit(candidate.uid, "daily_report_submitted", { testDay: values.testDay });
    form.reset({ date: toDateInputValue(), testDay: Math.min(7, values.testDay + 1), prospectsSourced: 0, peopleContacted: 0, conversations: 0, conversions: 0 });
  }

  return (
    <>
      <PageHeader
        eyebrow="Daily report"
        title="Show your work clearly"
        description="Reports help managers see discipline, quality, and where you need coaching."
      />
      <Card>
        <form className="grid gap-4 md:grid-cols-2" onSubmit={form.handleSubmit(submit)}>
          <Field label="Date"><Input type="date" {...form.register("date")} /></Field>
          <Field label="Day number"><Input type="number" min={1} max={7} {...form.register("testDay")} /></Field>
          <Field label="Prospects sourced"><Input type="number" min={0} {...form.register("prospectsSourced")} /></Field>
          <Field label="People contacted"><Input type="number" min={0} {...form.register("peopleContacted")} /></Field>
          <Field label="Conversations"><Input type="number" min={0} {...form.register("conversations")} /></Field>
          <Field label="Conversions"><Input type="number" min={0} {...form.register("conversions")} /></Field>
          <Field label="Best channel today"><Input {...form.register("bestChannel")} /></Field>
          <Field label="Biggest objection today"><Input {...form.register("biggestObjection")} /></Field>
          <div className="md:col-span-2"><Field label="What worked"><Textarea {...form.register("whatWorked")} /></Field></div>
          <div className="md:col-span-2"><Field label="What needs help"><Textarea {...form.register("needsHelp")} /></Field></div>
          <Field label="Upload proof screenshots/files"><Input type="file" multiple onChange={(event) => setProofFiles(event.target.files)} /></Field>
          <Field label="Upload updated tracker"><Input type="file" accept=".csv,.xlsx" onChange={(event) => setTrackerFile(event.target.files)} /></Field>
          <Button className="md:col-span-2" loading={form.formState.isSubmitting}><Upload className="h-4 w-4" />Submit daily report</Button>
        </form>
      </Card>
    </>
  );
}

const conversionSchema = z.object({
  prospectName: z.string().min(1),
  company: z.string().optional(),
  track: z.enum(["blip", "chromonno"]),
  conversionType: z.enum(["transaction", "commitment", "partnership", "usage_intent"]),
  amount: z.coerce.number().optional(),
  evidenceLinks: z.string().optional(),
  notes: z.string().optional()
});

export function ConversionsPage() {
  const { candidate } = useAuth();
  const [files, setFiles] = useState<FileList | null>(null);
  const { data: conversions } = useCollectionData<Conversion>("conversions", candidateQuery(candidate?.uid), Boolean(candidate));
  const { data: commissions } = useCollectionData<Commission>("commissions", candidateQuery(candidate?.uid), Boolean(candidate));
  const form = useForm<z.infer<typeof conversionSchema>>({
    resolver: zodResolver(conversionSchema),
    defaultValues: { track: "blip", conversionType: "commitment" }
  });

  async function submit(values: z.infer<typeof conversionSchema>) {
    if (!candidate) return;
    const evidenceFiles = files?.length ? await uploadCandidateFiles(candidate.uid, files, "conversion-proof") : [];
    const conversionRef = doc(collection(db, "conversions"));
    const amount = Number.isFinite(values.amount) ? values.amount : undefined;
    await setDoc(conversionRef, cleanRecord({
      candidateId: candidate.uid,
      prospectName: values.prospectName,
      company: values.company || "",
      track: values.track,
      conversionType: values.conversionType,
      amount,
      evidenceFiles,
      evidenceLinks: values.evidenceLinks ? values.evidenceLinks.split("\n").map((item) => item.trim()).filter(Boolean) : [],
      notes: values.notes || "",
      status: "submitted",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }));
    const rate = defaultSettings.commissionRates[values.track];
    await addDoc(collection(db, "commissions"), cleanRecord({
      candidateId: candidate.uid,
      conversionId: conversionRef.id,
      track: values.track,
      grossAmount: amount,
      rate,
      estimatedAmount: amount ? amount * rate : undefined,
      status: "submitted",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }));
    await addAudit(candidate.uid, "conversion_submitted", { conversionId: conversionRef.id, track: values.track });
    form.reset({ track: "blip", conversionType: "commitment" });
  }

  return (
    <>
      <PageHeader
        eyebrow="Conversions and commission claims"
        title="Report real commitments with evidence"
        description="A valid conversion is a real commitment or transaction that an admin can verify. Commission is estimated until approval."
      />
      <div className="grid gap-5 lg:grid-cols-[420px_1fr]">
        <Card>
          <form className="space-y-4" onSubmit={form.handleSubmit(submit)}>
            <Field label="Prospect name"><Input {...form.register("prospectName")} /></Field>
            <Field label="Company"><Input {...form.register("company")} /></Field>
            <Field label="Track"><Select {...form.register("track")}><option value="blip">Blip</option><option value="chromonno">Chromonno</option></Select></Field>
            <Field label="Conversion type"><Select {...form.register("conversionType")}><option value="transaction">Transaction</option><option value="commitment">Commitment</option><option value="partnership">Partnership</option><option value="usage_intent">Usage intent</option></Select></Field>
            <Field label="Amount if known"><Input type="number" min={0} step="0.01" {...form.register("amount")} /></Field>
            <Field label="Evidence links"><Textarea {...form.register("evidenceLinks")} placeholder="One link per line" /></Field>
            <Field label="Evidence upload"><Input type="file" multiple onChange={(event) => setFiles(event.target.files)} /></Field>
            <Field label="Notes"><Textarea {...form.register("notes")} /></Field>
            <Button loading={form.formState.isSubmitting}><Upload className="h-4 w-4" />Submit conversion</Button>
          </form>
        </Card>
        <div className="space-y-5">
          <Card>
            <h2 className="text-xl font-semibold">Commission rules</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <StatCard label="Blip incentive" value="20%" hint="Qualified verified conversions only" />
              <StatCard label="Chromonno incentive" value="10%" hint="Qualified verified conversions only" />
            </div>
            <p className="mt-4 rounded-md border border-gold/30 bg-gold/10 p-3 text-sm text-gold">No joining fee. No purchase required. No guaranteed income. Admin approval is required.</p>
          </Card>
          <Card>
            <h2 className="text-xl font-semibold">Your submissions</h2>
            <div className="mt-4 space-y-3">
              {conversions.length === 0 ? <EmptyState title="No conversions submitted" body="Submit proof only when there is a real commitment or transaction." /> : conversions.map((conversion) => (
                <div key={conversion.id} className="rounded-md border border-borderline bg-ink p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold">{conversion.prospectName}</p>
                      <p className="text-sm text-muted">{trackLabel(conversion.track)} · {conversion.conversionType.replace(/_/g, " ")}</p>
                    </div>
                    <Badge tone={conversion.status === "verified" ? "good" : conversion.status === "rejected" ? "danger" : "warn"}>{statusLabel(conversion.status)}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>
          <Card>
            <h2 className="text-xl font-semibold">Commission status</h2>
            <div className="mt-4 space-y-3">
              {commissions.map((commission) => (
                <div key={commission.id} className="flex items-center justify-between gap-3 rounded-md border border-borderline bg-ink p-4 text-sm">
                  <span>{trackLabel(commission.track)} · {currency(commission.estimatedAmount)}</span>
                  <Badge>{statusLabel(commission.status)}</Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}

export function ResourcesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Resources"
        title="Official links and prospect sources"
        description="Use official links in client-facing messages. Do not invent pages, discounts, guarantees, or unauthorized claims."
      />
      <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
        <Card>
          <h2 className="text-xl font-semibold">Startup prospecting sources</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {prospectingResources.map((resource) => (
              <a key={resource.url} className="rounded-md border border-borderline bg-ink p-4 transition hover:border-blue" href={resource.url} target="_blank" rel="noreferrer">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-medium">{resource.title}</span>
                  <ExternalLink className="h-4 w-4 text-blue" />
                </div>
                <p className="mt-2 text-sm text-muted">{resource.track}</p>
              </a>
            ))}
          </div>
          <h2 className="mt-8 text-xl font-semibold">Provided material playbook</h2>
          <div className="mt-4 grid gap-3">
            {sourceMaterials.map((material) => (
              <div key={material.file} className="rounded-md border border-borderline bg-ink p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold">{material.title}</p>
                    <p className="mt-1 text-xs text-blue">{material.file}</p>
                  </div>
                  <Badge tone="info">source</Badge>
                </div>
                <p className="mt-3 text-sm leading-6 text-muted">{material.use}</p>
                <p className="mt-2 text-sm leading-6 text-gold">{material.whenToShare}</p>
              </div>
            ))}
          </div>
          <h2 className="mt-8 text-xl font-semibold">Chromonno product guide</h2>
          <div className="mt-4 grid gap-3">
            {chromonnoProductGuide.map((item) => (
              <div key={item.category} className="rounded-md border border-borderline bg-ink p-4">
                <p className="font-semibold">{item.category}</p>
                <p className="mt-2 text-sm leading-6 text-white">{item.products}</p>
                <p className="mt-2 text-sm leading-6 text-muted">{item.buyerFit}</p>
                <p className="mt-2 text-sm leading-6 text-gold">{item.notes}</p>
              </div>
            ))}
          </div>
        </Card>
        <div className="space-y-5">
          <Card>
            <h2 className="text-xl font-semibold">Official links</h2>
            <div className="mt-4 space-y-3 text-sm">
              <a className="block rounded-md border border-borderline bg-ink p-3 hover:border-blue" href={defaultSettings.blipUrl} target="_blank" rel="noreferrer">Blip Creative Works website</a>
              <a className="block rounded-md border border-borderline bg-ink p-3 hover:border-blue" href={defaultSettings.chromonnoUrl} target="_blank" rel="noreferrer">Chromonno brand page</a>
              <a className="block rounded-md border border-borderline bg-ink p-3 hover:border-blue" href={`mailto:${defaultSettings.officialEmail}`}>{defaultSettings.officialEmail}</a>
            </div>
          </Card>
          <Card>
            <h2 className="text-xl font-semibold">Local outreach guidance</h2>
            <div className="mt-4 space-y-2 text-sm leading-6 text-muted">
              {localOutreachGuidance.map((item) => <p key={item} className="rounded-md border border-borderline bg-ink p-3">{item}</p>)}
            </div>
          </Card>
          <Card>
            <h2 className="text-xl font-semibold">FAQ answers</h2>
            <div className="mt-4 space-y-3">
              {faqPlaybook.map((item) => (
                <div key={item.question} className="rounded-md border border-borderline bg-ink p-3">
                  <p className="font-semibold text-white">{item.question}</p>
                  <p className="mt-2 text-sm leading-6 text-muted">{item.answer}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}

const finalSchema = z.object({
  totalProspects: z.coerce.number().min(0),
  totalContacts: z.coerce.number().min(0),
  totalConversations: z.coerce.number().min(0),
  totalConversions: z.coerce.number().min(0),
  lessonsLearned: z.string().min(10),
  pipeline: z.string().optional(),
  selfAssessment: z.string().min(10)
});

export function FinalSubmitPage() {
  const { candidate } = useAuth();
  const [files, setFiles] = useState<FileList | null>(null);
  const form = useForm<z.infer<typeof finalSchema>>({ resolver: zodResolver(finalSchema), defaultValues: { totalProspects: 0, totalContacts: 0, totalConversations: 0, totalConversions: 0 } });

  async function submit(values: z.infer<typeof finalSchema>) {
    if (!candidate) return;
    const uploads = files?.length ? await uploadCandidateFiles(candidate.uid, files, "final-submission") : [];
    await addDoc(collection(db, "finalSubmissions"), cleanRecord({
      ...values,
      candidateId: candidate.uid,
      files: uploads,
      status: "submitted",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }));
    await updateDoc(doc(db, "candidates", candidate.uid), { status: "final_submitted", updatedAt: serverTimestamp() });
    await addAudit(candidate.uid, "final_submission_submitted", values);
  }

  return (
    <>
      <PageHeader
        eyebrow="Final submission"
        title="Close the test with a clean report"
        description="Submit the final tracker, total numbers, conversion proof, lessons learned, best prospects still in pipeline, and self-assessment."
      />
      <Card>
        <form className="grid gap-4 md:grid-cols-2" onSubmit={form.handleSubmit(submit)}>
          <Field label="Total prospects"><Input type="number" min={0} {...form.register("totalProspects")} /></Field>
          <Field label="Total contacts"><Input type="number" min={0} {...form.register("totalContacts")} /></Field>
          <Field label="Total conversations"><Input type="number" min={0} {...form.register("totalConversations")} /></Field>
          <Field label="Total conversions"><Input type="number" min={0} {...form.register("totalConversions")} /></Field>
          <div className="md:col-span-2"><Field label="Lessons learned"><Textarea {...form.register("lessonsLearned")} /></Field></div>
          <div className="md:col-span-2"><Field label="Best prospects still in pipeline"><Textarea {...form.register("pipeline")} /></Field></div>
          <div className="md:col-span-2"><Field label="Self-assessment"><Textarea {...form.register("selfAssessment")} /></Field></div>
          <Field label="Final tracker and proof files"><Input type="file" multiple onChange={(event) => setFiles(event.target.files)} /></Field>
          <Button className="md:col-span-2" loading={form.formState.isSubmitting}><Upload className="h-4 w-4" />Submit final report</Button>
        </form>
      </Card>
    </>
  );
}
