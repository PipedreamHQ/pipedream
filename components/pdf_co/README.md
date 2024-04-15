# Overview

The PDF.co API on Pipedream enables you to automate various PDF-related tasks. You can extract data from PDFs, convert them into different formats, generate new PDFs from templates, and perform barcode reading or writing. Integrating PDF.co into your Pipedream workflows allows you to streamline document processing, connect with other services, and automate data extraction and document conversions within your applications or data pipelines.

# Example Use Cases

- **Data Extraction from Invoices**: Automatically extract text and data from uploaded invoices. When a new invoice is received via email, Pipedream can trigger a workflow that uses PDF.co to parse the invoice, then send the extracted data to a Google Sheets spreadsheet for accounting purposes.

- **PDF Generation from Form Submissions**: Create PDF documents from online form submissions. Whenever a user submits a form on your website, the submission can trigger a Pipedream workflow. PDF.co can then generate a PDF from the form data and store it in a cloud service like Dropbox or Google Drive.

- **Merge Multiple PDFs and Send via Email**: Combine several PDF files into one and email the merged document. Use Pipedream to listen for a signal (like a webhook) that indicates PDFs are ready to be merged. PDF.co merges the documents, and the final file can then be sent to specified recipients through an email service such as SendGrid.
