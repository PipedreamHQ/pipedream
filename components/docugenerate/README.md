# Overview

The DocuGenerate API lets you automate document creation and management tasks within Pipedream workflows. With this API, you can create custom documents, populate them with dynamic data, and perform various actions like retrieving, updating, or deleting documents programmatically. Integrating DocuGenerate with Pipedream enables you to connect your document workflows with hundreds of other apps, simplifying processes like contract generation from CRM data, automating report distribution, or even pushing notifications based on document status changes.

# Example Use Cases

- **CRM to Contract Generation**: Trigger a workflow whenever a new deal is closed in your CRM (like Salesforce). Fetch the deal details and use the DocuGenerate API to create a personalized contract, which is then sent to the client for e-signature.

- **Automated Report Creation and Distribution**: Schedule a workflow to run weekly, gathering data from tools such as Google Sheets or a database. Use this data to create a tailored report via DocuGenerate and subsequently email the report to a list of stakeholders using an email service like SendGrid.

- **Dynamic Invoice Creation from E-Commerce Platforms**: When a new order is placed on an e-commerce platform (like Shopify), trigger a Pipedream workflow that creates an invoice through the DocuGenerate API. Then, archive the invoice in cloud storage like Google Drive and update the order status within the e-commerce platform.

# Getting Started

## Obtaining Your API Key

1. Sign up for a [DocuGenerate](https://www.docugenerate.com/) account
2. Get your unique API Key from the Developers tab in the [Settings](https://app.docugenerate.com/settings/developers) page
3. Copy the API Key for use in Pipedream

## Connecting to Pipedream

1. In your Pipedream workflow, add a DocuGenerate action
2. When prompted for authentication, paste your API Key
3. Test the connection by using the "List Templates" action

## Generating Your First Document

Use the "Generate Document" action with:
- **Template**: Select from your available templates
- **Data**: Provide JSON data matching your template merge tags (e.g., `{ "name": "John Doe" }`)
- **Name**: Set a custom document name (optional)
- **Format**: Choose your desired output format (optional)
