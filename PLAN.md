# Video Production Tracker — Architecture & Implementation Plan

A fast, lightweight, browser-based web application to track personal video production workflows from scriptwriting and filming to editing and multi-platform publishing, with 100% local persistence and JSON backup/restore capabilities.

---

## 1. System Architecture & Tech Stack

### Technology Choices
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS (with `@tailwindcss/forms` styling & custom dark/light sleek theme) + `clsx` / `tailwind-merge`
- **Icons**: `lucide-react` (clean, lightweight icons for video, filming, edit, platforms, status)
- **Local Storage Engine**: Browser `localStorage` with a robust abstraction layer (`StorageService`) providing versioning, auto-save debounce, schema migration, and fallback error handling.
- **Drag & Drop / Reordering**: Accessible lightweight order management (reorder controls + HTML5 drag-and-drop support).

```
┌────────────────────────────────────────────────────────┐
│               Video Production Tracker App              │
├────────────────────────────┬───────────────────────────┤
│          Sidebar           │      Project Workspace    │
│  - New Project CTA         │  - Project Header & Meta  │
│  - Active Projects List    │  - Script Sections Editor │
│    (Progress Bar & %)      │    * Filmed Checkbox      │
│  - Completed Projects List │    * Inserted Checkbox    │
│  - Scrapped Projects List  │  - Publishing Platforms   │
│  - Export / Import JSON    │  - Stage Progress Engine  │
│  - Storage Stats & Theme   │  - Completion / Scrap CTA │
└────────────────────────────┴───────────────────────────┘
                             │
            ┌────────────────┴────────────────┐
            ▼                                 ▼
┌───────────────────────┐         ┌───────────────────────┐
│   Local Persistence   │         │  JSON Export/Import   │
│  (LocalStorage Engine)│         │ (Schema Validator &   │
│   - Auto-sync on edit │         │  Safe Recovery Parser)│
└───────────────────────┘         └───────────────────────┘
```

---

## 2. Core Data Models (`src/types/index.ts`)

```typescript
export type ProjectStatus = 'active' | 'completed' | 'scrapped';

export type PlatformKey = 'youtube' | 'linkedin' | 'facebook' | 'instagram' | 'tiktok';

export interface ScriptSection {
  id: string;
  order: number;
  title: string;          // e.g. "Hook", "Introduction", "Main Point #1"
  content: string;        // Script text / teleprompter notes
  filmed: boolean;        // Filmed / Recorded
  inserted: boolean;      // Edited into final video cut
  createdAt: number;
  updatedAt: number;
}

export interface PlatformPublishStatus {
  published: boolean;
  publishedAt?: number;
}

export interface VideoProject {
  id: string;
  title: string;
  description?: string;
  status: ProjectStatus;
  createdAt: number;
  updatedAt: number;
  completedAt?: number;
  scrappedAt?: number;
  sections: ScriptSection[];
  publishing: Record<PlatformKey, PlatformPublishStatus>;
  targetPlatforms?: PlatformKey[]; // Platforms selected for this video (defaults to all 5)
  tags?: string[];
  notes?: string;
}

export interface AppDataExport {
  version: number;
  exportedAt: string;
  app: 'video-production-tracker';
  projects: VideoProject[];
}
```

---

## 3. Workflow & Progress Calculation Engine

### The 4-Stage Production Pipeline
1. **Scriptwriting**: Drafting and structuring sections (Hook, Intro, Main Points, Outro).
2. **Filming**: Recording each individual section (`filmed: true`).
3. **Video Editing**: Assembling and cutting sections into the timeline (`inserted: true`).
4. **Publishing**: Distributing the final video across YouTube, LinkedIn, Facebook, Instagram, and TikTok.

### Balanced Progress Calculation Formula
To avoid projects with many script sections dwarfing publishing tasks (or vice-versa), progress is divided into weighted milestones:

$$\text{Filming Score} = \frac{\text{Filmed Sections}}{\text{Total Sections}}$$
$$\text{Editing Score} = \frac{\text{Inserted Sections}}{\text{Total Sections}}$$
$$\text{Publishing Score} = \frac{\text{Published Platforms}}{\text{Target Platforms}}$$

$$\text{Overall Progress} = \text{Round}\left( (\text{Filming Score} \times 0.40) + (\text{Editing Score} \times 0.40) + (\text{Publishing Score} \times 0.20) \times 100 \right)$$

