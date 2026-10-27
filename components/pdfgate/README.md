# Overview

[PDFGate](https://pdfgate.com) is an API for generating, processing and e-signing PDFs. With the PDFGate components on Pipedream you can turn HTML or a URL into a PDF, upload an existing PDF, compress, flatten, watermark or password-protect it, extract its form data, and send it out for electronic signature as an envelope. Instant triggers fire when an envelope is sent or when every recipient has signed, so you can continue a workflow with the signed document, the audit log and the recipient details.

# Example Use Cases

- **Invoice generation**: When a new order lands in Stripe, Shopify or your database, render an HTML invoice with **Generate PDF**, then email the pre-signed download link or store the file in Google Drive or S3.
- **Contract e-signature**: When a deal is marked *Won* in HubSpot or Salesforce, generate the agreement, create an envelope with **Create Envelope**, email the signing links with **Send Envelope**, and use the **New Envelope Completed** trigger to file the signed document and audit log.
- **Document hardening**: Upload a PDF from Dropbox with **Upload File**, flatten its form fields, stamp a `CONFIDENTIAL` watermark, protect it with a password, and post the result to Slack.
- **Form intake**: Receive a filled PDF form by email, upload it, and run **Extract PDF Form Data** to push the field values into Airtable or a spreadsheet.

# Getting Started

1. Create a PDFGate account and generate an API key from **Settings** in the [PDFGate dashboard](https://pdfgate.com).
   - Keys starting with `test_` use the sandbox API (`https://api-sandbox.pdfgate.com`) and are not billed.
   - Keys starting with `live_` use the production API (`https://api.pdfgate.com`).
2. In Pipedream, add a PDFGate action or trigger to a workflow and connect your account by pasting the API key. The components pick the sandbox or production base URL automatically from the key prefix.
3. For the envelope triggers, make sure document storage is enabled for at least 1 month in **Settings → Storage** so signed documents remain downloadable after the event fires.

## Actions

| Action | Description |
| --- | --- |
| Generate PDF | Generate a PDF from a public URL or raw HTML with full control over page size, margins, headers/footers, rendering options and fillable form fields |
| Upload File | Upload a PDF from a public URL so other actions can reference it |
| Get Document | Retrieve a stored document and a pre-signed download URL |
| Delete Document | Delete a stored document |
| Compress PDF | Reduce a PDF's file size |
| Flatten PDF | Flatten interactive form fields into static content |
| Extract PDF Form Data | Return the values of a fillable PDF's form fields as JSON |
| Protect PDF | Encrypt a PDF with user/owner passwords and permission restrictions |
| Watermark PDF | Overlay a text watermark |
| Create Envelope | Create a signing envelope from one or more stored documents |
| Send Envelope | Email signing links to an envelope's recipients |
| Get Envelope | Retrieve an envelope with its documents and recipient statuses |

Document actions accept a **Pre-Signed URL Expiry** between 60 and 86400 seconds. Set it to receive a temporary `fileUrl` download link in the response and to control how long that link stays valid; when it is left empty no `fileUrl` is returned. Download links require document storage to be enabled in **Settings → Storage**.

## Triggers

| Trigger | Event |
| --- | --- |
| New Envelope Sent | `envelope.sent` – an envelope was sent and signing has begun |
| New Envelope Completed | `envelope.completed` – every recipient has signed |

Each trigger registers a PDFGate webhook when the source is deployed and attempts to remove it when the source is deleted. Deliveries are verified with the HMAC-SHA256 signature PDFGate sends in the `x-pdfgate-signature` header; requests that fail verification are rejected with a `401` and are not emitted.

# Troubleshooting

- **`401 Unauthorized`**: the API key is missing or invalid. Reconnect the account with a key copied from the PDFGate dashboard and check the `test_` / `live_` prefix matches the environment you expect.
- **`Unknown field 'jsonResponse'`**: the `Upload File` and `Extract PDF Form Data` endpoints always return JSON and reject that flag. The components already omit it; if you call the API directly from a code step, leave it out for those two endpoints.
- **Generate PDF times out**: there are three separate limits. **Render Timeout** covers page rendering only (not PDF creation) and defaults to its 15-minute maximum, so raise it only if you set a lower value. **Wait For CSS Selector** fails after its own 30-second limit if the selector never appears, even on a loaded page. **Wait For Network Idle** keeps the request pending while long-polling connections stay open, until the step's own 15-minute request limit ends it. Check the selector, keep **Render Delay** small, turn off **Wait For Network Idle** on pages with long-polling requests, or pre-render the content as HTML and pass it in **HTML Content**.
- **Trigger never fires**: confirm the envelope was actually sent (status `in_progress`) and that the webhook exists in the PDFGate dashboard. Re-deploying the source re-registers the webhook.
- **Signed document is missing after completion**: enable document storage for at least 1 month in **Settings → Storage**; without storage the signed PDF is not retained for download.
