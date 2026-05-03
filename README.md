# Blip Creative Works x Chromonno Onboarding Portal

Production-ready Firebase + React portal for accepted Business Development Associate, Startup Partnership Associate, Growth Partner, Account Executive, and sales / referral partner candidates.

The candidate experience is built around one action: **Start the 7-day test.**

## Stack

- React + TypeScript + Vite
- Tailwind CSS
- Firebase Authentication, Firestore, Storage, Hosting, Cloud Functions
- React Hook Form + Zod
- SheetJS CSV/XLSX tracker import/export
- Recharts admin analytics
- Vitest + React Testing Library

## Firebase Project Setup

1. Create a Firebase project in the Firebase console.
2. Enable Authentication providers:
   - Email/password
   - Google
3. Enable Cloud Firestore in production mode.
4. Enable Firebase Storage.
5. Enable Firebase Hosting.
6. Enable Cloud Functions.
7. Enable App Check for the web app. Use reCAPTCHA v3 for the frontend and enforce App Check for production services after local testing.

Copy `.firebaserc.example` to `.firebaserc` and set your project ID.

## Environment Variables

Copy `.env.example` to `.env.local` and fill in Firebase web app values.

Required public defaults:

- `VITE_BLIP_URL=https://gsia.blipcreativeworks.store/`
- `VITE_CHROMONNO_URL=https://payhip.com/Chromonno`
- `VITE_OFFICIAL_EMAIL=ceo@blipcreativeworks.store`

For local emulators, set:

```bash
VITE_USE_FIREBASE_EMULATORS=true
```

For the AI helper, store the provider key only in backend secrets:

```bash
firebase functions:secrets:set AI_API_KEY
firebase functions:config:set ai.model="your-model-if-needed"
```

The function also reads optional environment variables:

- `AI_HELPER_ENABLED`
- `AI_PROVIDER_URL`
- `AI_MODEL`
- `FUNCTION_REGION`
- `PUBLIC_APP_URL`

Never put AI provider keys in Vite environment variables.

## Local Development

Install dependencies:

```bash
npm install
npm --prefix functions install
```

Run Firebase emulators:

```bash
npm run emulators
```

In another terminal, run the frontend:

```bash
npm run dev
```

Open the Vite URL shown in the terminal.

## Seed Data

Seed settings, content blocks, script templates, resources, daily plan, and optional first admin user:

```bash
FIRESTORE_EMULATOR_HOST=127.0.0.1:8080 FIREBASE_AUTH_EMULATOR_HOST=127.0.0.1:9099 ADMIN_EMAIL=admin@example.com ADMIN_PASSWORD=change-me-now npm run seed
```

For production, authenticate with Google Application Default Credentials or set `GOOGLE_APPLICATION_CREDENTIALS`.

To create the first admin without creating an Auth user:

```bash
ADMIN_UID=existing_firebase_auth_uid ADMIN_EMAIL=admin@example.com npm run seed
```

The admin user is stored in `users/{uid}` with `role: "admin"`.

## Candidate Flow

Candidate routes:

- `/login`
- `/candidate/intake`
- `/candidate/welcome`
- `/candidate/terms`
- `/candidate/training`
- `/candidate/choose-track`
- `/candidate/prospecting`
- `/candidate/scripts`
- `/candidate/ai-helper`
- `/candidate/tracker`
- `/candidate/test`
- `/candidate/daily-report`
- `/candidate/conversions`
- `/candidate/resources`
- `/candidate/final-submit`

Candidates cannot access gated training/test tools until terms are accepted. The test dashboard blocks the 7-day test start until the terms gate is complete.

## Admin Flow

Admin routes:

- `/admin`
- `/admin/candidates`
- `/admin/candidates/:id`
- `/admin/conversions`
- `/admin/commissions`
- `/admin/content`
- `/admin/settings`

Admins can invite candidates, review progress, inspect trackers, approve or reject daily reports, verify conversions, approve or reject commissions, add manager notes, score candidates, change statuses, edit content, and update settings.

## Inviting Candidates

Use `/admin/candidates` to create invite records. The invite link points to `/login?invite=...`.

Accepted candidates can create or sign in to an account, complete intake, accept terms, choose tracks, and begin onboarding. For stricter production invite enforcement, add token validation to the login/intake flow and keep `inviteOnlyMode` enabled in settings.

## Tracker Import/Export

The tracker supports CSV and XLSX.

Required columns:

- name
- company
- website
- contact
- channel
- need
- offer fit
- message sent
- reply
- status
- next follow-up

Optional columns:

- track
- date sourced
- date contacted
- last contact date
- follow-up count
- conversation quality score
- conversion amount
- proof link
- notes

Imports validate headers, show row errors, deduplicate by contact + company, preview rows, and store valid prospects in Firestore.

## Security

Included files:

- `firestore.rules`
- `storage.rules`

Security model:

- Candidates read and write only their own profile, progress, prospects, reports, conversions, commissions, notes, and submissions.
- Candidates cannot edit admin-only score, risk, manager owner, verification, approval, paid, or rejected states.
- Admins and managers can review and update all operational records.
- Published content is readable by signed-in candidates.
- Draft content is admin-only.
- Storage uploads are scoped to `candidates/{candidateId}/...`.
- Storage accepts safe document/image formats only.
- AI keys are backend-only.

App Check is initialized in the client when `VITE_ENABLE_APP_CHECK=true` and `VITE_FIREBASE_APP_CHECK_RECAPTCHA_KEY` is set. Enforce App Check in Firebase after emulator/local QA.

## Testing

Run:

```bash
npm run test
npm run build
npm run functions:build
```

Tests cover seed defaults and tracker validation. Add route/component tests as the portal grows.

## Deployment

### Firebase Hosting

Build and deploy:

```bash
npm run build
npm run functions:build
firebase deploy
```

Firebase Hosting rewrites all routes to `index.html`, so React Router works on direct links.

### GitHub Pages

This repo includes `.github/workflows/pages.yml`. On pushes to `main`, GitHub Actions installs dependencies, runs tests, builds the Vite app, and deploys `dist` to GitHub Pages.

For project Pages, the workflow sets:

- `VITE_BASE_PATH=/blipcreativeworks/`
- `VITE_ROUTER_MODE=hash`
- `VITE_PUBLIC_APP_URL=https://iriszimmerfrau-collab.github.io/blipcreativeworks`

Hash routing avoids direct-link 404s on GitHub Pages.

## Updating Content

Use `/admin/content` to edit content blocks. Each update archives the previous content into `contentBlockVersions` and increments the version. Use `/admin/settings` for official links, email, commission rates, daily targets, AI helper status, track names, and invite mode.

## Commission Rules

- Blip Creative Works qualified conversions: 20% performance incentive.
- Chromonno qualified conversions: 10% performance incentive.
- No joining fee.
- No purchase required.
- No guaranteed income.
- Admin verification and approval are required.
