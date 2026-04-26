# Overview

UniRate provides real-time and historical exchange rates for 170+ fiat and crypto currencies, plus VAT rates for 50+ countries, through a simple REST API. In Pipedream, you can use UniRate to convert amounts between currencies, pull the latest rates on a schedule, and trigger workflows on rate updates — useful for invoicing, multi-currency pricing, finance dashboards, and any automation that reacts to FX movements.

# Example Use Cases

- **Multi-currency invoicing**: When a Stripe invoice is finalized, convert the amount to the customer's preferred currency with UniRate and append the converted value to the invoice record in your CRM.

- **Scheduled rate snapshots**: Use a Pipedream schedule trigger to fetch rates from UniRate every hour and append the snapshot to a Google Sheet or database for historical reporting.

- **FX-change alerts**: Poll UniRate on a timer and emit a new event whenever the rate has moved, then route the event to Slack, email, or a webhook so stakeholders are notified in real time.
