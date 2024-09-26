# Overview

The SelectPdf API on Pipedream allows you to tap into the utility of SelectPdf's features directly within automated workflows. Primarily, this API provides the capability to convert HTML to PDF, generate PDFs from URLs, and manipulate existing PDFs. By integrating SelectPdf API with Pipedream, you can automate document generation, customize PDFs on-the-fly, and streamline the distribution of these documents across various platforms.

# Example Use Cases

- **HTML to PDF Conversion Automation**: Automatically convert HTML documents to PDF format whenever a new document is added to a cloud storage service like Google Drive or Dropbox. The workflow can be triggered by a new file event, process the HTML content, and use SelectPdf to create a PDF that can be stored back to the cloud or sent via email.

- **Dynamic Report Generation**: Generate custom PDF reports from template URLs when a specific event occurs, such as the closure of a sales deal in a CRM like Salesforce. The workflow listens for a trigger from the CRM, pulls in dynamic data to populate the report template, converts it via SelectPdf, and then emails the report to stakeholders.

- **PDF Manipulation after User Actions**: When a user fills out a form in Typeform, trigger a Pipedream workflow to retrieve the submission, use SelectPdf to merge it with a pre-existing PDF document as a new page or section, and then automatically upload the modified PDF to a service like Box or send it for e-signature using DocuSign.
