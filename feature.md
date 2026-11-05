# Neurobix LMS — Missing Features & Work Backlog

Shared to-do list for anyone (or any AI chat) working on this repo. Pick an item, build it, tick
it off here in the same commit. Last reviewed: **6 Nov 2026**.

---

## 0. Read this first — how this repo works

| Branch | What lives there | Deploys |
|---|---|---|
| `main` | UI (`client/`) running on **sample data** only | GitHub Pages — https://lch99.github.io/Neurobix/ (every push to `main`) |
| `pre-release` | Everything on `main` **plus** the backend (`server/`, Express + Sequelize + MySQL) | Nothing yet |

**Rules**
1. **Backend work goes on `pre-release`.** Never put `server/` changes on `main`.
2. **UI changes must also reach `main`** so GitHub Pages shows the latest UI. Commit `client/` changes
   separately from `server/` changes so they can be moved to `main` on their own.
3. **GitHub Pages must never crash.** It builds with `VITE_USE_MOCK=true` and reads data from
   `client/src/data/mockDb.js`. Any new API call a screen makes needs a matching route in
   `mockApiRequest()` in that file, or the Pages site breaks. Before pushing to `main`, build the way
   the deploy does and click through every role and tab:
   ```bash
   cd client && VITE_USE_MOCK=true npm run build && npx vite preview   # → http://localhost:4173/Neurobix/
   ```
4. Screens talk to data only through `apiRequest()` (`client/src/lib/api.js`) and the account helpers
   in `client/src/lib/accounts.js` — never import `mockDb` from a page or component.
5. Backend: new tables = new migration in `server/src/db/migrations/`; keep the demo seed
   (`server/src/db/seeders/20261105000000-demo-data.js`) in step with `mockDb.js`; put role rules in
   `server/src/lib/access.js`; add tests to `server/test/api.test.js` (`npm run db:reset && npm test`).
6. Product rules from the README still apply: self-host all assets (no Google CDN), past-year papers
   stay hidden until assigned, regular classes enforce lesson order, flash card libraries are
   per-student, leaderboards are optional per assessment, Stripe only for Singapore, AI exam is
   rule-based only, teachers are always "Mr/Ms + Surname".

**Run it locally:** see README §12. Demo logins: student `ahmad2026` / PIN `1234`; parent
`parent1@neurobix.com`, teacher `sarah.tan@neurobix.com`, admin `admin@neurobix.com` — all `password123`.

---

## 1. What already works on the live API (`pre-release`)

Auth (login, single session, staff idle timeout, forced first-login credential change, forgot
password), admin user list/create/reset, parent add child/reset PIN, terms, classes (incl. terms,
slots, co-teachers, archive, admin force-open), lessons + lesson detail, schedules, flash card decks,
student flash card library + study progress, assessments + questions (all 5 types), assessment
attempts scored on the server + leaderboard, class quizzes + quiz cards, class rosters.

Everything below is **not** done yet.

---

## 2. Phase 1 — screens still showing sample data in Live API mode

Each item: where the sample data lives now → what's needed.

### 2.1 Lesson progress & sequential unlocking ⭐ highest priority
- [ ] **Track lesson completion.** Finishing a video/reading/flash card/activity lesson only sets local
  state (`LessonDetail.jsx` `setCompleted(true)`). Table `lesson_progress` already exists (migration
  `20260612000006`) — needs a model, `GET/POST /api/lesson-progress`, and a mock route.
- [ ] **Enforce lesson order on the server** for regular classes (README rule 3). Today locks come from
  the static curriculum: `LOCKED_IDS` in `client/src/data/lessons.js`, computed from `ALL_LESSONS`.
  Compute from real progress + `lessons.sequence_order`; reject opening a locked lesson in the API.
- [ ] **Replace `ALL_LESSONS` / `TERMS`** (`client/src/data/lessons.js`) in `LessonBrowser`,
  `WeeklySchedule`, `StudentDashboard`, `TeacherDashboard`, `AdminDashboard` with `/api/lessons` +
  `/api/terms` (the terms API exists but no screen calls it).
