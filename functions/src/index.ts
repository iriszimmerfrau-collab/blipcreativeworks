import { initializeApp } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { onDocumentUpdated } from "firebase-functions/v2/firestore";
import { HttpsError, onCall } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";
import { setGlobalOptions } from "firebase-functions/v2";
import { z } from "zod";

initializeApp();
setGlobalOptions({ region: process.env.FUNCTION_REGION || "us-central1" });

const db = getFirestore();
const aiApiKey = defineSecret("AI_API_KEY");

const inputSchema = z.object({
  track: z.enum(["blip", "chromonno", "both"]),
  channel: z.string().min(1),
  stage: z.enum(["cold", "follow_up", "objection", "closing", "referral"]),
  prospectName: z.string().optional(),
  company: z.string().optional(),
  website: z.string().optional(),
  knownDetail: z.string().optional(),
  need: z.string().optional(),
  tone: z.enum(["professional", "friendly", "short", "direct"]).optional(),
  language: z.string().optional()
});

const inviteSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  roleLabel: z.string().min(2),
  selectedTracks: z.array(z.enum(["blip", "chromonno"])).min(1)
});

type GenerateMessageOutput = {
  message: string;
  subjectLine?: string;
  personalizationUsed: string[];
  whyItWorks: string;
  safetyWarnings: string[];
  nextStepSuggestion: string;
};

async function roleFor(uid: string) {
  const user = await db.doc(`users/${uid}`).get();
  return user.exists ? user.data()?.role : undefined;
}

async function assertAdmin(uid?: string) {
  if (!uid) throw new HttpsError("unauthenticated", "Sign in first.");
  const role = await roleFor(uid);
  if (role !== "admin" && role !== "manager") {
    throw new HttpsError("permission-denied", "Admin or manager role required.");
  }
}

function safeFallback(input: z.infer<typeof inputSchema>, warnings: string[] = []): GenerateMessageOutput {
  const trackName = input.track === "chromonno" ? "Chromonno" : input.track === "blip" ? "Blip Creative Works" : "Blip Creative Works and Chromonno";
  const offer =
    input.track === "chromonno"
      ? "creative clothing collection"
      : input.track === "blip"
        ? "Startup Growth Infrastructure"
        : "the offer that fits your need";
  const detail = input.knownDetail || input.company || "your work";
  const need = input.need || "the goal you are working on";
  const name = input.prospectName || "there";

  return {
    subjectLine: input.channel.toLowerCase().includes("email") ? `Quick question about ${need}` : undefined,
    message: `Hi ${name}, I noticed ${detail}. I am in a business development candidate program with ${trackName}. ${trackName} may help with ${offer}. Is ${need} something you are open to discussing briefly?`,
    personalizationUsed: [detail, need].filter(Boolean),
    whyItWorks: "It is short, names a real detail, asks a question, and does not push a link before fit is clear.",
    safetyWarnings: [
      ...warnings,
      "Edit this before sending.",
      "Do not send the same message to everyone.",
      "Do not claim guaranteed results, guaranteed income, fake discounts, or employee status."
    ],
    nextStepSuggestion: "If the prospect replies, ask one qualifying question before sending an official link."
  };
}

function isTooGeneric(input: z.infer<typeof inputSchema>) {
  return !input.knownDetail && !input.need && !input.company && !input.website;
}

function extractJson(text: string) {
  const trimmed = text.trim();
  const first = trimmed.indexOf("{");
  const last = trimmed.lastIndexOf("}");
  if (first === -1 || last === -1) return trimmed;
  return trimmed.slice(first, last + 1);
}

