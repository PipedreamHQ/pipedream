# Overview

The DocuGenerate API lets you automate document creation and management tasks within Pipedream workflows. With this API, you can create custom documents, populate them with dynamic data, and perform various actions like retrieving, updating, or deleting documents programmatically. Integrating DocuGenerate with Pipedream enables you to connect your document workflows with hundreds of other apps, simplifying processes like contract generation from CRM data, automating report distribution, or even pushing notifications based on document status changes.

# Example Use Cases

- **CRM to Contract Generation**: Trigger a workflow whenever a new deal is closed in your CRM (like Salesforce). Fetch the deal details and use the DocuGenerate API to create a personalized contract, which is then sent to the client for e-signature.

- **Automated Report Creation and Distribution**: Schedule a workflow to run weekly, gathering data from tools such as Google Sheets or a database. Use this data to create a tailored report via DocuGenerate and subsequently email the report to a list of stakeholders using an email service like SendGrid.

- **Dynamic Invoice Creation from E-Commerce Platforms**: When a new order is placed on an e-commerce platform (like Shopify), trigger a Pipedream workflow that creates an invoice through the DocuGenerate API. Then, archive the invoice in cloud storage like Google Drive and update the order status within the e-commerce platform.
