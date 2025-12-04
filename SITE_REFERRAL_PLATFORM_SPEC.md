# Site Referral Platform - Complete Technical Specification

## Project Overview

### Repository
```
https://github.com/jerryhunley/site-referral-platform.git
```

### What We're Building
A next-generation patient/referral management platform for clinical trial research sites. This is a **demo application** with full functional UI and mock data - no real backend integrations required. The goal is to demonstrate the vision to stakeholders and serve as a foundation for production development.

### Business Context
1nHealth runs clinical trial recruitment campaigns. When patients submit interest through landing pages, their information flows to research sites who must contact, screen, and enroll them. Current platforms are:
- Overly complex with steep learning curves
- Difficult to navigate and prioritize work
- Not engaging enough for sites to keep updated
- Too expensive ($9k/month) for standalone use

**This platform solves that** by being:
- Radically simple and intuitive
- Visually engaging (sites *want* to use it)
- Laser-focused on one thing: managing referrals excellently
- Priced accessibly (~$499/month target)

### Success Metrics
1. Site coordinators can understand the interface with zero training
2. Daily tasks are immediately obvious upon login
3. Updating patient status takes < 3 clicks
4. The UI is so polished stakeholders say "wow"

---

## Technical Stack

### Core Technologies
```
Framework:      Next.js 14+ (App Router)
Language:       TypeScript (strict mode)
Styling:        Tailwind CSS + CSS Variables
UI Components:  Custom components (no heavy UI libraries)
State:          React Context + useState/useReducer
Data:           Local JSON files + React state (mock data)
Animations:     Framer Motion
Icons:          Lucide React
Fonts:          Manrope (primary), system monospace (data)
Deployment:     Vercel
```

### Project Structure
```
site-referral-platform/
├── app/
│   ├── layout.tsx              # Root layout with providers
│   ├── page.tsx                # Login page
│   ├── dashboard/
│   │   └── page.tsx            # Main dashboard
│   ├── referrals/
│   │   ├── page.tsx            # Referral list view
│   │   └── [id]/
│   │       └── page.tsx        # Individual referral detail
│   ├── working-session/
│   │   └── page.tsx            # Working session feature
│   └── settings/
│       └── page.tsx            # Settings & CSV upload
├── components/
│   ├── ui/                     # Base UI components
│   │   ├── GlassCard.tsx
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Badge.tsx
│   │   ├── Modal.tsx
│   │   ├── Dropdown.tsx
│   │   └── ...
│   ├── layout/                 # Layout components
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   ├── ThemeToggle.tsx
│   │   └── ...
│   ├── dashboard/              # Dashboard-specific
│   │   ├── DailyDigestModal.tsx
│   │   ├── StatsCard.tsx
│   │   ├── UpcomingAppointments.tsx
│   │   ├── RecentActivity.tsx
│   │   └── ...
│   ├── referrals/              # Referral-specific
│   │   ├── ReferralCard.tsx
│   │   ├── ReferralTable.tsx
│   │   ├── StatusBadge.tsx
│   │   ├── SMSPanel.tsx
│   │   ├── NotesPanel.tsx
│   │   ├── AppointmentScheduler.tsx
│   │   └── ...
│   └── working-session/        # Working session-specific
│       ├── LeadSelector.tsx
│       ├── DialerInterface.tsx
│       ├── CallTimer.tsx
│       ├── QuickStatusModal.tsx
│       └── SessionReport.tsx
├── lib/
│   ├── mock-data/              # All mock data
│   │   ├── referrals.ts
│   │   ├── studies.ts
│   │   ├── users.ts
│   │   └── messages.ts
│   ├── types/                  # TypeScript types
│   │   └── index.ts
│   ├── utils/                  # Utility functions
│   │   └── index.ts
│   └── context/                # React contexts
│       ├── ThemeContext.tsx
│       ├── AuthContext.tsx
│       └── ReferralContext.tsx
├── public/
│   ├── images/                 # Static images
│   └── animations/             # Lottie JSON files
├── styles/
│   └── globals.css             # Global styles + CSS variables
└── ...config files
```

---

## Design System

### Brand Colors (from 1nHealth Guidelines)

```css
:root {
  /* Primary */
  --mint: #53CA97;
  --mint-light: #75D5AC;
  --mint-dark: #42A279;
  --mint-glow: rgba(83, 202, 151, 0.3);
  
  /* Neutrals - Light Mode */
  --bg-primary: #F8F8F8;
  --bg-secondary: #FFFFFF;
  --bg-tertiary: #F0F0F0;
  --text-primary: #1B2222;
  --text-secondary: #678283;
  --text-muted: #9CA3AF;
  
  /* Neutrals - Dark Mode */
  --dark-bg-primary: #0D1117;
  --dark-bg-secondary: #161B22;
  --dark-bg-tertiary: #21262D;
  --dark-text-primary: #F0F0F0;
  --dark-text-secondary: #8B949E;
  
  /* Secondary Accents */
  --vista-blue: #7991C6;
  --slate-gray: #678283;
  
  /* Semantic */
  --success: #53CA97;
  --warning: #F59E0B;
  --error: #EF4444;
  --info: #7991C6;
  
  /* Glass Effects */
  --glass-bg-light: rgba(255, 255, 255, 0.7);
  --glass-bg-dark: rgba(22, 27, 34, 0.7);
  --glass-border-light: rgba(255, 255, 255, 0.2);
  --glass-border-dark: rgba(255, 255, 255, 0.1);
  --glass-blur: 20px;
}
```