- [ ] **Teacher per-lesson force-open** is saved in the browser only (`setForceOpen` /
  `nb_force_open_lesson_ids` in `data/lessons.js`) — needs a column/table + endpoint.
- [ ] **Quiz completions** are browser-only (`recordQuizCompletion` / `nb_quiz_completions`) — store them.
- [ ] Teacher Schedule tab "completion rate" is always `0` (`schedules.controller.js`) — calculate from
  lesson progress.

### 2.2 Points, badges, streaks, shop & rewards
- [ ] **Points.** Navbar and dashboard show a hard-coded `1240` (`StudentDashboard.jsx` `useState(1240)`,
  `LessonDetail.jsx`, `LessonsPage.jsx`). Tables `student_points` + `points_ledger` exist (migration
  `20260612000008`) — award points on lesson completion and on passing an assessment
  (`assessments.reward_points` is stored but never credited), expose `GET /api/points`.
- [ ] **Badges.** Student badges are a static array (`StudentDashboard.jsx` `BADGES`,
  `BADGE_THRESHOLDS`). Tables `badges` + `student_badges` exist; the admin `BadgeModal`
  (`AdminDashboard.jsx`) is built but never shown, and `/api/badges` only exists in the mock. Needs
  model + CRUD API + automatic awarding by `criteria_type` (lessons_completed, perfect_score,
  streak_days, points_total, assessments_completed).
- [ ] **Streaks** (7-day streak etc.) — nothing records daily activity yet.
- [ ] **Shop / redeem rewards** — `REDEEM_ITEMS` static, redeeming only updates local state
  (`setRedeemedIds`). Needs a rewards catalogue + redemption that spends points.

### 2.3 Certificates
- [ ] Table `certificates` exists (migration `20260612000009`) but there's no model/API. Issue a
  certificate when a student completes every lesson + passes every assessment in a class; certificate
  number format `NM-YYYY-NNNN`; list/download for student and parent; Admin "Certificates this week".

### 2.4 Student dashboard
- [ ] **Self-enrol in open/extra classes** — the Enrol/Leave button only changes local state
  (`StudentDashboard.jsx` ~line 329). Wire to `POST /api/students` (exists, staff-only today) with a
  student self-enrol path (`enrolled_by: 'self'`), seat limit from `classes.slots`, extra classes only.
- [ ] Home tab `SUBJECTS`, `RECENT_LESSONS` are static — derive from enrollments + lesson progress.
- [ ] Navbar name/avatar hard-coded to "Ahmad bin Hassan" (`StudentDashboard.jsx`, `LessonDetail.jsx`,
  `LessonsPage.jsx`) — use the signed-in user.

### 2.5 Parent dashboard
- [ ] Children list is the static `CHILDREN` array (`ParentDashboard.jsx`). `GET /api/parent/children`
  exists — load real children, then fill subjects/progress, points, streak, badges, recent activity,
  upcoming deadlines from the new progress/points/badges APIs. Assessment results already use real
  attempts but only for student id 1 (hard-coded filter `r.studentId === 1`).
- [ ] **Guardians** ("add another guardian") are local state only (`AddGuardianModal`) — needs a
  guardian invite/link flow (another parent account linked via `parent_students`).
- [ ] Messages tab (teacher notes) — no messaging tables/API yet.
- [ ] Navbar name hard-coded "Encik Hassan" — use the signed-in parent's name.

### 2.6 Teacher dashboard
- [ ] Overview stats, "Students needing attention", class progress bars — static numbers; compute
  from rosters + lesson progress + attempts.
- [ ] Admin announcements panel (`ADMIN_ANNOUNCEMENTS`) — static; needs an announcements table/API
  (admin writes, teachers read).
- [ ] Co-teachers are stored as names only (`classes.co_teachers` JSON, options from
  `CO_TEACHER_OPTIONS`) — make them real teacher user ids with access to the class.
- [ ] "Remind →" for at-risk students does nothing — hook to email/notifications (see §3).

