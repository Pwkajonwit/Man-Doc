# MAN Documents

Document manager UI built with `Next.js 16 + Tailwind CSS 4` and prepared for `Google Apps Script`.

## Run

From this folder:

```bash
npm install
npm run dev
```

Open `http://localhost:3000`

## GAS Setup

1. Copy `.env.example` to `.env.local`
2. Set `GAS_WEB_APP_URL` to your deployed Apps Script Web App URL
3. Import the sample backend from [`gas/Code.gs`](./gas/Code.gs)
4. Deploy the script as a Web App

If `GAS_WEB_APP_URL` is missing, the dashboard runs in demo mode with mock data.

## What Is Included

- Dashboard UI based on your design
- Folder cards, recent files, and file table
- Inline form for creating folders and uploading files
- `Next API` route at `src/app/api/documents/route.ts`
- Sample `Google Apps Script` backend for Drive + Sheets
