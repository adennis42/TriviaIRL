# TriviaIRL — Engineering Agent Context

**Single source of truth for engineering agents building TriviaIRL.** This document captures the product, design system, screen-by-screen specs, data model, real-time behavior, and edge cases. The HTML/JSX mockups in this repo are the visual reference; this doc is the behavioral reference. When in doubt, the mockups define how it *looks* and this doc defines how it *works*.

---

## 1. Product Overview

### What it is
TriviaIRL is a real-time trivia hosting web app for bars, venues, and casual gatherings. One person — the **host** — runs the game from a laptop or tablet. Anywhere from 1 to 100+ **players** join from their phones via a 6-digit code or QR scan. No accounts, no app downloads.

### Core loop
1. Host creates a game, picks rounds, launches a lobby.
2. Players scan the QR or type the code at `triviairl.com/play`.
3. Host starts the game when ready.
4. For each question: host pushes question → players answer in real time within a countdown → host reveals → leaderboard updates.
5. After the final round, an end-of-game screen shows the winner.

### Scoring model (server-authoritative)
- Each question has a `maxPoints` and `timerSeconds`.
- A correct answer earns: `round(maxPoints * (1 - (responseSeconds / timerSeconds) * 0.6))`. Floor at `maxPoints * 0.4` so even slow correct answers feel rewarding.
- A wrong answer earns 0.
- No partial credit.
- Team scores are the sum of team members' points for that question, divided by `team.size`, then multiplied by `team.size` — i.e., teams average per-member then re-aggregate. (Decision: simpler than min/max/sum and rewards full participation.)
- All scoring happens on the server when the question closes. Clients never compute scores.

### Two surfaces
- **Player UI** — mobile-first, locked to 375px conceptually, single primary action per screen. Loud, gamey, easy to read at arm's length.
- **Host UI** — desktop/tablet, min 1024px, dense control panels, multi-column layouts, optimized for one operator.

---

## 2. Design System

### Aesthetic
Custom cel-shaded dark UI: hard black outlines, hard offset box-shadows (no blur), halftone dot overlays, saturated neon accents on near-black panels. The vibe is "premium game UI printed on thick cardstock." Angular, confident, slightly gritty — not cartoonish, not toy-like.

### Color tokens (CSS variables — already in `styles.css`)
```
--yellow:   #f5c800   /* Primary accent — scores, highlights, logo, CTA backgrounds */
--orange:   #ff6500   /* Primary action buttons, warnings, heat */
--cyan:     #00e5ff   /* Selected states, info, secondary accent, "IRL" in logo */
--magenta:  #ff2d78   /* Danger, timer low, destructive, wrong-answer reveal */
--green:    #4ade80   /* Correct-answer reveal */
--black:    #0a0a0a   /* Page background */
--dark:     #111111   /* Nav, section backgrounds */
--panel:    #181818   /* Slightly lighter panels */
--card:     #1e1e1e   /* Card surfaces */
--card-2:   #242424   /* Modal/elevated card */
--outline:  #000000   /* All borders and shadows */
--text:     #f0ede0   /* Primary text (warm off-white) */
--muted:    #77776f   /* Secondary text */
--muted-2:  #555550   /* Tertiary/disabled text */
```

**Accent rules (do not violate):**
- **Yellow** — scores, point values, logo "Trivia", winner accents, selected-nav highlight, Pro/Plan badges.
- **Orange** — primary CTAs ("Lock It In", "Start Game", "Launch Game", "Play Again"), avatars by default.
- **Cyan** — selected answer state, category tags, info borders, "IRL" in logo, secondary CTAs, correct-answer-confirmation overlays. **Selected answers are ALWAYS cyan**, never yellow or orange.
- **Magenta** — destructive ("End Game", "Delete"), wrong-answer reveal, timer at ≤8s, "Game Complete" badge.
- **Green** — only used for the correct-answer reveal state (player + host).
- Never use more than 2 accent colors in a single component.

