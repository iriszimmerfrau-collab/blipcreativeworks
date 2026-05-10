import * as XLSX from "xlsx";
import type { OfferFit, Prospect, ProspectStatus } from "../types";

export const requiredTrackerColumns = [
  "name",
  "company",
  "website",
  "contact",
  "channel",
  "need",
  "offer fit",
  "message sent",
  "reply",
  "status",
  "next follow-up"
];

export const optionalTrackerColumns = [
  "track",
  "date sourced",
  "date contacted",
  "last contact date",
  "follow-up count",
  "conversation quality score",
  "conversion amount",
  "proof link",
  "notes"
];

export const allTrackerColumns = [...requiredTrackerColumns, ...optionalTrackerColumns];

export type TrackerRowError = {
  row: number;
  field: string;
  message: string;
};

export type ImportedProspect = Omit<Prospect, "candidateId" | "createdAt" | "updatedAt" | "id">;

export type ImportPreview = {
  validRows: ImportedProspect[];
  errors: TrackerRowError[];
  missingHeaders: string[];
  duplicateKeys: string[];
};

const prospectStatuses: ProspectStatus[] = ["sourced", "contacted", "replied", "qualified", "follow_up", "closed", "not_fit", "lost"];
const offerFits: OfferFit[] = ["blip", "chromonno", "both", "unclear"];

const fieldMap: Record<string, keyof ImportedProspect> = {
  name: "name",
  company: "company",
  website: "website",
  contact: "contact",
  channel: "channel",
  need: "need",
  "offer fit": "offerFit",
  "message sent": "messageSent",
  reply: "reply",
  status: "status",
  "next follow-up": "nextFollowUp",
  track: "track",
  "date sourced": "dateSourced",
  "date contacted": "dateContacted",
  "last contact date": "lastContactDate",
  "follow-up count": "followUpCount",
  "conversation quality score": "conversationQualityScore",
  "conversion amount": "conversionAmount",
  "proof link": "proofLink",
  notes: "notes"
};

export function normalizeHeader(header: string) {
  return header.trim().toLowerCase().replace(/[_-]+/g, " ").replace(/\s+/g, " ");
}

function readCell(row: Record<string, unknown>, header: string) {
  const normalizedHeader = normalizeHeader(header);
  const foundKey = Object.keys(row).find((key) => normalizeHeader(key) === normalizedHeader);
  const value = foundKey ? row[foundKey] : undefined;
  return value === undefined || value === null ? "" : String(value).trim();
}

function normalizeOfferFit(value: string): OfferFit {
  const normalized = normalizeHeader(value);
  if (normalized === "blip creative works") return "blip";
  if (normalized === "blip chromonno" || normalized === "blip + chromonno") return "both";
  if (offerFits.includes(normalized as OfferFit)) return normalized as OfferFit;
  return "unclear";
}

function normalizeStatus(value: string): ProspectStatus {
  const normalized = normalizeHeader(value).replace(/\s+/g, "_");
  if (prospectStatuses.includes(normalized as ProspectStatus)) return normalized as ProspectStatus;
  return "sourced";
}

