# TriviaIRL — Coding Agent Prompt

You are building **TriviaIRL** from scratch — a real-time bar trivia hosting web application. This document is your complete source of truth. Read every section before writing a single line of code. Do not improvise architecture decisions that are already specified here.

---

## Your Operating Rules

1. **Read before building.** Understand the full spec before starting. Do not begin with scaffolding and figure out the rest later.
2. **Build vertically, not horizontally.** Complete one feature end-to-end (data model → API → UI → test) before moving to the next. Do not stub everything and wire it up later.
3. **Test as you go.** After each feature is complete, write and run tests before moving on. Do not leave testing for the end.
4. **Ask before assuming.** If a decision is not specified in this document, stop and ask rather than guessing.
5. **Never self-report scores.** All scoring logic runs server-side. This is a hard requirement — never trust client-submitted point values.
6. **Never use blurred shadows.** All box shadows in this app are hard offset (e.g. `4px 4px 0 #000`). This is a design requirement, not a suggestion.
7. **TypeScript strict mode.** No `any`. No implicit types. Every Firestore document has a typed interface.

---

## What You Are Building

TriviaIRL is a real-time trivia hosting app for bar/venue events. Two user types:

- **Host** — authenticated via Firebase Auth. Creates games, builds question banks, controls game flow from a dashboard on their laptop or tablet.
- **Player** — anonymous (no account). Joins via 6-digit code or QR code on their phone, submits answers in real time, sees a live leaderboard.

The app has two fully separate UI surfaces:
- **Host UI** — desktop/tablet, dense, control-heavy
- **Player UI** — mobile-first (375px target), minimal, one action per screen

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14+ (App Router) |
| Language | TypeScript (strict mode) |
| Database / Realtime | Firebase Firestore |
| Auth | Firebase Auth (hosts only — Google + email/password) |
| Storage | Firebase Storage |
| Styling | Tailwind CSS |
| Components | shadcn/ui (dark mode) |
| Hosting | Vercel |
| External API | Open Trivia DB — `https://opentdb.com/api.php` |
| Payments | Stripe — data model only, not wired in v1 |
| QR Codes | `qrcode.react` |
| HTML entity decode | `he` npm package |

---

## Design System — Implement Exactly

### Fonts (Google Fonts — load in global layout)
```
Rajdhani: 400, 500, 600, 700         — display, headings, buttons, scores, timer
Barlow Condensed: 400, 600, 700, 800  — labels, tags, nav, table headers
Barlow: 400, 500, 600                 — body copy, descriptions, helper text
```

### CSS Variables (define in globals.css)
```css
--yellow:  #f5c800;   /* scores, logo, highlights, CTA backgrounds */
--orange:  #ff6500;   /* primary action buttons, player avatars */
--cyan:    #00e5ff;   /* selected states, category tags, secondary CTAs */
--magenta: #ff2d78;   /* timer danger ≤8s, destructive actions, wrong answers */
--blk:     #0a0a0a;   /* page background */
--dark:    #111111;   /* nav, section backgrounds */
--panel:   #181818;   /* panel surfaces */
--card:    #1e1e1e;   /* card surfaces */
--text:    #f0ede0;   /* primary text */
--muted:   #77776f;   /* secondary/disabled text */
```

### Tailwind Extension (tailwind.config.ts)
Extend the Tailwind theme to include all CSS variables as named colors so they can be used as utility classes (`bg-yellow`, `text-cyan`, `border-orange`, etc.).

### Cel-Shading Rules (mandatory, apply everywhere)
- All cards: `border: 2.5px solid #000; box-shadow: 4px 4px 0 #000;` — no blur, ever
- All buttons: `border: 3px solid #000; box-shadow: 4px 4px 0 #000;`
- Button hover: `transform: translate(-2px, -2px); box-shadow: 6px 6px 0 #000;`
- Button active: `transform: translate(2px, 2px); box-shadow: 1px 1px 0 #000;`
- Border radius: 3–4px on cards/buttons; 40px on phone frame only
- Halftone texture on hero/phone frame backgrounds: `radial-gradient(circle, #ffffff07 1px, transparent 1px)` at `background-size: 6px 6px`
- Hard shadows only — never `box-shadow: 0 4px 12px rgba(...)` anywhere in the codebase

