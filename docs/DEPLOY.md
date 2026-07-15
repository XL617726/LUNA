# LUNA Deployment Guide

## Web (Vercel — Recommended)

```bash
cd apps/web
npx vercel --prod
```

Or one-click: import `apps/web/` into Vercel dashboard.

## Web (Static)

```bash
cd apps/web
npm run build        # → dist/
node server.cjs      # → http://localhost:3000
```

## WeChat Mini Program

1. Open `apps/miniapp/` in WeChat DevTools
2. Configure AppID in `manifest.json`
3. Upload via DevTools → Preview → Release

## CloudBase

```bash
# Configure environment
export LUNA_ENV_ID=luna-prod

# Deploy cloud functions
bash scripts/deploy-cloud.sh
```

## Desktop (Electron)

```bash
cd apps/desktop
npm install
npm run dev           # Development
npm run build         # Package installer
```

## GitHub Actions

Push to `master` → auto typecheck → test → build → e2e.

## Environment Variables

See `.env.example` — copy to `.env` and fill in values.
