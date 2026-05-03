import type { PortalSettings, RoleLabel, ScriptTemplate, TrainingModule } from "../types";

const env = (import.meta as unknown as { env?: Record<string, string> }).env || {};

export const defaultSettings: PortalSettings = {
  blipUrl: env.VITE_BLIP_URL || "https://gsia.blipcreativeworks.store/",
  chromonnoUrl: env.VITE_CHROMONNO_URL || "https://payhip.com/Chromonno",
  officialEmail: env.VITE_OFFICIAL_EMAIL || "ceo@blipcreativeworks.store",
  publicAppUrl: env.VITE_PUBLIC_APP_URL || "http://localhost:5173",
  commissionRates: {
    blip: 0.2,
    chromonno: 0.1
  },
  dailyTargets: {
    prospectsSourced: 500,
    peopleContacted: 350,
    conversations: 15,
    conversions: 1
  },
  aiHelperEnabled: true,
  inviteOnlyMode: true,
  trackNames: {
    blip: "Blip Creative Works",
    chromonno: "Chromonno"
  }
};

export const roleLabels: RoleLabel[] = [
  "Business Development Associate",
  "Startup Partnership Associate",
  "Growth Partner",
  "Account Executive",
  "Sales / referral partner"
];

export const trackCards = [
  {
    id: "blip",
    title: "Blip Creative Works",
    offer: "Startup Growth Infrastructure",
    summary:
      "For founders, startups, SMEs, student founders, and organizations that need practical growth systems, clearer positioning, operational support, and help moving from idea to market.",
    prospects: ["Startup founders", "Idea-stage founders", "Early-stage teams", "SMEs", "Student founders", "Local businesses"]
  },
  {
    id: "chromonno",
    title: "Chromonno",
    offer: "Creative retail clothing sales",
    summary:
      "For fashion buyers, shops, communities, gift buyers, Instagram audiences, WhatsApp groups, local businesses, and people interested in creative clothing collections.",
    prospects: ["Fashion buyers", "Local shops", "Student communities", "Gift buyers", "Instagram audiences", "Creative product buyers"],
    note:
      "Physical samples cannot be shipped to candidates because of shipping timing. Use the online brand page, product visuals, brochure, catalog, and approved scripts."
  }
] as const;