### Logo Rule
`TriviaIRL` — "Trivia" always in `--yellow`, "IRL" always in `--cyan`. Apply everywhere the logo appears.

### Accent Color Usage
- Yellow → scores, points, logo, stat numbers, Pro badge
- Orange → primary CTA buttons, player avatars, start game
- Cyan → selected answer, category tags, secondary CTAs
- Magenta → timer ≤8s, destructive buttons, wrong answer states

### Design Reference
Two approved mockup screens exist as canonical visual references:
- **Player Question Screen** — phone frame, timer, answer buttons, lock-in flow
- **Landing Page** — nav, hero, how-it-works cards, features, pricing, footer

Match spacing, component sizing, and visual weight from these references exactly. If in doubt, be more angular and more high-contrast, not less.

---

## File Structure

Scaffold this exact structure before writing feature code:

```
/app
  layout.tsx                          # Global layout — fonts, metadata, providers
  page.tsx                            # Landing page
  /host
    layout.tsx                        # Host layout — requires auth, sidebar nav
    /dashboard/page.tsx               # Host home — game list, stats, create CTA
    /game/new/page.tsx                # Create new game form
    /game/[gameId]/page.tsx           # Live host dashboard (lobby → active → end)
    /questions/page.tsx               # Question bank list
    /questions/[bankId]/page.tsx      # Bank detail + question CRUD
    /rounds/page.tsx                  # Round list
    /rounds/[roundId]/page.tsx        # Round builder
  /play
    page.tsx                          # Player join — enter 6-digit code
    /[gameId]/page.tsx                # Player game view (all states)
  /api
    /opentdb/route.ts                 # Proxy + normalize OpenTDB
    /games/route.ts                   # Game creation + validation
    /scoring/route.ts                 # Server-side score calculation

/components
  /host
    Sidebar.tsx
    GameCard.tsx
    LiveQuestionPanel.tsx
    SubmissionTracker.tsx
    AnswerRevealPanel.tsx
    HostLeaderboard.tsx
    RoundBuilder.tsx
    QuestionBankManager.tsx
    OpenTDBImportModal.tsx
  /player
    JoinCodeInput.tsx
    ModeSelector.tsx
    PlayerLobby.tsx
    QuestionScreen.tsx
    AnswerLockedScreen.tsx
    AnswerRevealScreen.tsx
    PlayerLeaderboard.tsx
    GameOverScreen.tsx
  /shared
    Logo.tsx
    Timer.tsx
    Leaderboard.tsx
    QRCodePanel.tsx
    ScoreChip.tsx
    PlayerAvatar.tsx
    RoundBadge.tsx
    CategoryTag.tsx

/lib
  firebase.ts                         # Firebase app init (singleton)
  firestore.ts                        # Typed Firestore helpers + collection refs
  firebaseAdmin.ts                    # Admin SDK for server-side scoring
  opentdb.ts                          # OpenTDB fetch, normalize, decode
  scoring.ts                          # Score formula + team avg calculation
  gameHelpers.ts                      # Game state utilities, code generation
  hooks/
    useGame.ts                        # onSnapshot listener for game doc
    usePlayers.ts                     # onSnapshot listener for players subcollection
    useAnswers.ts                     # onSnapshot listener for answers subcollection

/types
  index.ts                            # All shared TypeScript interfaces (see below)

/middleware.ts                        # Protect /host/* routes — redirect to login if unauthenticated
```

---

## TypeScript Interfaces

Define all of these in `/types/index.ts` before writing any feature code:

