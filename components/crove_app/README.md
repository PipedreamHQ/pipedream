# Overview

The Crove API provides a powerful platform for automating the creation and management of personalized documents. With Crove, you can transform templates into ready-to-use documents filled with your data. In Pipedream, you can leverage this API to build workflows that respond to various triggers and integrate with other services to streamline business processes, such as generating contracts from CRM data, creating personalized PDFs from form submissions, or even sending customized invoices upon payment confirmation.

# Example Use Cases

- **Generate Custom Contracts from CRM Deals**: When a new deal reaches a certain stage in a CRM like HubSpot or Salesforce, trigger a Pipedream workflow that uses Crove to generate a customized contract. This document can then be sent back into the CRM, emailed to the client, or stored in a cloud service like Google Drive.

- **Automate Onboarding Documents with Typeform Submissions**: Set up a workflow that kicks off when a new Typeform submission is received. Use the submitted data to populate onboarding documents through Crove, and then email the documents directly to the new employee or upload them to a service like Dropbox.

- **Create Personalized Invoices with Stripe Webhooks**: After receiving a payment success webhook from Stripe, use Crove's API in a Pipedream workflow to generate a personalized invoice based on the customer's details and transaction information. The invoice can then be emailed to the customer or logged in an accounting app like QuickBooks.
