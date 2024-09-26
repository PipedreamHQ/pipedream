# Overview

The neetoinvoice API facilitates the creation and management of invoices, allowing users to seamlessly generate, send, and track invoices directly through their API. Integrating neetoinvoice with Pipedream opens up a realm of possibilities for automating your invoice-related workflows. With Pipedream, you can connect neetoinvoice to a multitude of apps to create custom, serverless workflows that can handle events like invoice creation, payment updates, and sending reminders, all managed with a user-friendly interface.

# Example Use Cases

- **Create Invoices on New Orders**: Automate the creation of invoices in neetoinvoice when new orders are placed on an e-commerce platform like Shopify. When Pipedream detects a new order event, it can trigger a workflow that generates a corresponding invoice through neetoinvoice's API.

- **Update CRM on Invoice Payment**: Keep your CRM, such as Salesforce, up-to-date by pushing payment confirmation details whenever an invoice is paid. Set up a Pipedream workflow that listens for the payment confirmation webhook from neetoinvoice and then updates the relevant contact or account record in Salesforce.

- **Send Payment Reminders via Email or SMS**: Implement a workflow that periodically checks for overdue invoices using neetoinvoice API and then uses SendGrid or Twilio to send out payment reminders. With Pipedream's scheduled tasks, you can automate this process to run at regular intervals, ensuring timely reminders are sent without manual intervention.