### Typography
Three Google fonts:
- **Rajdhani** (400, 500, 600, 700) — display, headings, button labels, score numbers, timer, badges, player names. Always uppercase with `letter-spacing: 0.04em–0.12em`.
- **Barlow Condensed** (400, 600, 700, 800) — labels, metadata, tags, table headers, nav items. Uppercase, `letter-spacing: 0.10em–0.18em`.
- **Barlow** (400, 500, 600) — body copy, question text, descriptions, helper text. Sentence case.

CSS classes on the `.tirl` root provide these:
- `.display` / `.ui-h` / `.btn` / `.num` / `.logo` → Rajdhani 700 uppercase
- `.label` / `.tag` / `.meta` → Barlow Condensed 700 uppercase
- `.body` → Barlow 400

### Cel-shading rules — apply universally
- All interactive elements: `border: 2.5px solid #000` (buttons can be 3px).
- All cards: `box-shadow: 4px 4px 0 #000` (hard offset, never blurred).
- All shadows are hard offset on `#000` — no `rgba()`, no `blur` radius. Ever.
- Buttons on hover: `translate(-2px, -2px)` and grow shadow to `6px 6px`.
- Buttons on active/press: `translate(2px, 2px)` and shrink shadow to `1px 1px`.
- Card depth illusion: pseudo-element `::before` with black background offset behind card (`.card-deep` class does this).
- Halftone texture on phone frames + hero areas: `radial-gradient(circle, #ffffff07 1px, transparent 1px)` at `6px 6px`.
- Background grid (optional accent): 40px grid of `#ffffff04` lines.
- Corner bracket marks on hero sections: thin `#222` L-shaped borders at corners (use `.corners` + `<span class="crn-bl/br" />` pattern).
- Border radius: minimal — `3–4px` for cards/buttons, `40px` for phone frames only.
- Section dividers: `height: 3px; background: #000`.

### Component classes (in `styles.css`)
- `.tirl` — root wrapper, applies font + colors.
- `.phone` / `.phone-notch` / `.phone-inner` — 375×812 phone frame with halftone.
- `.card`, `.card-deep` — card surfaces.
- `.btn`, `.btn-primary` (orange), `.btn-yellow`, `.btn-cyan` (outline), `.btn-danger` (magenta), `.btn-ghost`, `.btn-disabled`, `.btn-block`.
- `.pill`, `.pill-cyan`, `.pill-orange`, `.pill-magenta`, `.pill-dark`.
- `.tag-outline` — cyan-bordered category tag.
- `.input`, `.input.focused` — text inputs with cyan focus ring.
- `.avatar` (sizes: default, `.lg`, `.sm`; colors: `.cyan`, `.yellow`, `.magenta`, `.green`).
- `.halftone`, `.grid-bg` — texture utilities.
- `.corners` — corner bracket utility (combine with `.crn-tl/.crn-tr/.crn-bl/.crn-br` spans).
- `.divider` — 3px black horizontal rule.
- `.host-shell`, `.sidebar`, `.side-logo`, `.side-nav`, `.side-foot`, `.main` — host page layout.
- `.stat` — stat tile with big yellow number + small muted caption.
- `.tbl` — table styles.
- `.checkmark-tile` — small filled checkmark.
- `.progress` + `.fill` — progress bar with white highlight stripe.
- `.pulse-dot` — animated cyan dot.
- `.eyebrow` — outlined cyan eyebrow tag.
- `.ltile` — answer-letter tile (variants: `.cyan`, `.green`, `.magenta`).

### Logo
The wordmark is `<span class="logo-wm"><span class="y">Trivia</span><span class="c">IRL</span></span>` — yellow + cyan, Rajdhani 700, never rendered any other way.

---

## 3. Architecture & Stack Recommendations

The mockup repo is React + Babel-in-browser purely for visual review. For the real build:

### Suggested stack
- **Frontend:** React 18 + Vite + TypeScript. Tailwind is fine if the team prefers, but the existing `styles.css` is a complete design system and can drop in as-is — keep the CSS variable approach.
- **State:** Zustand or Redux Toolkit for client state. React Query or SWR for server fetches. Real-time via WebSocket (see below).
- **Backend:** Node + Fastify or NestJS, or Go, or anything with first-class WebSocket support. Postgres for persistence. Redis for game state + pub/sub.
- **Real-time:** WebSocket server. One topic per game (`game:{gameId}`). Players and host both subscribe. Server is the source of truth — clients are dumb renderers.
- **Hosting:** Fly.io, Railway, or Render for v1. Cloudflare for static + DNS.