function optionalNumber(value: string) {
  if (!value) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export function validateTrackerRows(rows: Record<string, unknown>[]): ImportPreview {
  const headers = rows[0] ? Object.keys(rows[0]).map(normalizeHeader) : [];
  const missingHeaders = requiredTrackerColumns.filter((header) => !headers.includes(normalizeHeader(header)));
  const errors: TrackerRowError[] = [];
  const validRows: ImportedProspect[] = [];
  const duplicateKeys: string[] = [];
  const seen = new Set<string>();

  rows.forEach((row, index) => {
    const rowNumber = index + 2;
    const rowErrors: TrackerRowError[] = [];

    requiredTrackerColumns.forEach((header) => {
      if (!readCell(row, header)) {
        rowErrors.push({ row: rowNumber, field: header, message: `${header} is required.` });
      }
    });

    const contact = readCell(row, "contact");
    const company = readCell(row, "company");
    const dedupeKey = `${contact.toLowerCase()}|${company.toLowerCase()}`;
    if (contact && company && seen.has(dedupeKey)) {
      duplicateKeys.push(dedupeKey);
      rowErrors.push({ row: rowNumber, field: "contact", message: "Duplicate contact + company in upload." });
    }
    seen.add(dedupeKey);

    if (rowErrors.length) {
      errors.push(...rowErrors);
      return;
    }

    validRows.push({
      name: readCell(row, "name"),
      company,
      website: readCell(row, "website"),
      contact,
      channel: readCell(row, "channel"),
      need: readCell(row, "need"),
      offerFit: normalizeOfferFit(readCell(row, "offer fit")),
      messageSent: readCell(row, "message sent"),
      reply: readCell(row, "reply"),
      status: normalizeStatus(readCell(row, "status")),
      nextFollowUp: readCell(row, "next follow-up"),
      track: normalizeOfferFit(readCell(row, "track")),
      dateSourced: readCell(row, "date sourced"),
      dateContacted: readCell(row, "date contacted"),
      lastContactDate: readCell(row, "last contact date"),
      followUpCount: optionalNumber(readCell(row, "follow-up count")),
      conversationQualityScore: optionalNumber(readCell(row, "conversation quality score")),
      conversionAmount: optionalNumber(readCell(row, "conversion amount")),
      proofLink: readCell(row, "proof link"),
      notes: readCell(row, "notes")
    });
  });

  return { validRows, errors, missingHeaders, duplicateKeys };
}

export async function parseTrackerFile(file: File): Promise<ImportPreview> {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array" });
  const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(firstSheet, { defval: "" });
  return validateTrackerRows(rows);
}

export function makeTemplateWorkbook() {
  const worksheet = XLSX.utils.json_to_sheet([
    {
      name: "Alex Founder",
      company: "Example Startup",
      website: "https://example.com",
      contact: "alex@example.com",
      channel: "LinkedIn",
      need: "Offer clarity",
      "offer fit": "blip",
      "message sent": "Short personalized opener",
      reply: "",
      status: "sourced",
      "next follow-up": "",
      track: "blip",
      "date sourced": new Date().toISOString().slice(0, 10),
      "date contacted": "",
      "last contact date": "",
      "follow-up count": 0,
      "conversation quality score": "",
      "conversion amount": "",
      "proof link": "",
      notes: "Replace this sample row."
    }
  ]);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Prospects");
  return workbook;
}

export function trackerTemplateBlob(format: "csv" | "xlsx") {
  const workbook = makeTemplateWorkbook();
  if (format === "csv") {
    const csv = XLSX.utils.sheet_to_csv(workbook.Sheets.Prospects);
    return new Blob([csv], { type: "text/csv;charset=utf-8" });
  }

  const array = XLSX.write(workbook, { type: "array", bookType: "xlsx" });
  return new Blob([array], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
}

function prospectToRow(prospect: Prospect) {
  return Object.fromEntries(
    allTrackerColumns.map((header) => {
      const key = fieldMap[header];
      return [header, prospect[key as keyof Prospect] ?? ""];
    })
  );
}

export function prospectsExportBlob(prospects: Prospect[], format: "csv" | "xlsx") {
  const rows = prospects.map(prospectToRow);
  const worksheet = XLSX.utils.json_to_sheet(rows.length ? rows : [Object.fromEntries(allTrackerColumns.map((header) => [header, ""]))]);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Prospects");

  if (format === "xlsx") {
    const summary = XLSX.utils.json_to_sheet([
      { metric: "Total prospects", value: prospects.length },
      { metric: "Contacted", value: prospects.filter((prospect) => prospect.status === "contacted").length },
      { metric: "Conversations", value: prospects.filter((prospect) => ["replied", "qualified", "follow_up", "closed"].includes(prospect.status)).length },
      { metric: "Closed", value: prospects.filter((prospect) => prospect.status === "closed").length }
    ]);
    XLSX.utils.book_append_sheet(workbook, summary, "Summary");
    const array = XLSX.write(workbook, { type: "array", bookType: "xlsx" });
    return new Blob([array], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  }

  const csv = XLSX.utils.sheet_to_csv(worksheet);
  return new Blob([csv], { type: "text/csv;charset=utf-8" });
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.style.display = "none";
  document.body.appendChild(anchor);
  anchor.click();
  setTimeout(() => {
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  }, 100);
}
