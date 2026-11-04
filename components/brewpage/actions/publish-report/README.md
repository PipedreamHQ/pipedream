# Overview

Publish a reviewed HTML or Markdown report to a temporary BrewPage reader link. No BrewPage API key or account is needed. The registry action references the BrewPage app definition, so staff app registration is needed before provider registry use.

# Example Use Cases

Publish a generated build report, task summary or reviewed Markdown document, then use its reader link in later workflow steps.

# Getting Started

1. Supply reviewed HTML or Markdown as **Report Content**, a native secret string prop. Avoid sensitive data in upstream event history and ordinary step outputs.
2. Choose **HTML** or **Markdown**, then explicitly choose **Public** or **Unlisted**. Public is listed in the gallery and searchable; Unlisted is readable by anyone with the link and is not password protected.
3. Choose **Requested Retention in Days**, from 1 to 30. Hosting expires; an existing identical publication can retain its original expiry. Use the returned `expiresAt`.
4. Review the reader link and reported access before sharing. The action returns seven reader metadata fields and a harmless success summary. It deliberately discards management capabilities and cannot edit, delete or extend publications.

Maximum report size is 5 MiB UTF-8. HTML is stored verbatim and may load external resources when read. Upload only the report you reviewed. The content prop is encrypted/hidden by Pipedream; upstream events and infrastructure retention remain governed by the workflow and provider.

# Troubleshooting

One request is made with a 60-second timeout, redirects disabled and response data capped at 64 KiB. No automatic retries are made. A timeout or invalid response can happen after publication succeeded; inspect the workflow before retrying manually.

The action uses pinned platform axios, a request-scoped wrapper around its official HTTP transport, and response transformation before SDK capture. Response headers/status text and transport failures are minimized before platform helpers; remaining cancellation errors are sanitized before leaving the app method. Do not enable SDK debug capture or replace the transport guard without checking capability leakage. Local SDK fixtures do not establish provider infrastructure tracing behavior.
