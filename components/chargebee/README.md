# Overview

The Chargebee API provides a suite of powerful endpoints that facilitate automation around subscription billing, invoicing, and customer management. By leveraging this API on Pipedream, you can build complex, event-driven workflows that react to subscription changes, automate billing operations, sync customer data across platforms, and trigger personalized communication, all without managing servers.

# Example Use Cases

- **Automated Dunning Management**: Set up a workflow to monitor for failed payments. When a payment fails, trigger a sequence of emails to the customer with updated payment links, escalating to account suspension if the user does not update their payment method within a given timeframe.

- **Subscription Lifecycle Events**: Create a workflow that listens for subscription lifecycle events such as sign-ups, upgrades, and renewals. As events occur, sync this data with a CRM like Salesforce, log it to Google Sheets for reporting, or kick off a custom onboarding process using Slack notifications.

- **Real-Time Analytics Sync**: Configure a workflow to capture real-time data on successful transactions. Aggregate this payment data and push it to a data warehouse such as Snowflake or BigQuery, where you can join it with other datasets and perform in-depth analytics.
