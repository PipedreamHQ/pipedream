# Overview

The Cheddar API provides developers with the ability to manage subscription billing and track customer usage data. In Pipedream, you can leverage the Cheddar API to automate billing operations, synchronize customer data across platforms, and respond to events like payment successes or failures. Use HTTP requests to integrate Cheddar's features into your Pipedream workflows, seamlessly connecting with other apps available on Pipedream's platform.

# Example Use Cases

- **Automate Customer Invoicing**: Set up a workflow that triggers monthly to generate invoices for customers with active subscriptions. Integrate with the Cheddar API to fetch subscription details and usage, create invoices, and send them out via email using an email service like SendGrid in Pipedream.

- **Monitor Payment Failures**: Build a workflow that listens for payment failure webhooks from Cheddar. When a payment fails, you can automatically reach out to the customer with a reminder via Twilio's SMS service, or update your CRM with the payment issue for follow-up.

- **Sync New Subscribers to a Mailing List**: When a new customer subscribes, trigger a workflow that captures the event via Cheddar's webhook, extracts the subscriber's information, and adds them to a mailing list in Mailchimp for future marketing campaigns.
