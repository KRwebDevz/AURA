# UI-001 — AURA Desktop Design System

**Version:** 1.0.0  
**Status:** Permanent Visual Design Reference  
**Target:** AURA Desktop Applications (React + TailwindCSS + shadcn/ui + Lucide Icons + Inter)

---

## 1. Design Philosophy

AURA Desktop is designed as **executive software**—a personal intelligence operating system for high-performing individuals.

- **Calm Intelligence**: The interface remains quiet until spoken to. It does not compete for attention with loud colors, aggressive notifications, or gamified elements.
- **Executive Composure**: Clean, sharp, and structured. Every pixel serves a function. Visual clutter is stripped away to reduce cognitive friction.
- **Subtle Elevation**: Depth is conveyed through subtle tone shifts, 1px border strokes, and soft ambient drop shadows, rather than dramatic multi-color gradients.
- **Not a Chatbot Clone**: AURA is a digital executive partner, not a generic web chat widget. The interface reflects a command environment with high information density, clear status visibility, and precision typography.

---

## 2. Brand Personality

| Attribute | Expression |
| :--- | :--- |
| **Authoritative** | Confident geometry, clean alignment, zero playful fluff. |
| **Discreet** | Muted dark surfaces, low-contrast ambient backgrounds, non-intrusive UI elements. |
| **Elegant** | Fine 1px borders, carefully tuned Inter typography, balanced negative space. |
| **Efficient** | Instant visual feedback, clear keyboard shortcuts, predictable layouts. |

---

## 3. Color Palette (Hex Values)

AURA uses a curated slate-obsidian color system engineered for dark-mode productivity.

### Base Surfaces
- **Background Root (`--bg-root`)**: `#090C10` (Deepest Obsidian)
- **Background Surface 1 (`--bg-surface-1`)**: `#0F141C` (Sidebar / Panel Base)
- **Background Surface 2 (`--bg-surface-2`)**: `#161B26` (Card / Message Container)
- **Background Surface Elevated (`--bg-surface-elevated`)**: `#1E2433` (Dropdown / Dialog / Hover)

### Borders & Dividers
- **Subtle Border (`--border-subtle`)**: `#1E2638` (Card & Divider lines)
- **Active Border (`--border-active`)**: `#334155` (Input focus & selected states)
- **Accent Stroke (`--border-accent`)**: `#38BDF8` (Focus indicator accent)

### Typography & Icons
- **Primary Text (`--text-primary`)**: `#F8FAFC` (Headings & active message body)
- **Secondary Text (`--text-secondary`)**: `#94A3B8` (Descriptions & labels)
- **Muted Text (`--text-muted`)**: `#64748B` (Timestamps, metadata, disabled states)
- **Subdued Text (`--text-subdued`)**: `#475569` (Placeholders & icons)

### Accent & Status Tokens
- **Brand Titanium Accent**: `#38BDF8` (Sky 400 - Subtle primary highlights)
- **Status Operational / Healthy**: `#10B981` (Emerald 500)
- **Status Warning / Degraded**: `#F59E0B` (Amber 500)
- **Status Error / Failed**: `#EF4444` (Red 500)
- **Status Info / Neutral**: `#0EA5E9` (Sky 500)

---

## 4. Typography

**Font Family**: `Inter`, `-apple-system`, `BlinkMacSystemFont`, `Segoe UI`, `Roboto`, `sans-serif`.

### Type Scale

| Token | Size | Weight | Line Height | Tracking | Usage |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `text-xs` | 12px (0.75rem) | 400 / 500 | 16px | `+0.02em` | Metadata, timestamps, status badges |
| `text-sm` | 13px (0.8125rem) | 400 / 500 | 18px | `0` | Message body, list items, inputs |
| `text-base` | 14px (0.875rem) | 400 / 500 | 20px | `-0.01em` | Primary body, card titles |
| `text-lg` | 16px (1.0rem) | 600 | 24px | `-0.015em` | Section headers, modal titles |
| `text-xl` | 18px (1.125rem) | 600 | 28px | `-0.02em` | Application view titles |
| `text-2xl` | 24px (1.5rem) | 600 | 32px | `-0.025em` | Key metric displays, hero headers |

---

## 5. Iconography

**Library**: `Lucide Icons` (`lucide-react`)

- **Stroke Width**: `1.5px` (default), `1.75px` (for active/highlighted icons). Never use bold 2.5px+ strokes.
- **Sizes**:
  - `14px` (`w-3.5 h-3.5`): Inline metadata indicators
  - `16px` (`w-4 h-4`): Standard button icons, list items, input actions
  - `20px` (`w-5 h-5`): Navigation bar icons, section header action icons
  - `24px` (`w-6 h-6`): Primary view headers, empty state illustrations
- **Color**: Icons default to `--text-muted` (`#64748B`) and transition to `--text-primary` (`#F8FAFC`) on hover/active states.

---