### Typography

```css
/* Font Import - Add to layout.tsx or globals.css */
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&display=swap');

:root {
  --font-primary: 'Manrope', -apple-system, sans-serif;
  --font-mono: 'SF Mono', 'Fira Code', monospace;
}

/* Type Scale */
--text-xs: 0.75rem;      /* 12px - captions */
--text-sm: 0.875rem;     /* 14px - small text */
--text-base: 1rem;       /* 16px - body */
--text-lg: 1.125rem;     /* 18px - large body */
--text-xl: 1.25rem;      /* 20px - h4 */
--text-2xl: 1.5rem;      /* 24px - h3 */
--text-3xl: 1.875rem;    /* 30px - h2 */
--text-4xl: 2.25rem;     /* 36px - h1 */
--text-5xl: 3rem;        /* 48px - display */
```

### Glassmorphism Design Language

The entire UI should feel like frosted glass panels floating over a subtle gradient background. Key principles:

1. **Glass Cards**: Semi-transparent backgrounds with backdrop blur
```css
.glass-card {
  background: var(--glass-bg-light);
  backdrop-filter: blur(var(--glass-blur));
  -webkit-backdrop-filter: blur(var(--glass-blur));
  border: 1px solid var(--glass-border-light);
  border-radius: 24px;
  box-shadow: 
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}
```

2. **Layered Depth**: Multiple glass layers at different opacities
3. **Subtle Gradients**: Background gradients that give depth without distraction
4. **Glow Effects**: Mint glow on interactive elements
5. **Smooth Transitions**: Everything animates smoothly (300ms ease default)

### Background Treatment

```css
/* Light mode background */
.app-background-light {
  background: linear-gradient(135deg, #F8F8F8 0%, #E8F5F0 50%, #F0F4F8 100%);
  min-height: 100vh;
}

/* Dark mode background */
.app-background-dark {
  background: linear-gradient(135deg, #0D1117 0%, #0F1A15 50%, #0D1117 100%);
  min-height: 100vh;
}

/* Optional: Add subtle animated gradient orbs for extra depth */
.background-orb {
  position: fixed;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.3;
  animation: float 20s ease-in-out infinite;
}
```

### Animation Principles

```typescript
// Standard transitions
const transitions = {
  fast: { duration: 0.15, ease: "easeOut" },
  default: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
  slow: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
  spring: { type: "spring", stiffness: 300, damping: 30 }
};

// Stagger children for list animations
const staggerContainer = {
  animate: {
    transition: { staggerChildren: 0.05 }
  }
};

// Fade up animation for cards
const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 }
};
```

---

## Data Models

### TypeScript Types

```typescript
// lib/types/index.ts

export type ReferralStatus = 
  | 'new'
  | 'attempt_1'
  | 'attempt_2'
  | 'attempt_3'
  | 'attempt_4'
  | 'attempt_5'
  | 'sent_sms'
  | 'appointment_scheduled'
  | 'phone_screen_failed'
  | 'not_interested'
  | 'signed_icf';

export interface Referral {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  submittedAt: string;
  source: string; // e.g., "Facebook", "Google", "Direct"
  studyId: string;
  status: ReferralStatus;
  assignedTo: string | null; // coordinator user ID
  lastContactedAt: string | null;
  appointmentDate: string | null;
  notes: Note[];
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

export interface Note {
  id: string;
  referralId: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: string;
}

export interface Message {
  id: string;
  referralId: string;
  direction: 'inbound' | 'outbound';
  content: string;
  sentAt: string;
  status: 'sent' | 'delivered' | 'read' | 'failed';
}

export interface Study {
  id: string;
  name: string;
  protocolNumber: string;
  sponsor: string;
  indication: string;
  status: 'active' | 'paused' | 'completed';
  enrollmentGoal: number;
  currentEnrollment: number;
  siteId: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'coordinator';
  siteId: string;
  avatar?: string;
}

export interface Site {
  id: string;
  name: string;
  address: string;
  studies: string[]; // study IDs
}

export interface Appointment {
  id: string;
  referralId: string;
  referralName: string;
  studyId: string;
  studyName: string;
  scheduledFor: string;
  type: 'phone_screen' | 'in_person_screen' | 'consent_visit';
  notes?: string;
  createdAt: string;
}

export interface WorkingSession {
  id: string;
  userId: string;
  startedAt: string;
  endedAt: string | null;
  referralIds: string[];
  completedCalls: number;
  statusUpdates: number;
  appointmentsScheduled: number;
}

export interface DailyDigest {
  newReferrals: number;
  pendingFollowUps: number;
  appointmentsToday: Appointment[];
  overdueStatuses: number;
  conversionRate: number;
  recentActivity: ActivityItem[];
}

export interface ActivityItem {
  id: string;
  type: 'status_change' | 'note_added' | 'sms_sent' | 'appointment_scheduled';
  referralId: string;
  referralName: string;
  description: string;
  timestamp: string;
  userId: string;
}
```

### Mock Data Guidelines

Create realistic mock data with:
- 75-100 referrals across multiple statuses
- 4 active studies (see below)
- 3 coordinator users
- Varied submission dates (last 30 days)
- Mix of contact attempts and outcomes
- Realistic names, emails, phone numbers (use faker patterns)
- Appointment dates spread across next 2 weeks

