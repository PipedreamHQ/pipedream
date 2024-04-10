# Overview

The Adobe PDF Services API lets you leverage a range of PDF functions within Pipedream workflows. Use it to create, convert, manipulate, and combine PDF files, or to extract data from PDF documents. With Pipedream, you can automate document processing tasks, streamline data extraction, and connect PDF services to countless other apps without writing complex code.

## Example Adobe PDF Services Workflows on Pipedream

- **PDF Generation from Markdown**: Automatically generate PDFs from Markdown files stored in GitHub. When a new commit is made to a specific repo, the workflow can convert any updated Markdown files to PDF format using Adobe PDF Services, then upload the PDF to Google Drive and notify you via Slack.

- **Document Signing Process**: Create a workflow that listens for new entries in a Google Sheet (signifying signatory information), uses Adobe PDF Services to generate a personalized PDF contract, emails the document for signing via DocuSign, and then stores the signed version in Dropbox.

- **PDF Data Extraction for Analysis**: Set up a workflow that triggers when a PDF is uploaded to a specific AWS S3 bucket. Use Adobe PDF Services to extract text and data from the PDF, send that information to Google Sheets for record-keeping and further analysis, and post a summary message in a Microsoft Teams channel.
