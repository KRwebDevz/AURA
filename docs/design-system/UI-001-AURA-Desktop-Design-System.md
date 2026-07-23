# UI-001 — AURA Desktop Design System

**Version:** 2.0.0  
**Status:** Permanent Visual Design Reference  
**Target:** AURA Desktop Applications (React + TailwindCSS + shadcn/ui + Lucide Icons + Inter)

---

## 1. Vision & Design Philosophy

AURA Desktop is designed as **Mission Control** for high-performing individuals—an executive personal intelligence operating system.

- **Mission Control Architecture**: AURA is not a generic web chat messenger. The home screen is a live Mission Control environment that provides immediate value (Daily Briefing) before the user even types a character.
- **Context-First Focus**: Conversation is not the entire screen; it appears in **Focus Mode** when needed.
- **Calm Intelligence & Executive Composure**: Clean, sharp, obsidian command environment. Zero generic chatbot fluff, zero gamer gradients, zero bouncy physics.
- **Subtle Elevation**: Depth is conveyed via 1px border strokes (`#1E2638`), obsidian surfaces (`#090C10`, `#0F141C`), and soft ambient drop shadows.

---

## 2. Brand Identity & Typography Logo (`A U R A`)

AURA avoids complicated abstract icons or generic AI sparkles.

### The Wordmark Logo
The brand identity uses clean typography with wide letter spacing:

$$\mathbf{\text{A\ \ U\ \ R\ \ A}}$$

- **Style**: `text-xs font-semibold tracking-[0.35em] text-slate-200 uppercase`
- **Inspiration**: SONOS, NOTION, LINEAR.
- **Usage**: Displayed prominently in the Mission Control header bar and window navigation.

---

## 3. Information Hierarchy (The 4-Level Rule)

Every screen in AURA Desktop must explicitly answer these 4 questions:

