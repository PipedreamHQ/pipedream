# Overview

ERPNext is an open-source enterprise resource planning (ERP) software that integrates core business functions like accounting, inventory, sales, purchase, and HR management into a single system. With the ERPNext API, you can automate these functions by triggering actions in ERPNext or syncing data with other systems. Pipedream can be a powerful partner here, as it allows you to set up complex integrations and workflows without the need for a dedicated backend. By using Pipedream, you can connect ERPNext with numerous other apps to streamline processes, react to events in real-time, and automate data transfers.

# Example Use Cases

- **Invoice Sync Workflow**: When a new sales invoice is created in ERPNext, a Pipedream workflow is triggered, which captures the invoice details and synchronizes them with a cloud accounting app like QuickBooks. This ensures financial records are updated across systems without manual data entry.

- **Inventory Management Automation**: Set up a Pipedream workflow that monitors stock levels in ERPNext. When stock for a particular item falls below a threshold, the workflow automatically reorders the item from the supplier via an integrated supplier management system or sends a notification to the purchasing department using a communication platform like Slack.

- **New Customer Onboarding**: When a new customer is added to ERPNext, a Pipedream workflow is kicked off that sends a welcome email using a service like SendGrid, adds the customer to a CRM like Salesforce, and schedules a follow-up task in a project management tool like Asana, ensuring a seamless onboarding process.
