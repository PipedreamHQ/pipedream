# Overview

[Emboss](https://getemboss.ai) turns flat PDFs into fillable forms and fills
them with AI. The Emboss API detects the fields on any flat PDF — text
fields, checkboxes, signatures, tables — and can pre-fill them from context
documents you provide. These components wrap the three core operations:
create a fillable form, fill a PDF from context in one step, and fill a form
you already created.

# Example Use Cases

- **Intake automation** — a client uploads a government or insurance PDF;
  the workflow fills it from your CRM record and files the completed copy.
- **Document generation at scale** — fill the same permit or application
  form for hundreds of records from a spreadsheet or database.
- **Email-to-filled-form** — trigger on an inbound attachment, fill it from
  the email body as context, and send the completed PDF back.

# Getting Started

1. Create an Emboss account at [getemboss.ai](https://getemboss.ai) and
   generate an API key from the dashboard.
2. Connect your Emboss account in Pipedream by pasting the API key.
3. Add one of the Emboss actions to your workflow. Form processing is
   asynchronous — the action polls until the PDF is ready, then returns the
   file path.

# Troubleshooting

- **"not a readable PDF"** — the File/URL you mapped must point at the PDF
  bytes, not a filename string. Map the upstream step's file URL or `/tmp`
  path.
- **Job failed with a detail message** — the Emboss API reports per-job
  errors verbatim; the action surfaces them as the step error.
- **Long-running forms** — large PDFs can take a few minutes; the action
  re-checks every 5 seconds for up to 5 minutes, then errors so the workflow
  never proceeds silently.
