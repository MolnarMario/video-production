# Video Production Tracker

I make videos, so I built the tracker I wanted. Each project is a script split
into sections, and every section has its own filmed and edited checkboxes.
Progress bars show filming, editing and publishing per project, and publishing
is tracked per platform: YouTube, LinkedIn, Facebook, Instagram and TikTok.

Everything saves to your browser's localStorage. There's no account and no
server. JSON backup and restore checks the file before it touches your data.

**Live: https://video.thebarbellengineer.com/**

## Run it locally

```
npm install
npm run dev
```

`npm run build` type-checks and writes the site to `dist/`. Pushing to `main`
deploys it to GitHub Pages through `.github/workflows/pages.yml`.

Built with React, TypeScript, Vite and Tailwind CSS. The design and roadmap
are in [PLAN.md](PLAN.md).

## License

MIT, see [LICENSE](LICENSE).