```typescript
export type GameStatus = 'lobby' | 'active' | 'ended';
export type GameMode = 'solo' | 'teams' | 'mixed';
export type QuestionState = 'waiting' | 'open' | 'closed' | 'revealed';
export type PlayerMode = 'solo' | 'team';
export type Plan = 'free' | 'pro';
export type QuestionSource = 'manual' | 'opentdb';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Game {
  gameId: string;
  hostId: string;
  status: GameStatus;
  gameMode: GameMode;
  currentRoundIndex: number;
  currentQuestionIndex: number;
  questionState: QuestionState;
  timerEndsAt: number | null;        // Unix ms timestamp
  rounds: RoundRef[];
  createdAt: number;
  plan: Plan;
}

export interface RoundRef {
  roundId: string;
  name: string;
}

export interface Player {
  playerId: string;
  displayName: string;
  mode: PlayerMode;
  teamName: string | null;
  totalScore: number;
  roundScores: Record<string, number>;
  joinedAt: number;
}

export interface Team {
  teamName: string;
  memberIds: string[];
  totalScore: number;
  roundScores: Record<string, number>;
}

export interface Answer {
  playerId: string;
  questionId: string;
  selectedOptionIndex: number;
  answeredAt: number;
  isCorrect: boolean;
  pointsEarned: number;
}

export interface Question {
  questionId: string;
  questionText: string;
  options: string[];
  correctAnswerIndex: number;
  pointValue: number;
  timerSeconds: number;
  category: string;
  source: QuestionSource;
  difficulty?: Difficulty;
  createdAt: number;
}

export interface QuestionBank {
  bankId: string;
  name: string;
  description: string;
  createdAt: number;
}

export interface Round {
  roundId: string;
  name: string;
  questionIds: string[];
  bankId: string;
  createdAt: number;
}

export interface Host {
  hostId: string;
  email: string;
  displayName: string;
  plan: Plan;
  gamesThisMonth: number;
  stripeCustomerId: string | null;
  createdAt: number;
}

export interface LeaderboardEntry {
  id: string;
  displayName: string;
  type: 'solo' | 'team';
  totalScore: number;
  memberCount?: number;
}

export interface OpenTDBQuestion {
  category: string;
  type: string;
  difficulty: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}
```

---

## Firestore Data Model

### Collections

```
games/{gameId}                                    # Game root doc
games/{gameId}/players/{playerId}                 # Player docs
games/{gameId}/teams/{teamName}                   # Team docs (teamName as doc ID)
games/{gameId}/answers/{questionId}_{playerId}    # Answer docs (composite ID)

hosts/{hostId}                                    # Host profile
hosts/{hostId}/questionBanks/{bankId}             # Question bank metadata
hosts/{hostId}/questionBanks/{bankId}/questions/{questionId}  # Questions
hosts/{hostId}/rounds/{roundId}                   # Round definitions
```

### Security Rules

Write and deploy these Firestore Security Rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Hosts can read/write their own profile
    match /hosts/{hostId} {
      allow read, write: if request.auth != null && request.auth.uid == hostId;

      match /questionBanks/{bankId} {
        allow read, write: if request.auth != null && request.auth.uid == hostId;
        match /questions/{questionId} {
          allow read, write: if request.auth != null && request.auth.uid == hostId;
        }
      }

      match /rounds/{roundId} {
        allow read, write: if request.auth != null && request.auth.uid == hostId;
      }
    }

    match /games/{gameId} {
      // Host can read and write their own game
      allow read, write: if request.auth != null
        && resource.data.hostId == request.auth.uid;

      // Anyone can read game doc (players need to read game state)
      allow read: if true;

      match /players/{playerId} {
        // Anyone can read players list
        allow read: if true;
        // Player can only create/update their own doc
        allow create, update: if request.resource.data.playerId == playerId;
      }

      match /teams/{teamName} {
        allow read: if true;
        allow create, update: if true; // Players create/join teams at join time
      }

      match /answers/{answerId} {
        allow read: if true;
        // Players can only write once — no updates after creation
        allow create: if request.resource.data.playerId is string;
        allow update: if false;
      }
    }
  }
}
```

---

## Scoring System

### Formula
```typescript
// /lib/scoring.ts

export function calculatePoints(
  pointValue: number,
  timerSeconds: number,
  timeRemaining: number, // seconds left when answered
  isCorrect: boolean
): number {
  if (!isCorrect) return 0;
  const minimum = Math.floor(pointValue * 0.1);
  const earned = Math.floor(pointValue * (timeRemaining / timerSeconds));
  return Math.max(earned, minimum);
}

