# MiniHawaii Wedding Comparator - UI/UX Design System

## 1. Visual Language
- **Theme**: Clean, light, modern.
- **Base Palette**: Neutral grays (Tailwind `slate` or `gray`) for text, borders, and subtle backgrounds.
- **Accent Color**: Teal (`teal-600` to `teal-500`) to evoke a Hawaii aesthetic without being overwhelming. Used sparingly for primary actions (buttons, selected chips, active states).
- **Backgrounds**: Pure white (`bg-white`) for cards, off-white (`bg-slate-50`) for the app background to make cards pop.

## 2. Typography
- **Font**: Inter/Geist-sans (system fonts).
- **Headings**: Semibold, dark (`text-slate-900`).
  - Page Title: `text-2xl` or `text-3xl`.
  - Card Title: `text-lg`.
  - Section Title: `text-base` uppercase or bold.
- **Body**: `text-sm` or `text-base`, medium legible contrast (`text-slate-600` or `text-slate-700`).

## 3. Spacing & Rhythm
- Standard Tailwind spacing.
- **Cards/Containers**: `p-4` or `p-6` with `rounded-xl`.
- **Gaps**: `gap-4` between related elements, `gap-6` or `gap-8` between major sections.

## 4. Components
- **Cards**: `bg-white border border-slate-200 shadow-sm rounded-xl`. Hover states slightly elevate the shadow (`hover:shadow-md`).
- **Focus Rings**: `focus:ring-2 focus:ring-teal-500 focus:outline-none`.
- **Buttons**:
  - Primary: `bg-teal-600 text-white hover:bg-teal-700`.
  - Secondary/Outline: `bg-white border border-slate-300 text-slate-700 hover:bg-slate-50`.
  - Ghost: `bg-transparent text-slate-600 hover:bg-slate-100`.

## 5. Badges
Badges are used extensively to convey quick facts.
- **Status**:
  - *Shortlisted*: Blue (`bg-blue-100 text-blue-700`)
  - *Discarded*: Gray (`bg-slate-100 text-slate-600`)
  - *Pending*: Yellow (`bg-yellow-100 text-yellow-700`)
  - *Booked*: Green (`bg-emerald-100 text-emerald-700`)
- **Risk**: High (Red), Medium (Orange), Low (Green).
- **Fit**: 0-100 scale. High (>80: Green), Medium (50-80: Yellow), Low (<50: Slate).
- **Cost Confidence**: High (Green), Medium (Yellow), Low (Red).

## 6. Layouts
- **Option List**: Toggleable between a responsive CSS Grid (cards) and a dense Flex/Table layout (rows).
- **Compare Board**: 
  - Desktop: Sticky first column (labels) and sticky top row (Option Names).
  - Mobile: Horizontal scroll on the entire table.
- **Option Detail**: Split view with an emphasis on a photo gallery at the top, followed by structured data.