*Edge cases handled:*
- If a project has **0 sections**, filming & editing progress are treated as 0%, and publishing accounts for platform status, or overall is 0% until sections are added.
- If all sections are filmed + inserted, and all platforms published, progress is strictly **100%**.
- Progress calculations are encapsulated in `src/utils/progressCalculator.ts` with customizable weights for future configurability.

---

## 4. UI / UX Design & Component Hierarchy

### Component Tree
```
src/
├── components/
│   ├── layout/
│   │   ├── AppLayout.tsx              # Main dual-pane shell
│   │   ├── Header.tsx                 # App bar, search, quick stats
│   │   └── Sidebar.tsx                # Project lists (Active/Completed/Scrapped)
│   ├── projects/
│   │   ├── ProjectCard.tsx            # Sidebar project item with progress bar
│   │   ├── ProjectListSection.tsx     # Accordion/collapsible section (Active/Done/Scrapped)
│   │   ├── ProjectDetailView.tsx      # Main project cockpit
│   │   ├── CreateProjectModal.tsx     # Modal to add a project
│   │   └── ProjectStatusBadge.tsx     # Clean status indicators
│   ├── script/
│   │   ├── ScriptSectionList.tsx      # Reorderable list of script chunks
│   │   ├── ScriptSectionItem.tsx      # Card with Title, Textarea, Filmed/Inserted toggles
│   │   └── ScriptQuickAddPresets.tsx  # 1-click add "Hook", "Intro", "Main Point", "CTA"
│   ├── publishing/
│   │   ├── PublishingChecklist.tsx    # Platform cards grid
│   │   └── PlatformCard.tsx           # YouTube, LinkedIn, Facebook, IG, TikTok toggles
│   ├── common/
│   │   ├── ProgressBar.tsx            # Animated multi-color or single-tone progress bar
│   │   ├── ConfirmDialog.tsx          # Confirm delete/scrap modals
│   │   ├── Toast.tsx                  # Success/Error notifications
│   │   └── EmptyState.tsx             # Friendly onboarding & empty views
│   └── backup/
│       ├── ExportImportModal.tsx      # JSON backup & restore modal
│       └── ValidationReportModal.tsx  # File validation error/warning display
├── context/
│   └── ProjectContext.tsx             # Central state management & reducer
├── services/
│   ├── storageService.ts              # LocalStorage CRUD & serialization
│   └── backupService.ts               # JSON validation, sanitization & export/import
├── utils/
│   ├── progressCalculator.ts          # Weighted progress algorithm
│   └── defaults.ts                    # Preset script templates & sample starter projects
└── types/
    └── index.ts                       # TypeScript schemas
```

---

## 5. Local Persistence & JSON Export/Import Strategy

### A. Local Persistence
- Key: `video_production_tracker_v1`
- Immediate synchronization upon every state mutation with `window.localStorage`.
- Storage quota check & safety fallback.

### B. Backup & Export
- Formats all projects, sections, timestamps, and publish states into an indented JSON payload.
- Triggers browser file download: `video-production-tracker-backup-YYYY-MM-DD.json`.

### C. Safe Import Validation
- Multi-step validation pipeline:
  1. Parse JSON with `try/catch`.
  2. Verify top-level structure (`projects` array).
  3. Validate project schema (guarantee `id`, `title`, sanitize `status`).
  4. Validate section schema (re-index `order`, normalize `filmed` and `inserted` booleans).
  5. Validate publishing state (ensure all 5 platform keys exist, filling missing keys with defaults).
  6. Display preview dialog: showing count of valid projects to be imported, with option to **Merge** with existing or **Replace** all data.
  7. Handle corrupt/malformed files with descriptive user-facing alerts.

---

## 6. Detailed Step-by-Step Implementation Roadmap

### Phase 1: Environment & Project Setup
- Verify dependencies (`lucide-react`, `clsx`, `tailwind-merge`).
- Setup `tailwind.config.js` with modern color palette (Zinc/Slate base, Emerald for filmed/complete, Blue for editing, Purple for publishing).
- Create `src/types/index.ts` with complete data schemas.