export function calculateTeamScore(memberScores: number[]): number {
  if (memberScores.length === 0) return 0;
  const total = memberScores.reduce((sum, s) => sum + s, 0);
  return Math.floor(total / memberScores.length);
}
```

### Server-Side Execution
- Scoring runs in `/api/scoring/route.ts` — a POST endpoint called by the host dashboard when "Reveal Answer" is clicked
- The route reads all answer documents for the current question, calculates points, and batch-writes results back to Firestore
- It also recalculates and updates team scores in `games/{gameId}/teams/{teamName}`
- Never accept point values from the client — always recalculate server-side

---

## Timer Architecture

This is the most complex real-time piece — implement carefully:

1. **Host starts question** → writes to Firestore:
   ```typescript
   await updateDoc(gameRef, {
     questionState: 'open',
     timerEndsAt: Date.now() + (timerSeconds * 1000),
   });
   ```

2. **All clients** (host + players) read `timerEndsAt` from their `onSnapshot` listener and run a local `setInterval` countdown:
   ```typescript
   const remaining = Math.max(0, Math.floor((timerEndsAt - Date.now()) / 1000));
   ```

3. **Auto-close:** Host dashboard watches for `remaining === 0` and writes `questionState: 'closed'` if the host hasn't manually closed yet.

4. **Manual override:** Host clicks "Override / Close Early" → writes `questionState: 'closed'` immediately.

5. **Answer submission gate:** Players can only submit when `questionState === 'open'`. Enforce in both UI (disable button) and Firestore Security Rules (write blocked when closed).

6. **Timer color rule:** `remaining <= 8` → switch timer number and bar to `--magenta` (`#ff2d78`).

---

## 6-Digit Game Code Generation

```typescript
// /lib/gameHelpers.ts

export function generateGameCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function generateUniqueCode(
  db: Firestore
): Promise<string> {
  let code = generateGameCode();
  let attempts = 0;
  while (attempts < 10) {
    const snap = await getDoc(doc(db, 'games', code));
    if (!snap.exists()) return code;
    code = generateGameCode();
    attempts++;
  }
  throw new Error('Could not generate unique game code');
}
```

---

## OpenTDB Integration

### Proxy Route (`/api/opentdb/route.ts`)
- Forward requests to `https://opentdb.com/api.php` to avoid CORS
- Always append `type=multiple`
- Decode all HTML entities using the `he` package before returning
- Normalize response to internal `Question` schema:
  ```typescript
  import he from 'he';

  function normalizeOpenTDBQuestion(q: OpenTDBQuestion): Omit<Question, 'questionId' | 'createdAt'> {
    const allAnswers = [...q.incorrect_answers, q.correct_answer].map(he.decode);
    // Shuffle answers
    for (let i = allAnswers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allAnswers[i], allAnswers[j]] = [allAnswers[j], allAnswers[i]];
    }
    const correctAnswerIndex = allAnswers.indexOf(he.decode(q.correct_answer));
    return {
      questionText: he.decode(q.question),
      options: allAnswers,
      correctAnswerIndex,
      pointValue: 1000,
      timerSeconds: 30,
      category: he.decode(q.category),
      difficulty: q.difficulty as Difficulty,
      source: 'opentdb',
    };
  }
  ```
- Category list: cache the result of `https://opentdb.com/api_category.php` in memory (module-level) — it rarely changes
- Handle OpenTDB rate limiting: if response code is `5` (rate limit), return a 429 with retry guidance
- Handle OpenTDB session tokens to avoid repeat questions within a session

---

## Feature Build Order

Build in this exact order. Complete each feature fully (including tests) before moving to the next.

### Phase 1 — Foundation
1. Next.js project init with TypeScript strict, Tailwind, shadcn/ui dark mode
2. Firebase init (`/lib/firebase.ts`, `/lib/firebaseAdmin.ts`)
3. All TypeScript interfaces (`/types/index.ts`)
4. CSS variables in `globals.css`, Tailwind config extension
5. Global font loading in `app/layout.tsx`
6. Shared components: `Logo`, `PlayerAvatar`, `ScoreChip`, `CategoryTag`, `RoundBadge`
7. Firebase Auth setup — host login/signup pages
8. Host auth middleware (`middleware.ts` — protect `/host/*`)
9. Firestore security rules — deploy before any data writes

### Phase 2 — Question Bank & Round Builder
10. Host profile creation on first login (write `hosts/{hostId}` doc)
11. Question bank CRUD (`/host/questions`, `/host/questions/[bankId]`)
12. Manual question form — create, edit, delete questions
13. OpenTDB proxy route (`/api/opentdb`)
14. OpenTDB import modal — category picker, difficulty, preview, import
15. Round builder (`/host/rounds/[roundId]`) — add questions, drag to reorder, set point values + timers
16. Round list (`/host/rounds`)

