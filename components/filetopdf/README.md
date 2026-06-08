# FileToPDF — Pipedream components

[FileToPDF](https://filetopdf.dev) turns files, raw HTML, and Markdown into PDFs
with a single API call. This package provides the Pipedream **app + action
components** for the registry (`PipedreamHQ/pipedream` → `components/filetopdf/`).

## Actions

| Action | Endpoint | What it does |
|--------|----------|--------------|
| **Convert a File to PDF** | `POST /file` | Convert Word, Excel, PowerPoint, images and 130+ formats. Two input modes: **(a)** a file from a previous step — give its `/tmp` file path in the **File** field and we upload it; **or (b)** a public URL in the **File URL** field, which the API downloads server-side. Converter picked from the file extension. |
| **Convert HTML to PDF** | `POST /html` | Render raw HTML + optional CSS into a PDF (Chromium). |
| **Convert Markdown to PDF** | `POST /markdown` | Render Markdown + optional CSS into a PDF. |
| **Get Account Status** | `GET /account` | Validate the key and read plan + remaining credits. Free, never rate-limited — the connection test. |

There are **no triggers/sources**: the API is pure request/response (no webhooks
or polling feed). Each convert action writes the resulting PDF to `/tmp` and
returns its `filePath` plus metadata (`filename`, `pages`, `fileSize`,
`creditsUsed`, `creditsRemaining`), so the next step (Google Drive, Dropbox,
Email, S3…) can consume the file directly.

## Authentication

Custom **API key**, sent on every request as the `x-api-key` header (consumed via
`this.$auth.api_key`).

> Get a free API key in one click at **[filetopdf.dev](https://filetopdf.dev)** —
> no account needed. Includes 10 free conversions. Paste it into the connection
> and you're done.

## Layout options

The convert actions expose an advanced options group (landscape, paper size,
margins, scale, page ranges, PDF/A, PDF/UA, password protection) with the **same
labels and help copy** as the FileToPDF Zapier / Make / n8n integrations. Values
are sent to the API as strings. Note: conversion parameters require the **Pro,
Scale, or free-trial** plan — on Starter/Basic the API returns a clear
`upgrade_required` error naming the option.

`POST /file` (LibreOffice/passthrough) supports landscape, page ranges, PDF/A,
PDF/UA, source-document password, and output passwords — **not** paper
size/margins/scale, which are Chromium-only.

## Layout / project structure

```
filetopdf.app.mjs                  app: auth + request methods + reusable option propDefinitions
common/constants.mjs               BASE_URL, PDF/A options, friendly error mapping
actions/convert-file/…             POST /file (upload or URL)
actions/convert-html/…             POST /html
actions/convert-markdown/…         POST /markdown
actions/get-account/…             GET /account (connection test)
assets/icon.png                    512×512 RGBA app logo
test/live-test.mjs                 live test against the real API
```

## Validate & test

```bash
npm install

# static check
for f in filetopdf.app.mjs common/*.mjs actions/*/*.mjs; do node --check "$f"; done

# live test (needs a real key)
cp .env.example .env        # then set API_KEY=sk_live_...
node test/live-test.mjs
```

The live test covers the connection test plus at least one conversion per action
(HTML, Markdown, file-from-URL, and file-from-/tmp-upload), asserting each
produces a real `%PDF` file.

> The test key lives only in a **gitignored `.env`** — never commit or print it.

## Publishing (public listing)

The goal is public listing in Pipedream's marketplace/search. Because `filetopdf`
is a **new app**, Pipedream must register the app + its API-key auth before a
components PR can land — so it's a 3-gate process:

1. **Request the new app** (GitHub issue on `PipedreamHQ/pipedream`) → Pipedream
   creates the `filetopdf` slug + `x-api-key` auth + the `components/filetopdf/` dir.
2. **PR these components** into a fork → review.
3. **Merge** → auto-appears in public search.

See **[PUBLISHING.md](./PUBLISHING.md)** for the full runbook, the exact new-app
request payload, and current status.