---

### Mock Studies (Use These Exact Names)

```typescript
// lib/mock-data/studies.ts

export const mockStudies: Study[] = [
  {
    id: 'study-001',
    name: 'AURORA-T2D',
    protocolNumber: 'AUR-2024-001',
    sponsor: 'Novo Nordisk',
    indication: 'Type 2 Diabetes',
    status: 'active',
    enrollmentGoal: 45,
    currentEnrollment: 28,
    siteId: 'site-001'
  },
  {
    id: 'study-002',
    name: 'CLARITY-AD',
    protocolNumber: 'CLR-2024-112',
    sponsor: 'Biogen',
    indication: 'Early Alzheimer\'s Disease',
    status: 'active',
    enrollmentGoal: 30,
    currentEnrollment: 12,
    siteId: 'site-001'
  },
  {
    id: 'study-003',
    name: 'RESOLVE-RA',
    protocolNumber: 'RSV-2023-089',
    sponsor: 'AbbVie',
    indication: 'Rheumatoid Arthritis',
    status: 'active',
    enrollmentGoal: 60,
    currentEnrollment: 41,
    siteId: 'site-001'
  },
  {
    id: 'study-004',
    name: 'BEACON-CKD',
    protocolNumber: 'BCN-2024-045',
    sponsor: 'AstraZeneca',
    indication: 'Chronic Kidney Disease',
    status: 'active',
    enrollmentGoal: 35,
    currentEnrollment: 8,
    siteId: 'site-001'
  }
];
```

---

### Mock Data Scenarios (Required)

The mock data MUST include these specific scenarios to demonstrate the full platform capability:

#### Scenario 1: "The Success Story" (1 referral)
A patient who has completed the entire funnel:
```typescript
{
  name: "Maria Santos",
  status: "signed_icf",
  submittedAt: "3 weeks ago",
  study: "AURORA-T2D",
  history: [
    "Submitted form (Day 0)",
    "Attempt 1 - Left voicemail (Day 0)",
    "Attempt 2 - Spoke briefly, will call back (Day 1)",
    "Sent SMS with study info (Day 1)",
    "Attempt 3 - Scheduled appointment (Day 2)",
    "Appointment completed - Phone screen passed (Day 5)",
    "In-person screening scheduled (Day 5)",
    "Signed ICF (Day 8)"
  ],
  notes: [
    "Patient very interested, husband also has T2D",
    "Prefers morning appointments",
    "Spanish speaker - comfortable in English"
  ],
  messages: [
    { outbound: "Hi Maria, this is Sarah from Orlando Clinical Research...", day: 1 },
    { inbound: "Hi! Yes I'm still interested. What times work?", day: 1 },
    { outbound: "Great! We have availability Thursday at 10am or Friday at 2pm...", day: 1 },
    { inbound: "Thursday 10am works perfectly", day: 1 }
  ]
}
```

#### Scenario 2: "Hot Leads" (8-10 referrals)
Batch of new referrals from yesterday/today that need immediate attention:
```typescript
// All submitted within last 24-48 hours
// Status: "new"
// No contact attempts yet
// Variety of studies
// These should appear in "Needs Attention" dashboard section
```

#### Scenario 3: "The Ghosted" (5-6 referrals)
Patients who haven't responded despite multiple attempts:
```typescript
{
  status: "attempt_5", // or attempt_4
  submittedAt: "2 weeks ago",
  lastContactedAt: "3 days ago",
  notes: ["LVM x3", "Sent 2 SMS, no response", "Trying one more time then marking inactive"],
  messages: [
    { outbound: "Hi [name], following up about the diabetes study...", status: "delivered", noReply: true },
    { outbound: "Hi [name], wanted to reach out one more time...", status: "delivered", noReply: true }
  ]
}
```

#### Scenario 4: "Appointment Pipeline" (6-8 referrals)
Patients with upcoming appointments in the next 7 days:
```typescript
// Mix of appointment types:
// - 2 phone screens (today and tomorrow)
// - 3 in-person screenings (this week)
// - 2 consent visits (this week)
// - 1 that was rescheduled (note explaining why)
// Status: "appointment_scheduled"
// Include specific times for today's appointments
```

#### Scenario 5: "Screen Failures" (4-5 referrals)
Patients who didn't qualify after phone screen:
```typescript
{
  status: "phone_screen_failed",
  notes: [
    "A1C too low - 5.9%, need >7.0%",
    "Currently on exclusionary medication (Jardiance)",
    "BMI 24, study requires >30"
  ]
}
```

#### Scenario 6: "Not Interested" (4-5 referrals)
Patients who declined to participate:
```typescript
{
  status: "not_interested",
  notes: [
    "Concerned about time commitment",
    "Decided to try lifestyle changes first",
    "Spouse not supportive",
    "Found another study closer to home"
  ]
}
```

#### Scenario 7: "SMS Conversations" (3-4 referrals)
Patients with active text message threads:
```typescript
// Include realistic back-and-forth conversations
// At least one with:
// - Patient asking questions about the study
// - Coordinator answering
// - Patient confirming interest
// - Awaiting scheduling

// At least one with:
// - Initial outreach
// - Patient responded with questions
// - Last message from coordinator, awaiting reply
// Status: "sent_sms"
```