### Phase 2: State Management & Storage Service
- Implement `src/services/storageService.ts` for safe reading, writing, and sample data seeding.
- Implement `src/services/backupService.ts` for JSON export and robust schema validation on import.
- Implement `src/utils/progressCalculator.ts` for workflow percentage calculations.
- Create `src/context/ProjectContext.tsx` with full reducer actions (`CREATE_PROJECT`, `UPDATE_PROJECT`, `DELETE_PROJECT`, `SET_STATUS`, `ADD_SECTION`, `UPDATE_SECTION`, `REORDER_SECTIONS`, `DELETE_SECTION`, `TOGGLE_FILMED`, `TOGGLE_INSERTED`, `TOGGLE_PUBLISHED`, `IMPORT_DATA`, `RESET_DATA`).

### Phase 3: UI Shell & Sidebar Navigation
- Build `Sidebar.tsx` displaying:
  - Header & "New Project" button.
  - Collapsible groups: **Active**, **Completed**, **Scrapped**.
  - Project search/filter bar.
  - Project cards with live progress bars and % badges.
  - Footer with "Export / Import Backup" and "Quick Help".
- Build `Header.tsx` showing current project title, quick status switcher, and progress summary.

### Phase 4: Script & Production Stages (The Core Workflow)
- Build `ScriptSectionList.tsx` and `ScriptSectionItem.tsx`:
  - Quick-add preset chips (`+ Hook`, `+ Intro`, `+ Point`, `+ B-Roll`, `+ Call to Action`, `+ Outro`).
  - Section text area with word count / estimated reading time.
  - Dual checkboxes: 🎥 **Filmed** & ✂️ **Inserted into Video**.
  - Reorder controls (Up, Down, Drag handle) and Delete action.
- Script overview banner showing summary (e.g. `3/5 Filmed (60%)`, `2/5 Inserted (40%)`).

### Phase 5: Multi-Platform Publishing Module
- Build `PublishingChecklist.tsx`:
  - 5 Platform cards (YouTube, LinkedIn, Facebook, Instagram, TikTok) with brand styling and icons.
  - Platform toggle switch/checkbox with timestamp tracking (`Published on Aug 23, 2026`).
  - "Publish All" quick action.
  - Visual indicator if video editing is not yet finished.

### Phase 6: Project Status, Completion & Scrapping Actions
- Workflow guardrails:
  - When all sections are filmed + inserted and all platforms are marked published, display a prominent **"Complete Project 🎉"** celebration banner and button.
  - Quick action to move to **Completed** or **Scrapped** from header or dropdown menu.
  - Ability to restore a scrapped/completed project back to **Active**.
  - Permanent delete confirmation dialog.

### Phase 7: JSON Backup / Restore UI
- Build `ExportImportModal.tsx`:
  - One-click Download JSON Backup.
  - Drag-and-drop or file selector for `.json` upload.
  - Schema validator feedback (display valid project count and warning log).
  - Choice of "Merge with existing" or "Overwrite all data".
  - "Reset / Seed Demo Data" button for quick testing.

### Phase 8: Verification, Polish & Automated Testing
- End-to-end testing against all 13 checklist requirements:
  1. Create project.
  2. Add multiple script sections.
  3. Edit, reorder, and delete sections.
  4. Mark sections as filmed.
  5. Mark sections as inserted.
  6. Mark publishing platforms as completed.
  7. Verify real-time progress calculations.
  8. Mark project as Completed.
  9. Scrap a project and verify sidebar categorization.
  10. Refresh page and verify local persistence.
  11. Export JSON file.
  12. Clear/reset local data.
  13. Import JSON file and verify perfect restoration.
- Build production bundle (`npm run build`) to ensure zero TypeScript errors or build issues.

---

## 7. Deliverable Checklists & Verification Criteria

| Requirement | Implementation Detail | Status |
|---|---|---|
| **Sidebar 3 Categories** | Active, Completed, Scrapped with item counts & progress | Planned |
| **Section Script Breakdown** | Multiple independent script chunks with custom titles & content | Planned |
| **Dual Status per Section** | Filmed (`filmed`) and Inserted (`inserted`) checkboxes | Planned |
| **5 Publishing Platforms** | YouTube, LinkedIn, Facebook, Instagram, TikTok independent toggles | Planned |
| **Balanced Progress Metric** | 40% Filming + 40% Editing + 20% Publishing weighted formula | Planned |
| **Local Persistence** | `localStorage` automatic saving with data integrity guards | Planned |
| **JSON Export & Import** | Full state serialization, schema validation, merge/replace modes | Planned |
| **Clean Desktop UI** | Modern high-contrast interface optimized for fast keyboard/mouse entry | Planned |