### Routing (suggested)
- `/` — marketing landing page (already approved, build separately).
- `/play` — player join screen (P1).
- `/play/:code` — auto-fills code, jumps to P2 if valid.
- `/p/:gameId` — player session (P2 → P3 → P4 → P5 → P6 → P7 → P8). State machine derives which to render.
- `/host` — host dashboard (H1). Requires auth.
- `/host/games/new` — H2.
- `/host/games/:id/lobby` — H3.
- `/host/games/:id/live` — H4 / H5 (mode toggles based on phase).
- `/host/games/:id/end` — H9.
- `/host/banks` — H6.
- `/host/banks/:id` — H6 detail.
- `/host/rounds/new` — H8.
- `/host/rounds/:id` — H8 edit.

### WebSocket message types (suggested)
**Server → Client:**
- `lobby_update` — `{ players: [...], teams: [...], gameId, code, config }`
- `question_start` — `{ questionId, text, answers, category, maxPoints, timerSeconds, startedAt }` (no correct answer included for players; included for host)
- `submission_update` — `{ answeredCount, totalPlayers, perAnswerCounts: {A,B,C,D} }` (host only — players don't see live counts)
- `question_close` — `{ questionId, correctAnswer, breakdown, fastestPlayers }`
- `personal_result` — `{ correct, pointsEarned, responseSeconds, totalScore }` (per-player, sent at close)
- `leaderboard_push` — `{ ranks: [...], roundContext, nextAction }`
- `game_over` — `{ finalRanks, winner, stats }`
- `error` — `{ code, message }`

**Client → Server (player):**
- `join_lobby` — `{ code, displayName, mode: 'solo'|'team', teamName? }`
- `submit_answer` — `{ questionId, answer: 'A'|'B'|'C'|'D' }`
- `leave_game` — `{}`

**Client → Server (host):**
- `create_game` — `{ name, mode, roundIds }`
- `start_game` — `{ gameId }`
- `start_question` — `{ gameId, questionId }`
- `close_question_early` — `{ gameId }`
- `add_time` — `{ gameId, seconds }`
- `reveal_answer` — `{ gameId }`
- `push_leaderboard` — `{ gameId }`
- `next_question` — `{ gameId }`
- `end_round` — `{ gameId }`
- `end_game` — `{ gameId }`

### Server-authoritative timer
The server holds the canonical `questionStartedAt` timestamp. Clients render their own countdown from `(serverNow - startedAt)` derived from the `question_start` payload. Clients clamp to never show <0 and never accept submissions after their local clamp — but the server is the only authority that *actually* counts a submission valid. Allow ~500ms grace on the server for network jitter.

---

## 4. Data Model

### `users` (host accounts)
```
id          uuid pk
email       text unique
display_name text
plan        enum('free','pro')
created_at  timestamptz
```

### `question_banks`
```
id          uuid pk
owner_id    uuid fk → users.id
name        text
created_at  timestamptz
updated_at  timestamptz
```

### `questions`
```
id            uuid pk
bank_id       uuid fk → question_banks.id
text          text
category      text          -- e.g. "Cell Biology"
correct       enum('A','B','C','D')
answers       jsonb         -- { A: text, B: text, C: text, D: text }
max_points    int default 1000
timer_seconds int default 20
source        enum('manual','opentdb')
opentdb_id    text nullable -- for dedup
difficulty    enum('easy','medium','hard') nullable
created_at    timestamptz
```

### `rounds`
```
id          uuid pk
owner_id    uuid fk → users.id
name        text
theme_color text default '#00e5ff'
created_at  timestamptz
updated_at  timestamptz
```

### `round_questions` (ordered join)
```
round_id      uuid fk
question_id   uuid fk
position      int            -- 0-indexed
override_pts  int nullable   -- override question.max_points for this round
override_timer int nullable
primary key (round_id, position)
```

### `games`
```
id          uuid pk
host_id     uuid fk → users.id
name        text
code        char(6) unique  -- 6-digit, regenerated on collision
mode        enum('solo','team','mixed')
status      enum('lobby','live','ended')
config      jsonb           -- { defaultTimer, lateJoiners, ... }
created_at  timestamptz
started_at  timestamptz nullable
ended_at    timestamptz nullable
```

### `game_rounds` (ordered)
```
game_id     uuid fk
position    int
round_id    uuid fk
primary key (game_id, position)
```

### `game_players`
```
id            uuid pk
game_id       uuid fk
display_name  text
mode          enum('solo','team')
team_id       uuid nullable fk → game_teams.id
session_token text         -- player auth (cookie/localStorage)
joined_at     timestamptz
score         int default 0
correct_count int default 0
total_response_ms int default 0
```

### `game_teams`
```
id          uuid pk
game_id     uuid fk
name        text
score       int default 0
unique (game_id, name)
```

### `game_questions` (snapshot of state per question)
```
id            uuid pk
game_id       uuid fk
question_id   uuid fk
position      int
status        enum('pending','active','closed','revealed')
started_at    timestamptz nullable
closed_at     timestamptz nullable
revealed_at   timestamptz nullable
```

### `submissions`
```
id              uuid pk
game_question_id uuid fk
player_id       uuid fk → game_players.id
answer          enum('A','B','C','D')
submitted_at    timestamptz
response_ms     int           -- (submitted_at - game_questions.started_at).ms
points_earned   int           -- computed at close
correct         boolean
unique (game_question_id, player_id)  -- one submission per player per question
```

---

## 5. Player Screens — Behavioral Spec

### P1 — Join Screen
- 6-digit code input rendered as 6 individual character boxes. Auto-advance focus on input. Backspace moves to previous box.
- "Join Game" button disabled until 6 digits entered.
- On submit: validate code via API. On success → P2. On fail → shake + magenta border + helper text "No game found. Check the code."
- Helper: "No account needed · No app to download".
- If URL is `/play/:code`, prefill and auto-validate.

### P2 — Name + Mode
- Loads game name + current player count from API once code validated.
- Name input — 2-20 chars, no profanity filter v1, just trim whitespace.
- Mode cards: Solo / Team. Selected card → cyan border + cyan shadow + cyan letter tile.
- If Team selected, team input appears with autocomplete from existing team names. Selecting an existing one joins it; typing a new one creates it on submit.
- "Join the Game" sends `join_lobby` over WebSocket. On ack → P3.

### P3 — Lobby
- Game code shown prominently (so a friend running late can see it on the player's phone).
- Player's own card highlighted with cyan border + "You" pill.
- Live player list updates via `lobby_update`. Sort by join time, ascending.
- Each row: avatar (initials, color hashed from name), display name, mode tag (cyan "SOLO" or muted team name).
- "Waiting for host to start..." pulsing dot at bottom.
- When host starts → push P4 via `question_start`.

### P4 — Question
- Top row: TriviaIRL logo (left), Round badge (center, yellow), Q count (right, e.g. "3 / 8").
- Player bar: avatar + name (left), cumulative score chip (right, yellow bg).
- Timer card: countdown number (Rajdhani 700, large), progress bar, "Up to N pts" pill, "Faster = More" caption.
- Timer color: `--yellow` normally, `--magenta` when remaining ≤ 8s. Fill bar matches.
- Question card: cyan category tag + question text (Rajdhani 700, large, balance wrap).
- 4 answer buttons: letter tile (A/B/C/D) + answer text. Default: yellow letter on dark tile. Selected: cyan tile + cyan border + cyan shadow + light cyan bg tint.
- "Lock It In" button: orange primary, full width, disabled until selection.
- On lock: send `submit_answer` → optimistically transition to P5.
- If server rejects (timeout, duplicate, etc.) → toast + return to selection state.

### P5 — Locked / Waiting
- Full-screen dim overlay over the dimmed P4 (the dimmed background is intentional — orients player without distracting).
- Centered confirmation card with cyan checkmark tile, "Locked In" heading, the player's chosen answer ("B · The Mitochondria"), and "Waiting for host to reveal..." with pulsing dot.
- Subtle stat: "Locked in 4.2s · 9 of 14 answered" (the answered count is fine to show players — it's aggregate, not per-answer breakdown).

### P6 — Reveal (correct + wrong variants)
- Triggered by `question_close` + `personal_result`.
- **Correct:** green border on result card, "Correct!" in green Rajdhani, "+N pts" in big yellow, speed indicator pill, rank-this-question pill ("3rd fastest"). Player's answer in answer list highlighted with green tile + checkmark.
- **Wrong:** magenta border, "Incorrect" in magenta, "+0 pts" in muted gray. Player's wrong answer highlighted with magenta tile + ✕. The correct answer ALSO highlighted with green tile + checkmark.
- Bottom: "Leaderboard pushing in 3s..." with pulsing dot.

### P7 — Leaderboard
- Triggered by `leaderboard_push`. Round context shown ("After Round 2").
- Podium row: rank 2 / rank 1 (taller, center) / rank 3. Rank 1 = yellow accent, rank 2 = cyan, rank 3 = orange. Each card has the rank-number tile floating at top, avatar, name, mode tag, score in matching color.
- List below: rows for ranks 4+. Each row: rank, avatar, name, mode tag, score (yellow Rajdhani).
- Player's own row highlighted with cyan border, regardless of position. If they're outside top N visible, show their row pinned at the bottom of the list with a divider.
- Bottom: "Next question in 8s..." or "Waiting for host..." with pulsing dot.

### P8 — Game Over
- "Game Over" hero in big yellow Rajdhani with black text-shadow.
- Winner callout card: yellow border, big avatar, name, score in huge yellow, stat pills ("7/8 correct", "4.1s avg").
- Final standings list (compact rows, similar to P7).
- Two CTAs: "Play Again →" (orange, primary), "Host Your Own" (cyan outline).
- Footer line: "Thanks for playing TriviaIRL · Try BingoIRL next" (cyan accent on BingoIRL — placeholder cross-promo).

---

## 6. Host Screens — Behavioral Spec

### H1 — Dashboard
- Sidebar: logo, nav (Dashboard / My Games / Question Banks / Rounds / Settings), account block at bottom with avatar + name + venue + Pro badge.
- Active nav item: yellow left border + slight background tint + yellow text.
- Stats row: 4 tiles — games this month, players hosted, banks, rounds. Numbers in colored Rajdhani (yellow/cyan/orange/magenta), Barlow Condensed muted captions.
- Plan banner: yellow-bordered card showing plan status.
- Recent games table: name, date, players, rounds, status (LIVE in cyan, ENDED in muted), Open action button.
- "+ New Game" CTA in top-right.

### H2 — Create Game
- Two-column layout: left = config, right = round picker + summary.
- Game name input (focused by default).
- Mode selector: 3 cards — Solo Only / Teams Only / Mixed. Selected = yellow border + yellow shadow + yellow icon tile + yellow heading. Mixed is recommended default.
- Settings: default timer, late joiners (allowed/locked).
- Round picker: list of host's saved rounds. Selected ones show in numbered order with drag handles. Unselected ones in dashed-border rows below a "From Library" divider with "+ Add" buttons.
- Summary: total questions, est. time (sum of timers + ~5s pad per question for transitions).
- "Launch Game →" button creates the game (status = lobby) and routes to H3.

### H3 — Host Lobby
- Two-column: left = game code + QR + config + start button, right = live roster.
- Game code: huge yellow Rajdhani, letter-spaced. "Copy Code" button.
- QR code: black-on-white square, encodes `https://triviairl.com/play/{code}`.
- Config summary tile: mode, rounds, total questions, default timer.
- "Start Game →" button: orange primary, disabled until ≥1 player joined. Sends `start_game`.
- Live roster: scrollable list of all players with avatar, name, mode tag, join time. Player count + team count pills at top.

### H4 — Live Game (question view)
- Header: game name, round/question pills, player count, large timer in bordered tile, "Override · Close Early" button.
- 3-column grid:
  - **Left (1.1fr):** Question preview. Category tag, full question text, all 4 answers with the correct one highlighted green ("● Correct" label). Stats row: max points, timer, difficulty.
  - **Center (1.2fr):** Submissions tracker. Big "X / Y" count, progress bar (cyan fill). Per-answer breakdown bars (counts only — no percentages until reveal). Player avatar grid with green dot = answered, gray dot = pending. Faded avatars for pending.
  - **Right (0.85fr):** Controls stacked. Disabled "Reveal Answer" until close. "End Question Early" cyan button. "+10s to Timer" ghost button. After reveal: "Push Leaderboard" + "Next Question" become enabled. Bottom: "End Round" + "End Game" (magenta destructive).
- Timer counts down based on server-stamped `started_at`. When 0 → auto-close OR all players submitted → auto-close.

### H5 — Host Reveal
- Same header as H4, with "● Revealed" magenta pill.
- Left: question + the correct-answer callout (green border, green tile, big "B · The Mitochondria", correct percentage on right).
- Below callout: full breakdown bars with counts AND percentages. Correct row in green, others muted.
- Right: Top scorers this question (top 5). Rank, avatar, name, response time, "+N" points in yellow. Two stat tiles below: avg response time, correct rate.
- Top-right CTAs: "Push Leaderboard" (cyan) + "Next Question →" (orange primary).

### H6 — Question Bank Manager
- Two-column: left = bank list (320px), right = bank detail.
- Bank list: search input at top, scrollable list. Active bank = yellow left border + yellow heading + yellow-tinted background.
- Bank detail: editable name (Rajdhani large), "Import OpenTDB" + "+ Add Question" CTAs.
- 4 stat tiles: total questions, categories, manual-source count, OpenTDB-source count.
- Question table: checkbox, question text, category (cyan tag), points (yellow), timer, source (cyan if OpenTDB), Edit/Delete actions.
- Add Question opens an inline editor or modal with: text, A/B/C/D answers, correct selector, category, points, timer.

### H7 — OpenTDB Import Modal
- Renders as overlay on H6. Background blurred + dimmed.
- Modal card with thick black borders + cyan eyebrow.
- Filters: category dropdown (populated from `https://opentdb.com/api_category.php`), question count slider (1–50), difficulty button group (Any / Easy / Medium / Hard — selected = cyan filled).
- Preview list: fetched from `https://opentdb.com/api.php?...`. Each row: checkbox (default checked), question text, correct answer in green, difficulty pill (green/yellow/magenta).
- Footer: "X of Y selected" + Cancel + "Import N Questions →" primary.
- On import: persist to the active bank as `source: 'opentdb'`, dedupe by `opentdb_id`.

### H8 — Round Builder
- Header: round name input + theme color picker (4 swatches).
- Question list: drag-and-drop rows. Each row: drag handle (⋮⋮), position number, question text, source bank caption, inline-editable points + timer inputs, ✕ remove button.
- Right sidebar: round summary (questions, total points, est. time, banks used) + bank picker for adding more questions.
- "Save Round →" persists and returns to round library.

### H9 — End Game
- Header: "● Game Complete" magenta pill, big yellow "Friday Night Trivia" heading, meta line (date · rounds · questions · players · duration).
- Action row: Export Results (placeholder — ghost), Back to Dashboard (cyan), Start New Game → (orange).
- Podium row: 3 cards, center taller. #1 = yellow border + "★ Winner" label, #2 = cyan, #3 = orange. Each: rank tile floating at top, avatar, name, mode tag, score in matching color, stat pills (correct, avg time).
- Final standings table: rank, avatar + name, mode, correct count (green), avg response, score (yellow Rajdhani).
- Header pills above table: "Avg score 4,738" + "72% correct rate" (game-wide stats).

---

## 7. Realistic Placeholder Data

These names are used throughout the mockups — they're suggestions, swap them out for whatever fits production:

**Player names:** Vault Hunter, Tiny Tina, Zer0, Lilith, Mordecai, Roland, Claptrap, Maya, Axton, Salvador, Krieg, Gaige, Athena, Wilhelm.

**Team names:** The Mitochondrias, Sirens, Crimson Lance.

**Score distribution example (8-question game):** 1st ~7800, 2nd ~7200, 3rd ~6500, descending to ~1800 at the bottom of a 14-player pool. A typical question awards 800–980 to fastest correct, 0 to wrong.

**Question categories used:** Cell Biology, Astronomy, Chemistry, Geology, Physics, Earth Science, Biology, History 101, Geography, Pop Culture.

---

## 8. Edge Cases & Decisions

- **Late joiners:** if game.config.lateJoiners = true, players can join after start but only score from the next question forward. Their lobby entry shows a "joined mid-game" tag in the host roster.
- **Disconnects:** if a player's WebSocket drops mid-question, the server holds their current selection (if any) as their submission. If they reconnect before close, they can change it. After close, no changes.
- **Empty answer at close:** counts as wrong. 0 points. They appear in stats with no submission record.
- **Duplicate display names:** allowed within a game. Differentiate by avatar color (hash-based) and join-time tiebreaker.
- **Team rules:** a team is created when its name is first typed. Joining = exact-match on name (case-insensitive, trimmed). No invite codes, no team admin.
- **Code generation:** 6 random digits, regenerate on collision with active games. Codes can be reused after a game ends.
- **Free tier limits:** 3 games per calendar month. Surface as a banner on H1. Pro = unlimited.
- **OpenTDB API:** rate-limit to 1 request per 5s. Cache categories list for 24h. Decode HTML entities before storage (`&quot;` etc.).
- **Question with 2 answers:** OpenTDB has true/false questions. v1 normalizes these to A=True / B=False / C=blank / D=blank, and the player UI hides empty options. Or filter them out on import — host's choice.

---

## 9. Component Reuse Guide

When wiring real screens, lift these from the mockups directly:

| Component | File | What it gives you |
|---|---|---|
| `Logo` | `player-screens.jsx` | Wordmark with proper yellow/cyan split |
| `PhoneFrame` | `player-screens.jsx` | 375×812 frame with notch + halftone — for embedded mobile previews on host views, or strip it for the actual mobile app |
| `SidebarNav` | `host-screens.jsx` | Full sidebar with active state + account block |
| `TopBar` | `host-screens.jsx` | Page header with title, subtitle, right-aligned action slot |

For the production app:
- Drop `design-canvas.jsx`. It's only for design review.
- Convert `Object.assign(window, {...})` to standard ES module exports.
- Replace inline `style={{}}` blocks that handle layout with CSS modules or Tailwind utility classes if your team prefers — but keep the design tokens identical.
- Convert hardcoded sample data (in each screen's body) to props/state from your API + WebSocket layer.

---

## 10. Acceptance Criteria

A screen is "done" when:
1. It matches the visual reference at the documented breakpoint.
2. All cel-shading rules (hard shadows, black borders) are present without exception.
3. Keyboard navigation works (Tab order, Enter to submit, Esc to close modals).
4. All real-time states flow correctly through the WebSocket lifecycle.
5. It works on the smallest target (375×667 for player, 1024×768 for host) without overflow.
6. Color contrast hits AA on body text (the cyan/yellow on dark are checked; verify any new accents).
7. No blurred shadows. No gradients on backgrounds. Only the three approved Google Fonts. Selected = cyan, correct = green, wrong/danger = magenta, scores = yellow, primary CTA = orange. No exceptions.

---

## 11. Files in this Repo

- `TriviaIRL.html` — design canvas with all 17 screen mockups for visual reference.
- `styles.css` — production-ready design system (CSS variables, classes, animations).
- `player-screens.jsx` — P1–P8 React components.
- `host-screens.jsx` — H1–H9 React components.
- `design-canvas.jsx` — review-only canvas wrapper. Drop for production.
- `AGENT_CONTEXT.md` — this file.

Build from these. Don't redesign. If something seems missing, ask before inventing it.