## 6. Border Radius

AURA uses sharp, structured geometry. Soft rounded corners are kept minimal to preserve executive software feel.

- **None (`rounded-none`)**: 0px (Window root frame, dividing rules)
- **Small (`rounded-sm`)**: 4px (Buttons, input boxes, status badges, code blocks)
- **Medium (`rounded-md`)**: 6px (Cards, message containers, dropdown menus)
- **Large (`rounded-lg`)**: 8px (Modals, dialog windows, floating drawers)
- **Strict Rule**: No `rounded-full` pill buttons for primary actions or inputs.

---

## 7. Shadows & Elevation

Depth is created via surface color contrast and minimal dark ambient shadows.

- **Surface 0 (Base)**: `bg-[#090C10]` — No shadow
- **Surface 1 (Sidebar / Panels)**: `bg-[#0F141C] border-r border-[#1E2638]` — No shadow
- **Surface 2 (Cards / Bubbles)**: `bg-[#161B26] border border-[#1E2638] shadow-sm`
  - `shadow-sm`: `0 1px 2px 0 rgba(0, 0, 0, 0.4)`
- **Surface 3 (Floating Menus / Modals)**: `bg-[#1E2433] border border-[#334155] shadow-lg`
  - `shadow-lg`: `0 10px 25px -5px rgba(0, 0, 0, 0.6), 0 8px 10px -6px rgba(0, 0, 0, 0.5)`

---

## 8. Spacing Scale

A strict 4px / 8px grid system ensures visual balance across windows and panels.

| Token | Size | Tailwind Equivalent | Usage |
| :--- | :--- | :--- | :--- |
| `space-1` | 4px | `p-1` / `gap-1` | Micro padding around icon buttons |
| `space-2` | 8px | `p-2` / `gap-2` | Compact list item gap, badge padding |
| `space-3` | 12px | `p-3` / `gap-3` | Standard button padding, input field padding |
| `space-4` | 16px | `p-4` / `gap-4` | Card internal padding, message padding |
| `space-6` | 24px | `p-6` / `gap-6` | Section padding, container gaps |
| `space-8` | 32px | `p-8` / `gap-8` | View padding, empty state margin |

---

## 9. Animation Guidelines

Animations are quick, functional, and subtle.

- **Duration**: `150ms` (hover / active states), `200ms` (panel slide / collapse), `250ms` (modal open / close).
- **Easing Curve**: `cubic-bezier(0.16, 1, 0.3, 1)` (ease-out cubic).
- **Allowed Motion**:
  - Fade-in (`opacity: 0 -> 1`)
  - Subtle scale-in (`scale: 0.98 -> 1.0`)
  - Panel slide (`translate-x: -100% -> 0`)
- **Prohibited Motion**: Bouncy physics, spring effects, multi-color pulsing gradients, rotating loading spinners with heavy saturated colors.

---

## 10. Component Principles

1. **State Preservation**: Component visual states (hover, focus, active, disabled) must be explicitly styled and tested.
2. **High Contrast Readability**: Body text must maintain a contrast ratio >= 7:1 against card backgrounds.
3. **No Decorative Distractions**: Do not add icons or borders merely to fill space. Every visual element must convey information or interaction intent.
4. **Keyboard Accessibility**: Focus rings use a sharp 1px `#38BDF8` ring offset with 2px transparent padding (`focus-visible:ring-1 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#090C10]`).

---

## 11. Desktop Window Layout