#### Scenario 8: "The Callbacks" (5-6 referrals)
Patients in various attempt stages who requested callbacks:
```typescript
{
  status: "attempt_2", // or attempt_1, attempt_3
  notes: [
    "Spoke briefly - at work. Call back after 5pm",
    "Interested but traveling. Follow up next Monday",
    "Asked to call back tomorrow morning"
  ],
  // lastContactedAt should be 1-3 days ago
}
```

#### Scenario 9: "Assigned Distribution" 
Distribute referrals across coordinators:
```typescript
// Sarah Chen: 35 referrals (primary coordinator)
// Mike Rodriguez: 25 referrals  
// Jennifer Park: 15 referrals (part-time)
// Unassigned: 10 referrals (new, need assignment)
```

#### Scenario 10: "Study Distribution"
Ensure good coverage across studies:
```typescript
// AURORA-T2D (Diabetes): 30 referrals - most active
// CLARITY-AD (Alzheimer's): 20 referrals - harder to enroll
// RESOLVE-RA (RA): 18 referrals - near goal
// BEACON-CKD (Kidney): 17 referrals - newest study
```

---

### Mock Users

```typescript
// lib/mock-data/users.ts

export const mockUsers: User[] = [
  {
    id: 'user-001',
    firstName: 'Sarah',
    lastName: 'Chen',
    email: 'sarah.chen@orlandoclinical.com',
    role: 'coordinator',
    siteId: 'site-001',
    avatar: null // Will use initials "SC"
  },
  {
    id: 'user-002',
    firstName: 'Mike',
    lastName: 'Rodriguez',
    email: 'mike.rodriguez@orlandoclinical.com',
    role: 'coordinator',
    siteId: 'site-001',
    avatar: null // Will use initials "MR"
  },
  {
    id: 'user-003',
    firstName: 'Jennifer',
    lastName: 'Park',
    email: 'jennifer.park@orlandoclinical.com',
    role: 'coordinator',
    siteId: 'site-001',
    avatar: null // Will use initials "JP"
  }
];

// Default logged-in user for demo
export const currentUser = mockUsers[0]; // Sarah Chen
```

---

### Mock Site

```typescript
// lib/mock-data/site.ts

export const mockSite: Site = {
  id: 'site-001',
  name: 'Orlando Clinical Research Center',
  address: '3452 Lake Lynda Dr, Suite 100, Orlando, FL 32826',
  studies: ['study-001', 'study-002', 'study-003', 'study-004']
};
```

---

### Data Generation Notes

When generating the 75-100 referrals:

1. **Names**: Use diverse, realistic American names (mix of ethnicities)
2. **Emails**: firstname.lastname@gmail.com, firstnamelastname@yahoo.com, etc.
3. **Phones**: Use 407, 321, 352 area codes (Central Florida)
4. **DOB**: Range from 35-75 years old (clinical trial demographics)
5. **Sources**: Mix of "Facebook", "Google", "Instagram", "Referral", "Website"
6. **Submission times**: Vary throughout day (9am-9pm typical)
7. **Timestamps**: Use realistic intervals between status changes

```typescript
// Status distribution across 85 referrals (approximate):
// new: 10
// attempt_1: 8
// attempt_2: 7
// attempt_3: 5
// attempt_4: 4
// attempt_5: 5
// sent_sms: 8
// appointment_scheduled: 12
// phone_screen_failed: 5
// not_interested: 6
// signed_icf: 15
```

---

## Feature Specifications

### Phase 1: Foundation & Login

#### 1.1 Login Screen
**Priority:** P0 (First)

**Description:** A beautiful, branded entry point. No real auth - any input logs in.

**UI Elements:**
- Full-screen gradient background with floating glass card
- 1nHealth logo (or "1nData" sub-brand)
- Email input field
- Password input field  
- "Sign In" button with hover glow effect
- Theme toggle in corner
- Subtle animated background elements

**Behavior:**
- Any email/password combination works
- Button shows loading state briefly (500ms)
- Redirects to dashboard
- Stores mock user in context

**🎨 IMAGE OPPORTUNITY - Login Background:**
> Abstract, flowing gradient mesh or subtle geometric pattern. Colors: mint greens, soft teals, and white/light gray. Should feel medical/professional but modern. Alternatively, a Lottie animation of subtle floating particles or gentle waves.

**🎬 LOTTIE OPPORTUNITY - Loading State:**
> Simple, elegant loading spinner using mint color. Circular or DNA-helix style to tie into clinical/health theme.

---

#### 1.2 App Shell & Navigation
**Priority:** P0

**Description:** Persistent sidebar navigation and header.

**Sidebar Elements:**
- Logo at top
- Navigation items:
  - Dashboard (home icon)
  - Referrals (users icon)
  - Working Session (phone icon)
  - Settings (gear icon)
- Study selector dropdown (for multi-study)
- User profile section at bottom
- Collapse/expand toggle

**Header Elements:**
- Page title
- Search bar (global search)
- Notification bell (mock badge)
- Theme toggle (sun/moon)
- User avatar dropdown

**Behavior:**
- Sidebar remembers collapsed state
- Active nav item highlighted with mint accent
- Smooth transitions between pages
- Study selector filters all data

---

### Phase 2: Dashboard

#### 2.1 Daily Digest Modal (Lightbox)
**Priority:** P0

