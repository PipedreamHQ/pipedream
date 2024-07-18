# Overview

DocuMerge API provides powerful tools for document merging, enabling users to automate the creation of personalized documents from templates. By combining data from various sources with predefined templates, it facilitates the generation of customized contracts, invoices, reports, and more, streamlining workflows and improving productivity. On Pipedream, you can connect DocuMerge with other apps to leverage data dynamically and automate document creation processes based on specific triggers and actions.

# Example Use Cases

- **Automate Monthly Invoicing**: Automatically generate and send personalized invoices to customers at the end of each month. Using DocuMerge with the Stripe API on Pipedream, you can trigger a workflow whenever a payment is received. Extract customer data from Stripe, merge it into an invoice template using DocuMerge, and send the finalized invoice via email using the SendGrid app.

- **Contract Generation for New Clients**: Streamline your onboarding process by automatically creating personalized contracts when a new client is added to your CRM system. Set up a Pipedream workflow that triggers when a new client record is created in Salesforce. Fetch client details, use DocuMerge to fill a contract template, and then send the document directly to the client for electronic signature through the DocuSign app.

- **Custom Reports Delivery**: Generate and distribute custom reports by merging data from your database with a report template on a scheduled basis. Configure a Pipedream workflow to trigger monthly from a Cron Scheduler. Pull the necessary data from a SQL database, merge it with a report template in DocuMerge, and then distribute the final report via email or upload it to a shared Google Drive folder using the Google Drive app.