### Phase 3 — Game Creation & Lobby
17. Game creation form (`/host/game/new`) — name, mode (solo/teams/mixed), round selection
18. Game code generation — unique 6-digit code as Firestore doc ID
19. QR code generation component (`QRCodePanel`)
20. Host lobby view (`/host/game/[gameId]` in lobby state) — show code, QR, player list
21. Player join page (`/play`) — 6-digit code input (6 individual boxes)
22. Player name + mode selection — solo vs team, team name input
23. Player Firestore write on join — create player doc, create/join team doc if team mode
24. Player lobby waiting screen — live player list via `onSnapshot`
25. Host "Start Game" button — writes `status: 'active'`, `questionState: 'waiting'`

### Phase 4 — Live Game Flow
26. `useGame` hook — `onSnapshot` on game doc, typed
27. `usePlayers` hook — `onSnapshot` on players subcollection
28. `useAnswers` hook — `onSnapshot` on answers subcollection
29. Host live dashboard — question panel, submission tracker, control panel
30. Timer component — countdown from `timerEndsAt`, yellow → magenta at ≤8s
31. Host "Open Question" → writes `questionState: 'open'` + `timerEndsAt`
32. Player question screen — shows question + 4 answers + timer
33. Player answer submission — writes answer doc, locks UI
34. Player "Locked In" waiting screen
35. Host submission tracker — live count of answered players, per-option counts
36. Host "Override / Close Early" → writes `questionState: 'closed'`
37. Auto-close on timer expiry (host dashboard watches `remaining === 0`)
38. Scoring API route (`/api/scoring`) — called by host on "Reveal Answer"
39. Host "Reveal Answer" → calls scoring API, then writes `questionState: 'revealed'`
40. Player answer reveal screen — correct/incorrect states, points earned
41. Host answer reveal panel — breakdown chart per option, top scorers
42. Leaderboard calculation — solo + team unified ranking (team avg score)
43. Host "Push Leaderboard" → writes leaderboard state to game doc
44. Player leaderboard screen — ranked list, own entry highlighted
45. Host "Next Question" → increments `currentQuestionIndex`, resets `questionState: 'waiting'`
46. Host "Next Round" → increments `currentRoundIndex`, resets question index
47. Host "End Game" → writes `status: 'ended'`
48. Game over screen (player) — final leaderboard, thanks message, cross-promo
49. Host end game view — final leaderboard, export placeholder, new game CTA

### Phase 5 — Dashboard & Monetization Gate
50. Host dashboard home (`/host/dashboard`) — stats, recent games, create CTA
51. Free tier gate — check `gamesThisMonth >= 3` before game creation; show upgrade CTA if blocked
52. `gamesThisMonth` increment on game creation
53. Plan badge in sidebar (Free / Pro)
54. Upgrade CTA links to `/upgrade` (coming soon page — static in v1)

### Phase 6 — Landing Page
55. Landing page (`/`) — hero, how it works, features, pricing, footer
56. Co-branding: BingoIRL cross-promotion in nav and footer

---

## Testing Requirements

Use **Vitest** for unit tests and **Playwright** for E2E. Write tests for each phase before moving to the next.

### Unit Tests (Vitest)

```
/tests/unit/
  scoring.test.ts          # calculatePoints, calculateTeamScore — full coverage
  gameHelpers.test.ts      # generateGameCode, generateUniqueCode
  opentdb.test.ts          # normalizeOpenTDBQuestion — HTML entity decoding, shuffle, correctAnswerIndex
  timer.test.ts            # Timer component — color transition at ≤8s, auto-close trigger
```

**scoring.test.ts must cover:**
- Correct answer at full speed (timeRemaining === timerSeconds) → pointValue
- Correct answer at half speed → floor(pointValue * 0.5)
- Correct answer at last second → minimum (floor(pointValue * 0.1))
- Wrong answer → 0
- No answer (timeRemaining === 0) → 0
- Team score = average of member scores (integer floor)
- Single member team score = member score
- Empty team → 0

**opentdb.test.ts must cover:**
- HTML entities decoded in question text (`&amp;` → `&`, `&#039;` → `'`, `&quot;` → `"`)
- HTML entities decoded in all answer options
- `correctAnswerIndex` points to the correct answer after shuffle
- All 4 options are present in output
- `source` is always `'opentdb'`
- Default `pointValue` is 1000, default `timerSeconds` is 30