export const trainingModules: TrainingModule[] = [
  {
    id: "role-overview",
    title: "Role overview",
    minutes: 8,
    body: [
      "Your job is not to spam links. Your job is to find the right person, understand their need, choose the right offer, and guide them to a clear next step.",
      "You may use the role label assigned to you, such as Business Development Associate, Startup Partnership Associate, Growth Partner, Account Executive, or Sales / referral partner.",
      "If you are an independent contractor or candidate, do not claim to be an employee."
    ],
    checklist: ["I can explain my role simply.", "I know honesty matters more than speed.", "I know every activity must be logged."]
  },
  {
    id: "blip-track",
    title: "Blip Creative Works track",
    minutes: 10,
    body: [
      "Blip Creative Works offers Startup Growth Infrastructure.",
      "Blip helps founders and organizations improve offer clarity, operations, positioning, and go-to-market systems.",
      "Good prospects have a real business need, not just curiosity."
    ],
    checklist: ["I can name who Blip helps.", "I can describe Startup Growth Infrastructure.", "I can avoid promising guaranteed growth."]
  },
  {
    id: "chromonno-track",
    title: "Chromonno track",
    minutes: 10,
    body: [
      "Chromonno is creative retail clothing sales.",
      "You sell using the official online brand page, product visuals, brochure, catalog, and approved scripts.",
      "Chromonno physical samples cannot be shipped to candidates because of shipping timing."
    ],
    checklist: ["I know the no-sample rule.", "I can describe the buyer audience.", "I can ask if the style fits before sending long details."]
  },
  {
    id: "prospecting",
    title: "Prospecting fundamentals",
    minutes: 12,
    body: [
      "Prospecting means finding people who might have a real need.",
      "Personalize with one true detail: company, product, founder post, location, audience, or problem.",
      "Do not scrape or misuse private contact information."
    ],
    checklist: ["I can identify relevant prospects.", "I can add one specific detail.", "I know private data must be handled responsibly."]
  },
  {
    id: "qualification",
    title: "Qualification framework",
    minutes: 10,
    body: [
      "Qualify before you push a link. Ask what they are trying to improve, who they serve, and what decision comes next.",
      "A valid conversion is not just interest. A valid conversion is a real commitment or transaction that an admin can verify.",
      "If there is no fit, mark not fit and move on respectfully."
    ],
    checklist: ["I ask before sending long information.", "I can separate interest from commitment.", "I can mark not-fit prospects honestly."]
  },
  {
    id: "sales-process",
    title: "10-step sales process",
    minutes: 15,
    body: [
      "1. Pick a track. 2. Define the prospect type. 3. Find relevant prospects. 4. Research one detail. 5. Send a short personal message.",
      "6. Ask qualifying questions. 7. Match the need to the correct offer. 8. Follow up respectfully. 9. Ask for a clear next step. 10. Report the conversion with proof.",
      "High activity is not permission to spam. Every message must be personalized, honest, respectful, and relevant."
    ],
    checklist: ["I can follow all 10 steps.", "I know when to send official links.", "I know proof is required for conversions."]
  },
  {
    id: "channels",
    title: "Outreach channels",
    minutes: 10,
    body: [
      "Use LinkedIn, email, WhatsApp, Instagram, Product Hunt, Indie Hackers, startup directories, local businesses, school clubs, coworking spaces, events, and public business visits.",
      "Each channel has different etiquette. Keep messages short, relevant, and respectful.",
      "Stop contacting people who say no."
    ],
    checklist: ["I can choose channels that fit my network.", "I can respect opt-outs.", "I know local outreach must stay safe and public."]
  },
  {
    id: "scripts",
    title: "Scripts and personalization",
    minutes: 12,
    body: [
      "Scripts are a starting point. Edit before sending.",
      "Message quality checklist: relevant prospect, one specific detail, clear question, short message, honest wording, no false promises, logged in tracker.",
      "Do not send the same message to everyone."
    ],
    checklist: ["I will edit scripts before sending.", "I can spot misleading claims.", "I can use the message quality checklist."]
  },
  {
    id: "objections",
    title: "Objection handling",
    minutes: 10,
    body: [
      "An objection is useful information. Answer simply, stay calm, and do not pressure people.",
      "If someone asks about fees, say there is no joining fee and no purchase requirement.",
      "If someone asks for Chromonno samples, explain the online-materials rule clearly."
    ],
    checklist: ["I can answer fee questions.", "I can explain the Chromonno sample rule.", "I can stop when someone is not interested."]
  },
  {
    id: "reporting",
    title: "Reporting and commission tracking",
    minutes: 12,
    body: [
      "Daily reports show whether you are serious and organized.",
      "Commissions are estimates until admin verification. Blip qualified conversions use a 20% performance incentive. Chromonno qualified conversions use a 10% performance incentive.",
      "Do not show guaranteed income. Commission only applies to verified conversions."
    ],
    checklist: ["I can submit daily reports.", "I know commission is not guaranteed.", "I know admin approval is required."]
  },
  {
    id: "legal-safety",
    title: "Legal, safety, and privacy rules",
    minutes: 14,
    body: [
      "Do not spam, harass, misrepresent the company, make fake promises, claim guaranteed results, or use fake urgency.",
      "For local outreach, only visit public business locations. Do not enter private homes. Leave immediately if asked. Do not block entrances or disturb customers.",
      "If you are under the legal working age in your location, you must have required permission and follow local law."
    ],
    checklist: ["I respect privacy and opt-outs.", "I know local outreach safety rules.", "I know under-age candidates must follow local law and permission rules."]
  }
];

export const dailyPlan = [
  {
    day: 1,
    title: "Learn and build list",
    tasks: [
      "Complete onboarding modules",
      "Accept terms and privacy notice",
      "Choose Blip, Chromonno, or both",
      "Download tracker template",
      "Build first prospect list",
      "Start with free channels"
    ]
  },
  {
    day: 2,
    title: "First outreach",
    tasks: ["Send first outreach messages", "Test at least 3 variations", "Log all contacts", "Do not spam", "Personalize every message"]
  },
  {
    day: 3,
    title: "Follow-up and qualification",
    tasks: ["Follow up on non-replies", "Ask qualifying questions", "Log replies", "Mark prospects by status"]
  },
  {
    day: 4,
    title: "Push conversations forward",
    tasks: ["Match prospect needs to the correct offer", "Send relevant link only after fit is clear", "Ask for a clear next step"]
  },
  {
    day: 5,
    title: "Close first commitment",
    tasks: ["Move warm conversations toward commitment or transaction", "Report conversion proof", "Ask for referral after a positive response"]
  },
  {
    day: 6,
    title: "Recover and improve",
    tasks: ["Follow up with warm leads", "Improve weak scripts", "Ask referrals", "Focus on best-performing channel"]
  },
  {
    day: 7,
    title: "Final report",
    tasks: ["Submit tracker", "Submit conversions", "Submit lessons learned", "Submit remaining pipeline", "Wait for admin evaluation"]
  }
];