The desktop application layout is split into 3 structural regions:

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ Window Header & Title Bar (Frameless Drag Area + Status Badge + Controls)   │
├───────────────┬─────────────────────────────────────────────┬───────────────┤
│ Left Sidebar  │ Main Activity & Conversation View           │ Detail Drawer │
│ (Navigation   │                                             │ (Context,     │
│  & System     │ - Header Bar (Context & Model Selector)     │  Metadata &   │
│  Health)      │ - Message Stream Area                       │  System       │
│               │ - Executive Input Command Bar               │  Telemetry)   │
│ (240px wide)  │ (Flex-1 Growth Area)                        │ (280px wide)  │
└───────────────┴─────────────────────────────────────────────┴───────────────┘
```

- **Sidebar Width**: 240px (collapsible to 60px icon-only rail).
- **Detail Drawer Width**: 280px (collapsible on demand).
- **Minimum Window Dimensions**: 960px x 640px.

---

## 12. Chat Layout & Conversation Design

- **Message Stream Container**: `flex flex-col gap-4 p-6 overflow-y-auto`.
- **AURA Executive Responses**:
  - `bg-[#161B26] border border-[#1E2638] rounded-md p-4 max-w-[85%]`
  - Executive header badge: Small `AURA` label in muted sky-400 (`text-xs font-semibold tracking-wider text-sky-400`).
  - Text: High-contrast `text-[#F8FAFC] leading-relaxed`.
- **User Prompts**:
  - `bg-[#1E2433] border border-[#334155] rounded-md p-4 max-w-[80%] self-end`
  - Text: `text-[#F8FAFC]`.
- **Metadata Subtext**: Timestamp, model tag (`llama3.2`), and provider tag (`ollama`) displayed in `text-[11px] text-slate-500 mt-2 flex gap-3`.

---

## 13. Input Field & Command Bar Design

- **Command Container**: `bg-[#0F141C] border border-[#1E2638] focus-within:border-[#38BDF8] rounded-md p-3 shadow-md flex flex-col gap-2`.
- **TextArea / Input**: `bg-transparent border-none outline-none text-[#F8FAFC] placeholder:text-slate-500 text-sm resize-none`.
- **Action Toolbar**:
  - Left: Attachment & Voice trigger icons (`w-4 h-4 text-slate-400 hover:text-slate-200 cursor-pointer`).
  - Right: Executive Send button (`bg-sky-500/10 text-sky-400 hover:bg-sky-500/20 border border-sky-500/30 text-xs px-3 py-1.5 rounded-sm font-medium transition-colors`).

---

## 14. Button Styles

### Primary Action
- **Style**: `bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 rounded-sm px-4 py-2 text-xs font-medium transition-colors shadow-sm`

### Secondary / Ghost
- **Style**: `bg-transparent hover:bg-slate-800/60 text-slate-300 hover:text-slate-100 border border-transparent rounded-sm px-3 py-1.5 text-xs font-medium transition-colors`

### Executive Accent
- **Style**: `bg-sky-500/15 hover:bg-sky-500/25 text-sky-300 border border-sky-500/40 rounded-sm px-4 py-2 text-xs font-medium transition-colors`

### Destructive
- **Style**: `bg-red-950/40 hover:bg-red-900/50 text-red-400 border border-red-900/60 rounded-sm px-3 py-1.5 text-xs font-medium transition-colors`

---

## 15. Cards & Surface Panels

- **Standard Card**:
  - Class: `bg-[#161B26] border border-[#1E2638] rounded-md p-5 text-slate-200 shadow-sm`
- **Interactive Card**:
  - Class: `bg-[#161B26] hover:bg-[#1E2433] border border-[#1E2638] hover:border-[#334155] rounded-md p-5 transition-all cursor-pointer`

---

## 16. Status Indicators

Status badges communicate Kernel & AI Provider states clearly:

| State | Badge Style | Icon / Dot |
| :--- | :--- | :--- |
| **RUNNING / Healthy** | `bg-emerald-950/50 text-emerald-400 border-emerald-800/60` | `w-2 h-2 rounded-full bg-emerald-500 animate-pulse` |
| **INITIALIZING / Ready** | `bg-sky-950/50 text-sky-400 border-sky-800/60` | `w-2 h-2 rounded-full bg-sky-400` |
| **STOPPED / Offline** | `bg-slate-900 text-slate-400 border-slate-700` | `w-2 h-2 rounded-full bg-slate-500` |
| **FAILED / Unhealthy** | `bg-red-950/50 text-red-400 border-red-800/60` | `w-2 h-2 rounded-full bg-red-500` |

---

## 17. Loading & Streaming States

- **Text Streaming**: A minimal vertical cursor line (`w-0.5 h-4 bg-sky-400 inline-block animate-pulse ml-1 align-middle`) indicates active token reception.
- **Skeleton Shimmer**: `bg-slate-800/40 animate-pulse rounded-sm`. Used for loading models list and system telemetry.

---

## 18. Empty States

When no conversation is active:
- **Visual**: Centered AURA emblem (`w-12 h-12 text-slate-600 mb-4`).
- **Title**: `AURA Executive Partner` (`text-lg font-semibold text-slate-200`).
- **Status Banner**: `Kernel v0.1.0 • Provider: Ollama (llama3.2) • Status: Operational`.
- **Quick Action Triggers**: 3 sharp cards with sample executive prompt suggestions (e.g., `"Provide operational status report"`, `"Review pending schedule"`).

---

## 19. Responsive & Desktop Window Behavior

- **Window Resizing**: Fluid scaling using CSS grid / flex layout.
- **Collapsible Nav**: Left sidebar toggles to icon-only mode below 1100px window width.
- **Drawer Hiding**: Detail drawer hides below 1280px window width.

---

## 20. Accessibility Considerations

1. **Contrast Compliance**: Contrast ratio for all text elements exceeds WCAG AA standard (>= 4.5:1 for small text, >= 7:1 for body text).
2. **Keyboard Focus**: Explicit focus rings (`focus-visible:ring-1 focus-visible:ring-sky-400`) on all interactive controls (buttons, inputs, menu items).
3. **Screen Reader Compatibility**: Semantic HTML5 tags (`<main>`, `<aside>`, `<nav>`, `<header>`, `<footer>`) with explicit `aria-label` tags for icon buttons.
