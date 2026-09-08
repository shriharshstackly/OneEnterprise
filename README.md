# One Enterprise

Production frontend shell based on the OneEnterpriseDemo architecture and theme.

## What's included

- Login page (same brand theme)
- Protected app shell: sidebar + top bar / breadcrumbs
- Fresh Dashboard starter page
- Auth session, toast, locale, theme providers
- Auth-only mock API for local development

## Quick start

```bash
npm install
npm run dev
```

Demo login: `admin@oneenterprise.com` / `admin123`

## Point to a real API

In `.env`:

```
VITE_USE_MOCK_API=false
VITE_API_BASE_URL=http://localhost:5000/api
```

## Theme

- Navy sidebar / brand: `#0D1029`
- Accent blue: `#2F6BFF`
