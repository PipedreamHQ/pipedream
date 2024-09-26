# Overview

The iLovePDF API lets you automate PDF processing tasks like merging, splitting, compressing, and converting PDFs to other formats. iLovePDF's robust functionality can be harnessed in Pipedream workflows, which may include handling PDFs generated from various triggers, processing them as needed, and connecting to other services for storage, data extraction, or further actions based on the transformed PDFs.

# Example Use Cases

- **Automated Invoice Processing**: Retrieve invoices from an email app like Gmail when they arrive, use iLovePDF to merge multiple PDFs into one, then save the merged file to Google Drive and notify accounting via Slack.

- **PDF Archival Workflow**: Trigger a workflow whenever new PDFs are uploaded to Dropbox. Use iLovePDF to compress these PDFs, then store the compressed versions back in Dropbox in an archive folder, and log the details to a Google Sheet for record keeping.

- **E-book Conversion and Distribution**: When new e-book content is pushed to a GitHub repository, use iLovePDF to convert documents from Word to PDF, then distribute the finished PDFs using SendGrid to email subscribers or upload to a CMS like WordPress for content delivery.
