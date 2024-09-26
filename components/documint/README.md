# Overview

The Documint API enables automated document generation with dynamic content, offering a robust solution for creating tailored PDFs or other document types from templates. With this API, you can insert custom data into predefined fields, generate documents on the fly, and streamline the creation of invoices, contracts, reports, and more. Integrating Documint with Pipedream allows for the orchestration of serverless workflows that react to various triggers, like webhooks, emails, or schedule timings, to produce documents as part of a larger automated process.

# Example Use Cases

- **Generate Invoices on New Stripe Charges**  
  Automatically create and send customized invoices when new charges are detected in Stripe. Use Stripe's trigger to start the Pipedream workflow, fetch charge details, and pass them to Documint to generate a PDF invoice, which can then be emailed to the customer.

- **Create Reports from Google Sheets Data**  
  Set up a workflow that gets triggered on a schedule to fetch data from a specific Google Sheets document. This data is used to populate a report template in Documint, generating a daily, weekly, or monthly report, which can be stored in Google Drive or sent out via email directly to stakeholders.

- **Contract Generation from Salesforce Opportunities**  
  Kick off document creation when a new opportunity reaches a certain stage in Salesforce. The workflow grabs the relevant data from the opportunity, uses it to fill out a contract template in Documint, and then uploads the finalized contract to the Salesforce record to be available for all parties involved.
