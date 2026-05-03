import type { Timestamp } from "firebase/firestore";

export type UserRole = "candidate" | "admin" | "manager";
export type Track = "blip" | "chromonno";
export type OfferFit = Track | "both" | "unclear";
export type RoleLabel =
  | "Business Development Associate"
  | "Startup Partnership Associate"
  | "Growth Partner"
  | "Account Executive"
  | "Sales / referral partner";

export type CandidateStatus =
  | "invited"
  | "terms_pending"
  | "training"
  | "active_test"
  | "final_submitted"
  | "passed"
  | "failed"
  | "pending"
  | "hired";

export type UserProfile = {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  createdAt: Timestamp;
  lastLoginAt: Timestamp;
  disabled?: boolean;
};

export type Candidate = {
  uid: string;
  fullName: string;
  email: string;
  phone?: string;
  location?: string;
  ageRange?: "under_18" | "18_plus" | "prefer_not_to_say";
  roleLabel: RoleLabel;
  selectedTracks: Track[];
  status: CandidateStatus;
  testStartDate?: Timestamp;
  currentTestDay?: number;
  termsAcceptedAt?: Timestamp;
  privacyAcceptedAt?: Timestamp;
  assignedManagerId?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

export type TrainingModule = {
  id: string;
  title: string;
  minutes: number;
  body: string[];
  checklist: string[];
  keyActions?: string[];
  practice?: string[];
  passStandard?: string;
  redFlags?: string[];
};

export type TrainingProgress = {
  candidateId: string;
  moduleId: string;
  completed: boolean;
  completedAt?: Timestamp;
  quizScore?: number;
};

export type ProspectStatus =
  | "sourced"
  | "contacted"
  | "replied"
  | "qualified"
  | "follow_up"
  | "closed"
  | "not_fit"
  | "lost";

export type Prospect = {
  id?: string;
  candidateId: string;
  name: string;
  company: string;
  website?: string;
  contact: string;
  channel: string;
  need: string;
  offerFit: OfferFit;
  messageSent?: string;
  reply?: string;
  status: ProspectStatus;
  nextFollowUp?: string;
  track?: OfferFit;
  dateSourced?: Timestamp | string;
  dateContacted?: Timestamp | string;
  lastContactDate?: Timestamp | string;
  followUpCount?: number;
  conversationQualityScore?: number;
  conversionAmount?: number;
  proofLink?: string;
  notes?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
};

export type DailyReport = {
  id?: string;
  candidateId: string;
  testDay: number;
  date: string;
  prospectsSourced: number;
  peopleContacted: number;
  conversations: number;
  conversions: number;
  bestChannel?: string;
  biggestObjection?: string;
  whatWorked?: string;
  needsHelp?: string;
  proofFiles?: string[];
  trackerFile?: string;
  status: "submitted" | "approved" | "needs_correction" | "rejected";
  managerNotes?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
};

export type Conversion = {
  id?: string;
  candidateId: string;
  prospectId?: string;
  prospectName: string;
  company?: string;
  track: Track;
  conversionType: "transaction" | "commitment" | "partnership" | "usage_intent";
  amount?: number;
  evidenceFiles?: string[];
  evidenceLinks?: string[];
  notes?: string;
  status: "submitted" | "verified" | "rejected" | "disputed";
  verifiedBy?: string;
  verifiedAt?: Timestamp;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
};

export type Commission = {
  id?: string;
  candidateId: string;
  conversionId: string;
  track: Track;
  grossAmount?: number;
  rate: number;
  estimatedAmount?: number;
  approvedAmount?: number;
  status: "draft" | "submitted" | "pending_verification" | "approved" | "paid" | "rejected" | "disputed";
  adminNotes?: string;
  paidAt?: Timestamp;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
};

export type ContentBlock = {
  id?: string;
  key: string;
  title: string;
  body: string;
  section: string;
  version: number;
  published: boolean;
  updatedBy: string;
  updatedAt?: Timestamp;
};

export type ScriptTemplate = {
  id: string;
  track: "blip" | "chromonno" | "both";
  channel:
    | "linkedin"
    | "email"
    | "whatsapp"
    | "instagram"
    | "product_hunt"
    | "indie_hackers"
    | "startup_directory"
    | "local_business"
    | "door_to_door";
  stage: "cold" | "follow_up" | "objection" | "closing" | "referral";
  title: string;
  template: string;
  explanation: string;
  active: boolean;
};

export type PortalSettings = {
  blipUrl: string;
  chromonnoUrl: string;
  officialEmail: string;
  publicAppUrl?: string;
  commissionRates: Record<Track, number>;
  dailyTargets: {
    prospectsSourced: number;
    peopleContacted: number;
    conversations: number;
    conversions: number;
  };
  aiHelperEnabled: boolean;
  inviteOnlyMode: boolean;
  trackNames: Record<Track, string>;
};

export type GenerateMessageInput = {
  track: "blip" | "chromonno" | "both";
  channel: string;
  stage: "cold" | "follow_up" | "objection" | "closing" | "referral";
  prospectName?: string;
  company?: string;
  website?: string;
  knownDetail?: string;
  need?: string;
  tone?: "professional" | "friendly" | "short" | "direct";
  language?: string;
};

export type GenerateMessageOutput = {
  message: string;
  subjectLine?: string;
  personalizationUsed: string[];
  whyItWorks: string;
  safetyWarnings: string[];
  nextStepSuggestion: string;
};