**Description:** First thing user sees on login. Welcoming, informative, actionable.

**UI Elements:**
- Glass modal overlay
- Greeting with time-of-day ("Good morning, Sarah!")
- Today's date prominently displayed
- Key metrics in card grid:
  - New referrals since last login
  - Appointments today (count + next one)
  - Overdue follow-ups needing attention
  - Weekly conversion rate trend
- Quick action buttons:
  - "Start Working Session"
  - "View Today's Appointments"
  - "See All Referrals"
- "Don't show again today" checkbox
- Dismiss button

**🎬 LOTTIE OPPORTUNITY - Greeting Animation:**
> Friendly, subtle animation that plays once. Could be a waving hand, rising sun (for morning), or simple confetti burst if there's good news to celebrate (like hitting enrollment goal).

**🎨 IMAGE OPPORTUNITY - Empty State:**
> If no appointments or new referrals, show a calming illustration. Suggestion: minimalist line art of a person relaxing or a peaceful nature scene. Message: "All caught up! Great work."

---

#### 2.2 Dashboard Main View
**Priority:** P0

**Description:** Command center showing everything at a glance.

**Layout:** Asymmetric grid with featured cards

**Cards/Sections:**

1. **Stats Row** (top, 4 cards)
   - Total Active Referrals
   - Appointments This Week
   - Signed ICFs (Monthly)
   - Conversion Rate
   - Each with sparkline trend indicator

2. **Today's Appointments** (prominent, left)
   - Timeline view of day's appointments
   - Patient name, study, time, type
   - Quick-action: call or view profile
   - "No appointments" illustration if empty

3. **Needs Attention** (prominent, right)
   - Referrals with outdated status (>48hrs no update)
   - Sorted by urgency
   - One-click to update status
   - Count badge

4. **Recent Activity Feed** (bottom left)
   - Chronological list of recent actions
   - Filterable by type
   - Shows who did what when

5. **Quick Actions** (bottom right)
   - Start Working Session button
   - Add New Referral button
   - Upload CSV button (leads to settings)

**🎬 LOTTIE OPPORTUNITY - Stats Cards:**
> Subtle animation on the sparkline charts - lines drawing in on page load. Or small animated icons for each stat type.

---

### Phase 3: Referral Management

#### 3.1 Referral List View
**Priority:** P0

**Description:** Browse, search, filter, and manage all referrals.

**Layout:** Card-based grid with powerful filtering

**Filter Bar:**
- Search (name, email, phone)
- Status dropdown (multi-select)
- Study dropdown
- Date range picker
- Assigned to dropdown
- Sort by dropdown
- View toggle (cards/compact list)

**Referral Cards Display:**
Each card shows:
- Patient name (large)
- Status badge (color-coded)
- Study name
- Phone number (click to copy)
- Submitted date
- Last contacted date
- Assigned coordinator avatar
- Quick actions on hover:
  - Call
  - SMS
  - Update Status
  - View Profile

**Bulk Actions:**
- Select multiple referrals
- Bulk status update
- Add to working session
- Assign to coordinator

**Pagination:**
- Load more / infinite scroll
- Count display ("Showing 25 of 156")

**🎨 IMAGE OPPORTUNITY - Empty State:**
> When filters return no results: friendly illustration of a magnifying glass finding nothing, with suggestion to adjust filters.

---

#### 3.2 Referral Detail View
**Priority:** P0

**Description:** Complete view of single referral with all actions.

**Layout:** Two-column on desktop

**Left Column (60%):**

1. **Header Section**
   - Back button
   - Patient name (large)
   - Status badge with dropdown to change
   - Study name
   - Quick action buttons: Call, SMS, Schedule

2. **Contact Information Card**
   - Phone (click to call, copy button)
   - Email (click to email, copy button)
   - Date of birth
   - Preferred contact time (if available)
   - Source/campaign

3. **Timeline/History**
   - Chronological view of all interactions
   - Status changes
   - Notes added
   - Messages sent/received
   - Appointments scheduled
   - Filter by type

**Right Column (40%):**

1. **SMS Panel** (expandable)
   - iMessage-style conversation view
   - Outbound messages: mint bubbles, right-aligned
   - Inbound messages: gray bubbles, left-aligned
   - Input field with send button
   - Character count
   - Template quick-insert dropdown

2. **Notes Panel**
   - List of all notes
   - Add new note textarea
   - Each note shows author, timestamp
   - Edit/delete options

3. **Appointments Panel**
   - Upcoming appointments
   - Past appointments
   - Schedule new button
   - Quick reschedule/cancel

**Status Change Flow:**
When status is changed:
1. Dropdown shows all status options
2. Selection triggers confirmation
3. Optional: add note with status change
4. Save shows success toast
5. Timeline updates immediately

**🎬 LOTTIE OPPORTUNITY - Message Sent:**
> Small checkmark or paper airplane animation when SMS sends successfully.

---

#### 3.3 Status Badge Component
**Priority:** P0

**Visual Design for Each Status:**