### 2.7 Admin dashboard
- [ ] Overview stats (132 users, 98 students…), Recent Activity, "Lessons by Type", "Certificates this
  week" — static; compute from the DB (and an activity log table for the feed).
- [ ] Users table **Edit** and **Delete** buttons do nothing. `PATCH /api/users/:id` (name, status,
  level) exists — build the edit modal; decide delete = deactivate (`status: 'inactive'`) vs hard delete.
- [ ] Reset password is offered for parents only — add for teachers; students' PIN reset via admin.
- [ ] Assign a student to a parent / class from the Users tab after creation.
- [ ] Reports tab: 6 "Download PDF →" buttons do nothing — build report queries + PDF export.

### 2.8 Content authoring gaps
- [ ] **Video upload / video URL** — lessons have `video_url` but no upload; plan is AWS S3 /
  DigitalOcean Spaces + Cloudflare CDN. Same for flash card images (`front_image_url`/`back_image_url`)
  and assessment image questions (currently data: URIs only).
- [ ] Reading lessons: editor for `readingSections`, and lesson `objectives` / `memoryTip` (API accepts
  them; the teacher lesson modal doesn't have fields for them).
- [ ] Reordering lessons / cards / questions (API accepts `sequenceOrder`, no drag-to-reorder UI —
  note: drag-and-drop *games* are out of scope, reordering in the editor is fine).
- [ ] Mem Portal tab — "Coming Soon" placeholder for all roles.

---

## 3. Backend hardening (before any real deployment)

- [ ] **Email delivery** (SendGrid for SG): `server/src/lib/mailer.js` only logs in dev. Needed for
  forgot-password, deadline reminders (`schedules.notify_email`), "Remind →", results notifications.
- [ ] **Rate limiting** on `/api/auth/login` and `/api/auth/forgot-password` (brute force / spam).
- [ ] Enforce `must_change_credential` on the server (today only the UI blocks other screens).
- [ ] Scheduled publishing currently flips status lazily when read — add a job if emails must go out
  at publish time.
- [ ] Student/parent `GET /api/assessments` includes correct answers (needed for instant feedback in
  the current UI). Consider answer checking per question on the server for graded assessments.
- [ ] Audit log / activity feed table (also feeds Admin "Recent Activity").
- [ ] CI: run `server` tests against a MySQL service on push to `pre-release`.
- [ ] Production config: `JWT_SECRET`, `CORS_ORIGIN`, `DATABASE_URL`, HTTPS, backups.

---

## 4. Phase 2 — Monetisation & live classes (not started)

- [ ] Stripe (Singapore only) — Monthly / Yearly / Per-Subject subscriptions, auto-renewal, no free trial.
- [ ] Alipay / WeChat Pay (China) — Phase 2 only, don't build earlier.
- [ ] Gate content by active subscription.
- [ ] Agora live video — teacher hosts, students join, parents excluded; optional recording.

## 5. Phase 3 — AI exam, server & delivery (not started)

- [ ] AI Auto Exam (rule-based, no ML, no external AI calls): trigger at 100% class completion, find
  weak topics from attempt history, assign a past-year paper (`assessments.is_past_year_paper`),
  auto-grade, notify student/parent/teacher; teacher can override.
- [ ] Server setup & deployment of `server/` + MySQL (Singapore hosting; no China-hosted servers).
- [ ] China CDN (Alibaba) for assets.
- [ ] Landing / marketing page.
- [ ] QA pass and final delivery.

---

## 6. Known bugs & tech debt

- [x] ~~Mem Portal tab blanked the page for teacher/admin/parent (`ComingSoon` not imported)~~ — fixed 6 Nov 2026.
- [ ] `npm run lint` in `client/` reports ~35 pre-existing problems (mostly `react-hooks/*`:
  set-state-in-effect, immutability, missing deps; `Date.now` during render in `StudySet.jsx`;
  unused `SUBJECT_BADGE`, `BadgeModal`). None crash today, but worth cleaning up.
- [ ] Main JS bundle is >500 kB — add code-splitting per dashboard.
- [ ] Root `package.json` duplicates the backend dependencies of `server/package.json`.
