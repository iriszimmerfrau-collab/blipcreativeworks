import { zodResolver } from "@hookform/resolvers/zod";
import { addDoc, collection, doc, increment, orderBy, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";
import { CheckCircle2, ClipboardCheck, ExternalLink, MessageSquare, Save, Send, UserPlus, XCircle } from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useParams } from "react-router-dom";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { z } from "zod";
import { Badge, Button, Card, EmptyState, Field, Input, PageHeader, Select, StatCard, Textarea } from "../components/ui";
import { dailyPlan, defaultSettings, legalCopy, prospectingResources, roleLabels, scriptTemplates, trainingModules } from "../data/defaults";
import { useCollectionData, useDocument } from "../hooks/useFirestore";
import { useAuth } from "../lib/auth";
import { db } from "../lib/firebase";
import { currency, statusLabel, trackLabel } from "../lib/format";
import type { Candidate, CandidateStatus, Commission, ContentBlock, Conversion, DailyReport, Prospect, TrainingProgress } from "../types";

type CandidateAdmin = Candidate & {
  score?: number;
  riskFlags?: string[];
  managerOwner?: string;
};

function cleanRecord(input: Record<string, unknown>) {
  return Object.fromEntries(Object.entries(input).filter(([, value]) => value !== undefined));
}

async function auditAdmin(candidateId: string, event: string, adminId?: string, details?: Record<string, unknown>) {
  await addDoc(collection(db, "auditLogs"), {
    candidateId,
    event,
    adminId: adminId || "",
    details: details || {},
    createdAt: serverTimestamp()
  });
}

function sumByCandidate<T extends { candidateId: string }>(items: T[], candidateId: string, selector: (item: T) => number) {
  return items.filter((item) => item.candidateId === candidateId).reduce((sum, item) => sum + selector(item), 0);
}

function statusTone(status?: string): "neutral" | "good" | "warn" | "danger" | "info" {
  if (["passed", "hired", "approved", "verified", "paid"].includes(status || "")) return "good";
  if (["failed", "rejected", "disputed"].includes(status || "")) return "danger";
  if (["pending", "submitted", "pending_verification", "needs_correction"].includes(status || "")) return "warn";
  if (["active_test", "training", "final_submitted"].includes(status || "")) return "info";
  return "neutral";
}

