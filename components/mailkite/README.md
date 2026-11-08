# MailKite

[MailKite](https://mailkite.dev/?utm_source=pipedream&utm_medium=integration&utm_campaign=components-detail) is developer-first email infrastructure: **receive email as a
clean JSON webhook** and **send email with one API call**, on your own verified domains.

## Overview

This app provides two components:

- **New Inbound Email (Instant)** — a source that triggers a workflow the moment an email arrives
  at one of *your* MX-verified MailKite domains. Unlike a generic "new email" trigger tied to a
  vendor-generated address, this fires for mail to your real domain (`support@yourcompany.com`).
  Each event is the parsed message: `from`, `to`, `subject`, `text`, `html`, `threadId`,
  authentication results (`spf`/`dkim`/`dmarc`/`spam`), and `attachments` (with signed download
  URLs).
- **Send Email** — an action that sends a message from a verified domain: `to`/`cc`/`bcc`,
  `subject`, `html`/`text`, `reply-to`, threading (`in-reply-to`), attachments, extra MIME
  headers, saved or base templates with merge data, per-send open/click tracking, and
  send-later scheduling.

## Example Use Cases

- **Reply-by-email support inbox** — inbound customer replies trigger a workflow that creates a
  ticket, runs an AI draft, and sends the response with **Send Email**.
- **Give an AI agent its own inbox** — route mail to a domain, let an agent read each message and
  act (lookup, summarize, respond).
- **Inbound-to-database** — parse incoming mail and append rows to Sheets, Notion, or Postgres.
- **Transactional send** — fire receipts, magic links, or notifications from any workflow.

## Getting Started

1. **Create a MailKite account** and add a domain at [mailkite.dev](https://mailkite.dev/?utm_source=pipedream&utm_medium=integration&utm_campaign=components-detail).
2. **Verify the domain's DNS** — MX (to receive) and SPF + DKIM (to send). Inbound and outbound
   are gated until the relevant records verify.
3. **Connect your account** in Pipedream using a MailKite **API key** (`mk_live_…`).
4. **To receive:** add the *New Inbound Email* source and pick your verified domain — that is the
   whole setup. The source registers its endpoint with MailKite, keeps the signing secret MailKite
   issues, and verifies every delivery's signature with no further steps. (Set **Webhook Signing
   Secret Override** only if you rotate the secret in the dashboard.) On first deploy it backfills
   up to **50** of the domain's most recent stored emails, so the workflow has real events to build
   against before the next message arrives.
5. **To send:** add the *Send Email* action, set the `From` to an address on a verified domain, and
   provide `html`/`text` or a `Template ID`. To attach a file, add an entry to **Attachments** —
   an object with `filename` plus either `url` (fetched at send time; preferred for large files)
   or `content` (base64 bytes). To send later, set **Schedule Send** to an ISO 8601 timestamp,
   `in 2 hours`, or a ms-epoch.

## Troubleshooting

- **No inbound events?** The domain must be **MX-verified** — the domain picker only lists
  MX-verified domains, and webhook registration is rejected otherwise. Confirm mail is actually
  reaching MailKite (check the dashboard's message log).
- **Backfill came up short?** It only covers mail **stored** by MailKite: a zero-retention domain
  keeps nothing to replay, and messages encrypted at rest are skipped (their bodies can't be read
  back through the API — the source logs how many). Live deliveries are unaffected either way.
- **Signature check failing?** Make sure the **Webhook Signing Secret** matches the one in your
  MailKite dashboard. The signature is HMAC-SHA256 over `` `${timestamp}.${rawBody}` `` and the
  header is `x-mailkite-signature: t=<ms>,v1=<hex>`.
- **Source logs say `event.bodyRaw is unavailable`?** That is the fail-closed path: the Pipedream
  runtime did not hand the source the raw request body, so there is nothing to verify the
  signature against — the delivery is dropped rather than emitted unverified. It should not
  happen on Pipedream's current HTTP-source runtime (which exposes `bodyRaw`); if it does,
  check the runtime's release notes.
- **Send rejected?** The `From` address must be on a **verified sending domain** (SPF + DKIM).
  Provide at least one of `html`, `text`, or a `Template ID`, plus a `Subject` (unless the template
  supplies one).
- **Scheduled send says `scheduled`, not `sent`?** That is the success case: a future
  **Schedule Send** parks the message and the step returns an `ssnd_…` id with
  `status: "scheduled"`, cancelable via `DELETE /v1/scheduled/{id}`. The step summary says so.
  Note that **open/click tracking is not applied to scheduled sends** — set them on immediate
  sends only.
- **Tracking flags doing nothing?** They apply to **HTML** sends only (there is nothing to
  rewrite in a plain-text body). Leaving them unset is not the same as setting them to `false`:
  unset means "use the sending domain's default", `false` forces the flag off for this send.
- **MailKite retrying deliveries?** If you set **Acknowledgement Mode** to `ack`, the source must
  return `2xx` with `{"status":"ok"}` — it does this automatically; leave it on `lenient` if your
  downstream steps are slow.