```typescript
const statusConfig = {
  new: { 
    label: 'New', 
    color: 'mint', 
    bgClass: 'bg-mint/20', 
    textClass: 'text-mint-dark' 
  },
  attempt_1: { 
    label: 'Attempt 1', 
    color: 'amber', 
    bgClass: 'bg-amber-100', 
    textClass: 'text-amber-700' 
  },
  attempt_2: { 
    label: 'Attempt 2', 
    color: 'amber', 
    bgClass: 'bg-amber-200', 
    textClass: 'text-amber-800' 
  },
  attempt_3: { 
    label: 'Attempt 3', 
    color: 'orange', 
    bgClass: 'bg-orange-100', 
    textClass: 'text-orange-700' 
  },
  attempt_4: { 
    label: 'Attempt 4', 
    color: 'orange', 
    bgClass: 'bg-orange-200', 
    textClass: 'text-orange-800' 
  },
  attempt_5: { 
    label: 'Attempt 5', 
    color: 'red', 
    bgClass: 'bg-red-100', 
    textClass: 'text-red-700' 
  },
  sent_sms: { 
    label: 'Sent SMS', 
    color: 'blue', 
    bgClass: 'bg-vista-blue/20', 
    textClass: 'text-vista-blue' 
  },
  appointment_scheduled: { 
    label: 'Appt Scheduled', 
    color: 'purple', 
    bgClass: 'bg-purple-100', 
    textClass: 'text-purple-700' 
  },
  phone_screen_failed: { 
    label: 'Screen Failed', 
    color: 'gray', 
    bgClass: 'bg-gray-200', 
    textClass: 'text-gray-600' 
  },
  not_interested: { 
    label: 'Not Interested', 
    color: 'gray', 
    bgClass: 'bg-gray-200', 
    textClass: 'text-gray-600' 
  },
  signed_icf: { 
    label: 'Signed ICF', 
    color: 'green', 
    bgClass: 'bg-green-100', 
    textClass: 'text-green-700',
    icon: 'check-circle' // Special: show checkmark
  }
};
```

---

### Phase 4: Working Session

#### 4.1 Working Session - Lead Selection
**Priority:** P1

**Description:** Select a batch of leads to work through systematically.

**UI Elements:**

1. **Session Setup Card**
   - Session name input (auto-generated default)
   - Study filter
   - Status filter (which statuses to include)
   - Max leads slider (5-50)
   - "Auto-select" button (smart selection)
   - "Manual select" toggle

2. **Lead Preview List**
   - Shows leads matching criteria
   - Checkbox to include/exclude
   - Drag to reorder priority
   - Shows last contact attempt
   - Shows days since submission

3. **Session Summary**
   - Total leads selected
   - Estimated time (based on avg call time)
   - "Start Session" button (prominent)

**Smart Auto-Select Logic:**
Prioritize in order:
1. New referrals (never contacted)
2. Oldest uncontacted
3. Those with appointments coming up
4. Those approaching max attempts

---

#### 4.2 Working Session - Dialer Interface
**Priority:** P1

**Description:** The active calling interface during a session.

**Layout:** Focused, distraction-free

**Main View:**

1. **Current Lead Card** (center, large)
   - Patient name (very large)
   - Phone number (click to initiate)
   - Status badge
   - Quick stats: days since submission, attempt #
   - Study name

2. **Call Controls** (below lead card)
   - Large "Start Call" button (before calling)
   - Active call state:
     - Call timer (MM:SS, animated)
     - Mute button (mock)
     - End Call button
   - After call:
     - Quick status buttons
     - Add note field
     - "Next Lead" button

3. **Session Progress** (sidebar or top bar)
   - Progress: "Lead 3 of 15"
   - Progress bar
   - Completed count
   - Skip count
   - Time elapsed

4. **Lead Queue Preview** (collapsible sidebar)
   - Next 3-5 leads
   - Ability to skip ahead
   - Reorder remaining

**Call Timer Behavior:**
- Starts when "Start Call" pressed
- Shows elapsed time prominently
- Pulses gently while active
- Stops when "End Call" pressed
- Time logged to session

**Quick Status Flow (post-call):**
```
[No Answer] [Left VM] [Spoke - Follow Up] [Spoke - Scheduled] [Not Interested] [Wrong Number]
```
Each button:
- Updates status automatically
- Opens note field
- Allows quick note entry
- "Save & Next" moves to next lead

**🎬 LOTTIE OPPORTUNITY - Call Animation:**
> Pulsing phone icon or sound wave animation while "call" is active. Gives visual feedback that timer is running.

**🎬 LOTTIE OPPORTUNITY - Session Complete:**
> Celebration animation when all leads in session are completed. Confetti or checkmark burst.

---

#### 4.3 Working Session - Report
**Priority:** P1

**Description:** Summary generated after completing a session.

**UI Elements:**

1. **Session Summary Card**
   - Session duration
   - Total leads worked
   - Calls made vs. skipped

2. **Outcomes Breakdown**
   - Visual chart (donut or bar)
   - Count per status outcome
   - Appointments scheduled highlight

3. **Detailed Log**
   - Each lead with outcome
   - Notes added
   - Time spent per lead

4. **Actions**
   - "Email Report" button (shows toast: "Report sent!")
   - "Start New Session" button
   - "Return to Dashboard" button
   - "Download CSV" button

**🎨 IMAGE OPPORTUNITY - Great Session:**
> If conversion rate is high or appointments were scheduled, show celebratory illustration.

---

### Phase 5: Settings & Upload

#### 5.1 Settings Page
**Priority:** P2

**Sections:**

1. **Profile Settings**
   - Name, email (display only in demo)
   - Avatar upload placeholder
   - Notification preferences toggles