### E2E Tests (Playwright)

```
/tests/e2e/
  host-auth.spec.ts        # Sign up, log in, redirect to dashboard
  game-creation.spec.ts    # Create game, select mode, add rounds, get code
  player-join.spec.ts      # Enter code, set name, select solo/team, reach lobby
  full-game.spec.ts        # Complete game: host creates → players join → questions → scoring → leaderboard
  free-tier-gate.spec.ts   # 3 games created → 4th is blocked with upgrade CTA
```

**full-game.spec.ts must verify:**
- Host creates game and sees lobby with code + QR
- Two players join (one solo, one team)
- Host starts game — both players see question screen
- Player 1 answers immediately (should score higher)
- Player 2 answers near end of timer (should score lower)
- Host closes question, reveals answer
- Both players see correct answer reveal with individual points
- Host pushes leaderboard — both players see ranked list
- Player 1 ranks above Player 2 (speed-based scoring validated)
- Host ends game — final leaderboard shown on both player devices

### Test Utilities

Create a `tests/fixtures/` directory with:
- `mockGame.ts` — factory function for test Game documents
- `mockPlayer.ts` — factory for Player documents
- `mockQuestion.ts` — factory for Question documents with known correct answers
- `mockAnswer.ts` — factory for Answer documents with specified timing

---

## Environment Variables

Create `.env.local` template (`.env.local.example`) with all required variables:

```bash
# Firebase Client
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Firebase Admin (server-side scoring)
FIREBASE_ADMIN_PROJECT_ID=
FIREBASE_ADMIN_CLIENT_EMAIL=
FIREBASE_ADMIN_PRIVATE_KEY=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Key Implementation Constraints

### Things you must never do
- Never calculate or accept score values from the client
- Never use blurred box shadows anywhere (`box-shadow: 0 4px 12px rgba(...)` is banned)
- Never use `any` type in TypeScript
- Never poll Firestore — always use `onSnapshot`
- Never store the correct answer index on the client before the host reveals it (fetch it server-side during scoring)
- Never allow answer submissions when `questionState !== 'open'` — enforce in both UI and security rules
- Never use fonts other than Rajdhani, Barlow Condensed, and Barlow

### Things you must always do
- Decode HTML entities from OpenTDB before storing or displaying
- Unsubscribe from all Firestore `onSnapshot` listeners in `useEffect` cleanup functions
- Show loading states during any async operation (joining, submitting, fetching questions)
- Handle Firebase errors gracefully — show user-friendly error messages, not raw error objects
- Use the Firebase Admin SDK for all server-side Firestore writes (scoring route)
- Validate the 6-digit code format on the client before hitting Firestore

---

## Out of Scope for v1 (Do Not Build)
- Player accounts or authentication
- Post-game exportable reports
- Stripe payment processing (scaffold data model only)
- Free text answer questions
- Audio or sound effects
- Host-to-player chat
- Game history / analytics beyond the current session leaderboard

---

## Definition of Done

The app is complete when all of the following are true:

- [ ] Host can sign up, log in, and reach their dashboard
- [ ] Host can create a question bank with manual questions
- [ ] Host can import questions from OpenTDB (category + difficulty filter)
- [ ] Host can build a round from banked questions with custom point values and timers
- [ ] Host can create a game (solo / teams / mixed mode) and reach the lobby
- [ ] Players can join via 6-digit code, set a name, pick solo or team, and reach the lobby
- [ ] Host can start the game — all players see the first question simultaneously
- [ ] Timer counts down on all devices in sync; turns magenta at ≤8s
- [ ] Players can select and lock in an answer; UI is disabled after locking
- [ ] Timer auto-closes submissions when it expires
- [ ] Host can manually override (close early) at any time
- [ ] Host reveals answer — scoring API runs server-side, points written to Firestore
- [ ] Players see correct/incorrect reveal with points earned this question
- [ ] Leaderboard is accurate: speed-based individual scoring; team score = member average
- [ ] Host can push leaderboard to all player devices
- [ ] Host can advance through all questions and rounds
- [ ] Host ends game — final leaderboard shown on all devices
- [ ] Free tier gate blocks game creation after 3 games/month with upgrade CTA
- [ ] All unit tests pass
- [ ] All E2E tests pass
- [ ] App deploys to Vercel without errors
- [ ] Firestore security rules deployed and verified