# Overview

Stadium is a global recognition, gifting, and branded swag platform. Use the Stadium API to embed gift, rewards, and branded swag capabilities into your own applications.

With Stadium's Pipedream integration, you can:

- Manage stores and browse product catalogs
- Place and checkout orders programmatically
- Send points and rewards to recipients
- Create and monitor automation orders
- Track order shipment status

## Limitations

- Stadium's API is available only to customers on Business and Enterprise packages.
- Access tokens are valid for 24 hours and must be refreshed.
- Automation orders may take up to 30 minutes to process.

# Example Use Cases

1. **Automated Employee Rewards** — Trigger Stadium point sends when milestones are reached in your HR system.
2. **E-commerce Integration** — Automatically place Stadium orders when customers make purchases on your platform.
3. **Event-Driven Gifting** — Send branded swag to attendees after event registration via webhook.
4. **Order Tracking** — Monitor shipment status and notify recipients when their gifts are on the way.
5. **Catalog Sync** — Keep your product catalog in sync with Stadium's latest offerings.

# Getting Started

## Creating a Stadium Account

1. Sign up for a free Stadium account at [bystadium.com](https://www.bystadium.com/).
2. Create a Stadium Shop and curate your product catalog.
3. Set up your funding source (wallet funds for order payments).
4. Contact [engineering@bystadium.com](mailto:engineering@bystadium.com) to receive API credentials.

## Connecting to Pipedream

1. In your Pipedream workflow, search for the **Stadium** app.
2. Click **Connect Stadium** and enter your Client ID and Client Secret.
3. Pipedream will handle token generation and renewal automatically.

## Sandbox Environment

For testing, Stadium provides a sandbox environment at `https://api.preprod.bystadium.com`. Contact [engineering@bystadium.com](mailto:engineering@bystadium.com) for sandbox credentials.

# Troubleshooting

## Authentication Errors

If you receive a `401 Unauthorized` error, verify that:
- Your Client ID and Client Secret are correct.
- Your account is on a Business or Enterprise plan.
- Your access token has not expired (tokens are valid for 24 hours).

## Order Errors

- `422` errors typically indicate invalid request data. Check that store numbers, product IDs, and addresses are correctly formatted.
- `404` errors mean the specified resource (order, store, automation) was not found.

## Automation Orders

Automation orders may take up to 30 minutes to process. Use the **Check Automation Order Status** action to monitor progress.
