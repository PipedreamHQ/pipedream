# Overview

The PDF-app.net API simplifies the creation, manipulation, and processing of PDF files directly from your applications. With this API, you can generate PDFs from HTML, merge multiple PDFs into one, split a single PDF into several documents, convert PDFs to other formats like JPG or PNG, and even extract text or images. Integrating PDF-app.net with Pipedream enables automation of these processes, connecting them to hundreds of other services for comprehensive workflow solutions.

# Example Use Cases

- **Generate Invoice PDFs from E-commerce Orders**: Automatically create PDF invoices when a new order is placed in Shopify. The workflow triggers when Shopify records a new order, then uses PDF-app.net to format and generate an invoice, and emails the PDF to the customer using the SendGrid app on Pipedream.
- **Merge Event Attendee PDFs for Conference**: After an event, compile all individual attendee PDF reports into a single document for easier distribution. This workflow could trigger on a schedule (e.g., daily) to fetch new PDFs from a Google Drive folder, merge them using PDF-app.net, and then re-upload the merged PDF back to Google Drive.
- **Convert Submitted Assignments to Images for Online Review**: Convert student-submitted PDF assignments into images for easier online review and annotation. This workflow starts when a PDF is uploaded to a Dropbox folder, converts the PDF to images using PDF-app.net, and then stores the images in a specific folder on Dropbox for access by educators.
