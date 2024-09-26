# Overview

The Templated API allows users to generate custom documents based on predefined templates. It's a powerful tool when you need to create consistent documents or reports with variable data. In Pipedream, you can seamlessly integrate Templated with other services to automate document creation. Combine data from various sources, trigger document generation, and carry out follow-up actions like emailing the document or saving it to cloud storage.

# Example Use Cases

- **Automated Invoice Generation**: Trigger an invoice creation in Templated whenever a new sale is recorded in Stripe. Pipedream listens for Stripe sale events, then uses Templated to populate an invoice template with sale details, and finally emails the invoice to the customer.

- **Dynamic Report Creation for CRM Updates**: When a sales opportunity status updates in Salesforce, Pipedream kicks off a workflow that sends data to Templated to generate a custom report. This report is then automatically uploaded to Google Drive and shared with relevant team members.

- **Customized Email Campaigns**: Use Pipedream to watch for subscriber sign-ups via a Typeform. Upon a new entry, Pipedream sends subscriber data to Templated to create personalized welcome emails. These customized emails are then sent out via SendGrid to enhance user engagement.
