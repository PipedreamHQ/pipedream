# Overview

The Twilio SendGrid API opens up a world of possibilities for email automation, enabling you to send emails efficiently and track their performance. With this API, you can programmatically create and send personalized email campaigns, manage contacts, and parse inbound emails for data extraction. When you harness the power of Pipedream, you can connect SendGrid to 3,000+ other apps to automate workflows, such as triggering email notifications based on specific actions, syncing email stats with your analytics, or handling incoming emails to create tasks or tickets.

# Example Use Cases

- **Automated Customer Support Tickets**: When a customer sends an email to your support address, SendGrid's Inbound Parse Webhook can catch it. Pipedream can then take that email, extract the relevant info, and automatically create a ticket in your customer support platform, such as Zendesk.

- **Email Campaign Stats to Google Sheets**: After sending an email campaign through SendGrid, you may want to analyze the performance data. Pipedream can automatically fetch the stats, like opens, clicks, and bounces, and log them into a Google Sheet for easy tracking and visualization.

- **E-commerce Order Confirmation and Follow-up**: When a new order is received in an e-commerce platform like Shopify, you can use Pipedream to trigger an order confirmation email via SendGrid. After a set period, you can follow up with another email asking for feedback or offering a discount on future purchases.

# Getting Started

First, open the SendGrid console and log in.

Then open the [Integration Guide](https://app.sendgrid.com/guide/integrate) and select the **Web API** option.

![Open the Twilio SendGrid Integration Guide to begin the process of creating an API key to connect with Pipedream](https://res.cloudinary.com/pipedreamin/image/upload/v1715176223/marketplace/apps/sendgrid/CleanShot_2024-05-07_at_15.17.56_2x_zhynua.png)

Then choose any language from the next menu. Choose any programming language; this selection only affects the example code shown. The key step is obtaining the API key.

After picking a language, you'll be prompted to generate an API key, we recommend naming it `Pipedream` for easy identification.

![Name the API key "pipedream" and then after clicking the Generate button, copy the API key and paste it into Pipedream](https://res.cloudinary.com/pipedreamin/image/upload/v1715176222/marketplace/apps/sendgrid/CleanShot_2024-05-07_at_15.19.44_2x_hcduuf.png)

After creating the API key, copy it and paste it into the appropriate configuration field in a Pipedream SendGrid connected account, either through a Pipedream action/trigger or through the Connected Accounts section of the dashboard.

You can skip the remaining steps of the Integration guide that test your API key, as these are not necessary for the integration with Pipedream.

# Troubleshooting

SendGrid uses standard HTTP status codes to help troubleshoot issues.

If a SendGrid API call fails, Pipedream will show the error code which you can match with below:

## 400 - Bad Request

This error is shown when the request is missing data or is malformed. An example is a malformed email address; SendGrid won't accept invalid email addresses to deliver mail.

## 401 - Unauthorized

This means that your SendGrid API key connected to Pipedream is invalid or is missing from the request.

Ensure the API key is copied correctly from your SendGrid console and included properly as an `Authorization` header in the format `Bearer ${your token here}`.

## 403 - Sender email isn't verified

This error occurs when you attempt to use an unverified sender email address under your account. To resolve this error, use the correct email address or verify the email address. See the [verification requirements here](https://docs.sendgrid.com/for-developers/sending-email/sender-identity/).

## 406 - Missing Accept header

Make sure to pass `Accept: application/json` in the headers of your HTTP request in order for SendGrid to process your request correctly.

## 429 - Rate Limit

This error is thrown when you're sending too many API requests in a short window. The `X-RateLimit-Remaining` and `X-RateLimit-Reset` headers in the response give you the amount of requests remaining in the current rate limit window.

You can use [Concurrency and Throttling](https://pipedream.com/docs/workflows/concurrency-and-throttling) in your workflow to throttle how quickly your workflow processes new events.

## 500 - Internal Server Error

This means that SendGrid is having issues processing requests; check their [status page](https://status.sendgrid.com/) for updates on the service. For these issues, contact SendGrid directly.
