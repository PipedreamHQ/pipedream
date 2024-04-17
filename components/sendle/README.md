# Overview

The Sendle API is a shipping and logistics interface designed for seamless e-commerce integration. With it, you can automate the booking and tracking of deliveries, manage shipping rates, and handle parcel pickups directly within your e-commerce platform. Leveraging Pipedream's serverless platform allows you to connect Sendle's capabilities with various other services to streamline your shipping operations, improve customer service, and optimize logistics without writing extensive code.

# Example Use Cases

- **Automated Order Fulfillment Workflow**: When a new order is placed in Shopify, trigger a workflow in Pipedream that creates a shipping order with Sendle. After the shipping label is created, update the Shopify order with the tracking details and send a notification to the customer via email or SMS.

- **Scheduled Shipping Rate Sync**: Use Pipedream's scheduled tasks to fetch current shipping rates from Sendle daily and update these rates in a Google Sheet. This can be used for quick reference by customer support teams or for syncing rates with custom pricing tools used in your e-commerce storefront.

- **Customer Service Integration**: Whenever a delivery status in Sendle updates to "Delivered," trigger a Pipedream workflow that logs this event in a CRM like HubSpot. Follow this by automatically sending a follow-up satisfaction survey via Typeform to the customer, ensuring timely feedback on their delivery experience.
