# Overview

The Stripe API is a powerful toolset for handling online payment processing. With it, you can create and manage transactions, subscriptions, and customers, as well as handle refunds, validate coupons, and much more. Integrated into Pipedream, the Stripe API enables you to craft customized serverless workflows that connect your payment processing system with other apps and services to automate your business processes, react to events in real-time, and streamline your revenue operations.

# Example Use Cases

- **Automated Receipt Delivery**: Trigger a Pipedream workflow whenever a new charge is successful on Stripe. The workflow could then generate an invoice using Stripe’s API, and automatically send this receipt to the customer via email using the SendGrid app on Pipedream.

- **Real-Time Fraud Alerting**: Set up a workflow on Pipedream that listens for Stripe charge events. It can analyze transaction details in real-time and flag potentially fraudulent activities. Connect with the Slack app to send instant alerts to a channel so your team can take immediate action.

- **Subscription Management Automation**: Create a Pipedream workflow that triggers when a subscription is updated in Stripe. The workflow can sync the subscription changes to a database like Airtable or Google Sheets, and notify your customer support team via the Twilio app with SMS updates, ensuring that all teams have the most up-to-date information.
