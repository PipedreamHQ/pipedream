# Overview

Baserow is an open-source no-code database tool that lets users create databases without technical expertise. With its API, you can read, update, create, and delete database entries programmatically. In Pipedream, you can leverage this API to build powerful, serverless workflows that automate data operations in Baserow tables, sync data between apps, and more. Baserow's API becomes particularly potent when integrated with other apps available on Pipedream to facilitate data flow and business processes seamlessly.

# Example Use Cases

- **Automated CRM Updates**: When a new lead submits a form on your website, use Baserow to store the lead data. Trigger a Pipedream workflow using a webhook that adds the new lead to a Baserow table. Then, enrich the lead data with Clearbit, and update the respective entry in Baserow with additional insights.

- **Issue Tracking Integration**: Sync issues from a GitHub repository to a Baserow project management table. Each time an issue is created or updated in GitHub, a Pipedream workflow triggers, capturing the event and reflecting the changes in Baserow, ensuring the project's data is always current.

- **Order Processing Automation**: Connect Baserow with Stripe via Pipedream. Whenever a new order is placed in Stripe, trigger a Pipedream workflow that creates or updates the order record in a Baserow table. Add conditional logic to check the stock levels from a Baserow inventory table and send an automated restock request if needed.
