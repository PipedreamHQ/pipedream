# Overview

DocSpring fills in PDF templates with your data, generates PDFs from HTML, and collects e-signatures. With these components you can generate PDFs (one at a time or in batches), combine PDFs, send documents out for signature with a signing link for each signer, and manage templates, their fields and folders. The **New Event (Instant)** source starts a workflow when a PDF is ready, a signer completes a signature request, or a template changes.

The components use [DocSpring's API v2](https://docspring.com/docs/api/). Self-hosted DocSpring servers need the release that has API v2.

# Example Use Cases

- **Generate a contract from a form**: when someone submits a form, **Generate PDF** fills in your contract template with their answers, and the next step emails the PDF's `files.pdf.download_url` or saves it to cloud storage.
- **Collect signatures**: **Create Signature Request** creates a submission for one or more signers and returns a signing link for each. Send the links by email or chat, and use **New Event (Instant)** with `submission.processed` to file the signed PDF.
- **Monthly statements in bulk**: on a schedule, **Generate PDFs in a Batch** makes up to 50 PDFs in one request, and **Combine PDFs** merges them into one file.
- **Templates from your own PDFs**: **Create Template** turns a PDF at a URL (or in `/tmp`) into a template and sets up its fields with AI field detection; **Publish Template Version** publishes changes.

# Getting Started

1. Create an API token on DocSpring's [API Tokens page](https://app.docspring.com/api_tokens). Use a test token while you build: test PDFs are free and have a watermark.
2. Connect your DocSpring account in Pipedream with the token's ID and secret, and choose your region (US, EU or self-hosted).
3. Add an action and choose a template. **List Template Fields** shows the field names your data uses.

# Troubleshooting

- **`invalid_data`**: the data doesn't match the template's fields. The error lists each problem, such as a required field that's missing or a date that isn't `YYYY-MM-DD`. **Check Data** checks data without making a PDF.
- **"The PDF wasn't ready in time"**: the PDF is still being generated. Get it later with **Get Submission**, or use **New Event (Instant)** with `submission.processed`.
- **"This DocSpring server doesn't have API v2 yet"**: upgrade your self-hosted DocSpring server to the latest release.
