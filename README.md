# NEUROBIX LMS — SYSTEM DOCUMENTATION
**Project README v1.1 | June 2026**

---

**CLIENT:** Neurobix Method Pte Ltd
**ADDRESS:** 6 Raffles Boulevard Rd, #02-34/35, Singapore 039594
**DEVELOPER:** Lee Chee Hoe
**CONTACT:** leecheehoe0620@gmail.com
**SRS:** v1.4 May 2026
**COPYRIGHT:** © 2025 Neurobix Method Pte Ltd. All rights reserved.

---

## 1. PROJECT OVERVIEW

Neurobix LMS is a memory-method-based Learning Management System (LMS) designed for primary school students aged 7–12 (Primary 1 to Primary 6). The platform is built around the Chinese memory technique **记忆法** (Memory Method), helping students memorise academic content more effectively through structured flash cards, quizzes, and spaced repetition.

| | |
|---|---|
| **Primary Market** | Singapore |
| **Planned Expansion** | China (Phase 3) |
| **Language** | English (UI only) |
| **Platform** | Web-based (responsive — desktop and mobile) |

---

## 2. TECHNOLOGY STACK

### Frontend
| | |
|---|---|
| Framework | Vite + React (JSX) |
| Styling | Tailwind CSS v4 (utility-first, custom design tokens) |
| Routing | React Router v7 |
| Build Tool | Vite |

### Backend (`server/` — live, Phase 1 in progress)
| | |
|---|---|
| Server | Node.js + Express v5 (`server/src/index.js`, port 4000) |
| ORM | Sequelize v6 (models + migrations in `server/src/db`) |
| Database | MySQL |
| Auth | JSON Web Tokens (jsonwebtoken), bcrypt for passwords |

**API routes:** `/api/auth`, `/api/classes`, `/api/lessons`, `/api/flashcards`, `/api/quizzes`, `/api/quiz-questions`, `/api/schedules`, `/api/students`, `/api/health`

**Session handling:**
- Each login issues a JWT with a `session_token` stored on the user record — logging in on another device invalidates the previous session (`SESSION_REPLACED`)
- Staff roles (Admin/Teacher/Parent) are auto-logged-out after 10 minutes of inactivity (`SESSION_IDLE_TIMEOUT`); students are exempt
- The client (`AuthContext` + `lib/api.js`) listens for these codes and clears the local session, showing a toast (`SessionToast`)

### Infrastructure & Services
| | |
|---|---|
| File Storage | AWS S3 / DigitalOcean Spaces (videos & assets) |
| CDN — Singapore | Cloudflare CDN |
| CDN — China | Alibaba CDN (planned Phase 3) |
| Payments | Stripe (SG), Alipay / WeChat Pay (China — Phase 2) |
| Live Video | Agora SDK (Phase 2) |
| Email | SendGrid (SG), Alibaba / Tencent Cloud Email (China — Phase 3) |

### Current Backend Dependencies (`package.json`)
**Production:**
- `bcrypt` ^6.0.0
- `cors` ^2.8.6
- `dotenv` ^17.4.2
- `express` ^5.2.1
- `jsonwebtoken` ^9.0.3
- `mysql2` ^3.22.3
- `sequelize` ^6.37.8

**Development:**
- `nodemon` ^3.1.14