```text
┌─────────────────────────────────────────────────────────────────────────┐
│ Level 1: Where am I? (Workspace context, e.g. "Personal / Mission Control")│
├─────────────────────────────────────────────────────────────────────────┤
│ Level 2: What deserves my attention? (High-priority briefing & alerts) │
├─────────────────────────────────────────────────────────────────────────┤
│ Level 3: What should I do? (Actionable triggers & Command Bar)          │
├─────────────────────────────────────────────────────────────────────────┤
│ Level 4: What happens if I do nothing? (Pending status & system risk)   │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Product Views & Screen Modes

Home Screen $\neq$ Conversation Screen. AURA operates in distinct functional modes:

1. **Home Mode (Mission Control)**:
   - Daily Briefing, Today's Priorities, Market/System Telemetry, Recent Activity, and the Command Bar.
2. **Conversation Mode (Focus Mode / Conversation Canvas)**:
   - Dedicated focus workspace when actively engaging in a conversation or multi-turn task.
3. **Workspace Mode**:
   - Organized project domain views (`Personal`, `Trading`, `Architecture`, `Development`, `Business`).
4. **Settings Mode**:
   - System configuration, AI provider management, persona calibration, and security rules.

---

## 5. Daily Briefing (Home View)

Rather than an empty state saying *"Ask me anything"*, opening AURA immediately delivers proactive executive value:

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                              A  U  R  A                                 │
│                                                                         │
│                      Good Morning, Sir.                                 │
│          All core systems are operational and ready.                    │
│                                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│ TODAY'S PRIORITIES                                                      │
│ • Gym — 07:00                                                           │
│ • Trading Session — 20:00                                               │
│ • Sutr Quotation — Pending review                                       │
│ • Capgemini Executive Meeting — 14:00                                   │
├──────────────────────────────────────┬──────────────────────────────────┤
│ MARKET & TELEMETRY                   │ RECENT CONVERSATIONS             │
│ NIFTY: 24,500 (+0.4%)               │ • Q3 System Architecture         │
│ Weather: 28°C Clear                  │ • Trading Journal Entry          │
├──────────────────────────────────────┴──────────────────────────────────┤
│ [ ⌘ ] Command Bar: Type a command or message...                        │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 6. Workspace Navigation (Formerly Sidebar)

The navigation rail is called **Workspace**, organizing executive contexts:

- `Personal`: Health, Schedule, Daily Routines.
- `Trading`: Market Analysis, Position Journal, Risk Metrics.
- `Architecture`: Systems Design, Monorepo Telemetry, Codebase Health.
- `Development`: Active Sprint Tasks, Build Pipelines, Git Operations.
- `Business`: Operations, Client Quotes (Sutr), Strategic Proposals.

---

## 7. Conversation Canvas & Conversation Log

AURA does **NOT** use chat bubbles.

### The Conversation Log Standard
- **Layout**: High-density executive transcript layout ([Conversation Canvas](file:///d:/Project%20K/AURA/docs/design-system/UI-001-AURA-Desktop-Design-System.md#L7-conversation-canvas--conversation-log)).
- **AURA Statements**:
  - Frameless or fine 1px border container (`bg-[#161B26] border border-[#1E2638] rounded-md p-4`).
  - Badge: Small `A U R A` tag in muted sky-400 (`text-xs font-semibold tracking-widest text-sky-400`).
  - Tone: Direct, dignified, concise.
- **User Commands**:
  - Distinct subtle background (`bg-[#1E2433] border border-[#334155] rounded-md p-4 self-end`).

---

## 8. Command Bar Design

The primary interaction interface is the **Command Bar** (not a generic text box).

- **Capabilities**: Executes system commands (`Email Rahul`, `Book meeting`, `Open AutoCAD`, `Trade Journal`) as well as conversation turns (`Explain this code`).
- **Container**: `bg-[#0F141C] border border-[#1E2638] focus-within:border-[#38BDF8] rounded-md p-3 shadow-md flex flex-col gap-2`.
- **Keyboard Shortcut**: Triggered globally via `⌘K` or `Ctrl+K`.

---

## 9. Iron Man HUD System Telemetry Status

Status indicators reflect real-time subsystem telemetry:

| Subsystem | Telemetry Badge | Operational State |
| :--- | :--- | :--- |
| **Brain** | `Brain` | Kernel Lifecycle (`RUNNING`) |
| **Memory** | `Memory` | Context Window & Store (`READY`) |
| **Voice** | `Voice` | Audio Runtime (`STANDBY`) |
| **Execution** | `Execution` | Local Tool Runner (`ACTIVE`) |
| **Network** | `Network` | Provider Endpoint (`OLLAMA : 11434`) |

- **Visual Style**: Fine 1px stroke dark badges (`bg-slate-900/80 border border-slate-800 text-[11px] font-mono text-slate-300 px-2 py-0.5 rounded-sm flex items-center gap-1.5`).
- **Pulse**: Quiet 4px-6px emerald/sky micro LED dots.

---

## 10. Color Tokens (Hex Values)

- **Root Background**: `#090C10` (Deepest Obsidian)
- **Workspace Panel (Surface 1)**: `#0F141C`
- **Card / Log Item (Surface 2)**: `#161B26`
- **Elevated Hover / Menu (Surface 3)**: `#1E2433`
- **Subtle Border**: `#1E2638`
- **Active / Focus Border**: `#334155`
- **Primary Text**: `#F8FAFC`
- **Secondary Text**: `#94A3B8`
- **Muted Metadata Text**: `#64748B`
- **Brand Titanium Accent**: `#38BDF8` (Sky 400)
- **Healthy Status**: `#10B981` (Emerald 500)
- **Warning Status**: `#F59E0B` (Amber 500)
- **Failed Status**: `#EF4444` (Red 500)

---

## 11. Typography Scale

- **Font Family**: Inter (`sans-serif`).
- `text-xs` (12px): Metadata, timestamps, status badges.
- `text-sm` (13px): Log text, command bar input, list items.
- `text-base` (14px): Primary body, card headers.
- `text-lg` (16px): Section headers, modal titles.
- `text-xl` (18px): View headers.
- `text-2xl` (24px): Mission Control greeting header.

---

## 12. Iconography

- **Lucide Icons** (`1.5px` default stroke width, `1.75px` active).
- Sizes: `14px` (metadata), `16px` (buttons/inputs), `20px` (nav icons), `24px` (view headers).

---

## 13. Border Radius

- `rounded-none` (0px): Window frames & structural dividers.
- `rounded-sm` (4px): Buttons, command bar, telemetry badges.
- `rounded-md` (6px): Cards, log entries, dropdowns.
- `rounded-lg` (8px): Modals & focus overlays.
- **Rule**: No pill-shaped `rounded-full` buttons.

---

## 14. Shadows & Elevation

- Surface 0 (`#090C10`): 0px.
- Surface 1 (`#0F141C`): 1px border stroke `#1E2638`.
- Surface 2 (`#161B26`): `shadow-sm` (`0 1px 2px 0 rgba(0,0,0,0.4)`).
- Surface 3 (`#1E2433`): `shadow-lg` (`0 10px 25px -5px rgba(0,0,0,0.6)`).

---

## 15. Spacing Scale

- 4px grid system: `space-1` (4px), `space-2` (8px), `space-3` (12px), `space-4` (16px), `space-6` (24px), `space-8` (32px).

---

## 16. Animation Guidelines

- Duration: `150ms` (hover), `200ms` (view transition), `250ms` (modal).
- Easing: `cubic-bezier(0.16, 1, 0.3, 1)`.
- Allowed Motion: Fade-in, subtle scale-in (`0.98 -> 1.0`), view cross-fade.

---

## 17. Button Styles

- **Primary**: `bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 rounded-sm px-4 py-2 text-xs font-medium`.
- **Ghost**: `bg-transparent hover:bg-slate-800/60 text-slate-300 rounded-sm px-3 py-1.5 text-xs font-medium`.
- **Executive Accent**: `bg-sky-500/15 hover:bg-sky-500/25 text-sky-300 border border-sky-500/40 rounded-sm px-4 py-2 text-xs font-medium`.
- **Destructive**: `bg-red-950/40 hover:bg-red-900/50 text-red-400 border border-red-900/60 rounded-sm px-3 py-1.5 text-xs font-medium`.

---

## 18. Responsive Window Behavior

- Fluid 2-column layout (Workspace Nav + Active Mode Surface).
- Workspace Nav collapses to icon rail below 1100px.

---

## 19. Accessibility Standards

- WCAG AA contrast standards (>= 4.5:1 for small text, >= 7:1 for body text).
- Explicit keyboard focus rings (`focus-visible:ring-1 focus-visible:ring-sky-400`).
