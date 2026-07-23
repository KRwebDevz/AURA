# UI-001 — AURA Desktop Design System

**Version:** 2.1.0  
**Status:** Permanent Visual Design Specification  
**Target:** AURA Desktop Applications (React + TailwindCSS + shadcn/ui + Lucide Icons + Inter)

---

## 1. Vision & Core Philosophy

AURA Desktop is designed as **Mission Control** for high-performing individuals—an executive personal intelligence operating system.

- **Mission Control Architecture**: AURA opens directly to a live **Mission Control** home view featuring **Ambient Intelligence**, a **Dynamic Contextual Greeting**, and a live **Executive Timeline**.
- **Context-First Focus**: Conversation is not the entire screen; it appears in **Focus Mode** when needed.
- **Calm Intelligence & Executive Composure**: Clean, sharp, obsidian command environment. Zero generic chatbot fluff, zero gamer gradients, zero bouncy physics.

---

## 2. Brand Identity & Typography Logo (`A U R A`)

AURA avoids abstract icons or generic AI sparkles. The identity uses clean typography with wide letter spacing:

$$\mathbf{\text{A\ \ U\ \ R\ \ A}}$$

- **Style**: `text-xs font-semibold tracking-[0.35em] text-slate-200 uppercase`
- **Inspiration**: SONOS, NOTION, LINEAR.

---

## 3. Iron Man HUD Telemetry & Focus State

Status indicators reflect real-time subsystem telemetry, including the active **Focus** priority:

| Subsystem | Telemetry Token | Operational Description |
| :--- | :--- | :--- |
| **Brain** | `Brain: RUNNING` | Kernel Lifecycle State |
| **Memory** | `Memory: READY` | Context Window & Store |
| **Voice** | `Voice: STANDBY` | Audio Runtime |
| **Execution**| `Execution: ACTIVE` | Local Tool Runner |
| **Network** | `Network: OLLAMA` | Provider Endpoint (`11434`) |
| **Focus** | `Focus: TRADING` | Active Priority (Adapts UI context) |

### Focus Adaptive State
When `Focus` shifts (e.g. `Focus: Trading` or `Focus: Sutr Studio`), the workspace subtly adapts its contextual widgets and accent tones to match the active priority.

---

## 4. Dynamic Contextual Greeting & Executive Timeline

### Dynamic Greeting
Instead of static "Good Morning Sir", AURA greets with live context:
- *"Good Morning, Sir. Your first meeting starts in 40 minutes."*
- *"Good Evening, Sir. Markets open in 55 minutes."*
- *"Welcome back, Sir. You paused while reviewing the Sutr quotation."*

### Executive Timeline (The NOW Indicator)
Replaces generic bullet lists with a live vertical executive timeline:

```text
NOW ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ [ Focus: Trading ]
07:30 • Gym (Completed)
  ↓
10:00 • Capgemini Executive Briefing
  ↓
14:00 • Sutr Studio Proposal Review
  ↓
20:00 • NY Market Trading Session
```

---

## 5. Ambient Intelligence (Living Information)

Information quietly updates itself in real-time without intrusive notifications, popups, or noisy banners:
- Weather changes $\rightarrow$ Traffic delays updated $\rightarrow$ Schedule adjusted $\rightarrow$ Volatility metrics refreshed.
- Information lives and updates ambiently in Mission Control.

---

## 6. Workspace Color Identity

Each workspace retains AURA's obsidian base (`#090C10`), but subtly shifts its primary accent token to reflect its domain:

| Workspace | Accent Token | Hex Value | Primary Focus |
| :--- | :--- | :--- | :--- |
| **Trading** | Titanium Sky | `#38BDF8` | Market Charts, Risk, Session Telemetry |
| **Sutr Studio**| Warm Stone | `#A8A29E` | Client Projects, Quotations, Drawings |
| **Development**| Deep Violet | `#A855F7` | Repositories, Monorepo Build Pipelines |
| **Personal** | Emerald | `#10B981` | Fitness Routines, Personal Schedule |

---

## 7. Command Bar & Natural Language Prompts

The **Command Bar** (`⌘K`) features rotating natural language prompt examples:

- **Placeholder**: `Ask AURA or type a command... (e.g., 'Prepare me for today', 'Summarize yesterday', 'Open today\'s drawings', 'Review my trades')`
- **Capabilities**: Executes both system commands (`Email Rahul`, `Open AutoCAD`) and complex reasoning requests.

---

## 8. AURA Presence (Contextual Reasoning States)

AURA **NEVER** displays generic `"Typing..."`.

When processing or executing a task, AURA displays explicit cognition states:
- `AURA is analyzing...`
- `Reviewing your schedule...`
- `Synthesizing market telemetry...`
- `Preparing executive proposal...`

---

## 9. Conversation Canvas (Conversation Log)

AURA does **NOT** use chat bubbles.

- **Format**: High-density executive transcript layout ([Conversation Log](file:///d:/Project%20K/AURA/docs/design-system/UI-001-AURA-Desktop-Design-System.md#L9-conversation-canvas-conversation-log)).
- **AURA Responses**: Fine 1px stroke card (`bg-[#161B26] border border-[#1E2638] rounded-md p-4`), tagged with muted sky-400 `A U R A` badge.
- **User Commands**: `bg-[#1E2433] border border-[#334155] rounded-md p-4 self-end`.

---

## 10. Information Hierarchy (4-Level Rule)

Every view answers:
- **Level 1**: Where am I?
- **Level 2**: What deserves my attention?
- **Level 3**: What should I do?
- **Level 4**: What happens if I do nothing?

---

## 11. Color Palette Tokens

- **Root Background**: `#090C10` (Deepest Obsidian)
- **Workspace Surface**: `#0F141C`
- **Card / Log Item**: `#161B26`
- **Elevated Surface**: `#1E2433`
- **Subtle Border**: `#1E2638`
- **Active Focus Border**: `#334155`
- **Primary Text**: `#F8FAFC`
- **Secondary Text**: `#94A3B8`
- **Muted Text**: `#64748B`

---

## 12. Typography & Iconography

- **Font**: Inter (`sans-serif`).
- `text-xs` (12px), `text-sm` (13px), `text-base` (14px), `text-lg` (16px), `text-xl` (18px), `text-2xl` (24px).
- **Icons**: Lucide Icons (`1.5px` default stroke).

---

## 13. Border Radius & Shadows

- `rounded-none` (0px), `rounded-sm` (4px), `rounded-md` (6px), `rounded-lg` (8px). No pill buttons.
- Shadows: Ambient dark elevation (`shadow-sm`, `shadow-lg`).

---

## 14. Responsive Behavior & Accessibility

- 2-column fluid grid.
- WCAG AA contrast standards and sharp keyboard focus rings (`focus-visible:ring-1 focus-visible:ring-sky-400`).