export const prospectingResources = [
  { title: "Launching Next", url: "https://www.launchingnext.com/", track: "Blip" },
  { title: "EU-Startups Directory", url: "https://www.eu-startups.com/directory/", track: "Blip" },
  { title: "StartupBase 2026 launches", url: "https://startupbase.io/launches/yearly/2026", track: "Blip" },
  { title: "AlternativeTo new apps", url: "https://alternativeto.net/browse/new-apps/", track: "Blip" },
  { title: "Peerlist Launchpad", url: "https://peerlist.io/launchpad/2026/week/1", track: "Blip" },
  { title: "DevHunt", url: "https://devhunt.org/", track: "Blip" },
  { title: "Marketing DB", url: "https://marketingdb.live/?sort=new", track: "Blip" },
  { title: "Uneed", url: "https://www.uneed.best/", track: "Blip" },
  { title: "Microlaunch", url: "https://microlaunch.net/", track: "Blip" },
  { title: "Indie Hackers products", url: "https://www.indiehackers.com/products", track: "Blip" },
  { title: "Product Hunt yearly leaderboard", url: "https://www.producthunt.com/leaderboard/yearly/2026/all", track: "Blip" },
  { title: "BetaList", url: "https://betalist.com/browse", track: "Blip" },
  { title: "SaaSHub", url: "https://www.saashub.com/", track: "Blip" },
  { title: "Fazier", url: "https://fazier.com/", track: "Blip" }
];

export const localOutreachGuidance = [
  "Small businesses: ask for the owner or manager, then keep the pitch short.",
  "School clubs and startup clubs: ask permission from organizers before presenting.",
  "Coworking spaces and events: speak with public representatives and respect event rules.",
  "Local shops: do not block entrances, interrupt customers, or enter restricted areas.",
  "Door-to-door public business outreach: only visit public business locations, never private homes, and leave immediately if asked."
];

const channelAdvice: Record<ScriptTemplate["channel"], string> = {
  linkedin: "Use a short professional note and mention one public detail from the profile or company page.",
  email: "Use a clear subject line, one specific detail, and one direct question.",
  whatsapp: "Use only appropriate contacts and keep the first message very short.",
  instagram: "Reference one real post, product, style, or audience detail.",
  product_hunt: "Keep comments useful and avoid dropping links without context.",
  indie_hackers: "Write like a helpful community member, not a pitch bot.",
  startup_directory: "Mention the launch, category, or product problem you noticed.",
  local_business: "Ask for the right contact before explaining the offer.",
  door_to_door: "Stay public, brief, safe, and respectful."
};

export const messageQualityChecklist = [
  "Is the prospect relevant?",
  "Did I add one specific detail?",
  "Did I ask a clear question?",
  "Is the message short?",
  "Is it honest?",
  "Did I avoid false promises?",
  "Did I log it in the tracker?"
];

const baseScripts: ScriptTemplate[] = [
  {
    id: "blip-founder-cold",
    track: "blip",
    channel: "linkedin",
    stage: "cold",
    title: "Blip cold founder outreach",
    template:
      "Hi [Name], I saw [specific detail about company/project]. I work with Blip Creative Works, helping early founders turn ideas into practical Startup Growth Infrastructure. Are you currently trying to improve your offer, operations, or go-to-market system?",
    explanation: "Names one specific detail and asks a fit question before sending a link.",
    active: true
  },
  {
    id: "blip-follow-up",
    track: "blip",
    channel: "email",
    stage: "follow_up",
    title: "Blip follow-up",
    template:
      "Hi [Name], just following up. If growth systems are not a priority right now, no worries. If you are working on offer clarity, early customers, or startup operations, I can send the most relevant Blip overview.",
    explanation: "Respectful follow-up with a clear opt-out and a relevant reason to continue.",
    active: true
  },
  {
    id: "blip-closing",
    track: "blip",
    channel: "email",
    stage: "closing",
    title: "Blip closing ask",
    template:
      "Based on what you shared, Blip may be a fit for [specific need]. Would you like to take the next step and review the official offer page here: [Blip link]?",
    explanation: "Connects the ask to the prospect's stated need and uses the official link.",
    active: true
  },
  {
    id: "chromonno-buyer-cold",
    track: "chromonno",
    channel: "instagram",
    stage: "cold",
    title: "Chromonno clothing buyer outreach",
    template:
      "Hi [Name], I thought your audience/shop/community might fit Chromonno's creative clothing collection. Would you be open to seeing the catalog and sharing what styles your customers usually like?",
    explanation: "Asks for permission and starts with audience fit.",
    active: true
  },
  {
    id: "chromonno-follow-up",
    track: "chromonno",
    channel: "whatsapp",
    stage: "follow_up",
    title: "Chromonno follow-up",
    template:
      "Hi [Name], following up on Chromonno. I can send a quick product view if you are interested. No pressure - I only want to share it if the style fits your audience.",
    explanation: "Keeps pressure low and confirms fit before sending more.",
    active: true
  },
  {
    id: "chromonno-closing",
    track: "chromonno",
    channel: "email",
    stage: "closing",
    title: "Chromonno closing ask",
    template:
      "If this collection fits your audience, the next step is to review the official brand page and choose the product direction you want to move forward with: [Chromonno link].",
    explanation: "Uses the official brand page and asks for a clear next step.",
    active: true
  },
  {
    id: "objection-samples",
    track: "chromonno",
    channel: "whatsapp",
    stage: "objection",
    title: "Objection: I need to try the product first.",
    template:
      "That makes sense. For Chromonno, physical samples cannot be shipped to candidates because of shipping timing. For outreach, we use the online product visuals, official brand page, brochure, and approved materials. I can still guide you through the product details clearly.",
    explanation: "Answers directly without inventing sample access.",
    active: true
  },
  {
    id: "objection-joining-fee",
    track: "both",
    channel: "email",
    stage: "objection",
    title: "Objection: Is there a joining fee?",
    template:
      "No. There is no joining fee and no purchase requirement. This is performance-based. The focus is on finding real prospects and valid conversions.",
    explanation: "States the fee rule clearly without promising income.",
    active: true
  },
  {
    id: "referral-ask",
    track: "both",
    channel: "linkedin",
    stage: "referral",
    title: "Referral ask",
    template:
      "Thank you. Is there one founder, buyer, or organization you know who might also benefit from this? A warm introduction would help me reach the right person respectfully.",
    explanation: "Asks for one relevant introduction instead of mass referrals.",
    active: true
  },
  {
    id: "local-visit",
    track: "both",
    channel: "local_business",
    stage: "cold",
    title: "Local business visit script",
    template:
      "Hi, my name is [Name]. I am part of a business development candidate program for Blip Creative Works and Chromonno. I am learning how to identify real business needs and connect people with the right solution. Is the owner or manager available for a quick question, or is there a better way to contact them?",
    explanation: "Keeps local outreach transparent, brief, and respectful.",
    active: true
  }
];

