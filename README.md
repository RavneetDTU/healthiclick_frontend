# Healthiclick Team Portal

A Next.js (App Router) based wellness coaching & client management portal enabling nutrition/exercise plan delivery, daily wellness logging, scheduling, progress tracking, reports, and PDF distribution.

## 1. Overview
This application serves coaches/admins and their clients:
- Coaches manage customers, weekly diet & exercise plans, follow‑ups, and reports.
- Clients view assigned plans, log daily habits (sleep, water, activity, extra food), review progress charts, and access uploaded PDFs.
- Sessions can be booked directly via embedded Calendly.
- Plans support structured sections (meals/exercises) with editing flows and PDF availability checks.

## 2. Core Features
- Authentication: Token stored in localStorage (Authorization: Bearer). Guarded fetch helpers (src/lib/api.ts).
- Customer Management: Listing, metrics (sessions, orders, followups) with popup feedback (Components/AllCustomes).
- Dashboard: Metrics + weekly charts (feature/dashboard).
- Daily Check‑In: Water, activity, sleep, extra food; supports editing past dates with validation (Components/DailyCheckIn).
- Diet Plan Module:
  - Weekly selection (Mon–Sun).
  - Structured sections → meals (name, quantity, recipe).
  - PDF availability endpoint check & download.
  - Admin edit popup and toast feedback.
- Exercise Plan Module:
  - Weekly day switcher.
  - Sections containing exercises (name, duration, video link, comment).
  - PDF availability + deletion.
  - Add / edit dialog with dynamic section & row management.
- PDF Upload (Doctor / Coach):
  - Drag & drop PDFs for meals & exercises (DocMealUpload / DocExerciseUpload).
  - Validates MIME type, stateful toast messages.
- Reports:
  - Filter + upload section (Components/Reports).
- Activity Charts:
  - Aggregated wellness metrics (feature/activityChart).
- Session Booking:
  - Embedded Calendly widget (react-calendly).
- Profile Area:
  - Consolidated Diet + Exercise + Upload tabs.
- State Management: Lightweight per‑feature Zustand stores (naming convention useXxxStore).
- Theming & UI:
  - Tailwind with central theme extension (styles/theme.js + tailwind.config.js).
  - Reusable atoms (Header, Sidebar, Footer, MetricCard, Buttons, Toast).
- Responsive Layout:
  - useDevice / useMobile hooks adjust dialogs & layout.
- Error Handling:
  - Central fetch wrappers with explicit error surface + toast feedback.
- Environment Isolation:
  - NEXT_PUBLIC_BASE_URL drives backend integration.

## 3. Tech Stack
- Framework: Next.js (App Router) + React + TypeScript
- Styling: Tailwind CSS (custom theme import)
- State: Zustand
- Icons: react-icons
- Scheduling: react-calendly
- HTTP: native fetch + axios (legacy/partial usage)
- PDF Handling: Browser fetch endpoints + conditional availability checks
- Build Tooling: Next.js toolchain (SWC)
- Deployment Targets: Any Node 18+ (Vercel / container)

