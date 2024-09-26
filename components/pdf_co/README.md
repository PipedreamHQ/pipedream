# Overview

PDF.co API on Pipedream opens up opportunities for automating document handling tasks. You can create PDFs from scratch, merge multiple documents, extract text or data, convert PDFs to different formats, and even perform complex operations like filling out forms programmatically. With Pipedream's serverless platform, these capabilities can be integrated into workflows that respond to events, schedule tasks, or trigger on specific conditions, streamlining processes that involve PDF manipulation.

# Example Use Cases

- **Data Extraction Workflow**: Extract text, tables, and form data from PDFs and feed them into a database like PostgreSQL. When a PDF is uploaded to Dropbox, the workflow triggers, processes the PDF using PDF.co to extract data, and then inserts the data into PostgreSQL for further analysis or reporting.

- **Invoice Processing Workflow**: Automate invoice generation by triggering a workflow whenever a new sale is recorded in Shopify. The workflow uses PDF.co to generate a PDF invoice, which is then emailed to the customer using the SendGrid Pipedream component, ensuring a seamless billing process.

- **Document Conversion and Archive Workflow**: Convert a batch of documents from Google Drive from various formats to PDFs, then compress and archive them in Amazon S3. A workflow monitors Google Drive for new files, uses PDF.co for conversion and compression, and then uploads the optimized files to S3, making it easier to manage document storage efficiently.
