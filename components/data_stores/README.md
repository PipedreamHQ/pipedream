# Overview

Data Stores are a key-value store that allow you to persist state and share data across workflows. You can perform CRUD operations, enabling dynamic data management within your serverless architecture. Use it to save results from API calls, user inputs, or interim data; then read, update, or enrich this data in subsequent steps or workflows. Data Stores simplify stateful logic and cross-workflow communication, making them ideal for tracking process statuses, aggregating metrics, or serving as a simple configuration store.

# Example Use Cases

- **User Activity Dashboard**: Aggregate event data from various sources like webhooks, timestamp them, and store in a Data Store. Then, use this data to power a real-time dashboard that displays user activities across your app. Connect with Google Sheets to periodically sync and create historical reports.

- **Inventory Management System**: Monitor stock levels by writing inventory changes to a Data Store whenever sales or new stock events occur. Create workflows that trigger alerts when items are low in stock or auto-generate purchase orders to suppliers by integrating with an email service like SendGrid.

- **Feature Flag Toggle**: Use a Data Store to manage feature flags for your application. Update the flags in real-time through Pipedream's API and have your app query the Data Store to toggle features on or off without deploying new code. Enhance it by connecting with Slack to notify your team when features are toggled.
