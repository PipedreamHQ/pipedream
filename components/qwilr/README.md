# Overview

The Qwilr API offers a programmable way to generate and manage proposals, quotes, and web-based documents. Using Pipedream, you can automate document lifecycle events, streamline proposal approvals, and synchronize Qwilr data with CRM platforms or other databases. Leverage the power of serverless workflows to react to new document events, update records in real-time, and create notifications or follow-ups that enhance collaboration and efficiency.

# Example Use Cases

- **Automated Proposal Follow-Up**: When a Qwilr document is viewed by a client, trigger a workflow that logs this event in a CRM like Salesforce, and automatically sends a follow-up email to the client using a service like SendGrid, asking if they have any questions or require further assistance.

- **New Document Alert & Assignment**: On creation of a new Qwilr document, trigger a Pipedream workflow that posts a notification in a Slack channel and assigns a team member to review the document. Use Slack's API to mention the assigned team member directly, ensuring the immediate attention and handling of the new document.

- **Document Analytics to Dashboard**: Capture Qwilr document interaction analytics, such as views and time spent on the document, and push this data to a business intelligence tool like Google Sheets or a data visualization app like Tableau. Use this data to refine sales strategies and monitor engagement trends.
