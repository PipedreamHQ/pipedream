# Overview

The BTCPay Server API provides a robust interface for automating payment processing, managing invoices, and overseeing stores within a BTCPay Server instance. Leveraging Pipedream, you can build powerful serverless workflows that react to events in BTCPay Server, such as new payments or invoice statuses, and integrate with countless other services through Pipedream's platform.

# Example Use Cases

- **Invoice Status Change Notifications**: When an invoice status changes in BTCPay Server, you can set up a workflow in Pipedream to send a notification to a Slack channel, inform your team, or update a record in a Google Sheet, keeping all stakeholders in the loop about payment statuses in real-time.

- **Automate Refund Processing**: If a payment is made over the expected amount, create a Pipedream workflow that triggers a refund process. This could connect to BTCPay Server to calculate the excess and then issue a refund via the original payment method or notify an admin to handle the refund manually.

- **Sync Payments to Accounting Software**: After receiving a payment, a Pipedream workflow can automatically log this transaction in your accounting software, such as QuickBooks or Xero. This automation ensures that your financial records are always up-to-date without manual data entry.
