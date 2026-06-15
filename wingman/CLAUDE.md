# Wingman — Project Guide for AI Builders

This file tells any AI coding agent (and the human directing it) how to contribute to
**Wingman** without breaking the work of other people and agents building features in
parallel. Read it fully before writing code.

If you are a **non-programmer** directing an agent: you do not need to know React or
Next.js. Tell the agent what feature you want and which page it should live on. The agent
must follow the rules below — point it at this file.

---

## What this is

Wingman is the front-end for a flight **delay-risk decision tool** for an airline
operations desk (the LAUNCH Build Days "Ready for Takeoff" challenge). The product surfaces
not just a risk number but the **reasons behind it and a recommended action**. Keep that
"explainable, actionable" framing in mind when building UI — a bare score is not the goal.

---

## Tech stack

| Layer      | Choice                                  |
| ---------- | --------------------------------------- |
| Language   | TypeScript 5                            |
| UI runtime | React 19                                |
| Framework  | Next.js 16 (App Router, RSC enabled)    |
| Styling    | Tailwind CSS v4 (config in `globals.css`, no `tailwind.config`) |
| Components | shadcn/ui (style `radix-nova`, base color `neutral`) |
| Icons      | `lucide-react`                          |
| Package mgr| **pnpm** (use `pnpm`, never `npm`/`yarn`) |

Path alias: **`@/` → `src/`** (e.g. `@/components/...`, `@/lib/utils`).

### Commands

```bash
pnpm install        # install dependencies
pnpm dev            # start dev server (http://localhost:3000)
pnpm build          # production build — run before claiming a feature works
pnpm lint           # eslint
```

---

## Directory layout

```
src/
  app/                      # Next.js App Router (routes & pages)
    layout.tsx              # root <html> shell — rarely touched
    globals.css             # Tailwind v4 + theme tokens
    (root)/                 # route group that renders the app shell (sidebar + topbar)
      layout.tsx            # the shell; all main pages live under here
      page.tsx              # "/" Dashboard
  components/
    ui/                     # shadcn/ui primitives — DO NOT EDIT (see below)
    features/               # feature-specific components — your work goes here
    shared/                 # cross-feature, reusable components (atomic design)
      atoms/                # smallest building blocks (buttons, indicators)
      molecules/            # small compositions of atoms
      organisms/            # large composed pieces (Sidebar, Topbar)
      templates/            # page-level layout scaffolds
  lib/
    utils.ts                # cn() helper (clsx + tailwind-merge) — use for className merging
  types/
    navigation.ts           # sidebar nav entries — edit to add a nav link
```

---

## The component architecture — rules

This structure exists so multiple humans and agents can build **in parallel** without
colliding. Respect the boundaries.

### 1. `components/ui/` — shadcn primitives. **Never modify these.**

These are installed and owned by shadcn/ui. Add new ones with:

```bash
pnpm dlx shadcn@latest add <component>     # e.g. card, badge, table, dialog, tooltip
```

Then import and compose them — do not hand-edit the generated files. If a primitive needs
different behaviour, wrap it in your own component under `features/` or `shared/`.

### 2. `components/features/<feature-name>/` — your feature's components.

Each distinct feature gets **its own directory**. This is the collision-free zone: one
feature, one folder, one team/agent. Build the feature's screens and pieces here and keep
them self-contained. Example:

```
src/components/features/delay-risk/
  RiskTable.tsx
  RiskRow.tsx
  ReasonBreakdown.tsx
```

Do not reach into another feature's folder. If you need to share something, promote it to
`shared/`.

### 3. `components/shared/` — only genuinely reusable, cross-feature components.

Use atomic design and place by complexity: `atoms` → `molecules` → `organisms` →
`templates`. Put something here **only** when more than one feature needs it. When in
doubt, keep it in your feature folder; promote later.

---

## Adding a new set of features (the standard recipe)

A "set of features" gets its own page (route) and its own nav entry. Follow these steps in
order:

1. **Create the page.** Add a folder under `src/app/(root)/<route>/` with a `page.tsx`.
   Putting it inside `(root)` is what gives the page the sidebar + topbar shell.

   ```tsx
   // src/app/(root)/risk/page.tsx
   export default function RiskPage() {
     return <h1 className="text-2xl font-bold">Delay Risk</h1>;
   }
   ```

2. **Build the feature components** under `src/components/features/<feature-name>/` and
   import them into the page.

3. **Add the navigation entry** in `src/types/navigation.ts`: import an icon from
   `lucide-react` and append an item to `sidebarLinks` whose `route` matches the folder.

   ```ts
   import { Gauge } from "lucide-react";
   // ...
   { icon: Gauge, route: "/risk", label: "Delay Risk" },
   ```

The sidebar renders `sidebarLinks` automatically — no other wiring is needed.

---

## Conventions (match the existing code)

- **Components use default exports**, PascalCase filenames (`RiskTable.tsx`).
- **Server Components by default.** Add `"use client"` as the first line **only** when a
  component uses hooks/interactivity (`useState`, `usePathname`, `onClick`, etc.). Keep
  client components small and leaf-level; fetch/compute in server components where possible.
- **Styling is Tailwind utility classes**, merged with `cn()` from `@/lib/utils` when a
  component takes a `className` prop. No CSS modules, no inline style objects.
- Use **theme tokens**, not raw colors: `text-foreground`, `text-muted-foreground`,
  `bg-primary`, `border-border`, etc. (see `globals.css`).
- Icons come from `lucide-react`.
- 2-space indentation. Imports use the `@/` alias, not long relative paths.

---

## Working in parallel — do / don't

- **Do** keep each feature inside its own `features/<name>/` folder.
- **Do** add components via `pnpm dlx shadcn@latest add` instead of writing primitives by hand.
- **Don't** edit files in `components/ui/`.
- **Don't** modify another feature's folder, the root `layout.tsx`, or `globals.css` theme
  tokens unless your task is explicitly about the shell or theme.
- **Don't** introduce a new state/data library, CSS framework, or package manager without
  it being a deliberate, shared decision.
- After building, run `pnpm build` to confirm the project still compiles before reporting
  the feature as done.
