import { initializeApp, applicationDefault, cert, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { FieldValue, getFirestore } from "firebase-admin/firestore";
import {
  dailyPlan,
  defaultSettings,
  legalCopy,
  localOutreachGuidance,
  prospectingResources,
  scriptTemplates,
  termsChecklist,
  trainingModules
} from "../src/data/defaults";

const projectId = process.env.FIREBASE_PROJECT_ID || process.env.GCLOUD_PROJECT || "demo-blip-portal";

if (!getApps().length) {
  if (process.env.FIRESTORE_EMULATOR_HOST) {
    initializeApp({ projectId });
  } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
    initializeApp({
      credential: cert(JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON)),
      projectId
    });
  } else {
    initializeApp({
      credential: applicationDefault(),
      projectId
    });
  }
}

const db = getFirestore();
const auth = getAuth();

async function setBlock(key: string, title: string, section: string, body: string) {
  await db.doc(`contentBlocks/${key}`).set(
    {
      key,
      title,
      section,
      body,
      version: 1,
      published: true,
      updatedBy: "seed",
      updatedAt: FieldValue.serverTimestamp()
    },
    { merge: true }
  );
}

async function seedSettings() {
  await db.doc("settings/portal").set(
    {
      ...defaultSettings,
      updatedAt: FieldValue.serverTimestamp()
    },
    { merge: true }
  );
}

async function seedContent() {
  await setBlock(
    "welcome",
    "Welcome and role explanation",
    "welcome",
    "Prove yourself in 7 days. Learn the offers, choose your track, build a qualified prospect list, contact people respectfully, report clearly, and show proof of valid conversions."
  );
  await setBlock("terms", "Terms", "legal", legalCopy.terms);
  await setBlock("privacy", "Privacy notice", "legal", legalCopy.privacy);
  await setBlock("code-of-conduct", "Candidate code of conduct", "legal", legalCopy.conduct);
  await setBlock("terms-checklist", "Terms checklist", "legal", termsChecklist.join("\n"));
  await setBlock("daily-plan", "7-day daily plan", "training", dailyPlan.map((day) => `Day ${day.day}: ${day.title}\n${day.tasks.join("\n")}`).join("\n\n"));
  await setBlock("prospecting-resources", "Prospecting resources", "resources", prospectingResources.map((item) => `${item.title}: ${item.url}`).join("\n"));
  await setBlock("local-outreach", "Local outreach guidance", "resources", localOutreachGuidance.join("\n"));

  for (const module of trainingModules) {
    await setBlock(
      `training-${module.id}`,
      module.title,
      "training",
      [...module.body, "", "Checklist:", ...module.checklist].join("\n")
    );
  }
}

async function seedScripts() {
  const batch = db.batch();
  for (const script of scriptTemplates) {
    batch.set(db.doc(`scriptTemplates/${script.id}`), script, { merge: true });
  }
  await batch.commit();
}

async function seedAdmin() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const adminUid = process.env.ADMIN_UID;

  if (!adminEmail && !adminUid) {
    console.log("No ADMIN_EMAIL or ADMIN_UID provided. Skipping first admin user.");
    return;
  }

  let uid = adminUid;
  if (!uid && adminEmail && adminPassword) {
    try {
      const user = await auth.getUserByEmail(adminEmail);
      uid = user.uid;
    } catch {
      const user = await auth.createUser({
        email: adminEmail,
        password: adminPassword,
        displayName: "Portal Admin",
        emailVerified: true
      });
      uid = user.uid;
    }
  }

  if (!uid) {
    console.log("ADMIN_UID was not provided and ADMIN_PASSWORD is missing. Skipping admin auth creation.");
    return;
  }

  await db.doc(`users/${uid}`).set(
    {
      uid,
      email: adminEmail || "",
      displayName: "Portal Admin",
      role: "admin",
      createdAt: FieldValue.serverTimestamp(),
      lastLoginAt: FieldValue.serverTimestamp()
    },
    { merge: true }
  );
  console.log(`Seeded admin user profile: ${uid}`);
}

async function main() {
  await seedSettings();
  await seedContent();
  await seedScripts();
  await seedAdmin();
  console.log("Seed complete.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