export function AdminHomePage() {
  const { data: candidates } = useCollectionData<CandidateAdmin>("candidates", [orderBy("updatedAt", "desc")]);
  const { data: reports } = useCollectionData<DailyReport>("dailyReports");
  const { data: conversions } = useCollectionData<Conversion>("conversions");
  const { data: commissions } = useCollectionData<Commission>("commissions");

  const statusData = Object.entries(
    candidates.reduce<Record<string, number>>((acc, candidate) => {
      acc[candidate.status] = (acc[candidate.status] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name: statusLabel(name), value }));

  const trackData = [
    { name: "Blip", value: candidates.filter((candidate) => candidate.selectedTracks?.includes("blip")).length },
    { name: "Chromonno", value: candidates.filter((candidate) => candidate.selectedTracks?.includes("chromonno")).length }
  ];

  const topCandidates = [...candidates]
    .map((candidate) => ({
      ...candidate,
      verifiedConversions: conversions.filter((conversion) => conversion.candidateId === candidate.uid && conversion.status === "verified").length
    }))
    .sort((a, b) => b.verifiedConversions - a.verifiedConversions)
    .slice(0, 5);

  return (
    <>
      <PageHeader
        eyebrow="Admin dashboard"
        title="See who is serious and who needs review"
        description="Track candidate activity, conversion proof, commission status, and risk signals from one workspace."
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Active candidates" value={candidates.filter((candidate) => candidate.status === "active_test").length} />
        <StatCard label="Prospects sourced" value={reports.reduce((sum, report) => sum + (report.prospectsSourced || 0), 0)} />
        <StatCard label="Conversations" value={reports.reduce((sum, report) => sum + (report.conversations || 0), 0)} />
        <StatCard label="Pending commission claims" value={commissions.filter((commission) => ["submitted", "pending_verification"].includes(commission.status)).length} />
      </div>
      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <Card>
          <h2 className="text-xl font-semibold">Candidates by status</h2>
          <div className="mt-5 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData}>
                <CartesianGrid stroke="#2A2D35" />
                <XAxis dataKey="name" stroke="#B6BCC8" />
                <YAxis stroke="#B6BCC8" allowDecimals={false} />
                <Tooltip contentStyle={{ background: "#0F1117", border: "1px solid #2A2D35", color: "#fff" }} />
                <Bar dataKey="value" fill="#55C2FF" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <h2 className="text-xl font-semibold">Candidates by track</h2>
          <div className="mt-5 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={trackData} dataKey="value" nameKey="name" innerRadius={65} outerRadius={105} label>
                  <Cell fill="#55C2FF" />
                  <Cell fill="#37D67A" />
                </Pie>
                <Tooltip contentStyle={{ background: "#0F1117", border: "1px solid #2A2D35", color: "#fff" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <Card>
          <h2 className="text-xl font-semibold">Candidates needing review</h2>
          <div className="mt-4 space-y-3">
            {candidates.filter((candidate) => ["final_submitted", "pending"].includes(candidate.status)).slice(0, 6).map((candidate) => (
              <Link key={candidate.uid} to={`/admin/candidates/${candidate.uid}`} className="flex items-center justify-between gap-3 rounded-md border border-borderline bg-ink p-4 hover:border-blue">
                <span>{candidate.fullName}</span>
                <Badge tone={statusTone(candidate.status)}>{statusLabel(candidate.status)}</Badge>
              </Link>
            ))}
          </div>
        </Card>
        <Card>
          <h2 className="text-xl font-semibold">Top verified conversions</h2>
          <div className="mt-4 space-y-3">
            {topCandidates.map((candidate) => (
              <div key={candidate.uid} className="flex items-center justify-between rounded-md border border-borderline bg-ink p-4">
                <span>{candidate.fullName}</span>
                <Badge tone="good">{candidate.verifiedConversions} verified</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}

const inviteSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  roleLabel: z.enum(["Business Development Associate", "Startup Partnership Associate", "Growth Partner", "Account Executive", "Sales / referral partner"]),
  selectedTrack: z.enum(["blip", "chromonno", "both"])
});

export function AdminCandidatesPage() {
  const { profile } = useAuth();
  const { data: candidates } = useCollectionData<CandidateAdmin>("candidates", [orderBy("updatedAt", "desc")]);
  const { data: reports } = useCollectionData<DailyReport>("dailyReports");
  const { data: conversions } = useCollectionData<Conversion>("conversions");
  const { data: invites } = useCollectionData<{ email: string; fullName: string; status: string; inviteLink: string }>("invites", [orderBy("createdAt", "desc")]);
  const form = useForm<z.infer<typeof inviteSchema>>({
    resolver: zodResolver(inviteSchema),
    defaultValues: { roleLabel: "Business Development Associate", selectedTrack: "blip" }
  });

  async function invite(values: z.infer<typeof inviteSchema>) {
    const token = crypto.randomUUID();
    const tracks = values.selectedTrack === "both" ? ["blip", "chromonno"] : [values.selectedTrack];
    await addDoc(collection(db, "invites"), {
      ...values,
      selectedTracks: tracks,
      status: "sent",
      token,
      inviteLink: `${defaultSettings.publicAppUrl}/login?invite=${token}`,
      createdBy: profile?.uid || "",
      createdAt: serverTimestamp()
    });
    form.reset({ roleLabel: "Business Development Associate", selectedTrack: "blip", fullName: "", email: "" });
  }

  return (
    <>
      <PageHeader
        eyebrow="Candidate management"
        title="Invite and review candidates"
        description="Create invite records, monitor progress, and open detailed scorecards."
      />
      <Card className="mb-5 shadow-none">
        <form className="grid gap-4 md:grid-cols-5" onSubmit={form.handleSubmit(invite)}>
          <Field label="Full name"><Input {...form.register("fullName")} /></Field>
          <Field label="Email"><Input type="email" {...form.register("email")} /></Field>
          <Field label="Role label"><Select {...form.register("roleLabel")}>{roleLabels.map((role) => <option key={role} value={role}>{role}</option>)}</Select></Field>
          <Field label="Track"><Select {...form.register("selectedTrack")}><option value="blip">Blip</option><option value="chromonno">Chromonno</option><option value="both">Both</option></Select></Field>
          <Button className="self-end" loading={form.formState.isSubmitting}><UserPlus className="h-4 w-4" />Invite</Button>
        </form>
      </Card>
      <Card>
        <h2 className="text-xl font-semibold">Candidate list</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[1100px] text-left text-sm">
            <thead className="text-muted">
              <tr>
                {["Name", "Email", "Role", "Track", "Status", "Day", "Prospects", "Contacts", "Conversations", "Conversions", "Score", "Risk", "Owner", "Last activity"].map((header) => <th key={header} className="border-b border-borderline p-3">{header}</th>)}
              </tr>
            </thead>
            <tbody>
              {candidates.map((candidate) => (
                <tr key={candidate.uid} className="border-b border-borderline/70">
                  <td className="p-3"><Link className="text-blue hover:text-white" to={`/admin/candidates/${candidate.uid}`}>{candidate.fullName}</Link></td>
                  <td className="p-3">{candidate.email}</td>
                  <td className="p-3">{candidate.roleLabel}</td>
                  <td className="p-3">{trackLabel(candidate.selectedTracks)}</td>
                  <td className="p-3"><Badge tone={statusTone(candidate.status)}>{statusLabel(candidate.status)}</Badge></td>
                  <td className="p-3">{candidate.currentTestDay || "-"}</td>
                  <td className="p-3">{sumByCandidate(reports, candidate.uid, (report) => report.prospectsSourced || 0)}</td>
                  <td className="p-3">{sumByCandidate(reports, candidate.uid, (report) => report.peopleContacted || 0)}</td>
                  <td className="p-3">{sumByCandidate(reports, candidate.uid, (report) => report.conversations || 0)}</td>
                  <td className="p-3">{conversions.filter((conversion) => conversion.candidateId === candidate.uid).length}</td>
                  <td className="p-3">{candidate.score ?? "-"}</td>
                  <td className="p-3">{candidate.riskFlags?.join(", ") || "-"}</td>
                  <td className="p-3">{candidate.managerOwner || candidate.assignedManagerId || "-"}</td>
                  <td className="p-3">{statusLabel(candidate.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      <Card className="mt-5 shadow-none">
        <h2 className="text-xl font-semibold">Recent invite records</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {invites.slice(0, 6).map((invite) => (
            <div key={invite.id} className="rounded-md border border-borderline bg-ink p-4 text-sm">
              <p className="font-semibold">{invite.fullName}</p>
              <p className="mt-1 text-muted">{invite.email}</p>
              <p className="mt-2 break-all text-blue">{invite.inviteLink}</p>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}

const candidateStatuses: CandidateStatus[] = ["invited", "terms_pending", "training", "active_test", "final_submitted", "passed", "failed", "pending", "hired"];

export function AdminCandidateDetailPage() {
  const { id } = useParams();
  const { profile } = useAuth();
  const { data: candidate } = useDocument<CandidateAdmin>("candidates", id);
  const { data: progress } = useCollectionData<TrainingProgress>("trainingProgress", id ? [where("candidateId", "==", id)] : [], Boolean(id));
  const { data: prospects } = useCollectionData<Prospect>("prospects", id ? [where("candidateId", "==", id)] : [], Boolean(id));
  const { data: reports } = useCollectionData<DailyReport>("dailyReports", id ? [where("candidateId", "==", id), orderBy("testDay", "asc")] : [], Boolean(id));
  const { data: conversions } = useCollectionData<Conversion>("conversions", id ? [where("candidateId", "==", id), orderBy("createdAt", "desc")] : [], Boolean(id));
  const { data: commissions } = useCollectionData<Commission>("commissions", id ? [where("candidateId", "==", id), orderBy("createdAt", "desc")] : [], Boolean(id));
  const { data: notes } = useCollectionData<{ body: string; createdAt: unknown; createdBy: string }>("managerNotes", id ? [where("candidateId", "==", id), orderBy("createdAt", "desc")] : [], Boolean(id));
  const { data: auditLogs } = useCollectionData<{ event: string; details?: Record<string, unknown>; createdAt: unknown }>("auditLogs", id ? [where("candidateId", "==", id), orderBy("createdAt", "desc")] : [], Boolean(id));
  const [tab, setTab] = useState("overview");
  const [note, setNote] = useState("");
  const [score, setScore] = useState(candidate?.score || 0);

  if (!candidate) {
    return <EmptyState title="Candidate not found" body="This candidate record does not exist or you do not have access." />;
  }

  async function setStatus(status: CandidateStatus) {
    if (!id) return;
    await updateDoc(doc(db, "candidates", id), { status, updatedAt: serverTimestamp() });
    await auditAdmin(id, "admin_status_change", profile?.uid, { status });
  }

  async function saveNote() {
    if (!id || !note.trim()) return;
    await addDoc(collection(db, "managerNotes"), {
      candidateId: id,
      body: note.trim(),
      createdBy: profile?.uid || "",
      createdAt: serverTimestamp()
    });
    setNote("");
  }

  async function saveScore() {
    if (!id) return;
    await updateDoc(doc(db, "candidates", id), { score, updatedAt: serverTimestamp() });
    await auditAdmin(id, "candidate_scored", profile?.uid, { score });
  }

  async function updateReport(reportId: string, status: DailyReport["status"]) {
    await updateDoc(doc(db, "dailyReports", reportId), { status, updatedAt: serverTimestamp() });
  }

  async function updateConversion(conversion: Conversion, status: Conversion["status"]) {
    if (!conversion.id || !id) return;
    await updateDoc(doc(db, "conversions", conversion.id), cleanRecord({
      status,
      verifiedBy: status === "verified" ? profile?.uid : undefined,
      verifiedAt: status === "verified" ? serverTimestamp() : undefined,
      updatedAt: serverTimestamp()
    }));
    await auditAdmin(id, status === "verified" ? "conversion_verified" : "conversion_rejected", profile?.uid, { conversionId: conversion.id });
  }

  async function updateCommission(commission: Commission, status: Commission["status"]) {
    if (!commission.id || !id) return;
    await updateDoc(doc(db, "commissions", commission.id), cleanRecord({
      status,
      approvedAmount: status === "approved" ? commission.estimatedAmount : undefined,
      paidAt: status === "paid" ? serverTimestamp() : undefined,
      updatedAt: serverTimestamp()
    }));
    await auditAdmin(id, `commission_${status}`, profile?.uid, { commissionId: commission.id });
  }

  const tabs = ["overview", "training", "tracker", "daily reports", "message samples", "conversion claims", "commission claims", "manager notes", "scorecard", "audit log"];

  return (
    <>
      <PageHeader
        eyebrow="Candidate detail"
        title={candidate.fullName}
        description={`${candidate.email} · ${candidate.roleLabel} · ${trackLabel(candidate.selectedTracks)}`}
        action={<Badge tone={statusTone(candidate.status)}>{statusLabel(candidate.status)}</Badge>}
      />
      <Card className="mb-5 shadow-none">
        <div className="flex flex-wrap gap-2">
          {tabs.map((item) => (
            <button key={item} className={`rounded-md px-3 py-2 text-sm capitalize ${tab === item ? "bg-blue text-ink" : "bg-white/5 text-muted hover:text-white"}`} onClick={() => setTab(item)}>{item}</button>
          ))}
        </div>
      </Card>

      {tab === "overview" && (
        <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
          <Card>
            <div className="grid gap-4 md:grid-cols-4">
              <StatCard label="Prospects" value={prospects.length} />
              <StatCard label="Reports" value={reports.length} />
              <StatCard label="Conversions" value={conversions.length} />
              <StatCard label="Score" value={candidate.score ?? "-"} />
            </div>
            <h2 className="mt-8 text-xl font-semibold">Status actions</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {candidateStatuses.map((status) => (
                <Button key={status} variant={candidate.status === status ? "primary" : "secondary"} onClick={() => setStatus(status)}>{statusLabel(status)}</Button>
              ))}
            </div>
          </Card>
          <Card>
            <h2 className="text-xl font-semibold">Manager note</h2>
            <Textarea className="mt-4" value={note} onChange={(event) => setNote(event.target.value)} placeholder="Add coaching, correction, or review note." />
            <Button className="mt-3" onClick={saveNote}><MessageSquare className="h-4 w-4" />Add note</Button>
          </Card>
        </div>
      )}

      {tab === "training" && (
        <Card>
          <h2 className="text-xl font-semibold">Training progress</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {trainingModules.map((module) => {
              const item = progress.find((entry) => entry.moduleId === module.id);
              return <div key={module.id} className="rounded-md border border-borderline bg-ink p-4"><Badge tone={item?.completed ? "good" : "warn"}>{item?.completed ? "Complete" : "Pending"}</Badge><p className="mt-2 font-semibold">{module.title}</p></div>;
            })}
          </div>
        </Card>
      )}

      {tab === "tracker" && (
        <Card>
          <h2 className="text-xl font-semibold">Prospect tracker</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="text-muted"><tr>{["Name", "Company", "Contact", "Channel", "Need", "Fit", "Status", "Next follow-up"].map((header) => <th key={header} className="border-b border-borderline p-3">{header}</th>)}</tr></thead>
              <tbody>{prospects.map((prospect) => <tr key={prospect.id} className="border-b border-borderline/70"><td className="p-3">{prospect.name}</td><td className="p-3">{prospect.company}</td><td className="p-3">{prospect.contact}</td><td className="p-3">{prospect.channel}</td><td className="p-3">{prospect.need}</td><td className="p-3">{trackLabel(prospect.offerFit)}</td><td className="p-3">{statusLabel(prospect.status)}</td><td className="p-3">{prospect.nextFollowUp || "-"}</td></tr>)}</tbody>
            </table>
          </div>
        </Card>
      )}

      {tab === "daily reports" && (
        <Card>
          <h2 className="text-xl font-semibold">Daily reports</h2>
          <div className="mt-4 space-y-3">
            {reports.map((report) => (
              <div key={report.id} className="rounded-md border border-borderline bg-ink p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div><p className="font-semibold">Day {report.testDay} · {report.date}</p><p className="text-sm text-muted">{report.prospectsSourced} sourced · {report.peopleContacted} contacted · {report.conversations} conversations · {report.conversions} conversions</p></div>
                  <Badge tone={statusTone(report.status)}>{statusLabel(report.status)}</Badge>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button variant="secondary" onClick={() => report.id && updateReport(report.id, "approved")}><CheckCircle2 className="h-4 w-4" />Approve</Button>
                  <Button variant="secondary" onClick={() => report.id && updateReport(report.id, "needs_correction")}>Request correction</Button>
                  <Button variant="danger" onClick={() => report.id && updateReport(report.id, "rejected")}><XCircle className="h-4 w-4" />Reject</Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {tab === "message samples" && (
        <Card>
          <h2 className="text-xl font-semibold">Message samples</h2>
          <div className="mt-4 space-y-3">
            {prospects.filter((prospect) => prospect.messageSent).map((prospect) => <pre key={prospect.id} className="whitespace-pre-wrap rounded-md border border-borderline bg-ink p-4 text-sm">{prospect.messageSent}</pre>)}
          </div>
        </Card>
      )}

      {tab === "conversion claims" && (
        <Card>
          <h2 className="text-xl font-semibold">Conversion claims</h2>
          <div className="mt-4 space-y-3">
            {conversions.map((conversion) => (
              <div key={conversion.id} className="rounded-md border border-borderline bg-ink p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div><p className="font-semibold">{conversion.prospectName}</p><p className="text-sm text-muted">{trackLabel(conversion.track)} · {conversion.conversionType.replace(/_/g, " ")} · {currency(conversion.amount)}</p></div>
                  <Badge tone={statusTone(conversion.status)}>{statusLabel(conversion.status)}</Badge>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button variant="secondary" onClick={() => updateConversion(conversion, "verified")}><ClipboardCheck className="h-4 w-4" />Verify</Button>
                  <Button variant="danger" onClick={() => updateConversion(conversion, "rejected")}><XCircle className="h-4 w-4" />Reject</Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {tab === "commission claims" && (
        <Card>
          <h2 className="text-xl font-semibold">Commission claims</h2>
          <div className="mt-4 space-y-3">
            {commissions.map((commission) => (
              <div key={commission.id} className="rounded-md border border-borderline bg-ink p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div><p className="font-semibold">{trackLabel(commission.track)} · {currency(commission.estimatedAmount)}</p><p className="text-sm text-muted">Rate {(commission.rate * 100).toFixed(0)}%</p></div>
                  <Badge tone={statusTone(commission.status)}>{statusLabel(commission.status)}</Badge>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button variant="secondary" onClick={() => updateCommission(commission, "approved")}>Approve</Button>
                  <Button variant="secondary" onClick={() => updateCommission(commission, "paid")}>Mark paid</Button>
                  <Button variant="danger" onClick={() => updateCommission(commission, "rejected")}>Reject</Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {tab === "manager notes" && (
        <Card>
          <h2 className="text-xl font-semibold">Manager notes</h2>
          <div className="mt-4 space-y-3">{notes.map((item) => <p key={item.id} className="rounded-md border border-borderline bg-ink p-4 text-sm leading-6 text-muted">{item.body}</p>)}</div>
        </Card>
      )}

      {tab === "scorecard" && (
        <Card>
          <h2 className="text-xl font-semibold">Scorecard</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {["Relevant prospects", "Prospect quality", "Communication quality", "Need-offer alignment", "Follow-up discipline", "Valid conversions", "Clean reporting", "Brand-safe behavior"].map((criterion) => <div key={criterion} className="rounded-md border border-borderline bg-ink p-4">{criterion}</div>)}
          </div>
          <div className="mt-5 flex max-w-sm gap-3">
            <Input type="number" min={0} max={100} value={score} onChange={(event) => setScore(Number(event.target.value))} />
            <Button onClick={saveScore}><Save className="h-4 w-4" />Save score</Button>
          </div>
        </Card>
      )}

      {tab === "audit log" && (
        <Card>
          <h2 className="text-xl font-semibold">Audit log</h2>
          <div className="mt-4 space-y-3">{auditLogs.map((log) => <div key={log.id} className="rounded-md border border-borderline bg-ink p-4 text-sm"><p className="font-semibold">{log.event.replace(/_/g, " ")}</p><pre className="mt-2 whitespace-pre-wrap text-muted">{JSON.stringify(log.details || {}, null, 2)}</pre></div>)}</div>
        </Card>
      )}
    </>
  );
}

export function AdminConversionsPage() {
  const { profile } = useAuth();
  const { data: conversions } = useCollectionData<Conversion>("conversions", [orderBy("createdAt", "desc")]);
  const { data: candidates } = useCollectionData<Candidate>("candidates");
  const candidateMap = new Map(candidates.map((candidate) => [candidate.uid, candidate.fullName]));

  async function decide(conversion: Conversion, status: Conversion["status"]) {
    if (!conversion.id) return;
    await updateDoc(doc(db, "conversions", conversion.id), cleanRecord({
      status,
      verifiedBy: status === "verified" ? profile?.uid : undefined,
      verifiedAt: status === "verified" ? serverTimestamp() : undefined,
      updatedAt: serverTimestamp()
    }));
    await auditAdmin(conversion.candidateId, status === "verified" ? "conversion_verified" : "conversion_rejected", profile?.uid, { conversionId: conversion.id });
  }

  return (
    <>
      <PageHeader eyebrow="Review queue" title="Conversion review" description="Verify only conversions with a real aligned need and evidence." />
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[920px] text-left text-sm">
            <thead className="text-muted"><tr>{["Candidate", "Prospect", "Track", "Amount", "Proof", "Status", "Commission estimate", "Decision"].map((header) => <th key={header} className="border-b border-borderline p-3">{header}</th>)}</tr></thead>
            <tbody>{conversions.map((conversion) => {
              const rate = defaultSettings.commissionRates[conversion.track];
              return <tr key={conversion.id} className="border-b border-borderline/70"><td className="p-3">{candidateMap.get(conversion.candidateId) || conversion.candidateId}</td><td className="p-3">{conversion.prospectName}</td><td className="p-3">{trackLabel(conversion.track)}</td><td className="p-3">{currency(conversion.amount)}</td><td className="p-3">{(conversion.evidenceFiles?.length || conversion.evidenceLinks?.length) ? "Attached" : "Missing"}</td><td className="p-3"><Badge tone={statusTone(conversion.status)}>{statusLabel(conversion.status)}</Badge></td><td className="p-3">{conversion.amount ? currency(conversion.amount * rate) : "Not set"}</td><td className="p-3"><div className="flex gap-2"><Button variant="secondary" onClick={() => decide(conversion, "verified")}>Verify</Button><Button variant="danger" onClick={() => decide(conversion, "rejected")}>Reject</Button></div></td></tr>;
            })}</tbody>
          </table>
        </div>
      </Card>
    </>
  );
}

export function AdminCommissionsPage() {
  const { data: commissions } = useCollectionData<Commission>("commissions", [orderBy("createdAt", "desc")]);
  const { data: candidates } = useCollectionData<Candidate>("candidates");
  const candidateMap = new Map(candidates.map((candidate) => [candidate.uid, candidate.fullName]));

  async function update(commission: Commission, status: Commission["status"]) {
    if (!commission.id) return;
    await updateDoc(doc(db, "commissions", commission.id), cleanRecord({
      status,
      approvedAmount: status === "approved" ? commission.estimatedAmount : commission.approvedAmount,
      paidAt: status === "paid" ? serverTimestamp() : undefined,
      updatedAt: serverTimestamp()
    }));
  }

  return (
    <>
      <PageHeader eyebrow="Finance review" title="Commission tracking" description="Separate estimated, submitted, pending, approved, paid, rejected, and disputed commissions." />
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="text-muted"><tr>{["Candidate", "Conversion", "Track", "Gross", "Rate", "Estimated", "Approved", "Status", "Actions"].map((header) => <th key={header} className="border-b border-borderline p-3">{header}</th>)}</tr></thead>
            <tbody>{commissions.map((commission) => <tr key={commission.id} className="border-b border-borderline/70"><td className="p-3">{candidateMap.get(commission.candidateId) || commission.candidateId}</td><td className="p-3">{commission.conversionId}</td><td className="p-3">{trackLabel(commission.track)}</td><td className="p-3">{currency(commission.grossAmount)}</td><td className="p-3">{(commission.rate * 100).toFixed(0)}%</td><td className="p-3">{currency(commission.estimatedAmount)}</td><td className="p-3">{currency(commission.approvedAmount)}</td><td className="p-3"><Badge tone={statusTone(commission.status)}>{statusLabel(commission.status)}</Badge></td><td className="p-3"><div className="flex gap-2"><Button variant="secondary" onClick={() => update(commission, "approved")}>Approve</Button><Button variant="secondary" onClick={() => update(commission, "paid")}>Paid</Button><Button variant="danger" onClick={() => update(commission, "rejected")}>Reject</Button></div></td></tr>)}</tbody>
          </table>
        </div>
      </Card>
    </>
  );
}

const contentSchema = z.object({
  key: z.string().min(2),
  title: z.string().min(2),
  section: z.string().min(2),
  body: z.string().min(5),
  published: z.boolean()
});

export function AdminContentPage() {
  const { profile } = useAuth();
  const { data: blocks } = useCollectionData<ContentBlock>("contentBlocks", [orderBy("section", "asc")]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = blocks.find((block) => block.id === selectedId);
  const form = useForm<z.infer<typeof contentSchema>>({
    resolver: zodResolver(contentSchema),
    values: selected ? { key: selected.key, title: selected.title, section: selected.section, body: selected.body, published: selected.published } : { key: "", title: "", section: "welcome", body: "", published: true }
  });

  async function save(values: z.infer<typeof contentSchema>) {
    const ref = selectedId ? doc(db, "contentBlocks", selectedId) : doc(collection(db, "contentBlocks"));
    if (selected) {
      await addDoc(collection(db, "contentBlockVersions"), { contentBlockId: selected.id, ...selected, archivedAt: serverTimestamp(), archivedBy: profile?.uid || "" });
    }
    await setDoc(ref, {
      ...values,
      version: selected ? increment(1) : 1,
      updatedBy: profile?.uid || "",
      updatedAt: serverTimestamp()
    }, { merge: true });
    setSelectedId(ref.id);
  }

  return (
    <>
      <PageHeader eyebrow="Editable content" title="Content management" description="Update welcome copy, training, scripts, FAQ, terms, privacy, daily plan, resources, and official links without code changes." />
      <div className="grid gap-5 lg:grid-cols-[320px_1fr]">
        <Card>
          <Button className="mb-4 w-full" variant="secondary" onClick={() => setSelectedId(null)}>New content block</Button>
          <div className="space-y-2">
            {blocks.map((block) => (
              <button key={block.id} className={`w-full rounded-md border p-3 text-left text-sm ${selectedId === block.id ? "border-blue bg-blue/10" : "border-borderline bg-ink"}`} onClick={() => setSelectedId(block.id || null)}>
                <p className="font-semibold">{block.title}</p>
                <p className="mt-1 text-muted">{block.section} · v{block.version}</p>
              </button>
            ))}
          </div>
        </Card>
        <Card>
          <form className="space-y-4" onSubmit={form.handleSubmit(save)}>
            <div className="grid gap-4 md:grid-cols-3">
              <Field label="Key"><Input {...form.register("key")} /></Field>
              <Field label="Title"><Input {...form.register("title")} /></Field>
              <Field label="Section"><Input {...form.register("section")} /></Field>
            </div>
            <Field label="Body"><Textarea className="min-h-72" {...form.register("body")} /></Field>
            <label className="flex items-center gap-3 text-sm"><input type="checkbox" className="h-5 w-5 accent-blue" {...form.register("published")} />Published to candidates</label>
            <Button loading={form.formState.isSubmitting}><Save className="h-4 w-4" />Save content</Button>
          </form>
          <div className="mt-8 grid gap-3 md:grid-cols-2">
            <Card className="shadow-none"><h3 className="font-semibold">Seeded content coverage</h3><p className="mt-2 text-sm text-muted">{trainingModules.length} training modules, {scriptTemplates.length} scripts, {dailyPlan.length} daily plan entries, {prospectingResources.length} resources.</p></Card>
            <Card className="shadow-none"><h3 className="font-semibold">Legal defaults</h3><p className="mt-2 text-sm text-muted">{legalCopy.terms.slice(0, 150)}...</p></Card>
          </div>
        </Card>
      </div>
    </>
  );
}

const settingsSchema = z.object({
  blipUrl: z.string().url(),
  chromonnoUrl: z.string().url(),
  officialEmail: z.string().email(),
  blipRate: z.coerce.number().min(0).max(1),
  chromonnoRate: z.coerce.number().min(0).max(1),
  prospectsSourced: z.coerce.number().min(0),
  peopleContacted: z.coerce.number().min(0),
  conversations: z.coerce.number().min(0),
  conversions: z.coerce.number().min(0),
  aiHelperEnabled: z.boolean(),
  inviteOnlyMode: z.boolean()
});

export function AdminSettingsPage() {
  const { data: settings } = useDocument<typeof defaultSettings>("settings", "portal");
  const form = useForm<z.infer<typeof settingsSchema>>({
    resolver: zodResolver(settingsSchema),
    values: {
      blipUrl: settings?.blipUrl || defaultSettings.blipUrl,
      chromonnoUrl: settings?.chromonnoUrl || defaultSettings.chromonnoUrl,
      officialEmail: settings?.officialEmail || defaultSettings.officialEmail,
      blipRate: settings?.commissionRates?.blip ?? defaultSettings.commissionRates.blip,
      chromonnoRate: settings?.commissionRates?.chromonno ?? defaultSettings.commissionRates.chromonno,
      prospectsSourced: settings?.dailyTargets?.prospectsSourced ?? defaultSettings.dailyTargets.prospectsSourced,
      peopleContacted: settings?.dailyTargets?.peopleContacted ?? defaultSettings.dailyTargets.peopleContacted,
      conversations: settings?.dailyTargets?.conversations ?? defaultSettings.dailyTargets.conversations,
      conversions: settings?.dailyTargets?.conversions ?? defaultSettings.dailyTargets.conversions,
      aiHelperEnabled: settings?.aiHelperEnabled ?? defaultSettings.aiHelperEnabled,
      inviteOnlyMode: settings?.inviteOnlyMode ?? defaultSettings.inviteOnlyMode
    }
  });

  async function save(values: z.infer<typeof settingsSchema>) {
    await setDoc(doc(db, "settings", "portal"), {
      blipUrl: values.blipUrl,
      chromonnoUrl: values.chromonnoUrl,
      officialEmail: values.officialEmail,
      commissionRates: { blip: values.blipRate, chromonno: values.chromonnoRate },
      dailyTargets: {
        prospectsSourced: values.prospectsSourced,
        peopleContacted: values.peopleContacted,
        conversations: values.conversations,
        conversions: values.conversions
      },
      aiHelperEnabled: values.aiHelperEnabled,
      inviteOnlyMode: values.inviteOnlyMode,
      trackNames: defaultSettings.trackNames,
      updatedAt: serverTimestamp()
    }, { merge: true });
  }

  return (
    <>
      <PageHeader eyebrow="Settings" title="Portal configuration" description="Keep domains, official links, commission rates, targets, AI helper status, and invite mode editable." />
      <Card>
        <form className="grid gap-4 md:grid-cols-2" onSubmit={form.handleSubmit(save)}>
          <Field label="Blip Creative Works website"><Input {...form.register("blipUrl")} /></Field>
          <Field label="Chromonno brand page"><Input {...form.register("chromonnoUrl")} /></Field>
          <Field label="Official email"><Input type="email" {...form.register("officialEmail")} /></Field>
          <Field label="Blip commission rate"><Input type="number" step="0.01" {...form.register("blipRate")} /></Field>
          <Field label="Chromonno commission rate"><Input type="number" step="0.01" {...form.register("chromonnoRate")} /></Field>
          <Field label="Daily prospects sourced"><Input type="number" {...form.register("prospectsSourced")} /></Field>
          <Field label="Daily people contacted"><Input type="number" {...form.register("peopleContacted")} /></Field>
          <Field label="Daily conversations"><Input type="number" {...form.register("conversations")} /></Field>
          <Field label="Daily conversions"><Input type="number" {...form.register("conversions")} /></Field>
          <label className="flex items-center gap-3 text-sm"><input type="checkbox" className="h-5 w-5 accent-blue" {...form.register("aiHelperEnabled")} />AI helper enabled</label>
          <label className="flex items-center gap-3 text-sm"><input type="checkbox" className="h-5 w-5 accent-blue" {...form.register("inviteOnlyMode")} />Invite-only mode</label>
          <Button className="md:col-span-2" loading={form.formState.isSubmitting}><Save className="h-4 w-4" />Save settings</Button>
        </form>
      </Card>
    </>
  );
}