2. **Site Settings**
   - Site name
   - Address
   - Active studies list

3. **Import/Export**
   - CSV Upload section (detailed below)
   - Export all data button

4. **Preferences**
   - Theme toggle
   - Default view preferences
   - Daily digest preferences

---

#### 5.2 CSV Upload Interface
**Priority:** P2

**Description:** UI demonstration of how sites would upload their own lead lists.

**UI Flow:**

1. **Upload Area**
   - Drag-and-drop zone (large, dashed border)
   - "Choose File" button
   - Accepted formats note: CSV, XLSX
   - Download template link

2. **File Selected State**
   - Filename displayed
   - File size
   - "Analyze" button

3. **Column Mapping Preview** (mock)
   - Shows detected columns
   - Dropdown to map to system fields
   - Required fields highlighted
   - Preview of first 5 rows

4. **Import Preview**
   - "X leads will be imported"
   - Validation warnings if any
   - Study assignment dropdown
   - "Import" button

5. **Success State**
   - Shows number imported
   - Link to view imported leads
   - Option to import another

**Note:** This is UI only. Actual import doesn't need to function - just show the flow.

**🎨 IMAGE OPPORTUNITY - Upload Zone:**
> Light illustration inside drag-drop zone showing a CSV/spreadsheet icon with an upward arrow.

---

### Phase 6: Polish & Extras

#### 6.1 Email Daily Digest (Mock)
**Priority:** P2

**Description:** A preview of what the email digest would look like.

**Location:** Settings > Daily Digest > "Preview Email"

**Email Template Preview:**
- Glass card showing email mockup
- Header with logo
- Greeting
- Summary stats
- Today's appointments list
- Action buttons (mock)
- Footer

---

#### 6.2 Global Search
**Priority:** P2

**Description:** Command-palette style search (CMD+K).

**UI:**
- Modal overlay with search input
- Real-time results as you type
- Results grouped: Referrals, Studies, Actions
- Keyboard navigation
- Recent searches

---

#### 6.3 Notifications Panel
**Priority:** P2

**Description:** Dropdown from bell icon.

**Mock Notifications:**
- New referral assigned
- Appointment reminder
- Status update by teammate
- Mark all read button
- Clear all button

---

## Component Library Requirements

### Base Components to Build

```typescript
// All components should support:
// - Light/dark mode via CSS variables
// - Framer Motion animations
// - Proper TypeScript props
// - Accessible (ARIA labels, keyboard nav)

// UI Components
- GlassCard (with variants: default, elevated, inset)
- Button (variants: primary, secondary, ghost, danger; sizes: sm, md, lg)
- Input (with label, error state, helper text)
- Textarea
- Select/Dropdown
- Checkbox
- Toggle/Switch
- Badge (with color variants)
- Avatar (with fallback initials)
- Modal (with glass effect)
- Tooltip
- Toast/Notification
- Progress Bar
- Skeleton Loader
- Empty State (with illustration slot)
- DatePicker (can use library, style to match)
- TimePicker

// Layout Components
- PageContainer
- Section
- Grid
- Stack (vertical/horizontal)
- Divider

// Data Display
- DataCard
- StatCard (with trend indicator)
- Timeline
- Table (if needed for compact view)
- List
- ListItem
```

---

## Development Phases & Milestones

### Phase 1: Foundation (Sessions 1-2)
**Goal:** Runnable app with login and navigation

- [ ] Initialize Next.js project with TypeScript
- [ ] Configure Tailwind CSS with custom theme
- [ ] Set up CSS variables for design system
- [ ] Create base UI components (GlassCard, Button, Input)
- [ ] Build login page
- [ ] Build app shell (sidebar, header)
- [ ] Set up theme context (light/dark toggle)
- [ ] Set up mock auth context
- [ ] Create mock data files

**Commit:** "Foundation complete - Login and navigation working"

### Phase 2: Dashboard (Sessions 3-4)
**Goal:** Fully functional dashboard

- [ ] Build Daily Digest modal
- [ ] Build stat cards with mock data
- [ ] Build appointments timeline
- [ ] Build "Needs Attention" section
- [ ] Build activity feed
- [ ] Implement dashboard layout
- [ ] Add animations and polish

**Commit:** "Dashboard complete - All sections functional"

### Phase 3: Referral List (Sessions 5-6)
**Goal:** Browse and filter referrals

- [ ] Build ReferralCard component
- [ ] Build filter bar with all filters
- [ ] Implement search functionality
- [ ] Build list view with pagination
- [ ] Add bulk selection
- [ ] Add sorting
- [ ] Polish animations

**Commit:** "Referral list complete - Filtering and search working"

### Phase 4: Referral Detail (Sessions 7-8)
**Goal:** Complete referral profile

- [ ] Build detail page layout
- [ ] Build contact info card
- [ ] Build SMS panel with mock conversation
- [ ] Build notes panel with add/edit
- [ ] Build appointments panel
- [ ] Build timeline view
- [ ] Implement status change flow
- [ ] Add all interactions

**Commit:** "Referral detail complete - All panels functional"

### Phase 5: Working Session (Sessions 9-11)
**Goal:** Full working session flow

- [ ] Build lead selection interface
- [ ] Build dialer interface
- [ ] Implement call timer
- [ ] Build quick status flow
- [ ] Build session progress tracking
- [ ] Build session report
- [ ] Add transitions between states