export const generateOutreachMessage = onCall({ secrets: [aiApiKey], enforceAppCheck: false }, async (request) => {
  if (!request.auth?.uid) throw new HttpsError("unauthenticated", "Sign in first.");
  const input = inputSchema.parse(request.data);

  if (isTooGeneric(input)) {
    return safeFallback(input, ["The input is too generic. Add one real company, product, post, location, audience, or problem detail before sending."]);
  }

  if (process.env.AI_HELPER_ENABLED === "false") {
    return safeFallback(input, ["AI helper is disabled by admin settings."]);
  }

  const key = aiApiKey.value() || process.env.AI_API_KEY;
  const providerUrl = process.env.AI_PROVIDER_URL || "https://api.openai.com/v1/responses";
  const model = process.env.AI_MODEL || "gpt-4.1-mini";
  if (!key) return safeFallback(input, ["No backend AI key is configured."]);

  const system = [
    "You generate safe, short outreach drafts for accepted candidates in a business development onboarding portal.",
    "Never generate spammy bulk messages.",
    "Never generate false claims, fake urgency, fake discounts, guaranteed income, guaranteed sales, or guaranteed growth promises.",
    "Never say the candidate is an employee.",
    "Keep output short and usable.",
    "Tell the candidate to edit before sending.",
    "Return valid JSON with: message, optional subjectLine, personalizationUsed array, whyItWorks, safetyWarnings array, nextStepSuggestion."
  ].join(" ");

  try {
    const response = await fetch(providerUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model,
        input: [
          { role: "system", content: system },
          { role: "user", content: JSON.stringify(input) }
        ],
        text: {
          format: {
            type: "json_schema",
            name: "outreach_message",
            schema: {
              type: "object",
              additionalProperties: false,
              required: ["message", "personalizationUsed", "whyItWorks", "safetyWarnings", "nextStepSuggestion"],
              properties: {
                message: { type: "string" },
                subjectLine: { type: "string" },
                personalizationUsed: { type: "array", items: { type: "string" } },
                whyItWorks: { type: "string" },
                safetyWarnings: { type: "array", items: { type: "string" } },
                nextStepSuggestion: { type: "string" }
              }
            }
          }
        }
      })
    });

    if (!response.ok) return safeFallback(input, [`AI provider returned ${response.status}. Safe fallback used.`]);
    const payload = await response.json() as { output_text?: string; output?: Array<{ content?: Array<{ text?: string }> }> };
    const text = payload.output_text || payload.output?.flatMap((item) => item.content || []).map((item) => item.text || "").join("\n") || "";
    const parsed = JSON.parse(extractJson(text)) as GenerateMessageOutput;
    return {
      ...parsed,
      safetyWarnings: [...(parsed.safetyWarnings || []), "Edit before sending and log the message in the tracker."]
    };
  } catch (error) {
    return safeFallback(input, ["AI provider call failed. Safe fallback used."]);
  }
});

export const createCandidateInvite = onCall(async (request) => {
  await assertAdmin(request.auth?.uid);
  const input = inviteSchema.parse(request.data);
  const token = crypto.randomUUID();
  const publicAppUrl = process.env.PUBLIC_APP_URL || process.env.VITE_PUBLIC_APP_URL || "http://localhost:5173";
  const ref = await db.collection("invites").add({
    ...input,
    token,
    status: "sent",
    inviteLink: `${publicAppUrl}/login?invite=${token}`,
    createdBy: request.auth?.uid,
    createdAt: FieldValue.serverTimestamp()
  });
  return { inviteId: ref.id, inviteLink: `${publicAppUrl}/login?invite=${token}` };
});

export const syncCommissionAfterConversionUpdate = onDocumentUpdated("conversions/{conversionId}", async (event) => {
  const before = event.data?.before.data();
  const after = event.data?.after.data();
  if (!before || !after || before.status === after.status) return;

  const commissions = await db.collection("commissions").where("conversionId", "==", event.params.conversionId).get();
  const batch = db.batch();
  commissions.docs.forEach((commission) => {
    const patch: Record<string, unknown> = {
      updatedAt: FieldValue.serverTimestamp()
    };

    if (after.status === "verified") {
      patch.status = "pending_verification";
    }
    if (after.status === "rejected") {
      patch.status = "rejected";
      patch.adminNotes = "Conversion rejected during admin review.";
    }

    batch.update(commission.ref, patch);
  });
  await batch.commit();
});
