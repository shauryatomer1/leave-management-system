# LeavePlus - Design System & Guidelines

This document outlines the core design language, tokens, and components for the LeavePlus application, based on the generated interfaces.

## 1. Design Tokens

### Color Palette

The color system relies heavily on a primary brand color, a neutral slate scale, and semantic utility colors for statuses. It fully supports dark mode.

- **Primary Brand**: `#1e3fae` (Deep Blue)
  - Used for primary actions, active state indicators, and key branding elements.
- **Backgrounds**:
  - Light Mode: `#f6f6f8` Main background, `#ffffff` for cards and content areas.
  - Dark Mode: `#121520` Main background, `#0f172a` (slate-900) for cards and content areas.
- **Neutrals** (Tailwind `slate`):
  - Text: `slate-900` (headings), `slate-600`/`slate-500` (body/secondary text).
  - Borders: `slate-200` (light), `slate-800` (dark).
- **Semantic Accents**:
  - **Success (Approved)**: Emerald/Green (`emerald-500`, `green-600`) - `bg-green-100 text-green-800` for badges.
  - **Warning (Pending)**: Amber/Yellow (`amber-500`) - `bg-amber-100 text-amber-800` for badges.
  - **Danger (Rejected/Sick Leave)**: Rose/Red (`red-500`, `rose-600`) - `bg-red-100 text-red-800` for badges.
  - **Info**: Blue (`blue-600`) - `bg-blue-100 text-blue-800` for badges.
  - **Other**: Purple (`bg-purple-100 text-purple-700` for specific leave types like Sick Leave in some contexts).

### Typography

- **Font Family**: `Inter`, sans-serif (Google Fonts).
- **Weights**: Regular (400), Medium (500), SemiBold (600), Bold (700), Black (900).
- **Headings**: Generally bold or black (`font-bold`, `font-black`), using tight tracking (`tracking-tight`).
- **Body**: Standard text uses 14px (`text-sm`) or 16px (`text-base`).
- **Micro-copy**: `text-xs` is frequently used for timestamps, tiny labels, and statuses, often combined with `uppercase tracking-wider`.

### Iconography

- **Library**: Google Material Symbols Outlined.
- **Styling**: `font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24`.
- **Usage**: Extensively used in navigation (left of labels), inside inputs for context, and in quick action buttons.

### Border Radius

- Form elements (inputs, buttons): `0.5rem` (`rounded-lg`).
- Cards and containers: `0.75rem` (`rounded-xl`) or occasionally `1rem` (`rounded-2xl`).
- Avatars and status dots: fully rounded (`rounded-full`).

---

## 2. Component Guidelines

### Buttons

- **Primary Button**:
  - Style: `bg-primary text-white font-bold rounded-lg`.
  - States: `hover:bg-primary/90`.
  - Often includes a subtle shadow: `shadow-lg shadow-primary/20`.
- **Secondary / Ghost Button**:
  - Style: `bg-primary/10 text-primary font-semibold rounded-lg`.
  - States: `hover:bg-primary/20`.
- **Outline Button**:
  - Style: `border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800`.
  - Used for alternate actions (like SSO logins or Cancel).
- **Action/Icon Buttons**:
  - Style: `h-10 w-10 flex items-center justify-center rounded-lg bg-slate-100 text-slate-600`.

### Form Elements

- **Inputs / Textareas**:
  - Style: `rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-4` (or simpler spacing like `py-3` depending on context).
  - Text: `text-slate-900 dark:text-slate-100`.
  - Focus State: `focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none`.
  - Icons: Usually positioned absolute left (`pl-11` or `pl-12` on the input).
- **Selects**:
  - Custom appearance with customized SVG chevron arrow indicating expansion, matching text inputs styling.
- **Labels**:
  - `text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5`.

### Cards & Containers

- **Base Card**:
  - Style: `bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800`.
  - Used for widgets, dashboard summaries, request list items, and form containers.
- **Highlighted/Callout Sections**:
  - Inside cards, small callout boxes use `bg-primary/5` or `bg-slate-50 dark:bg-slate-800/50` to distinguish secondary information (like Leave Balance, reasons, or attachments).

### Status Badges (Pills)

Small, rounded-full badges used to display the status of a request or the type of leave.
- Structure: `inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium`.
- **Pending**: `bg-amber-100 text-amber-800` (Dark Mode: `bg-amber-900/30 text-amber-400`).
- **Approved**: `bg-green-100 text-green-800` (Dark Mode: `bg-green-900/30 text-green-400`).
- **Rejected**: `bg-red-100 text-red-800` (Dark Mode: `bg-red-900/30 text-red-400`).
- **Completed**: `bg-slate-100 text-slate-800` (Dark Mode: `bg-slate-800 text-slate-400`).

---

## 3. Layout Patterns

- **Page Structure**:
  - Common shell: `min-h-screen flex flex-col`.
  - Top navigation bar: `sticky top-0 z-50 border-b`.
  - Main content area: `flex-1`.
  - Minimal Footer.
- **Auth Pages (Login/Signup)**:
  - Usually, centered forms with a max-width constrainer (e.g., `max-w-[480px]`).
  - Alternative split layout: Form on one side (`flex-1`), marketing/branding visuals on the other (`flex-1` hidden on small screens).
- **Dashboards**:
  - **Employee**: Top nav + optional Sidebar (`w-64`) + Main content area. Features prominent status summary cards (`grid-cols-3` on desktop), followed by data tables for recent requests.
  - **Manager/Employer**: Complex 12-column grid (`grid-cols-12`). Left sidebar for profile/nav (3 cols), main central feed for pending approvals (6 cols), and right pane for widgets like Team Availability/Calendars (3 cols).
- **Responsive Behavior**:
  - Mobile-first approach. Sidebars fold into hamburger menus or hide completely (`hidden lg:flex`).
  - Data grids stack into single columns (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`).