**Commit:** "Working session complete - Full flow functional"

### Phase 6: Settings & Polish (Sessions 12-13)
**Goal:** Settings page and final polish

- [ ] Build settings page
- [ ] Build CSV upload UI
- [ ] Build email digest preview
- [ ] Add global search (CMD+K)
- [ ] Add notifications panel
- [ ] Final animation polish
- [ ] Responsive tweaks
- [ ] Performance optimization

**Commit:** "MVP complete - All features functional"

---

## Image & Animation Asset List

### Images Needed

| Location | Description | Suggested Style |
|----------|-------------|-----------------|
| Login background | Abstract gradient mesh | Mint/teal flowing gradients, subtle geometric shapes |
| Empty state - No referrals | Friendly illustration | Line art, person with magnifying glass, mint accent |
| Empty state - No appointments | Calming illustration | Line art, person relaxing/checkmark, mint accent |
| Empty state - No search results | Helpful illustration | Line art, empty box or telescope, mint accent |
| CSV upload zone | Upload illustration | Line art, spreadsheet with arrow, mint accent |
| Great session celebration | Success illustration | Line art, person celebrating or trophy, mint/gold |
| Profile placeholder | Default avatar | Geometric abstract or initials-based |

### Lottie Animations Needed

| Location | Description | Style |
|----------|-------------|-------|
| Loading spinner | App-wide loader | Circular, mint color, smooth loop |
| Login loading | Button loading state | Small, inline, mint color |
| Daily digest greeting | Welcome animation | Waving hand or rising sun, plays once |
| Message sent | SMS success | Checkmark or paper airplane, plays once |
| Call active | During call | Pulsing circles or sound waves, loops |
| Session complete | End of working session | Confetti burst or checkmark, plays once |
| Chart drawing | Stats cards | Lines drawing in, plays once on load |

### Where to Source

**Images:**
- Create custom via DALL-E, Midjourney, or similar
- Use open-source illustration libraries (unDraw, Storyset) and recolor
- Commission from designer

**Lottie:**
- LottieFiles.com (search and customize)
- Create custom in After Effects/Lottie Creator
- Use existing and recolor to mint

---

## Testing Checklist

Before each commit, verify:

### Functionality
- [ ] All buttons trigger expected actions
- [ ] All forms validate and submit (mock)
- [ ] Navigation works correctly
- [ ] Data displays correctly
- [ ] Filters work as expected
- [ ] Modals open/close properly

### Visual
- [ ] Light mode looks correct
- [ ] Dark mode looks correct
- [ ] Animations are smooth (60fps)
- [ ] No layout shifts
- [ ] Glass effects render properly
- [ ] All text is readable

### Technical
- [ ] No TypeScript errors
- [ ] No console errors
- [ ] No console warnings
- [ ] Build completes successfully
- [ ] Works in Chrome, Firefox, Safari

---

## Commit Message Format

Each commit should follow this format:

```
[Phase X.X] Feature Name - Brief Description

## Summary
Paragraph describing what was accomplished in this session.

## Changes
- List of specific changes made
- Components created
- Features implemented

## Technical Notes
- Any architectural decisions made
- Libraries added and why
- Performance considerations

## Known Issues / Bugs to Watch
- Any quirks discovered
- Things that might break
- Edge cases not handled

## Next Steps
- What should be tackled next
- Dependencies for next phase
- Questions that need answering

## Files Changed
- List of files created/modified
```

---

## Additional Notes for Claude Code

### Code Style Preferences
- Use functional components with hooks
- Prefer composition over prop drilling
- Use TypeScript strictly (no `any`)
- Comment complex logic
- Use semantic HTML elements
- Follow Tailwind best practices
- Keep components under 200 lines (split if larger)

### Performance Considerations
- Lazy load heavy components
- Use `useMemo`/`useCallback` appropriately
- Optimize images (next/image)
- Minimize re-renders
- Use skeleton loaders during "loading" states

### Accessibility Minimums
- All interactive elements keyboard accessible
- ARIA labels on icon-only buttons
- Focus visible states
- Color contrast compliance
- Form labels associated

### Don't Worry About
- Real authentication/security
- Real SMS/API integrations
- Real database
- Production error handling
- Unit tests (unless time permits)
- Mobile responsiveness (desktop-first, basic mobile is fine)

---

## Quick Reference

### Key Colors
- Primary action: `#53CA97` (mint)
- Backgrounds: `#F8F8F8` (light), `#0D1117` (dark)
- Text: `#1B2222` (light), `#F0F0F0` (dark)
- Glass border: `rgba(255,255,255,0.2)`

### Key Breakpoints
- Desktop (primary): 1280px+
- Tablet: 768px-1279px
- Mobile: <768px

### Key Z-Index Scale
- Base content: 0
- Sticky elements: 10
- Dropdowns: 20
- Modals: 30
- Toasts: 40

---

## Final Checklist Before Handoff

- [ ] Spec document reviewed and understood
- [ ] Git repository cloned
- [ ] Local environment working
- [ ] Design system variables set up
- [ ] Mock data files created
- [ ] Base components built
- [ ] Ready to start Phase 1

---

**Document Version:** 1.0  
**Created:** December 2024  
**Author:** [Jerry Hunley / Claude collaboration]  
**Repository:** https://github.com/jerryhunley/site-referral-platform.git
