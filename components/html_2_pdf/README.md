# Overview

The HTML 2 PDF API allows you to convert HTML documents to PDFs. In Pipedream, you can integrate this API into workflows to automate document generation tasks. This can be incredibly useful for generating reports, invoices, or any other document where you start with HTML and need a PDF output. You can trigger these conversions with various events – like a new form submission, a scheduled trigger, or even updates in a database.

# Example Use Cases

- **Scheduled Report Generation**: Combine HTML 2 PDF with Pipedream's cron trigger to automate weekly or monthly report generation. Start with dynamic HTML templates populated with the latest data from your database using a SQL query in Pipedream, then convert these to PDFs for distribution.

- **Invoice Creation Upon New Orders**: Upon a new order in an eCommerce app like Shopify, trigger a workflow in Pipedream that generates an HTML invoice with the order details and then use HTML 2 PDF to convert this invoice into a PDF. Email the PDF to the customer or store it in cloud storage like Google Drive.

- **Form Submission to PDF Conversion**: When a new form submission is received via Typeform or Google Forms, use a Pipedream workflow to format the submission into an HTML document. Then, with HTML 2 PDF, convert the submission into a PDF for archival purposes or to kick off an approval process.