> **⚠️ IMPORTANT:** All fonts and JavaScript libraries must be **self-hosted**. Google CDN is blocked in China — never load assets from Google CDN. If student data is stored in China, an ICP licence is required (this is the client's legal responsibility).

---

## 3. USER ROLES & PERMISSIONS

| Role | Created By | Access Level |
|---|---|---|
| **Admin** | System | Full control over all users, classes, lessons, reports, and settings |
| **Teacher** | Admin | Own classes, lessons, students. Can create flash cards, quizzes, schedule lessons, and view student progress. Cannot access other teachers' classes |
| **Student** | Admin | Access assigned lessons, flash cards, quizzes, rewards, and certificates. Can self-enrol in open/extra classes. Cannot host live sessions |
| **Parent** | Admin (optional) | Read-only view of child's data: progress, quiz results, badges, teacher messages. Can download certificates. Excluded from live class sessions |

### Key Rules
- Students can only **self-enrol in Open/Extra classes** — they cannot change their regular class assignment
- **Live sessions:** Teachers host, Students join, Parents are excluded
- **Regular (sequential) classes** enforce lesson order — students cannot skip to a later lesson until earlier ones are completed
- **Extra/Open classes** have no lesson sequence — students access any lesson freely
- **Teacher naming convention:** Mr/Ms + Surname (e.g., "Ms Sarah Tan"). Never use "Cikgu" (a Malaysian term, not used in Singapore context)

---

## 4. APPLICATION ROUTES (URL STRUCTURE)

| Route | Page |
|---|---|
| `/` | Redirects to `/login` |
| `/login` | Login Portal (role selector) |
| `/login/student` | Student login page |
| `/login/staff` | Teacher / Admin / Parent login page |
| `/student` | Student Dashboard |
| `/teacher` | Teacher Dashboard |
| `/admin` | Admin Dashboard |
| `/parent` | Parent Dashboard |
| `/lessons` | Lessons listing page |
| `/lessons/:id` | Individual lesson detail page |

---

## 5. MODULES & FEATURES

### Module 1 — User Management *(Phase 1 — UI complete, mock data)*

Admin can:
- View all users in a searchable table (desktop) or card list (mobile)
- Filter users by name or email
- Add new users via modal form (name, email, role, temporary password)
- View user roles with colour-coded badges
- View user status (Active / Suspended)
- Edit or delete users

**User fields:** Full Name, Email, Role, Status, Join Date

**Role badge colours:**
| Role | Style |
|---|---|
| Admin | Dark green background, white text |
| Teacher | Green background, white text |
| Student | Yellow background, dark text |
| Parent | Olive background, white text |

---

### Module 2 — Classes *(Phase 1 — UI complete, mock data)*

**Two class types:**

**REGULAR CLASS**
- Created by Admin or Teacher
- Students follow a fixed sequential lesson order
- Students cannot skip lessons
- Example: "Primary 4A — Mathematics"

**EXTRA / OPEN CLASS**
- Students self-enrol from the Student Dashboard
- No lesson sequence — students access any lesson freely
- Limited slots available (e.g., 8–15 slots)
- Example: "English Writing Club", "Science Explorers"

**Sample classes in the system:**

| Class | Subject | Teacher | Students | Progress |
|---|---|---|---|---|
| Primary 4A | Mathematics | Ms Sarah Tan | 28 | 67% |
| Primary 4B | Mathematics | Ms Sarah Tan | 25 | 50% |
| Primary 5A | Science | Mr Alif Ibrahim | 30 | 80% |
| Primary 5B | Science | Mr Alif Ibrahim | 27 | 35% |
| Primary 6A | English | Ms Maria Wong | 22 | 90% |

---

### Module 3 — Lessons & Content *(Phase 1 — UI complete, mock data)*

**Lesson types supported:**

| Type | Icon | Description | Storage |
|---|---|---|---|
| Video | 🎬 | MP4 lesson recording | AWS S3 (max 2 GB) |
| Flash Cards | 🃏 | Front/back memory cards with optional hints | — |
| Quiz | 📝 | Auto-graded questions | — |
| Reading | 📄 | PDF or text material | Max 50 MB |

**Lesson statuses:**
| Status | Description |
|---|---|
| Draft | Saved but not visible to students |
| Published | Live and visible to students immediately |
| Scheduled | Hidden until specified release date/time |

**Student lesson statuses:**
| Status | Description |
|---|---|
| Locked | Prerequisite lesson not complete (Regular class only) |
| Pending | Upcoming, not started |
| In Progress | Started but not complete |
| Completed | Fully done |
| Overdue | Deadline passed, not completed |

Teachers upload lessons via the "Upload New Lesson" modal: select type, upload file (video/PDF), set publish status, set release date if scheduled, set optional deadline. Students receive **in-app + email notification** when a lesson goes live.

---

### Module 4 — Flash Cards *(Phase 1 — Core Feature, UI complete)*

This is the **CORE feature** of the Neurobix Method (记忆法).

#### Teacher Side — Flash Card Editor
- Create and manage multiple Flash Card Decks per class/subject
- Each deck has: Title, Class, Subject
- Each card has:
  - **Front** (Question)
  - **Back** (Answer)
  - **Memory Hint** (记忆法) — a mnemonic technique to aid recall
- Cards can be added, edited, or removed within a deck
- **Preview mode:** Interactive card flip viewer (tap to flip)
- Progress dots show current card position in the deck
- Save Deck button with visual confirmation

#### Student Side — Flash Cards Viewer
- Browse decks by subject (Mathematics, English, Science)
- Interactive flip card (tap to reveal answer)
- "Show Memory Hint" button reveals the 记忆法 mnemonic
- Side panel shows all cards in the current deck
- **"Save to My Library"** — students save favourite cards to a personal private collection
- Cards can be removed from the library at any time

**Sample cards:**
| Subject | Front | Back | Memory Hint |
|---|---|---|---|
| Mathematics | What is 7 × 8? | 56 | 7 × 7 = 49, then +7 |
| English | Spell: Beautiful | B-E-A-U-T-I-F-U-L | "Big Elephants Are Ugly" |
| Science | What gas do plants absorb? | Carbon Dioxide (CO₂) | They breathe what we breathe out! |

---

### Module 5 — Quizzes *(Phase 1 — UI complete with interactive engine)*

#### Teacher Side — Quiz Builder
- Create multiple quizzes per class/subject
- Each quiz has: Title, Class, Subject, Pass Mark (%), Leaderboard toggle

**Question types supported:**
| Type | Description |
|---|---|
| MCQ | Multiple choice (4 options, mark correct answer) |
| True / False | Binary choice |
| Fill-in-Blank | Text answer input |
| Image-Based | Upload image + text answer |

**Quiz settings:**
- Pass Mark: configurable per quiz (default 70%)
- Leaderboard: enabled/disabled per quiz (admin/teacher toggle)
- Status: Draft → Published
- Results visible to Student, Teacher, and Parent
- **Auto-graded on submission** — no manual marking required

#### Student Side — Quiz Experience
- View available quizzes with difficulty level (Easy / Medium / Hard)
- Start quiz: one question at a time with progress bar
- Submit answer → immediate correct/wrong feedback shown
- Score shown at end with points earned (e.g., +90 pts)
- Retry quizzes to improve score
- Leaderboard shows class ranking by score and points

**Sample quizzes:**
| Quiz | Class | Questions | Pass Mark |
|---|---|---|---|
| Times Tables Challenge | Primary 4A | 10 | 70% |
| Fractions Basics | Primary 4A | 8 | 60% |

---

### Module 6 — Schedule & Lesson Management *(Phase 1 — UI complete)*

#### Teacher Schedule View
- View all lessons with status filters: **All / Live / Scheduled / Draft**
- "Upcoming Releases" panel: shows scheduled lessons with release times
- "Overdue Deadlines" alert: highlights lessons where deadline has passed
- Completion rate shown for published lessons

**Schedule table columns:** Lesson Title | Class | Status | Release Date | Deadline | Completion % | Edit

**Deadline colour coding:**
| Colour | Meaning |
|---|---|
| Grey | No deadline or far off |
| Amber ⏰ | Due within 3 days |
| Red ⚠️ | Overdue |

#### Student Schedule View
- "My Schedule" page: In Progress / Overdue / Upcoming counts
- Overdue section highlighted in red with days overdue
- In-progress lessons shown with deadline warnings
- Upcoming lessons show release date if not yet available

---

### Module 7 — Progress & Rewards *(Phase 1 — UI complete)*

**Points System:**
- Students earn points for completing lessons and quizzes
- Points displayed in Navbar and on Student Dashboard
- Points history shown as weekly bar chart in Parent Dashboard

**Badges:**
| Badge | Description |
|---|---|
| ⭐ Star Learner | General achievement |
| 🏆 Quiz Champion | Top quiz performance |
| 🔥 7-Day Streak | 7 consecutive days of learning |
| 🧠 Memory Master | Locked — to be earned |
| 📚 Bookworm | Locked — to be earned |
| 🚀 Fast Finisher | Locked — to be earned |

**Learning Streak:** Tracks consecutive days of learning. Displayed prominently on Student Dashboard.

**Leaderboard:** Per-quiz class leaderboard (optional — admin/teacher toggle). Shows rank, name, score %, and total points. Student's own position highlighted in yellow.

**Teacher — "Students Needing Attention":** Students below progress threshold flagged as "at risk" and displayed in a red alert panel on the Teacher Dashboard. Teacher can click "Remind →" to send a reminder.

**Admin Reports Available:**
- Student Progress Report
- Lesson Engagement Report
- Quiz Performance Report
- Certificate Report
- Memory Method Analytics
- Parent Visibility Report

---

### Module 8 — Certificates *(Phase 1 — UI complete with preview modal)*

**Trigger:** Certificate is auto-generated when a student completes **100% of lessons** in a class **AND** passes all associated quizzes.

**Certificate contains:**
- "Certificate of Completion"
- Student full name
- Subject name and class level
- Completion details (all lessons done, all quizzes passed)
- Issue date and certificate number (e.g., NM-2025-0041)
- Neurobix Method branding (dark green gradient, gold/yellow accents)

**Certificate access:**
| Role | Access |
|---|---|
| Student | Preview and Download PDF from Rewards tab |
| Parent | Preview and Download PDF from Parent Dashboard |

Locked/incomplete certificates shown greyed out with a progress bar indicating how far along the student is.

---

### Module 9 — Payment *(Phase 2 — Not yet started)*

**Planned:**
- Stripe for Singapore market
- Alipay / WeChat Pay for China market
- Subscription types: Monthly, Yearly, Per-Subject
- Auto-renewal
- No free trial offered

---

### Module 10 — Live Video *(Phase 2 — Not yet started)*

**Planned:**
- Agora SDK for video streaming
- Teacher hosts the session, Students join
- Parents excluded from live sessions
- Optional session recording

---

### Module 11 — AI Auto Exam *(Phase 3 — Not yet started)*

**Planned (rule-based only — no ML / no AI model training):**
- Trigger: Student reaches 100% completion in a class
- System analyses weak topics from quiz history
- Assigns relevant past year paper automatically
- Auto-grades submitted paper
- Notifies Student, Parent, and Teacher of results
- Teacher can override the AI assignment

> **Critical Rule:** Past year papers are HIDDEN until assigned by AI or Teacher. Never expose papers early under any circumstance.

---

### Modules 12–14 — Server Setup, Maintenance, Landing Page *(Phase 3 — Not yet started)*

---

## 6. DASHBOARD PAGES

### A. Admin Dashboard (`/admin`)
**Tabs:** Overview | Users | Classes | Reports

**Overview tab:**
- Stats: Total Users (132), Students (98), Teachers (12), Active Classes (18)
- Recent Activity feed (registrations, lesson publishes, certs issued, suspensions)
- Lessons by Type bar chart (Video 24, Flash Cards 18, Quiz 15, Reading 10)
- Certificates This Week bar chart (Mon–Sun, Total: 47)

**Users tab:**
- Search bar (filter by name or email)
- Responsive table (desktop) / card list (mobile)
- Columns: Name, Email, Role badge, Status badge, Join Date, Edit/Delete
- "+ Add User" button opens modal (name, email, role, temporary password)

**Classes tab:**
- Grid of class cards (up to 3 per row on desktop)
- Each card shows: Class name, Subject, Teacher, Student count, Progress bar
- "+ New Class" button

**Reports tab:**
- 6 report types listed as clickable cards with "Download PDF →" link each

---

### B. Teacher Dashboard (`/teacher`)
**Tabs:** Overview | Classes | Lessons | Flash Cards | Quiz Builder | Schedule | Students

**Overview tab:**
- Stats: Total Students (83), Active Classes (3), Lessons Live (14), Avg. Progress (66%)
- "Students Needing Attention" alert panel (at-risk students in red with "Remind →")
- Class progress section with per-class progress bars

**Classes tab:**
- Grid of the teacher's assigned classes
- Each card: Class icon, Name, Subject, Student count, Lesson count, Progress bar

**Lessons tab:**
- Responsive table (desktop) / card list (mobile)
- Columns: Title, Class, Type (icon), Status badge, Release Date, Edit
- "+ Add Lesson" button opens "Upload New Lesson" modal

**Flash Cards tab:**
- Deck list with card count and colour bar preview
- Click deck → enter editor (add/edit/remove cards with front/back/hint)
- Preview mode: interactive flip card viewer
- "+ New Deck" button opens creation modal

**Quiz Builder tab:**
- Quiz list with status, question count, pass mark, leaderboard indicator
- Click quiz → enter question editor (MCQ, True/False, Fill-in-Blank, Image-Based)
- Set pass mark and leaderboard toggle per quiz
- Publish quiz from draft status
- "+ New Quiz" button opens creation modal

**Schedule tab:**
- Lesson schedule table with status filters (All / Live / Scheduled / Draft)
- Upcoming releases panel (blue) and overdue deadlines alert (red)
- Deadline colour coding: grey → amber (≤3 days) → red (overdue)
- Notification reminder panel for student alerts

**Students tab:**
- Students grouped by class (collapsible sections)
- Search bar to find any student across classes
- Per-class stats: Avg. progress, at-risk count, overall progress bar
- Per-student: Name, Progress bar %, Points (⭐), Status (Active / At Risk)
- Footer: "Showing X of Y enrolled students · Z need attention"

---

### C. Student Dashboard (`/student`)
**Tabs:** Home | Lessons | Flash Cards | Quizzes | Schedule | Rewards

**Home tab:**
- Welcome banner (green gradient): student name, 7-day streak
- Quick stats: Lessons completed, Streak 🔥, Badges, Points ⭐
- "My Subjects" grid: Mathematics, English, Science with progress bars
- "Continue Learning" list: recent lessons with status badges
- Memory Tip card ("Story Method — turn facts into a funny story")
- Streak widget

**Lessons tab:**
- List of all assigned lessons with status (Done / Continue / Locked / Overdue)
- "Browse All Lessons →" button
- **Open/Extra Classes section:**
  - Browse available open classes with slot availability
  - "Join Class →" / "Leave Class" toggle
  - Enrolled classes shown with green border and "✓ Enrolled" badge

**Flash Cards tab:**
- Subject picker (Mathematics, English, Science)
- Interactive flip card (click to reveal answer)
- "Show Memory Hint" button reveals 记忆法 mnemonic
- Progress dots + Prev/Next navigation
- Side panel: all cards in the current deck listed
- "Save to My Library" / "⭐ Saved to My Library" toggle
- "My Library" view: all saved cards (remove individually)

**Quizzes tab:**
- Quiz list: Title, Subject, Difficulty badge, Best Score
- "Start 🚀" / "Retry 🔄" button per quiz
- Active quiz: one question at a time, MCQ with 4 options
- Submit → immediate feedback (green = correct, red = wrong)
- Results screen: score, points earned (e.g., +90 pts)
- Class leaderboard for enabled quizzes

**Schedule tab:**
- Summary cards: In Progress, Overdue, Upcoming counts
- Overdue section (red): lessons past deadline with days overdue count
- In Progress section: active lessons with deadline warnings (⏰ X days left)
- Upcoming section: future lessons, shows release date if not yet unlocked
- Neurobix Method Tip at bottom

**Rewards tab:**
- Points banner: total points (1,240 ⭐), progress to next badge
- Certificates section: earned (Preview + PDF) and locked (progress bar)
- Badges grid: 6 badges (earned active, unearned locked)
- Subject Progress: per-subject progress bars with lesson counts

---

### D. Parent Dashboard (`/parent`)
**Tabs:** Overview | Progress | Quizzes | Rewards | Messages | Deadlines

**Child Selector:**
- Toggle between multiple children (if parent has more than one)
- Each child button shows: avatar initials, name, class, active indicator (✓)

**Overview tab:**
- Banner: Child name, class, overall progress %, streak, points, badges
- Stats: Lessons completed, Average quiz score, Quizzes passed
- Recent Activity feed (lesson completed, quiz score, flash cards reviewed, etc.)
- Urgent deadlines alert (red panel) for overdue/urgent items

**Progress tab:**
- Per-subject progress cards (Mathematics, English, Science)
- Shows: Subject icon, Last active date, Progress %, Progress bar
- Lesson timeline: colour-coded dots per lesson (completed vs pending)
- "X of Y lessons completed · Z remaining"

**Quizzes tab:**
- Average score summary card
- Quiz results: Quiz name, Subject, Score bar, Pass ✅ / Fail ❌, Date
- Mobile: card list; Desktop: table view

**Rewards tab:**
- Points banner with total points and class rank ("Top 15%")
- Badges list with icons
- Weekly points history bar chart (Mon–Sun with point values)

**Messages tab:**
- Teacher notes/messages for the selected child
- Each note: Teacher name, Subject, Date, Message text (styled as quote)
- "Send a Message to Teacher" form: Select teacher → Type message → Send

**Deadlines tab:**
- Upcoming lesson deadlines sorted by due date
- Urgent (red 🔴) vs Upcoming (green 🟢) distinction
- Neurobix Parent Tip: "Encourage 15 minutes daily — spaced repetition is key!"

---

## 7. DESIGN SYSTEM & BRAND COLOURS

### Primary Brand Colours (Tailwind custom tokens)

| Token | Colour | Hex | Usage |
|---|---|---|---|
| `nb-dark` | Dark forest green | — | Primary text, dark UI elements |
| `nb-green` | Medium green | `#36913F` | Buttons, active states, accents |
| `nb-lime` | Light lime green | `#6FC911` | Progress bars, success states |
| `nb-olive` | Muted olive | `#91BA4F` | Borders, secondary accents |
| `nb-yellow` | Bright yellow | `#FFEB3C` | CTA buttons, highlights, student badge |
| `nb-cream` | Off-white cream | — | Page backgrounds |

### Status Colours

| Status | Background | Text |
|---|---|---|
| Active / Published / Completed | `bg-green-100` | `text-green-700` |
| At Risk / Overdue / Suspended | `bg-red-100` | `text-red-600` |
| In Progress | `bg-yellow-100` | `text-yellow-700` |
| Scheduled | `bg-blue-100` | `text-blue-700` |
| Draft / Pending / Locked | `bg-gray-100` | `text-gray-500` |

### Component Patterns

| Component | Style |
|---|---|
| Cards | `rounded-2xl` or `rounded-3xl`, `border-2`, white background |
| Modals | Bottom sheet on mobile (`rounded-t-3xl`), centered dialog on sm+ |
| Buttons | `rounded-xl`, `font-black`, `hover:shadow-md transition` |
| Progress bars | `h-2.5` or `h-3`, `rounded-full`, gradient fill |
| Badges | `px-2.5 py-1 rounded-full text-xs font-bold` |
| Tables | Hidden on mobile (`sm:hidden` card list), visible on sm+ (`hidden sm:block`) |

### Responsive Breakpoints

| Breakpoint | Width | Usage |
|---|---|---|
| Default | < 640px | Mobile layout (card lists, bottom modals) |
| `sm:` | ≥ 640px | Tablet+ (tables, side-by-side layouts) |
| `lg:` | ≥ 1024px | Desktop (multi-column grids) |
| Max container | `max-w-7xl` | Admin / Teacher dashboards |
| Max container | `max-w-5xl` | Student dashboard |
| Max container | `max-w-6xl` | Parent dashboard |

---

## 8. FILE & FOLDER STRUCTURE

```
lms-system/
├── client/                             ← React frontend (Vite)
│   ├── src/
│   │   ├── App.jsx                     ← Route definitions (React Router v7)
│   │   ├── main.jsx                    ← React entry point
│   │   ├── index.css                   ← Global styles, Tailwind imports
│   │   ├── assets/                     ← Brand logos, icons, badges, mascots, fonts
│   │   ├── context/
│   │   │   ├── AuthContext.jsx         ← Login/logout, JWT + user in localStorage
│   │   │   └── ToastContext.jsx        ← Global toast notifications
│   │   ├── lib/
│   │   │   └── api.js                  ← apiRequest() wrapper for the Express API
│   │   ├── data/
│   │   │   └── lessons.js              ← Shared lesson/subject mock data
│   │   ├── components/
│   │   │   ├── Navbar.jsx              ← Shared navigation bar (all roles)
│   │   │   ├── ProtectedRoute.jsx      ← Route guard (auth + role check)
│   │   │   ├── LessonBrowser.jsx       ← Shared lesson browsing UI
│   │   │   ├── ServerStatusBadge.jsx   ← Pings /api/health, shows API status
│   │   │   └── SessionToast.jsx        ← Shows session-expired/replaced toasts
│   │   └── pages/
│   │       ├── LoginPortal.jsx         ← Role selector login screen
│   │       ├── LoginStudent.jsx        ← Student login form
│   │       ├── LoginStaff.jsx          ← Teacher / Admin / Parent login
│   │       ├── AdminDashboard.jsx      ← Admin portal (4 tabs)
│   │       ├── TeacherDashboard.jsx    ← Teacher portal (7 tabs)
│   │       ├── StudentDashboard.jsx    ← Student portal (6 tabs)
│   │       ├── ParentDashboard.jsx     ← Parent portal (6 tabs)
│   │       ├── LessonsPage.jsx         ← Lessons listing page
│   │       └── LessonDetail.jsx        ← Single lesson detail view
│   ├── package.json                    ← Frontend dependencies
│   └── vite.config.js                  ← Vite configuration
├── server/                             ← Express + Sequelize + MySQL backend (port 4000)
│   ├── src/
│   │   ├── index.js                    ← App entry point, route mounting
│   │   ├── config/config.js            ← Sequelize DB config (.env-driven)
│   │   ├── controllers/                ← Route handlers (auth, classes, lessons, etc.)
│   │   ├── middleware/auth.middleware.js ← JWT auth + session/idle-timeout checks
│   │   ├── routes/                     ← Express routers per resource
│   │   └── db/
│   │       ├── models/                 ← Sequelize models (User, Class, Lesson, etc.)
│   │       ├── migrations/             ← Sequelize migrations
│   │       └── seeders/                ← Demo data seeders
│   ├── .env.example                    ← DB_HOST/PORT/USER/PASSWORD/NAME, JWT_SECRET, PORT
│   └── package.json                    ← Backend dependencies + migrate/seed scripts
├── package.json                        ← Root scripts (delegates dev/build to client)
└── README.md                           ← This file
```

---

## 9. DEVELOPMENT PHASES

### Phase 1 — Core Platform *(In Progress)*
- [x] Users & Roles (UI complete)
- [x] Classes — Regular + Open/Extra (UI complete)
- [x] Lessons — Video, Flash Cards, Quiz, Reading (UI complete)
- [x] Flash Card Editor + Student Viewer + Personal Library (UI complete)
- [x] Quiz Builder + Student Quiz Engine + Leaderboard (UI complete)
- [x] Lesson Scheduling — Draft / Publish / Schedule + Deadlines (UI complete)
- [x] Progress Tracking — Points, Badges, Streak, Progress bars (UI complete)
- [x] Certificates — Preview + PDF Download (UI complete)
- [x] Student Dashboard — 6 tabs (UI complete)
- [x] Teacher Dashboard — 7 tabs (UI complete)
- [x] Admin Dashboard — 4 tabs (UI complete)
- [x] Parent Dashboard — 6 tabs (UI complete)
- [x] Backend API (Express + MySQL) — auth, classes, lessons, flashcards, quizzes, schedules, students
- [x] Authentication (JWT) — login/logout, single-session enforcement, idle timeout for staff
- [x] Database integration — Sequelize models + migrations + seeders
- [ ] Wire remaining dashboard tabs to live API (some still use mock data)

### Phase 2 — Monetisation & Live Classes *(Not yet started)*
- [ ] Stripe payment integration (Singapore)
- [ ] Alipay / WeChat Pay (China)
- [ ] Monthly, Yearly, Per-Subject subscriptions with auto-renewal
- [ ] Agora Live Video (Teacher hosts, Students join)
- [ ] Optional session recording

### Phase 3 — AI Exam, Server & Delivery *(Not yet started)*
- [ ] AI Auto Exam (rule-based, no ML)
- [ ] Server setup and deployment
- [ ] China CDN (Alibaba) integration
- [ ] QA testing and final delivery
- [ ] Landing / marketing page

---

## 10. OUT OF SCOPE

The following features are **explicitly NOT included** in any phase:

| Feature | Reason |
|---|---|
| Free trial functionality | Not requested by client |
| Chinese-language UI | English only |
| Drag-and-drop games | Out of scope |
| Mobile app (iOS / Android) | Web-only platform |
| Machine learning model training | AI exam is rule-based only |
| ICP licence registration | Client's legal responsibility |
| China-hosted servers | Not required in any phase |

---

## 11. CRITICAL DEVELOPMENT RULES

1. **NEVER load assets from Google CDN** — Google services are blocked in China. Self-host all fonts, icons, and JavaScript libraries.

2. **Past year exam papers MUST remain hidden** until assigned by the AI system or a Teacher. Never expose papers before assignment.

3. **Regular classes MUST enforce lesson sequence** — students can only access the next lesson after completing the current one.

4. **Flash card library is PER-STUDENT** — each student has their own private library of saved cards. Libraries are not shared.

5. **Leaderboard is OPTIONAL** — must be toggleable by Admin or Teacher per quiz. Not all quizzes show leaderboards by default.

6. **Stripe is the ONLY payment gateway for Singapore.** Do not add other payment methods for the SG market.

7. **AI exam is RULE-BASED ONLY** — no ML model training, no external AI API calls for the exam logic.

8. **Teacher naming: always use Mr/Ms + Surname.** Example: "Ms Sarah Tan", "Mr Alif Ibrahim". Never use "Cikgu".

9. **ICP licence for China data storage** is the client's responsibility, not the developer's.

10. **Payments in China (Alipay/WeChat) are Phase 2 only** — do not implement prematurely.

---

## 12. RUNNING THE PROJECT LOCALLY

**Prerequisites:** Node.js v18 or above, npm, a local MySQL server

```bash
# --- Backend ---
cd server
npm install
cp .env.example .env        # set DB_USER/DB_PASSWORD/DB_NAME/JWT_SECRET
npm run migrate             # create tables
npm run seed                # load demo users/data
npm run dev                  # start API on http://localhost:4000

# --- Frontend (new terminal) ---
cd client
npm install
npm run dev                  # start Vite dev server

# Build frontend for production
npm run build
```

The app runs on: **http://localhost:5173** (Vite default port), API on **http://localhost:4000**.
The client reads `VITE_API_URL` (see `client/.env`, defaults to `http://localhost:4000`).

> **Note:** Some dashboard tabs still use local mock/static data (e.g. `client/src/data/lessons.js`) pending full API wiring — see Phase 1 checklist below.

---

*Neurobix Method Pte Ltd | Singapore | © 2025 All rights reserved.*
