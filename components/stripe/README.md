# Overview

The Stripe API is a powerful tool for managing online payments, subscriptions, and invoices. With Pipedream, you can leverage this API to automate payment processing, monitor transactions, and sync billing data with other services. Pipedream's no-code platform allows for quick integration and creation of serverless workflows that react to Stripe events in real-time. For instance, you might automatically update customer records, send personalized emails after successful payments, or escalate failed transactions to your support team.


# Getting Started

To connect your Stripe account to Pipedream, you'll need to generate a new Stripe API key and save it in Pipedream.

1. Open the [Stripe API keys dashboard](https://dashboard.stripe.com/apikeys)

2. Create a new Restricted Key 

3. Connect your Restricted API key

Once your Restricted API key is created, copy and paste it into Pipedream, and click *Save*

That's it, now you're able to use your Stripe API key within your Pipedream workflows with no-code actions or with Node.js/Python.

# Example Use Cases

- **Customer Subscription Lifecycle Management**: Create a workflow that triggers when a new customer subscribes to a service. The workflow can update a CRM like Salesforce with the new subscription details, send a welcome email via SendGrid, and create a task in Asana for the onboarding team.

- **Real-Time Fraud Alerting System**: Set up a Pipedream workflow that listens for Stripe events indicating possible fraudulent activity, such as multiple declined payments. When detected, the workflow can immediately send alerts through Slack to your risk management team and log the incident in a Google Sheet for review.

- **Monthly Financial Reporting**: Develop a scheduled workflow that runs at the end of each month. It can fetch transaction data from Stripe, aggregate sales and refunds, calculate net revenue, and then compile and send a report to stakeholders via email or post it to a private report dashboard like Tableau.

# Troubleshooting

Stripe's API uses standard HTTP status codes to describe errors.

## 200 - OK

The request was received and everything worked as expected.

## 400 - Bad Request

The request is missing data, or has malformed data. Double check that your payload has the required arguments and it's properly formatted.

## 401 - Unauthorized

The request isn't authorized to perform the action. Double check that the restricted key you created for Pipedream has access to the resource you're attempting to use.

You can also edit existing keys within your [Stripe API key dashboard](https://dashboard.stripe.com/apikeys), which is more convenient than creating a new key.

## 404 - Not found

The resource isn't available. This usually means that the ID to the resource like the customer, subscription or transaction, etc. is incorrect, or is missing from the URL.

## 409 - Conflict

This request conflicts with another. This usually is due to the same idempotency key being used on another request. You may need to reduce the [concurrency and throttle the workflow](https://pipedream.com/docs/workflows/concurrency-and-throttling) to a single worker to prevent race conditions.

## 429 - Rate limit reached

You've reached the API rate limit, you'll need to reduce how frequently you're sending Stripe API requests with that key. Stripe allows 100 read requests and 100 write requests per second.

## 5xx - Server error

Something went wrong on Stripe's end. Check the [Stripe status page](https://status.stripe.com/) for more details.
