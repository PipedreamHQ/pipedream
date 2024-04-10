# Overview

Amplifier, known in this context as NOWPayments, enables businesses to accept crypto payments. Within Pipedream, you can leverage the Amplifier API to automate payment processing, reconcile transactions, and manage notifications related to crypto payments. By creating workflows on Pipedream, users can connect the Amplifier API with various other services to streamline operations, such as updating accounting records, sending confirmation emails, or integrating with e-commerce platforms.

## Example Amplifier Workflows on Pipedream

1. **Crypto Payment Confirmation and Receipt Generation**: After a payment is detected by the Amplifier API, trigger a Pipedream workflow to send a customized email receipt to the customer using the SendGrid app, and log the transaction details in a Google Sheets spreadsheet for record-keeping.

2. **Real-Time Sales Dashboard Update**: Use the Amplifier API to trigger a workflow whenever a new crypto payment is processed. The workflow updates a real-time dashboard built with a service like Geckoboard, reflecting the latest sales data for quick analysis and decision-making.

3. **E-Commerce Integration for Order Fulfillment**: On receiving a successful payment confirmation from Amplifier, trigger an automated workflow that updates the order status in a Shopify store and alerts the fulfillment team via a Slack message to ship the product, ensuring smooth operations from payment to delivery.
