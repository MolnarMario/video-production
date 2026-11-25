<h1 align="center">Video Production Tracker</h1>

<p align="center">
  <b>Script, film, edit and publish, one section at a time.</b><br>
  A browser app for making videos: each project is a script split into
  sections, every section knows whether it has been filmed and edited in, and
  publishing is tracked per platform. No account, no server.
</p>

<p align="center">
  <a href="https://video.thebarbellengineer.com/"><b>Open the app</b></a> ·
  <a href="https://thebarbellengineer.com/projects/video-production-tracker/">Project page</a> ·
  <a href="#get-started">Get started</a> ·
  <a href="PLAN.md">Design plan</a> ·
  <a href="LICENSE">MIT license</a>
</p>

<p align="center">
  <img src="https://thebarbellengineer.com/assets/img/video-1600.webp" alt="A video project: script sections with filmed and edited checkboxes, and progress bars" width="720">
</p>

## Why

I make videos, and a video is never one task. The script has a hook, an
intro, a few main points and a call to action; each part gets filmed on a
different day, cut in later, and then the finished video goes out to five
platforms. A to-do list loses track of which section is still missing from
the edit. So this tracker is organised the way the work actually happens:
by script section, through each production stage.

## What it does

### Write the script in place

- **A project is a script in sections.** Quick-add templates for a hook, an
  introduction, main points, B-roll and a call to action, or add your own.
- **A rich-text editor per section**, with bold, italics and lists. Rename,
  reorder or delete sections as the script changes.

### Know what's filmed and what made the edit

- **Two checkboxes per section:** **Filmed** and **Inserted** into the edit,
  so nothing gets forgotten between the shoot and the cut.
- **Progress at a glance.** Bars for filming, editing and publishing, per
  project, and an overall figure weighted 40% filming, 40% editing and 20%
  publishing, so a long script doesn't drown out its publishing.

### Track where it went live

- **Publishing per platform:** YouTube, LinkedIn, Facebook, Instagram and
  TikTok, each marked draft or published, with **Mark All Uploaded** for the
  day it all goes out.
- **Project status:** active, completed or scrapped. Scrapped projects are
  archived, not deleted, and can be restored.

### Keep your work safe

- **Saved as you type** in your browser's local storage. Nothing leaves your
  device.
- **JSON backup and restore.** An imported file is validated and repaired
  before it touches your data, and you see how many projects it holds before
  you choose to merge or replace.
- **Light and dark themes**, and a font picker that previews each option.

## Get started

1. Open **https://video.thebarbellengineer.com/**.
2. Click **New Project** and give the video a title.
3. Add sections with the quick-add templates and write each one.
4. As you shoot and edit, tick **Filmed** and **Inserted** on each section.
5. When it's out, mark each platform as published.
6. Every so often, use **Backup / Restore** in the header to download a JSON
   backup. Your data lives in this browser only, so clearing site data or
   switching browsers starts empty until you restore a backup.

## Run it locally

Needs Node.js 18 or newer.

```sh
npm install
npm run dev       # dev server
npm run build     # type-check and build the site into dist/
```

Pushing to `main` deploys to GitHub Pages through
`.github/workflows/pages.yml`.

## How it works

- **React, TypeScript, Vite and Tailwind CSS**, with all state in a React
  context and one localStorage key (`video_production_tracker_v1`) written on
  every change.
- **Progress is computed in one place**, `src/utils/progressCalculator.ts`,
  from the filmed and inserted flags and the published platforms.
- **Imports go through a validation pipeline** in
  `src/services/backupService.ts`: parse, check the top-level shape, validate
  and repair each project, section and platform state, then show a preview
  before merging or replacing.
- **Section text is sanitized** before it's saved, so pasted HTML can't carry
  scripts or embeds into the page.

The full design, data model and roadmap are in [PLAN.md](PLAN.md).

## License

[MIT](LICENSE). Built by Mario Molnar.