## 4. Architecture Summary
Layered by feature + shared UI atoms:
- src/app/feature/* = route segments (dashboard, dietPlan, exercise, etc.)
- src/Components/* = feature implementations, dialogs, forms
- src/shared/atoms = low-level presentational components
- src/lib/api.ts = authenticated fetch helper (token injection)
- src/utils/api.ts = generic POST helper (form vs JSON)
- src/hooks = device/responsive helpers
- State stores (not shown in snippets) follow co-located pattern inside feature/store directories.

Data Flow:
UI Component -> Store (Zustand) or local state -> fetch via lib/api.ts -> backend JSON -> normalization (reduce into Record keyed by category) -> render + optional edit overlay -> (mutations) -> toast feedback + refetch.

## 5. Directory Structure (trimmed)
```
src/
  app/
    feature/
      dashboard/
      dietPlan/
      exercise/
      dailyCheckin/
      session/
      reports/
      allCustomer/
      activityChart/
    layout.tsx
    page.tsx
  Components/
    DietPlan/
    Exercise/
    DailyCheckIn/
    UserProfile/
    Reports/
    AllCustomes/
    Dashboard/
    ui/
  shared/
    atoms/
  hooks/
  lib/
    api.ts
    theme.ts
    utils.ts
  utils/
    api.ts
  styles/
    theme.js
tailwind.config.js
```

## 6. Environment Variables
Create .env.local (not committed):
```
NEXT_PUBLIC_BASE_URL=https://api.example.com
NEXT_PUBLIC_CALENDLY_URL=https://calendly.com/<user>/book-your-session   # (optional override)
NEXT_PUBLIC_APP_NAME=Healthiclick
```
Add analytics or logging keys as needed.

## 7. Installation & Run (Frontend)
```
# Node 18+ recommended
npm install
npm run dev
# or
pnpm install
pnpm dev
```
Visit http://localhost:3000

## 8. Auth Notes
A token is expected in localStorage under key token plus optional is_admin flag. Ensure backend login flow sets them:
```
localStorage.setItem("token", <JWT>)
localStorage.setItem("is_admin", "true" | "false")
```

## 9. Fetch Utilities
- src/lib/api.ts -> fetchWithAuth(endpoint, options)
- src/utils/api.ts -> post<T>(endpoint, data, asForm?)

Consistency Recommendation:
Migrate remaining raw fetch/axios calls to a unified abstraction for retries + 401 handling.

## 10. Diet & Exercise Data Model (Frontend Shaping)
DietSection → { name, weekday, elements[] } → normalized into Record<string, MealItem[]>
ExerciseSection → { name/time/weekday, elements[] } → normalized into Record<string, StructuredExercise[]>
Allows category grouping and edit overlays.

## 11. PDF Handling
Availability endpoints (exercise/diet) queried to toggle buttons. Upload components enforce PDF MIME and surface success/error via Toast.

## 12. State Management Guidelines
Each store (e.g., useDietPlanStore, useExerciseStore) should:
- Hold selected weekday (weekDay / ExerciseWeekDay)
- Hold normalized plan data
- Expose setters & resetters

## 13. Styling & Theme
Tailwind config imports custom theme object (styles/theme.js). Ensure content globs include all actual directories (consider adding: './src/**/*.{js,ts,jsx,tsx}') to avoid purge misses.

## 14. Suggested Improvements
- Central error boundary
- Token refresh & 401 redirect
- Replace axios remnants for consistency
- Add suspense + streaming for large plans
- Add form schema validation (e.g., zod)
- Add testing (React Testing Library + Vitest / Jest)
- Add ESLint + Prettier config
- Accessibility audit (ARIA roles in dialogs)

## 15. Scripts (assumed)
```
npm run dev        # start
npm run build      # production build
npm run start      # serve build
npm run lint       # (add ESLint config first)
```

## 16. Testing (to be added)
Add Jest/Vitest + setupTests.ts; cover stores (pure) & critical UI interactions.

## 17. Deployment
- Ensure NEXT_PUBLIC_BASE_URL points to production API.
- Provide Dockerfile if containerizing (multi-stage with node:18-alpine).
- Use environment injection at build time for public vars.

## 18. Security Considerations
- Avoid storing long‑lived tokens; consider httpOnly cookies.
- Validate file types server-side for PDF uploads.
- Sanitize video_link fields before embedding.

## 19. Licensing & Contributions
Add LICENSE file and CONTRIBUTING.md if opening to collaborators.

## 20. Roadmap (Example)
- Add role-based routing guard
- Global loading & error overlays
- Offline caching (Service Worker)
- Metrics instrumentation (web vitals + backend trace IDs)
- Exportable CSV reports

## 21. Maintainers
Add names / contact handles here.

---
Provide package.json so dependency versions can be finalized.
