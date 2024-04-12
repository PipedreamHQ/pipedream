# Overview

The Plisio API enables automated cryptocurrency payment processing, offering capabilities for creating and managing invoices, tracking transactions, and handling crypto payments. With Pipedream, you can leverage the Plisio API to create serverless workflows that integrate with numerous other apps and services. This empowers developers to automate payment flows, synchronize transaction data across platforms, and trigger actions based on payment statuses, without writing complex server-side code.

# Example Use Cases

- **Automated Invoice Creation and Email Delivery**: When a new order is placed on your e-commerce platform, use Pipedream to automatically create a cryptocurrency invoice via the Plisio API and send it to the customer's email using a service like SendGrid or Mailgun.

- **Transaction Status Monitoring and Database Update**: Monitor your Plisio wallet transactions. When a payment status changes to confirmed, trigger a Pipedream workflow that updates the order status in a connected database like Airtable or Google Sheets, keeping your records synchronized.

- **Real-time Notifications on Payment Status**: Set up a Pipedream workflow to listen for webhook events from Plisio. When a transaction is completed, send real-time notifications to your Slack channel or Discord server to keep your team informed about successful payments.