const channels = Object.keys(channelAdvice) as ScriptTemplate["channel"][];

const channelVariations = channels.flatMap((channel) => {
  const label = channel.replace(/_/g, " ");
  return [
    {
      id: `blip-${channel}-cold`,
      track: "blip" as const,
      channel,
      stage: "cold" as const,
      title: `Blip ${label} cold variation`,
      template:
        "Hi [Name], I noticed [specific detail]. I am in a business development candidate program with Blip Creative Works. Blip helps founders build practical Startup Growth Infrastructure. Is [need/problem] something you are working on now?",
      explanation: channelAdvice[channel],
      active: true
    },
    {
      id: `chromonno-${channel}-cold`,
      track: "chromonno" as const,
      channel,
      stage: "cold" as const,
      title: `Chromonno ${label} cold variation`,
      template:
        "Hi [Name], I noticed [specific detail about audience/shop/style]. Chromonno may fit people who like creative clothing collections. Would it be useful if I sent the official brand page for a quick look?",
      explanation: channelAdvice[channel],
      active: true
    },
    {
      id: `both-${channel}-follow-up`,
      track: "both" as const,
      channel,
      stage: "follow_up" as const,
      title: `Both tracks ${label} follow-up`,
      template:
        "Hi [Name], quick follow-up. If this is not relevant, no worries. If [specific need] is still active, I can send the most useful official page and keep it short.",
      explanation: channelAdvice[channel],
      active: true
    }
  ];
});

export const scriptTemplates: ScriptTemplate[] = [...baseScripts, ...channelVariations];

export const termsChecklist = [
  "I understand there is no joining fee.",
  "I understand there is no purchase requirement.",
  "I understand compensation is performance-based.",
  "I agree not to spam, harass, or misrepresent the company.",
  "I agree not to make fake promises, fake discounts, fake guarantees, or unauthorized claims.",
  "I agree to handle prospect/contact data responsibly.",
  "I agree to the privacy notice.",
  "I agree to the candidate code of conduct.",
  "If I am under the legal working age in my location, I confirm I have the required permission and will follow local laws."
];

export const legalCopy = {
  terms:
    "There is no joining fee and no purchase requirement. Compensation is performance-based and only applies to verified conversions. Candidates must not misrepresent Blip Creative Works, Chromonno, or their role. Candidates must not make fake promises, fake discounts, fake guarantees, unauthorized claims, guaranteed income claims, or guaranteed results claims. Candidates must respect opt-outs, handle prospect data responsibly, and submit honest reports.",
  privacy:
    "Candidate submissions, uploaded evidence, prospect trackers, and activity reports may be reviewed by admins and managers for evaluation, verification, coaching, and commission review. Uploaded files should only contain information needed to verify work. Do not upload sensitive personal data unless it is required and appropriate.",
  conduct:
    "Be honest, respectful, and professional. Do not spam. Do not pressure people. Do not use fake urgency. Do not contact people again after they say no. If you are under the legal working age in your location, follow local laws and get required permission."
};
